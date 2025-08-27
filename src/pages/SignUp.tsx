import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Lock, Store, MapPin, Phone } from 'lucide-react';
import { Header } from '@/components/Header';
import { DistrictSelect } from '@/components/DistrictSelect';
import { CitySelect } from '@/components/CitySelect';

export default function SignUp() {
  const { user, profile, signUp, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [signUpForm, setSignUpForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer' as 'customer' | 'merchant',
    storeName: '',
    storeLocation: '',
    district: '',
    city: '',
    phoneNumber: ''
  });

  // Redirect authenticated users
  useEffect(() => {
    if (user && profile && !loading) {
      if (profile.role === 'merchant') {
        navigate('/merchant-post-offer');
      } else {
        navigate('/');
      }
    }
  }, [user, profile, loading, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const additionalData = {
      phone_number: signUpForm.phoneNumber,
      ...(signUpForm.role === 'merchant' ? {
        store_name: signUpForm.storeName,
        store_location: signUpForm.storeLocation,
        district: signUpForm.district,
        city: signUpForm.city
      } : {})
    };

    const { error } = await signUp(
      signUpForm.email,
      signUpForm.password,
      signUpForm.name,
      signUpForm.role,
      additionalData
    );

    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "Please check your email to confirm your account.",
      });
    }
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sunset-gradient flex items-center justify-center">
        <div className="text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sunset-gradient flex flex-col">
      <Header showNavigation={false} />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">Join Namma Ooru Offers</CardTitle>
            <CardDescription>
              Create your account to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-3">
                <Label>Account Type</Label>
                <RadioGroup
                  value={signUpForm.role}
                  onValueChange={(value: 'customer' | 'merchant') => 
                    setSignUpForm({ ...signUpForm, role: value })
                  }
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="customer" id="customer" />
                    <Label htmlFor="customer" className="cursor-pointer">
                      Customer - Browse and save offers
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="merchant" id="merchant" />
                    <Label htmlFor="merchant" className="cursor-pointer">
                      Merchant - Manage your store offers
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={signUpForm.name}
                    onChange={(e) => setSignUpForm({ ...signUpForm, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone-number">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone-number"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="pl-10"
                    value={signUpForm.phoneNumber}
                    onChange={(e) => setSignUpForm({ ...signUpForm, phoneNumber: e.target.value })}
                    required
                  />
                </div>
              </div>

              {signUpForm.role === 'merchant' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="store-name">Store Name</Label>
                    <div className="relative">
                      <Store className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="store-name"
                        type="text"
                        placeholder="Enter your store name"
                        className="pl-10"
                        value={signUpForm.storeName}
                        onChange={(e) => setSignUpForm({ ...signUpForm, storeName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="store-location">Store Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="store-location"
                        type="text"
                        placeholder="Enter your store address"
                        className="pl-10"
                        value={signUpForm.storeLocation}
                        onChange={(e) => setSignUpForm({ ...signUpForm, storeLocation: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>District</Label>
                    <DistrictSelect
                      value={signUpForm.district}
                      onValueChange={(value) => setSignUpForm({ ...signUpForm, district: value, city: '' })}
                      placeholder="Select your district"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>City/Town</Label>
                    <CitySelect
                      selectedDistrict={signUpForm.district}
                      value={signUpForm.city}
                      onValueChange={(value) => setSignUpForm({ ...signUpForm, city: value })}
                      placeholder="Select your city/town"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    className="pl-10"
                    value={signUpForm.password}
                    onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-secondary-gradient hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}