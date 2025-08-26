import React from 'react';
import { Clock, Gift, Heart, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
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
                  <Card key={savedOffer.id} className="offer-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Badge variant="outline" className="text-xs">
                          {savedOffer.offers?.category || 'General'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSavedOffer(savedOffer.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardTitle className="text-lg">
                        {savedOffer.offers?.title || 'Offer Title'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {savedOffer.offers?.description || 'No description available'}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <span>{savedOffer.offers?.location || 'Location'}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Saved: {formatDate(savedOffer.saved_at)}
                        </div>
                      </div>
                      <Button 
                        className="w-full" 
                        size="sm"
                        onClick={() => redeemOffer(savedOffer.offer_id)}
                      >
                        Redeem Offer
                      </Button>
                    </CardContent>
                  </Card>
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
                  <Card key={redemption.id} className="offer-card border-trending/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Badge className="bg-trending text-trending-foreground">
                          <Gift className="h-3 w-3 mr-1" />
                          Redeemed
                        </Badge>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {redemption.offers?.discount_percentage}% OFF
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-lg">
                        {redemption.offers?.title || 'Redeemed Offer'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {redemption.offers?.description || 'No description available'}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <span>{redemption.offers?.location || 'Location'}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Redeemed: {formatDate(redemption.redeemed_at)}
                        </div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground mb-1">Coupon Code</p>
                        <p className="font-mono font-bold text-sm">
                          {redemption.id.substring(0, 8).toUpperCase()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}