import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/chakra-ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/chakra-ui/card';
import { Input } from '@/components/chakra-ui/input';
import { Label } from '@/components/chakra-ui/label';
import { Badge } from '@/components/chakra-ui/badge';
import { Loader2, AlertCircle, CheckCircle2, Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BankAccount {
  id: string;
  institution: string;
  account_name: string;
  account_number_masked: string;
  balance: number;
  currency: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export default function ConfirmAccount() {
  const { documentId } = useParams<{ documentId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [extractionConfidence, setExtractionConfidence] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Form state for editable fields
  const [institutionName, setInstitutionName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumberMasked, setAccountNumberMasked] = useState('');
  const [balance, setBalance] = useState('');

  const loadBankAccount = useCallback(async () => {
    if (!user || !documentId) return;

    try {
      setLoading(true);
      setError(null);

      // Find bank account created from this bank statement
      const { data: statement, error: statementError } = await supabase
        .from('bank_statements')
        .select('bank_account_id, extraction_confidence')
        .eq('id', documentId)
        .eq('user_id', user.id)
        .single();

      if (statementError) throw statementError;
      if (!statement?.bank_account_id) {
        throw new Error('Bank account not found for this statement');
      }

      // Store extraction confidence
      setExtractionConfidence(statement.extraction_confidence);

      // Fetch bank account details
      const { data: account, error: accountError } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('id', statement.bank_account_id)
        .single();

      if (accountError) throw accountError;

      setBankAccount(account);
      
      // Initialize form fields with actual database column names
      setInstitutionName(account.institution || '');
      setAccountName(account.account_name || '');
      setAccountNumberMasked(account.account_number_masked || '');
      setBalance(account.balance?.toString() || '0.00');
    } catch (err) {
      console.error('Error loading bank account:', err);
      setError(err instanceof Error ? err.message : 'Failed to load account details');
    } finally {
      setLoading(false);
    }
  }, [user, documentId]);

  useEffect(() => {
    if (!user || !documentId) {
      setError('Missing user or document ID');
      setLoading(false);
      return;
    }

    loadBankAccount();
  }, [user, documentId, loadBankAccount]);

  const handleSave = async () => {
    if (!bankAccount || !user) return;

    // Validate required fields
    if (!institutionName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Institution name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!accountName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Account name is required',
        variant: 'destructive',
      });
      return;
    }

    // Validate last 4 digits format
    if (!/^\d{4}$/.test(accountNumberMasked)) {
      toast({
        title: 'Validation Error',
        description: 'Last 4 digits must be exactly 4 numbers',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);

      const { error: updateError } = await supabase
        .from('bank_accounts')
        .update({
          institution: institutionName.trim(),
          account_name: accountName.trim(),
          account_number_masked: accountNumberMasked,
          balance: parseFloat(balance),
          updated_at: new Date().toISOString(),
        })
        .eq('id', bankAccount.id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      toast({
        title: '✨ Account Updated',
        description: 'Your account details have been saved successfully',
      });

      // Proceed to transaction preview
      navigate('/onboarding/transactions-preview');
    } catch (err) {
      console.error('Error saving account:', err);
      toast({
        title: 'Save Failed',
        description: err instanceof Error ? err.message : 'Failed to save account details',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleContinue = () => {
    // If not in edit mode, just continue
    if (!editMode) {
      navigate('/onboarding/transactions-preview');
      return;
    }

    // If in edit mode, save first
    handleSave();
  };

  const getConfidenceBadge = () => {
    if (extractionConfidence === null || extractionConfidence === undefined) {
      return <Badge variant="secondary">Unknown Confidence</Badge>;
    }

    const confidence = extractionConfidence;
    
    if (confidence >= 0.8) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          High Confidence
        </Badge>
      );
    } else if (confidence >= 0.5) {
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          <AlertCircle className="w-3 h-3 mr-1" />
          Medium Confidence
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <AlertCircle className="w-3 h-3 mr-1" />
          Low Confidence
        </Badge>
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-previa-cream flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white border-stone/20">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-previa-stone" />
            <p className="text-previa-charcoal">Loading account details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !bankAccount) {
    return (
      <div className="min-h-screen bg-previa-cream flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white border-stone/20">
          <CardHeader>
            <CardTitle className="text-previa-charcoal flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Error Loading Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-previa-stone">
              {error || 'Failed to load account details'}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate('/onboarding/upload')}
                variant="outline"
                className="flex-1"
              >
                Back to Upload
              </Button>
              <Button
                onClick={loadBankAccount}
                className="flex-1 bg-previa-sand hover:bg-previa-sand/90 text-previa-charcoal"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main confirmation UI
  return (
    <div className="min-h-screen bg-previa-cream flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white border-stone/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-semibold text-previa-charcoal">
              Confirm your account details
            </CardTitle>
            {getConfidenceBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Institution Name */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="institution" className="text-previa-charcoal font-medium">
                Institution Name
              </Label>
              {!editMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditMode(true)}
                  className="h-8 text-previa-stone hover:text-previa-charcoal"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
            <Input
              id="institution"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              disabled={!editMode}
              className="bg-white border-stone/20 text-previa-charcoal disabled:opacity-100"
              placeholder="e.g., Commonwealth Bank"
            />
          </div>

          {/* Account Name */}
          <div className="space-y-2">
            <Label htmlFor="accountName" className="text-previa-charcoal font-medium">
              Account Name
            </Label>
            <Input
              id="accountName"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              disabled={!editMode}
              className="bg-white border-stone/20 text-previa-charcoal disabled:opacity-100"
              placeholder="e.g., Everyday Account"
            />
          </div>

          {/* Last 4 Digits */}
          <div className="space-y-2">
            <Label htmlFor="lastFour" className="text-previa-charcoal font-medium">
              Last 4 Digits
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-previa-stone">
                ••••
              </span>
              <Input
                id="lastFour"
                value={accountNumberMasked}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setAccountNumberMasked(value);
                }}
                disabled={!editMode}
                className="pl-12 bg-white border-stone/20 text-previa-charcoal disabled:opacity-100"
                placeholder="1234"
                maxLength={4}
              />
            </div>
          </div>

          {/* Opening Balance */}
          <div className="space-y-2">
            <Label htmlFor="balance" className="text-previa-charcoal font-medium">
              Opening Balance
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-previa-stone font-mono">
                $
              </span>
              <Input
                id="balance"
                value={balance}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d.-]/g, '');
                  setBalance(value);
                }}
                disabled={!editMode}
                className="pl-8 font-mono bg-white border-stone/20 text-previa-charcoal disabled:opacity-100"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {editMode ? (
              <>
                <Button
                  onClick={() => {
                    setEditMode(false);
                    // Reset to original values
                    setInstitutionName(bankAccount.institution || '');
                    setAccountName(bankAccount.account_name || '');
                    setAccountNumberMasked(bankAccount.account_number_masked || '');
                    setBalance(bankAccount.balance?.toString() || '0.00');
                  }}
                  variant="outline"
                  className="flex-1"
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-previa-sand hover:bg-previa-sand/90 text-previa-charcoal"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save & Continue'
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setEditMode(true)}
                  variant="outline"
                  className="flex-1"
                >
                  Edit Details
                </Button>
                <Button
                  onClick={handleContinue}
                  className="flex-1 bg-previa-sand hover:bg-previa-sand/90 text-previa-charcoal"
                >
                  Looks good! ✨
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
