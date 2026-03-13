import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollReveal } from "./useScrollReveal";
import { GlowBackground } from "./GlowBackground";

const ecommerceData = [
  {
    id: "shopify",
    label: "Shopify",
    title: "Scale your store with Shopify",
    desc: "As Shopify Partners, we help you build robust online stores. We handle theme customization, app integration, and optimization so you can sell more products effortlessly.",
    iconClass: "fa-brands fa-shopify",
    iconColor: "#96bf48",
    navName: "Shopify Partners",
  },
  {
    id: "woocommerce",
    label: "WooCommerce",
    title: "Flexible selling with WooCommerce",
    desc: "Turn your WordPress site into a selling machine. We provide expert customization for WooCommerce, managing plugins and payment gateways for a seamless checkout experience.",
    iconClass: "fa-brands fa-wordpress-simple",
    iconColor: "#9b5c8f",
    navName: "WooCommerce Experts",
  },
  {
    id: "magento",
    label: "Magento",
    title: "Enterprise Power with Magento",
    desc: "For large scale operations, Magento is key. We offer Adobe Commerce solutions that handle complex inventories and high traffic with ease and security.",
    iconClass: "fa-brands fa-magento",
    iconColor: "#f26322",
    navName: "Magento Partners",
  },
  {
    id: "wpengine",
    label: "WordPress",
    title: "WordPress fuels your ecommerce, websites, and more",
    desc: "Our WPEngine Partners service is perfect! We focus on speeding up and securing your WordPress site hosted on WPEngine. You can concentrate on your content while we handle the techie parts to keep your site running well.",
    iconClass: "fa-solid fa-cube",
    iconColor: "#0ecad4",
    navName: "WPEngine Partners",
  },
  {
    id: "webflow",
    label: "Webflow",
    title: "Design freedom with Webflow",
    desc: "Get pixel-perfect designs without the code bloat. As Webflow Experts, we create stunning visual experiences and animations that capture your brand perfectly.",
    iconClass: "fa-solid fa-w",
    iconColor: "#4353ff",
    navName: "Webflow Experts",
  },
  {
    id: "bigcommerce",
    label: "BigCommerce",
    title: "Open SaaS with BigCommerce",
    desc: "We help you leverage the flexibility of BigCommerce to create unique shopping experiences that drive conversion and customer loyalty.",
    iconClass: "fa-solid fa-b",
    iconColor: "#333",
    navName: "BigCommerce Partners",
  },
  {
    id: "wix",
    label: "Wix",
    title: "Stunning simplicity with Wix",
    desc: "We build beautiful, functional Wix websites quickly. Perfect for small businesses needing a professional presence without the technical headache.",
    iconClass: "fa-brands fa-wix",
    iconColor: "#000",
    navName: "Wix Partners",
  },
  {
    id: "squarespace",
    label: "Squarespace",
    title: "Elegant designs with Squarespace",
    desc: "Showcase your portfolio or products with our custom Squarespace designs. We ensure your site looks amazing on every device, mobile or desktop.",
    iconClass: "fa-brands fa-squarespace",
    iconColor: "#000",
    navName: "Squarespace",
  },
];

const EcommerceSolutionsSection = () => {
  const [activeTab, setActiveTab] = useState("shopify");
  const { ref, isVisible } = useScrollReveal();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setInterval(() => {
      setActiveTab((currentTab) => {
        const currentIndex = ecommerceData.findIndex((d) => d.id === currentTab);
        const nextIndex = (currentIndex + 1) % ecommerceData.length;
        return ecommerceData[nextIndex].id;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [isVisible]);

  const activeData = ecommerceData.find((d) => d.id === activeTab) || ecommerceData[0];

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 tc-wrapper relative overflow-hidden font-sans" ref={ref}>
      <GlowBackground />
      
      <div className="container mx-auto max-w-[1200px] relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="bg-white text-slate-900 text-[0.65rem] sm:text-[0.7rem] md:text-[0.8rem] font-bold px-3 py-1.5 rounded uppercase tracking-wider inline-block mb-3 sm:mb-4">
            INNOVATIVE ECOMMERCE SERVICE SOLUTIONS
          </span>
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold mb-2 sm:mb-3 text-white">
            We help with design, setup, and support
          </h2>
          <p className="text-slate-400 text-xs sm:text-base md:text-lg">Watch your sales go up with our help</p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Side: Dynamic Content Display */}
          <div className="min-h-[200px] sm:min-h-[280px] md:min-h-[350px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeData.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <span className="font-bold text-[var(--primary-tc)] mb-2 block text-xs sm:text-sm md:text-base">{activeData.label}</span>
                <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-[2.8rem] font-semibold leading-[1.2] mb-3 md:mb-5 text-white">
                  {activeData.title}
                </h3>
                <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed mb-5 md:mb-8">
                  {activeData.desc}
                </p>
                <button 
                  onClick={() => navigate('/careers')}
                  className="bg-[#0f4a9e] hover:bg-[#0f4a9e]/90 text-white px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-full font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-[0_0_15px_rgba(15,74,158,0.5)] text-sm md:text-base"
                >
                  Hire Me
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side: Navigation Grid - Now 2 columns on mobile! */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="tc-card-body p-3 sm:p-4 md:p-5 grid grid-cols-2 gap-2 sm:gap-3 md:gap-4"
          >
            {ecommerceData.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center p-2 sm:p-3 md:p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                  activeTab === item.id
                    ? "bg-[var(--primary-15)] text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] border-[var(--primary-tc)] scale-[1.02]"
                    : "border-transparent text-slate-400 hover:bg-[var(--primary-08)]"
                }`}
              >
                <div className="text-lg sm:text-xl md:text-2xl mr-2 sm:mr-3 md:mr-4 w-5 sm:w-6 md:w-8 text-center flex justify-center shrink-0">
                  <i className={item.iconClass} style={{ color: item.iconColor }}></i>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-[0.65rem] sm:text-[0.8rem] md:text-[0.9rem] mb-0.5 sm:mb-1 truncate">{item.navName}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="fill-amber-400 text-amber-400 w-2 h-2 sm:w-3 sm:h-3" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default EcommerceSolutionsSection;
