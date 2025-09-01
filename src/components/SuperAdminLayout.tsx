import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Store, ShoppingBag, Users, BarChart3, Settings, Globe } from 'lucide-react';
import { AuthButton } from './AuthButton';
import { useAuth } from '@/hooks/useAuth';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

export function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const { profile } = useAuth();
  const location = useLocation();

  const getSuperAdminViewContext = (pathname: string) => {
    const customerRoutes = ['/', '/rewards', '/your-offers', '/customer-analytics', '/about', '/profile'];
    const merchantRoutes = ['/merchant-dashboard', '/merchant-post-offer', '/merchant-edit-offers', '/billing', '/payment-success', '/payment-canceled'];
    const adminRoutes = ['/admin-dashboard', '/admin-navigation'];

    if (customerRoutes.includes(pathname)) {
      return 'Customer View';
    } else if (merchantRoutes.includes(pathname)) {
      return 'Merchant View';
    } else if (adminRoutes.includes(pathname)) {
      return '';
    }
    return '';
  };

  const getHeaderTitle = () => {
    const viewContext = getSuperAdminViewContext(location.pathname);
    return viewContext ? `Super Admin Panel - ${viewContext}` : 'Super Admin Panel';
  };

  // Redirect if not super admin
  if (profile?.role !== 'super_admin') {
    return null;
  }

  const navItems = [
    { path: '/admin-dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin-navigation', label: 'All Pages', icon: Globe },
    { path: '/', label: 'View Site', icon: Store },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-primary/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link 
                to="/admin-dashboard"
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <img 
                  src="/lovable-uploads/3c633683-8c9d-4ff2-ace7-6658272f2afd.png" 
                  alt="Namma Ooru Offers Logo" 
                  className="w-12 h-12 rounded-lg"
                />
                <div>
                  <h1 className="text-xl font-bold bg-blue-orange-gradient bg-clip-text text-transparent flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    {getHeaderTitle()}
                  </h1>
                  <p className="text-xs text-muted-foreground">Platform Management</p>
                </div>
              </Link>
              
              {/* Super Admin Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`text-sm font-medium transition-colors hover:text-orange-500 flex items-center gap-1 ${
                      location.pathname === path
                        ? 'text-orange-500 border-b-2 border-orange-500 pb-1' 
                        : 'text-blue-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/20 rounded-full">
                <Shield className="h-4 w-4 text-red-600" />
                <span className="text-xs font-medium text-red-600">Super Admin</span>
              </div>
              <AuthButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/3c633683-8c9d-4ff2-ace7-6658272f2afd.png" 
                alt="Logo" 
                className="w-8 h-8 rounded-lg"
              />
              <div>
                <p className="text-sm font-medium">Namma Ooru Offers</p>
                <p className="text-xs text-muted-foreground">Super Admin Panel</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>User Management</span>
                </div>
                <div className="flex items-center gap-1">
                  <Store className="h-4 w-4" />
                  <span>Store Oversight</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShoppingBag className="h-4 w-4" />
                  <span>Offer Control</span>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              © 2024 Namma Ooru Offers. Super Admin Dashboard.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}