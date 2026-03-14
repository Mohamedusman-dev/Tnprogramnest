import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";
import { useSiteData } from "@/context/SiteDataContext";

const TeamTestimonialsSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { siteData } = useSiteData();
  const testimonials = siteData.teamTestimonials || [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsiveness for items per view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (!isVisible || testimonials.length === 0) return;
    
    const timer = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(timer);
  }, [isVisible, testimonials.length, currentIndex, isMobile]);

  const itemsPerView = isMobile ? 1 : 2;
  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  if (testimonials.length === 0) return null;

  // Get the visible items based on current index
  const visibleItems = testimonials.slice(currentIndex, currentIndex + itemsPerView);
  
  // If we're near the end and don't have enough items to fill the view, wrap around
  if (visibleItems.length < itemsPerView) {
    visibleItems.push(...testimonials.slice(0, itemsPerView - visibleItems.length));
  }

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 bg-[#0a0a0a] text-white font-sans overflow-hidden" ref={ref}>
      <div className="container mx-auto max-w-6xl">
        
        {/* Header & Controls Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            Our Team Loves <span className="text-red-500">♥</span> Us
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
            className="flex gap-3"
          >
            <button 
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              aria-label="Previous testimonial"
            >
              <ArrowLeft size={18} />
            </button>
            <button 
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              aria-label="Next testimonial"
            >
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item, idx) => (
              <motion.div
                key={`${currentIndex}-${item.id}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col"
              >
                {/* Quote Bubble */}
                <div className="relative bg-transparent border-t border-l border-r border-white/10 rounded-t-2xl p-6 md:p-8 pb-10">
                  <h3 className="text-lg font-bold mb-3">{item.role}</h3>
                  <p className="text-slate-300 text-sm md:text-base italic leading-relaxed">
                    "{item.quote}"
                  </p>
                  
                  {/* Custom Bottom Border with pointer */}
                  <div className="absolute bottom-0 left-0 w-full h-px bg-white/10"></div>
                  <div className="absolute -bottom-2.5 left-10 w-5 h-5 bg-[#0a0a0a] border-b border-r border-white/10 transform rotate-45"></div>
                </div>

                {/* Author Info */}
                <div className="flex items-center justify-between pt-6 px-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 bg-slate-800 shrink-0">
                      {item.image ? (
                        /* Added lazy loading, dimensions, and async decoding */
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          loading="lazy"
                          width="48"
                          height="48"
                          decoding="async"
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-slate-400">
                          {item.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <h4 className="font-bold text-base">{item.name}</h4>
                  </div>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < item.rating ? "fill-orange-500 text-orange-500" : "fill-slate-700 text-slate-700"} 
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default TeamTestimonialsSection;
