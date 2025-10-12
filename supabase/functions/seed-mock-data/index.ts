import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

interface SeedMockDataResponse {
  success: boolean;
  message: string;
  accountsCreated?: number;
  transactionsCreated?: number;
  badgesAwarded?: number;
  error?: string;
}

// Australian bank institutions
const AUSTRALIAN_INSTITUTIONS = [
  'Commonwealth Bank',
  'ANZ',
  'Westpac',
  'NAB'
];

// Australian merchants by category
const AUSTRALIAN_MERCHANTS = {
  income: [
    { name: 'Salary - Employer', amountRange: [3000, 8000] },
    { name: 'Freelance Payment', amountRange: [500, 2000] }
  ],
  groceries: [
    { name: 'Woolworths', amountRange: [50, 300] },
    { name: 'Coles', amountRange: [50, 300] },
    { name: 'IGA', amountRange: [30, 200] },
    { name: 'Aldi', amountRange: [40, 250] }
  ],
  fuel: [
    { name: 'BP', amountRange: [40, 120] },
    { name: 'Shell', amountRange: [40, 120] },
    { name: 'Caltex', amountRange: [40, 120] },
    { name: '7-Eleven', amountRange: [35, 100] }
  ],
  utilities: [
    { name: 'AGL Energy', amountRange: [80, 400] },
    { name: 'Origin Energy', amountRange: [80, 400] },
    { name: 'Telstra', amountRange: [60, 200] },
    { name: 'Optus', amountRange: [50, 180] }
  ],
  dining: [
    { name: "McDonald's", amountRange: [15, 50] },
    { name: 'Subway', amountRange: [10, 30] },
    { name: 'Local Cafe', amountRange: [20, 80] },
    { name: 'Pizza Hut', amountRange: [25, 70] }
  ],
  subscriptions: [
    { name: 'Netflix', amountRange: [10, 25] },
    { name: 'Spotify', amountRange: [12, 18] },
    { name: 'Adobe Creative Cloud', amountRange: [30, 50] },
    { name: 'Microsoft 365', amountRange: [10, 30] }
  ]
};

// Rate limiting storage (in-memory, simple approach)
const rateLimitMap = new Map<string, number>();

