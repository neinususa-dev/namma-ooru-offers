import React, { useEffect, useState } from 'react';
import { Crown, Star, Zap, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OfferCard } from '@/components/OfferCard';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { useOfferDatabase } from '@/hooks/useOfferDatabase';
import { Link } from 'react-router-dom';

const pricingTiers = [
  {
    name: 'Silver',
    price: '₹0',
    period: '/mo',
    maxOffers: 2,
    features: [
      'Up to 2 offers per month',
      'Basic offer listing',
      'Standard support'
    ],
    icon: Star,
    variant: 'outline' as const,
    popular: false
  },
  {
    name: 'Gold',
    price: '₹500',
    period: '/mo',
    maxOffers: 10,
    features: [
      'Up to 10 offers per month',
      'Priority listing',
      'Analytics dashboard',
      'Email support'
    ],
    icon: Crown,
    variant: 'secondary' as const,
    popular: true
  },
  {
    name: 'Platinum',
    price: '₹1500',
    period: '/mo',
    maxOffers: 30,
    features: [
      'Up to 30 offers per month',
      'Premium placement',
      'Advanced analytics',
      'Priority support',
      'Custom branding'
    ],
    icon: Zap,
    variant: 'default' as const,
    popular: false
  }
];

export const MerchantHomePage: React.FC = () => {
  const { user, profile } = useAuth();
  const { offers, loading } = useOfferDatabase();
  const [merchantOffers, setMerchantOffers] = useState<any[]>([]);

  useEffect(() => {
    if (offers && user) {
      // Filter offers to show only merchant's own offers
      const userOffers = offers.filter(offer => offer.merchant_id === user.id);
      setMerchantOffers(userOffers);
    }
  }, [offers, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading your offers...</div>
        </div>
      </div>
    );
  }

  const currentTier = profile?.is_premium ? 'Gold' : 'Silver'; // Simplified tier detection
  const currentMonthOffers = merchantOffers.length; // Simplified count for current month

  return (
    <div className="min-h-screen bg-background">
      <Header showNavigation={false} />
      {/* Hero Section */}
      <section className="bg-primary-gradient text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome back, {profile?.name || 'Merchant'}!
            </h1>
            <p className="text-xl mb-6 text-primary-foreground/80">
              Manage your offers and grow your business
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Current Plan: {currentTier}
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2 bg-white/10 text-white border-white/20">
                Offers this month: {currentMonthOffers}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/merchant-post-offer">
              <Button size="lg" variant="hero" className="w-full md:w-auto">
                Post New Offer
              </Button>
            </Link>
            <Link to="/merchant-dashboard">
              <Button size="lg" variant="secondary" className="w-full md:w-auto">
                View Dashboard
              </Button>
            </Link>
            <Link to="/merchant-edit-offers">
              <Button size="lg" variant="outline" className="w-full md:w-auto">
                Manage Offers
              </Button>
            </Link>
          </div>
        </div>

        {/* Pricing Tiers */}
        <section className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upgrade your plan to post more offers and reach more customers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => {
              const IconComponent = tier.icon;
              const isCurrentTier = tier.name === currentTier;
              
              return (
                <Card 
                  key={tier.name} 
                  className={`relative overflow-hidden ${
                    tier.popular ? 'border-primary shadow-xl scale-105' : 'border-border'
                  } ${isCurrentTier ? 'bg-primary/5 border-primary' : ''}`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  
                  {isCurrentTier && (
                    <div className="absolute top-0 left-0 bg-trending text-trending-foreground px-3 py-1 text-sm font-semibold">
                      Current Plan
                    </div>
                  )}

                  <CardHeader className="text-center pb-6">
                    <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-primary">{tier.price}</span>
                      <span className="text-muted-foreground">{tier.period}</span>
                    </div>
                    <CardDescription className="text-lg">
                      Up to {tier.maxOffers} offers per month
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={isCurrentTier ? "outline" : tier.variant}
                      disabled={isCurrentTier}
                    >
                      {isCurrentTier ? 'Current Plan' : `Upgrade to ${tier.name}`}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Your Recent Offers */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground">Your Recent Offers</h2>
            <Link to="/merchant-edit-offers">
              <Button variant="ghost">View All</Button>
            </Link>
          </div>
          
          {merchantOffers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {merchantOffers.slice(0, 8).map(offer => (
                <OfferCard 
                  key={offer.id} 
                  id={offer.id}
                  shopName={offer.merchant_name || 'Unknown Merchant'}
                  offerTitle={offer.title}
                  description={offer.description}
                  discount={offer.discount_percentage ? `${offer.discount_percentage}% OFF` : 'Special Offer'}
                  originalPrice={offer.original_price ? Number(offer.original_price) : undefined}
                  discountedPrice={offer.discounted_price ? Number(offer.discounted_price) : undefined}
                  expiryDate={offer.expiry_date ? new Date(offer.expiry_date).toLocaleDateString() : 'No expiry'}
                  location={offer.city || offer.district || 'Location not specified'}
                  category={offer.category || 'general'}
                  isHot={offer.listing_type === 'hot_offers'}
                  isTrending={offer.listing_type === 'trending'}
                  image={offer.image_url}
                  disableMerchantActions={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground mb-4">You haven't posted any offers yet.</p>
              <Link to="/merchant-post-offer">
                <Button variant="hero">Post Your First Offer</Button>
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};