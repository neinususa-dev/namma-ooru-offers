import React from 'react';
import { Calendar, MapPin, Store, Flame, TrendingUp } from 'lucide-react';
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
  image
}) => {
  const { user } = useAuth();
  const { saveOffer, redeemOffer } = useOffers();

  const handleGetCoupon = async () => {
    if (!user) {
      // If not logged in, save the offer
      await saveOffer(id);
    } else {
      // If logged in, redeem the offer
      await redeemOffer(id);
    }
  };
  return (
    <Card className="offer-card relative overflow-hidden bg-card border-primary/10 hover:border-primary/30">
      {/* Hot/Trending Badges */}
      {isHot && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="hot-badge bg-hot-offer text-hot-offer-foreground font-bold shadow-lg">
            <Flame className="h-3 w-3 mr-1" />
            HOT
          </Badge>
        </div>
      )}
      
      {isTrending && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="trending-pulse bg-trending text-trending-foreground font-bold shadow-lg">
            <TrendingUp className="h-3 w-3 mr-1" />
            TRENDING
          </Badge>
        </div>
      )}

      {/* Offer Image */}
      {image && (
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
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {location}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Expires: {expiryDate}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button 
          className="w-full" 
          variant={isHot ? "hot-offer" : isTrending ? "trending" : "hero"}
          onClick={handleGetCoupon}
        >
          {user ? "Get Coupon" : "Save Offer"}
        </Button>
      </CardFooter>
    </Card>
  );
};