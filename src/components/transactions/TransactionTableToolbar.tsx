import { Table } from '@tanstack/react-table';
import { X, Search, Filter, Download, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/chakra-ui/button';
import { Input } from '@/components/chakra-ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/chakra-ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/chakra-ui/popover';
import { Calendar } from '@/components/chakra-ui/calendar';
import { Badge } from '@/components/chakra-ui/badge';
import { Transaction } from '@/types/financial';
import { format } from 'date-fns';
import React from 'react';

interface TransactionTableToolbarProps<TData> {
  table: Table<TData>;
  onExport?: () => void;
  onBatchDelete?: () => void;
  onBatchCategorize?: () => void;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export function TransactionTableToolbar<TData extends Transaction>({
  table,
  onExport,
  onBatchDelete,
  onBatchCategorize,
  globalFilter,
  setGlobalFilter,
}: TransactionTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;

  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const statusOptions = [
    { value: 'unreconciled', label: 'Unreconciled' },
    { value: 'matched', label: 'Matched' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const categoryOptions = [
    'Groceries',
    'Dining',
    'Transport',
    'Entertainment',
    'Utilities',
    'Healthcare',
    'Shopping',
    'Other',
  ];

  return (
    <div className="space-y-4">
      {/* Top Row: Search and Primary Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone pointer-events-none" />
          <Input
            placeholder="Search transactions..."
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-10 bg-card border-previa-sand focus:ring-previa-sand text-previa-charcoal"
            paddingLeft="2.5rem"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          {/* Filters Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-sand hover:bg-sand/20 text-charcoal"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {isFiltered && (
                  <Badge className="ml-2 bg-sand text-charcoal">
                    {table.getState().columnFilters.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-cream border-sand" align="end">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-charcoal mb-2">Status</h4>
                  <div className="space-y-2">
                    {statusOptions.map((status) => {
                      const column = table.getColumn('status');
                      const filterValue = (column?.getFilterValue() as string[]) || [];
                      return (
                        <label
                          key={status.value}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filterValue.includes(status.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                column?.setFilterValue([...filterValue, status.value]);
                              } else {
                                column?.setFilterValue(
                                  filterValue.filter((v) => v !== status.value)
                                );
                              }
                            }}
                            className="rounded border-stone text-sand focus:ring-sand"
                          />
                          <span className="text-sm text-charcoal">{status.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-charcoal mb-2">Category</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {categoryOptions.map((category) => {
                      const column = table.getColumn('category');
                      const filterValue = (column?.getFilterValue() as string[]) || [];
                      return (
                        <label
                          key={category}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filterValue.includes(category)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                column?.setFilterValue([...filterValue, category]);
                              } else {
                                column?.setFilterValue(
                                  filterValue.filter((v) => v !== category)
                                );
                              }
                            }}
                            className="rounded border-stone text-sand focus:ring-sand"
                          />
                          <span className="text-sm text-charcoal">{category}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Export Button */}
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="border-sand hover:bg-sand/20 text-charcoal"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}

          {/* View Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-sand hover:bg-sand/20 text-charcoal"
              >
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-cream border-sand w-48">
              <DropdownMenuLabel className="text-charcoal">Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-stone" />
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== 'undefined' && column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize hover:bg-sand"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filters */}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3 hover:bg-sand/20 text-charcoal"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Batch Actions Row (shows when items selected) */}
      {selectedRowCount > 0 && (
        <div className="flex items-center gap-4 bg-sand/10 border border-sand rounded-lg p-3">
          <span className="text-sm font-medium text-charcoal">
            {selectedRowCount} row(s) selected
          </span>
          <div className="flex gap-2 ml-auto">
            {onBatchCategorize && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBatchCategorize}
                className="border-sand hover:bg-sand text-charcoal"
              >
                <Tag className="mr-2 h-4 w-4" />
                Categorize
              </Button>
            )}
            {onBatchDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBatchDelete}
                className="border-red-300 hover:bg-red-50 text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

