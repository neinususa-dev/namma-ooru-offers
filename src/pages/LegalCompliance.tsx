import React from 'react';
import SEO from '@/components/SEO';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ScrollText, Users, Store, AlertTriangle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const LegalCompliance = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Legal Compliance & Information - Namma OOru Offers"
        description="Access all legal documents and compliance information for Namma OOru Offers marketplace platform including privacy policy, terms of service, and user agreements."
        keywords="legal compliance, privacy policy, terms conditions, user agreement, marketplace law, Tamil Nadu business compliance"
        url="https://namma-ooru-offers.com/legal"
        canonical="https://namma-ooru-offers.com/legal"
        type="website"
      />
      
      <Header showNavigation={true} />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Legal Information</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Access all legal documents and compliance information for using Namma OOru Offers.
            We are committed to transparency and legal compliance.
          </p>
        </div>

        {/* Legal Documents Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Privacy Policy */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Learn how we collect, use, and protect your personal information. 
                Understand your privacy rights and data protection measures.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Data collection and usage</li>
                <li>• Privacy rights and controls</li>
                <li>• Cookies and tracking</li>
                <li>• Data security measures</li>
                <li>• Contact information for privacy concerns</li>
              </ul>
              <Link to="/privacy-policy">
                <div className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium">
                  Read Privacy Policy
                  <ExternalLink className="h-4 w-4" />
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Terms & Conditions */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <ScrollText className="h-6 w-6 text-primary" />
                Terms & Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Understand the rules and guidelines for using our platform. 
                Know your rights and responsibilities as a user.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Platform usage rules</li>
                <li>• User responsibilities</li>
                <li>• Prohibited activities</li>
                <li>• Account termination policies</li>
                <li>• Dispute resolution process</li>
              </ul>
              <Link to="/terms-and-conditions">
                <div className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium">
                  Read Terms & Conditions
                  <ExternalLink className="h-4 w-4" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Role-specific Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Customer Information */}
          <Card className="border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="h-6 w-6 text-secondary" />
                Customer Legal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Important legal information for customers using our platform.
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Offer redemption terms and conditions</li>
                <li>• Customer rights and protections</li>
                <li>• Data usage for personalized recommendations</li>
                <li>• Loyalty program terms</li>
                <li>• Dispute resolution for customer issues</li>
              </ul>
            </CardContent>
          </Card>

          {/* Merchant Information */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Store className="h-6 w-6 text-primary" />
                Merchant Legal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Important legal information for merchants operating on our platform.
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Merchant agreement and responsibilities</li>
                <li>• Subscription terms and billing policies</li>
                <li>• Offer creation guidelines and restrictions</li>
                <li>• Business data usage and analytics</li>
                <li>• Commercial dispute resolution</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Notice */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-primary" />
              Legal Compliance Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Namma OOru Offers operates in full compliance with Indian laws and regulations, 
              including data protection, consumer rights, and e-commerce guidelines.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Regulatory Compliance</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Information Technology Act, 2000</li>
                  <li>• Consumer Protection Act, 2019</li>
                  <li>• Digital Personal Data Protection Act, 2023</li>
                  <li>• Tamil Nadu state regulations</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Business Standards</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Fair trading practices</li>
                  <li>• Transparent pricing policies</li>
                  <li>• Secure payment processing</li>
                  <li>• Ethical business conduct</li>
                </ul>
              </div>
            </div>

            <div className="bg-background p-4 rounded-lg mt-6">
              <p className="text-sm text-muted-foreground">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                We regularly review and update our legal documents to ensure compliance with 
                current laws and best practices. Users will be notified of significant changes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold mb-4">Questions About Legal Matters?</h2>
          <p className="text-muted-foreground mb-6">
            If you have any questions about our legal documents or compliance policies, 
            please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:legal@namma-ooru-offers.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Legal Department
              <ExternalLink className="h-4 w-4" />
            </a>
            <a 
              href="mailto:privacy@namma-ooru-offers.com"
              className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
            >
              Privacy Officer
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LegalCompliance;