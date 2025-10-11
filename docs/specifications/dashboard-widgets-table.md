# Dashboard Widgets & Table Specifications

**Version:** 1.0  
**Date:** 2025-01-13  
**Purpose:** Define data visualization and table components for Previa dashboard

---

## 1. Overview

This specification defines:

- Widget implementations for Home dashboard view
- Transaction table with advanced filtering/sorting
- Data queries and calculations
- Chart configurations using recharts library

---

## 2. Dashboard Widgets (Home View)

### 2.1 Widget Layout

**Desktop (>1024px):**

```
┌─────────────────────┬─────────────────────┐
│  Monthly Spending   │  Income vs Expenses │
│  (Line Chart)       │  (Bar Chart)        │
├─────────────────────┼─────────────────────┤
│  Unreconciled Alert │  Recent Transactions│
│  (Alert Card)       │  (Mini Table)       │
└─────────────────────┴─────────────────────┘
```

**Tablet/Mobile (<1024px):**

- Stacked vertically
- Full width cards
- Charts responsive to container width

---

## 3. Widget 1: Monthly Spending Chart

### 3.1 Purpose

Visualize daily or weekly spending trends for selected period.

### 3.2 Data Source

**Query:**

```sql
-- Daily spending aggregation
SELECT
  DATE_TRUNC('day', t.transaction_date) AS date,
  SUM(ABS(t.amount)) FILTER (WHERE t.amount < 0) AS spending
FROM transactions t
WHERE
  t.user_id = $1
  AND t.transaction_date >= $2 -- period_start
  AND t.transaction_date <= $3 -- period_end
  AND t.amount < 0 -- debits only
GROUP BY DATE_TRUNC('day', t.transaction_date)
ORDER BY date ASC;
```

**Returns:**

```typescript
interface DailySpending {
  date: string; // ISO 8601: YYYY-MM-DD
  spending: number;
}
```

### 3.3 Chart Configuration

**Type:** Line Chart (recharts `<LineChart>`)

**Components:**

```tsx
<LineChart data={dailySpending} width={400} height={300}>
  <CartesianGrid strokeDasharray="3 3" stroke="#D9C8B4" /> {/* Previa sand */}
  <XAxis
    dataKey="date"
    tickFormatter={(date) => format(new Date(date), 'MMM dd')}
    stroke="#595347" {/* Previa darkStone */}
  />
  <YAxis
    tickFormatter={(value) => `$${value.toFixed(0)}`}
    stroke="#595347"
  />
  <Tooltip
    contentStyle={{
      backgroundColor: '#F2E9D8', {/* Previa cream */}
      border: '1px solid #D9C8B4',
      borderRadius: '8px'
    }}
    formatter={(value) => [`$${value.toFixed(2)}`, 'Spending']}
  />
  <Line
    type="monotone"
    dataKey="spending"
    stroke="#595347" {/* Previa darkStone */}
    strokeWidth={2}
    dot={{ fill: '#595347', r: 4 }}
    activeDot={{ r: 6 }}
  />
</LineChart>
```

### 3.4 Period Selector

**Options:**

- This Month (default)
- Last 3 Months
- Last 6 Months
- This Year

**Component:** shadcn `<Select>`

**Implementation:**

```tsx
<Select value={period} onValueChange={setPeriod}>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="this_month">This Month</SelectItem>
    <SelectItem value="last_3_months">Last 3 Months</SelectItem>
    <SelectItem value="last_6_months">Last 6 Months</SelectItem>
    <SelectItem value="this_year">This Year</SelectItem>
  </SelectContent>
</Select>
```

### 3.5 Empty State

**Condition:** No transactions in selected period

**Display:**

- Empty chart area with dashed outline
- Message: "No spending data for this period"
- CTA: "Upload a bank statement"

### 3.6 Loading State

**Display:** Skeleton loader matching chart dimensions

---

## 4. Widget 2: Income vs Expenses

### 4.1 Purpose

Compare income and expenses for current month vs previous month.

### 4.2 Data Source

**Query:**

```sql
-- Monthly comparison
SELECT
  DATE_TRUNC('month', t.transaction_date) AS month,
  SUM(t.amount) FILTER (WHERE t.amount > 0) AS income,
  ABS(SUM(t.amount) FILTER (WHERE t.amount < 0)) AS expenses
FROM transactions t
WHERE
  t.user_id = $1
  AND t.transaction_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
  AND t.transaction_date < DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month')
GROUP BY DATE_TRUNC('month', t.transaction_date)
ORDER BY month DESC
LIMIT 2;
```

**Returns:**

```typescript
interface MonthlyComparison {
  month: string; // ISO 8601: YYYY-MM
  income: number;
  expenses: number;
}
```

### 4.3 Chart Configuration

