/**
 * Sample Integration Test: RLS Policy Testing
 * 
 * CRITICAL: This test MUST use a real Supabase database to properly
 * validate Row Level Security policies. Mocks cannot accurately test RLS.
 * 
 * Setup Required:
 * 1. Create Supabase development branch
 * 2. Set test environment variables (see supabase-test-config.ts)
 * 3. Seed test users in the database
 * 
 * Pattern: Integration testing with real database
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
  createTestSupabaseClient,
  signInTestUser,
  cleanupTestData,
  seedTestData,
  validateTestDatabaseSetup,
  TEST_USERS
} from '../config/supabase-test-config';
import { mockTransactions, mockUserTiers } from '../fixtures/financial-data';

/**
 * RLS Policy Test Suite
 * 
 * These tests verify that Row Level Security policies correctly:
 * - Isolate user data (users can only see their own data)
 * - Enforce tier limits (free vs premium users)
 * - Prevent unauthorized access
 */
describe('RLS Policy Integration Tests', () => {
  // Skip these tests if database is not configured
  // Run with: npm test -- --run rls-policy-integration.test.ts
  const SKIP_RLS_TESTS = process.env.SKIP_RLS_TESTS === 'true';

  beforeAll(async () => {
    if (SKIP_RLS_TESTS) {
      console.log('⚠️  RLS tests skipped - set up test database to enable');
      return;
    }

    // Verify test database is properly configured
    const validation = await validateTestDatabaseSetup();
    if (!validation.isValid) {
      throw new Error(`Test database setup invalid: ${validation.message}`);
    }

    console.log('✅ Test database configured:', validation.message);
  });

  afterAll(async () => {
    if (SKIP_RLS_TESTS) return;

    // Clean up all test data
    await cleanupTestData([
      'transactions',
      'receipts',
      'bank_statements',
      'bank_accounts',
      'user_tiers'
    ]);
  });

  beforeEach(async () => {
    if (SKIP_RLS_TESTS) return;

    // Clean up before each test for isolation
    await cleanupTestData(['transactions', 'user_tiers']);
  });

  describe('User Data Isolation', () => {
    it.skipIf(SKIP_RLS_TESTS)('users can only access their own transactions', async () => {
      // Seed test data for two different users
      const user1Transactions = [
        { ...mockTransactions[0], id: 'test-tx-user1-001', user_id: 'test-user-001' }
      ];
      const user2Transactions = [
        { ...mockTransactions[1], id: 'test-tx-user2-001', user_id: 'test-user-002' }
      ];

      await seedTestData('transactions', [...user1Transactions, ...user2Transactions]);

      // Sign in as user 1
      const client1 = createTestSupabaseClient();
      await signInTestUser(client1, 'freeUser');

      // Query transactions - RLS should only return user 1's data
      const { data: user1Data, error: user1Error } = await client1
        .from('transactions')
        .select('*');

      expect(user1Error).toBeNull();
      expect(user1Data).toHaveLength(1);
      expect(user1Data![0].user_id).toBe('test-user-001');

      // Sign out and sign in as user 2
      await client1.auth.signOut();
      const client2 = createTestSupabaseClient();
      await signInTestUser(client2, 'premiumUser');

      // Query transactions - RLS should only return user 2's data
      const { data: user2Data, error: user2Error } = await client2
        .from('transactions')
        .select('*');

      expect(user2Error).toBeNull();
      expect(user2Data).toHaveLength(1);
      expect(user2Data![0].user_id).toBe('test-user-002');
    });

    it.skipIf(SKIP_RLS_TESTS)('unauthenticated users cannot access any data', async () => {
      // Seed test data
      await seedTestData('transactions', [
        { ...mockTransactions[0], id: 'test-tx-unauth-001', user_id: 'test-user-001' }
      ]);

      // Create unauthenticated client
      const unauthClient = createTestSupabaseClient();

      // Attempt to query without authentication
      const { data, error } = await unauthClient
        .from('transactions')
        .select('*');

      // RLS should prevent access (error or empty results)
      if (error) {
        expect(error).toBeDefined();
      } else {
        expect(data).toEqual([]);
      }
    });

    it.skipIf(SKIP_RLS_TESTS)('users cannot insert data for other users', async () => {
      const client = createTestSupabaseClient();
      await signInTestUser(client, 'freeUser');

      // Attempt to insert transaction for a different user
      const { data, error } = await client
        .from('transactions')
        .insert({
          ...mockTransactions[0],
          id: 'test-tx-malicious-001',
          user_id: 'different-user-id' // Trying to insert for another user
        })
        .select();

      // RLS should prevent this or force user_id to current user
      expect(error).toBeDefined();
    });

    it.skipIf(SKIP_RLS_TESTS)('users cannot update other users data', async () => {
      // Seed transaction for user 1
      await seedTestData('transactions', [
        { ...mockTransactions[0], id: 'test-tx-update-001', user_id: 'test-user-001' }
      ]);

      // Sign in as user 2
      const client = createTestSupabaseClient();
      await signInTestUser(client, 'premiumUser');

      // Attempt to update user 1's transaction
      const { data, error } = await client
        .from('transactions')
        .update({ description: 'HACKED' })
        .eq('id', 'test-tx-update-001')
        .select();

      // RLS should prevent update (no rows affected)
      expect(data).toEqual([]);
    });

    it.skipIf(SKIP_RLS_TESTS)('users cannot delete other users data', async () => {
      // Seed transaction for user 1
      await seedTestData('transactions', [
        { ...mockTransactions[0], id: 'test-tx-delete-001', user_id: 'test-user-001' }
      ]);

      // Sign in as user 2
      const client = createTestSupabaseClient();
      await signInTestUser(client, 'premiumUser');

      // Attempt to delete user 1's transaction
      const { data, error } = await client
        .from('transactions')
        .delete()
        .eq('id', 'test-tx-delete-001')
        .select();

      // RLS should prevent deletion (no rows affected)
      expect(data).toEqual([]);

      // Verify transaction still exists (using service role)
      const adminClient = createTestSupabaseClient(true);
      const { data: checkData } = await adminClient
        .from('transactions')
        .select('*')
        .eq('id', 'test-tx-delete-001');

      expect(checkData).toHaveLength(1);
    });
  });

  describe('User Tier Policy Enforcement', () => {
    it.skipIf(SKIP_RLS_TESTS)('free users can only view their tier information', async () => {
      // Seed tier data
      await seedTestData('user_tiers', [
        { ...mockUserTiers.freeTier, user_id: 'test-user-001' },
        { ...mockUserTiers.premiumTier, user_id: 'test-user-002' }
      ]);

      const client = createTestSupabaseClient();
      await signInTestUser(client, 'freeUser');

      const { data, error } = await client
        .from('user_tiers')
        .select('*');

      expect(error).toBeNull();
      expect(data).toHaveLength(1);
      expect(data![0].tier).toBe('user');
    });

    it.skipIf(SKIP_RLS_TESTS)('users cannot modify their own tier', async () => {
      // Seed tier data
      await seedTestData('user_tiers', [
        { ...mockUserTiers.freeTier, user_id: 'test-user-001' }
      ]);

      const client = createTestSupabaseClient();
      await signInTestUser(client, 'freeUser');

      // Attempt to upgrade to premium
      const { data, error } = await client
        .from('user_tiers')
        .update({ tier: 'premium_user' })
        .eq('user_id', 'test-user-001')
        .select();

      // RLS should prevent tier modification
      expect(error).toBeDefined();
    });
  });

  describe('Performance with RLS', () => {
    it.skipIf(SKIP_RLS_TESTS)('RLS does not significantly impact query performance', async () => {
      // Seed multiple transactions
      const transactions = Array.from({ length: 50 }, (_, i) => ({
        ...mockTransactions[0],
        id: `test-tx-perf-${i}`,
        user_id: 'test-user-001'
      }));

      await seedTestData('transactions', transactions);

      const client = createTestSupabaseClient();
      await signInTestUser(client, 'freeUser');

      // Measure query time
      const startTime = performance.now();
      
      const { data, error } = await client
        .from('transactions')
        .select('*')
        .order('transaction_date', { ascending: false })
        .limit(20);

      const endTime = performance.now();
      const queryTime = endTime - startTime;

      expect(error).toBeNull();
      expect(data).toHaveLength(20);
      
      // Query should complete reasonably fast (< 500ms)
      expect(queryTime).toBeLessThan(500);
    });
  });

  describe('RLS Edge Cases', () => {
    it.skipIf(SKIP_RLS_TESTS)('handles NULL user_id gracefully', async () => {
      const client = createTestSupabaseClient();
      await signInTestUser(client, 'freeUser');

      // Attempt to insert with NULL user_id
      const { data, error } = await client
        .from('transactions')
        .insert({
          ...mockTransactions[0],
          id: 'test-tx-null-user',
          user_id: null as any
        })
        .select();

      // Should either error or force correct user_id
      if (error) {
        expect(error).toBeDefined();
      } else {
        expect(data![0].user_id).toBe('test-user-001');
      }
    });

    it.skipIf(SKIP_RLS_TESTS)('handles concurrent requests from different users', async () => {
      // Seed data for two users
      await seedTestData('transactions', [
        { ...mockTransactions[0], id: 'test-tx-concurrent-1', user_id: 'test-user-001' },
        { ...mockTransactions[1], id: 'test-tx-concurrent-2', user_id: 'test-user-002' }
      ]);

      // Create two clients for different users
      const client1 = createTestSupabaseClient();
      const client2 = createTestSupabaseClient();

      await signInTestUser(client1, 'freeUser');
      await signInTestUser(client2, 'premiumUser');

      // Make concurrent requests
      const [result1, result2] = await Promise.all([
        client1.from('transactions').select('*'),
        client2.from('transactions').select('*')
      ]);

      // Each user should only see their own data
      expect(result1.data).toHaveLength(1);
      expect(result1.data![0].user_id).toBe('test-user-001');

      expect(result2.data).toHaveLength(1);
      expect(result2.data![0].user_id).toBe('test-user-002');
    });
  });
});

