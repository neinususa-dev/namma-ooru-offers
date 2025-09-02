import React, { useState, useEffect } from 'react';
import { Search, MapPin, Users, TrendingUp, Store, Flame, Heart, ShoppingBag, X, Filter, Gift, Plus, BarChart3 } from 'lucide-react';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DistrictSelect } from '@/components/DistrictSelect';
import { CitySelect } from '@/components/CitySelect';
import { OfferCard } from '@/components/OfferCard';
import { OfferFilters } from '@/components/OfferFilters';
import { PaginatedOffersSection } from '@/components/PaginatedOffersSection';
import { StoresList } from '@/components/StoresList';
import { Header } from '@/components/Header';
import { MerchantHomePage } from '@/components/MerchantHomePage';
import { useAuth } from '@/hooks/useAuth';
import { useOfferDatabase } from '@/hooks/useOfferDatabase';
import { useStats } from '@/hooks/useStats';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { generateDefaultImage } from '@/utils/imageUtils';
import heroImage from '@/assets/hero-marketplace.jpg';
import shopOffersImage from '@/assets/shop-offers.jpg';
import foodOfferImage from '@/assets/food-offer.jpg';
import fashionOfferImage from '@/assets/fashion-offer.jpg';
import electronicsOfferImage from '@/assets/electronics-offer.jpg';
import homeOfferImage from '@/assets/home-offer.jpg';
import groceryOfferImage from '@/assets/grocery-offer.jpg';
import { 
  generateWebsiteStructuredData, 
  generateOrganizationStructuredData,
  generateLocationStructuredData,
  generateBreadcrumbStructuredData
} from '@/utils/seoUtils';


