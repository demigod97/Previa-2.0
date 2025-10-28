import React from 'react';
import { Sidebar, TopBar } from '@/components/layout';
import { Card, CardContent, CardHeader } from '@/components/chakra-ui/card';
import { Button } from '@/components/chakra-ui/button';
import { Input } from '@/components/chakra-ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/chakra-ui/table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import { createTransactionColumns } from '@/components/transactions/TransactionTableColumns';
import { TransactionTableToolbar } from '@/components/transactions/TransactionTableToolbar';
import { EditTransactionDialog } from '@/components/transactions/EditTransactionDialog';
import { MobileTransactionCard } from '@/components/transactions/MobileTransactionCard';
import { MobileTransactionFilters } from '@/components/transactions/MobileTransactionFilters';
import { useTransactions } from '@/hooks/financial/useTransactions';
import { useDebounce } from '@/hooks/useDebounce';
import { Transaction } from '@/types/financial';
import { Skeleton } from '@/components/chakra-ui/skeleton';
import { AlertCircle, ChevronLeft, ChevronRight, Receipt } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/chakra-ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/chakra-ui/select';
import { EmptyState } from '@/components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';

/**
 * TransactionsView - Comprehensive transaction management table
 * 
 * Features:
 * - Full data table with sorting, filtering, pagination
 * - Search across descriptions
 * - Filter by status, category, date range
 * - Batch operations (categorize, delete, export)
 * - Edit individual transactions
 * - Export to CSV
 */
