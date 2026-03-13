import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";

const WhatsAppButton = () => {
  const { siteData } = useSiteData();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isBlinkingVisible, setIsBlinkingVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);

  // Clean the whatsapp number (remove spaces, plus signs, etc. for the wa.me link)
  const whatsappNumber = siteData.footer?.social?.whatsapp?.replace(/[^0-9]/g, '') || "1234567890";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle 5-second hide/show animation
  useEffect(() => {
    if (!hasScrolled) return;
    
    // Every 5 seconds, hide the button for 1 second, then show it again
    const interval = setInterval(() => {
      setIsBlinkingVisible(false);
      setTimeout(() => {
        setIsBlinkingVisible(true);
      }, 1000);
    }, 6000); // 5s visible + 1s hidden = 6s cycle

    return () => clearInterval(interval);
  }, [hasScrolled]);

  return (
    <AnimatePresence>
      {hasScrolled && isBlinkingVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3"
        >
          <AnimatePresence>
            {showTooltip && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, originX: 0, originY: 1 }}
                className="flex items-center gap-2 ml-1"
              >
                <button 
                  onClick={() => setShowTooltip(false)}
                  className="w-[22px] h-[22px] bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shrink-0"
                  aria-label="Close tooltip"
                >
                  <X size={12} strokeWidth={4} />
                </button>
                <a 
                  href={whatsappUrl} 
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white border-[1.5px] border-black rounded-full px-4 py-1.5 text-[15px] font-medium text-black shadow-[3px_3px_0px_#25D366] hover:shadow-[4px_4px_0px_#25D366] transition-all hover:-translate-y-0.5"
                >
                  Follow Our Channel
                </a>
              </motion.div>
            )}
          </AnimatePresence>
          
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-[52px] h-[52px] bg-[#25D366] rounded-full flex items-center justify-center text-white text-[30px] shadow-lg hover:scale-110 transition-transform"
            aria-label="Contact us on WhatsApp"
          >
            <i className="fa-brands fa-whatsapp"></i>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppButton;
