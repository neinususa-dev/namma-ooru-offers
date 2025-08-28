import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useOfferDatabase } from "@/hooks/useOfferDatabase";
import { useStores } from "@/hooks/useStores";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Store, Shield, Users, ShoppingBag, Plus, Edit } from "lucide-react";
import { OfferCard } from "@/components/OfferCard";
import { Label } from "@/components/ui/label";

export function AdminDashboard() {
  const { profile } = useAuth();
  const { offers, loading: offersLoading } = useOfferDatabase();
  const { stores, loading: storesLoading } = useStores();
  
  const [newStore, setNewStore] = useState({
    name: "",
    description: "",
    location: "",
    district: "",
    city: "",
    phone_number: "",
    email: "",
    website: ""
  });

  const [newOffer, setNewOffer] = useState({
    title: "",
    description: "",
    category: "",
    store_name: "",
    original_price: "",
    discounted_price: "",
    location: "",
    district: "",
    city: "",
    expiry_date: "",
    merchant_id: ""
  });

  // Redirect if not super admin
  if (profile?.role !== 'super_admin') {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreateStore = async () => {
    try {
      const { error } = await supabase.from('stores').insert([newStore]);
      
      if (error) throw error;
      
      toast.success("Store created successfully!");
      setNewStore({
        name: "",
        description: "",
        location: "",
        district: "",
        city: "",
        phone_number: "",
        email: "",
        website: ""
      });
    } catch (error) {
      toast.error("Failed to create store");
      console.error(error);
    }
  };

  const handleCreateOffer = async () => {
    try {
      const { error } = await supabase.from('offers').insert([{
        ...newOffer,
        original_price: parseFloat(newOffer.original_price) || null,
        discounted_price: parseFloat(newOffer.discounted_price) || null,
        expiry_date: new Date(newOffer.expiry_date).toISOString(),
        merchant_id: newOffer.merchant_id || null
      }]);
      
      if (error) throw error;
      
      toast.success("Offer created successfully!");
      setNewOffer({
        title: "",
        description: "",
        category: "",
        store_name: "",
        original_price: "",
        discounted_price: "",
        location: "",
        district: "",
        city: "",
        expiry_date: "",
        merchant_id: ""
      });
    } catch (error) {
      toast.error("Failed to create offer");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage stores and offers across the platform</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stores?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offers?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offers?.filter(o => o.is_active).length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stores?.filter(s => s.is_active).length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stores" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stores" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Manage Stores
          </TabsTrigger>
          <TabsTrigger value="offers" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Manage Offers
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Stores</CardTitle>
              <CardDescription>View and manage all stores on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {storesLoading ? (
                <div>Loading stores...</div>
              ) : (
                <div className="space-y-4">
                  {stores?.map((store) => (
                    <div key={store.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{store.name}</h3>
                          <p className="text-sm text-muted-foreground">{store.description}</p>
                          <p className="text-sm">{store.location}, {store.city}</p>
                          <p className="text-sm">{store.email} • {store.phone_number}</p>
                        </div>
                        <Badge variant={store.is_active ? "default" : "secondary"}>
                          {store.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Offers</CardTitle>
              <CardDescription>View and manage all offers on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {offersLoading ? (
                <div>Loading offers...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {offers?.map((offer) => (
                    <OfferCard 
                      key={offer.id}
                      id={offer.id}
                      shopName={offer.merchant_name || 'N/A'}
                      offerTitle={offer.title}
                      description={offer.description || ''}
                      discount={offer.discount_percentage ? `${offer.discount_percentage}% off` : 'Special Offer'}
                      originalPrice={offer.original_price || undefined}
                      discountedPrice={offer.discounted_price || undefined}
                      expiryDate={new Date(offer.expiry_date).toLocaleDateString()}
                      location={offer.location || offer.city || 'N/A'}
                      category={offer.category || 'General'}
                      isTrending={false}
                      isHot={false}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Store */}
            <Card>
              <CardHeader>
                <CardTitle>Create New Store</CardTitle>
                <CardDescription>Add a new store to the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input
                    id="store-name"
                    value={newStore.name}
                    onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                    placeholder="Enter store name"
                  />
                </div>
                <div>
                  <Label htmlFor="store-description">Description</Label>
                  <Textarea
                    id="store-description"
                    value={newStore.description}
                    onChange={(e) => setNewStore({...newStore, description: e.target.value})}
                    placeholder="Store description"
                  />
                </div>
                <div>
                  <Label htmlFor="store-location">Location</Label>
                  <Input
                    id="store-location"
                    value={newStore.location}
                    onChange={(e) => setNewStore({...newStore, location: e.target.value})}
                    placeholder="Store location"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="store-district">District</Label>
                    <Input
                      id="store-district"
                      value={newStore.district}
                      onChange={(e) => setNewStore({...newStore, district: e.target.value})}
                      placeholder="District"
                    />
                  </div>
                  <div>
                    <Label htmlFor="store-city">City</Label>
                    <Input
                      id="store-city"
                      value={newStore.city}
                      onChange={(e) => setNewStore({...newStore, city: e.target.value})}
                      placeholder="City"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="store-phone">Phone</Label>
                  <Input
                    id="store-phone"
                    value={newStore.phone_number}
                    onChange={(e) => setNewStore({...newStore, phone_number: e.target.value})}
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="store-email">Email</Label>
                  <Input
                    id="store-email"
                    value={newStore.email}
                    onChange={(e) => setNewStore({...newStore, email: e.target.value})}
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <Label htmlFor="store-website">Website</Label>
                  <Input
                    id="store-website"
                    value={newStore.website}
                    onChange={(e) => setNewStore({...newStore, website: e.target.value})}
                    placeholder="Website URL"
                  />
                </div>
                <Button onClick={handleCreateStore} className="w-full">
                  Create Store
                </Button>
              </CardContent>
            </Card>

            {/* Create Offer */}
            <Card>
              <CardHeader>
                <CardTitle>Create New Offer</CardTitle>
                <CardDescription>Add a new offer on behalf of any merchant</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="offer-title">Offer Title</Label>
                  <Input
                    id="offer-title"
                    value={newOffer.title}
                    onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                    placeholder="Enter offer title"
                  />
                </div>
                <div>
                  <Label htmlFor="offer-description">Description</Label>
                  <Textarea
                    id="offer-description"
                    value={newOffer.description}
                    onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                    placeholder="Offer description"
                  />
                </div>
                <div>
                  <Label htmlFor="offer-store">Store Name</Label>
                  <Select
                    value={newOffer.store_name}
                    onValueChange={(value) => setNewOffer({...newOffer, store_name: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores?.map((store) => (
                        <SelectItem key={store.id} value={store.name}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="offer-category">Category</Label>
                  <Select
                    value={newOffer.category}
                    onValueChange={(value) => setNewOffer({...newOffer, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="grocery">Grocery</SelectItem>
                      <SelectItem value="home">Home & Garden</SelectItem>
                      <SelectItem value="health">Health & Beauty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="original-price">Original Price</Label>
                    <Input
                      id="original-price"
                      type="number"
                      value={newOffer.original_price}
                      onChange={(e) => setNewOffer({...newOffer, original_price: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="discounted-price">Discounted Price</Label>
                    <Input
                      id="discounted-price"
                      type="number"
                      value={newOffer.discounted_price}
                      onChange={(e) => setNewOffer({...newOffer, discounted_price: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="offer-expiry">Expiry Date</Label>
                  <Input
                    id="offer-expiry"
                    type="datetime-local"
                    value={newOffer.expiry_date}
                    onChange={(e) => setNewOffer({...newOffer, expiry_date: e.target.value})}
                  />
                </div>
                <Button onClick={handleCreateOffer} className="w-full">
                  Create Offer
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}