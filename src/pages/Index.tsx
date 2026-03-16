import { useEffect, useRef, Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import EcommerceSolutionsSection from "@/components/EcommerceSolutionsSection";
import ProductShowcaseSection from "@/components/ProductShowcaseSection";
import AboutSection from "@/components/AboutSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import HomePortfolioSection from "@/components/HomePortfolioSection";
import IndustriesSection from "@/components/IndustriesSection";
import TransformCTASection from "@/components/TransformCTASection";
import ServiceTestimonialsSection from "@/components/ServiceTestimonialsSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import WhatsAppButton from "@/components/WhatsAppButton";

// Lazy load the ScrollToTop component
const ScrollToTop = lazy(() => import("@/components/ScrollToTop"));

const Index = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Handle scrolling to hash links when returning from other pages
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  // Global Cursor Glow Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX - 150}px`;
        cursorRef.current.style.top = `${e.clientY - 150}px`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Global Cursor Glow */}
      <div id="cursor-glow" ref={cursorRef} className="hidden md:block"></div>

      <Navbar />
      
      {/* Added proper main landmark for accessibility */}
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <EcommerceSolutionsSection />
        <WhyChooseSection />
        <HomePortfolioSection />
        <TransformCTASection />
        <ProductShowcaseSection />
        <IndustriesSection />
        
        {/* Replaced old Testimonials with Clutch Reviews */}
        <ServiceTestimonialsSection />
        
        {/* Swapped Order: Contact Us is now above FAQ */}
        <ContactSection />
        <FAQSection />
      </main>
      
      <Footer />
      <Chatbot />
      <WhatsAppButton />
      
      {/* Suspense wrapper for lazy loaded component */}
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
    </div>
  );
};

export default Index;
