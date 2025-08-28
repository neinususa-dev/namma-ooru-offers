import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Header } from '@/components/Header';
import { DistrictSelect } from '@/components/DistrictSelect';
import { CitySelect } from '@/components/CitySelect';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  store_name: z.string().optional(),
  store_location: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone_number: '',
      district: '',
      city: '',
      store_name: '',
      store_location: '',
    }
  });

  // Load profile data when component mounts
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || '',
        email: profile.email || '',
        phone_number: profile.phone_number || '',
        district: profile.district || '',
        city: profile.city || '',
        store_name: profile.store_name || '',
        store_location: profile.store_location || '',
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          phone_number: data.phone_number || null,
          district: data.district || null,
          city: data.city || null,
          store_name: data.store_name || null,
          store_location: data.store_location || null,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been saved.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "There was an error saving your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header showNavigation={false} />
        <div className="container mx-auto px-4 py-8">
          <Card className="w-96 mx-auto">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Please sign in to view your profile.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const selectedDistrict = form.watch('district');

  return (
    <div className="min-h-screen bg-background">
      <Header showNavigation={false} />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your full name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="Enter your email" disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                              <span className="text-sm text-muted-foreground">+91</span>
                            </div>
                            <Input 
                              {...field} 
                              placeholder="Enter 10-digit number"
                              className="rounded-l-none"
                              maxLength={10}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                field.onChange(value);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Location Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Location Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District</FormLabel>
                        <FormControl>
                          <DistrictSelect
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select your district"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City/Town</FormLabel>
                        <FormControl>
                          <CitySelect
                            selectedDistrict={selectedDistrict || ''}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select your city/town"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Store Information (only for merchants) */}
                {profile.role === 'merchant' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Store Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="store_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Store Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter your store name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="store_location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Store Location</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter your store address" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Save Button */}
                <div className="pt-6">
                  <Button type="submit" disabled={loading} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}