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
      
      {/* 
        Added padding-top to account for the fixed navbar since 
        there is no Hero section on this page to push content down.
        The wrapper has a dark background to blend with the AboutSection's rounded top if needed,
        but since AboutSection is light, we use bg-slate-50.
      */}
      <div className="pt-28 md:pt-36 bg-slate-50">
        <AboutSection />
      </div>
      
      <OpenPositionsSection />
      
      {/* New Team Testimonials Section added here */}
      <TeamTestimonialsSection />
      
      <ContactSection />
      <Footer />
      
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
    </div>
  );
};

export default Careers;
