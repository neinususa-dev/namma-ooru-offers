import React from 'react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
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
        <NavigationMenu className="max-w-full justify-center">
          <NavigationMenuList className="gap-1">
            {menuItems.map((item) => (
              <NavigationMenuItem key={item.id}>
                <NavigationMenuLink
                  className={cn(
                    "group inline-flex h-12 w-max items-center justify-center rounded-lg px-6 py-2 text-base font-medium transition-smooth cursor-pointer",
                    "text-primary hover:text-secondary hover:bg-secondary/10 focus:text-secondary focus:bg-secondary/10 focus:outline-none",
                    activeSection === item.id && "text-secondary bg-secondary/10 border-b-2 border-secondary"
                  )}
                  onClick={() => onSectionChange(item.id)}
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};