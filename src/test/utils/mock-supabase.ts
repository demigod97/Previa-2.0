/**
 * Supabase Mocking Utilities for Testing
 * 
 * Provides mock Supabase client and utilities for testing without
 * hitting the real database in unit tests.
 * 
 * IMPORTANT: For RLS policy testing, use the real Supabase dev branch
 * connection (see supabase-test-config.ts).
 * 
 * These mocks are for UNIT TESTS ONLY.
 */

import { vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Mock Supabase Query Result
 * Simulates the result structure from Supabase queries
 */
export interface MockQueryResult<T = any> {
  data: T | null;
  error: any | null;
  count?: number | null;
  status: number;
  statusText: string;
}

/**
 * Create a successful mock query result
 */
export function createMockSuccess<T>(data: T): MockQueryResult<T> {
  return {
    data,
    error: null,
    status: 200,
    statusText: 'OK'
  };
}

/**
 * Create a failed mock query result
 */
export function createMockError(error: {
  message: string;
  code?: string;
  details?: string;
}): MockQueryResult<null> {
  return {
    data: null,
    error,
    status: 400,
    statusText: 'Bad Request'
  };
}

/**
 * Mock Supabase Query Builder
 * Chainable API similar to real Supabase client
 */
export class MockQueryBuilder<T = any> {
  private mockData: T[] = [];
  private filters: Record<string, any> = {};
  private selectFields = '*';
  private orderByField?: string;
  private orderDirection: 'asc' | 'desc' = 'asc';
  private limitValue?: number;

  constructor(data: T[] = []) {
    this.mockData = data;
  }

  select(fields: string = '*') {
    this.selectFields = fields;
    return this;
  }

  eq(column: string, value: any) {
    this.filters[column] = value;
    return this;
  }

  neq(column: string, value: any) {
    this.filters[`${column}_neq`] = value;
    return this;
  }

  gt(column: string, value: any) {
    this.filters[`${column}_gt`] = value;
    return this;
  }

  gte(column: string, value: any) {
    this.filters[`${column}_gte`] = value;
    return this;
  }

  lt(column: string, value: any) {
    this.filters[`${column}_lt`] = value;
    return this;
  }

  lte(column: string, value: any) {
    this.filters[`${column}_lte`] = value;
    return this;
  }

  order(column: string, options: { ascending?: boolean } = {}) {
    this.orderByField = column;
    this.orderDirection = options.ascending === false ? 'desc' : 'asc';
    return this;
  }

  limit(count: number) {
    this.limitValue = count;
    return this;
  }

  /**
   * Execute the query and return mock results
   */
  async execute(): Promise<MockQueryResult<T[]>> {
    let filteredData = [...this.mockData];

    // Apply filters
    Object.entries(this.filters).forEach(([key, value]) => {
      if (key.endsWith('_neq')) {
        const column = key.replace('_neq', '');
        filteredData = filteredData.filter((item: any) => item[column] !== value);
      } else if (key.endsWith('_gt')) {
        const column = key.replace('_gt', '');
        filteredData = filteredData.filter((item: any) => item[column] > value);
      } else if (key.endsWith('_gte')) {
        const column = key.replace('_gte', '');
        filteredData = filteredData.filter((item: any) => item[column] >= value);
      } else if (key.endsWith('_lt')) {
        const column = key.replace('_lt', '');
        filteredData = filteredData.filter((item: any) => item[column] < value);
      } else if (key.endsWith('_lte')) {
        const column = key.replace('_lte', '');
        filteredData = filteredData.filter((item: any) => item[column] <= value);
      } else {
        filteredData = filteredData.filter((item: any) => item[key] === value);
      }
    });

    // Apply ordering
    if (this.orderByField) {
      filteredData.sort((a: any, b: any) => {
        const aVal = a[this.orderByField!];
        const bVal = b[this.orderByField!];
        
        if (aVal < bVal) return this.orderDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return this.orderDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Apply limit
    if (this.limitValue) {
      filteredData = filteredData.slice(0, this.limitValue);
    }

    return createMockSuccess(filteredData);
  }

  // Alias for execute (Supabase uses both patterns)
  async then(resolve: (result: MockQueryResult<T[]>) => void) {
    const result = await this.execute();
    return resolve(result);
  }
}

/**
 * Create a mock Supabase client for unit testing
 * 
 * @example
 * ```typescript
 * const mockClient = createMockSupabaseClient({
 *   transactions: mockTransactions,
 *   receipts: mockReceipts
 * });
 * 
 * const { data, error } = await mockClient.from('transactions')
 *   .select('*')
 *   .eq('user_id', 'test-user-001');
 * ```
 */
export function createMockSupabaseClient(mockData: Record<string, any[]> = {}) {
  return {
    from: (table: string) => {
      const tableData = mockData[table] || [];
      return new MockQueryBuilder(tableData);
    },
    
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: {
            user: {
              id: 'test-user-001',
              email: 'test@example.com',
              user_metadata: {}
            },
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token'
          }
        },
        error: null
      }),
      
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: {
            id: 'test-user-001',
            email: 'test@example.com',
            user_metadata: {}
          }
        },
        error: null
      }),
      
      signInWithPassword: vi.fn().mockResolvedValue({
        data: {
          user: {
            id: 'test-user-001',
            email: 'test@example.com'
          },
          session: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token'
          }
        },
        error: null
      }),
      
      signOut: vi.fn().mockResolvedValue({ error: null }),
      
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      })
    },
    
    storage: {
      from: (bucket: string) => ({
        upload: vi.fn().mockResolvedValue({
          data: { path: `${bucket}/mock-file-path.pdf` },
          error: null
        }),
        
        download: vi.fn().mockResolvedValue({
          data: new Blob(['mock file content'], { type: 'application/pdf' }),
          error: null
        }),
        
        remove: vi.fn().mockResolvedValue({
          data: null,
          error: null
        }),
        
        getPublicUrl: vi.fn((path: string) => ({
          data: { publicUrl: `https://mock-storage.supabase.co/${bucket}/${path}` }
        }))
      })
    },
    
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnValue({
        unsubscribe: vi.fn()
      })
    })
  } as unknown as SupabaseClient;
}

