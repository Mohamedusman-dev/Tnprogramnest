import { motion } from "framer-motion";
import { Layers, ArrowRight } from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";
import { useSiteData } from "@/context/SiteDataContext";

const ServicesSection = () => {
  // Lowered threshold to 0.05 so it triggers earlier on mobile screens
  const { ref, isVisible } = useScrollReveal(0.05);
  const { siteData } = useSiteData();

  return (
    <section id="services" className="py-12 md:py-20 px-4 md:px-8 bg-slate-50 relative overflow-hidden" ref={ref}>
      {/* Subtle Background Blobs to enhance the glass effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-400/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What We Offer</h2>
            <div className="w-16 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              We are a dedicated team of software professionals with expertise in delivering a wide range of services, including Software Solutions, IT Support, Web Development, Design and Digital Marketing. Our primary objective is to leverage state-of-the-art technologies to foster the growth and success of present and future business goals.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {(siteData.services || []).map((s, i) => (
            <motion.div
              key={s.id}
              // Reduced initial y offset from 40 to 20 for smoother mobile appearance
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-start gap-5 group p-6 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:bg-white/60 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="shrink-0 mt-1 bg-white p-3 rounded-xl shadow-sm border border-slate-100 group-hover:border-primary/30 transition-colors">
                {s.iconUrl ? (
                  /* Added lazy loading, dimensions, and async decoding */
                  <img 
                    src={s.iconUrl} 
                    alt={s.title} 
                    loading="lazy"
                    width="32"
                    height="32"
                    decoding="async"
                    className="w-8 h-8 object-contain group-hover:scale-110 transition-transform" 
                  />
                ) : (
                  <Layers className="text-slate-800 w-8 h-8 group-hover:text-primary transition-colors" strokeWidth={1.5} />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 text-slate-900 group-hover:text-primary transition-colors">{s.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{s.desc}</p>
                <button className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                  Read More <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
