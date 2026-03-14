import { useEffect, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import Navbar from "@/components/Navbar";
import AboutSection from "@/components/AboutSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { useScrollReveal } from "@/components/useScrollReveal";
import { useSiteData } from "@/context/SiteDataContext";

const ScrollToTop = lazy(() => import("@/components/ScrollToTop"));

const BuildIdea = () => {
  const { siteData } = useSiteData();
  const { ref, isVisible } = useScrollReveal();

  // Fetch the Hero stats from global context
  const heroStats = siteData.general.stats?.hero || [
    { value: 359, suffix: "+", label: "Projects Delivered", icon: "Briefcase" },
    { value: 216, suffix: "+", label: "Happy Clients", icon: "Users" },
    { value: 5, suffix: "+", label: "Years of Experience", icon: "Award" },
    { value: 36, suffix: "+", label: "Expert Developers", icon: "Code2" },
  ];

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-foreground overflow-x-hidden font-sans">
      <Navbar />

      {/* Mini Header to accommodate Navbar and AboutSection's negative margin */}
      <div className="pt-32 pb-16 bg-slate-900 text-center relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-display mb-4 tracking-tight"
          >
            Let's Build Your Idea
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            Turn your vision into reality with our expert team of developers and designers.
          </motion.p>
        </div>
      </div>

      {/* 1. About TechNest Section */}
      <AboutSection />

      {/* 2. Hero Section Style Count Section */}
      <section className="py-16 md:py-24 bg-[#0a0a0a] relative z-20" ref={ref}>
        {/* Subtle background glow */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <div className="w-[600px] h-[300px] bg-primary/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {heroStats.map((s, i) => {
              const IconComponent = (Icons as any)[s.icon || "Briefcase"] || Icons.Briefcase;
              return (
                <motion.div 
                  key={s.label} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="tc-card-body p-6 md:p-8 text-center border border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl hover:-translate-y-2 transition-transform duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                >
                  <div className="w-14 h-14 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4 md:mb-5">
                    <IconComponent className="text-primary" size={28} strokeWidth={2} />
                  </div>
                  <p className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white mb-2">
                    <AnimatedCounter target={s.value} suffix={s.suffix} startDelay={200} />
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium uppercase tracking-wider">{s.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 3. Why Choose Us Section */}
      <WhyChooseSection />

      {/* 4. Contact Us Section */}
      <ContactSection />

      {/* 5. Footer */}
      <Footer />

      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
    </div>
  );
};

export default BuildIdea;
