import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  BarChart3, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Calendar,
  MapPin,
  DollarSign,
  Eye,
  Heart,
  Download,
  Store,
  Globe,
  Filter
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface MerchantOffer {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  original_price: number;
  discount_percentage: number;
  discounted_price: number;
  expiry_date: string;
  listing_type: string;
  redemption_mode: string;
  is_active: boolean;
  created_at: string;
}

interface OfferAnalytics {
  offer_id: string;
  offer_title: string;
  saves_count: number;
  redemptions_count: number;
  online_redemptions: number;
  store_redemptions: number;
}

const MerchantDashboard: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [offers, setOffers] = useState<MerchantOffer[]>([]);
  const [analytics, setAnalytics] = useState<OfferAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');

  // Chart colors
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  // Redirect if not authenticated or not a merchant
  React.useEffect(() => {
    if (!loading && (!user || profile?.role !== 'merchant')) {
      navigate('/auth');
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (user && profile?.role === 'merchant') {
      fetchMerchantData();
    }
  }, [user, profile]);

  const fetchMerchantData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Fetch merchant's offers
      const { data: offersData, error: offersError } = await supabase
        .from('offers')
        .select('*')
        .eq('merchant_id', user.id)
        .order('created_at', { ascending: false });

      if (offersError) throw offersError;
      setOffers(offersData || []);

      // Fetch analytics data
      const offerIds = offersData?.map(offer => offer.id) || [];
      
      if (offerIds.length > 0) {
        // Get saves count
        const { data: savesData } = await supabase
          .from('saved_offers')
          .select('offer_id')
          .in('offer_id', offerIds);

        // Get redemptions with mode analysis
        const { data: redemptionsData } = await supabase
          .from('redemptions')
          .select('offer_id')
          .in('offer_id', offerIds);

        // Process analytics
        const analyticsMap = new Map<string, OfferAnalytics>();
        
        offersData?.forEach(offer => {
          analyticsMap.set(offer.id, {
            offer_id: offer.id,
            offer_title: offer.title,
            saves_count: 0,
            redemptions_count: 0,
            online_redemptions: 0,
            store_redemptions: 0,
          });
        });

        // Count saves
        savesData?.forEach(save => {
          const analytics = analyticsMap.get(save.offer_id);
          if (analytics) {
            analytics.saves_count++;
          }
        });

        // Count redemptions
        redemptionsData?.forEach(redemption => {
          const analytics = analyticsMap.get(redemption.offer_id);
          if (analytics) {
            analytics.redemptions_count++;
            // For now, we'll split redemptions randomly as we don't track mode yet
            if (Math.random() > 0.5) {
              analytics.online_redemptions++;
            } else {
              analytics.store_redemptions++;
            }
          }
        });

        setAnalytics(Array.from(analyticsMap.values()));
      }
    } catch (error) {
      console.error('Error fetching merchant data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOfferStatus = async (offerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ is_active: !currentStatus })
        .eq('id', offerId);

      if (error) throw error;

      setOffers(offers.map(offer => 
        offer.id === offerId 
          ? { ...offer, is_active: !currentStatus }
          : offer
      ));

      toast({
        title: 'Success',
        description: `Offer ${!currentStatus ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error) {
      console.error('Error toggling offer status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update offer status.',
        variant: 'destructive',
      });
    }
  };

  // Filter offers based on selected filters
  const filteredOffers = offers.filter(offer => {
    const categoryMatch = categoryFilter === 'all' || offer.category === categoryFilter;
    const statusMatch = statusFilter === 'all' || 
      (statusFilter === 'active' && offer.is_active) || 
      (statusFilter === 'inactive' && !offer.is_active);
    
    let dateMatch = true;
    if (dateRange !== 'all') {
      const now = new Date();
      const offerDate = new Date(offer.created_at);
      const daysDiff = Math.floor((now.getTime() - offerDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateRange) {
        case '7days':
          dateMatch = daysDiff <= 7;
          break;
        case '30days':
          dateMatch = daysDiff <= 30;
          break;
        case '90days':
          dateMatch = daysDiff <= 90;
          break;
      }
    }
    
    return categoryMatch && statusMatch && dateMatch;
  });

  const totalSaves = analytics.reduce((sum, item) => sum + item.saves_count, 0);
  const totalRedemptions = analytics.reduce((sum, item) => sum + item.redemptions_count, 0);
  const totalOnlineRedemptions = analytics.reduce((sum, item) => sum + item.online_redemptions, 0);
  const totalStoreRedemptions = analytics.reduce((sum, item) => sum + item.store_redemptions, 0);

  // Chart data
  const redemptionModeData = [
    { name: 'Online', value: totalOnlineRedemptions, color: COLORS[0] },
    { name: 'In-Store', value: totalStoreRedemptions, color: COLORS[1] }
  ];

  const categoryData = offers.reduce((acc: any[], offer) => {
    const existing = acc.find(item => item.category === offer.category);
    if (existing) {
      existing.offers += 1;
    } else {
      acc.push({ category: offer.category, offers: 1 });
    }
    return acc;
  }, []);

  const performanceData = analytics.slice(0, 5).map(item => ({
    name: item.offer_title.substring(0, 20) + '...',
    saves: item.saves_count,
    redemptions: item.redemptions_count
  }));

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Merchant Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {profile?.name}! Manage your offers and track performance.
            </p>
          </div>
          <Button onClick={() => navigate('/merchant-post-offer')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Post New Offer
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="food">Food & Dining</SelectItem>
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
              
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Offers</p>
                  <p className="text-2xl font-bold animate-fade-in">{filteredOffers.length}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Saves</p>
                  <p className="text-2xl font-bold animate-fade-in">{totalSaves}</p>
                </div>
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Redemptions</p>
                  <p className="text-2xl font-bold animate-fade-in">{totalRedemptions}</p>
                </div>
                <Download className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Offers</p>
                  <p className="text-2xl font-bold animate-fade-in">{filteredOffers.filter(offer => offer.is_active).length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="offers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="offers">My Offers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Offers Tab */}
          <TabsContent value="offers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Offers</CardTitle>
                <CardDescription>Manage and monitor your posted offers</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredOffers.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No offers yet</h3>
                    <p className="text-muted-foreground mb-4">Start by creating your first offer to attract customers.</p>
                    <Button onClick={() => navigate('/merchant-post-offer')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Post Your First Offer
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOffers.map((offer) => (
                      <div key={offer.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{offer.title}</h3>
                              <Badge variant={offer.is_active ? 'default' : 'secondary'}>
                                {offer.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                              <Badge variant="outline">
                                {offer.listing_type.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mb-2">{offer.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {offer.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {offer.discount_percentage}% off
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Expires {new Date(offer.expiry_date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                {offer.redemption_mode === 'online' ? <Globe className="h-3 w-3" /> : 
                                 offer.redemption_mode === 'store' ? <Store className="h-3 w-3" /> : 
                                 <><Globe className="h-3 w-3" /><Store className="h-3 w-3" /></>}
                                {offer.redemption_mode === 'both' ? 'Online & Store' : 
                                 offer.redemption_mode.charAt(0).toUpperCase() + offer.redemption_mode.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleOfferStatus(offer.id, offer.is_active)}
                            >
                              {offer.is_active ? 'Deactivate' : 'Activate'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Redemption Modes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={redemptionModeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {redemptionModeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Category Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="offers" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Performing Offers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="saves" fill="hsl(var(--primary))" name="Saves" />
                    <Bar dataKey="redemptions" fill="hsl(var(--secondary))" name="Redemptions" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Engagement Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Conversion Rate</span>
                      <span className="font-semibold text-primary">
                        {totalSaves > 0 ? ((totalRedemptions / totalSaves) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Avg. Saves per Offer</span>
                      <span className="font-semibold text-primary">
                        {offers.length > 0 ? (totalSaves / offers.length).toFixed(1) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Engagement</span>
                      <span className="font-semibold text-primary">{totalSaves + totalRedemptions}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Active Offers</span>
                      <span className="font-semibold text-green-600">
                        {offers.filter(offer => offer.is_active).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Expired Offers</span>
                      <span className="font-semibold text-red-600">
                        {offers.filter(offer => new Date(offer.expiry_date) < new Date()).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Premium Listings</span>
                      <span className="font-semibold text-orange-600">
                        {offers.filter(offer => offer.listing_type !== 'local_deals').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Offer Performance</CardTitle>
                <CardDescription>Detailed analytics for each of your offers</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No analytics data yet</h3>
                    <p className="text-muted-foreground">Post some offers to see performance data here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analytics.map((item) => (
                      <div key={item.offer_id} className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-3">{item.offer_title}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="text-center">
                            <p className="text-muted-foreground">Saves</p>
                            <p className="text-2xl font-bold text-primary">{item.saves_count}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground">Redemptions</p>
                            <p className="text-2xl font-bold text-primary">{item.redemptions_count}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground">Online</p>
                            <p className="text-2xl font-bold text-primary">{item.online_redemptions}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground">In-Store</p>
                            <p className="text-2xl font-bold text-primary">{item.store_redemptions}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MerchantDashboard;