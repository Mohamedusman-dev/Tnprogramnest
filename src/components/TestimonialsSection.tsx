import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";
import { useSiteData } from "@/context/SiteDataContext";
import { GlowBackground } from "./GlowBackground";

const TestimonialsSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { siteData } = useSiteData(); 
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = siteData.testimonials || [];
  const len = testimonials.length;
  
  // Always display exactly 6 boxes as requested
  const displayCount = 6;

  useEffect(() => {
    if (!isVisible || len === 0) return; 
    
    // Change content every 3 seconds (3000ms)
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % len);
    }, 3000); 

    return () => clearInterval(timer);
  }, [isVisible, len]);

  if (len === 0) return null;

  return (
    <section className="section-padding tc-wrapper relative overflow-hidden" ref={ref}>
      <GlowBackground />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-[var(--primary-tc)] text-sm font-semibold uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="section-title text-white">What Our Clients Say</h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mt-4">Real feedback from businesses we've helped transform.</p>
        </div>

        {/* Grid layout that will naturally fit 6 items (2 rows of 3 on desktop) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Render 6 fixed slots so the layout never changes */}
          {Array.from({ length: displayCount }).map((_, i) => {
            // Loop through the available testimonials to fill the 6 boxes
            const t = testimonials[(currentIndex + i) % len];
            
            if (!t) return null;

            // Unique key combining slot index and testimonial ID to trigger animation properly
            const animationKey = `${i}-${t.id}`;

            return (
              <div key={i} className="tc-card-body p-6 flex flex-col min-h-[240px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={animationKey} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="flex flex-col h-full"
                  >
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, si) => (
                        <Star key={si} size={16} className="fill-[var(--primary-tc)] text-[var(--primary-tc)]" />
                      ))}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed mb-5 flex-1">"{t.text}"</p>
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="w-10 h-10 rounded-full bg-[var(--primary-15)] flex items-center justify-center font-display font-bold text-[var(--primary-tc)] text-sm border border-[var(--primary-30)] shrink-0">
                        {t.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-white">{t.name}</p>
                        <p className="text-xs text-slate-400">{t.company}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
