import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Plus, BarChart3, TrendingUp, Eye, Heart, ShoppingBag, 
  Calendar, Filter, Target, Award, Users, Star, DollarSign,
  Package, Activity, Clock, Globe
} from 'lucide-react';

interface MerchantStats {
  totalOffers: number;
  totalSaves: number;
  totalRedemptions: number;
  totalRevenue: number;
  categoriesData: Array<{ name: string; value: number; color: string }>;
  monthlyActivity: Array<{ month: string; offers: number; saves: number; redemptions: number; revenue: number }>;
  offerPerformance: Array<{ title: string; saves: number; redemptions: number; revenue: number }>;
  redemptionModes: Array<{ name: string; value: number; color: string }>;
}

interface Filters {
  dateRange: string;
  category: string;
  status: string;
}

const MerchantDashboard = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<MerchantStats>({
    totalOffers: 0,
    totalSaves: 0,
    totalRedemptions: 0,
    totalRevenue: 0,
    categoriesData: [],
    monthlyActivity: [],
    offerPerformance: [],
    redemptionModes: []
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    dateRange: 'all',
    category: 'all',
    status: 'all'
  });

  // Redirect if not authenticated or not a merchant
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      // Only redirect if we have both user and profile loaded
      if (profile && profile.role !== 'merchant') {
        navigate('/');
        return;
      }
    }
  }, [user, profile, authLoading, navigate]);

  useEffect(() => {
    if (user && profile?.role === 'merchant' && !authLoading) {
      fetchMerchantAnalytics();
    }
  }, [user, profile, filters, authLoading]);

  const fetchMerchantAnalytics = async () => {
    if (!user) return;
    
    try {
      setLoading(true);

      // Build date filter
      let dateFilter = '';
      const now = new Date();
      if (filters.dateRange === '7d') {
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      } else if (filters.dateRange === '30d') {
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      } else if (filters.dateRange === '90d') {
        dateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
      }

      // Fetch merchant offers
      let offersQuery = supabase
        .from('offers')
        .select('*')
        .eq('merchant_id', user.id);

      if (dateFilter) {
        offersQuery = offersQuery.gte('created_at', dateFilter);
      }
      if (filters.category !== 'all') {
        offersQuery = offersQuery.eq('category', filters.category);
      }
      if (filters.status !== 'all') {
        if (filters.status === 'active') {
          offersQuery = offersQuery.eq('is_active', true).gte('expiry_date', now.toISOString());
        } else if (filters.status === 'expired') {
          offersQuery = offersQuery.lt('expiry_date', now.toISOString());
        } else if (filters.status === 'inactive') {
          offersQuery = offersQuery.eq('is_active', false);
        }
      }

      const { data: offers, error: offersError } = await offersQuery;
      if (offersError) throw offersError;

      // Get offer IDs for this merchant
      const offerIds = offers?.map(offer => offer.id) || [];
      
      // Fetch saves for merchant offers
      let saves: any[] = [];
      let redemptions: any[] = [];
      
      if (offerIds.length > 0) {
        console.log('Fetching data for offer IDs:', offerIds);
        
        // Build saves query with date filter
        let savesQuery = supabase
          .from('saved_offers')
          .select('*')
          .in('offer_id', offerIds);

        if (dateFilter) {
          savesQuery = savesQuery.gte('saved_at', dateFilter);
        }

        const { data: savesData, error: savesError } = await savesQuery;

        if (savesError) {
          console.error('Saves query error:', savesError);
          throw savesError;
        }
        
        saves = savesData || [];
        console.log('Saves data:', saves);

        // Build redemptions query with date filter
        let redemptionsQuery = supabase
          .from('redemptions')
          .select('*')
          .in('offer_id', offerIds);

        if (dateFilter) {
          redemptionsQuery = redemptionsQuery.gte('redeemed_at', dateFilter);
        }

        const { data: redemptionsData, error: redemptionsError } = await redemptionsQuery;

        if (redemptionsError) {
          console.error('Redemptions query error:', redemptionsError);
          throw redemptionsError;
        }
        
        redemptions = redemptionsData || [];
        console.log('Redemptions data:', redemptions);
      } else {
        console.log('No offers found for merchant');
      }

      // Process analytics data
      const categoryColors = {
        food: '#FF6B6B',
        fashion: '#4ECDC4', 
        electronics: '#45B7D1',
        grocery: '#96CEB4',
        home: '#FFEAA7',
        beauty: '#DDA0DD',
        sports: '#FF9FF3',
        travel: '#54A0FF',
        entertainment: '#5F27CD',
        other: '#00D2D3'
      };

      // Category breakdown from offers
      const categoryCount: Record<string, number> = {};
      offers?.forEach(offer => {
        if (offer.category) {
          categoryCount[offer.category] = (categoryCount[offer.category] || 0) + 1;
        }
      });

      const categoriesData = Object.entries(categoryCount).map(([category, count]) => ({
        name: category,
        value: count,
        color: categoryColors[category as keyof typeof categoryColors] || categoryColors.other
      }));

      // Redemption modes breakdown - need to fetch offer details
      const redemptionModeCount: Record<string, number> = {};
      
      for (const redemption of redemptions) {
        // Find the corresponding offer
        const offer = offers?.find(o => o.id === redemption.offer_id);
        if (offer) {
          const mode = offer.redemption_mode || 'both';
          redemptionModeCount[mode] = (redemptionModeCount[mode] || 0) + 1;
        }
      }

      const redemptionModes = Object.entries(redemptionModeCount).map(([mode, count]) => ({
        name: mode === 'both' ? 'Online & Store' : mode === 'online' ? 'Online Only' : 'Store Only',
        value: count,
        color: mode === 'online' ? '#4ECDC4' : mode === 'store' ? '#FF6B6B' : '#45B7D1'
      }));

      // Monthly activity (last 6 months)
      const monthlyData: Record<string, { offers: number; saves: number; redemptions: number; revenue: number }> = {};
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        monthlyData[monthKey] = { offers: 0, saves: 0, redemptions: 0, revenue: 0 };
      }

      // Count offers by month
      offers?.forEach(offer => {
        const month = new Date(offer.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (monthlyData[month]) {
          monthlyData[month].offers++;
        }
      });

      // Count saves by month
      saves?.forEach(save => {
        const month = new Date(save.saved_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (monthlyData[month]) {
          monthlyData[month].saves++;
        }
      });

      // Count redemptions and calculate revenue by month
      redemptions?.forEach(redemption => {
        const month = new Date(redemption.redeemed_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (monthlyData[month]) {
          monthlyData[month].redemptions++;
          // Find corresponding offer for revenue calculation
          const offer = offers?.find(o => o.id === redemption.offer_id);
          const revenue = offer?.discounted_price || 0;
          monthlyData[month].revenue += revenue;
        }
      });

      const monthlyActivity = Object.entries(monthlyData).map(([month, data]) => ({
        month,
        ...data
      }));

      // Offer performance
      const offerPerformanceMap: Record<string, { saves: number; redemptions: number; revenue: number; title: string }> = {};
      
      offers?.forEach(offer => {
        offerPerformanceMap[offer.id] = {
          title: offer.title,
          saves: 0,
          redemptions: 0,
          revenue: 0
        };
      });

      saves?.forEach(save => {
        if (save.offer_id && offerPerformanceMap[save.offer_id]) {
          offerPerformanceMap[save.offer_id].saves++;
        }
      });

      redemptions?.forEach(redemption => {
        if (redemption.offer_id && offerPerformanceMap[redemption.offer_id]) {
          offerPerformanceMap[redemption.offer_id].redemptions++;
          // Find corresponding offer for revenue calculation
          const offer = offers?.find(o => o.id === redemption.offer_id);
          const revenue = offer?.discounted_price || 0;
          offerPerformanceMap[redemption.offer_id].revenue += revenue;
        }
      });

      const offerPerformance = Object.values(offerPerformanceMap)
        .sort((a, b) => (b.saves + b.redemptions) - (a.saves + a.redemptions))
        .slice(0, 5);

      // Calculate totals
      const totalOffers = offers?.length || 0;
      const totalSaves = saves?.length || 0;
      const totalRedemptions = redemptions?.length || 0;
      const totalRevenue = redemptions?.reduce((sum, redemption) => {
        const offer = offers?.find(o => o.id === redemption.offer_id);
        return sum + (offer?.discounted_price || 0);
      }, 0) || 0;

      setStats({
        totalOffers,
        totalSaves,
        totalRedemptions,
        totalRevenue,
        categoriesData,
        monthlyActivity,
        offerPerformance,
        redemptionModes
      });

    } catch (error) {
      console.error('Error fetching merchant analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header showNavigation={false} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showNavigation={false} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Merchant Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {profile?.name}! Track your offers and business performance.
            </p>
          </div>
          <Button onClick={() => navigate('/merchant-post-offer')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Post New Offer
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Date Range</Label>
                <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="90d">Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Category</Label>
                <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="food">Food & Dining</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="grocery">Grocery</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="beauty">Beauty & Health</SelectItem>
                    <SelectItem value="sports">Sports & Fitness</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Status</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalOffers}</div>
              <p className="text-xs text-muted-foreground">
                Posted offers
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Saves</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{stats.totalSaves}</div>
              <p className="text-xs text-muted-foreground">
                Customers saved offers
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Redemptions</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{stats.totalRedemptions}</div>
              <p className="text-xs text-muted-foreground">
                Offers redeemed
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                From redemptions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Monthly Activity
                  </CardTitle>
                  <CardDescription>Track your offers, saves, and redemptions over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={stats.monthlyActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="offers" stackId="1" stroke="#45B7D1" fill="#45B7D1" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="saves" stackId="1" stroke="#4ECDC4" fill="#4ECDC4" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="redemptions" stackId="1" stroke="#FF6B6B" fill="#FF6B6B" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Top Performing Offers
                  </CardTitle>
                  <CardDescription>Your most successful offers by engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.offerPerformance} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="title" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="saves" fill="#4ECDC4" />
                      <Bar dataKey="redemptions" fill="#FF6B6B" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Revenue Trends
                  </CardTitle>
                  <CardDescription>Monthly revenue from redeemed offers</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.monthlyActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Conversion Rate
                  </CardTitle>
                  <CardDescription>Saves to redemptions conversion</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Conversion Rate</span>
                      <span className="text-2xl font-bold text-primary">
                        {stats.totalSaves > 0 ? ((stats.totalRedemptions / stats.totalSaves) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${stats.totalSaves > 0 ? (stats.totalRedemptions / stats.totalSaves) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-secondary">{stats.totalSaves}</div>
                        <div className="text-xs text-muted-foreground">Total Saves</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-accent">{stats.totalRedemptions}</div>
                        <div className="text-xs text-muted-foreground">Total Redemptions</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Engagement Comparison
                </CardTitle>
                <CardDescription>Compare saves vs redemptions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={stats.monthlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="saves" fill="#4ECDC4" name="Saves" />
                    <Bar dataKey="redemptions" fill="#FF6B6B" name="Redemptions" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Offers by Category
                  </CardTitle>
                  <CardDescription>Distribution of your offers across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.categoriesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          dataKey="value"
                          data={stats.categoriesData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {stats.categoriesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      No category data available
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Redemption Modes
                  </CardTitle>
                  <CardDescription>How customers prefer to redeem your offers</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.redemptionModes.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          dataKey="value"
                          data={stats.redemptionModes}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {stats.redemptionModes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      No redemption data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MerchantDashboard;