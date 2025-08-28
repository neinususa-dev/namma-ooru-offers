import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
import { supabase } from '@/integrations/supabase/client';

export default function SignUp() {
  const { user, profile, signUp, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
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
    phoneNumber: '',
    referralCode: ''
  });

  // Handle URL referral code parameter
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode && !signUpForm.referralCode) {
      setSignUpForm(prev => ({ ...prev, referralCode: refCode.toUpperCase() }));
    }
  }, [searchParams]);

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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove +91 prefix if present and keep only digits
    const digitsOnly = value.replace(/^\+91/, '').replace(/\D/g, '');
    // Limit to 10 digits
    const limited = digitsOnly.slice(0, 10);
    setSignUpForm({ ...signUpForm, phoneNumber: limited });
  };

  const getFullPhoneNumber = () => {
    return `+91${signUpForm.phoneNumber}`;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get full phone number with country code
      const fullPhoneNumber = getFullPhoneNumber();
      
      // Validate phone number format (must be exactly 10 digits)
      if (signUpForm.phoneNumber.length !== 10 || !/^\d{10}$/.test(signUpForm.phoneNumber)) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter exactly 10 digits for your phone number.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Check if email already exists using the database function
      console.log('Checking email:', signUpForm.email.toLowerCase());
      const { data: emailExists, error: checkError } = await supabase
        .rpc('email_exists', { email_to_check: signUpForm.email });

      console.log('Email exists check result:', { emailExists, checkError });

      if (checkError) {
        console.error('Error checking existing email:', checkError);
        toast({
          title: "Error",
          description: "Failed to validate email. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (emailExists) {
        console.log('User already exists, showing error message');
        toast({
          title: "Account Already Exists",
          description: "An account with this email already exists. Please log in instead.",
          variant: "destructive",
        });
        setIsLoading(false);
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
        return;
      }

      // Check if phone number already exists
      console.log('Checking phone:', fullPhoneNumber);
      const { data: phoneExists, error: phoneCheckError } = await supabase
        .rpc('phone_exists', { phone_to_check: fullPhoneNumber });

      console.log('Phone exists check result:', { phoneExists, phoneCheckError });

      if (phoneCheckError) {
        console.error('Error checking existing phone:', phoneCheckError);
        toast({
          title: "Error",
          description: "Failed to validate phone number. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (phoneExists) {
        console.log('Phone number already exists, showing error message');
        toast({
          title: "Phone Number Already Exists",
          description: "An account with this phone number already exists. Please use a different number.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      console.log('Email and phone are available, proceeding with signup');

      // Proceed with signup if email and phone don't exist
      const additionalData = {
        phone_number: fullPhoneNumber,
        referral_code: signUpForm.referralCode || undefined,
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
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
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
                  <div className="flex">
                    <div className="flex items-center px-3 py-2 bg-muted border border-r-0 rounded-l-md text-sm font-medium">
                      +91
                    </div>
                    <Input
                      id="phone-number"
                      type="tel"
                      placeholder="10-digit mobile number"
                      className="pl-3 rounded-l-none border-l-0"
                      value={signUpForm.phoneNumber}
                      onChange={handlePhoneChange}
                      required
                      maxLength={10}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter your 10-digit mobile number
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referral-code">Referral Code (Optional)</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="referral-code"
                    type="text"
                    placeholder="Enter referral code from a friend"
                    className="pl-10"
                    value={signUpForm.referralCode}
                    onChange={(e) => setSignUpForm({ ...signUpForm, referralCode: e.target.value.toUpperCase() })}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Have a referral code? Enter it to earn bonus points for both you and your friend!
                </p>
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