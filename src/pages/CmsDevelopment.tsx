import { useState, useEffect, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, Code, Database, LayoutDashboard, 
  Rocket, Wrench, Users, Award, Lightbulb, Globe, 
  PenTool, Settings, Clock, ShieldCheck, PhoneCall, 
  Cpu, FileText, Layout, Edit3, Share2, Search
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceTestimonialsSection from "@/components/ServiceTestimonialsSection";
import ContactSection from "@/components/ContactSection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ScrollToTop = lazy(() => import("@/components/ScrollToTop"));

const techCategories = [
  {
    title: "CMS",
    highlight: "Platforms",
    items: [
      { name: "WordPress", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg" },
      { name: "Webflow", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webflow/webflow-original.svg" },
      { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
      { name: "PHP", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
      { name: "MySQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" }
    ]
  }
];

const allTechs = techCategories.flatMap(c => c.items);
const uniqueTechs = Array.from(new Map(allTechs.map(item => [item.name, item])).values());

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

const industriesWeServe = [
  { label: "Publishing & Media", desc: "High-performance editorial workflows, multi-author management, and content distribution networks designed for digital publishers." },
  { label: "Corporate Websites", desc: "Secure, scalable, and easy-to-manage corporate portals that empower marketing teams to update content without developer intervention." },
  { label: "E-commerce Content", desc: "Integrating robust CMS capabilities alongside e-commerce engines for rich product storytelling and seamless shopping experiences." },
  { label: "Education & Non-profits", desc: "Accessible, structured content repositories for educational materials, donation campaigns, and community engagement." },
];

const workflowData = [
  { icon: Lightbulb, title: "Discovery & Strategy", desc: "We analyze your content structure, user roles, and business goals to recommend the perfect CMS architecture." },
  { icon: Layout, title: "Architecture & Design", desc: "Designing the content models, taxonomy, and user interfaces for both the frontend and the admin dashboard." },
  { icon: Code, title: "Development & Integration", desc: "Building custom themes, plugins, and integrating third-party APIs (CRM, ERP, Marketing tools)." },
  { icon: Database, title: "Content Migration", desc: "Securely migrating your existing data, images, and SEO metadata to the new platform without data loss." },
  { icon: Rocket, title: "Training & Launch", desc: "Providing comprehensive training for your editorial team and deploying the site to a live, optimized environment." }
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
      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-2 sm:mb-3 text-[#c82021]">
        <item.icon className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />
      </div>
      <h3 className="font-bold text-[#1e293b] mb-1.5 sm:mb-2 text-sm sm:text-base leading-tight px-2">{item.title}</h3>
      <p className="text-[10px] sm:text-[11px] md:text-xs text-slate-500 leading-relaxed px-4 sm:px-6">{item.desc}</p>
    </div>
  </motion.div>
);

const CmsDevelopment = () => {
  const navigate = useNavigate();
  const [activeIndustry, setActiveIndustry] = useState(0);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  const scrollToContact = () => navigate('/#contact-us');

  return (
    <div className="min-h-screen bg-slate-50 text-foreground overflow-x-hidden font-sans">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#0a0a0a] text-white overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] mix-blend-screen" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-4xl mx-auto">
              <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold tracking-wider uppercase mb-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]">Premium Service</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight font-display">
                CMS Development <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">Services</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                Empower your team with custom Content Management Systems. We build scalable, secure, and user-friendly CMS solutions tailored to your specific content needs.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={scrollToContact} className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-lg font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:-translate-y-1 flex items-center justify-center gap-2">
                  Start Project <ArrowRight size={18} />
                </button>
                <button onClick={scrollToContact} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2">
                  Get Free Consultation
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-12 md:py-16 bg-slate-50 relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">Why Choose Us</h2>
              <div className="w-16 h-1 bg-[#c82021] mx-auto rounded-full"></div>
            </div>
            <div className="hidden md:flex justify-center items-start max-w-5xl mx-auto pb-12">
               <div className="w-[28%] flex flex-col gap-6"><HexCard item={whyChooseUsData[0]} /><HexCard item={whyChooseUsData[4]} /></div>
               <div className="w-[28%] -ml-[7%] flex flex-col gap-6" style={{ marginTop: 'calc(12.17% + 0.75rem)' }}><HexCard item={whyChooseUsData[1]} /><HexCard item={whyChooseUsData[5]} /></div>
               <div className="w-[28%] -ml-[7%] flex flex-col gap-6"><HexCard item={whyChooseUsData[2]} /><HexCard item={whyChooseUsData[6]} /></div>
               <div className="w-[28%] -ml-[7%] flex flex-col gap-6" style={{ marginTop: 'calc(12.17% + 0.75rem)' }}><HexCard item={whyChooseUsData[3]} /><HexCard item={whyChooseUsData[7]} /></div>
            </div>
            <div className="flex md:hidden flex-col gap-4 px-8 sm:px-16">
               {whyChooseUsData.map((item, i) => <HexCard item={item} key={i} />)}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-12 md:py-16 bg-white border-y border-slate-100">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">What's Included</h2>
              <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-6"></div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: LayoutDashboard, title: "Custom CMS", desc: "Tailor-made dashboards built specifically for your editorial workflows." },
                { icon: Code, title: "Headless CMS", desc: "Decoupled architectures using React/Next.js for lightning-fast frontends." },
                { icon: Layout, title: "Theme Development", desc: "Pixel-perfect, responsive themes for WordPress and other platforms." },
                { icon: Settings, title: "Plugin Integration", desc: "Custom plugins and extensions to add specific functionalities." },
                { icon: Database, title: "Data Migration", desc: "Seamless transfer of existing content, users, and media." },
                { icon: Search, title: "SEO Tools", desc: "Built-in tools to manage meta tags, sitemaps, and schema markup." },
                { icon: ShieldCheck, title: "Security Setup", desc: "Hardening your CMS against vulnerabilities and brute-force attacks." },
                { icon: Users, title: "Team Training", desc: "Comprehensive training sessions for your content managers." },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4"><item.icon size={24} /></div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Expertise */}
        <section className="py-12 md:py-16 bg-slate-50 border-b border-slate-100">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12 md:mb-16">
              <p className="text-primary font-bold text-sm uppercase tracking-widest mb-2">This Is Our</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">Technical Expertise</h2>
              <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {uniqueTechs.map((tech, i) => (
                <motion.div key={tech.name} initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: (i % 10) * 0.05, type: "spring", bounce: 0.4 }} className="w-28 h-28 md:w-32 md:h-32 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col items-center justify-center gap-3 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1">
                  <img src={tech.logo} alt={tech.name} loading="lazy" width="40" height="40" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
                  <span className="text-xs md:text-sm font-bold text-slate-800 text-center leading-tight px-1">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section className="py-12 md:py-16 bg-white relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="mb-12 md:mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display tracking-tight">Development Workflow</h2>
              <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 relative z-10">
              {workflowData.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute -top-4 -right-4 text-[100px] font-black text-slate-50 group-hover:text-primary/5 transition-colors duration-300 z-0 pointer-events-none leading-none">{String(i + 1).padStart(2, '0')}</div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-slate-50 group-hover:bg-primary/10 rounded-xl flex items-center justify-center text-slate-700 group-hover:text-primary mb-6 transition-colors duration-300 border border-slate-100 group-hover:border-primary/20"><item.icon size={26} strokeWidth={1.5} /></div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries */}
        <section className="py-12 md:py-16 bg-slate-50 border-y border-slate-100">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">Industries We Serve</h2>
              <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="w-full lg:w-[40%] flex flex-col">
                {industriesWeServe.map((ind, i) => (
                  <button key={i} onClick={() => setActiveIndustry(i)} className={`flex items-center justify-between py-3.5 border-b border-slate-200 text-left transition-all duration-300 group ${activeIndustry === i ? 'text-primary font-bold' : 'text-slate-600 font-medium hover:text-primary'}`}>
                    <span className="text-sm md:text-base">{ind.label}</span>
                    <ArrowRight size={18} className={`transition-transform duration-300 ${activeIndustry === i ? 'text-primary translate-x-1' : 'text-slate-400 group-hover:text-primary group-hover:translate-x-1'}`} />
                  </button>
                ))}
              </div>
              <div className="w-full lg:w-[60%]">
                <motion.div key={activeIndustry} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 h-full">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4">{industriesWeServe[activeIndustry].label}</h3>
                  <div className="text-slate-600 text-sm md:text-base leading-relaxed space-y-3 whitespace-pre-line">{industriesWeServe[activeIndustry].desc}</div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio */}
        <section className="py-12 md:py-16 bg-white border-b border-slate-100">
          <div className="container mx-auto px-4 max-w-[1200px]">
            <div className="text-center mb-10 md:mb-14">
              <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-black mb-4 font-display tracking-tight">Our Portfolio</h2>
              <div className="w-16 h-1 bg-[#c82021] mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {[
                { id: 1, image: "https://images.dualite.app/109cb605-1b9d-44d5-a79d-86b38bdfbe3a/asset-a2dac705-802d-4455-a18b-5218dceec9d9.webp" },
                { id: 2, image: "https://images.dualite.app/109cb605-1b9d-44d5-a79d-86b38bdfbe3a/asset-2bb48f2b-993b-47a3-82af-6ca9b986a6af.webp" },
                { id: 3, image: "https://images.dualite.app/109cb605-1b9d-44d5-a79d-86b38bdfbe3a/asset-c922d0d7-194e-4cce-bb8c-e3675d23c99a.webp" },
              ].map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-white p-2 sm:p-3 rounded-sm shadow-[0_15px_40px_rgba(0,0,0,0.2)] group cursor-pointer">
                  <div className="w-full aspect-[4/3] rounded-sm overflow-hidden portfolio-img-scroll" style={{ backgroundImage: `url(${item.image})` }}></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 md:py-16 bg-slate-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">Frequently Asked Questions</h2>
              <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-6"></div>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="bg-white border border-slate-200 rounded-lg px-4">
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:no-underline hover:text-primary">What is a Headless CMS?</AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">A headless CMS separates the backend content repository from the frontend presentation layer. This allows you to manage content in one place and display it across any device or platform (website, mobile app, smartwatch) using APIs.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="bg-white border border-slate-200 rounded-lg px-4">
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:no-underline hover:text-primary">Can you migrate my existing website to a new CMS?</AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">Yes, we provide secure and seamless data migration services. We ensure all your content, images, user data, and SEO metadata are safely transferred to the new platform without downtime.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="bg-white border border-slate-200 rounded-lg px-4">
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:no-underline hover:text-primary">Do you provide training for our team?</AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">Absolutely. Upon launch, we provide comprehensive training sessions and documentation to ensure your marketing and editorial teams are comfortable managing content on the new system.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <ServiceTestimonialsSection />

        {/* Final CTA */}
        <section className="py-10 md:py-12 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 font-display">Ready to upgrade your CMS?</motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-blue-100 text-base md:text-lg mb-8 max-w-2xl mx-auto">Empower your team with a scalable, easy-to-use content management system.</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={scrollToContact} className="bg-white text-primary hover:bg-slate-50 px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"><PhoneCall size={20} /> Contact Us</button>
            </motion.div>
          </div>
        </section>

        <ContactSection />
      </main>
      <Footer />
      <Suspense fallback={null}><ScrollToTop /></Suspense>
    </div>
  );
};

export default CmsDevelopment;
