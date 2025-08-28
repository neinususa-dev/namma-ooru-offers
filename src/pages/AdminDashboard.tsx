import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useOfferDatabase } from "@/hooks/useOfferDatabase";
import { useAdminOffers } from "@/hooks/useAdminOffers";
import { useStores } from "@/hooks/useStores";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Store, Shield, Users, ShoppingBag, Plus, Edit, CheckCircle, XCircle } from "lucide-react";
import { OfferCard } from "@/components/OfferCard";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { SuperAdminLayout } from "@/components/SuperAdminLayout";
import { format } from "date-fns";

export function AdminDashboard() {
  const { profile } = useAuth();
  const { offers, loading: offersLoading } = useOfferDatabase();
  const allOffers = useAdminOffers();
  const { stores, loading: storesLoading } = useStores();
  
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'in_review': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const handleCreateOffer = async () => {
    try {
      const { error } = await supabase.from('offers').insert([{
        ...newOffer,
        original_price: parseFloat(newOffer.original_price) || null,
        discounted_price: parseFloat(newOffer.discounted_price) || null,
        expiry_date: new Date(newOffer.expiry_date).toISOString(),
        merchant_id: newOffer.merchant_id || null,
        status: 'approved' // Admin-created offers are auto-approved
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
    <SuperAdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage stores, offers, and platform overview</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stores?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allOffers.offers?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allOffers.getOffersByStatus('in_review').length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Offers</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allOffers.getOffersByStatus('approved').length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="all-pages">All Pages</TabsTrigger>
            <TabsTrigger value="stores">Stores</TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
            <TabsTrigger value="create-new">Create New</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="space-y-8">
                    <div className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Platform Analytics Dashboard
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Monitor all store and offer activity from here.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Frequently used admin functions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button asChild className="w-full">
                      <Link to="/admin-navigation">
                        <Users className="mr-2 h-4 w-4" />
                        Navigate All Pages
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/">
                        <Store className="mr-2 h-4 w-4" />
                        View Main Site
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="all-pages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Navigate to Any Page</CardTitle>
                <CardDescription>Access all platform pages and features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Button asChild className="w-full justify-start">
                    <Link to="/admin-navigation">
                      <Users className="mr-2 h-4 w-4" />
                      Open Full Navigation Dashboard
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stores" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Stores</CardTitle>
                <CardDescription>Manage platform stores</CardDescription>
              </CardHeader>
              <CardContent>
                {storesLoading ? (
                  <div>Loading stores...</div>
                ) : (
                  <div className="space-y-4">
                    {stores?.map((store) => (
                      <div key={store.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{store.name}</h3>
                          <p className="text-sm text-muted-foreground">{store.location}</p>
                        </div>
                        <Badge variant="outline">{store.district}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offers" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Offer Management</CardTitle>
                    <CardDescription>Review and manage all merchant offers</CardDescription>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Offers ({allOffers.offers.length})</SelectItem>
                      <SelectItem value="in_review">In Review ({allOffers.getOffersByStatus('in_review').length})</SelectItem>
                      <SelectItem value="approved">Approved ({allOffers.getOffersByStatus('approved').length})</SelectItem>
                      <SelectItem value="rejected">Rejected ({allOffers.getOffersByStatus('rejected').length})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {allOffers.loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allOffers.getOffersByStatus(statusFilter).length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No offers found for the selected status.
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {allOffers.getOffersByStatus(statusFilter).map((offer) => (
                          <div key={offer.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-lg">{offer.title}</h3>
                                  <Badge variant={getStatusVariant(offer.status)}>
                                    {offer.status.replace('_', ' ')}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{offer.description}</p>
                                <div className="flex gap-4 text-sm">
                                  <span><span className="font-medium">Store:</span> {offer.merchant_name}</span>
                                  <span><span className="font-medium">Category:</span> {offer.category}</span>
                                  <span><span className="font-medium">Location:</span> {offer.city}</span>
                                  <span><span className="font-medium">Discount:</span> {offer.discount_percentage}% OFF</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Created: {format(new Date(offer.created_at), 'PPp')}
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                {offer.status === 'in_review' && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => allOffers.updateOfferStatus(offer.id, 'approved')}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => allOffers.updateOfferStatus(offer.id, 'rejected')}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedOffer(offer);
                                    setEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Edit Offer Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Offer</DialogTitle>
                </DialogHeader>
                {selectedOffer && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-title">Title</Label>
                        <Input
                          id="edit-title"
                          value={selectedOffer.title}
                          onChange={(e) => setSelectedOffer({...selectedOffer, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-status">Status</Label>
                        <Select 
                          value={selectedOffer.status} 
                          onValueChange={(value) => setSelectedOffer({...selectedOffer, status: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in_review">In Review</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        value={selectedOffer.description}
                        onChange={(e) => setSelectedOffer({...selectedOffer, description: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-price">Original Price</Label>
                        <Input
                          id="edit-price"
                          type="number"
                          value={selectedOffer.original_price}
                          onChange={(e) => setSelectedOffer({...selectedOffer, original_price: parseFloat(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-discount">Discount %</Label>
                        <Input
                          id="edit-discount"
                          type="number"
                          value={selectedOffer.discount_percentage}
                          onChange={(e) => setSelectedOffer({...selectedOffer, discount_percentage: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setEditDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          allOffers.updateOffer(selectedOffer.id, selectedOffer);
                          setEditDialogOpen(false);
                        }}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="create-new" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Store</CardTitle>
                  <CardDescription>Add a new store to the platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input
                      id="storeName"
                      value={newStore.name}
                      onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                      placeholder="Enter store name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="storeDescription">Description</Label>
                    <Textarea
                      id="storeDescription"
                      value={newStore.description}
                      onChange={(e) => setNewStore({...newStore, description: e.target.value})}
                      placeholder="Store description"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="storeLocation">Location</Label>
                      <Input
                        id="storeLocation"
                        value={newStore.location}
                        onChange={(e) => setNewStore({...newStore, location: e.target.value})}
                        placeholder="Location"
                      />
                    </div>
                    <div>
                      <Label htmlFor="storeDistrict">District</Label>
                      <Input
                        id="storeDistrict"
                        value={newStore.district}
                        onChange={(e) => setNewStore({...newStore, district: e.target.value})}
                        placeholder="District"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="storeCity">City</Label>
                      <Input
                        id="storeCity"
                        value={newStore.city}
                        onChange={(e) => setNewStore({...newStore, city: e.target.value})}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="storePhone">Phone</Label>
                      <Input
                        id="storePhone"
                        value={newStore.phone_number}
                        onChange={(e) => setNewStore({...newStore, phone_number: e.target.value})}
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleCreateStore} className="w-full">
                    Create Store
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Create New Offer</CardTitle>
                  <CardDescription>Post an offer for any store</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="offerTitle">Title</Label>
                    <Input
                      id="offerTitle"
                      value={newOffer.title}
                      onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                      placeholder="Offer title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="offerDescription">Description</Label>
                    <Textarea
                      id="offerDescription"
                      value={newOffer.description}
                      onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                      placeholder="Offer description"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="offerCategory">Category</Label>
                      <Select value={newOffer.category} onValueChange={(value) => setNewOffer({...newOffer, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="food">Food & Dining</SelectItem>
                          <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="grocery">Grocery</SelectItem>
                          <SelectItem value="home">Home & Garden</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="offerStore">Store</Label>
                      <Select value={newOffer.store_name} onValueChange={(value) => setNewOffer({...newOffer, store_name: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select store" />
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
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="offerOriginal">Original Price</Label>
                      <Input
                        id="offerOriginal"
                        type="number"
                        value={newOffer.original_price}
                        onChange={(e) => setNewOffer({...newOffer, original_price: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="offerDiscounted">Discounted Price</Label>
                      <Input
                        id="offerDiscounted"
                        type="number"
                        value={newOffer.discounted_price}
                        onChange={(e) => setNewOffer({...newOffer, discounted_price: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="offerExpiry">Expiry Date</Label>
                    <Input
                      id="offerExpiry"
                      type="date"
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
    </SuperAdminLayout>
  );
}