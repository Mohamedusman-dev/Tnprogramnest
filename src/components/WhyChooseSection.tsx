import { motion } from "framer-motion";
import { Users, Settings, Zap, ShieldCheck } from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";

const reasons = [
  { 
    icon: Users, 
    title: "EXPERT TEAM", 
    desc: "Highly skilled professionals dedicated to delivering top-tier digital solutions with guaranteed quality." 
  },
  { 
    icon: Settings, 
    title: "CUSTOM BUILT", 
    desc: "The product adopts tailored architectures and advanced technology to perfectly fit your needs." 
  },
  { 
    icon: ShieldCheck, 
    title: "GOOD SERVICE", 
    desc: "Professional employee one-on-one service, ensuring a worry-free and transparent experience." 
  },
  { 
    icon: Zap, 
    title: "QUICK DELIVERY", 
    desc: "Agile methodologies and sufficient capacity ensure rapid development and fast delivery." 
  },
];

const WhyChooseSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const darkBlue = "#0f4a9e";

  return (
    <section className="relative w-full font-sans" ref={ref}>
      {/* Top White Section */}
      <div className="bg-white pt-12 md:pt-16 pb-8 md:pb-12 relative z-10 text-center">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 uppercase tracking-tight font-display"
          >
            WHY <span style={{ color: darkBlue }}>CHOOSE US</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xs md:text-sm tracking-[0.15em] md:tracking-[0.2em] text-slate-500 uppercase mt-3 md:mt-4 font-medium"
          >
            PREMIUM DIGITAL SOLUTIONS PROVIDER
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isVisible ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-1 mx-auto mt-4 md:mt-5 rounded-full"
            style={{ backgroundColor: darkBlue }}
          />
        </div>

        {/* Geometric Cutout SVG */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none translate-y-[99%] z-10 drop-shadow-sm">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-[30px] md:h-[60px]">
            <path d="M0,0 L1200,0 L1200,0 L850,120 L350,120 L0,0 Z" fill="#ffffff"></path>
          </svg>
        </div>
      </div>

      {/* Bottom Dark Section with Cards */}
      <div className="relative bg-slate-900 pt-20 md:pt-28 pb-16 md:pb-24 px-4 md:px-8 z-0">
        {/* Subtle Background Overlay for depth */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>

        <div className="container mx-auto relative z-20 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {reasons.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="bg-white rounded-xl p-6 md:p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2 border border-slate-100"
              >
                {/* Icon Container with Dashed Border */}
                <div 
                  className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full border-[2px] border-dashed p-1.5 flex items-center justify-center mb-6 md:mb-8 transition-transform duration-500 group-hover:rotate-12" 
                  style={{ borderColor: darkBlue }}
                >
                  <div 
                    className="w-full h-full rounded-full flex items-center justify-center text-white shadow-inner" 
                    style={{ backgroundColor: darkBlue }}
                  >
                    <r.icon size={28} className="md:w-8 md:h-8" strokeWidth={2} />
                  </div>
                </div>

                {/* Text Content */}
                <h3 className="font-display font-bold text-lg md:text-xl text-slate-900 mb-3 md:mb-4 uppercase tracking-wide">
                  {r.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {r.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
