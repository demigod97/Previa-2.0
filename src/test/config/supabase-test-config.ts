/**
 * Supabase Test Configuration for RLS Policy Testing
 * 
 * CRITICAL: RLS (Row Level Security) policies MUST be tested against
 * a real Supabase database, not mocks. This configuration provides
 * connection to a Supabase development branch for integration testing.
 * 
 * Why Real Database for RLS Testing?
 * - RLS policies are enforced at the PostgreSQL level
 * - Mock databases cannot accurately simulate RLS behavior
 * - Security-critical: false positives could expose user data
 * 
 * Setup Instructions:
 * 1. Create a Supabase development branch (if not exists):
 *    supabase branches create dev-testing
 * 
 * 2. Get branch connection details:
 *    supabase branches list
 * 
 * 3. Set environment variables in .env.test.local:
 *    VITE_SUPABASE_TEST_URL=<dev-branch-url>
 *    VITE_SUPABASE_TEST_ANON_KEY=<dev-branch-anon-key>
 *    VITE_SUPABASE_TEST_SERVICE_ROLE_KEY=<dev-branch-service-role-key>
 * 
 * Security Note: Development branch credentials should NEVER be committed
 * to version control. Always use .env.test.local (gitignored).
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

/**
 * Test Database Configuration
 */
export interface TestDatabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

/**
 * Get test database configuration from environment
 * Falls back to cloud credentials if test-specific env vars not set
 */
export function getTestDatabaseConfig(): TestDatabaseConfig {
  // Try test-specific environment variables first
  const testUrl = import.meta.env.VITE_SUPABASE_TEST_URL;
  const testAnonKey = import.meta.env.VITE_SUPABASE_TEST_ANON_KEY;
  const testServiceRoleKey = import.meta.env.VITE_SUPABASE_TEST_SERVICE_ROLE_KEY;

  // Fall back to cloud credentials (from attached file)
  const cloudUrl = import.meta.env.VITE_SUPABASE_URL || 'https://clfdfkkyurghuohjnryy.supabase.co';
  const cloudAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsZmRma2t5dXJnaHVvaGpucnl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODk1NTAsImV4cCI6MjA3NDk2NTU1MH0.8yFQaQOpiRrnaa08dulYiHZCL26mYJoFMWWk1d3K310';
  const cloudServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsZmRma2t5dXJnaHVvaGpucnl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTM4OTU1MCwiZXhwIjoyMDc0OTY1NTUwfQ.O8xOPuoVnV88ahxfxMA9u60wfk9JJzkjzfdgF2XiwE0';

  return {
    url: testUrl || cloudUrl,
    anonKey: testAnonKey || cloudAnonKey,
    serviceRoleKey: testServiceRoleKey || cloudServiceRoleKey
  };
}

/**
 * Create a test Supabase client for RLS testing
 * Uses real database connection with proper RLS enforcement
 * 
 * @param useServiceRole - If true, bypasses RLS (for setup/teardown)
 * @example
 * ```typescript
 * // For RLS testing (enforces policies)
 * const client = createTestSupabaseClient();
 * 
 * // For test data setup (bypasses RLS)
 * const adminClient = createTestSupabaseClient(true);
 * ```
 */
export function createTestSupabaseClient(
  useServiceRole: boolean = false
): SupabaseClient<Database> {
  const config = getTestDatabaseConfig();

  const key = useServiceRole && config.serviceRoleKey
    ? config.serviceRoleKey
    : config.anonKey;

  return createClient<Database>(config.url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

/**
 * Test user credentials for authentication testing
 * These should be created in the test database
 */
export const TEST_USERS = {
  freeUser: {
    email: 'test-free@previa-test.com',
    password: 'test-password-123',
    tier: 'user' as const
  },
  premiumUser: {
    email: 'test-premium@previa-test.com',
    password: 'test-password-456',
    tier: 'premium_user' as const
  }
};

/**
 * Utility to sign in a test user for RLS testing
 * 
 * @example
 * ```typescript
 * const client = createTestSupabaseClient();
 * await signInTestUser(client, 'freeUser');
 * 
 * // Now client has authenticated session with RLS enforced
 * const { data, error } = await client.from('transactions').select('*');
 * ```
 */
export async function signInTestUser(
  client: SupabaseClient<Database>,
  userType: keyof typeof TEST_USERS
) {
  const user = TEST_USERS[userType];

  const { data, error } = await client.auth.signInWithPassword({
    email: user.email,
    password: user.password
  });

  if (error) {
    throw new Error(`Failed to sign in test user: ${error.message}`);
  }

  return data;
}

/**
 * Utility to clean up test data after RLS tests
 * Uses service role to bypass RLS for cleanup
 * 
 * IMPORTANT: Only use in test teardown, never in production
 */
export async function cleanupTestData(tables: string[]) {
  const adminClient = createTestSupabaseClient(true);

  for (const table of tables) {
    // Delete test data (service role bypasses RLS)
    await adminClient.from(table).delete().ilike('user_id', 'test-%');
  }
}

/**
 * Utility to seed test data for RLS testing
 * Uses service role to insert data, then tests with RLS-enforced client
 */
export async function seedTestData<T>(
  table: string,
  data: T[]
): Promise<T[]> {
  const adminClient = createTestSupabaseClient(true);

  const { data: inserted, error } = await adminClient
    .from(table)
    .insert(data)
    .select();

  if (error) {
    throw new Error(`Failed to seed test data: ${error.message}`);
  }

  return inserted as T[];
}

/**
 * Check if test database is available and configured
 * Run this before RLS tests to ensure proper setup
 */
export async function validateTestDatabaseSetup(): Promise<{
  isValid: boolean;
  message: string;
}> {
  try {
    const client = createTestSupabaseClient();

    // Try a simple query to verify connection
    const { error } = await client.from('user_tiers').select('count').limit(1);

    if (error) {
      return {
        isValid: false,
        message: `Database connection failed: ${error.message}`
      };
    }

    // Verify RLS is enabled (should fail without auth)
    const { data: unauthData } = await client
      .from('transactions')
      .select('*')
      .limit(1);

    // If we get data without authentication, RLS might not be enabled
    if (unauthData && unauthData.length > 0) {
      return {
        isValid: false,
        message: 'WARNING: RLS may not be properly configured - unauthenticated query returned data'
      };
    }

    return {
      isValid: true,
      message: 'Test database configured correctly'
    };
  } catch (error) {
    return {
      isValid: false,
      message: `Test database validation failed: ${error}`
    };
  }
}

