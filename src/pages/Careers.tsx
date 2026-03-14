import { useEffect, Suspense, lazy } from "react";
import Navbar from "@/components/Navbar";
import AboutSection from "@/components/AboutSection";
import OpenPositionsSection from "@/components/OpenPositionsSection";
import TeamTestimonialsSection from "@/components/TeamTestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const ScrollToTop = lazy(() => import("@/components/ScrollToTop"));

const Careers = () => {
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-foreground overflow-x-hidden">
      <Navbar />
      
      {/* Added proper main landmark for accessibility */}
      <main>
        <div className="pt-28 md:pt-36 bg-slate-50">
          <AboutSection />
        </div>
        
        <OpenPositionsSection />
        <TeamTestimonialsSection />
        <ContactSection />
      </main>
      
      <Footer />
      
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
    </div>
  );
};

export default Careers;
