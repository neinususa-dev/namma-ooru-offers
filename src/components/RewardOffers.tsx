import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Coins, Clock, Users, Loader2 } from 'lucide-react';
import { RewardOffer, UserReward } from '@/hooks/useRewards';
import { toast } from 'sonner';

interface RewardOffersProps {
  offers: RewardOffer[];
  userReward: UserReward | null;
  onRedeem: (offerId: string, pointsRequired: number) => Promise<boolean>;
}

export const RewardOffers: React.FC<RewardOffersProps> = ({
  offers,
  userReward,
  onRedeem
}) => {
  const [redeemingOffers, setRedeemingOffers] = useState<Set<string>>(new Set());
  
  const handleRedeem = async (offer: RewardOffer) => {
    if (!userReward) {
      toast.error('Please log in to redeem offers');
      return;
    }

    if (userReward.current_points < offer.points_required) {
      toast.error(`You need ${offer.points_required - userReward.current_points} more points to redeem this offer`);
      return;
    }

    if (offer.max_redemptions && offer.current_redemptions >= offer.max_redemptions) {
      toast.error('This offer has reached its redemption limit');
      return;
    }

    // Prevent multiple clicks
    if (redeemingOffers.has(offer.id)) {
      return;
    }

    // Add offer to redeeming set
    setRedeemingOffers(prev => new Set(prev).add(offer.id));

    try {
      const success = await onRedeem(offer.id, offer.points_required);
      if (success) {
        toast.success(`🎉 Successfully redeemed: ${offer.title}`);
      } else {
        toast.error('Failed to redeem offer. Please try again.');
      }
    } catch (error) {
      console.error('Error redeeming offer:', error);
      toast.error('An error occurred while redeeming the offer.');
    } finally {
      // Remove offer from redeeming set
      setRedeemingOffers(prev => {
        const newSet = new Set(prev);
        newSet.delete(offer.id);
        return newSet;
      });
    }
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const canRedeem = (offer: RewardOffer) => {
    if (!userReward) return false;
    if (userReward.current_points < offer.points_required) return false;
    if (offer.max_redemptions && offer.current_redemptions >= offer.max_redemptions) return false;
    if (isExpired(offer.expiry_date)) return false;
    return true;
  };

  if (offers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Gift className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No reward offers available</p>
          <p className="text-sm text-muted-foreground">Check back later for exciting rewards!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {offers.map((offer) => (
        <Card key={offer.id} className="relative overflow-hidden">
          {isExpired(offer.expiry_date) && (
            <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
              <Badge variant="secondary" className="text-white bg-red-600">
                Expired
              </Badge>
            </div>
          )}
          
          <CardHeader>
            {offer.image_url ? (
              <img 
                src={offer.image_url} 
                alt={offer.title}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mb-4">
                <Gift className="w-12 h-12 text-primary" />
              </div>
            )}
            <CardTitle className="text-lg">{offer.title}</CardTitle>
            <CardDescription className="text-sm">
              {offer.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-yellow-600" />
                <span className="font-bold text-primary">
                  {offer.points_required} points
                </span>
              </div>
              
              {userReward && (
                <Badge 
                  variant={canRedeem(offer) ? "default" : "secondary"}
                  className="text-xs"
                >
                  {userReward.current_points >= offer.points_required ? "Available" : "Insufficient Points"}
                </Badge>
              )}
            </div>

            {offer.max_redemptions && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>
                  {offer.current_redemptions}/{offer.max_redemptions} redeemed
                </span>
              </div>
            )}

            {offer.expiry_date && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>
                  Expires: {new Date(offer.expiry_date).toLocaleDateString()}
                </span>
              </div>
            )}

            <Button
              onClick={() => handleRedeem(offer)}
              disabled={!canRedeem(offer) || isExpired(offer.expiry_date) || redeemingOffers.has(offer.id)}
              className="w-full"
              variant={canRedeem(offer) ? "default" : "outline"}
            >
              {redeemingOffers.has(offer.id) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Redeeming...
                </>
              ) : !userReward ? (
                "Login to Redeem"
              ) : userReward.current_points < offer.points_required ? (
                `Need ${offer.points_required - userReward.current_points} more points`
              ) : isExpired(offer.expiry_date) ? (
                "Expired"
              ) : offer.max_redemptions && offer.current_redemptions >= offer.max_redemptions ? (
                "Sold Out"
              ) : (
                <>
                  <Gift className="w-4 h-4 mr-2" />
                  Redeem Now
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};