import { motion } from "framer-motion";
import { Award, Lightbulb, PenTool, Clock, Cpu, Globe, Settings, ShieldCheck } from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";

const whyChooseUsData = [
  { icon: Award, title: "Expert Team", desc: "Our skilled professionals bring over 9+ years of experience to every project." },
  { icon: Lightbulb, title: "In-House Excellence", desc: "Benefit from the expertise of 80+ in-house experts dedicated to your project's success." },
  { icon: PenTool, title: "Project Mastery", desc: "With over 200 projects handled, we have the experience to tackle any challenge effectively." },
  { icon: Clock, title: "Timely Support", desc: "Expect a response within 8 hours or less from our dedicated team ready to assist you." },
  { icon: Cpu, title: "Cutting-Edge Technologies", desc: "Stay ahead of the curve by utilizing state-of-the-art technologies in development." },
  { icon: Globe, title: "Global Reach", desc: "With 150+ clients worldwide, we've established a reputation for delivering excellence globally." },
  { icon: Settings, title: "Tailored Solutions", desc: "Our team works closely with you to understand your needs and deliver customized solutions." },
  { icon: ShieldCheck, title: "Trusted Partner", desc: "Join forces with an ISO 27001 certified firm, recognized for excellence in software solutions." },
];

const HexCard = ({ item }: { item: any }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
    className="relative w-full aspect-[1.15/1] group"
    style={{ filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.06))" }}
  >
    <div 
      className="w-full h-full bg-white flex flex-col items-center justify-center p-4 sm:p-6 text-center transition-transform duration-300 group-hover:-translate-y-2"
      style={{ clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" }}
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-2 sm:mb-3 text-primary">
        <item.icon className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />
      </div>
      <h3 className="font-bold text-slate-900 mb-1.5 sm:mb-2 text-sm sm:text-base leading-tight px-2">{item.title}</h3>
      <p className="text-[10px] sm:text-[11px] md:text-xs text-slate-500 leading-relaxed px-4 sm:px-6">{item.desc}</p>
    </div>
  </motion.div>
);

const WhyChooseSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-12 md:py-16 bg-slate-50 relative overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display"
          >
            Why Choose Us
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isVisible ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-1 bg-primary mx-auto rounded-full"
          />
        </div>
        
        {/* Desktop Honeycomb Grid */}
        <div className="hidden md:flex justify-center items-start max-w-5xl mx-auto pb-12">
           <div className="w-[28%] flex flex-col gap-6">
             <HexCard item={whyChooseUsData[0]} />
             <HexCard item={whyChooseUsData[4]} />
           </div>
           <div className="w-[28%] -ml-[7%] flex flex-col gap-6" style={{ marginTop: 'calc(12.17% + 0.75rem)' }}>
             <HexCard item={whyChooseUsData[1]} />
             <HexCard item={whyChooseUsData[5]} />
           </div>
           <div className="w-[28%] -ml-[7%] flex flex-col gap-6">
             <HexCard item={whyChooseUsData[2]} />
             <HexCard item={whyChooseUsData[6]} />
           </div>
           <div className="w-[28%] -ml-[7%] flex flex-col gap-6" style={{ marginTop: 'calc(12.17% + 0.75rem)' }}>
             <HexCard item={whyChooseUsData[3]} />
             <HexCard item={whyChooseUsData[7]} />
           </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden flex-col gap-4 px-8 sm:px-16">
           {whyChooseUsData.map((item, i) => <HexCard item={item} key={i} />)}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
