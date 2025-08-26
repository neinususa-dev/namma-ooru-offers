import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Store } from 'lucide-react';
import { OfferCard } from './OfferCard';

interface Store {
  id: string;
  name: string;
  categories: string[];
  location: string;
  district: string;
  city: string;
  offerCount: number;
  description: string;
}

interface Offer {
  id: string;
  shopName: string;
  offerTitle: string;
  description: string;
  discount: string;
  expiryDate: string;
  district: string;
  city: string;
  location: string;
  category: string;
  isTrending?: boolean;
  isHot?: boolean;
  image: string;
}

interface StoreListProps {
  offers: Offer[];
  showTitle?: boolean;
}

export const StoreList: React.FC<StoreListProps> = ({ offers, showTitle = true }) => {
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  // Extract unique stores from offers
  const stores: Store[] = Array.from(
    new Map(
      offers.map(offer => [
        offer.shopName,
        {
          id: offer.shopName.toLowerCase().replace(/\s+/g, '-'),
          name: offer.shopName,
          categories: [...new Set(offers.filter(o => o.shopName === offer.shopName).map(o => o.category))],
          location: offer.location,
          district: offer.district,
          city: offer.city,
          offerCount: offers.filter(o => o.shopName === offer.shopName).length,
          description: `Exclusive deals and offers from ${offer.shopName}`
        }
      ])
    ).values()
  );

  const getStoreOffers = (storeName: string) => {
    return offers.filter(offer => offer.shopName === storeName);
  };

  if (selectedStore) {
    const store = stores.find(s => s.id === selectedStore);
    const storeOffers = getStoreOffers(store?.name || '');

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => setSelectedStore(null)}
            className="text-primary hover:text-secondary transition-smooth mb-4 flex items-center gap-2"
          >
            ← Back to Store List
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Store className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">{store?.name}</h2>
          </div>
          <p className="text-muted-foreground mb-4">{store?.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{store?.location}, {store?.city}</span>
            </div>
            <span>•</span>
            <span>{storeOffers.length} Offers Available</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {storeOffers.map(offer => (
            <OfferCard key={offer.id} {...offer} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {showTitle && (
        <div className="flex items-center gap-3 mb-8">
          <Store className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">Store Directory</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map(store => (
          <Card 
            key={store.id} 
            className="offer-card cursor-pointer hover:border-primary/50 transition-smooth"
            onClick={() => setSelectedStore(store.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl text-foreground mb-2">{store.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {store.location}, {store.city}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {store.offerCount} Offers
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Categories:</h4>
                  <div className="flex flex-wrap gap-1">
                    {store.categories.map(category => (
                      <Badge 
                        key={category} 
                        variant="outline" 
                        className="text-xs border-secondary/30 text-secondary hover:bg-secondary/10"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{store.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};