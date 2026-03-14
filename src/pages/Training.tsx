import { useEffect, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { 
  GraduationCap, Users, Building2, Target, Code, MonitorPlay, 
  Briefcase, ShieldAlert, FileText, Megaphone, CheckCircle2, 
  Clock, MapPin, Award, BookOpen, CalendarDays, Laptop
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { useScrollReveal } from "@/components/useScrollReveal";

const ScrollToTop = lazy(() => import("@/components/ScrollToTop"));

// --- Data Models ---
const programs = [
  {
    title: "Web Development Workshop",
    duration: "2 Days",
    audience: "Schools / Colleges",
    mode: "Hybrid",
    icon: Code,
    desc: "Hands-on session covering HTML, CSS, JavaScript basics and a real project demo for students."
  },
  {
    title: "AI Tools Awareness Session",
    duration: "1 Day",
    audience: "All Students",
    mode: "Online / Offline",
    icon: MonitorPlay,
    desc: "Introduction to ChatGPT, Midjourney, and other AI tools to boost productivity and learning."
  },
  {
    title: "Digital Marketing Basics",
    duration: "3 Days",
    audience: "Colleges",
    mode: "Hybrid",
    icon: Megaphone,
    desc: "Learn the fundamentals of SEO, Social Media Marketing, and creating online campaigns."
  },
  {
    title: "Career Guidance Seminar",
    duration: "Half Day",
    audience: "Final Year Students",
    mode: "Offline",
    icon: Target,
    desc: "Expert advice on choosing the right IT career path, industry trends, and job opportunities."
  },
  {
    title: "Cyber Security Awareness",
    duration: "1 Day",
    audience: "Schools / Colleges",
    mode: "Online / Offline",
    icon: ShieldAlert,
    desc: "Essential training on internet safety, data privacy, and ethical hacking basics."
  },
  {
    title: "Resume & LinkedIn Building",
    duration: "1 Day",
    audience: "Colleges",
    mode: "Hybrid",
    icon: FileText,
    desc: "Practical workshop on crafting ATS-friendly resumes and professional LinkedIn profiles."
  }
];

const topics = [
  "Web Development", "App Development", "Full Stack Basics", 
  "AI Tools for Students", "Career Guidance", "Resume Building", 
  "Interview Preparation", "Digital Marketing Fundamentals", 
  "Freelancing Basics", "Cyber Safety Awareness"
];

const audiences = [
  "Schools", "Colleges", "Polytechnic Institutes", 
  "Engineering Students", "Final Year Students", "Beginners in Tech"
];

const formats = [
  { title: "One-day Workshop", icon: CalendarDays },
  { title: "3-Day Bootcamp", icon: Target },
  { title: "Weekly Training Series", icon: Clock },
  { title: "Seminar Session", icon: Users },
  { title: "Hands-on Lab Session", icon: Laptop },
];

const testimonials = [
  {
    quote: "The session was highly engaging and useful for our students. They got to see how real-world coding works.",
    author: "Dr. Ramesh Kumar",
    role: "HOD Computer Science, XYZ Engineering College"
  },
  {
    quote: "A practical workshop that gave our students real exposure to current AI technologies. Highly recommended!",
    author: "Priya Sharma",
    role: "Principal, ABC Public School"
  }
];

const gallery = [
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
  "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&q=80",
  "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80",
  "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80"
];

// --- Subcomponents ---
const SectionHeader = ({ title, subtitle, dark = false }: { title: string, subtitle: string, dark?: boolean }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12 md:mb-16"
    >
      <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight font-display ${dark ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h2>
      <div className="w-16 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
      <p className={`text-base md:text-lg max-w-2xl mx-auto ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
        {subtitle}
      </p>
    </motion.div>
  );
};

// --- Main Page Component ---
const Training = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-foreground overflow-x-hidden font-sans">
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#0a0a0a] text-white overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold tracking-wider uppercase mb-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              Education & Empowerment
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight font-display">
              Empowering Students with <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">Practical Tech Skills</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              We conduct practical, industry-oriented training sessions for school and college students in areas such as web development, digital skills, career guidance, AI tools, and emerging technologies.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => document.getElementById('contact-us')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-lg font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Book a Workshop <Target size={18} />
              </button>
              <button 
                onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                Explore Programs
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="py-12 bg-white border-b border-slate-100 relative z-20 -mt-8 mx-4 md:mx-auto md:max-w-5xl rounded-2xl shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
          {[
            { val: 10, suf: "+", label: "Workshops Conducted" },
            { val: 500, suf: "+", label: "Students Trained" },
            { val: 5, suf: "+", label: "Institutions Reached" },
            { val: 100, suf: "%", label: "Industry-Focused" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary font-display mb-1">
                <AnimatedCounter target={s.val} suffix={s.suf} />
              </p>
              <p className="text-xs md:text-sm font-medium text-slate-600 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Programs Showcase */}
      <section id="programs" className="py-20 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader 
            title="Our Training Programs" 
            subtitle="Tailored workshops and seminars designed to bridge the gap between academic learning and industry requirements." 
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((prog, i) => {
              const { ref, isVisible } = useScrollReveal(0.1);
              return (
                <motion.div
                  ref={ref}
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <prog.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{prog.title}</h3>
                  <p className="text-slate-600 text-sm mb-5 leading-relaxed min-h-[60px]">
                    {prog.desc}
                  </p>
                  <div className="space-y-2 border-t border-slate-100 pt-4">
                    <div className="flex items-center text-xs font-medium text-slate-500">
                      <Clock size={14} className="mr-2 text-primary" /> {prog.duration}
                    </div>
                    <div className="flex items-center text-xs font-medium text-slate-500">
                      <Users size={14} className="mr-2 text-primary" /> {prog.audience}
                    </div>
                    <div className="flex items-center text-xs font-medium text-slate-500">
                      <MapPin size={14} className="mr-2 text-primary" /> {prog.mode}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Topics & Audience (Dark Section) */}
      <section className="py-20 px-4 md:px-8 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Topics Covered */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-8 font-display flex items-center gap-3">
                <BookOpen className="text-primary" /> Topics We Cover
              </h3>
              <div className="flex flex-wrap gap-3">
                {topics.map((topic, i) => (
                  <span key={i} className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium hover:bg-primary hover:border-primary transition-colors cursor-default">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Who We Train */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-8 font-display flex items-center gap-3">
                <GraduationCap className="text-primary" /> Who Is This For?
              </h3>
              <ul className="grid sm:grid-cols-2 gap-4">
                {audiences.map((aud, i) => (
                  <li key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
                    <CheckCircle2 size={18} className="text-green-400 shrink-0" />
                    <span className="text-sm font-medium">{aud}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Formats, Delivery & Why Choose Us */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader 
            title="How We Deliver" 
            subtitle="Flexible training formats designed to fit your institution's schedule and requirements." 
          />

          <div className="grid md:grid-cols-3 gap-8">
            {/* Formats */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CalendarDays className="text-primary" /> Program Formats
              </h3>
              <ul className="space-y-4">
                {formats.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <f.icon size={16} className="text-slate-400" />
                    <span className="text-sm font-medium">{f.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Delivery Mode & Certificates */}
            <div className="space-y-8">
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin className="text-primary" /> Delivery Mode
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700">On-Campus</span>
                  <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700">Online Live</span>
                  <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700">Hybrid</span>
                </div>
              </div>

              <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Award className="text-primary" /> Certificates
                </h3>
                <p className="text-sm text-slate-600 mb-3">We provide verifiable certificates for students:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm font-medium text-slate-800">
                    <CheckCircle2 size={14} className="text-primary" /> Participation Certificate
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium text-slate-800">
                    <CheckCircle2 size={14} className="text-primary" /> Completion Certificate
                  </li>
                </ul>
              </div>
            </div>

            {/* Outcomes & Benefits */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Target className="text-primary" /> Student Benefits
              </h3>
              <ul className="space-y-4">
                {[
                  "Practical exposure to real technologies",
                  "Better understanding of IT careers",
                  "Improved confidence and communication",
                  "Project ideas and industry awareness",
                  "Career readiness and skill development"
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-2">Custom Sessions</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Institutions can request customized topics based on their curriculum and student needs.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Event Highlights / Gallery */}
      <section className="py-20 px-4 md:px-8 bg-slate-100">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader 
            title="Event Highlights" 
            subtitle="Glimpses from our recent workshops, seminars, and interactive student sessions." 
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((img, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`rounded-2xl overflow-hidden shadow-md group ${i === 0 || i === 3 ? 'md:col-span-2 md:row-span-2' : ''}`}
              >
                <img 
                  src={img} 
                  alt="Training Session" 
                  className="w-full h-full object-cover aspect-video md:aspect-auto min-h-[200px] transition-transform duration-700 group-hover:scale-105"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="container mx-auto max-w-5xl">
          <SectionHeader 
            title="What Institutions Say" 
            subtitle="Feedback from colleges and schools that have partnered with us." 
          />
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative">
                <div className="text-primary/20 absolute top-6 right-6">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.017 21L16.417 14.5C16.417 14.5 16.517 14.5 16.617 14.5C18.617 14.5 20.217 12.9 20.217 10.9C20.217 8.9 18.617 7.3 16.617 7.3C14.617 7.3 13.017 8.9 13.017 10.9C13.017 12.6 14.017 14.1 15.517 14.8L13.117 21H14.017ZM5.01697 21L7.41697 14.5C7.41697 14.5 7.51697 14.5 7.61697 14.5C9.61697 14.5 11.217 12.9 11.217 10.9C11.217 8.9 9.61697 7.3 7.61697 7.3C5.61697 7.3 4.01697 8.9 4.01697 10.9C4.01697 12.6 5.01697 14.1 6.51697 14.8L4.11697 21H5.01697Z" />
                  </svg>
                </div>
                <p className="text-slate-700 text-lg italic mb-6 relative z-10 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{t.author}</h4>
                    <p className="text-sm text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Contact Section */}
      <ContactSection />

      <Footer />
      
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
    </div>
  );
};

export default Training;
