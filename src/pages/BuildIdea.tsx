import { useEffect, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import ServiceTestimonialsSection from "@/components/ServiceTestimonialsSection";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { useSiteData } from "@/context/SiteDataContext";

const ScrollToTop = lazy(() => import("@/components/ScrollToTop"));

const BuildIdea = () => {
  const { siteData } = useSiteData();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Use the training stats for the floating card as requested previously
  const stats = siteData.general.stats?.training || [
    { value: 10, suffix: "+", label: "Workshops Conducted" },
    { value: 500, suffix: "+", label: "Students Trained" },
    { value: 5, suffix: "+", label: "Institutions Reached" },
    { value: 100, suffix: "%", label: "Industry-Focused" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-foreground overflow-x-hidden font-sans">
      <Navbar />
      
      <main>
        {/* Hero Header */}
        <section className="relative pt-32 pb-32 md:pt-40 md:pb-40 bg-[#0a0a0a] text-white overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] mix-blend-screen" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7 }} 
              className="max-w-4xl mx-auto"
            >
              <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold tracking-wider uppercase mb-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                Start Your Journey
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight font-display">
                Let's Build Your <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">Idea Together</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Transform your vision into reality with our expert team of developers, designers, and strategists.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Floating Stats Card */}
        <section className="relative z-20 -mt-16 mx-4 md:mx-auto md:max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-primary font-display mb-1">
                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-xs md:text-sm font-medium text-slate-600 uppercase tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* About Section */}
        <div className="mt-16">
          <AboutSection />
        </div>
        
        {/* Why Choose Us */}
        <WhyChooseSection />
        
        {/* Clutch Reviews (Testimonials) */}
        <ServiceTestimonialsSection />
        
        {/* Frequently Asked Questions */}
        <FAQSection />

        {/* Contact Us */}
        <ContactSection />
      </main>
      
      <Footer />
      
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
    </div>
  );
};

export default BuildIdea;
