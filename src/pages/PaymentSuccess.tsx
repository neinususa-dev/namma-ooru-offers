import React, { useEffect } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export const PaymentSuccess: React.FC = () => {
  useEffect(() => {
    // Show success message
    toast.success('Payment successful! Your subscription has been activated.');
    
    // TODO: Here we would typically:
    // 1. Verify the payment with Stripe
    // 2. Update the user's subscription status in Supabase
    // 3. Refresh the user's profile data
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header showNavigation={false} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardHeader className="pb-6">
              <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-green-600">
                Payment Successful!
              </CardTitle>
              <CardDescription className="text-lg">
                Your subscription has been activated successfully
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-muted/50 p-6 rounded-lg text-left">
                <h3 className="font-semibold mb-4">What happens next?</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Your plan has been upgraded immediately</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>You can now post more offers based on your new plan</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Access to premium features is now available</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>You can manage your subscription anytime from your account</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Link to="/merchant-dashboard">
                  <Button size="lg" variant="default" className="w-full md:w-auto">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/merchant-post-offer">
                  <Button size="lg" variant="outline" className="w-full md:w-auto">
                    Post New Offer
                  </Button>
                </Link>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Need help? Contact our support team at support@yourapp.com</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};