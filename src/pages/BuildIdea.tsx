import { useEffect, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { useSiteData } from "@/context/SiteDataContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import ServiceTestimonialsSection from "@/components/ServiceTestimonialsSection";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import * as Icons from "lucide-react";

const ScrollToTop = lazy(() => import("@/components/ScrollToTop"));

const BuildIdea = () => {
  const { siteData } = useSiteData();
  const heroStats = siteData.general.stats?.hero || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-foreground overflow-x-hidden font-sans">
      <Navbar />
      <main>
        {/* Dark Hero Header */}
        <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 bg-[#0a0a0a] text-white overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] mix-blend-screen" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-4xl mx-auto">
              <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold tracking-wider uppercase mb-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                Let's Build Together
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight font-display">
                Turn Your Vision Into a <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">Digital Reality</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Partner with our expert team to design, develop, and launch your next big idea. We provide end-to-end solutions tailored to your business goals.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Floating Stats Section */}
        <section className="py-6 md:py-8 bg-white border border-slate-100 relative z-30 -mt-12 md:-mt-16 mx-4 md:mx-auto md:max-w-6xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-4 md:px-8">
            {heroStats.map((s, i) => {
              const IconComponent = (Icons as any)[s.icon || "Briefcase"] || Icons.Briefcase;
              return (
                <motion.div 
                  key={s.label} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-center justify-start md:justify-center gap-3 sm:gap-4"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <IconComponent size={20} strokeWidth={2} className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 font-display leading-none mb-1">
                      <AnimatedCounter target={s.value} suffix={s.suffix} startDelay={300} />
                    </p>
                    <p className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wide leading-tight">{s.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <div className="pt-12">
          <AboutSection />
        </div>
        
        <WhyChooseSection />
        <ServiceTestimonialsSection />
        
        {/* Swapped Order: Contact Us is now above FAQ */}
        <ContactSection />
        <FAQSection />

      </main>
      <Footer />
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
    </div>
  );
};

export default BuildIdea;
