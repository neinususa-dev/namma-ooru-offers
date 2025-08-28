import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Gift, 
  Users, 
  QrCode, 
  Star, 
  Trophy, 
  Camera,
  Share2,
  Coins,
  Target,
  Crown,
  Zap
} from "lucide-react";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";

const Rewards = () => {
  const { user } = useAuth();
  const [currentPoints] = useState(250);
  const [totalEarned] = useState(1840);
  const [level] = useState("Campus Champ");
  const [nextLevelPoints] = useState(500);

  return (
    <div className="min-h-screen bg-white">
      <Header showNavigation={false} />

      <div className="container mx-auto px-4 py-8 space-y-12">

        {/* Hero Section */}
        <Card className="rounded-2xl shadow-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white text-center p-8">
          <Gift className="h-16 w-16 mx-auto animate-bounce mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Earn Rewards with Namma Ooru Offers!</h1>
          <p className="text-white/90 mb-4 text-lg max-w-xl mx-auto">
            Register now and instantly get ₹50 points. Refer friends, scan QR codes in stores, and unlock more exciting rewards across Tamil Nadu!
          </p>
          <div className="flex justify-center gap-4">
           <Button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl shadow-lg 
                     hover:text-white hover:bg-blue-600 transition-colors duration-300">
    Sign Up Now
  </Button>
            <Button className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">
            Login
          </Button>
          </div>
        </Card>

     {/* How to Earn Points - 3 Column Layout */}
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
        Earn ₹50 points for each successful referral!
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
        Earn 5-50 points per visit!
      </p>
      <p className="text-white/80 text-base">
        First-time visits double your points. Explore stores near your location and maximize your rewards.
      </p>
    </CardContent>
  </Card>

  {/* Column 3: Active Offers */}
  <Card className="rounded-2xl shadow-lg bg-gradient-to-r from-blue-400 to-purple-500 text-white p-6 text-center">
    <CardHeader className="flex justify-center mb-4">
      <Target className="h-16 w-16 mx-auto" />
    </CardHeader>
    <CardTitle className="text-xl font-bold mb-2">Active Offers</CardTitle>
    <CardContent>
      <p className="text-white/90 mb-2 text-lg">
        Browse the latest deals near your location through Namma Ooru Offers.
      </p>
      <p className="text-white/90 mb-2 font-semibold text-lg">
        Redeem points while shopping and earn extra rewards.
      </p>
      <p className="text-white/80 text-base">
        Combine referrals, QR scans, and active deals to maximize your points daily. Don’t miss limited-time offers!
      </p>
    </CardContent>
  </Card>

</div>


{/* Achievement Badges Section */}
<div className="space-y-4">
  <h2 className="text-2xl font-bold text-center mb-4">Your Achievement Badges</h2>
  <div className="grid grid-cols-6 gap-4 justify-center text-center">
    <Card className="p-4 flex flex-col items-center justify-center rounded-xl shadow-md">
      <Star className="h-8 w-8 mb-2 text-yellow-400" />
      <span className="text-sm font-medium">Bronze</span>
    </Card>
    <Card className="p-4 flex flex-col items-center justify-center rounded-xl shadow-md">
      <Trophy className="h-8 w-8 mb-2 text-green-500" />
      <span className="text-sm font-medium">Silver</span>
    </Card>
    <Card className="p-4 flex flex-col items-center justify-center rounded-xl shadow-md">
      <Camera className="h-8 w-8 mb-2 text-blue-500" />
      <span className="text-sm font-medium">Gold</span>
    </Card>
    <Card className="p-4 flex flex-col items-center justify-center rounded-xl shadow-md">
      <Users className="h-8 w-8 mb-2 text-pink-500" />
      <span className="text-sm font-medium">Diamond</span>
    </Card>
    
  </div>
</div>

        {/* Rewards Dashboard & Referral - visible after login */}
        {user && (
          <div className="space-y-6">

            {/* Dashboard */}
            <div className="grid md:grid-cols-3 gap-6">

              <Card className="rounded-2xl shadow-md bg-gradient-to-r from-green-400 to-green-600 text-white p-6 text-center">
                <CardTitle className="text-sm font-medium mb-2">Current Points</CardTitle>
                <Coins className="h-6 w-6 mx-auto mb-2" />
                <div className="text-3xl font-bold">{currentPoints}</div>
                <p className="text-white/80 text-sm">Ready to redeem!</p>
              </Card>

              <Card className="rounded-2xl shadow-md bg-gradient-to-r from-orange-400 to-orange-600 text-white p-6 text-center">
                <CardTitle className="text-sm font-medium mb-2">Total Earned</CardTitle>
                <Trophy className="h-6 w-6 mx-auto mb-2" />
                <div className="text-3xl font-bold">{totalEarned}</div>
                <p className="text-white/80 text-sm">Since joining</p>
              </Card>

              <Card className="rounded-2xl shadow-md bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 text-center">
                <CardTitle className="text-sm font-medium mb-2">Active Offers</CardTitle>
                <Target className="h-6 w-6 mx-auto mb-2" />
                <div className="text-3xl font-bold">12</div>
                <p className="text-white/80 text-sm">Near your Location</p>
              </Card>

            </div>

            {/* Referral & Social Sharing */}
            <Card className="rounded-2xl shadow-lg bg-gradient-to-r from-green-400 to-green-200 text-white p-6">
              <CardTitle className="text-2xl font-bold flex items-center mb-4">
                <Users className="h-6 w-6 mr-2" />
                Share & Earn Points
              </CardTitle>
              <p className="text-white/90 mb-2">
                Your unique referral code: <span className="font-mono bg-white/20 px-2 py-1 rounded">USER12345</span>
              </p>
              <p className="text-white/90 mb-4">
                Share on social media to earn extra points every time your friends register!
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-white/30 border-white/40 text-white font-bold rounded-xl hover:bg-white/50 transition-colors px-4 py-2 flex items-center">
                  <Share2 className="h-4 w-4 mr-2" /> WhatsApp
                </Button>
                <Button className="bg-white/30 border-white/40 text-white font-bold rounded-xl hover:bg-white/50 transition-colors px-4 py-2">
                  Instagram Story
                </Button>
                <Button className="bg-white/30 border-white/40 text-white font-bold rounded-xl hover:bg-white/50 transition-colors px-4 py-2">
                  Telegram
                </Button>
              </div>
            </Card>

          </div>
        )}

      </div>
    </div>
  );
};

export default Rewards;
