import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Heart, Gift, TrendingUp, Bookmark, ShoppingBag, 
  ArrowLeft, Calendar, Award, Target
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface CustomerStats {
  totalSaved: number;
  totalRedeemed: number;
  categoriesData: Array<{ name: string; value: number; color: string }>;
  monthlyActivity: Array<{ month: string; saved: number; redeemed: number }>;
  topCategories: Array<{ category: string; count: number; percentage: number }>;
}

const CustomerAnalytics = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<CustomerStats>({
    totalSaved: 0,
    totalRedeemed: 0,
    categoriesData: [],
    monthlyActivity: [],
    topCategories: []
  });
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchCustomerAnalytics();
    }
  }, [user]);

  const fetchCustomerAnalytics = async () => {
    if (!user) return;
    
    try {
      setLoading(true);

      // Fetch saved offers with offer details
      const { data: savedOffers, error: savedError } = await supabase
        .from('saved_offers')
        .select(`
          id,
          saved_at,
          offers (
            category,
            title,
            discount_percentage
          )
        `)
        .eq('user_id', user.id);

      if (savedError) throw savedError;

      // Fetch redeemed offers with offer details
      const { data: redeemedOffers, error: redeemedError } = await supabase
        .from('redemptions')
        .select(`
          id,
          redeemed_at,
          offers (
            category,
            title,
            discount_percentage
          )
        `)
        .eq('user_id', user.id);

      if (redeemedError) throw redeemedError;

      // Process data for analytics
      const categoryColors = {
        food: '#FF6B6B',
        fashion: '#4ECDC4',
        electronics: '#45B7D1',
        groceries: '#96CEB4',
        services: '#FFEAA7',
        other: '#DDA0DD'
      };

      // Category breakdown
      const categoryCounts: Record<string, number> = {};
      [...(savedOffers || []), ...(redeemedOffers || [])].forEach(item => {
        const category = item.offers?.category || 'other';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });

      const categoriesData = Object.entries(categoryCounts).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: value as number,
        color: categoryColors[name] || categoryColors.other
      }));

      // Monthly activity (last 6 months)
      const monthlyActivity = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        const monthName = date.toLocaleString('default', { month: 'short' });
        
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const savedCount = (savedOffers || []).filter(item => {
          const savedDate = new Date(item.saved_at);
          return savedDate >= monthStart && savedDate <= monthEnd;
        }).length;
        
        const redeemedCount = (redeemedOffers || []).filter(item => {
          const redeemedDate = new Date(item.redeemed_at);
          return redeemedDate >= monthStart && redeemedDate <= monthEnd;
        }).length;
        
        return {
          month: monthName,
          saved: savedCount,
          redeemed: redeemedCount
        };
      });

      // Top categories with percentages
      const total = Object.values(categoryCounts).reduce((sum: number, count: number) => sum + count, 0);
      const topCategories = Object.entries(categoryCounts)
        .map(([category, count]) => ({
          category: category.charAt(0).toUpperCase() + category.slice(1),
          count: count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        totalSaved: savedOffers?.length || 0,
        totalRedeemed: redeemedOffers?.length || 0,
        categoriesData,
        monthlyActivity,
        topCategories
      });
    } catch (error) {
      console.error('Error fetching customer analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-primary-gradient bg-clip-text text-transparent">
              Your Analytics
            </h1>
            <p className="text-muted-foreground">Track your offer activity and preferences</p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="offer-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalSaved}</p>
                  <p className="text-sm text-muted-foreground">Offers Saved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="offer-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Gift className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalRedeemed}</p>
                  <p className="text-sm text-muted-foreground">Offers Redeemed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="offer-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Target className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold">
                    {stats.totalSaved > 0 ? Math.round((stats.totalRedeemed / stats.totalSaved) * 100) : 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Redemption Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="offer-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Award className="h-8 w-8 text-trending" />
                <div>
                  <p className="text-2xl font-bold">{stats.topCategories.length}</p>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Monthly Activity
                  </CardTitle>
                  <CardDescription>Your offer activity over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.monthlyActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="saved" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="Saved"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="redeemed" 
                        stroke="hsl(var(--secondary))" 
                        strokeWidth={2}
                        name="Redeemed"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bookmark className="h-5 w-5" />
                    Favorite Categories
                  </CardTitle>
                  <CardDescription>Categories you engage with most</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.topCategories.map((category, index) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="min-w-6 h-6 rounded-full p-0 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <span className="font-medium">{category.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{category.count} offers</span>
                        <Badge variant="secondary">{category.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                  {stats.topCategories.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Start saving offers to see your favorite categories!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Category Breakdown
                </CardTitle>
                <CardDescription>Distribution of your saved and redeemed offers by category</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.categoriesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={stats.categoriesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stats.categoriesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No category data yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start exploring and saving offers to see your category preferences!
                    </p>
                    <Button asChild>
                      <Link to="/">Browse Offers</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Activity History
                </CardTitle>
                <CardDescription>Your offer saving and redemption patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={stats.monthlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="saved" fill="hsl(var(--primary))" name="Saved" />
                    <Bar dataKey="redeemed" fill="hsl(var(--secondary))" name="Redeemed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CustomerAnalytics;