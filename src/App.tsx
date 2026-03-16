import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SiteDataProvider } from "@/context/SiteDataContext";
import { useDevToolsProtection } from "@/hooks/useDevToolsProtection";
import Index from "./pages/Index";
import Careers from "./pages/Careers";
import Technology from "./pages/Technology";
import Training from "./pages/Training";
import BuildIdea from "./pages/BuildIdea";
import Portfolio from "./pages/Portfolio";
import FullStackDevelopment from "./pages/FullStackDevelopment";
import MobileAppDevelopment from "./pages/MobileAppDevelopment";
import WebApplicationDevelopment from "./pages/WebApplicationDevelopment";
import EcommerceDevelopment from "./pages/EcommerceDevelopment";
import DigitalMarketing from "./pages/DigitalMarketing";
import ProductDevelopment from "./pages/ProductDevelopment";
import HireDedicatedDevelopers from "./pages/HireDedicatedDevelopers";
import ManagedServices from "./pages/ManagedServices";
import CmsDevelopment from "./pages/CmsDevelopment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useDevToolsProtection();

  return (
    <QueryClientProvider client={queryClient}>
      <SiteDataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/technology" element={<Technology />} />
              <Route path="/training" element={<Training />} />
              <Route path="/build-idea" element={<BuildIdea />} />
              <Route path="/portfolio" element={<Portfolio />} />
              
              {/* Service Routes */}
              <Route path="/services/full-stack-development" element={<FullStackDevelopment />} />
              <Route path="/services/mobile-app-development" element={<MobileAppDevelopment />} />
              <Route path="/services/web-application-development" element={<WebApplicationDevelopment />} />
              <Route path="/services/e-commerce-development" element={<EcommerceDevelopment />} />
              <Route path="/services/digital-marketing-services" element={<DigitalMarketing />} />
              <Route path="/services/product-development" element={<ProductDevelopment />} />
              <Route path="/services/hire-developers" element={<HireDedicatedDevelopers />} />
              <Route path="/services/hire-dedicated-developers" element={<HireDedicatedDevelopers />} />
              <Route path="/services/managed-services" element={<ManagedServices />} />
              <Route path="/services/cms-development" element={<CmsDevelopment />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SiteDataProvider>
    </QueryClientProvider>
  );
};

export default App;
