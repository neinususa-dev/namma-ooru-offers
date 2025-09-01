import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'hot-deals', label: 'Hot Deals' },
    { id: 'local-deals', label: 'Local Deals' },
    { id: 'store-list', label: 'Store List' },
    { id: 'rewards', label: 'Rewards' }
  ];

  return (
    <div className="w-full bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <div className="flex gap-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "h-12 px-6 py-2 text-base font-medium transition-smooth rounded-lg",
                  "text-primary hover:text-secondary hover:bg-secondary/10 focus:text-secondary focus:bg-secondary/10",
                  activeSection === item.id && "text-secondary bg-secondary/10 border-b-2 border-secondary"
                )}
                onClick={() => onSectionChange(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};