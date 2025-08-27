import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Globe, ExternalLink, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useStores } from '@/hooks/useStores';
import { useOfferDatabase } from '@/hooks/useOfferDatabase';
import { Skeleton } from '@/components/ui/skeleton';
import { OfferCard } from '@/components/OfferCard';
import type { Store } from '@/hooks/useStores';

interface StoresListProps {
  maxItems?: number;
  showViewAll?: boolean;
  onStoreClick?: (storeId: string) => void;
}

export const StoresList: React.FC<StoresListProps> = ({
  maxItems,
  showViewAll = false,
  onStoreClick
}) => {
  const { stores, loading, error } = useStores();
  const { offers, loading: offersLoading } = useOfferDatabase();
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  // Function to count offers per store
  const getOfferCount = (storeName: string) => {
    return offers.filter(offer => 
      offer.merchant_name === storeName
    ).length;
  };

  // Function to get offers for a specific store
  const getStoreOffers = (storeName: string) => {
    return offers.filter(offer => offer.merchant_name === storeName);
  };

  // Convert DatabaseOffer to OfferCard props
  const convertToOfferCard = (offer: any) => ({
    id: offer.id,
    shopName: offer.merchant_name,
    offerTitle: offer.title,
    description: offer.description || '',
    discount: offer.discount_percentage ? `${offer.discount_percentage}% OFF` : 'Special Offer',
    originalPrice: offer.original_price,
    discountedPrice: offer.discounted_price,
    expiryDate: new Date(offer.expiry_date).toLocaleDateString(),
    location: offer.location || '',
    category: offer.category || '',
    isHot: offer.listing_type === 'hot_offers',
    isTrending: offer.listing_type === 'trending',
    image: offer.image_url
  });

  // Handle store selection
  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
    onStoreClick?.(store.id);
  };

  // Handle back to stores
  const handleBackToStores = () => {
    setSelectedStore(null);
  };

  if (loading || offersLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: maxItems || 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load stores. Please try again.</p>
      </div>
    );
  }

  const displayStores = maxItems ? stores.slice(0, maxItems) : stores;

  if (stores.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No stores available at the moment.</p>
      </div>
    );
  }

  // If a store is selected, show its offers
  if (selectedStore) {
    const storeOffers = getStoreOffers(selectedStore.name);
    return (
      <div className="space-y-6">
        {/* Header with back button and store info */}
        <div className="flex items-start gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToStores}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Stores
          </Button>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-primary">{selectedStore.name}</h2>
            {selectedStore.description && (
              <p className="text-muted-foreground mt-1">{selectedStore.description}</p>
            )}
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              {selectedStore.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedStore.location}</span>
                </div>
              )}
              <Badge variant="secondary" className="animate-pulse">
                {storeOffers.length} offers available
              </Badge>
            </div>
          </div>
        </div>

        {/* Store offers grid */}
        {storeOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {storeOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                {...convertToOfferCard(offer)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No offers available from this store at the moment.</p>
          </div>
        )}
      </div>
    );
  }

  // Default stores list view
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayStores.map((store) => (
          <Card 
            key={store.id} 
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleStoreSelect(store)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle 
                    className="text-lg line-clamp-1 text-primary cursor-pointer hover:text-primary/80 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStoreSelect(store);
                    }}
                  >
                    {store.name}
                  </CardTitle>
                  {store.description && (
                    <CardDescription className="mt-2 line-clamp-2">
                      {store.description}
                    </CardDescription>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div 
                    className="flex items-center gap-1 text-sm text-secondary animate-pulse hover:text-primary transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStoreSelect(store);
                    }}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>{getOfferCount(store.name)} offers</span>
                  </div>
                  <Badge 
                    variant="default" 
                    className="cursor-pointer hover:bg-primary/80 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStoreSelect(store);
                    }}
                  >
                    Active
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {store.location && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{store.location}</span>
                </div>
              )}
              
              {(store.city || store.district) && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{store.city}</span>
                  {store.city && store.district && <span>•</span>}
                  <span className="text-muted-foreground">{store.district}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {store.phone_number && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`tel:${store.phone_number}`);
                    }}
                  >
                    <Phone className="h-3 w-3" />
                    Call
                  </Button>
                )}
                
                {store.email && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`mailto:${store.email}`);
                    }}
                  >
                    <Mail className="h-3 w-3" />
                    Email
                  </Button>
                )}
                
                {store.website && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(store.website, '_blank');
                    }}
                  >
                    <Globe className="h-3 w-3" />
                    Website
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {showViewAll && maxItems && stores.length > maxItems && (
        <div className="text-center">
          <Button variant="outline" className="flex items-center gap-2">
            View All Stores
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};