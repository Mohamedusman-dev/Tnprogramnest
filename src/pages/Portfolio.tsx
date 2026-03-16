import { useState, useEffect, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import * as Icons from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { useSiteData } from "@/context/SiteDataContext";
import { AnimatedCounter } from "@/components/AnimatedCounter";

const ScrollToTop = lazy(() => import("@/components/ScrollToTop"));

const tabs = ["All Projects", "Completed Projects", "Currently Working", "Upcoming / Concepts"];

const Portfolio = () => {
  const { siteData } = useSiteData();
  const [activeTab, setActiveTab] = useState("All Projects");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const projects = siteData.portfolioProjects || [];
  const pageData = siteData.portfolioPage || {
    badge: "Our Work",
    title1: "Explore Our",
    title2: "Portfolio",
    description: "Discover how we've helped businesses transform their digital presence with innovative, scalable, and beautifully designed solutions."
  };

  const portfolioStats = siteData.general.stats?.portfolio || [
    { value: 500, suffix: "+", label: "Projects Delivered", icon: "Briefcase" },
    { value: 50, suffix: "+", label: "Industries Served", icon: "Globe" },
    { value: 99, suffix: "%", label: "Client Satisfaction", icon: "Heart" },
    { value: 10, suffix: "+", label: "Years Experience", icon: "Award" },
  ];

  const filteredProjects = projects.filter(p => {
    if (activeTab === "Completed Projects") return p.status === "Completed";
    if (activeTab === "Currently Working") return p.status === "In Progress";
    if (activeTab === "Upcoming / Concepts") return p.status === "Coming Soon";
    return true;
  });

  const featuredProject = projects.find(p => p.featured) || projects[0];
  const highlightProject = projects.find(p => p.highlight && !p.featured) || projects[1];

  // Exact colors from the reference image
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "text-[#059669] bg-[#ecfdf5] border-[#a7f3d0]"; // Emerald
      case "In Progress": return "text-[#d97706] bg-[#fffbeb] border-[#fde68a]"; // Amber
      case "Coming Soon": return "text-[#2563eb] bg-[#eff6ff] border-[#bfdbfe]"; // Blue
      default: return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#0a0a0a] text-white overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] mix-blend-screen" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-4xl mx-auto">
              <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold tracking-wider uppercase mb-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                {pageData.badge}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight font-display">
                {pageData.title1} <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">{pageData.title2}</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                {pageData.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Floating Stats Section */}
        <section className="py-6 md:py-8 bg-white border border-slate-100 relative z-30 -mt-12 md:-mt-16 mx-4 md:mx-auto md:max-w-6xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-4 md:px-8">
            {portfolioStats.map((s, i) => {
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

        <div className="container mx-auto px-4 max-w-7xl py-16 md:py-24">
          
          {/* Featured Project - Light Dark Theme */}
          {featuredProject && (
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16 md:mb-24"
            >
              <div className="bg-slate-900 rounded-[1.5rem] border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-300 overflow-hidden group text-white">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <span className="inline-block px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-md text-[10px] font-semibold uppercase tracking-widest w-fit mb-6">Featured Project</span>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{featuredProject.title}</h3>
                    <p className="text-slate-400 mb-6 leading-relaxed">
                      {featuredProject.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {featuredProject.techStack.map(tech => (
                        <span key={tech} className="px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded text-[10px] font-semibold uppercase tracking-wider">{tech}</span>
                      ))}
                    </div>
                    <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 w-fit group-hover:gap-3">
                      {featuredProject.cta} <ArrowRight size={16} className="transition-transform" />
                    </button>
                  </div>
                  <div className="p-5 flex items-center justify-center bg-slate-800/50">
                    <div className="rounded-xl overflow-hidden shadow-2xl w-full h-full relative">
                      <img src={featuredProject.image} alt={featuredProject.title} className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Highlight Project */}
          {highlightProject && (
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16 md:mb-24"
            >
              <div className="flex items-center gap-2 mb-6">
                <Star className="text-primary fill-primary" size={20} />
                <h2 className="text-xl font-bold text-slate-900">Highlight Project</h2>
              </div>
              <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden group">
                <div className="grid md:grid-cols-[2fr_3fr] gap-0">
                  <div className="p-5 flex items-center justify-center bg-[#f4f9ff]">
                    <div className="rounded-xl overflow-hidden shadow-lg w-full h-full relative min-h-[250px]">
                      <img src={highlightProject.image} alt={highlightProject.title} className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  </div>
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-[10px] font-semibold uppercase tracking-wider">{highlightProject.category}</span>
                      <span className={`px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider ${getStatusColor(highlightProject.status)}`}>{highlightProject.status}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{highlightProject.title}</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {highlightProject.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {highlightProject.techStack.map(tech => (
                        <span key={tech} className="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-full text-[11px] font-medium shadow-sm">{tech}</span>
                      ))}
                    </div>
                    <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 w-fit group-hover:gap-3">
                      {highlightProject.cta} <ArrowRight size={16} className="transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Portfolio Grid */}
          <section>
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === tab 
                      ? "bg-primary text-white shadow-md" 
                      : "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((p, i) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="bg-white rounded-[20px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col group"
                    >
                      {/* Image Area with Light Blue Background */}
                      <div className="relative bg-[#f4f9ff] p-5 pt-14 pb-6 rounded-t-[20px] flex items-center justify-center">
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4 bg-primary text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full z-10 shadow-sm">
                          {p.category}
                        </div>
                        
                        {/* Image Container */}
                        <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.1)] group-hover:-translate-y-1 transition-transform duration-300">
                          <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                          
                          {/* Overlay CTA */}
                          <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                            <button className="bg-white text-slate-900 px-5 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-xs">
                              {p.cta} <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-6 flex flex-col flex-1 bg-white rounded-b-[20px]">
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <h4 className="text-xl font-bold text-slate-900 leading-tight">{p.title}</h4>
                          <span className={`px-3 py-1 border rounded-full text-[10px] font-bold whitespace-nowrap ${getStatusColor(p.status)}`}>
                            {p.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mb-6 line-clamp-2 flex-1 leading-relaxed">{p.description}</p>
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {p.techStack.map(tech => (
                            <span key={tech} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-full text-[11px] font-medium shadow-sm">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="col-span-full text-center py-20 text-slate-500"
                  >
                    <p className="text-lg font-medium mb-1">Coming Soon</p>
                    <p className="text-sm">We're working on exciting projects in this category.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

        </div>
        <ContactSection />
      </main>

      <Footer />
      <Suspense fallback={null}><ScrollToTop /></Suspense>
    </div>
  );
};

export default Portfolio;