function checkRateLimit(userId: string): boolean {
  const lastRequest = rateLimitMap.get(userId);
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  if (lastRequest && now - lastRequest < oneHour) {
    return false; // Rate limited
  }

  rateLimitMap.set(userId, now);
  return true; // Allowed
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomAmount(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(monthsAgo: number): string {
  const now = new Date();
  const date = new Date(now);
  date.setMonth(date.getMonth() - monthsAgo);
  
  // Random day within that month
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.floor(Math.random() * daysInMonth) + 1);
  
  return date.toISOString().split('T')[0];
}

function generateAccountNumber(): string {
  const lastFour = Math.floor(1000 + Math.random() * 9000);
  return `****${lastFour}`;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Max-Age': '86400',
      }
    });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      );
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the current user from the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { 
          status: 401, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      );
    }

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { 
          status: 401, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      );
    }

    // Check rate limiting (1 request per hour per user)
    if (!checkRateLimit(user.id)) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please wait before generating more mock data.',
          success: false 
        }),
        { 
          status: 429, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      );
    }

    console.log(`Generating mock data for user: ${user.id}`);

    // Generate 2 Australian bank accounts
    const bankAccounts = [
      {
        user_id: user.id,
        institution: getRandomElement(AUSTRALIAN_INSTITUTIONS),
        account_name: 'Everyday Transaction Account',
        account_number_masked: generateAccountNumber(),
        balance: getRandomAmount(2500, 15000),
        currency: 'AUD',
        created_at: getRandomDate(Math.floor(Math.random() * 6) + 6) + 'T00:00:00Z'
      },
      {
        user_id: user.id,
        institution: getRandomElement(AUSTRALIAN_INSTITUTIONS),
        account_name: 'Business Savings Account',
        account_number_masked: generateAccountNumber(),
        balance: getRandomAmount(2500, 15000),
        currency: 'AUD',
        created_at: getRandomDate(Math.floor(Math.random() * 6) + 6) + 'T00:00:00Z'
      }
    ];

    const { data: createdAccounts, error: accountError } = await supabase
      .from('bank_accounts')
      .insert(bankAccounts)
      .select();

    if (accountError) {
      console.error('Error creating bank accounts:', accountError);
      throw new Error(`Failed to create bank accounts: ${accountError.message}`);
    }

    console.log(`Created ${createdAccounts.length} bank accounts`);

    // Generate 30 transactions (10 per month for 3 months)
    const transactions = [];
    const statuses = ['unreconciled', 'matched', 'approved'];

    for (let month = 0; month < 3; month++) {
      // Salary transactions (1-2 per month)
      for (let i = 0; i < (Math.random() > 0.5 ? 2 : 1); i++) {
        const merchant = getRandomElement(AUSTRALIAN_MERCHANTS.income);
        transactions.push({
          user_id: user.id,
          transaction_date: getRandomDate(month),
          amount: getRandomAmount(merchant.amountRange[0], merchant.amountRange[1]),
          description: merchant.name,
          category: 'Income',
          status: getRandomElement(statuses)
        });
      }

      // Groceries (2-3 per month)
      for (let i = 0; i < getRandomAmount(2, 3); i++) {
        const merchant = getRandomElement(AUSTRALIAN_MERCHANTS.groceries);
        transactions.push({
          user_id: user.id,
          transaction_date: getRandomDate(month),
          amount: -getRandomAmount(merchant.amountRange[0], merchant.amountRange[1]),
          description: merchant.name,
          category: 'Groceries',
          status: getRandomElement(statuses)
        });
      }

      // Fuel (1-2 per month)
      for (let i = 0; i < getRandomAmount(1, 2); i++) {
        const merchant = getRandomElement(AUSTRALIAN_MERCHANTS.fuel);
        transactions.push({
          user_id: user.id,
          transaction_date: getRandomDate(month),
          amount: -getRandomAmount(merchant.amountRange[0], merchant.amountRange[1]),
          description: merchant.name,
          category: 'Fuel',
          status: getRandomElement(statuses)
        });
      }

      // Utilities (1 per month)
      const utilityMerchant = getRandomElement(AUSTRALIAN_MERCHANTS.utilities);
      transactions.push({
        user_id: user.id,
        transaction_date: getRandomDate(month),
        amount: -getRandomAmount(utilityMerchant.amountRange[0], utilityMerchant.amountRange[1]),
        description: utilityMerchant.name,
        category: 'Utilities',
        status: getRandomElement(statuses)
      });

      // Dining (2-3 per month)
      for (let i = 0; i < getRandomAmount(2, 3); i++) {
        const merchant = getRandomElement(AUSTRALIAN_MERCHANTS.dining);
        transactions.push({
          user_id: user.id,
          transaction_date: getRandomDate(month),
          amount: -getRandomAmount(merchant.amountRange[0], merchant.amountRange[1]),
          description: merchant.name,
          category: 'Dining',
          status: getRandomElement(statuses)
        });
      }

      // Subscriptions (1-2 per month)
      for (let i = 0; i < getRandomAmount(1, 2); i++) {
        const merchant = getRandomElement(AUSTRALIAN_MERCHANTS.subscriptions);
        transactions.push({
          user_id: user.id,
          transaction_date: getRandomDate(month),
          amount: -getRandomAmount(merchant.amountRange[0], merchant.amountRange[1]),
          description: merchant.name,
          category: 'Subscriptions',
          status: getRandomElement(statuses)
        });
      }
    }

    // Limit to 30 transactions
    const finalTransactions = transactions.slice(0, 30);

    const { data: createdTransactions, error: transactionError } = await supabase
      .from('transactions')
      .insert(finalTransactions)
      .select();

    if (transactionError) {
      console.error('Error creating transactions:', transactionError);
      throw new Error(`Failed to create transactions: ${transactionError.message}`);
    }

    console.log(`Created ${createdTransactions.length} transactions`);

    // Award "Account Creator" badge
    let badgesAwarded = 0;
    
    // Check if badge exists and user doesn't already have it
    const { data: existingProgress } = await supabase
      .from('user_badge_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('badge_id', 'account-creator')
      .single();

    if (!existingProgress) {
      const { error: badgeError } = await supabase
        .from('user_badge_progress')
        .insert({
          user_id: user.id,
          badge_id: 'account-creator',
          current_progress: 2,
          target_progress: 1,
          progress_metadata: { completed: true }
        });

      if (!badgeError) {
        badgesAwarded++;
        console.log('Awarded "Account Creator" badge');
      }
    }

    // Award "Reconciliation Expert" badge if applicable (100+ transactions)
    if (createdTransactions.length >= 30) {
      const { data: existingReconciliationProgress } = await supabase
        .from('user_badge_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('badge_id', 'reconciliation-expert')
        .single();

      if (!existingReconciliationProgress) {
        const { error: badgeError } = await supabase
          .from('user_badge_progress')
          .insert({
            user_id: user.id,
            badge_id: 'reconciliation-expert',
            current_progress: createdTransactions.length,
            target_progress: 100,
            progress_metadata: { note: 'Initial progress from mock data' }
          });

        if (!badgeError) {
          badgesAwarded++;
          console.log('Awarded "Reconciliation Expert" badge progress');
        }
      }
    }

    // Return success response
    const response: SeedMockDataResponse = {
      success: true,
      message: 'Mock data generated successfully',
      accountsCreated: createdAccounts.length,
      transactionsCreated: createdTransactions.length,
      badgesAwarded
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );

  } catch (error) {
    console.error('Error in seed-mock-data function:', error);
    
    const response: SeedMockDataResponse = {
      success: false,
      message: 'Failed to generate mock data',
      error: error instanceof Error ? error.message : 'Unknown error'
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );
  }
});
