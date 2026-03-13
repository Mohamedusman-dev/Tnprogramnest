import { motion } from "framer-motion";
import { useScrollReveal } from "./useScrollReveal";
import { useSiteData } from "@/context/SiteDataContext";
import { GlowBackground } from "./GlowBackground";

const ProductShowcaseSection = () => {
  const { ref, isVisible } = useScrollReveal(0.1);
  const { siteData } = useSiteData();

  const leftProducts = siteData.products.filter((p) => p.category === "left");
  const rightProducts = siteData.products.filter((p) => p.category === "right");

  const defaultLeft = [
    { id: "1", title: "Software Development", desc: "Custom software solutions tailored to your specific business needs and workflows." },
    { id: "2", title: "Prototyping", desc: "Rapid prototyping to visualize your ideas and validate concepts before full-scale development." },
    { id: "3", title: "Web Development", desc: "Responsive and modern websites built with the latest technologies for impactful online presence." },
  ];
  const defaultRight = [
    { id: "4", title: "Apps Development", desc: "Native and cross-platform mobile applications that engage users and drive growth." },
    { id: "5", title: "Digital Marketing", desc: "Strategic marketing campaigns to increase brand visibility and reach your target audience." },
    { id: "6", title: "Project Management", desc: "Efficient project planning and execution to ensure timely delivery and quality results." },
  ];

  const displayLeft = leftProducts.length > 0 ? leftProducts : defaultLeft;
  const displayRight = rightProducts.length > 0 ? rightProducts : defaultRight;

  return (
    <section id="portfolio" className="tc-light-wrapper relative min-h-screen overflow-hidden" ref={ref}>
      <GlowBackground />

      {/* Header */}
      <div className="relative z-10 pt-16 md:pt-20 pb-8 text-center px-4">
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-[var(--primary-tc)] text-sm font-semibold uppercase tracking-widest mb-3"
        >
          Our Expertise
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="section-title text-slate-900"
        >
          Our Products
        </motion.h2>
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={isVisible ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
          className="tc-underline-bar"
        />
      </div>

      {/* Services Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-20 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-10 lg:gap-0 items-center">
        
        {/* Left Column */}
        <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
          {displayLeft.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, x: -60 }}
              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 1, 0.5, 1] }}
              className="flex items-start gap-4 md:gap-5"
            >
              <span className="tc-number">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="tc-card-title">{product.title}</h3>
                <div className="tc-card-body p-4 md:p-5">
                  <p className="text-slate-600 text-sm">{product.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Center Orb - Scaled down slightly on mobile to prevent overflow */}
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="flex justify-center items-center my-8 lg:my-0 lg:mx-12 scale-75 sm:scale-90 md:scale-100"
        >
          <div className="relative w-[208px] h-[208px] flex items-center justify-center">
            <div className="tc-orb-ring">
              <svg viewBox="0 0 200 200" width="100%" height="100%">
                <circle cx="100" cy="100" r="90" fill="none" stroke="var(--primary-30)" strokeWidth="1.5" strokeDasharray="8 6" />
              </svg>
            </div>
            <div className="tc-orb-inner"></div>
            <div className="tc-orb-pulse"></div>
            <div className="tc-orbit-dot-track"><div className="tc-orbit-dot"></div></div>
            <div className="tc-orbit-dot-track"><div className="tc-orbit-dot"></div></div>
            <div className="tc-orbit-dot-track"><div className="tc-orbit-dot"></div></div>
            <div className="tc-orb-content relative z-10 text-center">
              <p className="label">Innovation Hub</p>
              <h2 className="brand">TECH</h2>
              <p className="tagline">Design your Think</p>
            </div>
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
          {displayRight.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, x: 60 }}
              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
              transition={{ duration: 0.6, delay: 0.3 + (index * 0.1), ease: [0.25, 1, 0.5, 1] }}
              // Responsive classes: flex-row and text-left on mobile, flex-row-reverse and text-right on desktop
              className="flex items-start gap-4 md:gap-5 flex-row lg:flex-row-reverse text-left lg:text-right"
            >
              <span className="tc-number">{String(displayLeft.length + index + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="tc-card-title">{product.title}</h3>
                <div className="tc-card-body p-4 md:p-5">
                  <p className="text-slate-600 text-sm">{product.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProductShowcaseSection;
