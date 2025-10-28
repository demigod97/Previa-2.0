import React from 'react';
import { Transaction } from '@/types/financial';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/chakra-ui/dialog';
import { Button } from '@/components/chakra-ui/button';
import { Input } from '@/components/chakra-ui/input';
import { Label } from '@/components/chakra-ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/chakra-ui/select';
import { Calendar } from '@/components/chakra-ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/chakra-ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EditTransactionDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (transaction: Transaction) => void;
}

export function EditTransactionDialog({
  transaction,
  open,
  onOpenChange,
  onSave,
}: EditTransactionDialogProps) {
  const [formData, setFormData] = React.useState<Partial<Transaction>>({});
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);

  React.useEffect(() => {
    if (transaction) {
      setFormData({
        id: transaction.id,
        date: transaction.date,
        description: transaction.description,
        amount: transaction.amount,
        category: transaction.category,
        status: transaction.status,
      });
      setSelectedDate(new Date(transaction.date));
    }
  }, [transaction]);

  const handleSave = () => {
    if (transaction && formData) {
      onSave({
        ...transaction,
        ...formData,
        date: selectedDate?.toISOString() || transaction.date,
      } as Transaction);
      onOpenChange(false);
    }
  };

  const categories = [
    'Groceries',
    'Dining',
    'Transport',
    'Entertainment',
    'Utilities',
    'Healthcare',
    'Shopping',
    'Other',
  ];

  const statuses = [
    { value: 'unreconciled', label: 'Unreconciled' },
    { value: 'matched', label: 'Matched' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-cream border-sand">
        <DialogHeader>
          <DialogTitle className="text-charcoal">Edit Transaction</DialogTitle>
          <DialogDescription className="text-stone">
            Make changes to the transaction details below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Date Picker */}
          <div className="grid gap-2">
            <Label htmlFor="date" className="text-charcoal">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'justify-start text-left font-normal border-sand hover:bg-sand/20',
                    !selectedDate && 'text-stone'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-darkStone" />
                  {selectedDate ? (
                    format(selectedDate, 'dd/MM/yyyy')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-cream border-sand" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className="bg-cream"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-charcoal">
              Description
            </Label>
            <Input
              id="description"
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-white border-sand focus:ring-sand text-charcoal"
              placeholder="Enter description"
            />
          </div>

          {/* Amount */}
          <div className="grid gap-2">
            <Label htmlFor="amount" className="text-charcoal">
              Amount (AUD)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount || ''}
              onChange={(e) =>
                setFormData({ ...formData, amount: parseFloat(e.target.value) })
              }
              className="bg-white border-sand focus:ring-sand text-charcoal font-mono"
              placeholder="0.00"
            />
            <p className="text-xs text-stone">
              Use negative values for expenses, positive for income
            </p>
          </div>

          {/* Category */}
          <div className="grid gap-2">
            <Label htmlFor="category" className="text-charcoal">
              Category
            </Label>
            <Select
              value={formData.category || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger className="bg-white border-sand focus:ring-sand text-charcoal">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-cream border-sand">
                {categories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="hover:bg-sand cursor-pointer"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="grid gap-2">
            <Label htmlFor="status" className="text-charcoal">
              Status
            </Label>
            <Select
              value={formData.status || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger className="bg-white border-sand focus:ring-sand text-charcoal">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-cream border-sand">
                {statuses.map((status) => (
                  <SelectItem
                    key={status.value}
                    value={status.value}
                    className="hover:bg-sand cursor-pointer"
                  >
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-stone hover:bg-stone/10 text-charcoal"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-sand hover:bg-sand/90 text-charcoal"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

