import { useState, useEffect } from 'react';
import { getDefaultActivationDate } from '@/lib/dateUtils';

export interface AppConfig {
  automationActivationDate: string; // ISO 8601 format
  // Future config options can be added here
}

interface UseAppConfigReturn {
  config: AppConfig | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch app configuration
 * For MVP, uses hardcoded date. Can be extended to fetch from API later.
 */
export function useAppConfig(): UseAppConfigReturn {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // For MVP, use hardcoded date 5 days from now
        // TODO: Replace with actual API call when backend is ready
        const mockConfig: AppConfig = {
          automationActivationDate: getDefaultActivationDate()
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setConfig(mockConfig);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load configuration');
        // Fallback to default date on error
        setConfig({
          automationActivationDate: getDefaultActivationDate()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading, error };
}
