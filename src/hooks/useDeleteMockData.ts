import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for deleting all mock financial data for a user
 * Calls Supabase Edge Function to remove all user-generated mock data
 */
export function useDeleteMockData() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const deleteMockData = async () => {
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
          description: 'Please sign in to delete mock data.',
          variant: 'destructive',
        });
        return;
      }

      // Call Edge Function to delete mock data
      const { data, error } = await supabase.functions.invoke('delete-mock-data', {
        body: {},
      });
      
      if (error) {
        console.error('Mock data deletion error:', error);
        
        // Handle specific error types
        if (error.message?.includes('rate limit')) {
          toast({
            title: 'Too Many Requests',
            description: 'Please wait before deleting more data. Rate limit: 1 request per hour.',
            variant: 'destructive',
          });
          return;
        }

        if (error.message?.includes('Invalid authentication') || error.message?.includes('expired token')) {
          toast({
            title: 'Authentication Error',
            description: 'Your session has expired. Please sign in again.',
            variant: 'destructive',
          });
          return;
        }

        if (error.message?.includes('Function not found') || error.message?.includes('404')) {
          toast({
            title: 'Function Not Found',
            description: 'The delete function is not deployed. Please contact support.',
            variant: 'destructive',
          });
          return;
        }

        // Generic error
        toast({
          title: 'Data Deletion Failed',
          description: error.message || 'Failed to delete mock data. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      // Success
      const totalDeleted = data.deletedCounts ? 
        Object.values(data.deletedCounts).reduce((sum: number, count: number) => sum + count, 0) : 0;

      toast({
        title: '🗑️ Mock Data Deleted!',
        description: `Successfully removed ${totalDeleted} records. All your mock financial data has been cleared.`,
      });

      // Reload the page to reflect the changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);


    } catch (error) {
      console.error('Unexpected error during mock data deletion:', error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          toast({
            title: 'Function Not Found',
            description: 'The delete function is not deployed. Please contact support.',
            variant: 'destructive',
          });
          return;
        }
        
        if (error.message.includes('401')) {
          toast({
            title: 'Authentication Error',
            description: 'Your session has expired. Please sign in again.',
            variant: 'destructive',
          });
          return;
        }
        
        if (error.message.includes('429')) {
          toast({
            title: 'Too Many Requests',
            description: 'Please wait before deleting more data. Rate limit: 1 request per hour.',
            variant: 'destructive',
          });
          return;
        }
        
        if (error.message.includes('500')) {
          toast({
            title: 'Server Error',
            description: 'The server encountered an error. Please try again later.',
            variant: 'destructive',
          });
          return;
        }
      }
      
      toast({
        title: 'Data Deletion Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteMockData,
    isLoading,
  };
}
