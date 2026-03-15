import { motion } from "framer-motion";
import { ArrowRight, PhoneCall } from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";

const TransformCTASection = () => {
  const { siteData } = useSiteData();

  const scrollToContact = () => {
    document.getElementById("contact-us")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-10 md:py-12 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 font-display"
        >
          Ready to Transform Your Business?
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ delay: 0.1 }} 
          className="text-blue-100 text-base md:text-lg mb-8 md:mb-10 max-w-2xl mx-auto"
        >
          Let's discuss how we can help you achieve your digital transformation goals.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ delay: 0.2 }} 
          className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
        >
          <button
            onClick={scrollToContact}
            className="w-full sm:w-auto bg-white text-primary hover:bg-slate-50 px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            Get Started Today <ArrowRight size={18} />
          </button>
          
          <a
            href={`tel:${(siteData.general.phone || '').replace(/[^0-9+]/g, '')}`}
            className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            <PhoneCall size={18} /> Call Us Now
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TransformCTASection;
