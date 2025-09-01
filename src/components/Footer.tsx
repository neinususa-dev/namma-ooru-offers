import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Shield,
  ScrollText,
  Users,
  Store,
  Heart
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Footer = () => {
  const { profile } = useAuth();
  const isMerchant = profile?.role === 'merchant';

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-foreground">Quick Links</h4>
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              {isMerchant ? (
                <>
                  <Link to="/merchant-dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Store className="h-4 w-4 inline mr-2" />
                    Merchant Dashboard
                  </Link>
                  <Link to="/merchant-post-offer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Post Offers
                  </Link>
                  <Link to="/billing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Billing & Plans
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/rewards" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Users className="h-4 w-4 inline mr-2" />
                    Rewards Center
                  </Link>
                  <Link to="/your-offers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Your Offers
                  </Link>
                  <Link to="/signup?tab=merchant" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Become a Merchant
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Legal & Support */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-foreground">Legal & Support</h4>
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/privacy-policy" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Privacy Policy
              </Link>
              <Link 
                to="/terms-and-conditions" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                <ScrollText className="h-4 w-4" />
                Terms & Conditions
              </Link>
              <a 
                href="mailto:support@namma-ooru-offers.com" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Customer Support
              </a>
              <a 
                href="mailto:help@namma-ooru-offers.com" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Help Center
              </a>
              {isMerchant && (
                <a 
                  href="mailto:merchant-support@namma-ooru-offers.com" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Merchant Support
                </a>
              )}
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-foreground">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p>Neinus Private Ltd, Sathyamangalam</p>
                  <p>Tamil Nadu, India</p>
                  <p>PIN: 638503</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <a 
                  href="tel:+917200864223" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  +91-7200864223
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a 
                  href="mailto:contactus@nammaooruoffers.com" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  contactus@nammaooruoffers.com
                </a>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-foreground">Business Hours</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 10:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
              <p className="text-primary font-medium">IST (Indian Standard Time)</p>
            </div>
          </div>
        </div>

        {/* Role-specific Information */}
        {profile && (
          <div className="border-t border-border pt-8 mb-8">
            <div className="bg-primary/5 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                {isMerchant ? (
                  <Store className="h-8 w-8 text-primary" />
                ) : (
                  <Users className="h-8 w-8 text-primary" />
                )}
                <div>
                  <h3 className="text-lg font-semibold">
                    {isMerchant ? 'Merchant Resources' : 'Customer Benefits'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isMerchant 
                      ? 'Grow your business with our platform tools and support'
                      : 'Discover amazing deals and earn rewards with every purchase'
                    }
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {isMerchant ? (
                  <>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Platform Features</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Flexible subscription plans</li>
                        <li>• Customer analytics dashboard</li>
                        <li>• Marketing support & tools</li>
                        <li>• 24/7 merchant support</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Business Growth</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Reach more local customers</li>
                        <li>• Track offer performance</li>
                        <li>• Build customer relationships</li>
                        <li>• Increase sales & visibility</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Support Services</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Business consultation</li>
                        <li>• Technical assistance</li>
                        <li>• Marketing guidance</li>
                        <li>• Performance optimization</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Save More</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Exclusive local deals</li>
                        <li>• Daily hot offers</li>
                        <li>• Personalized recommendations</li>
                        <li>• Early access to promotions</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Earn Rewards</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Points for every redemption</li>
                        <li>• Loyalty program benefits</li>
                        <li>• Special member discounts</li>
                        <li>• Birthday & anniversary offers</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Local Support</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Support Tamil Nadu businesses</li>
                        <li>• Discover new local shops</li>
                        <li>• Community-focused platform</li>
                        <li>• Regional customer service</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Footer */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Company Information in Copyright Section */}
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/3c633683-8c9d-4ff2-ace7-6658272f2afd.png" 
                alt="Namma Ooru Offers Logo" 
                className="w-8 h-8 rounded"
              />
              <div className="text-center md:text-left">
                <div className="text-sm font-bold bg-blue-orange-gradient bg-clip-text text-transparent">
                  Namma Ooru Offers
                </div>
                <div className="text-xs text-muted-foreground">Your Local Savings Hub</div>
                <div className="text-xs text-muted-foreground">
                  A Product of <a href="https://neinus.com" target="_blank" className="text-primary hover:underline">Neinus Private Limited</a>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  © {new Date().getFullYear()} Namma Ooru Offers. All rights reserved.
                </p>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6">
              <Link 
                to="/privacy-policy" 
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy
              </Link>
              <Link 
                to="/terms-and-conditions" 
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Terms
              </Link>
              <a 
                href="mailto:legal@namma-ooru-offers.com" 
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Legal
              </a>
            </div>

            {/* Regional Badge */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 text-primary" />
              <span>Tamil Nadu, India</span>
            </div>
          </div>

          {/* Compliance Notice */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                This platform operates in compliance with Indian data protection laws and regulations. 
                {isMerchant 
                  ? ' Business partners must comply with all applicable commercial laws and regulations.'
                  : ' Your privacy and data security are our top priorities.'
                }
              </p>
              <div className="mt-3">
                <a 
                  href="https://neinus.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  Developed with <Heart className="h-3 w-3 text-red-500 fill-current" /> Neinus Technologies
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;