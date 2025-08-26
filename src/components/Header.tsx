import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Store, BarChart3, Plus, Flame, MapPin, Heart } from 'lucide-react';
import { AuthButton } from './AuthButton';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  showNavigation?: boolean;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export function Header({ showNavigation = true, activeSection, onSectionChange }: HeaderProps) {
  const { user, profile, isCustomer, isMerchant } = useAuth();

  const navigationItems = [
    { id: 'home', label: 'Home' },
    { id: 'hot-deals', label: 'Hot Deals' },
    { id: 'local-deals', label: 'Local Deals' },
    { id: 'store-list', label: 'Store List' }
  ];

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-primary/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link 
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img 
                src="/lovable-uploads/3c633683-8c9d-4ff2-ace7-6658272f2afd.png" 
                alt="Namma OOru Offers Logo" 
                className="w-12 h-12 rounded-lg"
              />
              <div>
                <h1 className="text-xl font-bold bg-blue-orange-gradient bg-clip-text text-transparent">
                  Namma OOru Offers
                </h1>
                <p className="text-xs text-muted-foreground">Your Local Savings Hub</p>
              </div>
            </Link>
            
            {/* Navigation Links - only show on home page */}
            {showNavigation && onSectionChange && (
              <nav className="hidden md:flex items-center gap-6">
                {user && isMerchant ? (
                  // Merchant navigation - only Dashboard and Post Offer
                  <>
                    <Link 
                      to="/merchant-dashboard"
                      className="text-sm font-medium transition-colors hover:text-orange-500 text-blue-600 flex items-center gap-1"
                    >
                      <BarChart3 className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link 
                      to="/merchant-post-offer"
                      className="text-sm font-medium transition-colors hover:text-orange-500 text-blue-600 flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Post Offer
                    </Link>
                  </>
                ) : (
                  // Customer/Guest navigation - show all navigation items
                  <>
                    {navigationItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onSectionChange(item.id)}
                        className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                          activeSection === item.id 
                            ? 'text-orange-500 border-b-2 border-orange-500 pb-1' 
                            : 'text-blue-600'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                    {user && isCustomer && (
                      <>
                        <Link 
                          to="/your-offers"
                          className="text-sm font-medium transition-colors hover:text-orange-500 text-blue-600 flex items-center gap-1"
                        >
                          <Gift className="h-4 w-4" />
                          Your Offers
                        </Link>
                        <Link 
                          to="/customer-analytics"
                          className="text-sm font-medium transition-colors hover:text-orange-500 text-blue-600 flex items-center gap-1"
                        >
                          <BarChart3 className="h-4 w-4" />
                          Analytics
                        </Link>
                      </>
                    )}
                  </>
                )}
              </nav>
            )}

            {/* Authenticated user navigation for other pages */}
            {!showNavigation && user && (
              <nav className="hidden md:flex items-center gap-6">
                <Link 
                  to="/"
                  className="text-sm font-medium transition-colors hover:text-orange-500 text-blue-600"
                >
                  Home
                </Link>
                {isCustomer && (
                  <>
                    <Link 
                      to="/your-offers"
                      className="text-sm font-medium transition-colors hover:text-orange-500 text-blue-600 flex items-center gap-1"
                    >
                      <Gift className="h-4 w-4" />
                      Your Offers
                    </Link>
                    <Link 
                      to="/customer-analytics"
                      className="text-sm font-medium transition-colors hover:text-orange-500 text-blue-600 flex items-center gap-1"
                    >
                      <BarChart3 className="h-4 w-4" />
                      Analytics
                    </Link>
                  </>
                )}
                {isMerchant && (
                  <>
                    <Link 
                      to="/merchant-dashboard"
                      className="text-sm font-medium transition-colors hover:text-orange-500 text-blue-600 flex items-center gap-1"
                    >
                      <BarChart3 className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link 
                      to="/merchant-post-offer"
                      className="text-sm font-medium transition-colors hover:text-orange-500 text-blue-600 flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Post Offer
                    </Link>
                  </>
                )}
              </nav>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}