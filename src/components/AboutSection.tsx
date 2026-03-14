import { motion } from "framer-motion";
import { Target, Lightbulb, HeartHandshake, TrendingUp } from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";
import { AnimatedCounter } from "./AnimatedCounter";
import { useSiteData } from "@/context/SiteDataContext";
import { GlowBackground } from "./GlowBackground";

const points = [
  { icon: Target, title: "Our Mission", desc: "To empower businesses with transformative digital solutions that drive sustainable growth and competitive advantage." },
  { icon: Lightbulb, title: "Innovation First", desc: "We stay ahead of technology trends, integrating cutting-edge tools and methodologies into every project we deliver." },
  { icon: HeartHandshake, title: "Client-Focused", desc: "Every solution is tailored to your unique needs. We treat your goals as our own, ensuring measurable success." },
  { icon: TrendingUp, title: "Growth Through Tech", desc: "From strategy to execution, we build digital ecosystems that scale with your business and deliver lasting results." },
];

const AboutSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { siteData } = useSiteData();

  const aboutStats = siteData.general.stats?.about || [
    { value: 500, suffix: "+", label: "Projects" },
    { value: 300, suffix: "+", label: "Clients" },
    { value: 8, suffix: "+", label: "Years" },
    { value: 98, suffix: "%", label: "Satisfaction" },
  ];

  return (
    <section 
      id="about" 
      className="section-padding tc-light-wrapper relative overflow-hidden rounded-t-[2rem] md:rounded-t-[2.5rem] -mt-6 md:-mt-8 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]" 
      ref={ref}
    >
      <GlowBackground />
      
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[var(--primary-tc)] text-xs md:text-sm font-semibold uppercase tracking-widest mb-3">About TechNest</p>
            <h2 className="section-title text-slate-900 text-3xl md:text-4xl">
              {siteData.about.title} <span className="gradient-text">{siteData.about.highlight}</span>
            </h2>
            <p className="text-slate-600 mt-4 md:mt-6 text-sm md:text-base leading-relaxed">
              {siteData.about.description}
            </p>

            <div className="grid grid-cols-2 gap-3 md:gap-4 mt-6 md:mt-8">
              {aboutStats.map((s) => (
                <div key={s.label} className="tc-card-body p-3 md:p-4 text-center">
                  <p className="text-xl md:text-2xl font-bold font-display text-[var(--primary-tc)]">
                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-[10px] md:text-xs text-slate-500 mt-1 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
            {points.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="tc-card-body p-4 md:p-5"
              >
                <p.icon className="text-[var(--primary-tc)] mb-2 md:mb-3 w-5 h-5 md:w-[22px] md:h-[22px]" />
                <h3 className="font-display font-semibold mb-1.5 md:mb-2 text-sm md:text-base text-slate-900">{p.title}</h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
