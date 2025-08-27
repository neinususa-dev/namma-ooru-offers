import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Edit3, ArrowLeft, Save, X, Eye, EyeOff, Calendar, MapPin, 
  Tag, DollarSign, Percent, Package, Globe
} from 'lucide-react';

interface OfferData {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  district: string;
  city: string;
  original_price: number;
  discount_percentage: number;
  discounted_price: number;
  expiry_date: string;
  redemption_mode: 'online' | 'store' | 'both';
  listing_type: 'hot_offers' | 'trending' | 'local_deals';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  merchant_id: string;
  image_url: string;
}

const MerchantEditOffers = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [offers, setOffers] = useState<OfferData[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<OfferData | null>(null);
  const [editForm, setEditForm] = useState<Partial<OfferData>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Redirect if not authenticated or not a merchant
  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      navigate('/signin');
      return;
    }
    
    if (profile && profile.role !== 'merchant') {
      navigate('/');
      return;
    }
  }, [user, profile?.role, authLoading, navigate]);

  useEffect(() => {
    if (user && profile?.role === 'merchant' && !authLoading) {
      fetchOffers();
    }
  }, [user, profile?.role, authLoading]);

  const fetchOffers = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('merchant_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers(data as OfferData[] || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
      toast.error('Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  const handleEditOffer = (offer: OfferData) => {
    setSelectedOffer(offer);
    
    // If user is not premium and trying to edit a premium listing type, default to local_deals
    const listingType = !profile?.is_premium && (offer.listing_type === 'hot_offers' || offer.listing_type === 'trending') 
      ? 'local_deals' 
      : offer.listing_type;
    
    setEditForm({
      title: offer.title,
      description: offer.description,
      category: offer.category,
      location: offer.location,
      district: offer.district,
      city: offer.city,
      original_price: offer.original_price,
      discount_percentage: offer.discount_percentage,
      discounted_price: offer.discounted_price,
      expiry_date: offer.expiry_date.split('T')[0], // Format for date input
      redemption_mode: offer.redemption_mode,
      listing_type: listingType,
      is_active: offer.is_active,
      image_url: offer.image_url
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveOffer = async () => {
    if (!selectedOffer || !user) return;

    // Check if user is trying to save a premium listing type without premium access
    if (!profile?.is_premium && (editForm.listing_type === 'hot_offers' || editForm.listing_type === 'trending')) {
      toast.error('Premium subscription required for Hot Offers and Trending listings');
      return;
    }

    try {
      setSaving(true);
      
      // Calculate discounted price if needed
      const discountedPrice = editForm.original_price && editForm.discount_percentage
        ? editForm.original_price * (1 - editForm.discount_percentage / 100)
        : editForm.discounted_price;

      const { error } = await supabase
        .from('offers')
        .update({
          title: editForm.title,
          description: editForm.description,
          category: editForm.category,
          location: editForm.location,
          district: editForm.district,
          city: editForm.city,
          original_price: editForm.original_price,
          discount_percentage: editForm.discount_percentage,
          discounted_price: discountedPrice,
          expiry_date: new Date(editForm.expiry_date + 'T23:59:59').toISOString(),
          redemption_mode: editForm.redemption_mode,
          listing_type: editForm.listing_type,
          is_active: editForm.is_active,
          image_url: editForm.image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedOffer.id);

      if (error) throw error;

      toast.success('Offer updated successfully!');
      setIsEditDialogOpen(false);
      setSelectedOffer(null);
      fetchOffers(); // Refresh the offers list
    } catch (error) {
      console.error('Error updating offer:', error);
      toast.error('Failed to update offer');
    } finally {
      setSaving(false);
    }
  };

  const toggleOfferStatus = async (offerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', offerId);

      if (error) throw error;

      toast.success(`Offer ${!currentStatus ? 'activated' : 'disabled'} successfully!`);
      fetchOffers(); // Refresh the offers list
    } catch (error) {
      console.error('Error toggling offer status:', error);
      toast.error('Failed to update offer status');
    }
  };

  if (authLoading || loading || !user || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header showNavigation={false} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (profile.role !== 'merchant') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showNavigation={false} />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/merchant-dashboard')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Edit Offers</h1>
              <p className="text-muted-foreground">Manage and update your posted offers</p>
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        {offers.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No offers found</h3>
              <p className="text-muted-foreground mb-4">You haven't posted any offers yet.</p>
              <Button onClick={() => navigate('/merchant-post-offer')}>
                Post Your First Offer
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <Card key={offer.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{offer.title}</CardTitle>
                      <CardDescription className="mt-2 line-clamp-2">
                        {offer.description}
                      </CardDescription>
                    </div>
                    <Badge variant={offer.is_active ? "default" : "secondary"}>
                      {offer.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {offer.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {offer.city || offer.location}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {offer.discount_percentage}% OFF
                      </div>
                      {offer.original_price && offer.discounted_price && (
                        <div className="text-sm">
                          <span className="line-through text-muted-foreground">₹{offer.original_price}</span>
                          <span className="ml-2 font-semibold">₹{offer.discounted_price}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Expires: {new Date(offer.expiry_date).toLocaleDateString()}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleOfferStatus(offer.id, offer.is_active)}
                      className="flex items-center gap-2"
                    >
                      {offer.is_active ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      {offer.is_active ? 'Disable' : 'Enable'}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleEditOffer(offer)}
                      className="flex items-center gap-2"
                    >
                      <Edit3 className="h-3 w-3" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Offer</DialogTitle>
              <DialogDescription>
                Update your offer details below
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Offer Title</Label>
                <Input
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter offer title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your offer"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={editForm.category || ''} onValueChange={(value) => setEditForm(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food & Dining</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="grocery">Grocery</SelectItem>
                      <SelectItem value="home">Home & Garden</SelectItem>
                      <SelectItem value="beauty">Beauty & Health</SelectItem>
                      <SelectItem value="sports">Sports & Fitness</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="listing_type">Listing Type</Label>
                  <Select value={editForm.listing_type || ''} onValueChange={(value: 'hot_offers' | 'trending' | 'local_deals') => setEditForm(prev => ({ ...prev, listing_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select listing type" />
                    </SelectTrigger>
                    <SelectContent>
                      {profile?.is_premium && (
                        <>
                          <SelectItem value="hot_offers">Hot Offers (Premium)</SelectItem>
                          <SelectItem value="trending">Trending (Premium)</SelectItem>
                        </>
                      )}
                      <SelectItem value="local_deals">Local Deals</SelectItem>
                      {!profile?.is_premium && (
                        <div className="px-2 py-1 text-xs text-muted-foreground">
                          Upgrade to Premium for Hot Offers & Trending
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    value={editForm.city || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <Label htmlFor="district">District</Label>
                  <Input
                    value={editForm.district || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, district: e.target.value }))}
                    placeholder="Enter district"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    value={editForm.location || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter location"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="original_price">Original Price (₹)</Label>
                  <Input
                    type="number"
                    value={editForm.original_price || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, original_price: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="discount_percentage">Discount (%)</Label>
                  <Input
                    type="number"
                    value={editForm.discount_percentage || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, discount_percentage: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="discounted_price">Final Price (₹)</Label>
                  <Input
                    type="number"
                    value={editForm.discounted_price || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, discounted_price: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry_date">Expiry Date</Label>
                  <Input
                    type="date"
                    value={editForm.expiry_date || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, expiry_date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="redemption_mode">Redemption Mode</Label>
                  <Select value={editForm.redemption_mode || ''} onValueChange={(value) => setEditForm(prev => ({ ...prev, redemption_mode: value as 'online' | 'store' | 'both' }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select redemption mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online Only</SelectItem>
                      <SelectItem value="store">Store Only</SelectItem>
                      <SelectItem value="both">Both Online & Store</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  value={editForm.image_url || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="Enter image URL (optional)"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={editForm.is_active || false}
                  onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, is_active: checked }))}
                />
                <Label>Active Offer</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveOffer} disabled={saving} className="flex items-center gap-2">
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default MerchantEditOffers;