const Index = () => {
  const { user, isMerchant, profile } = useAuth();
  const { offers, loading, getOffersByType, getOffersByCategory, searchOffers } = useOfferDatabase();
  const { stats, loading: statsLoading } = useStats();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFiltered, setShowFiltered] = useState<boolean>(false);

  // Handle URL parameters to set active section
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

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
      district: dbOffer.district || '',
      city: dbOffer.city || '',
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
  
  // Get hot offers, fallback to first 6 offers if no specific hot offers exist
  const hotOffersFromDb = getOffersByType('hot_offers');
  const hotOffers = hotOffersFromDb.length > 0 
    ? hotOffersFromDb.map(convertToOfferCardProps)
    : offers.slice(0, 6).map(convertToOfferCardProps);
  
  // Get trending offers, fallback to next 6 offers if no specific trending offers exist
  const trendingOffersFromDb = getOffersByType('trending');
  const trendingOffers = trendingOffersFromDb.length > 0 
    ? trendingOffersFromDb.map(convertToOfferCardProps)
    : offers.slice(6, 12).map(convertToOfferCardProps);

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

  // Handle post offers click - check authentication status
  const handlePostOffers = () => {
    if (user && isMerchant) {
      // User is authenticated and is a merchant - go to post offer page
      navigate('/merchant-post-offer');
    } else {
      // User is not authenticated or not a merchant - go to sign up page
      navigate('/signup');
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <>
            {/* Welcome Section for Logged In Users */}
            {user && profile && (
              <section className="relative py-8 overflow-hidden">
                <div className="absolute inset-0 bg-primary-gradient"></div>
                <div className="container mx-auto px-4 relative z-10">
                  <div className="text-center text-primary-foreground">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                      Welcome back, {profile.name}! 👋
                    </h1>
                    <p className="text-lg text-primary-foreground/80 mb-4">
                      {isMerchant 
                        ? `Since you are a ${profile.current_plan || 'Silver'} member, explore your dashboard to manage offers and grow your business.`
                        : "Discover amazing deals and offers from your favorite local shops. Save money while supporting local businesses!"
                      }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                      {isMerchant ? (
                        <>
                          <Link to="/merchant-dashboard">
                            <Button variant="secondary" size="lg" className="flex items-center gap-2">
                              <BarChart3 className="h-5 w-5" />
                              View Dashboard
                            </Button>
                          </Link>
                          <Link to="/merchant-post-offer">
                            <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                              <Plus className="h-5 w-5 mr-2" />
                              Post New Offer
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link to="/rewards">
                            <Button variant="secondary" size="lg" className="flex items-center gap-2">
                              <Gift className="h-5 w-5" />
                              Your Rewards
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="lg" 
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            onClick={() => setActiveSection('local-deals')}
                          >
                            <ShoppingBag className="h-5 w-5 mr-2" />
                            Browse Offers
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Hero Section */}
            <section className="relative py-16 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
              <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {/* Made with Love for Tamil Nadu */}
                      <div className="text-center mb-4">
                        <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-primary/30 rounded-full animate-pulse">
                          <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 fill-current animate-pulse" />
                          <span className="text-xs sm:text-sm font-medium bg-blue-orange-gradient bg-clip-text text-transparent">
                            Made with love for local merchants in Tamil Nadu
                          </span>
                          <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 fill-current animate-pulse" />
                        </div>
                      </div>
                      
                      <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
                        <span className="bg-blue-orange-gradient bg-clip-text text-transparent">
                          Namma&nbsp;Ooru Offers
                        </span>
                      </h2>
                      <p className="text-xl text-muted-foreground">
                        Discover amazing deals and offers from your favorite local shops across Tamil Nadu. 
                        Save money while supporting local businesses!
                      </p>
                    </div>

                     <div className="grid sm:grid-cols-3 gap-4">
                        <div className="bg-card p-3 rounded-lg shadow-md border border-primary/10">
                         <div className="flex items-center gap-3">
                           <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                             <Store className="h-6 w-6 text-primary" />
                           </div>
                           <div>
                             <div className="text-2xl font-bold text-primary">
                               {statsLoading ? '...' : `${stats.totalStores}+`}
                             </div>
                             <div className="text-sm text-muted-foreground">Local Shops</div>
                           </div>
                         </div>
                       </div>
                       
                        <div className="bg-card p-3 rounded-lg shadow-md border border-primary/10">
                         <div className="flex items-center gap-3">
                           <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                             <Heart className="h-6 w-6 text-secondary" />
                           </div>
                           <div>
                             <div className="text-2xl font-bold text-secondary">
                               {statsLoading ? '...' : `${stats.totalCustomers}+`}
                             </div>
                             <div className="text-sm text-muted-foreground">Happy Customers</div>
                           </div>
                         </div>
                       </div>
                       
                       <div className="bg-card p-3 rounded-lg shadow-md border border-primary/10">
                         <div className="flex items-center gap-3">
                           <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                             <Users className="h-6 w-6 text-accent" />
                           </div>
                           <div>
                             <div className="text-2xl font-bold text-accent">
                               {statsLoading ? '...' : `${stats.totalMerchants}+`}
                             </div>
                             <div className="text-sm text-muted-foreground">Happy Merchants</div>
                           </div>
                         </div>
                       </div>
                     </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                      <Link to="/signup?tab=customer">
                        <Button size="xl" className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Join as Customer
                        </Button>
                      </Link>
                      <Link to="/signup?tab=merchant">
                        <Button variant="secondary" size="xl" className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Become a Merchant
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center gap-2 text-lg font-semibold text-primary">
                        <MapPin className="h-5 w-5" />
                        <span>Proudly local. Proudly smart.</span>
                      </div>
                      <p className="text-xl font-bold">
                        <span className="bg-blue-orange-gradient bg-clip-text text-transparent">
                          Welcome to Namma Ooru Offers – where every deal feels personal!
                        </span>
                      </p>
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
            {loading ? (
              <section className="py-12 bg-background">
                <div className="container mx-auto px-4">
                  <div className="mb-8 flex items-center gap-3">
                    <Flame className="h-6 w-6 text-hot-offer animate-pulse" />
                    <h3 className="text-3xl font-bold text-foreground">Today's Hot Offers</h3>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="bg-card p-4 rounded-lg border animate-pulse">
                        <div className="h-40 bg-muted rounded mb-4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-4 bg-muted rounded w-1/2"></div>
                          <div className="h-8 bg-muted rounded mt-4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : (
              <PaginatedOffersSection
                title="Today's Hot Offers"
                icon={<Flame className="h-6 w-6 text-hot-offer animate-pulse" />}
                offers={hotOffers}
                sectionClass="py-12 bg-background"
              />
            )}

            {/* Trending Offers Section */}
            {loading ? (
              <section className="py-12 bg-muted/30">
                <div className="container mx-auto px-4">
                  <div className="mb-8 flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-trending animate-bounce" />
                    <h3 className="text-3xl font-bold text-foreground">Top Trending Coupons</h3>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="bg-card p-4 rounded-lg border animate-pulse">
                        <div className="h-40 bg-muted rounded mb-4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-4 bg-muted rounded w-1/2"></div>
                          <div className="h-8 bg-muted rounded mt-4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : (
              <PaginatedOffersSection
                title="Top Trending Coupons"
                icon={<TrendingUp className="h-6 w-6 text-trending animate-bounce" />}
                offers={trendingOffers}
                sectionClass="py-12 bg-muted/30"
              />
            )}

            {/* Local Deals Section */}
            <section id="local-deals-section" className="py-12 bg-background">
              <div className="container mx-auto px-4">
                 <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                   <div>
                     <div className="flex items-center gap-3 mb-2">
                       <MapPin className="h-6 w-6 text-primary" />
                       <h3 className="text-3xl font-bold text-foreground">Local Deals</h3>
                     </div>
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
                    <OfferCard key={offer.id} {...offer} disableMerchantActions={isMerchant} />
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
                <StoresList maxItems={9} showViewAll={false} />
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
                  <OfferCard key={offer.id} {...offer} disableMerchantActions={isMerchant} />
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
        return (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-primary mb-4">Store Directory</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Discover local businesses and browse their latest offers. Connect directly with merchants across Tamil Nadu.
                </p>
              </div>
              <StoresList />
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  // Generate SEO structured data
  const websiteStructuredData = generateWebsiteStructuredData();
  const organizationStructuredData = generateOrganizationStructuredData();
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: 'https://namma-ooru-offers.com/' }
  ]);

  const combinedStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      websiteStructuredData,
      organizationStructuredData,
      breadcrumbStructuredData
    ]
  };

  // Show merchant home page if user is a merchant
  if (user && isMerchant) {
    return <MerchantHomePage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Namma OOru Offers - Your Local Savings Hub | Tamil Nadu"
        description="Discover amazing deals and offers from local shops across Tamil Nadu. Save money while supporting local businesses with Namma OOru Offers."
        keywords="Tamil Nadu offers, local deals, coupons Chennai, discounts Coimbatore, Madurai offers, Salem deals, local shops Tamil Nadu, South India coupons, merchant offers, customer savings, Erode deals, Tirupur offers"
        structuredData={combinedStructuredData}
        url="https://namma-ooru-offers.com/"
        canonical="https://namma-ooru-offers.com/"
      />
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
              Join thousands of merchants who are growing their sales with Namma Ooru Offers. 
              Post your offers and reach more customers today!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button 
                variant="secondary" 
                size="xl" 
                className="bg-white text-secondary hover:bg-white/90"
                onClick={handlePostOffers}
              >
                <Store className="h-5 w-5 mr-2" />
                Post Your Offers
              </Button>
              <Button variant="outline" size="xl" className="border-white text-primary hover:bg-white/10" onClick={() => navigate('/about')}>
                Learn More
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto pt-8">
              <div className="text-center">
                <div className="text-xl font-bold">Silver</div>
                <div className="text-2xl font-bold">FREE</div>
                <div className="text-sm opacity-75">2 offer/mo</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">Gold</div>
                <div className="text-2xl font-bold">₹500/mo</div>
                <div className="text-sm opacity-75">10 offer/mo</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">Platinum</div>
                <div className="text-2xl font-bold">₹1500/mo</div>
                <div className="text-sm opacity-75">30 Offer/mo</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;