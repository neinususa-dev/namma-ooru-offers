import { useState, useEffect } from 'react';
import SEO from '@/components/SEO';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, KeyRound } from 'lucide-react';
import { Header } from '@/components/Header';
import { DisabledUserMessage } from '@/components/DisabledUserMessage';
import { supabase } from '@/integrations/supabase/client';

export default function SignIn() {
  const { user, profile, signIn, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isPasswordResetMode, setIsPasswordResetMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAccountDisabled, setIsAccountDisabled] = useState(false);
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: ''
  });

  // SEO structured data for Sign In page
  const signInPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Sign In to Namma OOru Offers",
    "description": "Sign in to your Namma OOru Offers account to access exclusive local deals and manage your preferences",
    "url": "https://namma-ooru-offers.com/signin"
  };

  // Redirect authenticated users (but not during password reset)
  useEffect(() => {
    if (user && profile && !loading && !isPasswordResetMode) {
      if (profile.role === 'merchant') {
        navigate('/merchant-post-offer');
      } else {
        navigate('/');
      }
    }
  }, [user, profile, loading, navigate, isPasswordResetMode]);

  // Check for password reset flow
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isReset = urlParams.get('reset');
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    const type = urlParams.get('type');
    
    console.log('URL parameters:', { isReset, accessToken: !!accessToken, refreshToken: !!refreshToken, type });
    
    if (type === 'recovery' || (accessToken && refreshToken)) {
      console.log('Setting up password recovery session...');
      setIsPasswordResetMode(true);
      
      // Set the session with the tokens from the URL
      if (accessToken && refreshToken) {
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        }).then(({ data, error }) => {
          if (error) {
            console.error('Error setting session:', error);
            toast({
              title: "Session error",
              description: "There was an error setting up your password reset session. Please try the reset process again.",
              variant: "destructive",
            });
            setIsPasswordResetMode(false);
          } else {
            console.log('Session set successfully:', data);
            toast({
              title: "Ready to reset",
              description: "You can now set your new password below.",
              variant: "default",
            });
          }
        });
      }
    } else if (isReset === 'true') {
      // Fallback for manual reset mode
      setIsPasswordResetMode(true);
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsAccountDisabled(false);

    const { error } = await signIn(signInForm.email, signInForm.password);

    if (error) {
      if (error.message === 'ACCOUNT_DISABLED') {
        setIsAccountDisabled(true);
      } else {
        toast({
          title: "Log in failed",
          description: error.message,
          variant: "destructive",
        });
      }
    }
    setIsLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsResetLoading(true);

    try {
      console.log('Starting password reset request...');
      // Call our custom password reset function
      const { data, error } = await supabase.functions.invoke('send-password-reset', {
        body: {
          email: resetEmail,
          redirectUrl: `${window.location.origin}/signin?reset=true`,
        },
      });

      console.log('Function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (data?.error) {
        console.error('Function returned error:', data.error);
        throw new Error(data.error);
      }

      console.log('Password reset request successful:', data);
      toast({
        title: "Reset email sent",
        description: "Check your email for password reset instructions from Namma Ooru Offers (onboarding@resend.dev)",
        variant: "default",
      });
      setResetDialogOpen(false);
      setResetEmail('');
    } catch (error: any) {
      console.error('Password reset error:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        context: error.context
      });
      toast({
        title: "Reset failed",
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsResetLoading(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingPassword(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      toast({
        title: "Password update failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password updated successfully",
        description: "You can now log in with your new password",
        variant: "default",
      });
      setIsPasswordResetMode(false);
      setNewPassword('');
      setConfirmPassword('');
      // Remove reset parameter from URL
      window.history.replaceState({}, document.title, "/signin");
    }
    setIsUpdatingPassword(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sunset-gradient flex items-center justify-center">
        <div className="text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title="Sign In to Your Account | Namma OOru Offers"
        description="Sign in to your Namma OOru Offers account to access exclusive local deals from Tamil Nadu merchants and manage your saved offers."
        keywords="sign in Namma OOru Offers, login Tamil Nadu deals, local offers account, merchant login, customer login"
        structuredData={signInPageStructuredData}
        url="https://namma-ooru-offers.com/signin"
        canonical="https://namma-ooru-offers.com/signin"
        type="website"
      />
      <Header showNavigation={false} />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              {isPasswordResetMode ? 'Set New Password' : 'Welcome Back'}
            </CardTitle>
            <CardDescription>
              {isPasswordResetMode ? 'Enter your new password below' : 'Log in to your account'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isAccountDisabled && <DisabledUserMessage />}
            
            {isPasswordResetMode ? (
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter new password"
                      className="pl-10"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm new password"
                      className="pl-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary-gradient hover:opacity-90"
                  disabled={isUpdatingPassword}
                >
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </Button>

                <Button 
                  type="button" 
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsPasswordResetMode(false);
                    window.history.replaceState({}, document.title, "/signin");
                  }}
                >
                  Back to Sign In
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={signInForm.email}
                      onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                      value={signInForm.password}
                      onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary-gradient hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging In...' : 'Log In'}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 text-center">
            {!isPasswordResetMode && (
              <>
                <div className="flex items-center justify-between w-full text-sm">
                  <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="text-primary hover:underline p-0 h-auto">
                        Forgot Password?
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <KeyRound className="h-5 w-5 text-primary" />
                          Reset Password
                        </DialogTitle>
                        <DialogDescription>
                          Enter your email address and we'll send you a link to reset your password.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handlePasswordReset} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="reset-email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="reset-email"
                              type="email"
                              placeholder="Enter your email"
                              className="pl-10"
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => setResetDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            className="flex-1 bg-primary-gradient hover:opacity-90"
                            disabled={isResetLoading}
                          >
                            {isResetLoading ? 'Sending...' : 'Send Reset Link'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  
                  <Link to="/signup" className="text-primary hover:underline">
                    Create Account
                  </Link>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-primary hover:underline">
                    Join now
                  </Link>
                </p>
              </>
            )}
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}