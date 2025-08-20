import React, { useState } from 'react';
import { Search, MapPin, Users, TrendingUp, Store, Flame, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DistrictSelect } from '@/components/DistrictSelect';
import { OfferCard } from '@/components/OfferCard';
import { OfferFilters } from '@/components/OfferFilters';
import heroImage from '@/assets/hero-marketplace.jpg';
import shopOffersImage from '@/assets/shop-offers.jpg';

// Mock data for demonstration
const mockOffers = [
  {
    id: '1',
    shopName: 'Saravana Stores',
    offerTitle: '50% Off on Traditional Wear',
    description: 'Huge discount on sarees, dhotis, and traditional clothing. Limited time offer!',
    discount: '50% OFF',
    expiryDate: '31 Dec 2024',
    location: 'Chennai',
    category: 'fashion',
    isHot: true,
    image: shopOffersImage
  },
  {
    id: '2',
    shopName: 'Murugan Idli Shop',
    offerTitle: 'Buy 2 Get 1 Free Idli Sets',
    description: 'Authentic South Indian breakfast with amazing taste and quality.',
    discount: 'B2G1 FREE',
    expiryDate: '25 Dec 2024',
    location: 'Coimbatore',
    category: 'food',
    isTrending: true,
    image: shopOffersImage
  },
  {
    id: '3',
    shopName: 'Poorvika Mobiles',
    offerTitle: 'Smartphone Festival Sale',
    description: 'Latest smartphones with exchange offers and EMI options available.',
    discount: '₹5000 OFF',
    expiryDate: '30 Dec 2024',
    location: 'Madurai',
    category: 'electronics',
    image: shopOffersImage
  },
  {
    id: '4',
    shopName: 'Kumaran Textiles',
    offerTitle: 'Wedding Collection Special',
    description: 'Premium silk sarees and wedding collection with exclusive designs.',
    discount: '40% OFF',
    expiryDate: '15 Jan 2025',
    location: 'Salem',
    category: 'fashion',
    isHot: true,
    image: shopOffersImage
  },
  {
    id: '5',
    shopName: 'Annapoorna Restaurant',
    offerTitle: 'Family Feast Package',
    description: 'Complete meals for family with traditional Tamil Nadu dishes.',
    discount: '25% OFF',
    expiryDate: '28 Dec 2024',
    location: 'Tirupur',
    category: 'food',
    image: shopOffersImage
  },
  {
    id: '6',
    shopName: 'GRT Jewellers',
    offerTitle: 'Gold Coin with Every Purchase',
    description: 'Free gold coin on jewelry purchase above ₹50,000. Limited period offer.',
    discount: 'FREE COIN',
    expiryDate: '31 Dec 2024',
    location: 'Chennai',
    category: 'fashion',
    isTrending: true,
    image: shopOffersImage
  }
];

const Index = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredOffers = mockOffers.filter(offer => {
    const matchesCategory = selectedCategory === 'all' || offer.category === selectedCategory;
    const matchesSearch = offer.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         offer.offerTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const hotOffers = mockOffers.filter(offer => offer.isHot);
  const trendingOffers = mockOffers.filter(offer => offer.isTrending);

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-sunset-gradient">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-primary/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-tamil-gradient rounded-lg flex items-center justify-center">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-tamil-gradient bg-clip-text text-transparent">
                  Namma OOru Offers
                </h1>
                <p className="text-xs text-muted-foreground">Your Local Savings Hub</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">Login</Button>
              <Button variant="hero" size="sm">Sign Up</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-tamil-gradient bg-clip-text text-transparent">
                    Namma OOru
                  </span>
                  <br />
                  <span className="text-foreground">Offers</span>
                </h2>
                <p className="text-xl text-muted-foreground">
                  Discover amazing deals and offers from your favorite local shops across Tamil Nadu. 
                  Save money while supporting local businesses!
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-lg shadow-md border border-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Store className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">1000+</div>
                      <div className="text-sm text-muted-foreground">Local Shops</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card p-4 rounded-lg shadow-md border border-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <Heart className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-secondary">50K+</div>
                      <div className="text-sm text-muted-foreground">Happy Customers</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="tamil" size="xl" className="flex-1">
                  <Search className="h-5 w-5 mr-2" />
                  Explore Offers
                </Button>
                <Button variant="merchant" size="xl" className="flex-1">
                  <Users className="h-5 w-5 mr-2" />
                  Become a Merchant
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="animate-float">
                <img 
                  src={heroImage} 
                  alt="Tamil Nadu Local Marketplace" 
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-hot-offer text-hot-offer-foreground p-4 rounded-lg shadow-lg animate-pulse-glow">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5" />
                  <div className="text-sm font-bold">Live Offers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* District Selection & Search */}
      <section className="py-8 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <DistrictSelect 
                  value={selectedDistrict}
                  onValueChange={setSelectedDistrict}
                  placeholder="Select your district"
                />
              </div>
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for shops, offers, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card shadow-md border-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hot Offers Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-hot-offer animate-pulse" />
              <h3 className="text-3xl font-bold text-foreground">Today's Hot Offers</h3>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-hot-offer/50 to-transparent"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotOffers.map(offer => (
              <OfferCard key={offer.id} {...offer} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Offers Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-trending animate-bounce" />
              <h3 className="text-3xl font-bold text-foreground">Top Trending Coupons</h3>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-trending/50 to-transparent"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingOffers.map(offer => (
              <OfferCard key={offer.id} {...offer} />
            ))}
          </div>
        </div>
      </section>

      {/* All Offers Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-foreground mb-2">All Offers</h3>
            <p className="text-muted-foreground">Discover all available offers from local shops</p>
          </div>

          <div className="mb-6">
            <OfferFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onClearFilters={handleClearFilters}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredOffers.map(offer => (
              <OfferCard key={offer.id} {...offer} />
            ))}
          </div>

          {filteredOffers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h4 className="text-xl font-semibold mb-2">No offers found</h4>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
              <Button variant="outline" onClick={handleClearFilters}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Merchant CTA Section */}
      <section className="py-16 bg-secondary-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-primary/90"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white space-y-6">
            <h3 className="text-4xl font-bold">Are you a local business owner?</h3>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands of merchants who are growing their sales with Namma OOru Offers. 
              Post your offers and reach more customers today!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button variant="secondary" size="xl" className="bg-white text-secondary hover:bg-white/90">
                <Store className="h-5 w-5 mr-2" />
                Post Your Offers
              </Button>
              <Button variant="outline" size="xl" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold">₹500/mo</div>
                <div className="text-sm opacity-75">20 Offers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">₹1500/mo</div>
                <div className="text-sm opacity-75">Unlimited</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">FREE</div>
                <div className="text-sm opacity-75">5 Offers/mo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-primary/10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-tamil-gradient rounded-lg flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-bold bg-tamil-gradient bg-clip-text text-transparent">
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

export default Index;