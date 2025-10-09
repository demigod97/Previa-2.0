import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Shield, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useGlobalSourcesCount } from '@/hooks/useGlobalSourcesCount';

const UserGreetingCard = () => {
  const { user } = useAuth();
  const { userRole, isLoading: roleLoading, error } = useUserRole();
  const { globalSourcesCount, sourcesDescription, isLoading: sourcesLoading } = useGlobalSourcesCount();

  // Debug logging
  React.useEffect(() => {
    console.log('UserGreetingCard Debug:', {
      userId: user?.id,
      email: user?.email,
      userRole,
      roleLoading,
      error
    });
  }, [user?.id, user?.email, userRole, roleLoading, error]);

  if (!user) return null;

  // Get user's display name (fallback to email username if no full name)
  const displayName = user.user_metadata?.full_name || 
                     user.user_metadata?.name || 
                     user.email?.split('@')[0] || 
                     'User';

  // Format role for display
  const formatRole = (role: string) => {
    switch (role) {
      case 'administrator':
        return 'Administrator';
      case 'executive':
        return 'Executive';
      case 'board':
        return 'Board';
      default:
        return 'User';
    }
  };

  // Get role color using Previa color scheme
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'administrator':
        return 'text-green-800 border-green-200';
      case 'executive':
        return 'text-blue-800 border-blue-200';
      case 'board':
        return 'text-purple-800 border-purple-200';
      default:
        return 'border-gray-200';
    }
  };

  return (
    <Card style={{ backgroundColor: '#F2E9D8', borderColor: '#D9C8B4' }}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg" style={{ color: '#403B31' }}>
          <div className="p-2 rounded-full" style={{ backgroundColor: '#D9C8B4' }}>
            <User className="h-5 w-5" style={{ color: '#403B31' }} />
          </div>
          Welcome back, {displayName}!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm" style={{ color: '#595347' }}>
          <Mail className="h-4 w-4" />
          <span>{user.email}</span>
        </div>

        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" style={{ color: '#8C877D' }} />
          <span className="text-sm" style={{ color: '#595347' }}>Role:</span>
          {roleLoading ? (
            <div className="h-5 w-20 animate-pulse rounded" style={{ backgroundColor: '#D9C8B4' }}></div>
          ) : (
            <Badge
              variant="outline"
              className={getRoleColor(userRole || '')}
              style={{ backgroundColor: '#D9C8B4', color: '#403B31' }}
            >
              {userRole ? formatRole(userRole) : 'No Role Assigned'}
            </Badge>
          )}
        </div>

        <div className="flex items-start gap-2 pt-1">
          <FileText className="h-4 w-4 mt-0.5" style={{ color: '#8C877D' }} />
          <div className="flex-1">
            <span className="text-sm" style={{ color: '#595347' }}>Financial Accounts:</span>
            {sourcesLoading ? (
              <div className="h-4 w-32 animate-pulse rounded mt-1" style={{ backgroundColor: '#D9C8B4' }}></div>
            ) : (
              <p className="text-sm mt-0.5" style={{ color: '#403B31' }}>Ready for financial analysis and reconciliation</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserGreetingCard;