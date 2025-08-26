import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, MapPin, Tag, DollarSign, Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const offerSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be under 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be under 500 characters'),
  category: z.string().min(1, 'Category is required'),
  location: z.string().min(1, 'Location is required'),
  original_price: z.number().min(0, 'Original price must be positive'),
  discount_percentage: z.number().min(1, 'Discount must be at least 1%').max(100, 'Discount cannot exceed 100%'),
  expiry_date: z.date(),
  redemption_mode: z.enum(['online', 'store', 'both']),
  listing_type: z.enum(['hot_offers', 'trending', 'local_deals']),
});

type OfferFormData = z.infer<typeof offerSchema>;

const MerchantPostOffer: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

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

  // Redirect if not authenticated or not a merchant
  React.useEffect(() => {
    if (!loading && (!user || profile?.role !== 'merchant')) {
      navigate('/auth');
    }
  }, [user, profile, loading, navigate]);

  // Calculate discounted price
  const discountedPrice = watchedValues.original_price 
    ? watchedValues.original_price * (1 - (watchedValues.discount_percentage || 0) / 100)
    : 0;

  const onSubmit = async (data: OfferFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const offerData = {
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        original_price: data.original_price,
        discount_percentage: data.discount_percentage,
        merchant_id: user.id,
        discounted_price: data.original_price * (1 - data.discount_percentage / 100),
        expiry_date: data.expiry_date.toISOString(),
        redemption_mode: data.redemption_mode,
        listing_type: data.listing_type,
      };

      const { error } = await supabase.from('offers').insert([offerData]);

      if (error) {
        throw error;
      }

      toast({
        title: 'Success!',
        description: 'Your offer has been posted successfully.',
      });

      reset();
      setSelectedDate(undefined);
      navigate('/merchant-dashboard');
    } catch (error) {
      console.error('Error posting offer:', error);
      toast({
        title: 'Error',
        description: 'Failed to post offer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Post New Offer</h1>
            <p className="text-muted-foreground">Create compelling offers to attract customers to your business</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Offer Details
                  </CardTitle>
                  <CardDescription>Basic information about your offer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                      placeholder="Describe your offer in detail..."
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
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="fashion">Fashion</SelectItem>
                        <SelectItem value="food">Food & Dining</SelectItem>
                        <SelectItem value="grocery">Grocery</SelectItem>
                        <SelectItem value="home">Home & Garden</SelectItem>
                        <SelectItem value="beauty">Beauty & Health</SelectItem>
                        <SelectItem value="sports">Sports & Fitness</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-destructive">{errors.category.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location *
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
                </CardContent>
              </Card>

              {/* Right Column - Pricing & Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Pricing & Settings
                  </CardTitle>
                  <CardDescription>Set your offer pricing and display options</CardDescription>
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
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.expiry_date && (
                      <p className="text-sm text-destructive">{errors.expiry_date.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Redemption Mode *</Label>
                    <Select 
                      defaultValue="both" 
                      onValueChange={(value: 'online' | 'store' | 'both') => setValue('redemption_mode', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online Only</SelectItem>
                        <SelectItem value="store">In-Store Only</SelectItem>
                        <SelectItem value="both">Both Online & In-Store</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Listing Category</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hot_offers"
                          checked={watchedValues.listing_type === 'hot_offers'}
                          disabled={!profile?.is_premium}
                          onCheckedChange={(checked) => {
                            if (checked) setValue('listing_type', 'hot_offers');
                          }}
                        />
                        <Label htmlFor="hot_offers" className={!profile?.is_premium ? 'text-muted-foreground' : ''}>
                          Today's Hot Offers {!profile?.is_premium && '(Premium Only)'}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="trending"
                          checked={watchedValues.listing_type === 'trending'}
                          disabled={!profile?.is_premium}
                          onCheckedChange={(checked) => {
                            if (checked) setValue('listing_type', 'trending');
                          }}
                        />
                        <Label htmlFor="trending" className={!profile?.is_premium ? 'text-muted-foreground' : ''}>
                          Top Trending Coupons {!profile?.is_premium && '(Premium Only)'}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="local_deals"
                          checked={watchedValues.listing_type === 'local_deals'}
                          onCheckedChange={(checked) => {
                            if (checked) setValue('listing_type', 'local_deals');
                          }}
                        />
                        <Label htmlFor="local_deals">Local Deals (Free)</Label>
                      </div>
                    </div>
                    {!profile?.is_premium && (
                      <p className="text-xs text-muted-foreground">
                        Upgrade to premium to feature your offers in hot offers and trending sections.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/merchant-dashboard')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Posting...' : 'Post Offer'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default MerchantPostOffer;