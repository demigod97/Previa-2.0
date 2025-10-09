import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, FileText, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotebooks } from '@/hooks/useNotebooks';

const EmptyDashboard = () => {
  const navigate = useNavigate();
  const {
    createNotebook,
    isCreating
  } = useNotebooks();
  const handleCreateNotebook = () => {
    console.log('Create notebook button clicked');
    console.log('isCreating:', isCreating);
    createNotebook({
      title: 'New Chat',
      description: '',
      assigned_role: 'executive' // Auto-assign to executive role
    }, {
      onSuccess: data => {
        console.log('Notebook created successfully:', data.id);
        // Navigation temporarily disabled - will be updated with Previa routing
      },
      onError: error => {
        console.error('Failed to create notebook:', error);
      }
    });
  };

  return <div className="text-center py-16">
      <div className="mb-12">
        <h2 className="text-3xl font-medium text-gray-900 mb-4">Welcome to Previa</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Previa is an AI-powered financial intelligence platform that helps Australian households and small businesses manage their finances with intelligent reconciliation and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
        <div className="rounded-lg border p-6 text-center" style={{ backgroundColor: '#F2E9D8', borderColor: '#D9C8B4' }}>
          <div className="w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#D9C8B4' }}>
            <FileText className="h-6 w-6" style={{ color: '#403B31' }} />
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: '#403B31' }}>Smart Reconciliation</h3>
          <p style={{ color: '#595347' }}>Automatically match bank transactions with receipts and invoices using AI-powered analysis</p>
        </div>

        <div className="rounded-lg border p-6 text-center" style={{ backgroundColor: '#F2E9D8', borderColor: '#D9C8B4' }}>
          <div className="w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#D9C8B4' }}>
            <Globe className="h-6 w-6" style={{ color: '#403B31' }} />
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: '#403B31' }}>Australian Tax Ready</h3>
          <p style={{ color: '#595347' }}>Built for Australian tax requirements with ATO-compliant categorization and reporting</p>
        </div>

        <div className="rounded-lg border p-6 text-center" style={{ backgroundColor: '#F2E9D8', borderColor: '#D9C8B4' }}>
          <div className="w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#D9C8B4' }}>
            <MessageCircle className="h-6 w-6" style={{ color: '#403B31' }} />
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: '#403B31' }}>AI Financial Assistant</h3>
          <p style={{ color: '#595347' }}>Ask questions about your finances and get insights powered by your transaction data</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Button
          onClick={handleCreateNotebook}
          size="lg"
          disabled={isCreating}
          style={{
            backgroundColor: '#D9C8B4',
            color: '#403B31',
            borderColor: '#D9C8B4'
          }}
          className="hover:opacity-90"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          {isCreating ? 'Creating...' : 'Start Financial Analysis'}
        </Button>
      </div>
    </div>;
};
export default EmptyDashboard;