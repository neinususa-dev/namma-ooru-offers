import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Gift, Share2, Copy, Trophy, TrendingUp, Zap, QrCode, Star, Award, Crown, Heart, Coins, Target, Camera, Store } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { useRewards } from '@/hooks/useRewards';
import { QRScanner } from '@/components/QRScanner';
import { RewardOffers } from '@/components/RewardOffers';
import { ActivityHistory } from '@/components/ActivityHistory';
import { Leaderboard } from '@/components/Leaderboard';
import { toast } from 'sonner';

const Rewards = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<string>('rewards');
  const { user, profile, loading: authLoading } = useAuth();
  const { 
    userReward, 
    activities, 
    rewardOffers, 
    referrals,
    loading, 
    error,
    redeemRewardOffer,
    copyReferralCode,
    refetch
  } = useRewards();

  const getSuperAdminViewContext = (pathname: string) => {
    const customerRoutes = ['/', '/rewards', '/your-offers', '/customer-analytics', '/about', '/profile'];
    const merchantRoutes = ['/merchant-dashboard', '/merchant-post-offer', '/merchant-edit-offers', '/billing', '/payment-success', '/payment-canceled'];
    
    if (customerRoutes.includes(pathname)) {
      return 'customer';
    } else if (merchantRoutes.includes(pathname)) {
      return 'merchant';
    }
    return 'customer'; // default to customer view
  };

  const isSuperAdminInMerchantView = profile?.role === 'super_admin' && getSuperAdminViewContext(location.pathname) === 'merchant';
  const isSuperAdminInCustomerView = profile?.role === 'super_admin' && getSuperAdminViewContext(location.pathname) === 'customer';

  // Mock customer data for super admin in customer view
  const mockCustomerReward = {
    id: 'mock-reward',
    user_id: user?.id || '',
    current_points: 1250,
    total_earned_points: 3450,
    total_redeemed_points: 2200,
    level_name: 'Gold',
    referral_code: 'BALAN2024',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const mockActivities = [
    {
      id: '1',
      user_id: user?.id || '',
      activity_type: 'qr_scan' as const,
      points: 25,
      points_awarded: 25,
      description: 'QR code scanned at Local Electronics Store',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2', 
      user_id: user?.id || '',
      activity_type: 'referral' as const,
      points: 100,
      points_awarded: 100,
      description: 'Friend joined using your referral code',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      user_id: user?.id || '',
      activity_type: 'social_share' as const,
      points: 15,
      points_awarded: 15,
      description: 'Shared offer on social media',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const mockReferrals = [
    {
      id: '1',
      referrer_id: user?.id || '',
      referred_id: 'mock-user-1',
      referral_code: 'BALAN2024',
      points_awarded: 100,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2', 
      referrer_id: user?.id || '',
      referred_id: 'mock-user-2',
      referral_code: 'BALAN2024',
      points_awarded: 100,
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Use mock data for super admin in customer view, otherwise use real data
  const displayUserReward = isSuperAdminInCustomerView ? mockCustomerReward : userReward;
  const displayActivities = isSuperAdminInCustomerView ? mockActivities : activities;
  const displayReferrals = isSuperAdminInCustomerView ? mockReferrals : referrals;

  const getLevelProgress = () => {
    const rewardData = displayUserReward;
    if (!rewardData) return 0;
    const { total_earned_points } = rewardData;
    const referralCount = displayReferrals.filter(r => r.referrer_id === user?.id).length;
    const qrScanCount = displayActivities.filter(a => a.activity_type === 'qr_scan').length;
    
    // Check for special levels first
    if (referralCount >= 100 && total_earned_points >= 4000) return 100; // Referral King
    if (qrScanCount >= 100 && total_earned_points >= 6000) return 100; // QR Master
    if (total_earned_points >= 2500) return 100; // Platinum
    if (total_earned_points >= 1000) return ((total_earned_points - 1000) / 1500) * 100;
    if (total_earned_points >= 500) return ((total_earned_points - 500) / 500) * 100;
    if (total_earned_points >= 200) return ((total_earned_points - 200) / 300) * 100;
    if (total_earned_points >= 25) return ((total_earned_points - 25) / 175) * 100;
    return (total_earned_points / 25) * 100;
  };

  const getNextLevelPoints = () => {
    const rewardData = displayUserReward;
    if (!rewardData) return 25;
    const { total_earned_points } = rewardData;
    const referralCount = displayReferrals.filter(r => r.referrer_id === user?.id).length;
    const qrScanCount = displayActivities.filter(a => a.activity_type === 'qr_scan').length;
    
    if (referralCount >= 100 && total_earned_points >= 4000) return 0; // Referral King
    if (qrScanCount >= 100 && total_earned_points >= 6000) return 0; // QR Master
    if (total_earned_points >= 2500) return 0; // Platinum
    if (total_earned_points >= 1000) return 2500 - total_earned_points;
    if (total_earned_points >= 500) return 1000 - total_earned_points;
    if (total_earned_points >= 200) return 500 - total_earned_points;
    if (total_earned_points >= 25) return 200 - total_earned_points;
    return 25 - total_earned_points;
  };

  const getNextLevel = () => {
    const rewardData = displayUserReward;
    if (!rewardData) return 'Bronze';
    const { total_earned_points } = rewardData;
    const referralCount = displayReferrals.filter(r => r.referrer_id === user?.id).length;
    const qrScanCount = displayActivities.filter(a => a.activity_type === 'qr_scan').length;
    
    if (referralCount >= 100 && total_earned_points >= 4000) return 'Referral King';
    if (qrScanCount >= 100 && total_earned_points >= 6000) return 'QR Master';
    if (total_earned_points >= 2500) return 'Referral King or QR Master';
    if (total_earned_points >= 1000) return 'Platinum';
    if (total_earned_points >= 500) return 'Gold';
    if (total_earned_points >= 200) return 'Silver';
    if (total_earned_points >= 25) return 'Silver';
    return 'Bronze';
  };

  const getCurrentLevel = () => {
    const rewardData = displayUserReward;
    if (!rewardData) return 'Bronze';
    const { total_earned_points } = rewardData;
    const referralCount = displayReferrals.filter(r => r.referrer_id === user?.id).length;
    const qrScanCount = displayActivities.filter(a => a.activity_type === 'qr_scan').length;
    
    if (referralCount >= 100 && total_earned_points >= 4000) return 'Referral King';
    if (qrScanCount >= 100 && total_earned_points >= 6000) return 'QR Master';
    if (total_earned_points >= 2500) return 'Platinum';
    if (total_earned_points >= 1000) return 'Gold';
    if (total_earned_points >= 500) return 'Gold';
    if (total_earned_points >= 200) return 'Silver';
    if (total_earned_points >= 25) return 'Bronze';
    return 'Bronze';
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    switch (section) {
      case 'home':
        navigate('/');
        break;
      case 'hot-deals':
        navigate('/?section=hot-deals');
        break;
      case 'local-deals':
        navigate('/?section=local-deals');
        break;
      case 'store-list':
        navigate('/?section=store-list');
        break;
      case 'rewards':
        // Already on rewards page
        break;
      default:
        navigate('/');
    }
  };

  const handleCopyReferralCode = async () => {
    const success = await copyReferralCode();
    if (success) {
      toast.success('Referral code copied to clipboard!');
    } else {
      toast.error('Failed to copy referral code');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <Header showNavigation={false} />
      
      <main className="container mx-auto px-4 py-8">
        {isSuperAdminInMerchantView ? (
          // Merchant rewards view for super admin
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-blue-orange-gradient bg-clip-text text-transparent mb-4">
                Merchant Rewards Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage and track merchant reward programs (Super Admin View)
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Store className="h-5 w-5 text-blue-600" />
                    Active Merchants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">156</div>
                  <p className="text-sm text-muted-foreground">Merchants with active reward programs</p>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Gift className="h-5 w-5 text-orange-500" />
                    Total Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-500 mb-2">2,847</div>
                  <p className="text-sm text-muted-foreground">Rewards distributed this month</p>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">89%</div>
                  <p className="text-sm text-muted-foreground">Merchant satisfaction rate</p>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Merchant Reward Analytics</CardTitle>
                <CardDescription>
                  Overview of reward program performance across all merchants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                    <div>
                      <h3 className="font-semibold">Top Performing Program</h3>
                      <p className="text-sm text-muted-foreground">Electronics Store Chain</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">1,249</div>
                      <p className="text-sm text-muted-foreground">Rewards issued</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                    <div>
                      <h3 className="font-semibold">Most Active Category</h3>
                      <p className="text-sm text-muted-foreground">Food & Restaurants</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-500">847</div>
                      <p className="text-sm text-muted-foreground">Active programs</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Customer rewards view (default and for super admin in customer view)
          <div className="space-y-12">
            {loading && <div className="text-center">Loading rewards...</div>}
            {error && <div className="text-center text-red-500">Error: {error}</div>}
            
            {/* Hero Section */}
            <Card className="rounded-2xl shadow-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white text-center p-8">
              <Gift className="h-16 w-16 mx-auto animate-bounce mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Earn Rewards with Namma Ooru Offers!</h1>
              <p className="text-white/90 mb-4 text-lg max-w-xl mx-auto">
                {user 
                  ? "Refer friends, scan QR codes in stores, share on Social media with your referral code and unlock more exciting rewards across Tamil Nadu!"
                  : "Register now and instantly get 50 points. Refer friends, scan QR codes in stores, and unlock more exciting rewards across Tamil Nadu!"
                }
              </p>
              {!user ? (
                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={() => navigate('/signup')}
                    className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl shadow-lg 
                              hover:text-white hover:bg-blue-600 transition-colors duration-300"
                  >
                    Sign Up Now
                  </Button>
                  <Button 
                    onClick={() => navigate('/signin')}
                    className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    Login
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                    Welcome back, {user.user_metadata?.name || 'User'}!
                  </Badge>
                </div>
              )}
            </Card>

            {/* User Dashboard - visible after login */}
            {user && displayUserReward && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-4 gap-6">
                  <Card className="rounded-2xl shadow-md bg-gradient-to-r from-green-400 to-green-600 text-white p-6 text-center">
                    <CardTitle className="text-sm font-medium mb-2">Current Points</CardTitle>
                    <Coins className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-3xl font-bold">{displayUserReward.current_points}</div>
                    <p className="text-white/80 text-sm">Ready to redeem!</p>
                  </Card>

                  <Card className="rounded-2xl shadow-md bg-gradient-to-r from-orange-400 to-orange-600 text-white p-6 text-center">
                    <CardTitle className="text-sm font-medium mb-2">Total Earned</CardTitle>
                    <Trophy className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-3xl font-bold">{displayUserReward.total_earned_points}</div>
                    <p className="text-white/80 text-sm">Since joining</p>
                  </Card>

                  <Card className="rounded-2xl shadow-md bg-gradient-to-r from-purple-400 to-purple-600 text-white p-6 text-center">
                    <CardTitle className="text-sm font-medium mb-2">Level</CardTitle>
                    <Crown className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{displayUserReward.level_name}</div>
                    <p className="text-white/80 text-sm">Your status</p>
                  </Card>

                  <Card className="rounded-2xl shadow-md bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 text-center">
                    <CardTitle className="text-sm font-medium mb-2">Referrals</CardTitle>
                    <Users className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-3xl font-bold">{displayReferrals.filter(r => r.referrer_id === user.id).length}</div>
                    <p className="text-white/80 text-sm">Friends invited</p>
                  </Card>
                </div>

                {/* Level Progress */}
                <Card className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-center mb-2">Your Level Progress</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      {getNextLevelPoints() > 0 
                        ? `${getNextLevelPoints()} points to reach ${getNextLevel()}`
                        : 'Congratulations! Maximum level reached!'
                      }
                    </p>
                  </div>
                  
                  {/* Level Icons Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                    {/* Bronze Level */}
                     <div className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                       displayUserReward.total_earned_points >= 0 ? 'bg-amber-100 scale-105 shadow-md' : 'bg-gray-100'
                     }`}>
                       <Star className={`h-8 w-8 mb-2 transition-colors duration-300 ${
                         displayUserReward.total_earned_points >= 0 ? 'text-amber-600 animate-pulse' : 'text-gray-400'
                       }`} />
                       <span className={`text-sm font-bold ${
                         displayUserReward.total_earned_points >= 0 ? 'text-amber-700' : 'text-gray-500'
                       }`}>Bronze</span>
                      <span className="text-xs text-muted-foreground">25 pts</span>
                    </div>

                    {/* Silver Level */}
                     <div className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                       displayUserReward.total_earned_points >= 200 ? 'bg-gray-100 scale-105 shadow-md' : 'bg-gray-50'
                     }`}>
                       <Trophy className={`h-8 w-8 mb-2 transition-colors duration-300 ${
                         displayUserReward.total_earned_points >= 200 ? 'text-gray-500 animate-pulse' : 'text-gray-300'
                       }`} />
                       <span className={`text-sm font-bold ${
                         displayUserReward.total_earned_points >= 200 ? 'text-gray-700' : 'text-gray-400'
                       }`}>Silver</span>
                      <span className="text-xs text-muted-foreground">200 pts</span>
                    </div>

                    {/* Gold Level */}
                     <div className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                       displayUserReward.total_earned_points >= 500 ? 'bg-yellow-100 scale-105 shadow-md' : 'bg-gray-50'
                     }`}>
                       <Award className={`h-8 w-8 mb-2 transition-colors duration-300 ${
                         displayUserReward.total_earned_points >= 500 ? 'text-yellow-600 animate-pulse' : 'text-gray-300'
                       }`} />
                       <span className={`text-sm font-bold ${
                         displayUserReward.total_earned_points >= 500 ? 'text-yellow-700' : 'text-gray-400'
                       }`}>Gold</span>
                      <span className="text-xs text-muted-foreground">500 pts</span>
                    </div>

                    {/* Platinum Level */}
                     <div className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                       displayUserReward.total_earned_points >= 2500 ? 'bg-purple-100 scale-105 shadow-md' : 'bg-gray-50'
                     }`}>
                       <Crown className={`h-8 w-8 mb-2 transition-colors duration-300 ${
                         displayUserReward.total_earned_points >= 2500 ? 'text-purple-600 animate-pulse' : 'text-gray-300'
                       }`} />
                       <span className={`text-sm font-bold ${
                         displayUserReward.total_earned_points >= 2500 ? 'text-purple-700' : 'text-gray-400'
                       }`}>Platinum</span>
                      <span className="text-xs text-muted-foreground">2500 pts</span>
                    </div>

                    {/* Referral King Level */}
                     <div className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                       displayReferrals.filter(r => r.referrer_id === user?.id).length >= 100 && displayUserReward.total_earned_points >= 4000 ? 'bg-pink-100 scale-105 shadow-md' : 'bg-gray-50'
                     }`}>
                       <Users className={`h-8 w-8 mb-2 transition-colors duration-300 ${
                         displayReferrals.filter(r => r.referrer_id === user?.id).length >= 100 && displayUserReward.total_earned_points >= 4000 ? 'text-pink-600 animate-pulse' : 'text-gray-300'
                       }`} />
                       <span className={`text-sm font-bold ${
                         displayReferrals.filter(r => r.referrer_id === user?.id).length >= 100 && displayUserReward.total_earned_points >= 4000 ? 'text-pink-700' : 'text-gray-400'
                       }`}>Referral King</span>
                      <span className="text-xs text-muted-foreground">100+ refs & 4000 pts</span>
                    </div>

                    {/* QR Master Level */}
                     <div className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                       displayActivities.filter(a => a.activity_type === 'qr_scan').length >= 100 && displayUserReward.total_earned_points >= 6000 ? 'bg-blue-100 scale-105 shadow-md' : 'bg-gray-50'
                     }`}>
                       <QrCode className={`h-8 w-8 mb-2 transition-colors duration-300 ${
                         displayActivities.filter(a => a.activity_type === 'qr_scan').length >= 100 && displayUserReward.total_earned_points >= 6000 ? 'text-blue-600 animate-pulse' : 'text-gray-300'
                       }`} />
                       <span className={`text-sm font-bold ${
                         displayActivities.filter(a => a.activity_type === 'qr_scan').length >= 100 && displayUserReward.total_earned_points >= 6000 ? 'text-blue-700' : 'text-gray-400'
                       }`}>QR Master</span>
                      <span className="text-xs text-muted-foreground">100+ scans & 6000 pts</span>
                    </div>
                  </div>

                  {/* Current Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Current: {displayUserReward.total_earned_points} points</span>
                      <span className="text-muted-foreground">
                        {getCurrentLevel()} Level
                      </span>
                    </div>
                    <div className="relative">
                      <Progress value={getLevelProgress()} className="h-4" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-white drop-shadow-lg">
                          {Math.round(getLevelProgress())}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Tabs for different sections */}
                <Tabs defaultValue="dashboard" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-blue-50 to-purple-50 p-2 rounded-2xl">
                    <TabsTrigger 
                      value="dashboard" 
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-blue-100 transition-all duration-300 rounded-xl font-semibold"
                    >
                      🏠 Dashboard
                    </TabsTrigger>
                    <TabsTrigger 
                      value="earn" 
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-green-100 transition-all duration-300 rounded-xl font-semibold"
                    >
                      💰 Earn Points
                    </TabsTrigger>
                    <TabsTrigger 
                      value="redeem" 
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-orange-100 transition-all duration-300 rounded-xl font-semibold"
                    >
                      🎁 Redeem
                    </TabsTrigger>
                    <TabsTrigger 
                      value="activity" 
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-purple-100 transition-all duration-300 rounded-xl font-semibold"
                    >
                      📊 Activity
                    </TabsTrigger>
                    <TabsTrigger 
                      value="leaderboard" 
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-pink-100 transition-all duration-300 rounded-xl font-semibold"
                    >
                      🏆 Leaderboard
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="dashboard" className="space-y-6">
                    {/* Referral & Social Sharing */}
                    <Card className="rounded-2xl shadow-lg bg-gradient-to-r from-green-400 to-green-600 text-white p-6">
                      <CardTitle className="text-2xl font-bold flex items-center mb-4">
                        <Users className="h-6 w-6 mr-2" />
                        Share & Earn Points
                      </CardTitle>
                      <div className="bg-white/10 rounded-xl p-4 mb-4">
                        <p className="text-white/90 mb-2 text-lg font-semibold">
                          Your Unique Referral Code:
                        </p>
                        <div className="flex items-center justify-between bg-white/20 rounded-lg p-3">
                           <span className="font-mono text-2xl font-bold text-white">
                             {displayUserReward.referral_code || 'BALAN2024'}
                           </span>
                          <Button
                            onClick={handleCopyReferralCode}
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20 px-3 py-2"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                        </div>
                      </div>
                      <p className="text-white/90 mb-6 text-lg">
                        Share with friends and earn <span className="font-bold">25 points</span> for each successful referral!
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                         <Button 
                           onClick={() => {
                             const shareUrl = `${window.location.origin}/signup?ref=${displayUserReward.referral_code || 'BALAN2024'}`;
                             const text = `🎉 Join Namma Ooru Offers and get exclusive deals across Tamil Nadu! Use my referral code: ${displayUserReward.referral_code || 'BALAN2024'} 
${shareUrl} 🏪✨`;
                             const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                             window.open(url, '_blank');
                           }}
                           className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors px-4 py-3 flex items-center justify-center"
                         >
                           <Share2 className="h-4 w-4 mr-2" /> WhatsApp
                         </Button>
                         <Button 
                           onClick={() => {
                             const shareUrl = `${window.location.origin}/signup?ref=${displayUserReward.referral_code || 'BALAN2024'}`;
                             const text = `🎉 Join Namma Ooru Offers with my referral code: ${displayUserReward.referral_code || 'BALAN2024'} and get exclusive local deals! 
${shareUrl} 🏪`;
                             const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
                             window.open(url, '_blank');
                           }}
                           className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors px-4 py-3 flex items-center justify-center"
                         >
                           <Share2 className="h-4 w-4 mr-2" /> Telegram
                         </Button>
                         <Button 
                           onClick={() => {
                             const shareUrl = `${window.location.origin}/signup?ref=${displayUserReward.referral_code || 'BALAN2024'}`;
                             const text = `🎉 Just discovered amazing local deals on Namma Ooru Offers! Join with my code: ${displayUserReward.referral_code || 'BALAN2024'} 
${shareUrl} 🏪 #NammaOoruOffers #LocalDeals #TamilNadu`;
                             // For Instagram, we'll use the general share API or copy to clipboard
                             navigator.clipboard.writeText(text).then(() => {
                               toast.success('Instagram share text copied to clipboard!');
                             });
                           }}
                           className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-colors px-4 py-3 flex items-center justify-center"
                         >
                           <Share2 className="h-4 w-4 mr-2" /> Instagram
                         </Button>
                      </div>
                    </Card>

                     <ActivityHistory activities={displayActivities} loading={loading} />
                  </TabsContent>

                  <TabsContent value="earn" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <QRScanner onPointsAwarded={refetch} />
                      
                      {/* How to Earn Points */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Ways to Earn Points</CardTitle>
                          <CardDescription>Multiple ways to boost your rewards</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <div className="p-2 bg-green-100 rounded-full">
                              <Users className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">Refer Friends</p>
                              <p className="text-sm text-muted-foreground">Earn 25 points per referral</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <div className="p-2 bg-orange-100 rounded-full">
                              <QrCode className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <p className="font-medium">QR Code Scans</p>
                              <p className="text-sm text-muted-foreground">Earn 10 points per store visit</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <div className="p-2 bg-blue-100 rounded-full">
                              <Gift className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">Welcome Bonus</p>
                              <p className="text-sm text-muted-foreground">50 points for signing up</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                   <TabsContent value="redeem">
                     <RewardOffers 
                       offers={rewardOffers} 
                       userReward={displayUserReward} 
                       onRedeem={redeemRewardOffer} 
                     />
                   </TabsContent>

                   <TabsContent value="activity">
                     <ActivityHistory activities={displayActivities} loading={loading} />
                   </TabsContent>

                  <TabsContent value="leaderboard">
                    <Leaderboard />
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* How to Earn Points - 3 Column Layout (for non-logged in users) */}
            {!user && (
              <>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Column 1: Refer Friends */}
                  <Card className="rounded-2xl shadow-lg bg-gradient-to-r from-green-400 to-green-600 text-white p-6 text-center">
                    <CardHeader className="flex justify-center mb-4">
                      <Users className="h-16 w-16 mx-auto" />
                    </CardHeader>
                    <CardTitle className="text-xl font-bold mb-2">Refer Friends & Earn Big!</CardTitle>
                    <CardContent>
                      <p className="text-white/90 mb-2 text-lg">
                        Share Namma Ooru Offers with your friends, classmates, and roommates.
                      </p>
                      <p className="text-white/90 mb-2 font-semibold text-lg">
                        Earn 25 points for each successful referral!
                      </p>
                      <p className="text-white/80 text-base">
                        The more friends you invite, the more points you collect. Stack up your rewards and unlock exclusive badges.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Column 2: Scan QR Codes */}
                  <Card className="rounded-2xl shadow-lg bg-gradient-to-r from-orange-400 to-orange-600 text-white p-6 text-center">
                    <CardHeader className="flex justify-center mb-4">
                      <QrCode className="h-16 w-16 mx-auto" />
                    </CardHeader>
                    <CardTitle className="text-xl font-bold mb-2">Scan QR Codes in Stores</CardTitle>
                    <CardContent>
                      <p className="text-white/90 mb-2 text-lg">
                        Visit participating stores and scan QR codes at checkout to earn points instantly.
                      </p>
                      <p className="text-white/90 mb-2 font-semibold text-lg">
                        Earn 10 points per visit!
                      </p>
                      <p className="text-white/80 text-base">
                        Explore stores near your location and maximize your rewards with every visit.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Column 3: Active Offers */}
                  <Card className="rounded-2xl shadow-lg bg-gradient-to-r from-blue-400 to-purple-500 text-white p-6 text-center">
                    <CardHeader className="flex justify-center mb-4">
                      <Target className="h-16 w-16 mx-auto" />
                    </CardHeader>
                    <CardTitle className="text-xl font-bold mb-2">Redeem Rewards</CardTitle>
                    <CardContent>
                      <p className="text-white/90 mb-2 text-lg">
                        Use your points to redeem exciting rewards and exclusive offers.
                      </p>
                      <p className="text-white/90 mb-2 font-semibold text-lg">
                        Free vouchers, discounts & more!
                      </p>
                      <p className="text-white/80 text-base">
                        From coffee vouchers to shopping discounts, turn your points into real value.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Achievement Badges Section */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-center mb-4">Achievement Badges</h2>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 justify-center text-center">
                    <Card className="p-4 flex flex-col items-center justify-center rounded-xl shadow-md">
                      <Star className="h-8 w-8 mb-2 text-amber-400" />
                      <span className="text-sm font-medium">Bronze</span>
                    </Card>
                    <Card className="p-4 flex flex-col items-center justify-center rounded-xl shadow-md">
                      <Trophy className="h-8 w-8 mb-2 text-gray-400" />
                      <span className="text-sm font-medium">Silver</span>
                    </Card>
                    <Card className="p-4 flex flex-col items-center justify-center rounded-xl shadow-md">
                      <Award className="h-8 w-8 mb-2 text-yellow-500" />
                      <span className="text-sm font-medium">Gold</span>
                    </Card>
                    <Card className="p-4 flex flex-col items-center justify-center rounded-xl shadow-md">
                      <Crown className="h-8 w-8 mb-2 text-purple-500" />
                      <span className="text-sm font-medium">Platinum</span>
                    </Card>
                    <Card className="p-4 flex flex-col items-center justify-center rounded-xl shadow-md">
                      <Users className="h-8 w-8 mb-2 text-pink-500" />
                      <span className="text-sm font-medium">Referral King</span>
                    </Card>
                    <Card className="p-4 flex flex-col items-center justify-center rounded-xl shadow-md">
                      <QrCode className="h-8 w-8 mb-2 text-blue-500" />
                      <span className="text-sm font-medium">QR Master</span>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Rewards;
