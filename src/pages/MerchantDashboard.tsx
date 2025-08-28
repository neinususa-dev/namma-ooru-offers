import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
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
  Package, Activity, Clock, Globe, Edit3, CheckCircle, XCircle
} from 'lucide-react';

interface MerchantStats {
  totalOffers: number;
  approvedOffers: number;
  pendingOffers: number;
  totalSaves: number;
  totalRedemptions: number;
  totalRevenue: number;
  categoriesData: Array<{ name: string; value: number; color: string }>;
  monthlyActivity: Array<{ month: string; offers: number; saves: number; redemptions: number; revenue: number }>;
  offerPerformance: Array<{ title: string; saves: number; redemptions: number; revenue: number }>;
  redemptionModes: Array<{ name: string; value: number; color: string }>;
  customerSaves: Array<{ customer_name: string; customer_email: string; offer_title: string; saved_at: string }>;
  customerRedemptions: Array<{ customer_name: string; customer_email: string; offer_title: string; redeemed_at: string }>;
  pendingRedemptions: Array<{ id: string; customer_name: string; customer_email: string; offer_title: string; redeemed_at: string; offer_id: string }>;
}

interface Filters {
  dateRange: string;
  category: string;
  status: string;
}

const MerchantDashboard = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { categories, loading: categoriesLoading } = useCategories();
  const navigate = useNavigate();
  const [stats, setStats] = useState<MerchantStats>({
    totalOffers: 0,
    approvedOffers: 0,
    pendingOffers: 0,
    totalSaves: 0,
    totalRedemptions: 0,
    totalRevenue: 0,
    categoriesData: [],
    monthlyActivity: [],
    offerPerformance: [],
    redemptionModes: [],
    customerSaves: [],
    customerRedemptions: [],
    pendingRedemptions: []
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    dateRange: 'all',
    category: 'all',
    status: 'all'
  });

  // Redirect if not authenticated or not a merchant - with stability check
  useEffect(() => {
    if (authLoading) return; // Don't redirect while auth is loading
    
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (profile && profile.role !== 'merchant') {
      navigate('/');
      return;
    }
  }, [user, profile?.role, authLoading, navigate]);

  useEffect(() => {
    if (user && profile?.role === 'merchant' && !authLoading) {
      fetchMerchantAnalytics();
    }
  }, [user, profile?.role, authLoading, filters]);

  const fetchMerchantAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Starting fetchMerchantAnalytics for user:', user.id);

      const now = new Date();

      // Date filter
      let dateFilter: string | null = null;
      if (filters.dateRange === '7d') {
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      } else if (filters.dateRange === '30d') {
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      } else if (filters.dateRange === '90d') {
        dateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
      }

      console.log('Applied filters:', filters);

      // First, get ALL offers for this merchant (without date filter)
      console.log('Fetching offers for merchant:', user.id);
      let baseOffersQuery = supabase.from('offers').select('*').eq('merchant_id', user.id);
      
      // Apply category and status filters to offers
      if (filters.category !== 'all') baseOffersQuery = baseOffersQuery.eq('category', filters.category);
      if (filters.status !== 'all') {
        if (filters.status === 'active') baseOffersQuery = baseOffersQuery.eq('is_active', true).gte('expiry_date', now.toISOString());
        else if (filters.status === 'expired') baseOffersQuery = baseOffersQuery.lt('expiry_date', now.toISOString());
        else if (filters.status === 'inactive') baseOffersQuery = baseOffersQuery.eq('is_active', false);
      }

      const { data: allOffers, error: offersError } = await baseOffersQuery;
      if (offersError) {
        console.error('Error fetching offers:', offersError);
        throw offersError;
      }
      
      console.log('Fetched offers:', allOffers?.length || 0);

      const offerIds = allOffers?.map(o => o.id) || [];

      if (!offerIds.length) {
        // If no offers found, set empty stats and return
        setStats({
          totalOffers: 0,
          approvedOffers: 0,
          pendingOffers: 0,
          totalSaves: 0,
          totalRedemptions: 0,
          totalRevenue: 0,
          categoriesData: [],
          monthlyActivity: [],
          offerPerformance: [],
          redemptionModes: [],
          customerSaves: [],
          customerRedemptions: [],
          pendingRedemptions: []
        });
        return;
      }

      // Fetch ALL saves and redemptions for these offers with customer information
      console.log('Fetching saved offers for offer IDs:', offerIds);
      
      // First, let's check all saved offers without RLS to debug
      const { data: debugSaves, error: debugError } = await supabase
        .from('saved_offers')
        .select('*')
        .in('offer_id', offerIds);
      
      console.log('DEBUG: Raw saved offers data:', debugSaves);
      console.log('DEBUG: Raw saved offers error:', debugError);
      
      const { data: allSaves, error: savesError } = await supabase
        .from('saved_offers')
        .select(`
          *,
          profiles:user_id (
            name,
            email
          )
        `)
        .in('offer_id', offerIds);
      if (savesError) {
        console.error('Error fetching saved offers:', savesError);
        throw savesError;
      }
      
      console.log('Fetched saved offers with profiles:', allSaves?.length || 0);
      console.log('Detailed saved offers data:', allSaves);
      
      // Let's also check if there are any saved offers that the current user can't see
      const { data: allPossibleSaves, error: allSavesError } = await supabase
        .from('saved_offers')
        .select('user_id, offer_id, saved_at')
        .in('offer_id', offerIds);
      
      console.log('All possible saves (user IDs only):', allPossibleSaves);

      // Fetch pending redemptions for these offers with customer information
      console.log('Fetching pending redemptions for offer IDs:', offerIds);
      const { data: pendingRedemptionsData, error: pendingError } = await supabase
        .from('redemptions')
        .select(`
          *,
          profiles:user_id (
            name,
            email
          )
        `)
        .eq('status', 'pending')
        .in('offer_id', offerIds);
      
      console.log('Pending redemptions fetched:', pendingRedemptionsData);
      if (pendingError) {
        console.error('Error fetching pending redemptions:', pendingError);
        throw pendingError;
      }

      const { data: allRedemptions, error: redemptionsError } = await supabase
        .from('redemptions')
        .select(`
          *,
          profiles:user_id (
            name,
            email
          )
        `)
        .in('offer_id', offerIds);
      if (redemptionsError) throw redemptionsError;

      // Filter offers by date if applicable (for offer counts)
      const offers = dateFilter 
        ? allOffers.filter(o => new Date(o.created_at) >= new Date(dateFilter))
        : allOffers;

      // Filter saves by date if applicable
      const saves = dateFilter 
        ? allSaves.filter(s => new Date(s.saved_at) >= new Date(dateFilter))
        : allSaves;

      // Filter redemptions by date if applicable
      const redemptions = dateFilter 
        ? allRedemptions.filter(r => new Date(r.redeemed_at) >= new Date(dateFilter))
        : allRedemptions;

      // Colors for categories
      const categoryColors: Record<string, string> = {
        all: '#808080',
        electronics: '#45B7D1',
        fashion: '#4ECDC4', 
        food: '#FF6B6B',
        grocery: '#96CEB4',
        home: '#FFEAA7',
        travel: '#54A0FF',
        health: '#FF6B6B',
        beauty: '#DDA0DD',
        education: '#9B59B6',
        sports: '#FF9FF3',
        entertainment: '#5F27CD',
        automotive: '#E67E22',
        kids_baby: '#F39C12',
        books: '#8E44AD',
        services: '#16A085',
        pets: '#27AE60',
        local_deals: '#2980B9',
        online_deals: '#8E44AD',
        seasonal: '#E74C3C',
        other: '#00D2D3'
      };

      // Category breakdown
      const categoryCount: Record<string, number> = {};
      offers.forEach(offer => {
        const cat = offer.category || 'other';
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
      const categoriesData = Object.entries(categoryCount).map(([name, value]) => ({
        name,
        value,
        color: categoryColors[name] || categoryColors.other
      }));

      // Redemption modes - get from offers that have redemptions
      const redemptionModeCount: Record<string, number> = {};
      redemptions.forEach(r => {
        const offer = offers.find(o => o.id === r.offer_id);
        if (offer) {
          const mode = offer.redemption_mode || 'both';
          redemptionModeCount[mode] = (redemptionModeCount[mode] || 0) + 1;
        }
      });
      const redemptionModes = Object.entries(redemptionModeCount).map(([mode, value]) => ({
        name: mode === 'both' ? 'Online & Store' : mode === 'online' ? 'Online Only' : 'Store Only',
        value,
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

      offers.forEach(o => {
        const month = new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (monthlyData[month]) monthlyData[month].offers++;
      });

      saves.forEach(s => {
        const month = new Date(s.saved_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (monthlyData[month]) monthlyData[month].saves++;
      });

      redemptions.forEach(r => {
        const month = new Date(r.redeemed_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (monthlyData[month]) {
          monthlyData[month].redemptions++;
          const offer = offers.find(o => o.id === r.offer_id);
          if (offer) {
            monthlyData[month].revenue += offer.discounted_price || 0;
          }
        }
      });

      const monthlyActivity = Object.entries(monthlyData).map(([month, data]) => ({ month, ...data }));

      // Top performing offers
      const offerPerformanceMap: Record<string, { title: string; saves: number; redemptions: number; revenue: number }> = {};
      offers.forEach(o => {
        offerPerformanceMap[o.id] = { title: o.title, saves: 0, redemptions: 0, revenue: 0 };
      });
      saves.forEach(s => {
        if (offerPerformanceMap[s.offer_id]) offerPerformanceMap[s.offer_id].saves++;
      });
      redemptions.forEach(r => {
        if (offerPerformanceMap[r.offer_id]) {
          offerPerformanceMap[r.offer_id].redemptions++;
          const offer = offers.find(o => o.id === r.offer_id);
          if (offer) {
            offerPerformanceMap[r.offer_id].revenue += offer.discounted_price || 0;
          }
        }
      });

      const offerPerformance = Object.values(offerPerformanceMap)
        .sort((a, b) => (b.saves + b.redemptions) - (a.saves + a.redemptions))
        .slice(0, 5);

      // Totals
      const totalOffers = offers.length;
      const approvedOffers = offers.filter(o => o.status === 'approved').length;
      const pendingOffers = offers.filter(o => o.status === 'in_review' || o.status === 'applied').length;
      const totalSaves = saves.length;
      const totalRedemptions = redemptions.length;
      const totalRevenue = redemptions.reduce((sum, r) => {
        const offer = offers.find(o => o.id === r.offer_id);
        return sum + (offer?.discounted_price || 0);
      }, 0);

      // Prepare customer data for display
      const customerSaves = saves.map(s => {
        const offer = offers.find(o => o.id === s.offer_id);
        return {
          customer_name: s.profiles?.name || 'Unknown',
          customer_email: s.profiles?.email || 'Unknown',
          offer_title: offer?.title || 'Unknown Offer',
          saved_at: new Date(s.saved_at).toLocaleDateString()
        };
      });

      const customerRedemptions = redemptions.filter(r => r.status === 'approved').map(r => {
        const offer = offers.find(o => o.id === r.offer_id);
        return {
          customer_name: r.profiles?.name || 'Unknown',
          customer_email: r.profiles?.email || 'Unknown',
          offer_title: offer?.title || 'Unknown Offer',
          redeemed_at: new Date(r.redeemed_at).toLocaleDateString()
        };
      });

      const pendingRedemptions = (pendingRedemptionsData || []).map(r => {
        const offer = offers.find(o => o.id === r.offer_id);
        return {
          id: r.id,
          customer_name: r.profiles?.name || 'Unknown',
          customer_email: r.profiles?.email || 'Unknown',
          offer_title: offer?.title || 'Unknown Offer',
          redeemed_at: new Date(r.redeemed_at).toLocaleDateString(),
          offer_id: r.offer_id
        };
      });

      setStats({
        totalOffers,
        approvedOffers,
        pendingOffers,
        totalSaves,
        totalRedemptions,
        totalRevenue,
        categoriesData,
        monthlyActivity,
        offerPerformance,
        redemptionModes,
        customerSaves,
        customerRedemptions,
        pendingRedemptions
      });

    } catch (error) {
      console.error('Error fetching merchant analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveRedemption = async (redemptionId: string) => {
    try {
      console.log('Starting approval process for:', redemptionId);
      
      // First check if the redemption exists and get current status
      const { data: currentRedemption, error: fetchError } = await supabase
        .from('redemptions')
        .select('*')
        .eq('id', redemptionId)
        .maybeSingle();
      
      if (fetchError) {
        console.error('Error fetching redemption:', fetchError);
        throw fetchError;
      }
      
      if (!currentRedemption) {
        console.error('Redemption not found:', redemptionId);
        return;
      }
      
      console.log('Current redemption status:', currentRedemption.status);
      
      // Update the status to approved
      const { data: updatedData, error: updateError } = await supabase
        .from('redemptions')
        .update({ status: 'approved' })
        .eq('id', redemptionId)
        .select('*')
        .maybeSingle();

      if (updateError) {
        console.error('Database update failed:', updateError);
        throw updateError;
      }
      
      console.log('Updated redemption data:', updatedData);
      
      if (updatedData && updatedData.status === 'approved') {
        console.log('Status successfully updated to approved');
        
        // Refresh the data
        await fetchMerchantAnalytics();
        console.log('Data refreshed successfully');
      } else {
        console.error('Status update may have failed, updated data:', updatedData);
      }
      
    } catch (error) {
      console.error('Error approving redemption:', error);
    }
  };

  const rejectRedemption = async (redemptionId: string) => {
    try {
      const { error } = await supabase
        .from('redemptions')
        .update({ status: 'rejected' })
        .eq('id', redemptionId);

      if (error) throw error;
      
      // Immediately refresh all data
      await fetchMerchantAnalytics();
      
      console.log('Redemption rejected and data refreshed');
    } catch (error) {
      console.error('Error rejecting redemption:', error);
    }
  };
  if (authLoading || loading || !user || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header showNavigation={false} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Don't render if user is not a merchant
  if (profile.role !== 'merchant') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showNavigation={false} />
      <main className="container mx-auto px-4 py-8">
        {/* Header and Post Offer */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Merchant Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile?.name}! Track your offers and business performance.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/merchant-edit-offers')} variant="outline" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Edit Offers
            </Button>
            <Button onClick={() => navigate('/merchant-post-offer')} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Post New Offer
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5" />Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Date Range</Label>
                <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoriesLoading ? (
                      <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name.charAt(0).toUpperCase() + category.name.slice(1).replace('_', ' ')}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow" 
            onClick={() => navigate('/merchant-edit-offers')}
          >
            <CardHeader><CardTitle className="text-sm">Total Offers</CardTitle></CardHeader>
            <CardContent><h2 className="text-2xl font-bold text-primary underline hover:no-underline transition-all">{stats.totalOffers}</h2></CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow" 
            onClick={() => navigate('/merchant-edit-offers')}
          >
            <CardHeader><CardTitle className="text-sm">Approved Offers</CardTitle></CardHeader>
            <CardContent><h2 className="text-2xl font-bold text-green-600 underline hover:no-underline transition-all">{stats.approvedOffers}</h2></CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow" 
            onClick={() => navigate('/merchant-edit-offers')}
          >
            <CardHeader><CardTitle className="text-sm">Pending Offers</CardTitle></CardHeader>
            <CardContent><h2 className="text-2xl font-bold text-orange-600 underline hover:no-underline transition-all">{stats.pendingOffers}</h2></CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow" 
            onClick={() => document.getElementById('customer-saves-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <CardHeader><CardTitle className="text-sm">Total Saves</CardTitle></CardHeader>
            <CardContent><h2 className="text-2xl font-bold text-primary underline hover:no-underline transition-all">{stats.totalSaves}</h2></CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow" 
            onClick={() => document.getElementById('customer-redemptions-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <CardHeader><CardTitle className="text-sm">Total Redemptions</CardTitle></CardHeader>
            <CardContent><h2 className="text-2xl font-bold text-primary underline hover:no-underline transition-all">{stats.totalRedemptions}</h2></CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow" 
            onClick={() => document.getElementById('revenue-chart-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <CardHeader><CardTitle className="text-base">Total Revenue</CardTitle></CardHeader>
            <CardContent><h2 className="text-2xl font-bold text-primary underline hover:no-underline transition-all">₹{stats.totalRevenue}</h2></CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle>Category Breakdown</CardTitle></CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={stats.categoriesData} dataKey="value" nameKey="name" label>
                    {stats.categoriesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Redemption Modes</CardTitle></CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={stats.redemptionModes} dataKey="value" nameKey="name" label>
                    {stats.redemptionModes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader><CardTitle>Monthly Activity</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.monthlyActivity} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="offers" fill="#4ECDC4" name="Offers" />
                <Bar dataKey="saves" fill="#FF6B6B" name="Saves" />
                <Bar dataKey="redemptions" fill="#45B7D1" name="Redemptions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="mt-6" id="revenue-chart-section">
          <CardHeader><CardTitle>Revenue by Offer</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.offerPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <defs>
                  {stats.offerPerformance.map((_, index) => {
                    const gradientColors = [
                      ['#6366f1', '#8b5cf6'], // Indigo to Purple
                      ['#10b981', '#059669'], // Emerald gradient
                      ['#f59e0b', '#f97316'], // Amber to Orange
                      ['#ef4444', '#dc2626'], // Red gradient
                      ['#3b82f6', '#1d4ed8'], // Blue gradient
                      ['#8b5cf6', '#7c3aed'], // Purple gradient
                      ['#06b6d4', '#0891b2'], // Cyan gradient
                      ['#84cc16', '#65a30d'], // Lime gradient
                      ['#f97316', '#ea580c'], // Orange gradient
                      ['#ec4899', '#db2777'], // Pink gradient
                    ];
                    const colors = gradientColors[index % gradientColors.length];
                    return (
                      <linearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colors[0]} />
                        <stop offset="100%" stopColor={colors[1]} />
                      </linearGradient>
                    );
                  })}
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="title" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [`₹${value}`, 'Revenue']}
                  labelFormatter={(label) => `Offer: ${label}`}
                />
                <Bar dataKey="revenue" name="Revenue">
                  {stats.offerPerformance.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#gradient${index})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader><CardTitle>Top Performing Offers</CardTitle></CardHeader>
          <CardContent>
            {stats.offerPerformance.map((o, idx) => (
              <div key={idx} className="flex justify-between py-2 border-b last:border-b-0">
                <span>{o.title}</span>
                <span>Saves: {o.saves}, Redemptions: {o.redemptions}, Revenue: ₹{o.revenue}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Redemptions */}
        {stats.pendingRedemptions.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Redemptions
                <Badge variant="secondary">{stats.pendingRedemptions.length}</Badge>
              </CardTitle>
              <CardDescription>Customer redemption requests awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {stats.pendingRedemptions.map((redemption, idx) => (
                  <div key={idx} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold">{redemption.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{redemption.customer_email}</p>
                        <p className="text-sm font-medium text-primary">{redemption.offer_title}</p>
                        <p className="text-xs text-muted-foreground mt-1">Requested: {redemption.redeemed_at}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button 
                          size="sm" 
                          onClick={() => approveRedemption(redemption.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => rejectRedemption(redemption.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Customer Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Card id="customer-saves-section">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Customer Saves
              </CardTitle>
              <CardDescription>Customers who saved your offers</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.customerSaves.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {stats.customerSaves.map((save, idx) => (
                    <div key={idx} className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{save.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{save.customer_email}</p>
                          <p className="text-sm font-medium text-primary">{save.offer_title}</p>
                        </div>
                        <Badge variant="secondary">{save.saved_at}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No saves yet</p>
              )}
            </CardContent>
          </Card>

          <Card id="customer-redemptions-section">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Customer Redemptions
              </CardTitle>
              <CardDescription>Customers who redeemed your offers</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.customerRedemptions.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {stats.customerRedemptions.map((redemption, idx) => (
                    <div key={idx} className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{redemption.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{redemption.customer_email}</p>
                          <p className="text-sm font-medium text-green-600">{redemption.offer_title}</p>
                        </div>
                        <Badge variant="outline" className="border-green-500 text-green-600">
                          {redemption.redeemed_at}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No redemptions yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MerchantDashboard;
