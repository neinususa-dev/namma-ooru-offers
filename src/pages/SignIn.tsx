import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock } from 'lucide-react';
import { Header } from '@/components/Header';

export default function SignIn() {
  const { user, profile, signIn, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: ''
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(signInForm.email, signInForm.password);

    if (error) {
      toast({
        title: "Log in failed",
        description: error.message,
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
            <CardTitle className="text-2xl font-bold text-primary">Welcome Back</CardTitle>
            <CardDescription>
              Log in to your account
            </CardDescription>
          </CardHeader>

          <CardContent>
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
          </CardContent>

          <CardFooter className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline">
                Join now
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}