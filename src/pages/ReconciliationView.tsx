/**
 * ReconciliationView - Match transactions with receipts
 * 
 * Features:
 * - 3-panel resizable layout (transactions | matching preview | receipts)
 * - Drag-and-drop matching
 * - AI confidence scoring
 * - Filter by date, amount, category
 */

import React, { useState } from 'react';
import { Sidebar, TopBar } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { ArrowLeftRight, Filter, Search, Upload } from 'lucide-react';
import { TransactionCard, ReceiptCard, MatchingPreview } from '@/components/reconciliation';
import {
  useUnmatchedTransactions,
  useUnmatchedReceipts,
  useCreateMatch,
} from '@/hooks/financial/useReconciliation';
import type { Transaction, Receipt } from '@/types/financial';
import { Panel as ResizablePanel, PanelGroup as ResizablePanelGroup, PanelResizeHandle as ResizableHandle } from 'react-resizable-panels';

/**
 * ReconciliationView component
 */
const ReconciliationView = () => {
  // Data hooks
  const { data: transactions = [], isLoading: loadingTransactions } = useUnmatchedTransactions();
  const { data: receipts = [], isLoading: loadingReceipts } = useUnmatchedReceipts();
  const createMatch = useCreateMatch();

  // Local state
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [receiptView, setReceiptView] = useState<'list' | 'grid'>('list');
  const [isDragging, setIsDragging] = useState(false);

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || tx.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(transactions.map((tx) => tx.category).filter(Boolean)));

  // Calculate confidence score for a match (simple heuristic)
  const calculateConfidence = (transaction: Transaction, receipt: Receipt): number => {
    let score = 0;
    
    // Amount match (40 points)
    const amountDiff = Math.abs(transaction.amount - (receipt.amount || 0));
    if (amountDiff === 0) score += 40;
    else if (amountDiff <= 50) score += 30; // Within $0.50
    else if (amountDiff <= 100) score += 20; // Within $1.00
    else if (amountDiff <= 500) score += 10; // Within $5.00

    // Date match (40 points)
    const txDate = new Date(transaction.transaction_date);
    const rcDate = new Date(receipt.receipt_date || new Date());
    const daysDiff = Math.abs(Math.floor((txDate.getTime() - rcDate.getTime()) / (1000 * 60 * 60 * 24)));
    if (daysDiff === 0) score += 40;
    else if (daysDiff === 1) score += 30;
    else if (daysDiff <= 2) score += 20;
    else if (daysDiff <= 7) score += 10;

    // Merchant/description match (20 points)
    if (receipt.merchant && transaction.description) {
      const merchantLower = receipt.merchant.toLowerCase();
      const descLower = transaction.description.toLowerCase();
      if (descLower.includes(merchantLower) || merchantLower.includes(descLower)) {
        score += 20;
      }
    }

    return Math.min(score, 100);
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    const { active } = event;
    if (active.data.current?.type === 'transaction') {
      setSelectedTransaction(active.data.current.transaction);
    }
  };

  // Handle drag end (match transaction with receipt)
  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    const { active, over } = event;

    if (over && active.data.current?.type === 'transaction' && over.data.current?.type === 'receipt') {
      const transaction = active.data.current.transaction;
      const receipt = over.data.current.receipt;
      
      setSelectedTransaction(transaction);
      setSelectedReceipt(receipt);
    }
  };

  // Handle manual match button click
  const handleManualMatch = (transactionId: string, receiptId: string) => {
    const transaction = transactions.find((t) => t.id === transactionId);
    const receipt = receipts.find((r) => r.id === receiptId);
    
    if (transaction && receipt) {
      setSelectedTransaction(transaction);
      setSelectedReceipt(receipt);
    }
  };

  // Handle match approval
  const handleApproveMatch = async () => {
    if (!selectedTransaction || !selectedReceipt) return;

    const confidence = calculateConfidence(selectedTransaction, selectedReceipt);

    await createMatch.mutateAsync({
      transactionId: selectedTransaction.id,
      receiptId: selectedReceipt.id,
      confidenceScore: confidence,
    });

    // Clear selection after successful match
    setSelectedTransaction(null);
    setSelectedReceipt(null);
  };

  // Handle match rejection
  const handleRejectMatch = () => {
    setSelectedTransaction(null);
    setSelectedReceipt(null);
  };

  const showMatchPreview = selectedTransaction && selectedReceipt;

  return (
    <div className="flex h-screen bg-cream">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 md:ml-20 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />

        {/* Reconciliation Content */}
        <main className="flex-1 overflow-hidden p-6 pb-20 md:pb-6">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="mb-4">
              <h1 className="text-4xl font-semibold text-charcoal">Reconciliation</h1>
              <p className="text-darkStone mt-2">
                Match your transactions with receipts using drag-and-drop
              </p>
            </div>

            {/* Resizable 3-Panel Layout */}
            <div className="flex-1 min-h-0">
              <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border border-sand">
                  {/* Left Panel: Unmatched Transactions */}
                  <ResizablePanel defaultSize={40} minSize={30}>
                    <Card className="h-full rounded-none border-0 bg-white">
                      <CardHeader className="border-b border-sand">
                        <CardTitle className="flex items-center gap-2 text-charcoal">
                          <ArrowLeftRight className="h-5 w-5 text-sand" />
                          Transactions ({filteredTransactions.length})
                        </CardTitle>
                        {/* Filters */}
                        <div className="space-y-2 mt-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone" />
                            <Input
                              placeholder="Search transactions..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-9"
                            />
                          </div>
                          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger>
                              <SelectValue placeholder="Filter by category" />
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
                      </CardHeader>
                      <ScrollArea className="h-[calc(100%-200px)]">
                        <CardContent className="p-4 space-y-3">
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
                              <TransactionCard
                                key={transaction.id}
                                transaction={transaction}
                                onMatch={(txId) => handleManualMatch(txId, '')}
                              />
                            ))
                          )}
                        </CardContent>
                      </ScrollArea>
                    </Card>
                  </ResizablePanel>

                  <ResizableHandle />

                  {/* Center Panel: Matching Preview (conditional) */}
                  {showMatchPreview && (
                    <>
                      <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                        <Card className="h-full rounded-none border-0 bg-white flex items-center justify-center">
                          <CardContent className="p-4 w-full">
                            <MatchingPreview
                              transaction={selectedTransaction}
                              receipt={selectedReceipt}
                              confidenceScore={calculateConfidence(selectedTransaction, selectedReceipt)}
                              onApprove={handleApproveMatch}
                              onReject={handleRejectMatch}
                              isLoading={createMatch.isPending}
                            />
                          </CardContent>
                        </Card>
                      </ResizablePanel>
                      <ResizableHandle />
                    </>
                  )}

                  {/* Right Panel: Receipts Library */}
                  <ResizablePanel defaultSize={showMatchPreview ? 40 : 60} minSize={30}>
                    <Card className="h-full rounded-none border-0 bg-white">
                      <CardHeader className="border-b border-sand">
                        <CardTitle className="flex items-center justify-between text-charcoal">
                          <span className="flex items-center gap-2">
                            <Upload className="h-5 w-5 text-sand" />
                            Receipts ({receipts.length})
                          </span>
                          <Tabs value={receiptView} onValueChange={(v) => setReceiptView(v as 'list' | 'grid')}>
                            <TabsList className="h-8">
                              <TabsTrigger value="list" className="text-xs">List</TabsTrigger>
                              <TabsTrigger value="grid" className="text-xs">Grid</TabsTrigger>
                            </TabsList>
                          </Tabs>
                        </CardTitle>
                        <Button
                          size="sm"
                          className="mt-4 w-full bg-sand hover:bg-sand/90 text-charcoal"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Receipt
                        </Button>
                      </CardHeader>
                      <ScrollArea className="h-[calc(100%-200px)]">
                        <CardContent className={`p-4 ${receiptView === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}`}>
                          {loadingReceipts ? (
                            <div className="flex items-center justify-center h-32 col-span-2">
                              <p className="text-sm text-stone">Loading receipts...</p>
                            </div>
                          ) : receipts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-32 text-center col-span-2">
                              <p className="text-sm font-medium text-charcoal">No unmatched receipts</p>
                              <p className="text-xs text-stone mt-1">Upload receipts to get started</p>
                            </div>
                          ) : (
                            receipts.map((receipt) => (
                              <ReceiptCard
                                key={receipt.id}
                                receipt={receipt}
                                onMatch={(rcId) => selectedTransaction && handleManualMatch(selectedTransaction.id, rcId)}
                              />
                            ))
                          )}
                        </CardContent>
                      </ScrollArea>
                    </Card>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </DndContext>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReconciliationView;
