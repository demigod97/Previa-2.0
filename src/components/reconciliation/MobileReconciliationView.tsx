/**
 * MobileReconciliationView - Mobile-optimized reconciliation interface
 * 
 * Features:
 * - Tab-based navigation (Transactions | Receipts | Matches)
 * - Full-screen matching modal
 * - Touch-optimized controls
 * - Bottom sheet filters
 */

import React, { useState } from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
  VStack,
  HStack,
  Icon,
  Text,
} from '@chakra-ui/react';
import { Dialog, DialogContent } from '@/components/chakra-ui/dialog';
import { Button } from '@/components/chakra-ui/button';
import { Input } from '@/components/chakra-ui/input';
import { ScrollArea } from '@/components/chakra-ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/chakra-ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/chakra-ui/sheet';
import { ArrowLeftRight, Upload, Search, Filter, Check, X } from 'lucide-react';
import { TransactionCard, ReceiptCard, MatchingPreview } from '@/components/reconciliation';
import type { Transaction, Receipt } from '@/types/financial';
import { cn } from '@/lib/utils';

interface MobileReconciliationViewProps {
  transactions: Transaction[];
  receipts: Receipt[];
  loadingTransactions: boolean;
  loadingReceipts: boolean;
  onApproveMatch: () => void;
  onRejectMatch: () => void;
  onMatchTransaction: (txId: string, rcId: string) => void;
  calculateConfidence: (tx: Transaction, rc: Receipt) => number;
  isCreatingMatch: boolean;
}

export function MobileReconciliationView({
  transactions,
  receipts,
  loadingTransactions,
  loadingReceipts,
  onApproveMatch,
  onRejectMatch,
  onMatchTransaction,
  calculateConfidence,
  isCreatingMatch,
}: MobileReconciliationViewProps) {
  // Tab indices: 0 = transactions, 1 = receipts, 2 = matches
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || tx.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(transactions.map((tx) => tx.category).filter(Boolean)));

  // Handle transaction selection for matching
  const handleTransactionSelect = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setTabIndex(1); // Switch to receipts tab
  };

  // Handle receipt selection
  const handleReceiptSelect = (receipt: Receipt) => {
    if (selectedTransaction) {
      setSelectedReceipt(receipt);
      setMatchDialogOpen(true);
    }
  };

  // Handle match approval
  const handleApprove = async () => {
    await onApproveMatch();
    setMatchDialogOpen(false);
    setSelectedTransaction(null);
    setSelectedReceipt(null);
    setTabIndex(0); // Return to transactions tab
  };

  // Handle match rejection
  const handleReject = () => {
    onRejectMatch();
    setMatchDialogOpen(false);
    setSelectedReceipt(null);
  };

  return (
    <Box h="full" display="flex" flexDirection="column">
      {/* Tab Navigation */}
      <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)} display="flex" flexDirection="column" flex={1}>
        <Box borderBottom="1px solid" borderColor="previa.sand" bg="white" px={4} pt={4}>
          <TabList
            display="grid"
            gridTemplateColumns="repeat(3, 1fr)"
            h={12}
            bg="previa.cream"
            gap={0}
          >
            <Tab fontSize="sm">
              <Icon as={ArrowLeftRight} w={4} h={4} mr={2} />
              Transactions
            </Tab>
            <Tab fontSize="sm">
              <Icon as={Upload} w={4} h={4} mr={2} />
              Receipts
            </Tab>
            <Tab fontSize="sm">
              <Icon as={Check} w={4} h={4} mr={2} />
              Matched
            </Tab>
          </TabList>
        </Box>

        <TabPanels flex={1} display="flex" flexDirection="column">
          {/* Transactions Tab */}
          <TabPanel flex={1} display="flex" flexDirection="column" m={0} p={0}>
          <div className="bg-card border-b border-previa-sand p-4 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone pointer-events-none" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 text-base"
                paddingLeft="2.5rem"
              />
            </div>

            {/* Filter Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full h-12 border-sand">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters {categoryFilter !== 'all' && '(1)'}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="bg-cream">
                <SheetHeader>
                  <SheetTitle className="text-charcoal">Filter Transactions</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-charcoal mb-2 block">Category</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat || 'uncategorized'}>
                            {cat || 'Uncategorized'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="w-full h-12 bg-sand hover:bg-sand/90 text-charcoal"
                    onClick={() => setCategoryFilter('all')}
                  >
                    Clear Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {loadingTransactions ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-sm text-stone">Loading transactions...</p>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <p className="text-sm font-medium text-charcoal">No unmatched transactions</p>
                  <p className="text-xs text-stone mt-1">All transactions are reconciled!</p>
                </div>
              ) : (
                filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    onClick={() => handleTransactionSelect(transaction)}
                    className={cn(
                      'transition-all min-h-[64px]',
                      selectedTransaction?.id === transaction.id && 'ring-2 ring-sand'
                    )}
                  >
                    <TransactionCard
                      transaction={transaction}
                      onMatch={() => handleTransactionSelect(transaction)}
                    />
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          </TabPanel>

          {/* Receipts Tab */}
          <TabPanel flex={1} display="flex" flexDirection="column" m={0} p={0}>
          <div className="bg-card border-b border-previa-sand p-4">
            <Button className="w-full h-12 bg-previa-sand hover:bg-previa-sand/90 text-previa-charcoal">
              <Upload className="h-4 w-4 mr-2" />
              Upload Receipt
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {selectedTransaction && (
                <div className="bg-sand/20 border border-sand rounded-lg p-3 mb-4">
                  <p className="text-xs font-medium text-darkStone mb-1">Selected Transaction</p>
                  <p className="text-sm font-semibold text-charcoal">{selectedTransaction.description}</p>
                  <p className="text-xs text-stone mt-1">
                    Tap a receipt below to match
                  </p>
                </div>
              )}

              {loadingReceipts ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-sm text-stone">Loading receipts...</p>
                </div>
              ) : receipts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <p className="text-sm font-medium text-charcoal">No unmatched receipts</p>
                  <p className="text-xs text-stone mt-1">Upload receipts to get started</p>
                </div>
              ) : (
                receipts.map((receipt) => (
                  <div
                    key={receipt.id}
                    onClick={() => handleReceiptSelect(receipt)}
                    className="transition-all min-h-[64px]"
                  >
                    <ReceiptCard
                      receipt={receipt}
                      onMatch={() => handleReceiptSelect(receipt)}
                    />
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          </TabPanel>

          {/* Matches Tab */}
          <TabPanel flex={1} display="flex" flexDirection="column" m={0} p={0}>
          <div className="p-4">
            <div className="bg-cream/50 rounded-lg p-8 text-center">
              <Check className="h-12 w-12 mx-auto mb-3 text-green-600" />
              <p className="text-sm font-medium text-charcoal">Matched Transactions</p>
              <p className="text-xs text-stone mt-1">
                View your approved matches in the Transactions page
              </p>
            </div>
          </div>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Full-Screen Matching Modal */}
      <Dialog open={matchDialogOpen} onOpenChange={setMatchDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] p-0 gap-0">
          <div className="p-4 border-b border-previa-sand bg-card">
            <h2 className="text-lg font-semibold text-previa-charcoal">Review Match</h2>
          </div>
          {selectedTransaction && selectedReceipt && (
            <ScrollArea className="flex-1 p-4">
              <MatchingPreview
                transaction={selectedTransaction}
                receipt={selectedReceipt}
                confidenceScore={calculateConfidence(selectedTransaction, selectedReceipt)}
                onApprove={handleApprove}
                onReject={handleReject}
                isLoading={isCreatingMatch}
              />
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

