import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'food', name: 'Food & Dining' },
  { id: 'fashion', name: 'Fashion & Clothing' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'services', name: 'Services' },
  { id: 'groceries', name: 'Groceries' },
  { id: 'health', name: 'Health & Beauty' },
  { id: 'travel', name: 'Travel & Transport' },
  { id: 'education', name: 'Education' },
];

interface OfferFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onClearFilters: () => void;
}

export const OfferFilters: React.FC<OfferFiltersProps> = ({
  selectedCategory,
  onCategoryChange,
  onClearFilters
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card p-4 rounded-lg shadow-md border border-primary/10">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Filter className="h-4 w-4 text-primary" />
          Filter by:
        </div>
        
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-48 bg-background border-primary/20 focus:border-primary">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-card border-primary/20 shadow-xl">
            {categories.map((category) => (
              <SelectItem 
                key={category.id} 
                value={category.id}
                className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer"
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button 
        variant="outline" 
        onClick={onClearFilters}
        className="text-sm border-primary/20 hover:bg-primary/5 hover:border-primary/40"
      >
        Clear Filters
      </Button>
    </div>
  );
};