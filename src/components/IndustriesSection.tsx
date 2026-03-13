import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal } from "./useScrollReveal";
import { useSiteData } from "@/context/SiteDataContext";

const IndustriesSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { siteData } = useSiteData();
  const industries = siteData.industries || [];
  
  const [activeTab, setActiveTab] = useState(industries[0]?.id || "");

  // Update active tab if industries data loads/changes
  useEffect(() => {
    if (industries.length > 0 && !industries.find(i => i.id === activeTab)) {
      setActiveTab(industries[0].id);
    }
  }, [industries, activeTab]);

  if (industries.length === 0) return null;

  const activeData = industries.find((i) => i.id === activeTab) || industries[0];

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 bg-[#f8f9fa] font-sans overflow-hidden" ref={ref}>
      <div className="container mx-auto max-w-5xl">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-10"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-blue-600 mb-3 tracking-tight">Focus Industries</h2>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
            Domain expertise across diverse industries to deliver tailored digital solutions.
          </p>
        </motion.div>

        {/* Tabs - Scrollable horizontally on mobile, wrapped on desktop */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex overflow-x-auto lg:flex-wrap justify-start lg:justify-center gap-2 md:gap-3 mb-8 md:mb-10 pb-4 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {industries.map((ind) => (
            <button
              key={ind.id}
              onClick={() => setActiveTab(ind.id)}
              className={`snap-start shrink-0 whitespace-nowrap px-5 py-2 md:px-4 md:py-1.5 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                activeTab === ind.id
                  ? "bg-blue-600 text-white shadow-[0_4px_16px_rgba(37,99,235,0.3)] scale-105"
                  : "bg-white/80 text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent"
              }`}
            >
              {ind.label}
            </button>
          ))}
        </motion.div>

        {/* Content Card */}
        <AnimatePresence mode="wait">
          {activeData && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white/70 backdrop-blur-xl border border-blue-100 rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10 shadow-[0_8px_32px_-8px_rgba(59,130,246,0.15)] flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-12"
            >
              {/* Left Column */}
              <div className="flex flex-col">
                <motion.h3 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="text-xl md:text-2xl font-bold text-blue-600 mb-2"
                >
                  {activeData.label}
                </motion.h3>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="text-slate-500 text-sm md:text-base leading-relaxed mb-5"
                >
                  {activeData.description}
                </motion.p>

                {/* Mobile Image (Shows early in the flow on mobile) */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="block lg:hidden rounded-xl overflow-hidden mb-6 aspect-[16/10] shadow-[0_4px_12px_rgba(0,0,0,0.1)] group"
                >
                  <img 
                    src={activeData.image} 
                    alt={activeData.label} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </motion.div>
                
                <ul className="space-y-2.5 mb-6">
                  {activeData.bullets.map((bullet, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 + (i * 0.08) }}
                      className="flex items-center gap-2.5 text-sm md:text-base text-slate-800"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                      {bullet}
                    </motion.li>
                  ))}
                </ul>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 md:p-5 mb-6 lg:mt-auto"
                >
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded mb-2">
                    Testimonial
                  </span>
                  <p className="text-sm italic text-slate-800 mb-2">"{activeData.testimonial.quote}"</p>
                  <p className="text-[11px] text-slate-500">— {activeData.testimonial.author}, {activeData.testimonial.role}</p>
                </motion.div>

                <motion.button 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="w-full lg:w-auto self-start border border-blue-600 text-blue-600 hover:bg-blue-50 px-5 py-3 lg:py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_12px_rgba(37,99,235,0.15)] text-center"
                >
                  Explore {activeData.label} Solutions
                </motion.button>
              </div>

              {/* Right Column */}
              <div className="flex flex-col mt-8 lg:mt-0 pt-8 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 md:p-5 mb-5 lg:mb-4"
                >
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded mb-2">
                    Featured Case Study
                  </span>
                  <p className="text-sm font-bold text-slate-900 mb-1">{activeData.caseStudy.title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{activeData.caseStudy.description}</p>
                </motion.div>

                {/* Desktop Image (Hidden on Mobile) */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="hidden lg:block rounded-xl overflow-hidden mb-4 aspect-[16/10] shadow-[0_4px_12px_rgba(0,0,0,0.1)] group"
                >
                  <img 
                    src={activeData.image} 
                    alt={activeData.label} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </motion.div>

                <div className="flex justify-center gap-6 md:gap-12 mb-6 lg:mb-5">
                  {activeData.caseStudy.stats.map((stat, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 + (i * 0.15) }}
                      className="text-center"
                    >
                      <p className="text-xl md:text-2xl font-bold text-blue-600">{stat.value}</p>
                      <p className="text-[10px] md:text-xs text-slate-500 mt-0.5">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.button 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="w-full lg:w-auto self-center border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 px-5 py-3 lg:py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-sm mt-auto text-center"
                >
                  View case study
                </motion.button>
              </div>
              
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default IndustriesSection;
