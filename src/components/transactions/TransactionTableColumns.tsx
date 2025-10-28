import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/chakra-ui/button';
import { Badge } from '@/components/chakra-ui/badge';
import { Checkbox } from '@/components/chakra-ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/chakra-ui/dropdown-menu';
import { Transaction } from '@/types/financial';
import { format } from 'date-fns';

interface TransactionColumnProps {
  onView: (transaction: Transaction) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export const createTransactionColumns = ({
  onView,
  onEdit,
  onDelete,
}: TransactionColumnProps): ColumnDef<Transaction>[] => [
  // Checkbox column
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="border-stone data-[state=checked]:bg-sand data-[state=checked]:border-sand"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-stone data-[state=checked]:bg-sand data-[state=checked]:border-sand"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // Date column
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-cream text-charcoal"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      return (
        <div className="text-sm text-charcoal">
          {format(date, 'dd/MM/yyyy')}
        </div>
      );
    },
  },

  // Description column
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string;
      return (
        <div className="max-w-[300px] truncate text-charcoal">
          {description}
        </div>
      );
    },
  },

  // Amount column
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-cream text-charcoal"
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
      }).format(Math.abs(amount));

      return (
        <div
          className={`text-right font-mono font-bold ${
            amount < 0 ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {amount < 0 ? '-' : '+'}
          {formatted}
        </div>
      );
    },
  },

  // Category column
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.getValue('category') as string | null;
      if (!category) {
        return <span className="text-stone text-sm italic">Uncategorized</span>;
      }
      return (
        <Badge variant="secondary" className="bg-sand/20 text-darkStone border-sand">
          {category}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  // Status column
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusConfig = {
        unreconciled: {
          label: 'Unreconciled',
          className: 'bg-red-100 text-red-800 border-red-300',
        },
        matched: {
          label: 'Matched',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        },
        approved: {
          label: 'Approved',
          className: 'bg-green-100 text-green-800 border-green-300',
        },
        rejected: {
          label: 'Rejected',
          className: 'bg-gray-100 text-gray-800 border-gray-300',
        },
      };

      const config = statusConfig[status as keyof typeof statusConfig] || {
        label: status,
        className: 'bg-gray-100 text-gray-800',
      };

      return <Badge className={config.className}>{config.label}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  // Actions column
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-cream"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 text-darkStone" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-cream border-sand">
            <DropdownMenuLabel className="text-charcoal">Actions</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-stone" />
            <DropdownMenuItem
              onClick={() => onView(transaction)}
              className="hover:bg-sand cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onEdit(transaction)}
              className="hover:bg-sand cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit transaction
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-stone" />
            <DropdownMenuItem
              onClick={() => onDelete(transaction)}
              className="text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

