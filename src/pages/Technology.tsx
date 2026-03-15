import { useEffect, Suspense, lazy } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TechnologySection from "@/components/TechnologySection";
import ContactSection from "@/components/ContactSection";

const ScrollToTop = lazy(() => import("@/components/ScrollToTop"));

const Technology = () => {
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-foreground overflow-x-hidden font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Dark background wrapper for the Technology section */}
        <div className="pt-24 md:pt-32 bg-[#0c121e]">
          <TechnologySection />
        </div>
        <ContactSection />
      </main>

      <Footer />
      
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
    </div>
  );
};

export default Technology;
