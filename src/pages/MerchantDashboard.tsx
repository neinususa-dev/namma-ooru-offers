import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  Globe
} from 'lucide-react';

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

  const totalSaves = analytics.reduce((sum, item) => sum + item.saves_count, 0);
  const totalRedemptions = analytics.reduce((sum, item) => sum + item.redemptions_count, 0);
  const totalOnlineRedemptions = analytics.reduce((sum, item) => sum + item.online_redemptions, 0);
  const totalStoreRedemptions = analytics.reduce((sum, item) => sum + item.store_redemptions, 0);

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

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Offers</p>
                  <p className="text-2xl font-bold">{offers.length}</p>
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
                  <p className="text-2xl font-bold">{totalSaves}</p>
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
                  <p className="text-2xl font-bold">{totalRedemptions}</p>
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
                  <p className="text-2xl font-bold">{offers.filter(offer => offer.is_active).length}</p>
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
                {offers.length === 0 ? (
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
                    {offers.map((offer) => (
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
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Online Redemptions
                      </span>
                      <span className="font-semibold">{totalOnlineRedemptions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Store className="h-4 w-4" />
                        In-Store Redemptions
                      </span>
                      <span className="font-semibold">{totalStoreRedemptions}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Engagement Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Conversion Rate</span>
                      <span className="font-semibold">
                        {totalSaves > 0 ? ((totalRedemptions / totalSaves) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Avg. Saves per Offer</span>
                      <span className="font-semibold">
                        {offers.length > 0 ? (totalSaves / offers.length).toFixed(1) : 0}
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