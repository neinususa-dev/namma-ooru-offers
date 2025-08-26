import React from 'react';
import { Clock, Gift, Heart, Trash2, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OfferCard } from '@/components/OfferCard';
import { useOffers } from '@/hooks/useOffers';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

export default function YourOffers() {
  const { user, loading: authLoading } = useAuth();
  const { savedOffers, redeemedOffers, loading, removeSavedOffer, redeemOffer } = useOffers();

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Gift className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="text-muted-foreground mb-6">
              Please login to view your saved and redeemed offers.
            </p>
            <Button asChild className="bg-primary-gradient">
              <Link to="/auth">Login Now</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
        <Header showNavigation={false} />

        {/* Page Header */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-primary-gradient bg-clip-text text-transparent">
                Your Offers
              </h1>
              <p className="text-muted-foreground">
                Manage your saved and redeemed offers
              </p>
            </div>
          </div>

        {/* Tabs */}
        <Tabs defaultValue="saved" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Saved Offers ({savedOffers.length})
            </TabsTrigger>
            <TabsTrigger value="redeemed" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Redeemed Offers ({redeemedOffers.length})
            </TabsTrigger>
          </TabsList>

          {/* Saved Offers Tab */}
          <TabsContent value="saved">
            {savedOffers.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No saved offers</h3>
                  <p className="text-muted-foreground mb-6">
                    Start saving offers you're interested in to view them here.
                  </p>
                  <Button asChild>
                    <Link to="/">Browse Offers</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {savedOffers.map((savedOffer) => (
                  <OfferCard
                    key={savedOffer.id}
                    id={savedOffer.offer_id}
                    shopName={savedOffer.offers?.title?.includes('Designer Saree') ? 'Pothys' : 
                             savedOffer.offers?.title?.includes('Idli') ? 'Murugan Idli Shop' :
                             savedOffer.offers?.title?.includes('Family Feast') ? 'Annapoorna Restaurant' :
                             savedOffer.offers?.title?.includes('Biryani') ? 'Hotel Buhari' :
                             savedOffer.offers?.title?.includes('Thali') ? 'A2B Restaurant' :
                             savedOffer.offers?.title?.includes('Sweet Box') ? 'Adyar Ananda Bhavan' :
                             savedOffer.offers?.title?.includes('Traditional Wear') ? 'Saravana Stores' :
                             'Local Shop'}
                    offerTitle={savedOffer.offers?.title || 'Special Offer'}
                    description={savedOffer.offers?.description || 'Great discount available!'}
                    discount={`${savedOffer.offers?.discount_percentage || 20}% OFF`}
                    expiryDate={savedOffer.offers?.expiry_date ? new Date(savedOffer.offers.expiry_date).toLocaleDateString() : 'Dec 31, 2024'}
                    location={savedOffer.offers?.location || 'Local Area'}
                    category={savedOffer.offers?.category || 'general'}
                    displayMode="saved"
                    onRemove={() => removeSavedOffer(savedOffer.id)}
                    couponCode={savedOffer.id.substring(0, 8).toUpperCase()}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Redeemed Offers Tab */}
          <TabsContent value="redeemed">
            {redeemedOffers.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Gift className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No redeemed offers</h3>
                  <p className="text-muted-foreground mb-6">
                    Start redeeming offers to build your coupon collection here.
                  </p>
                  <Button asChild>
                    <Link to="/">Find Offers</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {redeemedOffers.map((redemption) => (
                  <OfferCard
                    key={redemption.id}
                    id={redemption.offer_id}
                    shopName={redemption.offers?.title?.includes('Designer Saree') ? 'Pothys' : 
                             redemption.offers?.title?.includes('Idli') ? 'Murugan Idli Shop' :
                             redemption.offers?.title?.includes('Family Feast') ? 'Annapoorna Restaurant' :
                             redemption.offers?.title?.includes('Biryani') ? 'Hotel Buhari' :
                             redemption.offers?.title?.includes('Thali') ? 'A2B Restaurant' :
                             redemption.offers?.title?.includes('Sweet Box') ? 'Adyar Ananda Bhavan' :
                             redemption.offers?.title?.includes('Traditional Wear') ? 'Saravana Stores' :
                             'Local Shop'}
                    offerTitle={redemption.offers?.title || 'Redeemed Offer'}
                    description={redemption.offers?.description || 'This offer has been redeemed!'}
                    discount={`${redemption.offers?.discount_percentage || 20}% OFF`}
                    expiryDate={redemption.offers?.expiry_date ? new Date(redemption.offers.expiry_date).toLocaleDateString() : 'Dec 31, 2024'}
                    location={redemption.offers?.location || 'Local Area'}
                    category={redemption.offers?.category || 'general'}
                    displayMode="redeemed"
                    couponCode={redemption.id.substring(0, 8).toUpperCase()}
                    redeemedDate={new Date(redemption.redeemed_at).toLocaleDateString()}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          </Tabs>
        </div>
    </div>
  );
}