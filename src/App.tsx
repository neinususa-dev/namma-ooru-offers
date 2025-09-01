import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AboutUs from "./pages/AboutUs";
import YourOffers from "./pages/YourOffers";
import CustomerAnalytics from "./pages/CustomerAnalytics";
import MerchantDashboard from "./pages/MerchantDashboard";
import MerchantPostOffer from "./pages/MerchantPostOffer";
import MerchantEditOffers from "./pages/MerchantEditOffers";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminNavigation } from "./components/AdminNavigation";
import Rewards from "./pages/Rewards";
import { Billing } from "./pages/Billing";
import { PaymentSuccess } from "./pages/PaymentSuccess";
import { PaymentCanceled } from "./pages/PaymentCanceled";
import Profile from "./pages/Profile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/your-offers" element={<YourOffers />} />
              <Route path="/customer-analytics" element={<CustomerAnalytics />} />
              <Route path="/merchant-dashboard" element={<MerchantDashboard />} />
              <Route path="/merchant-post-offer" element={<MerchantPostOffer />} />
              <Route path="/merchant-edit-offers" element={<MerchantEditOffers />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-navigation" element={<AdminNavigation />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-canceled" element={<PaymentCanceled />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
