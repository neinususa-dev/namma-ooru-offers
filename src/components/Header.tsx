import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gift, Store, BarChart3, Plus, Flame, MapPin, Heart, Menu, X, Home, CreditCard } from 'lucide-react';
import { AuthButton } from './AuthButton';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  showNavigation?: boolean;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export function Header({ showNavigation = true, activeSection, onSectionChange }: HeaderProps) {
  const { user, profile, isCustomer, isMerchant } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home' },
    { id: 'local-deals', label: 'Local Deals' },
    { id: 'store-list', label: 'Store List' },
    { id: 'rewards', label: 'Rewards', link: '/rewards' },
    { id: 'about', label: 'About Us', link: '/about' }
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
                alt="Namma Ooru Offers Logo" 
                className="w-12 h-12 rounded-lg"
              />
              <div>
                <h1 className="text-xl font-bold bg-blue-orange-gradient bg-clip-text text-transparent">
                  Namma Ooru Offers
                </h1>
                <p className="text-xs text-muted-foreground">Your Local Savings Hub</p>
              </div>
            </Link>
            
            {/* Navigation Links - show on home page and About Us page */}
            {showNavigation && (
              <nav className="hidden md:flex items-center gap-6">
                {user && isMerchant ? (
                  // Merchant navigation - Dashboard, Post Offer, and Pricing
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
                    <Link 
                      to="/billing"
                      className="text-sm font-medium transition-colors hover:text-orange-500 text-blue-600 flex items-center gap-1"
                    >
                      <CreditCard className="h-4 w-4" />
                      Pricing
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
                        ) : onSectionChange ? (
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
                        ) : (
                          <Link
                            key={item.id}
                            to="/"
                            className="text-sm font-medium transition-colors hover:text-orange-500 text-blue-600"
                          >
                            {item.label}
                          </Link>
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
                       to="/about"
                       className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                         location.pathname === '/about'
                           ? 'text-orange-500 border-b-2 border-orange-500 pb-1' 
                           : 'text-blue-600'
                       }`}
                     >
                       About Us
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
                    <Link 
                      to="/billing"
                      className="text-sm font-medium transition-colors hover:text-orange-500 text-blue-600 flex items-center gap-1"
                    >
                      <CreditCard className="h-4 w-4" />
                      Pricing
                    </Link>
                  </>
                )}
              </nav>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            {isMobile && user && (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <img 
                        src="/lovable-uploads/3c633683-8c9d-4ff2-ace7-6658272f2afd.png" 
                        alt="Logo" 
                        className="w-8 h-8 rounded-lg"
                      />
                      Navigation
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-4">
                    {/* Home Link */}
                    <Link 
                      to="/"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Home className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Home</span>
                    </Link>

                    {/* Customer Navigation */}
                    {isCustomer && (
                      <>
                        <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">Customer</div>
                        {navigationItems.map((item) => (
                          item.link ? (
                            <Link
                              key={item.id}
                              to={item.link}
                              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                location.pathname === item.link
                                  ? 'bg-orange-100 text-orange-600' 
                                  : 'hover:bg-muted'
                              }`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <Heart className="h-5 w-5" />
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          ) : (
                             <button
                               key={item.id}
                               onClick={() => {
                                 onSectionChange?.(item.id);
                                 setMobileMenuOpen(false);
                               }}
                               className={`flex items-center gap-3 p-3 rounded-lg transition-colors w-full text-left ${
                                 activeSection === item.id 
                                   ? 'bg-orange-100 text-orange-600' 
                                   : 'hover:bg-muted'
                               }`}
                             >
                               {item.id === 'local-deals' && <MapPin className="h-5 w-5" />}
                               {item.id === 'store-list' && <Store className="h-5 w-5" />}
                               {item.id === 'home' && <Home className="h-5 w-5" />}
                               <span className="font-medium">{item.label}</span>
                             </button>
                          )
                        ))}
                        
                        <Link 
                          to="/your-offers"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Gift className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">Your Offers</span>
                        </Link>
                        
                        <Link 
                          to="/customer-analytics"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <BarChart3 className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">Analytics</span>
                        </Link>
                      </>
                    )}

                    {/* Merchant Navigation */}
                    {isMerchant && (
                      <>
                        <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">Merchant</div>
                        <Link 
                          to="/merchant-dashboard"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <BarChart3 className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">Dashboard</span>
                        </Link>
                        
                        <Link 
                          to="/merchant-post-offer"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Plus className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">Post Offer</span>
                        </Link>
                        
                        <Link 
                          to="/billing"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <CreditCard className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">Pricing</span>
                        </Link>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            )}
            
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}