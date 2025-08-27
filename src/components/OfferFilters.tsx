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
import { useCategories } from '@/hooks/useCategories';

const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

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
  const { categories, loading } = useCategories();

  return (
    <Select value={selectedCategory} onValueChange={onCategoryChange}>
      <SelectTrigger className="w-full bg-card shadow-md hover:shadow-lg transition-smooth border-primary/20 focus:border-primary">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <SelectValue placeholder="Select category" />
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-80 bg-card border-primary/20 shadow-xl">
        <SelectItem 
          value="all"
          className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer"
        >
          All Categories
        </SelectItem>
        {loading ? (
          <SelectItem value="loading" disabled>Loading categories...</SelectItem>
        ) : (
          categories.map((category) => (
            <SelectItem 
              key={category.id} 
              value={category.name}
              className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer"
            >
              {capitalizeFirst(category.name)}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};