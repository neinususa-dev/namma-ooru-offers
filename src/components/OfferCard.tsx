import React, { useState, useMemo } from 'react';
import { Calendar, MapPin, Store, Flame, TrendingUp, Trash2, Gift, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useOffers } from '@/hooks/useOffers';
import { generateDefaultImage } from '@/utils/imageUtils';

interface OfferCardProps {
  id: string;
  shopName: string;
  offerTitle: string;
  description: string;
  discount: string;
  originalPrice?: number;
  discountedPrice?: number;
  expiryDate: string;
  location: string;
  category: string;
  isHot?: boolean;
  isTrending?: boolean;
  image?: string;
  displayMode?: 'default' | 'saved' | 'redeemed' | 'pending' | 'rejected';
  onRemove?: () => void;
  couponCode?: string;
  redeemedDate?: string;
  redemptionStatus?: 'pending' | 'approved' | 'rejected';
  disableMerchantActions?: boolean;
  isSaved?: boolean;
  isRedeemed?: boolean;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  id,
  shopName,
  offerTitle,
  description,
  discount,
  originalPrice,
  discountedPrice,
  expiryDate,
  location,
  category,
  isHot = false,
  isTrending = false,
  image,
  displayMode = 'default',
  onRemove,
  couponCode,
  redeemedDate,
  redemptionStatus,
  disableMerchantActions = false,
  isSaved = false,
  isRedeemed = false
}) => {
  const { user } = useAuth();
  const { saveOffer, redeemOffer } = useOffers();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Generate default image with merchant name
  const defaultImageWithMerchantName = useMemo(() => 
    generateDefaultImage(shopName || 'Local Merchant'), 
    [shopName]
  );
  
  const isDescriptionLong = description && description.length > 100;
  const displayDescription = showFullDescription || !isDescriptionLong 
    ? description 
    : description?.substring(0, 100) + '...';

  const handleGetCoupon = async () => {
    // Don't allow merchants to save offers or if already loading
    if (disableMerchantActions || isLoading) return;
    
    setIsLoading(true);
    try {
      // Always save the offer first, regardless of login status
      const offerData = {
        id,
        shopName,
        offerTitle,
        description,
        discount,
        originalPrice,
        discountedPrice,
        expiryDate,
        location,
        category,
        isHot,
        isTrending,
        image
      };
      await saveOffer(id, offerData);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error saving offer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeemOffer = async () => {
    await redeemOffer(id);
  };
  return (
    <Card className="offer-card relative overflow-hidden bg-card border-primary/10 hover:border-primary/30 flex flex-col h-full">
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

      {/* Pending/Rejected badge */}
      {displayMode === 'pending' && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-yellow-500 text-yellow-50 font-bold shadow-lg">
            <Clock className="h-3 w-3 mr-1" />
            PENDING
          </Badge>
        </div>
      )}

      {displayMode === 'rejected' && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-red-500 text-red-50 font-bold shadow-lg">
            REJECTED
          </Badge>
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

      {/* Offer Image - Show for all display modes */}
      <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
        <img 
          src={image || defaultImageWithMerchantName} 
          alt={`${offerTitle} - ${shopName}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = defaultImageWithMerchantName;
          }}
        />
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
  <Badge variant="outline" className="text-xs font-medium bg-primary/5 text-primary border-primary/20">
    {category}
  </Badge>
  <div className="flex flex-col items-end">
    <div className="text-2xl font-bold text-primary bg-primary-gradient bg-clip-text text-transparent">
      {discount}
    </div>
    {originalPrice && discountedPrice && (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground line-through">
          ₹{originalPrice.toLocaleString()}
        </span>
        <span className="text-lg font-semibold text-foreground">
          ₹{discountedPrice.toLocaleString()}
        </span>
      </div>
    )}
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

      <CardContent className="py-3 flex-1 flex flex-col justify-between">
        <div className="mb-3 min-h-[60px]">
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
            {location || 'Location not specified'}
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
            disabled={disableMerchantActions || isSaved || isRedeemed || isLoading}
          >
            {disableMerchantActions ? "View Only" : 
             isRedeemed ? "Redeemed" :
             isSaved ? "Offer Saved" : 
             isLoading ? "Saving..." :
             "Get Coupon"}
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
        
        {displayMode === 'pending' && (
          <div className="w-full text-center">
            <p className="text-sm text-yellow-600">
              Awaiting merchant approval
            </p>
          </div>
        )}
        
        {displayMode === 'rejected' && (
          <div className="w-full text-center">
            <p className="text-sm text-red-600">
              Redemption request was rejected
            </p>
          </div>
        )}
        
        {displayMode === 'redeemed' && (
          <div className="w-full text-center">
            <p className="text-sm text-muted-foreground">
              This coupon has been redeemed
            </p>
          </div>
        )}
      </CardFooter>
      
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
              Offer Saved Successfully!
            </DialogTitle>
            <DialogDescription>
              Great! You've saved "{offerTitle}" from {shopName}. You can find it in your "Your Offers" section to redeem later.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowSuccessModal(false)}>
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};