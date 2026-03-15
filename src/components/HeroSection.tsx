import { useState, useEffect } from "react";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { useSiteData } from "@/context/SiteDataContext";

const rotatingWords = ["Growth", "Sales", "Leads", "Scale", "Success"];

const DashboardStat = ({ refreshKey, label, target, prefix = "", suffix = "", change, isFloat = false }: any) => {
  const count = useMotionValue(0);
  const display = useTransform(count, (latest) => {
    return `${prefix}${isFloat ? latest.toFixed(1) : Math.floor(latest)}${suffix}`;
  });

  useEffect(() => {
    count.set(0); 
    const controls = animate(count, target, { duration: 1.2, ease: "easeOut" });
    return controls.stop;
  }, [refreshKey, target, count]);

  return (
    <div className="bg-secondary/50 rounded-lg p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <motion.p className="text-lg font-bold font-display">{display}</motion.p>
      <p className="text-xs text-primary">{change}</p>
    </div>
  );
};

const HeroSection = () => {
  const { siteData } = useSiteData();
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Typewriter States
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  // Dashboard refresh interval
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Typewriter Effect Logic
  useEffect(() => {
    const i = loopNum % rotatingWords.length;
    const fullText = rotatingWords[i];
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      timer = setTimeout(() => {
        setText(fullText.substring(0, text.length - 1));
        if (text === "") {
          setIsDeleting(false);
          setLoopNum(loopNum + 1);
        }
      }, 50); // Deletion speed
    } else {
      if (text === fullText) {
        timer = setTimeout(() => setIsDeleting(true), 2000); // Pause before deleting
      } else {
        timer = setTimeout(() => {
          setText(fullText.substring(0, text.length + 1));
        }, 100); // Typing speed
      }
    }
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const heroStats = siteData.general.stats?.hero || [
    { value: 359, suffix: "+", label: "Projects Delivered", icon: "Briefcase" },
    { value: 216, suffix: "+", label: "Happy Clients", icon: "Users" },
    { value: 5, suffix: "+", label: "Years of Experience", icon: "Award" },
    { value: 36, suffix: "+", label: "Expert Developers", icon: "Code2" },
  ];

  return (
    <>
      <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden px-4 md:px-8 pt-32 pb-24 md:pt-36 md:pb-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl floating" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl floating-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6 text-xs sm:text-sm text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Trusted by 300+ Global Businesses
              </div>

              <h1 className="section-title text-[2.2rem] leading-[1.2] sm:text-4xl md:text-5xl lg:text-6xl">
                {siteData.hero.title}{" "}
                <span className="gradient-text inline-grid whitespace-nowrap">
                  <span className="col-start-1 row-start-1 flex items-center">
                    Drive {text}
                    <span className="w-[3px] md:w-[4px] h-[0.9em] bg-primary ml-1.5 animate-[pulse_1s_ease-in-out_infinite]"></span>
                  </span>
                  <span className="invisible col-start-1 row-start-1 flex items-center">
                    Drive Success
                    <span className="w-[3px] md:w-[4px] h-[0.9em] ml-1.5"></span>
                  </span>
                </span>
              </h1>

              {siteData.hero.miniDescription && (
                <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-300 font-medium max-w-lg leading-relaxed border-l-2 border-primary pl-4">
                  {siteData.hero.miniDescription}
                </p>
              )}

              <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                {siteData.hero.description}
              </p>

              {/* Fixed Mobile Buttons Layout */}
              <div className="flex flex-row gap-3 mt-8 w-full sm:w-auto">
                <button
                  onClick={() => scrollTo("contact-us")}
                  className="btn-primary-gradient shine-effect flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base flex-1 sm:flex-none px-3 sm:px-6 py-3.5 whitespace-nowrap"
                >
                  Start Project <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <button
                  onClick={() => scrollTo("services")}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-3.5 rounded-lg border border-border hover:border-primary/50 text-foreground transition-all duration-300 hover:bg-secondary/50 text-sm sm:text-base flex-1 sm:flex-none whitespace-nowrap"
                >
                  Explore Services <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="glass-card gradient-border p-8 rounded-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-3 h-3 rounded-full bg-destructive/70" />
                      <div className="w-3 h-3 rounded-full bg-accent/70" />
                      <div className="w-3 h-3 rounded-full bg-primary/70" />
                      <span className="ml-2 text-xs text-muted-foreground font-mono">dashboard.technest.dev</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <DashboardStat refreshKey={refreshKey} label="Revenue" target={2.4} prefix="$" suffix="M" change="+24%" isFloat={true} />
                      <DashboardStat refreshKey={refreshKey} label="Users" target={18.2} suffix="K" change="+12%" isFloat={true} />
                      <DashboardStat refreshKey={refreshKey} label="Growth" target={94} suffix="%" change="+8%" />
                    </div>
                    
                    <div className="h-32 bg-secondary/30 rounded-lg flex items-end p-3 gap-1">
                      {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                        <motion.div
                          key={`bar-${refreshKey}-${i}`}
                          className="flex-1 rounded-t"
                          style={{ background: "var(--gradient-primary)" }}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: i * 0.05, duration: 0.6, ease: "easeOut" }}
                        />
                      ))}
                    </div>
                    
                    <div className="flex gap-3 items-center">
                      <div className="flex-1 h-3 bg-primary/30 rounded-full overflow-hidden">
                        <motion.div 
                          key={`progress-${refreshKey}`}
                          className="h-full rounded-full" 
                          style={{ background: "var(--gradient-primary)" }} 
                          initial={{ width: 0 }}
                          animate={{ width: "75%" }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">75%</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary/20 rounded-full blur-xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating Stats Section */}
      <section className="py-6 md:py-8 bg-white border border-slate-100 relative z-30 -mt-12 md:-mt-16 mx-4 md:mx-auto md:max-w-6xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-4 md:px-8">
          {heroStats.map((s, i) => {
            const IconComponent = (Icons as any)[s.icon || "Briefcase"] || Icons.Briefcase;
            return (
              <motion.div 
                key={s.label} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-center justify-start md:justify-center gap-3 sm:gap-4"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <IconComponent size={20} strokeWidth={2} className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="text-left">
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 font-display leading-none mb-1">
                    <AnimatedCounter target={s.value} suffix={s.suffix} startDelay={300} />
                  </p>
                  <p className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wide leading-tight">{s.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default HeroSection;
