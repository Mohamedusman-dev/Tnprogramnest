import { motion } from "framer-motion";
import { useScrollReveal } from "./useScrollReveal";
import { ArrowRight, PhoneCall } from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";

const TransformCTASection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { siteData } = useSiteData();

  const scrollToContact = () => {
    document.getElementById("contact-us")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-12 md:py-16 bg-white relative overflow-hidden border-y border-slate-100" ref={ref}>
      {/* Subtle Background Glow for White Theme */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
        <div className="w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 md:mb-6 tracking-tight font-display"
        >
          Ready to Transform Your Business?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-base md:text-xl text-slate-600 mb-8 md:mb-10 max-w-2xl mx-auto"
        >
          Let's discuss how we can help you achieve your digital transformation goals
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <button
            onClick={scrollToContact}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-primary/25 flex items-center justify-center gap-2 hover:-translate-y-1"
          >
            Get Started Today <ArrowRight size={18} />
          </button>
          
          <a
            href={`tel:${siteData.general.phone.replace(/[^0-9+]/g, '')}`}
            className="w-full sm:w-auto bg-white border-2 border-primary text-primary hover:bg-primary/5 px-8 py-3.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-1"
          >
            <PhoneCall size={18} /> Call Us Now
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TransformCTASection;
