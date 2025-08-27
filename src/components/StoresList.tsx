import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Globe, ExternalLink, ShoppingBag } from 'lucide-react';
import { useStores } from '@/hooks/useStores';
import { useOfferDatabase } from '@/hooks/useOfferDatabase';
import { Skeleton } from '@/components/ui/skeleton';

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

  // Function to count offers per store
  const getOfferCount = (storeName: string) => {
    return offers.filter(offer => 
      offer.merchant_name === storeName
    ).length;
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayStores.map((store) => (
          <Card 
            key={store.id} 
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onStoreClick?.(store.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-1">{store.name}</CardTitle>
                  {store.description && (
                    <CardDescription className="mt-2 line-clamp-2">
                      {store.description}
                    </CardDescription>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 text-sm text-secondary animate-pulse">
                    <ShoppingBag className="h-4 w-4" />
                    <span>{getOfferCount(store.name)} offers</span>
                  </div>
                  <Badge variant="default">Active</Badge>
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