**Type:** Grouped Bar Chart (recharts `<BarChart>`)

**Components:**

```tsx
<BarChart data={monthlyData} width={400} height={300}>
  <CartesianGrid strokeDasharray="3 3" stroke="#D9C8B4" />
  <XAxis
    dataKey="month"
    tickFormatter={(month) => format(new Date(month), 'MMM yyyy')}
    stroke="#595347"
  />
  <YAxis
    tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
    stroke="#595347"
  />
  <Tooltip
    contentStyle={{
      backgroundColor: '#F2E9D8',
      border: '1px solid #D9C8B4',
      borderRadius: '8px'
    }}
    formatter={(value) => `$${value.toFixed(2)}`}
  />
  <Legend />
  <Bar
    dataKey="income"
    fill="#10B981" {/* Success green */}
    radius={[8, 8, 0, 0]}
    name="Income"
  />
  <Bar
    dataKey="expenses"
    fill="#EF4444" {/* Error red */}
    radius={[8, 8, 0, 0]}
    name="Expenses"
  />
</BarChart>
```

### 4.4 Summary Card

**Below chart, display:**

```
Net: $1,234.56 (+15% vs last month)
```

- Green text if net > 0
- Red text if net < 0
- Percentage change from previous month

---

## 5. Widget 3: Unreconciled Items Alert

### 5.1 Purpose

Surface action items requiring user attention.

### 5.2 Data Source

**Query:**

```sql
-- Count unreconciled transactions
SELECT COUNT(*) AS unreconciled_count
FROM transactions t
WHERE
  t.user_id = $1
  AND t.status = 'unreconciled';
```

**Returns:**

```typescript
interface UnreconciledStats {
  unreconciled_count: number;
}
```

### 5.3 Component Design

**Type:** Alert Card (shadcn `<Alert>` with `variant="warning"`)

**Layout:**

```tsx
<Alert variant="warning">
  <AlertTriangle className="h-4 w-4" />
  <AlertTitle>Action Required</AlertTitle>
  <AlertDescription>
    {count} transactions need reconciliation
  </AlertDescription>
  <Button
    variant="outline"
    size="sm"
    onClick={() => navigate('/reconciliation')}
    className="mt-2"
  >
    Review Now
  </Button>
</Alert>
```

**Color Scheme:**

