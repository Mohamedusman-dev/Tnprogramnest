import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SiteDataProvider } from "@/context/SiteDataContext";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Careers from "./pages/Careers";
import Technology from "./pages/Technology";
import Training from "./pages/Training";
import BuildIdea from "./pages/BuildIdea";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SiteDataProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/technology" element={<Technology />} />
            <Route path="/training" element={<Training />} />
            <Route path="/build-idea" element={<BuildIdea />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SiteDataProvider>
  </QueryClientProvider>
);

export default App;
