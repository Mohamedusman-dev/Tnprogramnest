import { useState, useEffect, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, Code, LayoutDashboard, Rocket, Wrench, Users, Award, 
  Lightbulb, Globe, PenTool, Settings, Clock, ShieldCheck, PhoneCall, 
  MonitorSmartphone, Cpu, Layers, Smartphone
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceTestimonialsSection from "@/components/ServiceTestimonialsSection";
import ContactSection from "@/components/ContactSection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ScrollToTop = lazy(() => import("@/components/ScrollToTop"));

const techCategories = [
  {
    title: "Mobile",
    highlight: "Technologies",
    items: [
      { name: "React Native", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Flutter", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
      { name: "Swift", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg" },
      { name: "Kotlin", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" },
      { name: "Ionic", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ionic/ionic-original.svg" },
      { name: "Firebase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
      { name: "Apple", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" },
      { name: "Android", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg" }
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
  { label: "Healthcare Apps", desc: "Develop HIPAA-compliant mobile applications for telemedicine, patient tracking, and health monitoring. We ensure secure data handling and intuitive interfaces for both doctors and patients. Our solutions include real-time video consultations, secure messaging, wearable device integration, and automated appointment scheduling, all wrapped in a user-friendly design that prioritizes accessibility and patient care." },
  { label: "E-commerce Apps", desc: "Boost your sales with high-performance mobile commerce apps. We integrate secure payment gateways, AR product previews, and personalized push notifications to maximize conversions. By focusing on a frictionless checkout process, intelligent product recommendations, and seamless inventory synchronization, we create shopping experiences that turn casual browsers into loyal, repeat customers." },
  { label: "Fintech Solutions", desc: "Build secure, scalable mobile banking and wallet applications. We implement biometric authentication, real-time transaction processing, and bank-grade security protocols. Our fintech apps feature intuitive dashboards for expense tracking, seamless peer-to-peer transfers, and robust encryption methods, ensuring your users' financial data remains completely protected while offering a modern banking experience." },
  { label: "On-Demand Services", desc: "Launch your Uber-like app with real-time GPS tracking, driver/user matching algorithms, and seamless in-app communication and payment systems. We build dynamic two-sided marketplaces with robust admin panels to monitor operations, manage dispatching, and analyze user behavior, ensuring your on-demand service runs smoothly even during peak traffic hours." },
  { label: "EdTech Platforms", desc: "Create engaging mobile learning experiences with interactive video streaming, offline course access, gamification, and progress tracking. Our educational apps are designed to boost student retention through personalized learning paths, real-time quizzes, and collaborative discussion forums, making remote education as effective and engaging as traditional classroom learning." },
];

const workflowData = [
  { icon: Lightbulb, title: "Discovery & Strategy", desc: "We analyze your target audience, competitors, and business goals to define the app's core features and platform strategy (iOS/Android/Cross-platform)." },
  { icon: PenTool, title: "UI/UX Design", desc: "Our designers create intuitive wireframes and interactive prototypes, ensuring a seamless and engaging user journey tailored for mobile devices." },
  { icon: Code, title: "App Development", desc: "We write clean, scalable code using modern frameworks like React Native or native languages, integrating necessary APIs and backend services." },
  { icon: ShieldCheck, title: "Testing & QA", desc: "Rigorous testing across multiple devices and screen sizes to ensure performance, security, and a bug-free experience." },
  { icon: Rocket, title: "Launch & Support", desc: "We handle the App Store and Google Play submission process and provide ongoing maintenance to keep your app updated." }
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

const MobileAppDevelopment = () => {
  const navigate = useNavigate();
  const [activeIndustry, setActiveIndustry] = useState(0);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  
  // Auto slide industries every 2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndustry((prev) => (prev + 1) % industriesWeServe.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

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
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-4xl mx-auto">
              <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold tracking-wider uppercase mb-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]">Premium Service</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight font-display">
                Mobile App Development <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">Services</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                Build high-performance, native, and cross-platform mobile applications for iOS and Android that engage users and drive business growth.
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
              <p className="text-slate-600 max-w-2xl mx-auto">Everything you need to launch a successful mobile application.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Smartphone, title: "iOS App Development", desc: "Native Swift applications optimized for the Apple ecosystem." },
                { icon: MonitorSmartphone, title: "Android App Development", desc: "High-performance Kotlin apps for all Android devices." },
                { icon: Layers, title: "Cross-Platform Apps", desc: "React Native and Flutter apps for faster time-to-market." },
                { icon: PenTool, title: "UI/UX Design", desc: "Engaging and intuitive interfaces designed for mobile users." },
                { icon: ShieldCheck, title: "App Testing & QA", desc: "Rigorous testing to ensure a bug-free experience." },
                { icon: Code, title: "API Integration", desc: "Seamless connection with your backend and third-party services." },
                { icon: Rocket, title: "App Store Deployment", desc: "Hassle-free submission to Google Play and Apple App Store." },
                { icon: Wrench, title: "App Maintenance", desc: "Ongoing updates, monitoring, and feature enhancements." },
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
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display tracking-tight">App Development Workflow</h2>
              <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
              <p className="text-slate-600 max-w-2xl mx-auto mt-6">A proven methodology to turn your app idea into a reality.</p>
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
                { id: 1, image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop" },
                { id: 2, image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=600&auto=format&fit=crop" },
                { id: 3, image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=600&auto=format&fit=crop" },
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
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:no-underline hover:text-primary">Native vs Cross-platform: Which is better?</AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">Native apps offer the best performance and access to hardware features, ideal for complex apps. Cross-platform (React Native/Flutter) is faster to build and cheaper, perfect for most business apps.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="bg-white border border-slate-200 rounded-lg px-4">
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:no-underline hover:text-primary">Do you help with App Store submission?</AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">Yes, we handle the entire submission process for both the Apple App Store and Google Play Store, ensuring all guidelines are met.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="bg-white border border-slate-200 rounded-lg px-4">
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:no-underline hover:text-primary">How much does it cost to build an app?</AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">Costs vary widely based on features, platform, and complexity. A simple app might start around $10k, while complex enterprise apps can exceed $50k. Contact us for a precise quote.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="bg-white border border-slate-200 rounded-lg px-4">
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:no-underline hover:text-primary">Will my app work on both tablets and phones?</AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">Yes, we design and develop responsive mobile applications that provide an optimal viewing and interaction experience across a wide range of devices, including both smartphones and tablets.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="bg-white border border-slate-200 rounded-lg px-4">
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:no-underline hover:text-primary">Can you integrate third-party APIs like payment gateways?</AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">Absolutely. We have extensive experience integrating various third-party APIs, including payment gateways (Stripe, PayPal), social media logins, mapping services, and custom backend systems.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6" className="bg-white border border-slate-200 rounded-lg px-4">
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:no-underline hover:text-primary">Do you provide post-launch app maintenance?</AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">Yes, we offer comprehensive post-launch support and maintenance packages. This includes bug fixes, OS updates compatibility, performance monitoring, and adding new features as your app grows.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <ServiceTestimonialsSection />

        {/* Final CTA */}
        <section className="py-10 md:py-12 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 font-display">Ready to build your app?</motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-blue-100 text-base md:text-lg mb-8 max-w-2xl mx-auto">Let's turn your idea into a high-performance mobile application.</motion.p>
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

export default MobileAppDevelopment;
