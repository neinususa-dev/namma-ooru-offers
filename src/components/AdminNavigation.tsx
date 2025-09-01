import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Store, 
  Users, 
  ShoppingBag, 
  Gift, 
  Settings, 
  BarChart3, 
  CreditCard,
  Home,
  Info,
  LogIn,
  UserPlus,
  Award
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { SuperAdminLayout } from '@/components/SuperAdminLayout';

export function AdminNavigation() {
  const { profile, loading } = useAuth();
  const location = useLocation();

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect if not super admin
  if (profile?.role !== 'super_admin') {
    return null;
  }

  const customerPages = [
    { path: '/', label: 'Home Page', icon: Home, description: 'Main marketplace page' },
    { path: '/your-offers', label: 'Your Offers', icon: Gift, description: 'Customer saved offers' },
    { path: '/rewards', label: 'Rewards Center', icon: Award, description: 'Points and rewards system' },
    { path: '/customer-analytics', label: 'Customer Analytics', icon: BarChart3, description: 'Customer insights dashboard' },
  ];

  const merchantPages = [
    { path: '/merchant-dashboard', label: 'Merchant Dashboard', icon: Store, description: 'Main merchant control panel' },
    { path: '/admin-dashboard?tab=create-new', label: 'Post New Offer', icon: ShoppingBag, description: 'Create new offers' },
    { path: '/admin-dashboard?tab=offers', label: 'Edit Offers', icon: Settings, description: 'Manage existing offers' },
    { path: '/billing', label: 'Billing & Plans', icon: CreditCard, description: 'Subscription management' },
  ];

  const adminPages = [
    { path: '/admin-dashboard', label: 'Admin Dashboard', icon: Shield, description: 'Super admin control panel' },
    { path: '/profile', label: 'Profile Settings', icon: Users, description: 'User profile management' },
    { path: '/about', label: 'About Us', icon: Info, description: 'About page' },
  ];

  const authPages = [
    { path: '/signin', label: 'Sign In Page', icon: LogIn, description: 'User authentication' },
    { path: '/signup', label: 'Sign Up Page', icon: UserPlus, description: 'User registration' },
  ];

  const PageSection = ({ title, pages, badgeColor }: { 
    title: string; 
    pages: typeof customerPages; 
    badgeColor: string;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          <Badge variant="outline" className={badgeColor}>
            {pages.length} pages
          </Badge>
        </CardTitle>
        <CardDescription>Access all {title.toLowerCase()} functionality</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {pages.map(({ path, label, icon: Icon, description }) => (
            <div
              key={path}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                location.pathname === path
                  ? 'bg-primary/10 border-primary'
                  : 'hover:bg-muted border-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={path}>View</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href={path} target="_blank" rel="noopener noreferrer">New Tab</a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <SuperAdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Super Admin Navigation</h1>
            <p className="text-muted-foreground">Access all pages and features across the platform</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PageSection 
            title="Customer Pages" 
            pages={customerPages} 
            badgeColor="text-blue-600 border-blue-600" 
          />
          <PageSection 
            title="Merchant Pages" 
            pages={merchantPages} 
            badgeColor="text-green-600 border-green-600" 
          />
          <PageSection 
            title="Admin Pages" 
            pages={adminPages} 
            badgeColor="text-red-600 border-red-600" 
          />
          <PageSection 
            title="Authentication Pages" 
            pages={authPages} 
            badgeColor="text-purple-600 border-purple-600" 
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Super Admin Privileges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Store className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="font-medium">Full Store Access</p>
                <p className="text-sm text-muted-foreground">Create, edit, and manage all stores</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="font-medium">Complete Offer Control</p>
                <p className="text-sm text-muted-foreground">Post offers for any merchant</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="font-medium">User Data Access</p>
                <p className="text-sm text-muted-foreground">View all user profiles and activity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
}