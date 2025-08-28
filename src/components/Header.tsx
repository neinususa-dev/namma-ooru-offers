import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gift, Store, BarChart3, Plus, Flame, MapPin, Heart, Menu, X } from 'lucide-react';
import { AuthButton } from './AuthButton';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface HeaderProps {
  showNavigation?: boolean;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export function Header({ showNavigation = true, activeSection, onSectionChange }: HeaderProps) {
  const { user, profile, isCustomer, isMerchant } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home' },
    { id: 'hot-deals', label: 'Hot Deals' },
    { id: 'local-deals', label: 'Local Deals' },
    { id: 'store-list', label: 'Store List' },
    { id: 'rewards', label: 'Rewards', link: '/rewards' }
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
                        item.link ? (
                          <Link
                            key={item.id}
                            to={item.link}
                            className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                              location.pathname === item.link
                                ? 'text-orange-500 border-b-2 border-orange-500 pb-1' 
                                : 'text-blue-600'
                            }`}
                          >
                            {item.label}
                          </Link>
                        ) : (
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
                        )
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
               
                {isCustomer && (
                  <>
                     <Link 
                  to="/"
                  className="text-sm font-medium transition-colors hover:text-orange-500 text-blue-600"
                >
                  Home
                </Link>
                    <Link
                      to="/?section=hot-deals"
                      className="text-sm font-medium transition-colors hover:text-orange-500 text-blue-600"
                    >
                      Hot Deals
                    </Link>
                    <Link
                      to="/?section=local-deals"
                      className="text-sm font-medium transition-colors hover:text-orange-500 text-blue-600"
                    >
                      Local Deals
                    </Link>
                    <Link
                      to="/?section=store-list"
                      className="text-sm font-medium transition-colors hover:text-orange-500 text-blue-600"
                    >
                      Store List
                    </Link>
                     <Link 
                       to="/your-offers"
                       className="text-sm font-medium transition-colors hover:text-orange-500 text-blue-600 flex items-center gap-1"
                     >
                       <Gift className="h-4 w-4" />
                       Your Offers
                     </Link>
                     <Link 
                       to="/rewards"
                       className={`text-sm font-medium transition-colors hover:text-orange-500 flex items-center gap-1 ${
                         location.pathname === '/rewards'
                           ? 'text-orange-500 border-b-2 border-orange-500 pb-1' 
                           : 'text-blue-600'
                       }`}
                     >
                       <Heart className="h-4 w-4" />
                       Rewards
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
            {/* Mobile Menu Button */}
            {isMobile && (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
                    <Menu className="h-6 w-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
                      <div className="flex items-center gap-3">
                        <img 
                          src="/lovable-uploads/3c633683-8c9d-4ff2-ace7-6658272f2afd.png" 
                          alt="Logo" 
                          className="w-10 h-10 rounded-lg"
                        />
                        <div>
                          <h2 className="font-bold text-lg bg-blue-orange-gradient bg-clip-text text-transparent">
                            Namma OOru Offers
                          </h2>
                          <p className="text-xs text-muted-foreground">Your Local Savings Hub</p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 p-6 space-y-4">
                      {showNavigation && onSectionChange && (
                        <>
                          {user && isMerchant ? (
                            // Merchant navigation
                            <div className="space-y-3">
                              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Merchant</h3>
                              <Link 
                                to="/merchant-dashboard"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-foreground"
                              >
                                <BarChart3 className="h-5 w-5 text-primary" />
                                <span className="font-medium">Dashboard</span>
                              </Link>
                              <Link 
                                to="/merchant-post-offer"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-foreground"
                              >
                                <Plus className="h-5 w-5 text-primary" />
                                <span className="font-medium">Post Offer</span>
                              </Link>
                            </div>
                          ) : (
                            // Customer/Guest navigation
                            <div className="space-y-3">
                              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Explore</h3>
                              {navigationItems.map((item) => (
                                item.link ? (
                                  <Link
                                    key={item.id}
                                    to={item.link}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                      location.pathname === item.link
                                        ? 'bg-primary/10 text-primary border border-primary/20' 
                                        : 'hover:bg-muted/50 text-foreground'
                                    }`}
                                  >
                                    <Heart className="h-5 w-5" />
                                    <span className="font-medium">{item.label}</span>
                                  </Link>
                                ) : (
                                  <button
                                    key={item.id}
                                    onClick={() => {
                                      onSectionChange(item.id);
                                      setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                      activeSection === item.id 
                                        ? 'bg-primary/10 text-primary border border-primary/20' 
                                        : 'hover:bg-muted/50 text-foreground'
                                    }`}
                                  >
                                    {item.id === 'hot-deals' && <Flame className="h-5 w-5" />}
                                    {item.id === 'local-deals' && <MapPin className="h-5 w-5" />}
                                    {item.id === 'store-list' && <Store className="h-5 w-5" />}
                                    {item.id === 'home' && <Gift className="h-5 w-5" />}
                                    <span className="font-medium">{item.label}</span>
                                  </button>
                                )
                              ))}
                              
                              {user && isCustomer && (
                                <>
                                  <div className="border-t border-border pt-3 mt-3">
                                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Account</h3>
                                  </div>
                                  <Link 
                                    to="/your-offers"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-foreground"
                                  >
                                    <Gift className="h-5 w-5 text-primary" />
                                    <span className="font-medium">Your Offers</span>
                                  </Link>
                                  <Link 
                                    to="/customer-analytics"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-foreground"
                                  >
                                    <BarChart3 className="h-5 w-5 text-primary" />
                                    <span className="font-medium">Analytics</span>
                                  </Link>
                                </>
                              )}
                            </div>
                          )}
                        </>
                      )}

                      {/* Other pages navigation */}
                      {!showNavigation && user && (
                        <div className="space-y-3">
                          {isCustomer && (
                            <>
                              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Navigate</h3>
                              <Link 
                                to="/"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-foreground"
                              >
                                <Gift className="h-5 w-5 text-primary" />
                                <span className="font-medium">Home</span>
                              </Link>
                              <Link
                                to="/?section=hot-deals"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-foreground"
                              >
                                <Flame className="h-5 w-5 text-primary" />
                                <span className="font-medium">Hot Deals</span>
                              </Link>
                              <Link
                                to="/?section=local-deals"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-foreground"
                              >
                                <MapPin className="h-5 w-5 text-primary" />
                                <span className="font-medium">Local Deals</span>
                              </Link>
                              <Link
                                to="/?section=store-list"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-foreground"
                              >
                                <Store className="h-5 w-5 text-primary" />
                                <span className="font-medium">Store List</span>
                              </Link>
                              <Link 
                                to="/your-offers"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-foreground"
                              >
                                <Gift className="h-5 w-5 text-primary" />
                                <span className="font-medium">Your Offers</span>
                              </Link>
                              <Link 
                                to="/rewards"
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                  location.pathname === '/rewards'
                                    ? 'bg-primary/10 text-primary border border-primary/20' 
                                    : 'hover:bg-muted/50 text-foreground'
                                }`}
                              >
                                <Heart className="h-5 w-5" />
                                <span className="font-medium">Rewards</span>
                              </Link>
                              <Link 
                                to="/customer-analytics"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-foreground"
                              >
                                <BarChart3 className="h-5 w-5 text-primary" />
                                <span className="font-medium">Analytics</span>
                              </Link>
                            </>
                          )}
                          {isMerchant && (
                            <>
                              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Merchant</h3>
                              <Link 
                                to="/merchant-dashboard"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-foreground"
                              >
                                <BarChart3 className="h-5 w-5 text-primary" />
                                <span className="font-medium">Dashboard</span>
                              </Link>
                              <Link 
                                to="/merchant-post-offer"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-foreground"
                              >
                                <Plus className="h-5 w-5 text-primary" />
                                <span className="font-medium">Post Offer</span>
                              </Link>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-border bg-muted/20">
                      <AuthButton />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
            
            {!isMobile && <AuthButton />}
          </div>
        </div>
      </div>
    </header>
  );
}