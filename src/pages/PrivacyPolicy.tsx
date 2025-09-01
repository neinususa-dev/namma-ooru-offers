import React from 'react';
import SEO from '@/components/SEO';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, Store, Lock, Eye, Database, Mail, Phone } from 'lucide-react';

const PrivacyPolicy = () => {
  const { user, profile } = useAuth();
  const isMerchant = profile?.role === 'merchant';

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Privacy Policy - Namma OOru Offers | Data Protection & Privacy Rights"
        description="Learn how Namma OOru Offers protects your personal information and privacy. Our comprehensive privacy policy explains data collection, usage, and your rights."
        keywords="privacy policy, data protection, personal information, GDPR compliance, Tamil Nadu marketplace privacy"
        url="https://namma-ooru-offers.com/privacy-policy"
        canonical="https://namma-ooru-offers.com/privacy-policy"
        type="website"
      />
      
      <Header showNavigation={true} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information on Namma OOru Offers.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Role-based Banner */}
        {user && (
          <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                {isMerchant ? (
                  <Store className="h-8 w-8 text-primary" />
                ) : (
                  <Users className="h-8 w-8 text-primary" />
                )}
                <div>
                  <h2 className="text-xl font-semibold">
                    {isMerchant ? 'Merchant Privacy Rights' : 'Customer Privacy Rights'}
                  </h2>
                  <p className="text-muted-foreground">
                    {isMerchant 
                      ? 'Special provisions for business partners and merchants on our platform'
                      : 'Your rights as a valued customer of Namma OOru Offers'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-8">
          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Database className="h-6 w-6 text-primary" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Name, email address, and phone number</li>
                <li>Profile information and preferences</li>
                <li>Location data (district and city in Tamil Nadu)</li>
                {isMerchant && (
                  <>
                    <li><strong>Merchant-specific:</strong> Business name, store details, and commercial information</li>
                    <li><strong>Merchant-specific:</strong> Tax information and payment details for transactions</li>
                    <li><strong>Merchant-specific:</strong> Business licenses and verification documents</li>
                  </>
                )}
                {!isMerchant && (
                  <>
                    <li><strong>Customer-specific:</strong> Shopping preferences and saved offers</li>
                    <li><strong>Customer-specific:</strong> Redemption history and reward points</li>
                  </>
                )}
              </ul>

              <h3 className="text-lg font-semibold mb-4">Usage Information</h3>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Device information and browser type</li>
                <li>IP address and approximate location</li>
                <li>Usage patterns and interaction data</li>
                <li>Cookies and similar tracking technologies</li>
                {isMerchant && (
                  <>
                    <li><strong>Merchant-specific:</strong> Offer performance analytics and customer engagement metrics</li>
                    <li><strong>Merchant-specific:</strong> Dashboard usage and feature utilization data</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Eye className="h-6 w-6 text-primary" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h3 className="text-lg font-semibold mb-4">Service Provision</h3>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Provide and maintain the Namma OOru Offers platform</li>
                <li>Process transactions and manage your account</li>
                <li>Send important service-related communications</li>
                {isMerchant ? (
                  <>
                    <li><strong>For Merchants:</strong> Enable offer creation and management</li>
                    <li><strong>For Merchants:</strong> Provide analytics and business insights</li>
                    <li><strong>For Merchants:</strong> Facilitate customer connections and transactions</li>
                    <li><strong>For Merchants:</strong> Process subscription payments and billing</li>
                  </>
                ) : (
                  <>
                    <li><strong>For Customers:</strong> Show relevant local offers and deals</li>
                    <li><strong>For Customers:</strong> Manage saved offers and redemptions</li>
                    <li><strong>For Customers:</strong> Provide personalized recommendations</li>
                    <li><strong>For Customers:</strong> Award and track loyalty points</li>
                  </>
                )}
              </ul>

              <h3 className="text-lg font-semibold mb-4">Communication</h3>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Send promotional content (with your consent)</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Notify you about changes to our services</li>
                {isMerchant && (
                  <>
                    <li><strong>Merchant Communications:</strong> Business notifications and platform updates</li>
                    <li><strong>Merchant Communications:</strong> Customer inquiry forwarding and management</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                Information Sharing & Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h3 className="text-lg font-semibold mb-4">We Do Not Sell Personal Data</h3>
              <p className="mb-6">
                Namma OOru Offers does not sell, rent, or trade your personal information to third parties for marketing purposes.
              </p>

              <h3 className="text-lg font-semibold mb-4">Limited Sharing Situations</h3>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
                <li>With trusted service providers (under strict data protection agreements)</li>
                {isMerchant ? (
                  <>
                    <li><strong>Merchant Data Sharing:</strong> Customer contact information for completed transactions (with customer consent)</li>
                    <li><strong>Merchant Data Sharing:</strong> Anonymized business analytics for platform improvement</li>
                  </>
                ) : (
                  <>
                    <li><strong>Customer Data Sharing:</strong> Basic contact information with merchants for offer redemptions</li>
                    <li><strong>Customer Data Sharing:</strong> Aggregated usage patterns for merchant insights (anonymized)</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Lock className="h-6 w-6 text-primary" />
                Data Security & Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Industry-standard encryption for data transmission and storage</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Secure authentication systems and access controls</li>
                <li>Regular backups and disaster recovery procedures</li>
                <li>Staff training on data protection and privacy practices</li>
                {isMerchant && (
                  <>
                    <li><strong>Merchant Security:</strong> Enhanced protection for business and financial data</li>
                    <li><strong>Merchant Security:</strong> Secure payment processing and transaction handling</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                Your Privacy Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h3 className="text-lg font-semibold mb-4">Under Indian Privacy Laws</h3>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li><strong>Access:</strong> Request copies of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal requirements)</li>
                <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
                <li><strong>Objection:</strong> Object to certain types of processing</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for marketing communications</li>
                {isMerchant && (
                  <>
                    <li><strong>Merchant Rights:</strong> Request business data exports for your records</li>
                    <li><strong>Merchant Rights:</strong> Control sharing of business insights and analytics</li>
                  </>
                )}
              </ul>

              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="font-semibold mb-2">Exercise Your Rights</p>
                <p>To exercise any of these rights, contact us at:</p>
                <ul className="list-none mt-2 space-y-1">
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>contactus@nammaooruoffers.com</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>+91-7200864223</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Cookies and Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="mb-4">
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                <li><strong>Performance Cookies:</strong> Help us understand usage patterns and improve services</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Marketing Cookies:</strong> Show relevant offers and measure campaign effectiveness (with consent)</li>
              </ul>
              <p>
                You can manage cookie preferences through your browser settings or our cookie consent banner.
              </p>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Namma OOru Offers is not intended for children under 18 years of age. We do not knowingly collect 
                personal information from children under 18. If you are under 18, please do not provide any 
                information on our platform. If we learn we have collected personal information from a child 
                under 18, we will delete that information immediately.
              </p>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card>
            <CardHeader>
              <CardTitle>Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Your personal information is primarily stored and processed within India. If we need to transfer 
                data internationally for service provision, we ensure appropriate safeguards are in place to 
                protect your information in accordance with Indian data protection laws.
              </p>
            </CardContent>
          </Card>

          {/* Updates to Privacy Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4 mb-6">
                <li>Posting the new Privacy Policy on this page</li>
                <li>Updating the "Last updated" date</li>
                <li>Sending email notifications for significant changes</li>
                <li>Displaying prominent notices on our platform</li>
              </ul>
              <p>
                Your continued use of Namma OOru Offers after any changes indicates your acceptance of the updated Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle>Contact Us About Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Privacy Officer</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>contactus@nammaooruoffers.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>+91-7200864223</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Business Address</h4>
                  <address className="not-italic text-muted-foreground">
                    Namma Ooru Offers, Product of<br />
                    Neinus Private Ltd, Sathyamangalam<br />
                    Tamil Nadu, India<br />
                    PIN: 638503
                  </address>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Response Time:</strong> We will respond to privacy-related inquiries within 30 days as required by Indian data protection regulations.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;