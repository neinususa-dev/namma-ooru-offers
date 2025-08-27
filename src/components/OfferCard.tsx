import React, { useState } from 'react';
import { Calendar, MapPin, Store, Flame, TrendingUp, Trash2, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useOffers } from '@/hooks/useOffers';

interface OfferCardProps {
  id: string;
  shopName: string;
  offerTitle: string;
  description: string;
  discount: string;
  expiryDate: string;
  location: string;
  category: string;
  isHot?: boolean;
  isTrending?: boolean;
  image?: string;
  displayMode?: 'default' | 'saved' | 'redeemed';
  onRemove?: () => void;
  couponCode?: string;
  redeemedDate?: string;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  id,
  shopName,
  offerTitle,
  description,
  discount,
  expiryDate,
  location,
  category,
  isHot = false,
  isTrending = false,
  image,
  displayMode = 'default',
  onRemove,
  couponCode,
  redeemedDate
}) => {
  const { user } = useAuth();
  const { saveOffer, redeemOffer } = useOffers();
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  const isDescriptionLong = description && description.length > 100;
  const displayDescription = showFullDescription || !isDescriptionLong 
    ? description 
    : description?.substring(0, 100) + '...';

  const handleGetCoupon = async () => {
    // Always save the offer first, regardless of login status
    const offerData = {
      id,
      shopName,
      offerTitle,
      description,
      discount,
      expiryDate,
      location,
      category,
      isHot,
      isTrending,
      image
    };
    await saveOffer(id, offerData);
  };

  const handleRedeemOffer = async () => {
    await redeemOffer(id);
  };
  return (
    <Card className="offer-card relative overflow-hidden bg-card border-primary/10 hover:border-primary/30">
      {/* Hot/Trending Badges */}
      {isHot && displayMode === 'default' && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="hot-badge bg-hot-offer text-hot-offer-foreground font-bold shadow-lg">
            <Flame className="h-3 w-3 mr-1" />
            HOT
          </Badge>
        </div>
      )}
      
      {isTrending && displayMode === 'default' && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="trending-pulse bg-trending text-trending-foreground font-bold shadow-lg">
            <TrendingUp className="h-3 w-3 mr-1" />
            TRENDING
          </Badge>
        </div>
      )}

      {/* Remove button for saved offers */}
      {displayMode === 'saved' && onRemove && (
        <div className="absolute top-3 right-3 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0 bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Redeemed badge */}
      {displayMode === 'redeemed' && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-trending text-trending-foreground font-bold shadow-lg">
            <Gift className="h-3 w-3 mr-1" />
            REDEEMED
          </Badge>
        </div>
      )}

      {/* Offer Image */}
      {image && displayMode === 'default' && (
        <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
          <img 
            src={image} 
            alt={offerTitle}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs font-medium bg-primary/5 text-primary border-primary/20">
            {category}
          </Badge>
          <div className="text-2xl font-bold text-primary bg-primary-gradient bg-clip-text text-transparent">
            {discount}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Store className="h-4 w-4" />
            {shopName}
          </div>
          <h3 className="font-semibold text-lg text-foreground leading-tight">
            {offerTitle}
          </h3>
        </div>
      </CardHeader>

      <CardContent className="py-3">
        <div className="mb-3">
          <p className="text-sm text-muted-foreground">
            {displayDescription}
          </p>
          {isDescriptionLong && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-xs text-primary hover:text-primary/80 mt-1 font-medium"
            >
              {showFullDescription ? 'Read less' : 'Read more'}
            </button>
          )}
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {/* Extract city name from location string */}
            {(() => {
              if (!location) return 'Location not specified';
              
              // Handle different formats: "City - PostalCode - City" or "City, State" or just "City"
              if (location.includes(' - ')) {
                // For format like "Sathyamangalam - 638503 - Sathyamangalam"
                const parts = location.split(' - ');
                return parts[0]; // Return first part (city name)
              } else if (location.includes(',')) {
                // For format like "City, State"
                return location.split(',').pop()?.trim();
              } else {
                // Just return the location as is
                return location;
              }
            })()}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {displayMode === 'redeemed' && redeemedDate ? `Redeemed: ${redeemedDate}` : `Expires: ${expiryDate}`}
          </div>
        </div>

        {/* Coupon Code Display */}
        {(displayMode === 'saved' || displayMode === 'redeemed') && couponCode && (
          <div className="p-3 bg-muted/50 rounded-lg text-center mb-3">
            <p className="text-xs text-muted-foreground mb-1">Coupon Code</p>
            <p className="font-mono font-bold text-sm">
              {couponCode}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3">
        {displayMode === 'default' && (
          <Button 
            className="w-full" 
            variant={isHot ? "hot-offer" : isTrending ? "trending" : "hero"}
            onClick={handleGetCoupon}
          >
            Get Coupon
          </Button>
        )}
        
        {displayMode === 'saved' && (
          <Button 
            className="w-full" 
            variant="hero"
            onClick={handleRedeemOffer}
          >
            Redeem Now
          </Button>
        )}
        
        {displayMode === 'redeemed' && (
          <div className="w-full text-center">
            <p className="text-sm text-muted-foreground">
              This coupon has been redeemed
            </p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};