import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Gift, Share2, Copy, Trophy, TrendingUp, Zap, QrCode, Star, Award, Crown, Heart, Coins, Target, Camera } from 'lucide-react';
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
  const [activeSection, setActiveSection] = useState<string>('rewards');
  const { user } = useAuth();
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

  const getLevelProgress = () => {
    if (!userReward) return 0;
    const { total_earned_points } = userReward;
    
    if (total_earned_points >= 1000) return 100;
    if (total_earned_points >= 500) return ((total_earned_points - 500) / 500) * 100;
    if (total_earned_points >= 200) return ((total_earned_points - 200) / 300) * 100;
    return (total_earned_points / 200) * 100;
  };

  const getNextLevelPoints = () => {
    if (!userReward) return 0;
    const { total_earned_points } = userReward;
    
    if (total_earned_points >= 1000) return 0;
    if (total_earned_points >= 500) return 1000 - total_earned_points;
    if (total_earned_points >= 200) return 500 - total_earned_points;
    return 200 - total_earned_points;
  };

  const getNextLevel = () => {
    if (!userReward) return 'Silver';
    const { total_earned_points } = userReward;
    
    if (total_earned_points >= 1000) return 'Platinum';
    if (total_earned_points >= 500) return 'Platinum';
    if (total_earned_points >= 200) return 'Gold';
    return 'Silver';
  };

  return (
    <div className="min-h-screen bg-white">
      <Header showNavigation={true} activeSection={activeSection} onSectionChange={handleSectionChange} />

      <div className="container mx-auto px-4 py-8 space-y-12">

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
                onClick={() => navigate('/sign-up')}
                className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl shadow-lg 
                          hover:text-white hover:bg-blue-600 transition-colors duration-300"
              >
                Sign Up Now
              </Button>
              <Button 
                onClick={() => navigate('/sign-in')}
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
        {user && userReward && (
          <div className="space-y-8">
            {/* Points & Level Overview */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="rounded-2xl shadow-md bg-gradient-to-r from-green-400 to-green-600 text-white p-6 text-center">
                <CardTitle className="text-sm font-medium mb-2">Current Points</CardTitle>
                <Coins className="h-6 w-6 mx-auto mb-2" />
                <div className="text-3xl font-bold">{userReward.current_points}</div>
                <p className="text-white/80 text-sm">Ready to redeem!</p>
              </Card>

              <Card className="rounded-2xl shadow-md bg-gradient-to-r from-orange-400 to-orange-600 text-white p-6 text-center">
                <CardTitle className="text-sm font-medium mb-2">Total Earned</CardTitle>
                <Trophy className="h-6 w-6 mx-auto mb-2" />
                <div className="text-3xl font-bold">{userReward.total_earned_points}</div>
                <p className="text-white/80 text-sm">Since joining</p>
              </Card>

              <Card className="rounded-2xl shadow-md bg-gradient-to-r from-purple-400 to-purple-600 text-white p-6 text-center">
                <CardTitle className="text-sm font-medium mb-2">Level</CardTitle>
                <Crown className="h-6 w-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{userReward.level_name}</div>
                <p className="text-white/80 text-sm">Your status</p>
              </Card>

              <Card className="rounded-2xl shadow-md bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 text-center">
                <CardTitle className="text-sm font-medium mb-2">Referrals</CardTitle>
                <Users className="h-6 w-6 mx-auto mb-2" />
                <div className="text-3xl font-bold">{referrals.filter(r => r.referrer_id === user.id).length}</div>
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
              
              {/* Level Icons Row */}
              <div className="flex items-center justify-between mb-6">
                {/* Bronze Level */}
                <div className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                  userReward.total_earned_points >= 0 ? 'bg-amber-100 scale-110' : 'bg-gray-100'
                }`}>
                  <Star className={`h-8 w-8 mb-2 transition-colors duration-300 ${
                    userReward.total_earned_points >= 0 ? 'text-amber-600 animate-pulse' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm font-bold ${
                    userReward.total_earned_points >= 0 ? 'text-amber-700' : 'text-gray-500'
                  }`}>Bronze</span>
                  <span className="text-xs text-muted-foreground">0 pts</span>
                </div>

                {/* Connection Line 1 */}
                <div className={`h-1 flex-1 mx-2 rounded transition-colors duration-500 ${
                  userReward.total_earned_points >= 200 ? 'bg-gradient-to-r from-amber-400 to-gray-400' : 'bg-gray-200'
                }`}></div>

                {/* Silver Level */}
                <div className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                  userReward.total_earned_points >= 200 ? 'bg-gray-100 scale-110' : 'bg-gray-50'
                }`}>
                  <Trophy className={`h-8 w-8 mb-2 transition-colors duration-300 ${
                    userReward.total_earned_points >= 200 ? 'text-gray-500 animate-pulse' : 'text-gray-300'
                  }`} />
                  <span className={`text-sm font-bold ${
                    userReward.total_earned_points >= 200 ? 'text-gray-700' : 'text-gray-400'
                  }`}>Silver</span>
                  <span className="text-xs text-muted-foreground">200 pts</span>
                </div>

                {/* Connection Line 2 */}
                <div className={`h-1 flex-1 mx-2 rounded transition-colors duration-500 ${
                  userReward.total_earned_points >= 500 ? 'bg-gradient-to-r from-gray-400 to-yellow-400' : 'bg-gray-200'
                }`}></div>

                {/* Gold Level */}
                <div className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                  userReward.total_earned_points >= 500 ? 'bg-yellow-100 scale-110' : 'bg-gray-50'
                }`}>
                  <Award className={`h-8 w-8 mb-2 transition-colors duration-300 ${
                    userReward.total_earned_points >= 500 ? 'text-yellow-600 animate-pulse' : 'text-gray-300'
                  }`} />
                  <span className={`text-sm font-bold ${
                    userReward.total_earned_points >= 500 ? 'text-yellow-700' : 'text-gray-400'
                  }`}>Gold</span>
                  <span className="text-xs text-muted-foreground">500 pts</span>
                </div>

                {/* Connection Line 3 */}
                <div className={`h-1 flex-1 mx-2 rounded transition-colors duration-500 ${
                  userReward.total_earned_points >= 1000 ? 'bg-gradient-to-r from-yellow-400 to-purple-400' : 'bg-gray-200'
                }`}></div>

                {/* Platinum Level */}
                <div className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                  userReward.total_earned_points >= 1000 ? 'bg-purple-100 scale-110' : 'bg-gray-50'
                }`}>
                  <Crown className={`h-8 w-8 mb-2 transition-colors duration-300 ${
                    userReward.total_earned_points >= 1000 ? 'text-purple-600 animate-pulse' : 'text-gray-300'
                  }`} />
                  <span className={`text-sm font-bold ${
                    userReward.total_earned_points >= 1000 ? 'text-purple-700' : 'text-gray-400'
                  }`}>Platinum</span>
                  <span className="text-xs text-muted-foreground">1000 pts</span>
                </div>
              </div>

              {/* Current Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Current: {userReward.total_earned_points} points</span>
                  <span className="text-muted-foreground">
                    {userReward.level_name} Level
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
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="earn">Earn Points</TabsTrigger>
                <TabsTrigger value="redeem">Redeem</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
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
                        {userReward.referral_code}
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
                        const text = `🎉 Join Namma Ooru Offers and get exclusive deals across Tamil Nadu! Use my referral code: ${userReward.referral_code} to get started! 🏪✨`;
                        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                        window.open(url, '_blank');
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors px-4 py-3 flex items-center justify-center"
                    >
                      <Share2 className="h-4 w-4 mr-2" /> WhatsApp
                    </Button>
                    <Button 
                      onClick={() => {
                        const text = `🎉 Join Namma Ooru Offers with my referral code: ${userReward.referral_code} and get exclusive local deals! 🏪`;
                        const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(text)}`;
                        window.open(url, '_blank');
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors px-4 py-3 flex items-center justify-center"
                    >
                      <Share2 className="h-4 w-4 mr-2" /> Telegram
                    </Button>
                    <Button 
                      onClick={() => {
                        const text = `🎉 Just discovered amazing local deals on Namma Ooru Offers! Join with my code: ${userReward.referral_code} 🏪 #NammaOoruOffers #LocalDeals #TamilNadu`;
                        const url = `https://www.instagram.com/create/story/?media=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(text)}`;
                        window.open(url, '_blank');
                      }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-colors px-4 py-3 flex items-center justify-center"
                    >
                      <Share2 className="h-4 w-4 mr-2" /> Instagram
                    </Button>
                  </div>
                </Card>

                <ActivityHistory activities={activities} loading={loading} />
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
                  userReward={userReward} 
                  onRedeem={redeemRewardOffer} 
                />
              </TabsContent>

              <TabsContent value="activity">
                <ActivityHistory activities={activities} loading={loading} />
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

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600 text-center">{error}</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Footer */}
      <footer className="bg-card border-t border-primary/10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img 
                src="/lovable-uploads/3c633683-8c9d-4ff2-ace7-6658272f2afd.png" 
                alt="Namma OOru Offers Logo" 
                className="w-8 h-8 rounded"
              />
              <div>
                <div className="font-bold bg-blue-orange-gradient bg-clip-text text-transparent">
                  Namma OOru Offers
                </div>
                <div className="text-xs text-muted-foreground">Your Local Savings Hub</div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground text-center md:text-right">
              <p>© 2024 Namma OOru Offers. Supporting local businesses across Tamil Nadu.</p>
              <p className="mt-1">Made with ❤️ for Tamil Nadu</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Rewards;