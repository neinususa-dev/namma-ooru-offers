import React, { useState } from 'react';
import { Search, MapPin, Users, TrendingUp, Store, Flame, Heart, ShoppingBag, X, Filter, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DistrictSelect } from '@/components/DistrictSelect';
import { CitySelect } from '@/components/CitySelect';
import { OfferCard } from '@/components/OfferCard';
import { OfferFilters } from '@/components/OfferFilters';
import { PaginatedOffersSection } from '@/components/PaginatedOffersSection';
import { StoreList } from '@/components/StoreList';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { useOfferDatabase } from '@/hooks/useOfferDatabase';
import { Link } from 'react-router-dom';
import { generateDefaultImage } from '@/utils/imageUtils';
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
    district: 'Chennai',
    city: 'chennai-city',
    location: 'Chennai City',
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
    district: 'Chennai',
    city: 'tambaram',
    location: 'Tambaram',
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
    district: 'Coimbatore',
    city: 'coimbatore-city',
    location: 'Coimbatore City',
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
    district: 'Coimbatore',
    city: 'pollachi',
    location: 'Pollachi',
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
    district: 'Madurai',
    city: 'madurai-city',
    location: 'Madurai City',
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
    district: 'Chennai',
    city: 'ambattur',
    location: 'Ambattur',
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
    district: 'Salem',
    city: 'salem-city',
    location: 'Salem City',
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
    district: 'Salem',
    city: 'attur',
    location: 'Attur',
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
    district: 'Tirupur',
    city: 'tirupur-city',
    location: 'Tirupur City',
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
    district: 'Tirupur',
    city: 'avinashi',
    location: 'Avinashi',
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
    district: 'Vellore',
    city: 'vellore-city',
    location: 'Vellore City',
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
    district: 'Vellore',
    city: 'katpadi',
    location: 'Katpadi',
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
    district: 'Thanjavur',
    city: 'thanjavur-city',
    location: 'Thanjavur City',
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
    district: 'Thanjavur',
    city: 'kumbakonam',
    location: 'Kumbakonam',
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
    district: 'Erode',
    city: 'erode-city',
    location: 'Erode City',
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
    district: 'Erode',
    city: 'gobichettipalayam',
    location: 'Gobichettipalayam',
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
    district: 'Kanyakumari',
    city: 'nagercoil',
    location: 'Nagercoil',
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
    district: 'Kanyakumari',
    city: 'kanyakumari-town',
    location: 'Kanyakumari Town',
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
    district: 'Tirunelveli',
    city: 'tirunelveli-city',
    location: 'Tirunelveli City',
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
    district: 'Tirunelveli',
    city: 'palayamkottai',
    location: 'Palayamkottai',
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
    district: 'Cuddalore',
    city: 'cuddalore-city',
    location: 'Cuddalore City',
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
    district: 'Cuddalore',
    city: 'chidambaram',
    location: 'Chidambaram',
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
    district: 'Tiruchirappalli',
    city: 'trichy-city',
    location: 'Trichy City',
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
    district: 'Tiruchirappalli',
    city: 'srirangam',
    location: 'Srirangam',
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
    district: 'Chennai',
    city: 'avadi',
    location: 'Avadi',
    category: 'groceries',
    image: groceryOfferImage
  },

  // Sathyamangalam Offers (5 offers across categories)
  {
    id: '26',
    shopName: 'Sathya Restaurant',
    offerTitle: 'Traditional South Indian Meals',
    description: 'Authentic Tamil meals with fresh ingredients and traditional recipes.',
    discount: '25% OFF',
    expiryDate: '30 Dec 2024',
    district: 'Erode',
    city: 'sathyamangalam',
    location: 'Sathyamangalam',
    category: 'food',
    isHot: true,
    image: foodOfferImage
  },
  {
    id: '27',
    shopName: 'Mangalam Textiles',
    offerTitle: 'Wedding Saree Collection',
    description: 'Beautiful handloom sarees for weddings and special occasions.',
    discount: '40% OFF',
    expiryDate: '15 Jan 2025',
    district: 'Erode',
    city: 'sathyamangalam',
    location: 'Sathyamangalam',
    category: 'fashion',
    isTrending: true,
    image: fashionOfferImage
  },
  {
    id: '28',
    shopName: 'Tech World Sathya',
    offerTitle: 'Mobile & Accessories Sale',
    description: 'Latest smartphones with cases, chargers and screen guards.',
    discount: '₹2000 OFF',
    expiryDate: '5 Jan 2025',
    district: 'Erode',
    city: 'sathyamangalam',
    location: 'Sathyamangalam',
    category: 'electronics',
    image: electronicsOfferImage
  },
  {
    id: '29',
    shopName: 'Sathya Health Clinic',
    offerTitle: 'Complete Health Checkup',
    description: 'Full body checkup with blood tests and doctor consultation.',
    discount: '50% OFF',
    expiryDate: '20 Jan 2025',
    district: 'Erode',
    city: 'sathyamangalam',
    location: 'Sathyamangalam',
    category: 'services',
    image: homeOfferImage
  },
  {
    id: '30',
    shopName: 'Mangalam Grocery Store',
    offerTitle: 'Monthly Essentials Pack',
    description: 'Rice, dal, oil and spices combo pack for monthly needs.',
    discount: '₹500 OFF',
    expiryDate: '25 Jan 2025',
    district: 'Erode',
    city: 'sathyamangalam',
    location: 'Sathyamangalam',
    category: 'groceries',
    image: groceryOfferImage
  }
];

