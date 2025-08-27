import React, { useState } from 'react';
import { Crown, Star, Zap, Check, CreditCard, Smartphone, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const pricingTiers = [
  {
    name: 'Silver',
    price: '₹0',
    period: '/mo',
    maxOffers: 2,
    features: [
      'Up to 2 offers per month',
      'Basic offer listing',
      'Standard support'
    ],
    icon: Star,
    variant: 'outline' as const,
    popular: false,
    razorpayPlanId: null // Free plan
  },
  {
    name: 'Gold',
    price: '₹500',
    period: '/mo',
    maxOffers: 10,
    features: [
      'Up to 10 offers per month',
      'Priority listing',
      'Analytics dashboard',
      'Email support'
    ],
    icon: Crown,
    variant: 'secondary' as const,
    popular: true,
    razorpayPlanId: 'plan_gold_500' // Will be replaced with actual Razorpay plan ID
  },
  {
    name: 'Platinum',
    price: '₹1500',
    period: '/mo',
    maxOffers: 40,
    features: [
      'Up to 40 offers per month',
      'Premium placement',
      'Advanced analytics',
      'Priority support',
      'Custom branding'
    ],
    icon: Zap,
    variant: 'default' as const,
    popular: false,
    razorpayPlanId: 'plan_platinum_1500' // Will be replaced with actual Razorpay plan ID
  }
];

const paymentMethods = [
  {
    id: 'cash',
    name: 'Cash Payment',
    description: 'Pay directly at our office or via bank transfer',
    icon: Building2
  },
  {
    id: 'card',
    name: 'Credit/Debit Card (Coming Soon)',
    description: 'Visa, Mastercard, RuPay',
    icon: CreditCard,
    disabled: true
  },
  {
    id: 'upi',
    name: 'UPI (Coming Soon)',
    description: 'Google Pay, PhonePe, Paytm',
    icon: Smartphone,
    disabled: true
  }
];

export const Billing: React.FC = () => {
  const { user, profile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentTier = profile?.current_plan || 'Silver';

  const handlePlanSelection = (planName: string, razorpayPlanId: string | null) => {
    if (!user) {
      toast.error('Please sign in to upgrade your plan');
      return;
    }

    if (planName === 'Silver') {
      toast.info('You are already on the free Silver plan');
      return;
    }

    if (planName === currentTier) {
      toast.info(`You are already on the ${planName} plan`);
      return;
    }

    setSelectedPlan(planName);
  };

  const handleUpgrade = async () => {
    if (!selectedPlan || !user) return;

    setIsProcessing(true);
    
    try {
      const selectedTier = pricingTiers.find(t => t.name === selectedPlan);
      
      if (!selectedTier) {
        toast.error('Selected plan not found');
        return;
      }

      // Save plan details to user profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          current_plan: selectedPlan,
          plan_amount: parseFloat(selectedTier.price.replace('₹', '').replace(',', '')),
          plan_selected_at: new Date().toISOString(),
          payment_method: 'cash',
          plan_status: 'pending'
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }
      
      // Show cash payment instructions
      toast.success(`${selectedPlan} plan selected! Plan details saved to your profile.`);
      
      // Redirect to success page with payment instructions
      setTimeout(() => {
        window.location.href = `/payment-success?plan=${selectedPlan}&amount=${selectedTier?.price}&method=cash`;
      }, 2000);
      
    } catch (error) {
      toast.error('Failed to process request. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showNavigation={false} />
      
      {/* Hero Section */}
      <section className="bg-primary-gradient text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl mb-6 text-primary-foreground/80">
              Upgrade to unlock more features and grow your business
            </p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Current Plan: {currentTier}
            </Badge>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {pricingTiers.map((tier) => {
            const IconComponent = tier.icon;
            const isCurrentTier = tier.name === currentTier;
            const isSelected = selectedPlan === tier.name;
            
            return (
              <Card 
                key={tier.name} 
                className={`relative overflow-hidden cursor-pointer transition-all duration-200 ${
                  tier.popular ? 'border-primary shadow-xl scale-105' : 'border-border'
                } ${isCurrentTier ? 'bg-primary/5 border-primary' : ''} ${
                  isSelected ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                onClick={() => handlePlanSelection(tier.name, tier.razorpayPlanId)}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                {isCurrentTier && (
                  <div className="absolute top-0 left-0 bg-trending text-trending-foreground px-3 py-1 text-sm font-semibold">
                    Current Plan
                  </div>
                )}

                <CardHeader className="text-center pb-6">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-primary">{tier.price}</span>
                    <span className="text-muted-foreground">{tier.period}</span>
                  </div>
                  <CardDescription className="text-lg">
                    Up to {tier.maxOffers} offers per month
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={isCurrentTier ? "outline" : isSelected ? "default" : tier.variant}
                    disabled={isCurrentTier}
                  >
                    {isCurrentTier ? 'Current Plan' : isSelected ? 'Selected' : `Select ${tier.name}`}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Payment Methods */}
        {selectedPlan && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Upgrade to {selectedPlan}
              </CardTitle>
              <CardDescription className="text-center">
                Select your preferred payment method for India
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-lg">Supported Payment Methods</h3>
                <div className="grid gap-4">
                  {paymentMethods.map((method) => {
                    const IconComponent = method.icon;
                    return (
                      <div key={method.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <IconComponent className="h-8 w-8 text-primary" />
                        <div>
                          <div className="font-semibold">{method.name}</div>
                          <div className="text-sm text-muted-foreground">{method.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-2">Order Summary</h4>
                <div className="flex justify-between items-center">
                  <span>{selectedPlan} Plan (Monthly)</span>
                  <span className="font-bold">
                    {pricingTiers.find(t => t.name === selectedPlan)?.price}/month
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Secure payment powered by Razorpay • Cancel anytime
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button 
                onClick={handleUpgrade}
                disabled={isProcessing || !user}
                className="w-full"
                size="lg"
              >
                {isProcessing ? 'Processing...' : `Upgrade to ${selectedPlan}`}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Security Notice */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>🔒 All payments are securely processed with bank-level encryption</p>
          <p>💳 We support all major Indian payment methods including UPI, cards, and net banking</p>
        </div>
      </div>
    </div>
  );
};