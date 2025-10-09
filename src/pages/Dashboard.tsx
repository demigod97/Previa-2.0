
import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import NotebookGrid from '@/components/dashboard/NotebookGrid';
import EmptyDashboard from '@/components/dashboard/EmptyDashboard';
import UserGreetingCard from '@/components/dashboard/UserGreetingCard';
import { useNotebooks } from '@/hooks/useNotebooks';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user, loading: authLoading, error: authError } = useAuth();
  const { notebooks, isLoading, error, isError } = useNotebooks();
  const hasNotebooks = notebooks && notebooks.length > 0;

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F2E9D8' }}>
        <DashboardHeader userEmail={user?.email} />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-medium mb-2" style={{ color: '#403B31' }}>Welcome to Previa</h1>
          </div>
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: '#D9C8B4' }}></div>
            <p style={{ color: '#595347' }}>Initializing...</p>
          </div>
        </main>
      </div>
    );
  }

  // Show auth error if present
  if (authError) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F2E9D8' }}>
        <DashboardHeader userEmail={user?.email} />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-medium mb-2" style={{ color: '#403B31' }}>Welcome to Previa</h1>
          </div>
          <div className="text-center py-16">
            <p className="text-red-600">Authentication error: {authError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 rounded hover:opacity-90"
              style={{ backgroundColor: '#D9C8B4', color: '#403B31' }}
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Show notebooks loading state
  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F2E9D8' }}>
        <DashboardHeader userEmail={user?.email} />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-medium mb-2" style={{ color: '#403B31' }}>Welcome to Previa</h1>
          </div>
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: '#D9C8B4' }}></div>
            <p style={{ color: '#595347' }}>Loading your financial data...</p>
          </div>
        </main>
      </div>
    );
  }

  // Show notebooks error if present
  if (isError && error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F2E9D8' }}>
        <DashboardHeader userEmail={user?.email} />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-medium mb-2" style={{ color: '#403B31' }}>Welcome to Previa</h1>
          </div>
          <div className="text-center py-16">
            <p className="text-red-600">Error loading financial data: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 rounded hover:opacity-90"
              style={{ backgroundColor: '#D9C8B4', color: '#403B31' }}
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2E9D8' }}>
      <DashboardHeader userEmail={user?.email} />

      <main className="max-w-7xl mx-auto px-6 py-[60px]">
        <div className="mb-8">
          <h1 className="font-medium mb-2 text-5xl" style={{ color: '#403B31' }}>Welcome to Previa</h1>
        </div>

        <div className="mb-8">
          <UserGreetingCard />
        </div>

        {hasNotebooks ? <NotebookGrid /> : <EmptyDashboard />}
      </main>
    </div>
  );
};

export default Dashboard;