const Index = () => {
  const { user } = useAuth();
  const { offers, loading, getOffersByType, getOffersByCategory, searchOffers } = useOfferDatabase();
  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFiltered, setShowFiltered] = useState<boolean>(false);

  const convertToOfferCardProps = (dbOffer: any) => {
    console.log('Converting offer:', dbOffer.title, 'merchant_name:', dbOffer.merchant_name);
    return {
      id: dbOffer.id,
      shopName: dbOffer.merchant_name || 'Local Merchant',
      offerTitle: dbOffer.title,
      description: dbOffer.description,
      discount: `${dbOffer.discount_percentage}% OFF`,
      originalPrice: dbOffer.original_price,
      discountedPrice: dbOffer.discounted_price,
      expiryDate: new Date(dbOffer.expiry_date).toLocaleDateString(),
      location: dbOffer.city || dbOffer.location, // Show city instead of specific location
      category: dbOffer.category,
      isHot: dbOffer.listing_type === 'hot_offers',
      isTrending: dbOffer.listing_type === 'trending',
      image: dbOffer.image_url || generateDefaultImage(dbOffer.merchant_name || 'Local Merchant')
    };
  };

  // Helper functions to convert IDs to names for filtering
  const getDistrictNameById = (districtId: string) => {
    const districts = [
      { id: 'erode', name: 'Erode' },
      { id: 'chennai', name: 'Chennai' },
      { id: 'coimbatore', name: 'Coimbatore' },
      { id: 'madurai', name: 'Madurai' },
      { id: 'salem', name: 'Salem' },
      { id: 'tirupur', name: 'Tirupur' },
      // Add other districts as needed
    ];
    const district = districts.find(d => d.id === districtId);
    return district ? district.name : districtId;
  };

  const getCityNameById = (cityId: string) => {
    const cities = [
      { id: 'sathyamangalam', name: 'Sathyamangalam' },
      { id: 'erode-city', name: 'Erode City' },
      { id: 'gobichettipalayam', name: 'Gobichettipalayam' },
      { id: 'bhavani', name: 'Bhavani' },
      // Add other cities as needed
    ];
    const city = cities.find(c => c.id === cityId);
    return city ? city.name : cityId;
  };

  const getOffersToShow = () => {
    let filteredOffers = offers;

    // Apply search filter
    if (searchQuery.trim()) {
      filteredOffers = searchOffers(searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filteredOffers = getOffersByCategory(selectedCategory);
    }

    // Location filtering - check district and city fields from database
    if (showFiltered && (selectedDistrict || selectedCity)) {
      filteredOffers = filteredOffers.filter(offer => {
        let districtMatch = true;
        let cityMatch = true;

        // Check district match if selected
        if (selectedDistrict) {
          const selectedDistrictName = getDistrictNameById(selectedDistrict);
          districtMatch = offer.district?.toLowerCase() === selectedDistrictName.toLowerCase();
        }

        // Check city match if selected  
        if (selectedCity) {
          const selectedCityName = getCityNameById(selectedCity);
          cityMatch = offer.city?.toLowerCase() === selectedCityName.toLowerCase();
        }

        return districtMatch && cityMatch;
      });
    }

    return filteredOffers.map(convertToOfferCardProps);
  };

  const filteredOffers = getOffersToShow();
  const hotOffers = mockOffers.filter(offer => offer.isHot);
  const trendingOffers = mockOffers.filter(offer => offer.isTrending);

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedDistrict('');
    setSelectedCity('');
    setShowFiltered(false);
  };

  const handleFindOffers = () => {
    setShowFiltered(true);
  };

  // Reset city when district changes and clear search
  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrict(districtId);
    setSelectedCity('');
    setSearchQuery(''); // Clear search when district is selected
  };

  // Handle city change and clear search
  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId);
    setSearchQuery(''); // Clear search when city is selected
  };

  // Handle search change and clear location filters
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim() !== '') {
      setSelectedDistrict('');
      setSelectedCity('');
      setShowFiltered(false); // Reset show filtered when searching
    }
    if (value.trim() !== '' || selectedDistrict || selectedCity) {
      setShowFiltered(true); // Auto-trigger filtering
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <>
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

            {/* Hot Offers Section */}
            <PaginatedOffersSection
              title="Today's Hot Offers"
              icon={<Flame className="h-6 w-6 text-hot-offer animate-pulse" />}
              offers={hotOffers}
              sectionClass="py-12 bg-background"
            />

            {/* Trending Offers Section */}
            <PaginatedOffersSection
              title="Top Trending Coupons"
              icon={<TrendingUp className="h-6 w-6 text-trending animate-bounce" />}
              offers={trendingOffers}
              sectionClass="py-12 bg-muted/30"
            />

            {/* Local Deals Section */}
            <section className="py-12 bg-background">
              <div className="container mx-auto px-4">
                <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h3 className="text-3xl font-bold text-foreground mb-2">Local Deals</h3>
                    <p className="text-muted-foreground">Discover all available offers from local shops</p>
                  </div>
                  
                  {/* Search Offers - moved to right side */}
                  <div className="lg:w-96">
                    <label className="block text-sm font-medium text-foreground mb-2">Search Offers</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search for shops, offers, or categories..."
                        value={searchQuery}
                         onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-10 bg-card shadow-md border-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* District, City Selection & Search */}
                <div className="mb-8 p-6 bg-card/50 rounded-lg border border-primary/10">
                  <div className="max-w-6xl mx-auto space-y-6">
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-foreground mb-2">Find Local Offers</h4>
                      <p className="text-muted-foreground">Select your location to discover amazing deals nearby</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">District</label>
                        <DistrictSelect 
                          value={selectedDistrict}
                          onValueChange={handleDistrictChange}
                          placeholder="Select district"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">City/Town</label>
                        <CitySelect
                          selectedDistrict={selectedDistrict}
                          value={selectedCity}
                           onValueChange={handleCityChange}
                          placeholder="Select city/town"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Filter by Category</label>
                        <OfferFilters
                          selectedCategory={selectedCategory}
                          onCategoryChange={(category) => {
                            setSelectedCategory(category);
                            setShowFiltered(true); // Auto-trigger filtering on category change
                          }}
                          onClearFilters={handleClearFilters}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        onClick={handleFindOffers}
                        variant="default" 
                        size="lg"
                        className="min-w-[200px]"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Find Offers
                      </Button>
                      
                      {showFiltered && (
                        <Button 
                          onClick={handleClearFilters}
                          variant="outline" 
                          size="lg"
                        >
                          Show All Offers
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredOffers.slice(0, 12).map(offer => (
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

                {filteredOffers.length > 12 && (
                  <div className="text-center mt-8">
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => setActiveSection('local-deals')}
                    >
                      View All Local Deals
                    </Button>
                  </div>
                )}
              </div>
            </section>

            {/* Store Directory Section */}
            <section className="py-12 bg-muted/30">
              <div className="container mx-auto px-4">
                <div className="mb-8 text-center">
                  <h3 className="text-3xl font-bold text-foreground mb-2">Store Directory</h3>
                  <p className="text-muted-foreground">Browse all stores offering amazing deals and coupons</p>
                </div>
                <StoreList offers={mockOffers.slice(0, 9)} showTitle={false} />
                <div className="text-center mt-8">
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setActiveSection('store-list')}
                  >
                    View All Stores
                  </Button>
                </div>
              </div>
            </section>
          </>
        );

      case 'hot-deals':
        return (
          <>
            {/* Hot Offers Section */}
            <PaginatedOffersSection
              title="Today's Hot Offers"
              icon={<Flame className="h-6 w-6 text-hot-offer animate-pulse" />}
              offers={hotOffers}
              sectionClass="py-12 bg-background"
            />

            {/* Trending Offers Section */}
            <PaginatedOffersSection
              title="Top Trending Coupons"
              icon={<TrendingUp className="h-6 w-6 text-trending animate-bounce" />}
              offers={trendingOffers}
              sectionClass="py-12 bg-muted/30"
            />
          </>
        );

      case 'local-deals':
        return (
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-bold text-foreground mb-2">Local Deals</h3>
                  <p className="text-muted-foreground">Discover all available offers from local shops</p>
                </div>
                
                {/* Search Offers - moved to right side */}
                <div className="lg:w-96">
                  <label className="block text-sm font-medium text-foreground mb-2">Search Offers</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search for shops, offers, or categories..."
                      value={searchQuery}
                       onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10 bg-card shadow-md border-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* District, City Selection & Search */}
              <div className="mb-8 p-6 bg-card/50 rounded-lg border border-primary/10">
                <div className="max-w-6xl mx-auto space-y-6">
                  <div className="text-center">
                    <h4 className="text-xl font-bold text-foreground mb-2">Find Local Offers</h4>
                    <p className="text-muted-foreground">Select your location to discover amazing deals nearby</p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">District</label>
                      <DistrictSelect 
                        value={selectedDistrict}
                        onValueChange={handleDistrictChange}
                        placeholder="Select district"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">City/Town</label>
                      <CitySelect
                        selectedDistrict={selectedDistrict}
                        value={selectedCity}
                        onValueChange={handleCityChange}
                        placeholder="Select city/town"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Filter by Category</label>
                      <OfferFilters
                        selectedCategory={selectedCategory}
                        onCategoryChange={(category) => {
                          setSelectedCategory(category);
                          setShowFiltered(true); // Auto-trigger filtering on category change
                        }}
                        onClearFilters={handleClearFilters}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={handleFindOffers}
                      variant="default" 
                      size="lg"
                      className="min-w-[200px]"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Find Offers
                    </Button>
                    
                    {showFiltered && (
                      <Button 
                        onClick={handleClearFilters}
                        variant="outline" 
                        size="lg"
                      >
                        Show All Offers
                      </Button>
                    )}
                  </div>
                </div>
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
        );

      case 'store-list':
        return <StoreList offers={mockOffers} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-sunset-gradient">
      <Header 
        showNavigation={true}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Dynamic Content */}
      {renderContent()}

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
            <button 
              onClick={() => setActiveSection('home')}
              className="flex items-center gap-2 mb-4 md:mb-0 hover:opacity-80 transition-opacity cursor-pointer"
            >
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
            </button>
            
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