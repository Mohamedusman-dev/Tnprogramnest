import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";
import { useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
  const { siteData } = useSiteData(); 
  const footerData = siteData.footer;
  const navigate = useNavigate();
  const location = useLocation();

  const scrollTo = (item: string) => {
    if (item === "technology") {
      navigate('/technology');
      return;
    }

    const id = item.toLowerCase().replace(/\s+/g, "-");
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-slate-50 pt-10 pb-6 text-slate-900 mt-10 font-sans">
      {/* Subtle Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform -translate-y-full">
        <svg viewBox="0 0 1440 60" className="w-full h-[15px] md:h-[25px] block" preserveAspectRatio="none">
          <path fill="#f8fafc" d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-8 mb-8">
          
          {/* Column 1: Logo & Links */}
          <div>
            <span className="text-2xl font-bold font-display tracking-tight text-slate-900 mb-4 block">
              Tech<span className="text-primary">Nest</span>
            </span>
            <h3 className="text-base font-bold mb-3 text-slate-900">Explore</h3>
            <div className="grid grid-cols-2 gap-2">
              <ul className="space-y-2">
                <li><button onClick={() => scrollTo("home")} className="text-sm text-slate-600 hover:text-primary transition-colors">Home</button></li>
                <li><button onClick={() => scrollTo("about")} className="text-sm text-slate-600 hover:text-primary transition-colors">About Us</button></li>
                <li><button onClick={() => scrollTo("services")} className="text-sm text-slate-600 hover:text-primary transition-colors">Services</button></li>
              </ul>
              <ul className="space-y-2">
                <li><button onClick={() => scrollTo("technology")} className="text-sm text-slate-600 hover:text-primary transition-colors">Tech Stack</button></li>
                <li><button onClick={() => scrollTo("contact-us")} className="text-sm text-slate-600 hover:text-primary transition-colors">Contact</button></li>
                <li><a href="#" className="text-sm text-slate-600 hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>

          {/* Column 2: Newsletter */}
          <div>
            <h3 className="text-base font-bold mb-2 text-slate-900">Tech Insights</h3>
            <p className="text-sm text-slate-700 mb-2">{footerData?.newsletterText}</p>
            <p className="text-[11px] text-slate-500 mb-3 leading-snug pr-2">
              By subscribing, you agree to receive updates. Read our <a href="#" className="underline hover:text-slate-800">privacy policy</a>.
            </p>
            <form className="flex w-full shadow-sm" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="flex-1 px-3 py-2 text-sm border border-slate-300 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-slate-400 min-w-0"
                required
              />
              <button 
                type="submit" 
                className="bg-slate-900 text-white px-4 py-2 text-xs font-bold tracking-wider hover:bg-primary transition-colors whitespace-nowrap"
              >
                SIGN UP
              </button>
            </form>
          </div>

          {/* Column 3: Tags */}
          <div>
            <h3 className="text-base font-bold mb-3 text-slate-900">Expertise</h3>
            <div className="flex flex-wrap items-start content-start gap-2">
              {footerData?.tags?.map((tag) => (
                <a 
                  key={tag} 
                  href="#" 
                  className="border border-slate-200 bg-white text-slate-600 hover:text-primary hover:border-primary transition-colors px-2.5 py-1 rounded text-xs font-medium shadow-sm"
                >
                  {tag}
                </a>
              ))}
            </div>
          </div>

          {/* Column 4: Socials */}
          <div>
            <h3 className="text-base font-bold mb-3 text-slate-900">Connect</h3>
            <div className="flex gap-4 mb-4">
              <a href={footerData?.social?.facebook} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-primary transition-colors"><Facebook size={20} /></a>
              <a href={footerData?.social?.twitter} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-primary transition-colors"><Twitter size={20} /></a>
              <a href={footerData?.social?.linkedin} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-primary transition-colors"><Linkedin size={20} /></a>
              <a href={footerData?.social?.instagram} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-primary transition-colors"><Instagram size={20} /></a>
            </div>
            <a href="#" className="text-sm text-slate-700 font-medium underline hover:text-primary transition-colors">
              View our latest projects
            </a>
          </div>
          
        </div>

        {/* Bottom Copyright Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500 mt-6 pt-5 border-t border-slate-200">
          <div>
            <p className="mb-1">{footerData?.description || siteData.general.footerText}</p>
            <p>{footerData?.copyrightText}</p>
          </div>
          <div className="md:text-right">
            <p className="leading-relaxed">
              All trademarks are properties of their respective owners. <a href="#" className="underline hover:text-slate-800">Terms & Conditions</a>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