/**
 * Mock authentication utilities
 */
export const mockAuth = {
  /**
   * Create a mock authenticated user
   */
  createMockUser: (overrides: Partial<any> = {}) => ({
    id: 'test-user-001',
    email: 'test@example.com',
    user_metadata: {},
    app_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00Z',
    ...overrides
  }),

  /**
   * Create a mock session
   */
  createMockSession: (user?: any) => ({
    user: user || mockAuth.createMockUser(),
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_at: Date.now() + 3600000, // 1 hour from now
    expires_in: 3600
  }),

  /**
   * Mock authenticated context
   */
  mockAuthContext: (user?: any) => {
    const mockUser = user || mockAuth.createMockUser();
    const mockSession = mockAuth.createMockSession(mockUser);

    return {
      user: mockUser,
      session: mockSession,
      isAuthenticated: true
    };
  }
};

/**
 * Mock file upload utilities
 */
export const mockFileUpload = {
  /**
   * Create a mock File object for testing
   */
  createMockFile: (
    name: string,
    size: number,
    type: string = 'application/pdf'
  ): File => {
    const content = 'Mock file content'.repeat(Math.ceil(size / 17));
    const blob = new Blob([content.substring(0, size)], { type });
    return new File([blob], name, { type });
  },

  /**
   * Create a mock PDF file
   */
  createMockPDF: (name: string = 'test-statement.pdf', size: number = 245680) =>
    mockFileUpload.createMockFile(name, size, 'application/pdf'),

  /**
   * Create a mock image file
   */
  createMockImage: (name: string = 'test-receipt.jpg', size: number = 156789) =>
    mockFileUpload.createMockFile(name, size, 'image/jpeg'),

  /**
   * Create a mock invalid file (unsupported type)
   */
  createMockInvalidFile: (name: string = 'test.docx', size: number = 50000) =>
    mockFileUpload.createMockFile(name, size, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
};

