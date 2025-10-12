/**
 * Feature Status Types - Define the development status of application features
 * 
 * This system allows us to show users which features are available, coming soon,
 * in beta, or disabled while maintaining full UI functionality.
 */

export type FeatureStatus = 
  | 'active'        // Feature is fully functional and available
  | 'coming-soon'   // Feature is in development, UI visible but not functional
  | 'beta'          // Feature is in testing phase, may have limited functionality
  | 'disabled';     // Feature is temporarily disabled

export interface FeatureConfig {
  id: string;
  name: string;
  status: FeatureStatus;
  description?: string;
  expectedRelease?: string;
  betaUsers?: string[];
}

export interface FeatureStatusInfo {
  status: FeatureStatus;
  label: string;
  color: string;
  icon?: string;
  tooltip?: string;
}

/**
 * Feature status configuration with visual indicators
 */
export const FEATURE_STATUS_CONFIG: Record<FeatureStatus, FeatureStatusInfo> = {
  'active': {
    status: 'active',
    label: 'Available',
    color: 'text-green-600',
    icon: '✓',
    tooltip: 'This feature is fully functional'
  },
  'coming-soon': {
    status: 'coming-soon',
    label: 'Coming Soon',
    color: 'text-amber-600',
    icon: '🚧',
    tooltip: 'This feature is in development and will be available soon'
  },
  'beta': {
    status: 'beta',
    label: 'Beta',
    color: 'text-blue-600',
    icon: '🧪',
    tooltip: 'This feature is in beta testing and may have limited functionality'
  },
  'disabled': {
    status: 'disabled',
    label: 'Disabled',
    color: 'text-gray-500',
    icon: '⏸️',
    tooltip: 'This feature is temporarily disabled'
  }
};

/**
 * Application feature definitions
 * 
 * This is where we define the status of each major feature in the app.
 * Update these as features are developed and released.
 */
export const APP_FEATURES: Record<string, FeatureConfig> = {
  // Core Features
  'dashboard': {
    id: 'dashboard',
    name: 'Financial Dashboard',
    status: 'active',
    description: 'Overview of your financial data with charts and insights'
  },
  'transactions': {
    id: 'transactions',
    name: 'Transaction Management',
    status: 'active',
    description: 'View, filter, and manage your financial transactions'
  },
  'reconciliation': {
    id: 'reconciliation',
    name: 'Receipt Reconciliation',
    status: 'coming-soon',
    description: 'Match transactions with receipts using AI-powered matching',
    expectedRelease: 'Q1 2025'
  },
  'chat': {
    id: 'chat',
    name: 'AI Financial Assistant',
    status: 'coming-soon',
    description: 'Chat with AI about your financial data and get insights',
    expectedRelease: 'Q1 2025'
  },
  'bank-accounts': {
    id: 'bank-accounts',
    name: 'Bank Account Management',
    status: 'coming-soon',
    description: 'Add and manage multiple bank accounts',
    expectedRelease: 'Q1 2025'
  },
  'reports': {
    id: 'reports',
    name: 'Financial Reports',
    status: 'coming-soon',
    description: 'Generate detailed financial reports and analytics',
    expectedRelease: 'Q2 2025'
  },
  'export': {
    id: 'export',
    name: 'Data Export',
    status: 'beta',
    description: 'Export your financial data to CSV and other formats'
  },
  'notifications': {
    id: 'notifications',
    name: 'Smart Notifications',
    status: 'coming-soon',
    description: 'Get notified about important financial events and insights',
    expectedRelease: 'Q2 2025'
  }
};

/**
 * Get feature status information
 */
export function getFeatureStatus(featureId: string): FeatureStatusInfo {
  const feature = APP_FEATURES[featureId];
  if (!feature) {
    return FEATURE_STATUS_CONFIG['disabled'];
  }
  
  return FEATURE_STATUS_CONFIG[feature.status];
}

/**
 * Get feature configuration
 */
export function getFeatureConfig(featureId: string): FeatureConfig | null {
  return APP_FEATURES[featureId] || null;
}

/**
 * Check if a feature is available for use
 */
export function isFeatureAvailable(featureId: string): boolean {
  const feature = APP_FEATURES[featureId];
  return feature?.status === 'active' || feature?.status === 'beta';
}

/**
 * Get all features with a specific status
 */
export function getFeaturesByStatus(status: FeatureStatus): FeatureConfig[] {
  return Object.values(APP_FEATURES).filter(feature => feature.status === status);
}
