import React, { useState } from 'react';
import { Search, MapPin, Users, TrendingUp, Store, Flame, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DistrictSelect } from '@/components/DistrictSelect';
import { OfferCard } from '@/components/OfferCard';
import { OfferFilters } from '@/components/OfferFilters';
import heroImage from '@/assets/hero-marketplace.jpg';
import shopOffersImage from '@/assets/shop-offers.jpg';
import foodOfferImage from '@/assets/food-offer.jpg';
import fashionOfferImage from '@/assets/fashion-offer.jpg';
import electronicsOfferImage from '@/assets/electronics-offer.jpg';
import homeOfferImage from '@/assets/home-offer.jpg';
import groceryOfferImage from '@/assets/grocery-offer.jpg';

// Mock data for demonstration
const mockOffers = [
  // Food & Dining (5 offers)
  {
    id: '1',
    shopName: 'Murugan Idli Shop',
    offerTitle: 'Buy 2 Get 1 Free Idli Sets',
    description: 'Authentic South Indian breakfast with amazing taste and quality.',
    discount: 'B2G1 FREE',
    expiryDate: '25 Dec 2024',
    location: 'Chennai',
    category: 'food',
    isTrending: true,
    image: foodOfferImage
  },
  {
    id: '2',
    shopName: 'Annapoorna Restaurant',
    offerTitle: 'Family Feast Package',
    description: 'Complete meals for family with traditional Tamil Nadu dishes.',
    discount: '25% OFF',
    expiryDate: '28 Dec 2024',
    location: 'Coimbatore',
    category: 'food',
    image: foodOfferImage
  },
  {
    id: '3',
    shopName: 'Hotel Buhari',
    offerTitle: 'Biryani Special Combo',
    description: 'Best biryani in town with free raita and pickle.',
    discount: '₹100 OFF',
    expiryDate: '30 Dec 2024',
    location: 'Madurai',
    category: 'food',
    isHot: true,
    image: foodOfferImage
  },
  {
    id: '4',
    shopName: 'A2B Restaurant',
    offerTitle: 'South Indian Thali Special',
    description: 'Unlimited South Indian meals with variety of dishes.',
    discount: '30% OFF',
    expiryDate: '2 Jan 2025',
    location: 'Salem',
    category: 'food',
    image: foodOfferImage
  },
  {
    id: '5',
    shopName: 'Adyar Ananda Bhavan',
    offerTitle: 'Sweet Box Combo',
    description: 'Mixed sweets box perfect for festivals and celebrations.',
    discount: '20% OFF',
    expiryDate: '5 Jan 2025',
    location: 'Tirupur',
    category: 'food',
    image: foodOfferImage
  },

  // Fashion & Clothing (5 offers)
  {
    id: '6',
    shopName: 'Saravana Stores',
    offerTitle: '50% Off on Traditional Wear',
    description: 'Huge discount on sarees, dhotis, and traditional clothing.',
    discount: '50% OFF',
    expiryDate: '31 Dec 2024',
    location: 'Chennai',
    category: 'fashion',
    isHot: true,
    image: fashionOfferImage
  },
  {
    id: '7',
    shopName: 'Kumaran Textiles',
    offerTitle: 'Wedding Collection Special',
    description: 'Premium silk sarees and wedding collection with exclusive designs.',
    discount: '40% OFF',
    expiryDate: '15 Jan 2025',
    location: 'Coimbatore',
    category: 'fashion',
    isHot: true,
    image: fashionOfferImage
  },
  {
    id: '8',
    shopName: 'GRT Jewellers',
    offerTitle: 'Gold Coin with Every Purchase',
    description: 'Free gold coin on jewelry purchase above ₹50,000.',
    discount: 'FREE COIN',
    expiryDate: '31 Dec 2024',
    location: 'Madurai',
    category: 'fashion',
    isTrending: true,
    image: fashionOfferImage
  },
  {
    id: '9',
    shopName: 'Pothys',
    offerTitle: 'Designer Saree Collection',
    description: 'Latest designer sarees with modern and traditional patterns.',
    discount: '35% OFF',
    expiryDate: '10 Jan 2025',
    location: 'Salem',
    category: 'fashion',
    image: fashionOfferImage
  },
  {
    id: '10',
    shopName: 'Chennai Silks',
    offerTitle: 'Bridal Wear Exclusive',
    description: 'Complete bridal collection with matching accessories.',
    discount: '45% OFF',
    expiryDate: '20 Jan 2025',
    location: 'Tirupur',
    category: 'fashion',
    image: fashionOfferImage
  },

  // Electronics (5 offers)
  {
    id: '11',
    shopName: 'Poorvika Mobiles',
    offerTitle: 'Smartphone Festival Sale',
    description: 'Latest smartphones with exchange offers and EMI options.',
    discount: '₹5000 OFF',
    expiryDate: '30 Dec 2024',
    location: 'Chennai',
    category: 'electronics',
    image: electronicsOfferImage
  },
  {
    id: '12',
    shopName: 'Vijay Sales',
    offerTitle: 'Home Appliance Mega Sale',
    description: 'Refrigerators, washing machines, and ACs at best prices.',
    discount: '₹8000 OFF',
    expiryDate: '3 Jan 2025',
    location: 'Coimbatore',
    category: 'electronics',
    isHot: true,
    image: electronicsOfferImage
  },
  {
    id: '13',
    shopName: 'Reliance Digital',
    offerTitle: 'Laptop & Desktop Deals',
    description: 'Best deals on laptops, desktops and computer accessories.',
    discount: '₹10000 OFF',
    expiryDate: '7 Jan 2025',
    location: 'Madurai',
    category: 'electronics',
    isTrending: true,
    image: electronicsOfferImage
  },
  {
    id: '14',
    shopName: 'Croma',
    offerTitle: 'Gaming Console Special',
    description: 'PlayStation and Xbox consoles with free games.',
    discount: '₹3000 OFF',
    expiryDate: '12 Jan 2025',
    location: 'Salem',
    category: 'electronics',
    image: electronicsOfferImage
  },
  {
    id: '15',
    shopName: 'Sangeetha Mobiles',
    offerTitle: 'Tablet & Smartwatch Combo',
    description: 'Buy tablet and get smartwatch at special price.',
    discount: 'B1G1 50%',
    expiryDate: '15 Jan 2025',
    location: 'Tirupur',
    category: 'electronics',
    image: electronicsOfferImage
  },

  // Services (5 offers)
  {
    id: '16',
    shopName: 'Apollo Pharmacy',
    offerTitle: 'Health Checkup Package',
    description: 'Complete health checkup with free consultation.',
    discount: '40% OFF',
    expiryDate: '25 Dec 2024',
    location: 'Chennai',
    category: 'services',
    image: homeOfferImage
  },
  {
    id: '17',
    shopName: 'Urban Company',
    offerTitle: 'Home Cleaning Service',
    description: 'Professional home cleaning with eco-friendly products.',
    discount: '₹500 OFF',
    expiryDate: '1 Jan 2025',
    location: 'Coimbatore',
    category: 'services',
    isTrending: true,
    image: homeOfferImage
  },
  {
    id: '18',
    shopName: 'Byju\'s Learning Hub',
    offerTitle: 'Online Course Discount',
    description: 'Premium online courses for students with live classes.',
    discount: '60% OFF',
    expiryDate: '10 Jan 2025',
    location: 'Madurai',
    category: 'services',
    isHot: true,
    image: homeOfferImage
  },
  {
    id: '19',
    shopName: 'OYO Hotels',
    offerTitle: 'Weekend Stay Special',
    description: 'Book weekend stays at premium hotels with breakfast.',
    discount: '35% OFF',
    expiryDate: '31 Dec 2024',
    location: 'Salem',
    category: 'services',
    image: homeOfferImage
  },
  {
    id: '20',
    shopName: 'Zomato Pro',
    offerTitle: 'Food Delivery Free',
    description: 'Free delivery on all orders above ₹199 for 3 months.',
    discount: 'FREE DELIVERY',
    expiryDate: '5 Jan 2025',
    location: 'Tirupur',
    category: 'services',
    image: homeOfferImage
  },

  // Groceries (5 offers)
  {
    id: '21',
    shopName: 'More Supermarket',
    offerTitle: 'Fresh Vegetables Special',
    description: 'Farm fresh vegetables delivered to your doorstep.',
    discount: '25% OFF',
    expiryDate: '28 Dec 2024',
    location: 'Chennai',
    category: 'groceries',
    image: groceryOfferImage
  },
  {
    id: '22',
    shopName: 'Spencer\'s Retail',
    offerTitle: 'Monthly Grocery Pack',
    description: 'Complete monthly grocery needs at discounted rates.',
    discount: '₹1000 OFF',
    expiryDate: '2 Jan 2025',
    location: 'Coimbatore',
    category: 'groceries',
    isHot: true,
    image: groceryOfferImage
  },
  {
    id: '23',
    shopName: 'Big Bazaar',
    offerTitle: 'Buy 3 Get 1 Free',
    description: 'Buy any 3 items and get 1 absolutely free on selected items.',
    discount: 'B3G1 FREE',
    expiryDate: '8 Jan 2025',
    location: 'Madurai',
    category: 'groceries',
    isTrending: true,
    image: groceryOfferImage
  },
  {
    id: '24',
    shopName: 'Reliance Fresh',
    offerTitle: 'Organic Products Sale',
    description: 'Premium organic products for healthy living.',
    discount: '30% OFF',
    expiryDate: '12 Jan 2025',
    location: 'Salem',
    category: 'groceries',
    image: groceryOfferImage
  },
  {
    id: '25',
    shopName: 'Amma Mini Market',
    offerTitle: 'Local Products Special',
    description: 'Support local vendors with special prices on traditional items.',
    discount: '20% OFF',
    expiryDate: '18 Jan 2025',
    location: 'Tirupur',
    category: 'groceries',
    image: groceryOfferImage
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
    // Get the district name from the district id for comparison
    const districtName = !selectedDistrict ? '' : (() => {
      const tamilNaduDistricts = [
        { id: 'ariyalur', name: 'Ariyalur' },
        { id: 'chengalpattu', name: 'Chengalpattu' },
        { id: 'chennai', name: 'Chennai' },
        { id: 'coimbatore', name: 'Coimbatore' },
        { id: 'cuddalore', name: 'Cuddalore' },
        { id: 'dharmapuri', name: 'Dharmapuri' },
        { id: 'dindigul', name: 'Dindigul' },
        { id: 'erode', name: 'Erode' },
        { id: 'kallakurichi', name: 'Kallakurichi' },
        { id: 'kanchipuram', name: 'Kanchipuram' },
        { id: 'kanyakumari', name: 'Kanyakumari' },
        { id: 'karur', name: 'Karur' },
        { id: 'krishnagiri', name: 'Krishnagiri' },
        { id: 'madurai', name: 'Madurai' },
        { id: 'mayiladuthurai', name: 'Mayiladuthurai' },
        { id: 'nagapattinam', name: 'Nagapattinam' },
        { id: 'namakkal', name: 'Namakkal' },
        { id: 'nilgiris', name: 'Nilgiris' },
        { id: 'perambalur', name: 'Perambalur' },
        { id: 'pudukkottai', name: 'Pudukkottai' },
        { id: 'ramanathapuram', name: 'Ramanathapuram' },
        { id: 'ranipet', name: 'Ranipet' },
        { id: 'salem', name: 'Salem' },
        { id: 'sivaganga', name: 'Sivaganga' },
        { id: 'tenkasi', name: 'Tenkasi' },
        { id: 'thanjavur', name: 'Thanjavur' },
        { id: 'theni', name: 'Theni' },
        { id: 'thoothukudi', name: 'Thoothukudi' },
        { id: 'tiruchirappalli', name: 'Tiruchirappalli' },
        { id: 'tirunelveli', name: 'Tirunelveli' },
        { id: 'tirupattur', name: 'Tirupattur' },
        { id: 'tiruppur', name: 'Tiruppur' },
        { id: 'tiruvallur', name: 'Tiruvallur' },
        { id: 'tiruvannamalai', name: 'Tiruvannamalai' },
        { id: 'tiruvarur', name: 'Tiruvarur' },
        { id: 'vellore', name: 'Vellore' },
        { id: 'viluppuram', name: 'Viluppuram' },
        { id: 'virudhunagar', name: 'Virudhunagar' },
      ];
      const district = tamilNaduDistricts.find(d => d.id === selectedDistrict);
      return district ? district.name : '';
    })();
    const matchesLocation = !selectedDistrict || offer.location === districtName;
    return matchesCategory && matchesSearch && matchesLocation;
  });

  const hotOffers = mockOffers.filter(offer => offer.isHot);
  const trendingOffers = mockOffers.filter(offer => offer.isTrending);

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedDistrict('');
  };

  return (
    <div className="min-h-screen bg-sunset-gradient">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-primary/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-orange-gradient rounded-lg flex items-center justify-center">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-blue-orange-gradient bg-clip-text text-transparent">
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
                  <span className="bg-blue-orange-gradient bg-clip-text text-transparent">
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
                <Button variant="default" size="xl" className="flex-1">
                  <Search className="h-5 w-5 mr-2" />
                  Explore Offers
                </Button>
                <Button variant="secondary" size="xl" className="flex-1">
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
              <div className="w-8 h-8 bg-blue-orange-gradient rounded-lg flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
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

export default Index;