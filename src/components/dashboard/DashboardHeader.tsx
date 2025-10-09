
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLogout } from '@/services/authService';
import Logo from '@/components/ui/Logo';

interface DashboardHeaderProps {
  userEmail?: string;
}

const DashboardHeader = ({ userEmail }: DashboardHeaderProps) => {
  const { logout } = useLogout();

  return (
    <header className="px-6 py-4" style={{ backgroundColor: '#F2E9D8', borderBottom: '1px solid #D9C8B4' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Logo />
          <h1 className="text-xl font-medium" style={{ color: '#403B31' }}>Previa</h1>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors" style={{ backgroundColor: '#D9C8B4' }}>
                  <User className="h-4 w-4" style={{ color: '#403B31' }} />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48" style={{ backgroundColor: '#F2E9D8', borderColor: '#D9C8B4' }}>
              <DropdownMenuItem onClick={logout} className="cursor-pointer" style={{ color: '#403B31' }}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
