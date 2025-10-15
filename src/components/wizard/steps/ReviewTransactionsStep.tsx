import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Home, RefreshCw, MessageSquare, Settings, Trophy } from 'lucide-react';

/**
 * ReviewTransactionsStep - Step 5: Review Transactions & Next Steps
 * 
 * Purpose: Show transaction preview and guide users to key features
 * 
 * Content:
 * - Sample transactions table
 * - Next steps with navigation icons
 * - Gamification preview
 * - Finish wizard CTA
 */
export function ReviewTransactionsStep() {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-4xl mb-4">📊</h2>
        <h3 className="text-2xl font-bold text-charcoal mb-2">
          Reviewing Your Transactions
        </h3>
        <p className="text-base text-charcoal">
          Preview extracted transactions and learn what's next
        </p>
      </div>

      {/* Transaction preview table */}
      <Card className="p-6 bg-white border-stone/20">
        <h4 className="text-lg font-semibold text-charcoal mb-4">
          Example: Extracted Transactions
        </h4>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Jan 15</TableCell>
                <TableCell>Grocery Store Purchase</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">Food & Dining</Badge>
                </TableCell>
                <TableCell className="text-right text-red-600">-$127.34</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Jan 18</TableCell>
                <TableCell>Monthly Salary Deposit</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">Income</Badge>
                </TableCell>
                <TableCell className="text-right text-green-600">+$3,500.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Jan 22</TableCell>
                <TableCell>Electric Utility Payment</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">Utilities</Badge>
                </TableCell>
                <TableCell className="text-right text-red-600">-$89.50</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Jan 25</TableCell>
                <TableCell>Online Shopping</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">Shopping</Badge>
                </TableCell>
                <TableCell className="text-right text-red-600">-$245.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Jan 28</TableCell>
                <TableCell>Restaurant Dinner</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">Food & Dining</Badge>
                </TableCell>
                <TableCell className="text-right text-red-600">-$67.89</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-900">
          <strong>This is just a preview!</strong> Your actual transactions will show after you upload a statement.
        </div>
      </Card>

      {/* Next steps */}
      <Card className="p-6 bg-cream/30 border-stone/20">
        <h4 className="text-lg font-semibold text-charcoal mb-4">
          What's next after uploading:
        </h4>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-stone/20">
              <Home className="h-5 w-5 text-charcoal" />
            </div>
            <div>
              <p className="font-medium text-charcoal">Dashboard</p>
              <p className="text-sm text-stone">View all your statements, balances, and recent uploads</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-stone/20">
              <RefreshCw className="h-5 w-5 text-charcoal" />
            </div>
            <div>
              <p className="font-medium text-charcoal">Reconciliation</p>
              <p className="text-sm text-stone">Match transactions and identify discrepancies automatically</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-stone/20">
              <MessageSquare className="h-5 w-5 text-charcoal" />
            </div>
            <div>
              <p className="font-medium text-charcoal">AI Chat Assistant</p>
              <p className="text-sm text-stone">Ask questions about your finances and get instant insights</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-stone/20">
              <Settings className="h-5 w-5 text-charcoal" />
            </div>
            <div>
              <p className="font-medium text-charcoal">Settings</p>
              <p className="text-sm text-stone">Manage preferences, categories, and account settings</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Gamification preview */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <div className="flex items-start gap-3">
          <Trophy className="h-6 w-6 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-lg font-semibold text-charcoal mb-2">
              Earn achievements as you go! 🏆
            </h4>
            <p className="text-charcoal text-sm mb-3">
              Previa tracks your progress with achievements and points:
            </p>
            <ul className="space-y-2 text-sm text-charcoal">
              <li>🥇 <strong>First Upload:</strong> Upload your first statement (10 points)</li>
              <li>🔍 <strong>Data Detective:</strong> Review and edit extracted data (15 points)</li>
              <li>✅ <strong>Reconciliation Pro:</strong> Complete your first reconciliation (25 points)</li>
              <li>💬 <strong>Chat Explorer:</strong> Ask AI your first question (10 points)</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Final encouragement */}
      <div className="text-center p-6 bg-sand/20 rounded-lg border border-sand">
        <h4 className="text-xl font-bold text-charcoal mb-2">
          You're all set! 🎉
        </h4>
        <p className="text-charcoal mb-4">
          Click <strong>"Finish & Go to Dashboard"</strong> below to start using Previa
        </p>
        <p className="text-sm text-stone">
          You can always revisit these tips by clicking the Setup Wizard button in the top bar
        </p>
      </div>
    </div>
  );
}
