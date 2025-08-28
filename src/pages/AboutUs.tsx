import React from 'react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  TrendingUp, 
  DollarSign, 
  Smartphone, 
  Shield, 
  BarChart3, 
  Handshake,
  ShoppingBag,
  MapPin,
  Users,
  Target,
  Search
} from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="bg-blue-orange-gradient bg-clip-text text-transparent">
                Welcome to Namma Ooru Offers!!
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Namma Ooru Offers – Local Deals, Big Savings! At Namma Ooru Offers, we bring your favorite local shops and the best deals together in one easy-to-use platform. Whether you're a customer looking for a great bargain or a vendor wanting to reach more people, we've got you covered! We believe in supporting local businesses while helping customers save more on their everyday shopping. Our vendors offer quality products at discounted prices, and our users enjoy awesome offers they won't find anywhere else.
            </p>
          </div>
        </section>

        {/* For Customers Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Shop with Namma Ooru Offers?</h2>
              <p className="text-xl text-primary font-semibold mb-2">For Customers: Great Products. Better Prices. Local Convenience.</p>
              <p className="text-lg text-muted-foreground">We make sure shopping is smart, simple, and satisfying.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-card p-6 rounded-lg border border-primary/10 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold">Unbeatable Local Deals</h3>
                </div>
                <p className="text-muted-foreground">Access offers and discounts you won't find in-store.</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border border-primary/10 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <ShoppingBag className="h-8 w-8 text-secondary" />
                  <h3 className="text-xl font-bold">Wide Range of Products</h3>
                </div>
                <p className="text-muted-foreground">Groceries, fashion, electronics, home needs – all in one place.</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border border-primary/10 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-8 w-8 text-accent" />
                  <h3 className="text-xl font-bold">Trusted Local Vendors</h3>
                </div>
                <p className="text-muted-foreground">Shop with confidence from verified sellers in your city.</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border border-primary/10 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <Search className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold">Easy Browsing</h3>
                </div>
                <p className="text-muted-foreground">Filter by category, deal, or vendor to find what you want in seconds.</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border border-primary/10 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <Handshake className="h-8 w-8 text-secondary" />
                  <h3 className="text-xl font-bold">Support Local Businesses</h3>
                </div>
                <p className="text-muted-foreground">Every purchase supports entrepreneurs in your own community.</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-lg text-muted-foreground">Whether you're stocking up on daily essentials or hunting for a festival deal, we help you save time and money.</p>
            </div>
          </div>
        </section>

        {/* For Vendors Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Sell on Namma Ooru Offers?</h2>
              <p className="text-xl text-primary font-semibold mb-2">For Vendors: More Reach. More Sales. Less Hassle.</p>
              <p className="text-lg text-muted-foreground">We make it easy for local vendors to grow their business online – without needing a big budget or complex tools.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-card p-6 rounded-lg border border-primary/10 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold">Boost Your Visibility</h3>
                </div>
                <p className="text-muted-foreground">Reach thousands of local customers looking for great deals.</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border border-primary/10 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="h-8 w-8 text-secondary" />
                  <h3 className="text-xl font-bold">Attract More Buyers</h3>
                </div>
                <p className="text-muted-foreground">Post your discounts, combo offers, or seasonal deals to stand out.</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border border-primary/10 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <Smartphone className="h-8 w-8 text-accent" />
                  <h3 className="text-xl font-bold">Easy Product Listings</h3>
                </div>
                <p className="text-muted-foreground">Add products, prices, and offers with a few simple clicks.</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border border-primary/10 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold">No Big Investment Needed</h3>
                </div>
                <p className="text-muted-foreground">A cost-effective way to take your business online.</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border border-primary/10 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="h-8 w-8 text-secondary" />
                  <h3 className="text-xl font-bold">Track Your Performance</h3>
                </div>
                <p className="text-muted-foreground">View orders, customer interest, and insights in real-time.</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border border-primary/10 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-8 w-8 text-accent" />
                  <h3 className="text-xl font-bold">Local Brand Building</h3>
                </div>
                <p className="text-muted-foreground">Strengthen your brand within your own community.</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-lg text-muted-foreground">Whether you're running a small store or a growing business, Namma Ooru Offers helps you scale up smartly, digitally, and affordably.</p>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-8">Why Choose Us?</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="text-center bg-card p-6 rounded-lg border border-primary/10 shadow-md">
                <ShoppingBag className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Shop Smart</h3>
                <p className="text-muted-foreground">Find great deals from local sellers all in one place.</p>
              </div>
              
              <div className="text-center bg-card p-6 rounded-lg border border-primary/10 shadow-md">
                <DollarSign className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Save More</h3>
                <p className="text-muted-foreground">Better prices, exclusive offers, and daily discounts.</p>
              </div>
              
              <div className="text-center bg-card p-6 rounded-lg border border-primary/10 shadow-md">
                <Handshake className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Sell with Ease</h3>
                <p className="text-muted-foreground">Vendors can showcase their products and attract more customers.</p>
              </div>
              
              <div className="text-center bg-card p-6 rounded-lg border border-primary/10 shadow-md">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Discover More</h3>
                <p className="text-muted-foreground">Explore top-rated products, trending deals, and must-have items curated just for you.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Join Our Community Section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Join Our Community</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto mb-8">
              Namma Ooru Offers is more than just a platform – it's a local movement to support businesses and help shoppers make smarter choices. If you're a vendor, list your products today. If you're a customer, start exploring amazing deals around you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link to="/signup">
                <Button size="lg" className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Join as Customer
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="secondary" size="lg" className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Become a Merchant
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-lg font-semibold text-primary">
              <MapPin className="h-5 w-5" />
              <span>Proudly local. Proudly smart.</span>
            </div>
            <p className="text-xl font-bold mt-4">
              <span className="bg-blue-orange-gradient bg-clip-text text-transparent">
                Welcome to Namma Ooru Offers – where every deal feels personal!
              </span>
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card border-t py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src="/lovable-uploads/3c633683-8c9d-4ff2-ace7-6658272f2afd.png" 
                  alt="Namma Ooru Offers Logo" 
                  className="w-8 h-8 rounded"
                />
                <div>
                  <div className="font-bold bg-blue-orange-gradient bg-clip-text text-transparent">
                    Namma Ooru Offers
                  </div>
                  <div className="text-xs text-muted-foreground">Your Local Savings Hub</div>
                  <div className="text-xs text-muted-foreground">
                    A Product of <a href="https://neinus.com" target="_blank" className="text-primary hover:underline">Neinus Private Limited</a>
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground text-center md:text-right">
                <p>© 2024 Namma Ooru Offers. Supporting local businesses across Tamil Nadu.</p>
                <p className="mt-1">Made with ❤️ for Tamil Nadu</p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AboutUs;