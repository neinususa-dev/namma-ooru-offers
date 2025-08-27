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
  const [currentPoints, setCurrentPoints] = useState(250);
  const [totalEarned, setTotalEarned] = useState(1840);
  const [level] = useState("Campus Champ");
  const [nextLevelPoints] = useState(500);

  return (
    <div className="min-h-screen bg-sunset-gradient">
      <Header showNavigation={false} />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header / Welcome Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center mb-4">
            <Gift className="h-12 w-12 text-secondary mr-3 animate-float" />
            <h1 className="text-4xl md:text-5xl font-bold bg-primary-gradient bg-clip-text text-transparent">
              Welcome to Your Rewards!
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Earn points, get discounts, and share with friends across Tamil Nadu's best stores!
          </p>
        </div>

        {/* User Status & Level */}
        {user && (
          <Card className="mx-auto max-w-md bg-card/80 backdrop-blur-sm border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-secondary" />
                  <span className="font-semibold text-primary">{level}</span>
                </div>
                <Badge variant="secondary" className="bg-secondary-gradient">
                  Level 3
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to next level</span>
                  <span>{currentPoints}/{nextLevelPoints}</span>
                </div>
                <Progress value={(currentPoints / nextLevelPoints) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Joining Bonus */}
        {!user && (
          <Card className="bg-primary-gradient text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Zap className="h-6 w-6 mr-2" />
                Sign Up Bonus!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold">Get ₹50 Points Instantly!</div>
                <p className="text-white/90">
                  Join thousands of Tamil Nadu students already saving money on their favorite stores.
                </p>
                <div className="flex gap-3">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-white text-primary hover:bg-white/90 border-white"
                  >
                    Sign Up Now
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10"
                  >
                    Login
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rewards Dashboard */}
        {user && (
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Points</CardTitle>
                <Coins className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">₹{currentPoints}</div>
                <p className="text-xs text-muted-foreground">Ready to redeem!</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                <Trophy className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">₹{totalEarned}</div>
                <p className="text-xs text-muted-foreground">Since joining</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
                <Target className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">12</div>
                <p className="text-xs text-muted-foreground">Near your college</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Referral Program */}
        <Card className="bg-secondary-gradient text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 -translate-x-12"></div>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Users className="h-6 w-6 mr-2" />
              Invite Friends & Earn More
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold mb-2">Invite 3 friends = ₹100 points!</div>
              <p className="text-white/90 text-sm">
                Share your love for savings with classmates and roommates
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <Share2 className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                Instagram Story
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                Telegram
              </Button>
            </div>
            <div className="text-sm text-white/80">
              Your referral code: <span className="font-mono bg-white/20 px-2 py-1 rounded">STUDENT2024</span>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Scan Section */}
        <Card className="bg-accent-gradient text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <QrCode className="h-6 w-6 mr-2" />
              Earn Rewards in Stores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white/90">
              Scan QR codes in participating stores around Tamil Nadu colleges to earn points instantly!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/20 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Camera className="h-5 w-5 mr-2" />
                  <span className="font-semibold">Quick Scan</span>
                </div>
                <p className="text-sm text-white/80">
                  Open camera, scan QR at checkout, earn 5-50 points per visit
                </p>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Star className="h-5 w-5 mr-2" />
                  <span className="font-semibold">Bonus Points</span>
                </div>
                <p className="text-sm text-white/80">
                  First-time store visits get 2x points! Perfect for exploring new places
                </p>
              </div>
            </div>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Camera className="h-5 w-5 mr-2" />
              Scan QR Code Now
            </Button>
          </CardContent>
        </Card>

        {/* Popular Stores Near Colleges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary" />
              Popular Near Tamil Nadu Colleges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Saravana Stores", location: "Anna Nagar", points: "10-25 pts" },
                { name: "Phoenix MarketCity", location: "Velachery", points: "15-30 pts" },
                { name: "Express Avenue", location: "Royapettah", points: "20-40 pts" },
                { name: "Local Tea Stalls", location: "Near Colleges", points: "5-10 pts" }
              ].map((store, index) => (
                <div key={index} className="text-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="font-semibold text-sm mb-1">{store.name}</div>
                  <div className="text-xs text-muted-foreground mb-2">{store.location}</div>
                  <Badge variant="outline" className="text-xs">
                    {store.points}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gamification Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-secondary" />
              Your Achievement Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {[
                { name: "Newbie", icon: Star, earned: true, color: "text-secondary" },
                { name: "Campus Champ", icon: Crown, earned: true, color: "text-primary" },
                { name: "Store Explorer", icon: Target, earned: true, color: "text-accent" },
                { name: "Referral King", icon: Users, earned: false, color: "text-muted-foreground" },
                { name: "Point Master", icon: Coins, earned: false, color: "text-muted-foreground" },
                { name: "QR Scanner Pro", icon: QrCode, earned: false, color: "text-muted-foreground" }
              ].map((badge, index) => (
                <div key={index} className="text-center p-3">
                  <badge.icon className={`h-8 w-8 mx-auto mb-2 ${badge.color} ${badge.earned ? 'animate-pulse-glow' : ''}`} />
                  <div className={`text-xs font-medium ${badge.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {badge.name}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Rewards;