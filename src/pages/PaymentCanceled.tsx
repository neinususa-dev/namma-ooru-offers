import React from 'react';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Link } from 'react-router-dom';

export const PaymentCanceled: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header showNavigation={false} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardHeader className="pb-6">
              <div className="mx-auto mb-4 p-4 bg-red-100 rounded-full w-fit">
                <XCircle className="h-16 w-16 text-red-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-red-600">
                Payment Canceled
              </CardTitle>
              <CardDescription className="text-lg">
                Your payment was canceled. No charges were made.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-muted/50 p-6 rounded-lg text-left">
                <h3 className="font-semibold mb-4">What happened?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The payment process was interrupted or canceled. This could be due to:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• You clicked the back button during payment</li>
                  <li>• Payment method was declined</li>
                  <li>• Session timeout</li>
                  <li>• Network connectivity issues</li>
                </ul>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Link to="/billing">
                  <Button size="lg" variant="default" className="w-full md:w-auto">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                </Link>
                <Link to="/">
                  <Button size="lg" variant="outline" className="w-full md:w-auto">
                    Back to Home
                  </Button>
                </Link>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Having trouble? Contact our support team at support@yourapp.com</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};