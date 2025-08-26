import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import YourOffers from "./pages/YourOffers";
import CustomerAnalytics from "./pages/CustomerAnalytics";
import MerchantDashboard from "./pages/MerchantDashboard";
import MerchantPostOffer from "./pages/MerchantPostOffer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/your-offers" element={<YourOffers />} />
          <Route path="/customer-analytics" element={<CustomerAnalytics />} />
          <Route path="/merchant-dashboard" element={<MerchantDashboard />} />
          <Route path="/merchant-post-offer" element={<MerchantPostOffer />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
