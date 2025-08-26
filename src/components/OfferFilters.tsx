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
    <Select value={selectedCategory} onValueChange={onCategoryChange}>
      <SelectTrigger className="w-full bg-card shadow-md hover:shadow-lg transition-smooth border-primary/20 focus:border-primary">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <SelectValue placeholder="Select category" />
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-80 bg-card border-primary/20 shadow-xl">
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
  );
};