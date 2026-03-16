import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";
import { useScrollReveal } from "./useScrollReveal";
import { useNavigate } from "react-router-dom";

// Helper function to map technology names to their respective logos
const getTechLogo = (techName: string) => {
  const normalized = techName.toLowerCase().trim();
  const map: Record<string, string> = {
    'react': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    'react native': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    'next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
    'node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    'django': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',
    'postgresql': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    'mysql': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
    'mongodb': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    'aws': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
    'tailwind': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
    'stripe': 'https://cdn.iconscout.com/icon/free/png-256/free-stripe-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-company-brand-vol-6-pack-logos-icons-2945170.png?f=webp&w=256',
    'openai': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
    'express.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
    'vercel': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg',
    'firebase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
    'google maps': 'https://cdn.iconscout.com/icon/free/png-256/free-google-maps-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-company-brand-vol-3-pack-logos-icons-2944983.png?f=webp&w=256',
    'supabase': 'https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png',
    'angular': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
    'vue.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
    'php': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
    'laravel': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg',
    'flutter': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
    'swift': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
    'kotlin': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
    'docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
    'kubernetes': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
    'figma': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
    'wordpress': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg',
    'shopify': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/shopify/shopify-original.svg',
    'woocommerce': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/woocommerce/woocommerce-original.svg',
    'magento': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/magento/magento-original.svg',
  };
  return map[normalized] || null;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed": return "text-[#059669] bg-[#ecfdf5] border-[#a7f3d0]"; // Emerald
    case "In Progress": return "text-[#d97706] bg-[#fffbeb] border-[#fde68a]"; // Amber
    case "Coming Soon": return "text-[#2563eb] bg-[#eff6ff] border-[#bfdbfe]"; // Blue
    default: return "text-slate-600 bg-slate-50 border-slate-200";
  }
};

const TechStackRenderer = ({ techStack }: { techStack: string[] }) => (
  <div className="flex flex-wrap gap-2">
    {techStack.map(tech => {
      const logo = getTechLogo(tech);
      return (
        <div 
          key={tech} 
          className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-full text-[11px] font-medium text-slate-700 shadow-sm hover:shadow-md transition-shadow"
        >
          {logo && <img src={logo} alt={tech} className="w-3.5 h-3.5 object-contain" />}
          <span>{tech}</span>
        </div>
      );
    })}
  </div>
);

const HomePortfolioSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { siteData } = useSiteData();
  const navigate = useNavigate();
  
  // Get only the first 3 projects
  const projects = (siteData.portfolioProjects || []).slice(0, 3);

  if (projects.length === 0) return null;

  return (
    <section className="py-10 md:py-16 bg-white" ref={ref}>
      <div className="container mx-auto px-4 max-w-[1200px]">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">Our Portfolio</h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-4"></div>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed px-4">
            Discover how we've transformed ideas into powerful digital solutions. Browse through our latest projects showcasing our expertise in web, mobile, and custom software development.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => navigate('/portfolio')}
              className="bg-white rounded-[20px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col group cursor-pointer"
            >
              {/* Image Area with Light Blue Background */}
              <div className="relative bg-[#f4f9ff] p-5 pt-14 pb-6 rounded-t-[20px] flex items-center justify-center">
                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-[#0ea5e9] text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full z-10 shadow-sm">
                  {p.category}
                </div>
                
                {/* Image Container */}
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.1)] group-hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-full h-full absolute inset-0 portfolio-img-scroll" style={{ backgroundImage: `url(${p.image})` }}></div>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6 flex flex-col flex-1 bg-white rounded-b-[20px]">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h4 className="text-xl font-bold text-slate-900 leading-tight">{p.title}</h4>
                  <span className={`px-3 py-1 border rounded-full text-[10px] font-bold whitespace-nowrap ${getStatusColor(p.status)}`}>
                    {p.status}
                  </span>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < (p.rating || 5) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"} />
                  ))}
                </div>
                <p className="text-sm text-slate-500 mb-6 line-clamp-2 flex-1 leading-relaxed">{p.description}</p>
                <div className="mt-auto">
                  <TechStackRenderer techStack={p.techStack} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <button 
            onClick={() => navigate('/portfolio')}
            className="text-primary font-semibold hover:underline flex items-center gap-2 mx-auto"
          >
            View Full Portfolio <ArrowRight size={16} />
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default HomePortfolioSection;
