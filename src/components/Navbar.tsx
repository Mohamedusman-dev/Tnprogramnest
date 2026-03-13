import { useState, useEffect } from "react";
import { Menu, X, Mail, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useSiteData } from "@/context/SiteDataContext";

const navItems = ["Home", "About", "Services", "Training Programs", "Technology", "Contact Us"];

const Navbar = () => {
  const { siteData } = useSiteData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isOverLight, setIsOverLight] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const lightSections = document.querySelectorAll('.bg-white, .bg-slate-50, .bg-\\[\\#f8f9fa\\], .tc-light-wrapper');
      let overLight = false;
      const navHeight = 100;

      lightSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= navHeight && rect.bottom >= navHeight) {
          overLight = true;
        }
      });

      setIsOverLight(overLight);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); 
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (item: string) => {
    setMobileOpen(false);
    
    // Route "Technology" to its own dedicated page
    if (item === "Technology") {
      navigate('/technology');
      return;
    }

    // Route "Training Programs" to its own dedicated page
    if (item === "Training Programs") {
      navigate('/training');
      return;
    }

    const id = item.toLowerCase().replace(/\s+/g, "-");
    
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleHireMeClick = () => {
    setMobileOpen(false);
    navigate('/careers');
  };

  const isAtTop = !scrolled;
  const isHomePage = location.pathname === "/";
  const isTechnologyPage = location.pathname === "/technology";
  const isTrainingPage = location.pathname === "/training";
  
  const useDarkText = (!isHomePage && !isTrainingPage && isAtTop) ? true : (isAtTop ? false : isOverLight);

  // Special case for pages which have a dark background at the top
  const finalUseDarkText = (isTechnologyPage || isTrainingPage) && isAtTop ? false : useDarkText;

  const navBgClass = isAtTop
    ? (isHomePage || isTechnologyPage || isTrainingPage ? "bg-transparent backdrop-blur-md border-b border-white/10" : "bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50")
    : isOverLight
    ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50" 
    : "bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-white/10"; 

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col transition-all duration-300">
      {/* Top Contact Bar */}
      <div 
        className={`w-full bg-[#063b5c] text-white transition-all duration-300 overflow-hidden hidden md:flex items-center ${
          scrolled ? 'h-0 opacity-0' : 'h-8 opacity-100'
        }`}
      >
        <div className="container mx-auto flex justify-between items-center px-4 md:px-8 text-[12px] md:text-[13px] font-medium tracking-wide">
          <div className="flex items-center gap-4 md:gap-6">
            <a href={`mailto:${siteData.general.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Mail size={14} /> <span className="hidden sm:inline">{siteData.general.email}</span>
            </a>
            <a href={`tel:${siteData.general.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Phone size={14} /> {siteData.general.phone}
            </a>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href={siteData.footer?.social?.twitter} target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-primary transition-colors"><i className="fa-brands fa-twitter"></i></a>
            <a href={siteData.footer?.social?.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-primary transition-colors"><i className="fa-brands fa-facebook-f"></i></a>
            <a href={siteData.footer?.social?.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-primary transition-colors"><i className="fa-brands fa-instagram"></i></a>
            <a href={siteData.footer?.social?.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-primary transition-colors"><i className="fa-brands fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`w-full transition-all duration-300 ${navBgClass}`}>
        <div className="container mx-auto flex items-center justify-between h-14 md:h-16 px-4 md:px-8 relative">
          
          <a href="/" className="flex items-center shrink-0 group ml-2 md:ml-6">
            <div className="transition-all duration-500 flex items-center justify-center px-1 py-1">
              <span className={`text-2xl md:text-3xl font-bold font-display tracking-tight transition-transform duration-300 group-hover:scale-105 ${finalUseDarkText ? 'text-slate-900' : 'text-white'}`}>
                Tech<span className="text-primary">Nest</span>
              </span>
            </div>
          </a>

          <div className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2 gap-8">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                className={`relative group text-sm transition-colors duration-300 ${
                  finalUseDarkText
                    ? "text-slate-900 hover:text-primary font-semibold" 
                    : "text-slate-100 hover:text-primary font-semibold" 
                }`}
              >
                {item}
                <span className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={handleHireMeClick}
                className="bg-[#0f4a9e] text-white hover:bg-[#0f4a9e]/90 text-sm rounded-lg px-6 py-2.5 font-bold shadow-md hover:shadow-xl hover:-translate-y-0.5 items-center justify-center transition-all"
              >
                Hire Me
              </button>
              
              <button
                onClick={handleHireMeClick}
                className="btn-17 text-sm shadow-md hover:shadow-xl transition-all"
              >
                <span className="text-container">
                  <span className="text flex items-center gap-1.5 tracking-wide">
                    Let&apos;s <span className="text-[#facc15]">Build Your Idea</span>
                  </span>
                </span>
              </button>
            </div>

            <button
              className={`lg:hidden p-2 -mr-2 flex items-center justify-center transition-colors duration-300 ${
                finalUseDarkText ? "text-slate-900 hover:text-primary" : "text-white hover:text-primary"
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`lg:hidden border-t overflow-hidden ${
                finalUseDarkText 
                  ? "bg-white/95 backdrop-blur-xl border-slate-200 shadow-lg" 
                  : "bg-slate-900/95 backdrop-blur-xl border-slate-800 shadow-lg"
              }`}
            >
              <div className="container mx-auto py-4 px-4 flex flex-col gap-3">
                {navItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollTo(item)}
                    className={`text-left py-2 transition-colors duration-300 ${
                      finalUseDarkText
                        ? "text-slate-900 hover:text-primary font-semibold" 
                        : "text-slate-100 hover:text-primary font-semibold"
                    }`}
                  >
                    {item}
                  </button>
                ))}
                <div className="flex flex-col gap-3 mt-2">
                  <button
                    onClick={handleHireMeClick}
                    className="bg-[#0f4a9e] text-white hover:bg-[#0f4a9e]/90 text-sm rounded-lg px-6 py-3 font-bold shadow-md flex items-center justify-center transition-all w-fit"
                  >
                    Hire Me
                  </button>
                  
                  <button
                    onClick={handleHireMeClick}
                    className="btn-17 text-sm w-fit shadow-md transition-all"
                  >
                    <span className="text-container">
                      <span className="text flex items-center gap-1.5 tracking-wide">
                        Let&apos;s <span className="text-[#facc15]">Build Your Idea</span>
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;
