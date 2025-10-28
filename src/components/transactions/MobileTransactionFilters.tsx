/**
 * MobileTransactionFilters - Bottom sheet filters for mobile
 * 
 * Features:
 * - Touch-optimized controls (48px+ height)
 * - Status checkboxes
 * - Category multi-select
 * - Clear all filters button
 */

import React from 'react';
import { Button } from '@/components/chakra-ui/button';
import { Checkbox } from '@/components/chakra-ui/checkbox';
import { Label } from '@/components/chakra-ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/chakra-ui/sheet';
import { Filter, X } from 'lucide-react';
import { Badge } from '@/components/chakra-ui/badge';

interface MobileTransactionFiltersProps {
  statusFilters: string[];
  categoryFilters: string[];
  availableStatuses: string[];
  availableCategories: string[];
  onStatusChange: (statuses: string[]) => void;
  onCategoryChange: (categories: string[]) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export function MobileTransactionFilters({
  statusFilters,
  categoryFilters,
  availableStatuses,
  availableCategories,
  onStatusChange,
  onCategoryChange,
  onClearFilters,
  activeFilterCount,
}: MobileTransactionFiltersProps) {
  const handleStatusToggle = (status: string) => {
    if (statusFilters.includes(status)) {
      onStatusChange(statusFilters.filter((s) => s !== status));
    } else {
      onStatusChange([...statusFilters, status]);
    }
  };

  const handleCategoryToggle = (category: string) => {
    if (categoryFilters.includes(category)) {
      onCategoryChange(categoryFilters.filter((c) => c !== category));
    } else {
      onCategoryChange([...categoryFilters, category]);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="w-full sm:w-auto h-12 border-sand hover:bg-sand/20 relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2 h-5 px-1.5 bg-sand text-charcoal text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="bg-cream max-h-[85vh]">
        <SheetHeader>
          <SheetTitle className="text-charcoal">Filter Transactions</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6 overflow-y-auto max-h-[calc(85vh-180px)]">
          {/* Status Filters */}
          <div>
            <h3 className="text-sm font-semibold text-charcoal mb-3">Status</h3>
            <div className="space-y-3">
              {availableStatuses.map((status) => (
                <div key={status} className="flex items-center space-x-3 min-h-[48px]">
                  <Checkbox
                    id={`status-${status}`}
                    checked={statusFilters.includes(status)}
                    onCheckedChange={() => handleStatusToggle(status)}
                    className="data-[state=checked]:bg-sand data-[state=checked]:border-sand min-h-[24px] min-w-[24px]"
                  />
                  <Label
                    htmlFor={`status-${status}`}
                    className="text-base text-charcoal capitalize cursor-pointer flex-1 py-3"
                  >
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Category Filters */}
          {availableCategories.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-charcoal mb-3">Category</h3>
              <div className="space-y-3">
                {availableCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-3 min-h-[48px]">
                    <Checkbox
                      id={`category-${category}`}
                      checked={categoryFilters.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                      className="data-[state=checked]:bg-sand data-[state=checked]:border-sand min-h-[24px] min-w-[24px]"
                    />
                    <Label
                      htmlFor={`category-${category}`}
                      className="text-base text-charcoal cursor-pointer flex-1 py-3"
                    >
                      {category || 'Uncategorized'}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="mt-6 flex-col gap-2 sm:flex-col">
          <Button
            variant="outline"
            onClick={onClearFilters}
            disabled={activeFilterCount === 0}
            className="w-full h-12 border-sand hover:bg-sand/20"
          >
            <X className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

