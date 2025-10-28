import React, { useMemo, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, GridApi, ColumnApi } from 'ag-grid-community';
import { Box } from '@chakra-ui/react';
import { Transaction } from '@/types/financial';
import { format } from 'date-fns';
import { Badge } from '@/components/chakra-ui/badge';
import '@/theme/ag-grid-theme.css';
import 'ag-grid-community/styles/ag-grid.css';

// Import enterprise features for Excel export
import 'ag-grid-enterprise';

interface TransactionGridProps {
  transactions: Transaction[];
  loading?: boolean;
  onView?: (transaction: Transaction) => void;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

/**
 * AG-Grid-based transaction table component
 *
 * Features:
 * - Enterprise-grade grid with sorting, filtering, pagination
 * - Custom cell renderers for financial amounts and status badges
 * - Excel/CSV export functionality
 * - Responsive design with Previa theme
 * - High performance with large datasets (1000+ rows)
 */
export function TransactionGrid({
  transactions,
  loading = false,
  onView,
  onEdit,
  onDelete,
}: TransactionGridProps) {
  const gridRef = useRef<AgGridReact>(null);
  const gridApiRef = useRef<GridApi | null>(null);

  // Status badge cell renderer
  const StatusBadgeRenderer = useCallback((props: any) => {
    const status = props.value as string;
    const statusConfig: Record<string, { label: string; colorScheme: string }> = {
      unreconciled: { label: 'Unreconciled', colorScheme: 'red' },
      matched: { label: 'Matched', colorScheme: 'yellow' },
      approved: { label: 'Approved', colorScheme: 'green' },
      rejected: { label: 'Rejected', colorScheme: 'gray' },
    };

    const config = statusConfig[status] || { label: status, colorScheme: 'gray' };

    return (
      <Badge colorScheme={config.colorScheme} variant="subtle">
        {config.label}
      </Badge>
    );
  }, []);

  // Category badge cell renderer
  const CategoryBadgeRenderer = useCallback((props: any) => {
    const category = props.value as string | null;

    if (!category) {
      return (
        <span style={{ color: '#8C877D', fontStyle: 'italic', fontSize: '14px' }}>
          Uncategorized
        </span>
      );
    }

    return (
      <Badge variant="outline" colorScheme="gray">
        {category}
      </Badge>
    );
  }, []);

  // Date cell renderer
  const DateRenderer = useCallback((props: any) => {
    const date = props.value ? new Date(props.value) : null;
    return date ? format(date, 'dd/MM/yyyy') : '';
  }, []);

  // Amount cell renderer with color coding
  const AmountRenderer = useCallback((props: any) => {
    const amount = parseFloat(props.value || 0);
    const formatted = new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(Math.abs(amount));

    const color = amount < 0 ? '#EF4444' : '#10B981';
    const sign = amount < 0 ? '-' : '+';

    return (
      <span style={{ color, fontWeight: 600 }}>
        {sign}{formatted}
      </span>
    );
  }, []);

  // Column definitions
  const columnDefs: ColDef[] = useMemo(() => [
    {
      field: 'transaction_date',
      headerName: 'Date',
      sortable: true,
      filter: 'agDateColumnFilter',
      width: 130,
      cellRenderer: DateRenderer,
    },
    {
      field: 'description',
      headerName: 'Description',
      sortable: true,
      filter: 'agTextColumnFilter',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      sortable: true,
      filter: 'agNumberColumnFilter',
      width: 150,
      type: 'rightAligned',
      cellClass: 'financial-amount',
      cellRenderer: AmountRenderer,
    },
    {
      field: 'category',
      headerName: 'Category',
      sortable: true,
      filter: 'agTextColumnFilter',
      width: 160,
      cellRenderer: CategoryBadgeRenderer,
    },
    {
      field: 'status',
      headerName: 'Status',
      sortable: true,
      filter: 'agSetColumnFilter',
      width: 150,
      cellRenderer: StatusBadgeRenderer,
    },
  ], [DateRenderer, AmountRenderer, CategoryBadgeRenderer, StatusBadgeRenderer]);

  // Default column definition
  const defaultColDef: ColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
  }), []);

  // Handle grid ready
  const onGridReady = useCallback((params: GridReadyEvent) => {
    gridApiRef.current = params.api;
  }, []);

  // Export to CSV
  const exportToCsv = useCallback(() => {
    if (gridApiRef.current) {
      gridApiRef.current.exportDataAsCsv({
        fileName: `transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`,
      });
    }
  }, []);

  // Export to Excel
  const exportToExcel = useCallback(() => {
    if (gridApiRef.current) {
      gridApiRef.current.exportDataAsExcel({
        fileName: `transactions-${format(new Date(), 'yyyy-MM-dd')}.xlsx`,
      });
    }
  }, []);

  // Expose export functions via ref (for toolbar integration)
  React.useImperativeHandle(gridRef, () => ({
    exportToCsv,
    exportToExcel,
  }));

  return (
    <Box className="ag-theme-previa" h="600px" w="full">
      <AgGridReact
        ref={gridRef}
        rowData={transactions}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={50}
        paginationPageSizeSelector={[25, 50, 100, 200]}
        domLayout="normal"
        rowSelection="multiple"
        suppressRowClickSelection={true}
        onGridReady={onGridReady}
        loading={loading}
        animateRows={true}
        enableCellTextSelection={true}
        ensureDomOrder={true}
        suppressCellFocus={false}
      />
    </Box>
  );
}

export default TransactionGrid;
