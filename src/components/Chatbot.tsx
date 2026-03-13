import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, Send } from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";

const suggestions = [
  "What services do you offer?",
  "How much does it cost?",
  "Do you build mobile apps?",
  "Can I hire developers?",
  "What is your tech stack?",
  "How long does a project take?",
  "How can I contact you?"
];

const Chatbot = () => {
  const { siteData } = useSiteData(); 
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! 👋 I'm the TechNest assistant. How can I help you today?", isBot: true }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll detection for both button position and auto-open logic
  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Move button up when scrolled down (to avoid overlapping with footer/whatsapp)
      setIsScrolled(currentScrollY > 400);

      // Auto-open logic: Open when scrolled past ~70% of viewport height (Hero section)
      if (currentScrollY > window.innerHeight * 0.7 && !hasAutoOpened) {
        setIsOpen(true);
        setHasAutoOpened(true); // Ensure it only auto-opens once per session
      }
    };

    window.addEventListener("scroll", onScroll);
    // Run once on mount in case they refresh while already scrolled down
    onScroll(); 
    
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasAutoOpened]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const findAnswer = (text: string) => {
    const lowerText = text.toLowerCase();
    for (const qa of siteData.chatbot) {
      if (qa.keywords.some((kw) => lowerText.includes(kw.toLowerCase()))) {
        return qa.answer;
      }
    }
    // Updated fallback message as requested
    return "Sorry, I couldn't find that on our website. Please share your details, and the TechNest team will contact you soon!";
  };

  const handleSendText = (text: string) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), text, isBot: false };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const answer = findAnswer(text);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: answer, isBot: true },
      ]);
    }, 1200); 
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendText(input);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleManualOpen = () => {
    setIsOpen(true);
    setHasAutoOpened(true); // If they open it manually, don't auto-open it later
  };

  const bottomPositionClass = isScrolled ? "bottom-24" : "bottom-6";
  const iconUrl = siteData.general.chatbotIconUrl || "https://cdn.iconscout.com/icon/premium/png-512-thumb/chatbot-icon-svg-download-png-7186374.png?f=webp&w=512";

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleManualOpen}
            className={`fixed right-6 z-50 w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.15)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.25)] transition-all duration-300 ease-in-out ${bottomPositionClass}`}
            aria-label="Open Chat"
          >
            <img 
              src={iconUrl} 
              alt="Chatbot Icon" 
              className="w-8 h-8 object-contain"
            />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: 0, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, x: 100, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.6 }}
            onDragEnd={(e, info: PanInfo) => {
              // Close if swiped right by more than 100px or with high velocity
              if (info.offset.x > 100 || info.velocity.x > 500) {
                handleClose();
              }
            }}
            className={`fixed right-6 z-[60] w-[350px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col font-sans transition-all duration-300 ease-in-out ${bottomPositionClass}`}
          >
            {/* Drag Handle Indicator (Optional visual cue for users) */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/30 rounded-full z-20 cursor-grab active:cursor-grabbing" />

            <div className="bg-primary p-4 pt-5 flex items-center justify-between text-white shadow-sm z-10 cursor-grab active:cursor-grabbing">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm overflow-hidden p-1">
                  <img 
                    src={iconUrl} 
                    alt="Bot" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-[15px] leading-tight">TechNest Support</h3>
                  <p className="text-[11px] text-white/80 mt-0.5">Typically replies instantly</p>
                </div>
              </div>
              <button 
                onClick={handleClose} 
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close Chat"
              >
                <X size={20} />
              </button>
            </div>

            <div className="h-[320px] overflow-y-auto p-4 bg-slate-50 flex flex-col gap-4 touch-pan-y">
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  key={msg.id} 
                  className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 text-[13px] leading-relaxed shadow-sm ${
                      msg.isBot
                        ? "bg-white border border-slate-100 text-slate-800 rounded-2xl rounded-tl-sm"
                        : "bg-primary text-white rounded-2xl rounded-tr-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm p-4 flex gap-1.5 items-center shadow-sm">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-3 py-2.5 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSendText(s)}
                  className="whitespace-nowrap text-[11px] font-medium bg-slate-50 hover:bg-primary/10 hover:text-primary text-slate-600 px-3 py-1.5 rounded-full transition-colors border border-slate-200"
                >
                  {s}
                </button>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Send size={18} className="ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
