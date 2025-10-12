import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for seeding mock financial data for new users
 * Calls Supabase Edge Function to generate realistic Australian financial data
 */
export function useMockDataSeeding() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const seedMockData = async () => {
    // Prevent multiple rapid calls
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to seed mock data.',
          variant: 'destructive',
        });
        return;
      }

      // Call Edge Function to generate mock data
      const { data, error } = await supabase.functions.invoke('seed-mock-data', {
        body: {},
      });

      if (error) {
        console.error('Mock data seeding error:', error);
        
        // Handle rate limiting
        if (error.message?.includes('rate limit')) {
          toast({
            title: 'Too Many Requests',
            description: 'Please wait before generating more mock data. Rate limit: 1 request per hour.',
            variant: 'destructive',
          });
          return;
        }

        // Generic error
        toast({
          title: 'Data Generation Failed',
          description: error.message || 'Failed to generate mock data. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      // Success
      toast({
        title: '✨ Mock Data Generated!',
        description: `Successfully created ${data.accountsCreated || 2} bank accounts and ${data.transactionsCreated || 30} transactions. Explore your new financial data!`,
      });

      // Reload the page to show new data
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error('Unexpected error during mock data seeding:', error);
      toast({
        title: 'Unexpected Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    seedMockData,
    isLoading,
  };
}
