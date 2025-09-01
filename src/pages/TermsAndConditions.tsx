import React from 'react';
import SEO from '@/components/SEO';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollText, Users, Store, AlertTriangle, CreditCard, Scale, Shield, Mail, Phone } from 'lucide-react';

const TermsAndConditions = () => {
  const { user, profile } = useAuth();
  const isMerchant = profile?.role === 'merchant';

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Terms & Conditions - Namma OOru Offers | Platform Rules & Policies"
        description="Read the Terms and Conditions for using Namma OOru Offers marketplace platform. Understand your rights and responsibilities as a customer or merchant."
        keywords="terms and conditions, user agreement, platform rules, marketplace policy, Tamil Nadu business terms"
        url="https://namma-ooru-offers.com/terms-and-conditions"
        canonical="https://namma-ooru-offers.com/terms-and-conditions"
        type="website"
      />
      
      <Header showNavigation={true} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <ScrollText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Please read these Terms and Conditions carefully before using Namma OOru Offers. 
            By accessing our platform, you agree to be bound by these terms.
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
                    {isMerchant ? 'Merchant Terms & Obligations' : 'Customer Terms & Rights'}
                  </h2>
                  <p className="text-muted-foreground">
                    {isMerchant 
                      ? 'Special terms and conditions for business partners operating on our platform'
                      : 'Your rights and responsibilities as a valued customer of Namma OOru Offers'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-8">
          {/* Acceptance of Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Scale className="h-6 w-6 text-primary" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="mb-4">
                By accessing and using Namma OOru Offers ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>These terms apply to all visitors, users, and others who access the service</li>
                <li>If you disagree with any part of these terms, you may not access the service</li>
                <li>Your continued use of the platform constitutes acceptance of any updates to these terms</li>
                {isMerchant && (
                  <li><strong>Merchants:</strong> Additional commercial terms apply as outlined in your merchant agreement</li>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Platform Description */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Description & Services</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="mb-4">
                Namma OOru Offers is a digital marketplace connecting local businesses in Tamil Nadu with customers seeking deals and offers.
              </p>
              
              <h3 className="text-lg font-semibold mb-4">For Customers</h3>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Browse and search local offers and deals</li>
                <li>Save offers for future use</li>
                <li>Redeem offers at participating merchant locations</li>
                <li>Earn and use loyalty points and rewards</li>
                <li>Receive personalized recommendations</li>
              </ul>

              {isMerchant && (
                <>
                  <h3 className="text-lg font-semibold mb-4">For Merchants</h3>
                  <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>Create and manage business offers and promotions</li>
                    <li>Access customer analytics and insights</li>
                    <li>Manage customer redemptions and interactions</li>
                    <li>Choose from flexible subscription plans (Silver, Gold, Platinum)</li>
                    <li>Receive marketing and business growth support</li>
                  </ul>
                </>
              )}
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                User Accounts & Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h3 className="text-lg font-semibold mb-4">Account Creation</h3>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>You must provide accurate, current, and complete information</li>
                <li>You are responsible for maintaining the security of your account</li>
                <li>You must immediately notify us of any unauthorized use of your account</li>
                <li>One person or entity may not maintain more than one account</li>
                {isMerchant && (
                  <>
                    <li><strong>Merchant Verification:</strong> Business accounts require verification of business credentials</li>
                    <li><strong>Merchant Verification:</strong> You must provide valid business licenses and tax information</li>
                  </>
                )}
              </ul>

              <h3 className="text-lg font-semibold mb-4">Account Responsibilities</h3>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Keep your login credentials secure and confidential</li>
                <li>Update your account information when changes occur</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Use the platform in good faith and for legitimate purposes</li>
                {!isMerchant && (
                  <>
                    <li><strong>Customer Responsibility:</strong> Use offers only as intended by merchants</li>
                    <li><strong>Customer Responsibility:</strong> Provide accurate information when redeeming offers</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Prohibited Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                Prohibited Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="mb-4 font-semibold text-destructive">
                The following activities are strictly prohibited on our platform:
              </p>
              
              <h3 className="text-lg font-semibold mb-4">General Prohibitions</h3>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Violating any laws or regulations</li>
                <li>Infringing on intellectual property rights</li>
                <li>Posting false, misleading, or fraudulent content</li>
                <li>Harassing, threatening, or abusing other users</li>
                <li>Attempting to hack or compromise platform security</li>
                <li>Using automated scripts or bots</li>
                <li>Circumventing any restrictions or limitations</li>
              </ul>

              {isMerchant ? (
                <>
                  <h3 className="text-lg font-semibold mb-4">Merchant-Specific Prohibitions</h3>
                  <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>Creating false or misleading offers</li>
                    <li>Refusing to honor legitimate offer redemptions</li>
                    <li>Discriminating against customers based on protected characteristics</li>
                    <li>Selling illegal, dangerous, or prohibited products/services</li>
                    <li>Manipulating reviews or ratings</li>
                    <li>Competing unfairly with other merchants on the platform</li>
                  </ul>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-4">Customer-Specific Prohibitions</h3>
                  <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>Attempting to redeem expired or invalid offers</li>
                    <li>Sharing or selling coupon codes to third parties</li>
                    <li>Creating multiple accounts to abuse offers</li>
                    <li>Providing false information when redeeming offers</li>
                    <li>Attempting to exploit system vulnerabilities for personal gain</li>
                  </ul>
                </>
              )}
            </CardContent>
          </Card>

          {/* Payment Terms */}
          {isMerchant && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                  Payment Terms & Billing (Merchants)
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h3 className="text-lg font-semibold mb-4">Subscription Plans</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li><strong>Silver (Free):</strong> 2 offers per month, basic features</li>
                  <li><strong>Gold (₹500/month):</strong> 10 offers per month, enhanced analytics</li>
                  <li><strong>Platinum (₹1500/month):</strong> 30 offers per month, premium features</li>
                </ul>

                <h3 className="text-lg font-semibold mb-4">Payment Terms</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>Subscription fees are charged monthly in advance</li>
                  <li>All prices are in Indian Rupees (INR) and include applicable taxes</li>
                  <li>Failed payments may result in service suspension</li>
                  <li>Refunds are processed according to our refund policy</li>
                  <li>You can upgrade or downgrade plans at any time</li>
                </ul>

                <h3 className="text-lg font-semibold mb-4">Billing Disputes</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>Report billing disputes within 60 days of charge</li>
                  <li>Provide detailed information about the disputed charge</li>
                  <li>We will investigate and respond within 10 business days</li>
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Offer Terms */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isMerchant ? 'Merchant Offer Terms' : 'Customer Offer Usage'}
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              {isMerchant ? (
                <>
                  <h3 className="text-lg font-semibold mb-4">Offer Creation & Management</h3>
                  <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>All offers must be truthful, accurate, and not misleading</li>
                    <li>Offers must include clear terms, conditions, and expiration dates</li>
                    <li>You must honor all legitimate offer redemptions</li>
                    <li>Offer images and descriptions must not infringe copyright</li>
                    <li>You may not discriminate against any customer group</li>
                    <li>Offers must comply with local and national advertising laws</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-4">Redemption Process</h3>
                  <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>Verify customer coupon codes before providing discounts</li>
                    <li>Process redemptions promptly and courteously</li>
                    <li>Report any suspicious or fraudulent redemption attempts</li>
                    <li>Maintain records of redemptions for your business purposes</li>
                  </ul>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-4">Offer Usage Rights</h3>
                  <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>Offers are for personal use only and may not be resold</li>
                    <li>One offer redemption per customer unless otherwise specified</li>
                    <li>Offers must be redeemed before expiration date</li>
                    <li>Present valid coupon code at time of redemption</li>
                    <li>Offers cannot be combined with other promotions unless stated</li>
                    <li>Cash value of offers is typically minimal or zero</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-4">Redemption Process</h3>
                  <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>Visit the merchant location with your coupon code</li>
                    <li>Follow any specific redemption instructions provided</li>
                    <li>Provide valid identification if requested</li>
                    <li>Comply with merchant policies and procedures</li>
                  </ul>
                </>
              )}
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property Rights</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h3 className="text-lg font-semibold mb-4">Platform Content</h3>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Namma OOru Offers owns all rights to the platform design, software, and branding</li>
                <li>Users may not copy, modify, or distribute our proprietary content</li>
                <li>Our trademarks and logos may not be used without permission</li>
                <li>User-generated content remains owned by the user but grants us usage rights</li>
              </ul>

              <h3 className="text-lg font-semibold mb-4">User Content Rights</h3>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>You retain ownership of content you upload or create</li>
                <li>You grant us a license to use your content for platform operations</li>
                <li>You represent that you have rights to all content you submit</li>
                <li>You must not infringe on others' intellectual property rights</li>
                {isMerchant && (
                  <>
                    <li><strong>Merchant Content:</strong> Business information and offers remain your property</li>
                    <li><strong>Merchant Content:</strong> Grant us rights to display and promote your offers</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                Limitation of Liability & Disclaimers
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="font-semibold text-yellow-800 mb-2">Important Legal Notice</p>
                <p className="text-yellow-700">
                  Please read this section carefully as it limits our liability and explains important disclaimers.
                </p>
              </div>

              <h3 className="text-lg font-semibold mb-4">Service Disclaimer</h3>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Services are provided "as is" without warranties of any kind</li>
                <li>We do not guarantee uninterrupted or error-free service</li>
                <li>We are not responsible for merchant offer fulfillment or quality</li>
                <li>Platform availability may be affected by maintenance or technical issues</li>
                {!isMerchant && (
                  <>
                    <li><strong>Customer Notice:</strong> We are not party to transactions between you and merchants</li>
                    <li><strong>Customer Notice:</strong> Merchant policies and offer terms are binding between you and the merchant</li>
                  </>
                )}
              </ul>

              <h3 className="text-lg font-semibold mb-4">Limitation of Damages</h3>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Our liability is limited to the amount paid for services (if any)</li>
                <li>We are not liable for indirect, incidental, or consequential damages</li>
                <li>We are not responsible for loss of profits, data, or business opportunities</li>
                <li>Some jurisdictions do not allow limitation of liability</li>
              </ul>

              {isMerchant && (
                <>
                  <h3 className="text-lg font-semibold mb-4">Merchant Responsibilities</h3>
                  <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>You are solely responsible for offer fulfillment and customer service</li>
                    <li>You indemnify us against claims arising from your offers or business practices</li>
                    <li>You must maintain appropriate business insurance</li>
                    <li>You are responsible for compliance with all applicable business laws</li>
                  </ul>
                </>
              )}
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle>Account Termination</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h3 className="text-lg font-semibold mb-4">Termination by You</h3>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>You may terminate your account at any time</li>
                <li>Contact customer support to request account deletion</li>
                <li>Some information may be retained as required by law</li>
                {isMerchant && (
                  <li><strong>Merchant Termination:</strong> Outstanding subscription fees remain due</li>
                )}
              </ul>

              <h3 className="text-lg font-semibold mb-4">Termination by Us</h3>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>We may suspend or terminate accounts for terms violations</li>
                <li>We may terminate inactive accounts after extended periods</li>
                <li>We will provide notice when reasonably possible</li>
                <li>Termination does not relieve you of outstanding obligations</li>
              </ul>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle>Governing Law & Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h3 className="text-lg font-semibold mb-4">Applicable Law</h3>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>These terms are governed by the laws of India</li>
                <li>Tamil Nadu state laws apply where applicable</li>
                <li>Disputes will be subject to the jurisdiction of Chennai courts</li>
              </ul>

              <h3 className="text-lg font-semibold mb-4">Dispute Resolution Process</h3>
              <ol className="list-decimal list-inside space-y-2 mb-6">
                <li><strong>Direct Resolution:</strong> Contact customer support first</li>
                <li><strong>Mediation:</strong> Good faith mediation if direct resolution fails</li>
                <li><strong>Arbitration:</strong> Binding arbitration under Indian Arbitration Act</li>
                <li><strong>Court Proceedings:</strong> As a last resort in Chennai jurisdiction</li>
              </ol>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="mb-4">
                We reserve the right to modify these Terms and Conditions at any time. Changes will be communicated through:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Posting updated terms on this page</li>
                <li>Email notifications to registered users</li>
                <li>In-platform notifications for significant changes</li>
                <li>30-day notice period for material changes</li>
              </ul>
              <p>
                Continued use of the platform after changes constitutes acceptance of the new terms.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle>Contact Us About Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                If you have questions about these Terms and Conditions, please contact us:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Legal Department</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>legal@namma-ooru-offers.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>+91-XXX-XXXXXXX</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Business Address</h4>
                  <address className="not-italic text-muted-foreground">
                    Namma OOru Offers<br />
                    [Legal Business Address]<br />
                    Tamil Nadu, India<br />
                    PIN: XXXXXX
                  </address>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Business Hours:</strong> Monday to Friday, 9:00 AM to 6:00 PM IST<br />
                  <strong>Response Time:</strong> We aim to respond to legal inquiries within 2-3 business days.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TermsAndConditions;