- Background: Amber tint (#FEF3C7)
- Border: Amber (#F59E0B)
- Icon: Amber (#F59E0B)

### 5.4 Conditional Display

**If count = 0:**

```tsx
<Alert>
  <CheckCircle className="h-4 w-4" />
  <AlertTitle>All Caught Up!</AlertTitle>
  <AlertDescription>
    All transactions are reconciled ✨
  </AlertDescription>
</Alert>
```

---

## 6. Widget 4: Recent Transactions

### 6.1 Purpose

Quick glance at most recent transaction activity.

### 6.2 Data Source

**Query:**

```sql
-- Recent transactions
SELECT
  t.id,
  t.transaction_date,
  t.description,
  t.amount,
  t.status
FROM transactions t
WHERE t.user_id = $1
ORDER BY t.transaction_date DESC, t.created_at DESC
LIMIT 5;
```

**Returns:**

```typescript
interface RecentTransaction {
  id: string;
  transaction_date: string;
  description: string;
  amount: number;
  status: 'unreconciled' | 'matched' | 'approved' | 'rejected';
}
```

### 6.3 Component Design

**Type:** Mini Table (shadcn `<Table>` compact variant)

**Columns:**

- Date (formatted: "Aug 15")
- Description (truncated to 30 chars)
- Amount (right-aligned, JetBrains Mono font)

**Styling:**

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Date</TableHead>
      <TableHead>Description</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {transactions.map((t) => (
      <TableRow key={t.id} className="hover:bg-previa-sand/20 cursor-pointer">
        <TableCell className="text-sm">
          {format(new Date(t.transaction_date), 'MMM dd')}
        </TableCell>
        <TableCell className="text-sm truncate max-w-[200px]">
          {t.description}
        </TableCell>
        <TableCell className="text-right font-financial text-sm">
          {formatCurrency(t.amount)}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

**Footer Link:**

```tsx
<Link
  to="/transactions"
  className="text-sm text-previa-darkStone hover:underline"
>
  View all transactions →
</Link>
```

### 6.4 Empty State

**Display:**

- Empty table with header
- Message: "No transactions yet"
- CTA: "Upload your first bank statement"

---

## 7. Transaction Table (Full View)

### 7.1 Purpose

Comprehensive transaction management with filtering, sorting, pagination, and bulk actions.

### 7.2 Table Configuration

**Library:** Tanstack Table v8 with shadcn Data Table pattern

**Column Definitions:**

```typescript
interface TransactionRow {
  id: string;
  transaction_date: Date;
  description: string;
  amount: number;
  category: string | null;
  status: 'unreconciled' | 'matched' | 'approved' | 'rejected';
  bank_account_name: string;
  receipt_attached: boolean;
}

const columns: ColumnDef<TransactionRow>[] = [
  // Checkbox column for bulk selection
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'transaction_date',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => format(row.getValue('transaction_date'), 'dd MMM yyyy'),
    sortingFn: 'datetime',
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate">
        {row.getValue('description')}
      </div>
    ),
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      return (
        <div className="text-right font-financial">
          <span className={amount < 0 ? 'text-red-600' : 'text-green-600'}>
            {formatCurrency(amount)}
          </span>
        </div>
      );
    },
    sortingFn: 'basic',
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.getValue('category') as string | null;
      return category ? (
        <Badge variant="outline">{category}</Badge>
      ) : (
        <span className="text-previa-stone text-sm">Uncategorized</span>
      );
    },
    filterFn: 'equals',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variants = {
        unreconciled: 'destructive',
        matched: 'warning',
        approved: 'success',
        rejected: 'secondary',
      };
      return (
        <Badge variant={variants[status]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
    filterFn: 'equals',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => viewDetails(row.original.id)}>
            View details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editCategory(row.original.id)}>
            Edit category
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => matchReceipt(row.original.id)}>
            Match receipt
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => deleteTransaction(row.original.id)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
```

### 7.3 Filtering

**Filter Types:**

1. **Date Range** (shadcn `<Popover>` + `<Calendar>`)
2. **Amount Range** (Dual slider input)
3. **Category** (Multi-select dropdown)
4. **Status** (Multi-select dropdown)
5. **Bank Account** (Single select dropdown)
6. **Text Search** (Description search input)

**Filter Implementation:**

```tsx
// Filter toolbar
<div className="flex items-center gap-2 mb-4">
  {/* Search */}
  <Input
    placeholder="Search descriptions..."
    value={table.getColumn('description')?.getFilterValue() as string}
    onChange={(e) =>
      table.getColumn('description')?.setFilterValue(e.target.value)
    }
    className="max-w-sm"
  />

  {/* Date range filter */}
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">
        <CalendarIcon className="mr-2 h-4 w-4" />
        {dateRange ? (
          `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}`
        ) : (
          'Select dates'
        )}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        mode="range"
        selected={dateRange}
        onSelect={setDateRange}
      />
    </PopoverContent>
  </Popover>

  {/* Status filter */}
  <Select
    value={statusFilter}
    onValueChange={(value) => {
      setStatusFilter(value);
      table.getColumn('status')?.setFilterValue(value === 'all' ? '' : value);
    }}
  >
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Filter by status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All statuses</SelectItem>
      <SelectItem value="unreconciled">Unreconciled</SelectItem>
      <SelectItem value="matched">Matched</SelectItem>
      <SelectItem value="approved">Approved</SelectItem>
      <SelectItem value="rejected">Rejected</SelectItem>
    </SelectContent>
  </Select>

  {/* Clear filters */}
  <Button
    variant="ghost"
    onClick={() => table.resetColumnFilters()}
    className="h-8 px-2 lg:px-3"
  >
    Reset
    <X className="ml-2 h-4 w-4" />
  </Button>
</div>
```

### 7.4 Pagination

**Strategy:** Server-side pagination for large datasets

**Configuration:**

```typescript
interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

const [pagination, setPagination] = useState<PaginationState>({
  pageIndex: 0,
  pageSize: 25,
});

// Query with pagination
const { data, isLoading } = useQuery({
  queryKey: ['transactions', pagination, filters],
  queryFn: () =>
    fetchTransactions({
      offset: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize,
      ...filters,
    }),
});
```

**UI Component:**

```tsx
<div className="flex items-center justify-between px-2">
  <div className="flex-1 text-sm text-muted-foreground">
    {table.getFilteredSelectedRowModel().rows.length} of{' '}
    {table.getFilteredRowModel().rows.length} row(s) selected.
  </div>
  <div className="flex items-center space-x-6 lg:space-x-8">
    <div className="flex items-center space-x-2">
      <p className="text-sm font-medium">Rows per page</p>
      <Select
        value={`${table.getState().pagination.pageSize}`}
        onValueChange={(value) => {
          table.setPageSize(Number(value));
        }}
      >
        <SelectTrigger className="h-8 w-[70px]">
          <SelectValue placeholder={table.getState().pagination.pageSize} />
        </SelectTrigger>
        <SelectContent side="top">
          {[10, 25, 50, 100].map((pageSize) => (
            <SelectItem key={pageSize} value={`${pageSize}`}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          />
        </PaginationItem>
        <PaginationItem>
          <span className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </div>
</div>
```

### 7.5 Bulk Actions

**Actions:**

- Approve selected (bulk approve matches)
- Categorize selected (apply category to multiple)
- Export selected (CSV export)
- Delete selected

**UI:**

```tsx
{table.getFilteredSelectedRowModel().rows.length > 0 && (
  <div className="flex items-center gap-2 mb-4">
    <Button
      variant="outline"
      size="sm"
      onClick={() => bulkApprove(table.getFilteredSelectedRowModel().rows)}
    >
      Approve Selected ({table.getFilteredSelectedRowModel().rows.length})
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => bulkCategorize(table.getFilteredSelectedRowModel().rows)}
    >
      Categorize
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => bulkExport(table.getFilteredSelectedRowModel().rows)}
    >
      Export
    </Button>
    <Button
      variant="destructive"
      size="sm"
      onClick={() => bulkDelete(table.getFilteredSelectedRowModel().rows)}
    >
      Delete
    </Button>
  </div>
)}
```

### 7.6 Column Visibility

**Toggle:**

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" size="sm">
      Columns
      <ChevronDown className="ml-2 h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    {table
      .getAllColumns()
      .filter((column) => column.getCanHide())
      .map((column) => {
        return (
          <DropdownMenuCheckboxItem
            key={column.id}
            className="capitalize"
            checked={column.getIsVisible()}
            onCheckedChange={(value) => column.toggleVisibility(!!value)}
          >
            {column.id}
          </DropdownMenuCheckboxItem>
        );
      })}
  </DropdownMenuContent>
</DropdownMenu>
```

### 7.7 Export Functionality

**Format:** CSV export

**Implementation:**

```typescript
function exportTransactionsToCSV(transactions: TransactionRow[]) {
  const headers = [
    'Date',
    'Description',
    'Amount',
    'Category',
    'Status',
    'Bank Account',
  ];

  const rows = transactions.map((t) => [
    format(t.transaction_date, 'yyyy-MM-dd'),
    t.description,
    t.amount.toFixed(2),
    t.category || 'Uncategorized',
    t.status,
    t.bank_account_name,
  ]);

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
}
```

---

## 8. Performance Optimization

### 8.1 Query Optimization

**Indexes:**

```sql
CREATE INDEX idx_transactions_user_date_status
  ON transactions(user_id, transaction_date DESC, status);

CREATE INDEX idx_transactions_user_amount
  ON transactions(user_id, amount);

CREATE INDEX idx_transactions_description_gin
  ON transactions USING gin(to_tsvector('english', description));
```

### 8.2 Data Caching

**Strategy:**

- Cache dashboard widgets for 5 minutes
- Invalidate on transaction updates
- Use React Query for automatic cache management

```typescript
const { data: monthlySpending } = useQuery({
  queryKey: ['monthly-spending', userId, period],
  queryFn: () => fetchMonthlySpending(userId, period),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### 8.3 Virtualization

**For large tables (>1000 rows):** Use `@tanstack/react-virtual` for row virtualization

---

## 9. Responsive Design

### 9.1 Chart Responsiveness

**Container queries:**

```tsx
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    {/* Chart components */}
  </LineChart>
</ResponsiveContainer>
```

### 9.2 Mobile Table View

**Approach:** Convert table to card list on mobile

```tsx
<div className="hidden md:block">
  {/* Desktop table */}
  <DataTable columns={columns} data={data} />
</div>

<div className="md:hidden space-y-2">
  {/* Mobile card list */}
  {data.map((transaction) => (
    <Card key={transaction.id}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">{transaction.description}</p>
            <p className="text-sm text-muted-foreground">
              {format(transaction.transaction_date, 'MMM dd, yyyy')}
            </p>
          </div>
          <p className="font-financial font-medium">
            {formatCurrency(transaction.amount)}
          </p>
        </div>
        <div className="mt-2 flex gap-2">
          <Badge variant="outline">{transaction.category || 'Uncategorized'}</Badge>
          <Badge>{transaction.status}</Badge>
        </div>
      </CardContent>
    </Card>
  ))}
</div>
```

---

## 10. Testing Requirements

### 10.1 Widget Tests

**Test Cases:**

- Empty state rendering
- Loading state rendering
- Data display accuracy
- Period selector functionality
- Chart interactions (hover, tooltips)
- Responsive layout

### 10.2 Table Tests

**Test Cases:**

- Column sorting (ascending/descending)
- Filtering (all filter types)
- Pagination (next/previous, page size change)
- Row selection (single, multiple, all)
- Bulk actions execution
- Export functionality
- Column visibility toggle
- Mobile responsiveness

---

**End of Specification**
