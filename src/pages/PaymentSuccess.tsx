import React, { useEffect } from 'react';
import { CheckCircle, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan');
  const amount = searchParams.get('amount');
  const method = searchParams.get('method');
  
  useEffect(() => {
    if (method === 'cash') {
      toast.success(`${plan} plan selected! Please complete the cash payment as instructed.`);
    } else {
      toast.success('Payment successful! Your subscription has been activated.');
    }
  }, [method, plan]);

  const isCashPayment = method === 'cash';

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
                {isCashPayment ? 'Plan Selected!' : 'Payment Successful!'}
              </CardTitle>
              <CardDescription className="text-lg">
                {isCashPayment 
                  ? `You've selected the ${plan} plan (${amount}/month). Complete payment using instructions below.`
                  : 'Your subscription has been activated successfully'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {isCashPayment ? (
                <div className="bg-muted/50 p-6 rounded-lg text-left">
                  <h3 className="font-semibold mb-4 text-center">Cash Payment Options</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <MapPin className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium">Visit Our Office</p>
                        <p className="text-sm text-muted-foreground">
                          Neinus Private Ltd, Opposite To BIT College<br />
                          Sathy Athani Road Bus Stop, Sathyamangalam - 638503<br />
                          Erode Dt, TamilNadu<br />
                          <strong>Hours:</strong> Mon-Fri, 9:00 AM - 6:00 PM
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <Mail className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium">Bank Transfer</p>
                        <p className="text-sm text-muted-foreground">
                          <strong>Account:</strong> Your Company Name<br />
                          <strong>Account No:</strong> 1234567890<br />
                          <strong>IFSC:</strong> BANK0001234<br />
                          <strong>Reference:</strong> {plan}-{Date.now().toString().slice(-6)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <Phone className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium">Contact for Payment</p>
                        <p className="text-sm text-muted-foreground">
                          <strong>Phone:</strong> +91 7200864623, +91 9965618507<br />
                          <strong>WhatsApp:</strong> +91 7200864223<br />
                          <strong>Email:</strong> contactus@neinus.com
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-sm text-center">
                      <strong>Important:</strong> Your plan will be activated within 24 hours of payment confirmation.
                      Please mention your plan ({plan}) when making payment.
                    </p>
                  </div>
                </div>
              ) : (
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
              )}
              
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