const TransactionsView = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: transactions, isLoading, error } = useTransactions(user?.id, 1000);

  // Table state
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState('');

  // Debounce global filter for performance (300ms delay)
  const debouncedGlobalFilter = useDebounce(globalFilter, 300);

  // Dialog state
  const [editingTransaction, setEditingTransaction] = React.useState<Transaction | null>(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);

  // Mobile filter state
  const [mobileStatusFilters, setMobileStatusFilters] = React.useState<string[]>([]);
  const [mobileCategoryFilters, setMobileCategoryFilters] = React.useState<string[]>([]);

  // Transform transactions to include type field and date alias (for existing data)
  const transformedTransactions = React.useMemo(() => {
    if (!transactions) return [];
    return transactions.map(t => ({
      ...t,
      type: (t.amount < 0 ? 'expense' : 'income') as 'expense' | 'income',
      date: t.transaction_date, // Alias for widget compatibility
    }));
  }, [transactions]);

  // Get unique categories and statuses for mobile filters
  const availableCategories = React.useMemo(() => {
    return Array.from(new Set(transformedTransactions.map(t => t.category).filter(Boolean)));
  }, [transformedTransactions]);

  const availableStatuses = ['unreconciled', 'matched', 'approved', 'rejected'];

  // Apply mobile filters
  const mobileFilteredTransactions = React.useMemo(() => {
    let filtered = transformedTransactions;

    // Apply status filters
    if (mobileStatusFilters.length > 0) {
      filtered = filtered.filter(t => mobileStatusFilters.includes(t.status));
    }

    // Apply category filters
    if (mobileCategoryFilters.length > 0) {
      filtered = filtered.filter(t => t.category && mobileCategoryFilters.includes(t.category));
    }

    // Apply global search filter
    if (globalFilter) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(globalFilter.toLowerCase())
      );
    }

    return filtered;
  }, [transformedTransactions, mobileStatusFilters, mobileCategoryFilters, globalFilter]);

  const activeFilterCount = mobileStatusFilters.length + mobileCategoryFilters.length;

  // Table actions
  const handleView = (transaction: Transaction) => {
    toast({
      title: 'Transaction Details',
      description: `${transaction.description} - ${new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
      }).format(Math.abs(transaction.amount))}`,
    });
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditDialogOpen(true);
  };

  const handleDelete = (transaction: Transaction) => {
    // TODO: Implement delete via Supabase
    toast({
      title: 'Delete Transaction',
      description: `Would delete: ${transaction.description}`,
      variant: 'destructive',
    });
  };

  const handleSave = (transaction: Transaction) => {
    // TODO: Implement update via Supabase
    toast({
      title: 'Transaction Updated',
      description: 'Changes saved successfully',
    });
  };

  const handleExport = () => {
    const selected = table.getFilteredSelectedRowModel().rows;
    const dataToExport = selected.length > 0 
      ? selected.map(row => row.original)
      : transformedTransactions;

    // Convert to CSV
    const headers = ['Date', 'Description', 'Amount', 'Category', 'Status'];
    const csvData = dataToExport.map(t => [
      new Date(t.date).toLocaleDateString('en-AU'),
      t.description,
      t.amount.toFixed(2),
      t.category || 'Uncategorized',
      t.status,
    ]);

    const csv = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Complete',
      description: `Exported ${dataToExport.length} transactions`,
    });
  };

  const handleBatchDelete = () => {
    const selected = table.getFilteredSelectedRowModel().rows;
    toast({
      title: 'Batch Delete',
      description: `Would delete ${selected.length} transactions`,
      variant: 'destructive',
    });
  };

  const handleBatchCategorize = () => {
    const selected = table.getFilteredSelectedRowModel().rows;
    toast({
      title: 'Batch Categorize',
      description: `Would categorize ${selected.length} transactions`,
    });
  };

  const handleClearMobileFilters = () => {
    setMobileStatusFilters([]);
    setMobileCategoryFilters([]);
    setGlobalFilter('');
  };

  // Table setup
  const columns = React.useMemo(
    () => createTransactionColumns({
      onView: handleView,
      onEdit: handleEdit,
      onDelete: handleDelete,
    }),
    []
  );

  const table = useReactTable({
    data: transformedTransactions,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: debouncedGlobalFilter, // Use debounced value for filtering
    },
  });

  return (
    <div className="flex h-screen bg-cream">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 md:ml-20 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />

        {/* Transactions Content */}
        <main className="flex-1 overflow-y-auto md:p-6 pb-20 md:pb-6">
          <div className="max-w-[1400px] mx-auto md:space-y-6">
            {/* Page Header - Desktop */}
            <div className="hidden md:block px-6 md:px-0 py-6 md:py-0">
              <h1 className="text-4xl font-semibold text-charcoal">Transactions</h1>
              <p className="text-darkStone mt-2">
                View and manage all your financial transactions
              </p>
            </div>

            {/* Page Header - Mobile */}
            <div className="md:hidden px-4 pt-4 pb-3 bg-white border-b border-sand">
              <h1 className="text-2xl font-semibold text-charcoal">Transactions</h1>
            </div>

            {/* Error State */}
            {error && (
              <Alert variant="destructive" className="mx-4 md:mx-0">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load transactions. Please try again.
                </AlertDescription>
              </Alert>
            )}

            {/* Mobile Card View */}
            <div className="md:hidden">
              {/* Mobile Toolbar */}
              <div className="bg-white border-b border-sand p-4 space-y-3">
                {/* Search */}
                <Input
                  placeholder="Search transactions..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="h-12 text-base"
                />
                
                {/* Filters */}
                <div className="flex gap-2">
                  <MobileTransactionFilters
                    statusFilters={mobileStatusFilters}
                    categoryFilters={mobileCategoryFilters}
                    availableStatuses={availableStatuses}
                    availableCategories={availableCategories}
                    onStatusChange={setMobileStatusFilters}
                    onCategoryChange={setMobileCategoryFilters}
                    onClearFilters={handleClearMobileFilters}
                    activeFilterCount={activeFilterCount}
                  />
                  <Button
                    variant="outline"
                    className="flex-1 h-12 border-sand hover:bg-sand/20"
                    onClick={handleExport}
                  >
                    Export
                  </Button>
                </div>
              </div>

              {/* Mobile Transaction Cards */}
              <div className="p-4 space-y-3">
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full bg-stone/10" />
                    ))}
                  </div>
                ) : mobileFilteredTransactions.length === 0 ? (
                  <EmptyState
                    icon={<Receipt className="h-12 w-12" />}
                    title={transformedTransactions.length === 0 ? "No Transactions Yet" : "No Matches Found"}
                    description={transformedTransactions.length === 0
                      ? "Upload your first bank statement to start tracking your transactions."
                      : "Try adjusting your search or filter criteria."}
                    action={
                      transformedTransactions.length === 0 ? (
                        <Button
                          onClick={() => navigate('/onboarding/upload')}
                          bg="previa.sand"
                          color="previa.charcoal"
                          _hover={{ bg: "previa.sand", opacity: 0.9 }}
                        >
                          Upload Statement
                        </Button>
                      ) : (
                        <Button
                          onClick={handleClearMobileFilters}
                          variant="outline"
                          borderColor="previa.sand"
                          _hover={{ bg: "previa.sand", opacity: 0.1 }}
                        >
                          Clear Filters
                        </Button>
                      )
                    }
                    variant="outline"
                    minH="280px"
                  />
                ) : (
                  mobileFilteredTransactions.map((transaction) => (
                    <MobileTransactionCard
                      key={transaction.id}
                      transaction={transaction}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>

              {/* Mobile Pagination Info */}
              {!isLoading && mobileFilteredTransactions.length > 0 && (
                <div className="px-4 pb-4 text-center text-sm text-darkStone">
                  Showing {mobileFilteredTransactions.length} of {transformedTransactions.length} transactions
                </div>
              )}
            </div>

            {/* Desktop Data Table Card */}
            <Card className="hidden md:block bg-white border-sand">
              <CardHeader className="border-b border-stone/20">
                <TransactionTableToolbar
                  table={table}
                  onExport={handleExport}
                  onBatchDelete={handleBatchDelete}
                  onBatchCategorize={handleBatchCategorize}
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                />
              </CardHeader>

              <CardContent className="p-0">
                {/* Loading State */}
                {isLoading ? (
                  <div className="p-8 space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full bg-stone/10" />
                    ))}
                  </div>
                ) : transformedTransactions.length === 0 ? (
                  <div className="p-8">
                    <EmptyState
                      icon={<Receipt className="h-12 w-12" />}
                      title="No Transactions Yet"
                      description="Upload your first bank statement to start tracking and managing your transactions."
                      action={
                        <Button
                          onClick={() => navigate('/onboarding/upload')}
                          bg="previa.sand"
                          color="previa.charcoal"
                          _hover={{ bg: "previa.sand", opacity: 0.9 }}
                        >
                          Upload Statement
                        </Button>
                      }
                      variant="outline"
                      minH="320px"
                    />
                  </div>
                ) : (
                  <>
                    {/* Table */}
                    <div className="rounded-md border-none overflow-x-auto">
                      <Table>
                        <TableHeader>
                          {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                              key={headerGroup.id}
                              className="bg-cream/50 border-b border-stone/20 hover:bg-cream/50"
                            >
                              {headerGroup.headers.map((header) => (
                                <TableHead
                                  key={header.id}
                                  className="text-darkStone font-semibold"
                                >
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                      )}
                                </TableHead>
                              ))}
                            </TableRow>
                          ))}
                        </TableHeader>
                        <TableBody>
                          {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                              <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                                className="border-b border-stone/10 hover:bg-cream/30 data-[state=selected]:bg-sand/10"
                              >
                                {row.getVisibleCells().map((cell) => (
                                  <TableCell key={cell.id} className="py-4">
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center text-stone"
                              >
                                No matches found. Try adjusting your search or filters.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-stone/20">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-darkStone">
                          Rows per page
                        </p>
                        <Select
                          value={`${table.getState().pagination.pageSize}`}
                          onValueChange={(value) => {
                            table.setPageSize(Number(value));
                          }}
                        >
                          <SelectTrigger className="h-8 w-[70px] bg-white border-sand">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                          </SelectTrigger>
                          <SelectContent side="top" className="bg-cream border-sand">
                            {[10, 25, 50, 100].map((pageSize) => (
                              <SelectItem key={pageSize} value={`${pageSize}`}>
                                {pageSize}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="flex w-[100px] items-center justify-center text-sm text-darkStone">
                          Page {table.getState().pagination.pageIndex + 1} of{' '}
                          {table.getPageCount()}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            className="h-8 w-8 p-0 border-sand hover:bg-sand/20"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                          >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            className="h-8 w-8 p-0 border-sand hover:bg-sand/20"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                          >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-sm text-darkStone">
                        {table.getFilteredSelectedRowModel().rows.length} of{' '}
                        {table.getFilteredRowModel().rows.length} row(s) selected
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Edit Transaction Dialog */}
      <EditTransactionDialog
        transaction={editingTransaction}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSave}
      />
    </div>
  );
};

export default TransactionsView;

