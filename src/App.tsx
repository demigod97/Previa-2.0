
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { WizardProvider } from "@/contexts/WizardContext";
import { ErrorBoundary } from "@/components/error";
import { AppLayout } from "@/components/layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import ReconciliationView from "./pages/ReconciliationView";
import TransactionsView from "./pages/TransactionsView";
import ChatView from "./pages/ChatView";
import Settings from "./pages/Settings";
import Gamification from "./pages/Gamification";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import BankStatementUpload from "./pages/onboarding/BankStatementUpload";
import ProcessingStatus from "./pages/onboarding/ProcessingStatus";
import ConfirmAccount from "./pages/onboarding/ConfirmAccount";

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route
          path="/"
          element={
            <ProtectedRoute fallback={<Welcome />}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/reconciliation" 
          element={
            <ProtectedRoute fallback={<Auth />}>
              <ReconciliationView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/transactions" 
          element={
            <ProtectedRoute fallback={<Auth />}>
              <TransactionsView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute fallback={<Auth />}>
              <ChatView />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute fallback={<Auth />}>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gamification"
          element={
            <ProtectedRoute fallback={<Auth />}>
              <Gamification />
            </ProtectedRoute>
          }
        />
        {/* Onboarding routes */}
        <Route
          path="/onboarding/upload"
          element={
            <ProtectedRoute fallback={<Auth />}>
              <BankStatementUpload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/processing/:documentId"
          element={
            <ProtectedRoute fallback={<Auth />}>
              <ProcessingStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/confirm-account/:documentId"
          element={
            <ProtectedRoute fallback={<Auth />}>
              <ConfirmAccount />
            </ProtectedRoute>
          }
        />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <WizardProvider>
              <ErrorBoundary>
                <AppContent />
              </ErrorBoundary>
            </WizardProvider>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
