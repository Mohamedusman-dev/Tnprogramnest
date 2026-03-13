import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";
import { useSiteData } from "@/context/SiteDataContext";

const CTASection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { siteData } = useSiteData();

  return (
    <section 
      className="py-16 md:py-24 px-4 md:px-8 bg-slate-50 relative overflow-hidden" 
      ref={ref}
    >
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden"
        >
          {/* Subtle decorative glow in the background of the white card */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0f4a9e]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

          <div className="max-w-3xl relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight font-sans tracking-tight text-slate-900">
              {siteData.cta.title}
            </h2>
            <p className="text-slate-600 text-lg md:text-xl mb-10 leading-relaxed font-sans max-w-2xl">
              {siteData.cta.description}
            </p>
            <button className="bg-[#0f4a9e] text-white hover:bg-[#0f4a9e]/90 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#0f4a9e]/20 hover:-translate-y-1">
              {siteData.cta.buttonText} <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
