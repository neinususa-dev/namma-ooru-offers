import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from "@/hooks/useAuth";
import { useCategories } from '@/hooks/useCategories';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useOfferDatabase } from "@/hooks/useOfferDatabase";
import { useAdminOffers } from "@/hooks/useAdminOffers";
import { useStores } from "@/hooks/useStores";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Store, Shield, Users, ShoppingBag, Plus, Edit, CheckCircle, XCircle, CalendarIcon, MapPin, Tag, DollarSign, Clock, Upload, X, Eye } from "lucide-react";
import { OfferCard } from "@/components/OfferCard";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { SuperAdminLayout } from "@/components/SuperAdminLayout";
import { format } from "date-fns";
import { cn } from '@/lib/utils';
import { resizeImage, generateDefaultImage } from '@/utils/imageUtils';

export function AdminDashboard() {
  const { profile, loading: authLoading } = useAuth();

  // Show loading state while authentication is being checked
  if (authLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  return <AdminDashboardContent />;
}

function AdminDashboardContent() {
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

  // Offer form schema
  const offerSchema = z.object({
    merchant_id: z.string().min(1, 'Merchant selection is required'),
    store_name: z.string().min(1, 'Store name is required'),
    title: z.string().min(1, 'Title is required').max(100, 'Title must be under 100 characters'),
    description: z.string().min(1, 'Description is required').max(500, 'Description must be under 500 characters'),
    category: z.string().min(1, 'Category is required'),
    district: z.string().min(1, 'District is required'),
    city: z.string().min(1, 'City/Town is required'),
    location: z.string().min(1, 'Location is required'),
    original_price: z.number().min(0, 'Original price must be positive'),
    discount_percentage: z.number().min(1, 'Discount must be at least 1%').max(100, 'Discount cannot exceed 100%'),
    expiry_date: z.date(),
    redemption_mode: z.enum(['online', 'store', 'both']),
    listing_type: z.enum(['hot_offers', 'trending', 'local_deals']),
    image_url: z.string().optional(),
  });

  type OfferFormData = z.infer<typeof offerSchema>;

  const { categories, loading: categoriesLoading } = useCategories();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [selectedMerchant, setSelectedMerchant] = useState<any>(null);
  const [merchantProfiles, setMerchantProfiles] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      redemption_mode: 'both',
      listing_type: 'local_deals',
    },
  });

  const watchedValues = watch();

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

  // Fetch merchant profiles on component mount
  useEffect(() => {
    const fetchMerchantProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'merchant');

        if (error) throw error;
        setMerchantProfiles(data || []);
      } catch (error) {
        console.error('Error fetching merchant profiles:', error);
      }
    };

    fetchMerchantProfiles();
  }, []);

  // Calculate discounted price
  const discountedPrice = watchedValues.original_price 
    ? watchedValues.original_price * (1 - (watchedValues.discount_percentage || 0) / 100)
    : 0;

  // Handle image upload with resizing
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const resizedImage = await resizeImage(file);
        setUploadedImage(resizedImage);
        setValue('image_url', resizedImage);
      } catch (error) {
        console.error('Error resizing image:', error);
        toast.error('Failed to process image. Please try again.');
      }
    }
  };

  const removeImage = () => {
    setUploadedImage('');
    setValue('image_url', '');
  };

  // Generate preview image
  const getPreviewImage = () => {
    if (uploadedImage) {
      return uploadedImage;
    }
    if (watchedValues.store_name) {
      return generateDefaultImage(watchedValues.store_name);
    }
    return undefined;
  };

  const onSubmitOffer = async (data: OfferFormData) => {
    try {
      const offerData = {
        store_name: data.store_name,
        title: data.title,
        description: data.description,
        category: data.category,
        district: data.district,
        city: data.city,
        location: data.location,
        original_price: data.original_price,
        discount_percentage: data.discount_percentage,
        merchant_id: data.merchant_id, // Use selected merchant
        discounted_price: data.original_price * (1 - data.discount_percentage / 100),
        expiry_date: data.expiry_date.toISOString(),
        listing_type: data.listing_type,
        redemption_mode: data.redemption_mode,
        image_url: data.image_url,
        status: 'approved', // Admin-created offers are auto-approved
        is_active: true
      };

      const { error } = await supabase.from('offers').insert([offerData]);

      if (error) {
        throw error;
      }

      toast.success('Offer created successfully for merchant!');
      
      reset();
      setSelectedDate(undefined);
      setUploadedImage('');
      setSelectedMerchant(null);
      allOffers.refetch();
    } catch (error) {
      console.error('Error posting offer:', error);
      toast.error('Failed to create offer. Please try again.');
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
                          // Only update fields that exist in the database
                          const updateData = {
                            title: selectedOffer.title,
                            description: selectedOffer.description,
                            status: selectedOffer.status,
                            original_price: selectedOffer.original_price,
                            discount_percentage: selectedOffer.discount_percentage,
                            category: selectedOffer.category,
                            location: selectedOffer.location,
                            district: selectedOffer.district,
                            city: selectedOffer.city,
                            store_name: selectedOffer.store_name,
                            is_active: selectedOffer.is_active
                          };
                          allOffers.updateOffer(selectedOffer.id, updateData);
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
            </div>

            {/* Create Offer Form - Replica of Merchant Post Offer */}
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {selectedMerchant ? `Create Offer for ${selectedMerchant.store_name || selectedMerchant.name}` : 'Post New Offer for Merchant'}
                </h1>
                <p className="text-muted-foreground">Create compelling offers on behalf of merchants</p>
              </div>

              <form onSubmit={handleSubmit(onSubmitOffer)} className="space-y-8">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Left Column - Merchant Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Select Merchant
                      </CardTitle>
                      <CardDescription>Choose which merchant to create offer for</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="merchant">Merchant *</Label>
                        <Select 
                          onValueChange={(value) => {
                            const merchant = merchantProfiles.find(m => m.id === value);
                            setSelectedMerchant(merchant);
                            setValue('merchant_id', value);
                            if (merchant?.store_name) setValue('store_name', merchant.store_name);
                            if (merchant?.district) setValue('district', merchant.district);
                            if (merchant?.city) setValue('city', merchant.city);
                            if (merchant?.store_location) setValue('location', merchant.store_location);
                          }}
                        >
                          <SelectTrigger className={errors.merchant_id ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Select a merchant" />
                          </SelectTrigger>
                          <SelectContent>
                            {merchantProfiles.map((merchant) => (
                              <SelectItem key={merchant.id} value={merchant.id}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{merchant.store_name || merchant.name}</span>
                                  <span className="text-xs text-muted-foreground">{merchant.email}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.merchant_id && (
                          <p className="text-sm text-destructive">{errors.merchant_id.message}</p>
                        )}
                      </div>

                      {selectedMerchant && (
                        <div className="p-3 bg-muted rounded-lg">
                          <h4 className="font-medium mb-2">Selected Merchant:</h4>
                          <p className="text-sm"><strong>Store:</strong> {selectedMerchant.store_name || selectedMerchant.name}</p>
                          <p className="text-sm"><strong>Email:</strong> {selectedMerchant.email}</p>
                          <p className="text-sm"><strong>Location:</strong> {selectedMerchant.city}, {selectedMerchant.district}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Middle Column - Basic Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        Offer Details
                      </CardTitle>
                      <CardDescription>Basic information about the offer</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="store_name" className="flex items-center gap-2">
                          <Store className="h-4 w-4" />
                          Store Name *
                        </Label>
                        <Input
                          id="store_name"
                          placeholder="Enter store name"
                          {...register('store_name')}
                          className={errors.store_name ? 'border-destructive' : ''}
                        />
                        {errors.store_name && (
                          <p className="text-sm text-destructive">{errors.store_name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="title">Offer Title *</Label>
                        <Input
                          id="title"
                          placeholder="e.g., 50% Off All Electronics"
                          {...register('title')}
                          className={errors.title ? 'border-destructive' : ''}
                        />
                        {errors.title && (
                          <p className="text-sm text-destructive">{errors.title.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe the offer in detail..."
                          rows={4}
                          {...register('description')}
                          className={errors.description ? 'border-destructive' : ''}
                        />
                        {errors.description && (
                          <p className="text-sm text-destructive">{errors.description.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select onValueChange={(value) => setValue('category', value)}>
                          <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border shadow-md z-50">
                            {categoriesLoading ? (
                              <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                            ) : categories.length > 0 ? (
                              categories.map((category) => (
                                <SelectItem key={category.id} value={category.name}>
                                  {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-categories" disabled>No categories available</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        {errors.category && (
                          <p className="text-sm text-destructive">{errors.category.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="district">District *</Label>
                        <Input
                          id="district"
                          placeholder="Enter district"
                          {...register('district')}
                          className={errors.district ? 'border-destructive' : ''}
                        />
                        {errors.district && (
                          <p className="text-sm text-destructive">{errors.district.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">City/Town *</Label>
                        <Input
                          id="city"
                          placeholder="Enter city/town"
                          {...register('city')}
                          className={errors.city ? 'border-destructive' : ''}
                        />
                        {errors.city && (
                          <p className="text-sm text-destructive">{errors.city.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Specific Location *
                        </Label>
                        <Input
                          id="location"
                          placeholder="e.g., Downtown Mall, City Center"
                          {...register('location')}
                          className={errors.location ? 'border-destructive' : ''}
                        />
                        {errors.location && (
                          <p className="text-sm text-destructive">{errors.location.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="image">Offer Image</Label>
                        <div className="space-y-2">
                          {uploadedImage ? (
                            <div className="relative">
                              <img
                                src={uploadedImage}
                                alt="Offer preview"
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={removeImage}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <div className="space-y-2">
                                <Label htmlFor="image-upload" className="text-sm font-medium cursor-pointer">
                                  Click to upload an image
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  PNG, JPG up to 10MB
                                </p>
                              </div>
                              <Input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Right Column - Pricing & Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Pricing & Settings
                      </CardTitle>
                      <CardDescription>Set pricing and display options</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="original_price">Original Price ($) *</Label>
                        <Input
                          id="original_price"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...register('original_price', { valueAsNumber: true })}
                          className={errors.original_price ? 'border-destructive' : ''}
                        />
                        {errors.original_price && (
                          <p className="text-sm text-destructive">{errors.original_price.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="discount_percentage">Discount Percentage (%) *</Label>
                        <Input
                          id="discount_percentage"
                          type="number"
                          min="1"
                          max="100"
                          placeholder="0"
                          {...register('discount_percentage', { valueAsNumber: true })}
                          className={errors.discount_percentage ? 'border-destructive' : ''}
                        />
                        {errors.discount_percentage && (
                          <p className="text-sm text-destructive">{errors.discount_percentage.message}</p>
                        )}
                      </div>

                      {watchedValues.original_price && watchedValues.discount_percentage && (
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium">Final Price: ${discountedPrice.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            You save: ${(watchedValues.original_price - discountedPrice).toFixed(2)}
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Expiry Date *
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !selectedDate && 'text-muted-foreground',
                                errors.expiry_date && 'border-destructive'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={(date) => {
                                setSelectedDate(date);
                                if (date) setValue('expiry_date', date);
                              }}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.expiry_date && (
                          <p className="text-sm text-destructive">{errors.expiry_date.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Redemption Mode *</Label>
                        <Select onValueChange={(value: 'online' | 'store' | 'both') => setValue('redemption_mode', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select redemption mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="online">Online Only</SelectItem>
                            <SelectItem value="store">In Store Only</SelectItem>
                            <SelectItem value="both">Both Online & In Store</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Listing Type *</Label>
                        <Select onValueChange={(value: 'hot_offers' | 'trending' | 'local_deals') => setValue('listing_type', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select listing type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hot_offers">Hot Offers</SelectItem>
                            <SelectItem value="trending">Trending</SelectItem>
                            <SelectItem value="local_deals">Local Deals</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button type="submit" className="w-full">
                        Create Offer for Merchant
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Preview Section */}
                {watchedValues.title && selectedMerchant && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Offer Preview
                      </CardTitle>
                      <CardDescription>Preview how the offer will appear to customers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="max-w-sm">
                        <OfferCard
                          id="preview"
                          shopName={watchedValues.store_name || selectedMerchant.store_name || selectedMerchant.name}
                          offerTitle={watchedValues.title}
                          description={watchedValues.description || ''}
                          discount={`${watchedValues.discount_percentage || 0}%`}
                          originalPrice={watchedValues.original_price || 0}
                          discountedPrice={discountedPrice}
                          expiryDate={selectedDate ? selectedDate.toISOString() : ''}
                          location={`${watchedValues.city || ''}, ${watchedValues.district || ''}`}
                          category={watchedValues.category || ''}
                          image={getPreviewImage()}
                          isHot={watchedValues.listing_type === 'hot_offers'}
                          isTrending={watchedValues.listing_type === 'trending'}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
}