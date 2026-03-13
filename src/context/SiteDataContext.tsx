import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export type Testimonial = {
  id: string;
  name: string;
  company: string;
  text: string;
  rating: number;
};

export type TeamTestimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
  rating: number;
};

export type ChatbotQA = {
  id: string;
  keywords: string[];
  answer: string;
};

export type ServiceItem = {
  id: string;
  title: string;
  desc: string;
  iconUrl: string;
};

export type ProductItem = {
  id: string;
  title: string;
  desc: string;
  iconUrl: string;
  category: 'left' | 'right';
};

export type JobItem = {
  id: string;
  title: string;
  category?: string;
  salary: string;
  type: string;
  desc: string;
  requirements: string[];
  location: string;
  iconUrl: string;
  publishDate?: string;
  skills?: string;
  experience?: string;
  education?: string;
  responsibilities?: string[];
  applyLink?: string;
};

export type IndustryStat = {
  label: string;
  value: string;
};

export type IndustryItem = {
  id: string;
  label: string;
  image: string;
  description: string;
  bullets: string[];
  caseStudy: {
    title: string;
    description: string;
    stats: IndustryStat[];
  };
  testimonial: {
    quote: string;
    author: string;
    role: string;
  };
};

export type SiteData = {
  general: {
    logoUrl: string;
    chatbotIconUrl?: string;
    email: string;
    phone: string;
    address: string;
    footerText: string;
  };
  hero: {
    title: string;
    highlight: string;
    miniDescription?: string;
    description: string;
  };
  about: {
    title: string;
    highlight: string;
    description: string;
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
  services: ServiceItem[];
  products: ProductItem[];
  jobs: JobItem[];
  industries: IndustryItem[];
  testimonials: Testimonial[];
  teamTestimonials: TeamTestimonial[];
  chatbot: ChatbotQA[];
  footer: {
    description: string;
    newsletterText: string;
    tags: string[];
    copyrightText: string;
    social: {
      facebook: string;
      twitter: string;
      linkedin: string;
      instagram: string;
      whatsapp: string;
    };
  };
};

const defaultData: SiteData = {
  general: {
    logoUrl: "https://images.dualite.app/a6d4e8ab-0637-401c-aa19-5a07a216a4c1/asset-4b236b1b-285d-4dab-8f78-adb7c236d581.webp",
    chatbotIconUrl: "https://cdn.iconscout.com/icon/premium/png-512-thumb/chatbot-icon-svg-download-png-7186374.png?f=webp&w=512",
    email: "hello@technest.dev",
    phone: "+1 (555) 123-4567",
    address: "123 Innovation Drive, Suite 400\nSan Francisco, CA 94105",
    footerText: "TechNest is run by a dedicated team of developers, designers, and strategists, with help from our amazing clients!",
  },
  hero: {
    title: "Building Digital Solutions That",
    highlight: "Drive Growth",
    miniDescription: "Empowering modern enterprises with scalable architecture, intuitive design, and robust engineering to accelerate your digital transformation journey.",
    description: "We help businesses grow with cutting-edge digital marketing, custom web applications, mobile apps, and full-stack development. From startups to enterprises, we bring your vision to life.",
  },
  about: {
    title: "Your Trusted Partner in",
    highlight: "Digital Transformation",
    description: "At TechNest, we combine strategic thinking with technical excellence to deliver digital solutions that matter. With 8+ years of experience, 50+ expert developers, and a portfolio spanning 500+ successful projects, we've earned the trust of businesses worldwide."
  },
  cta: {
    title: "Engineer Unmatched Quality with Intelligent AI Solutions",
    description: "Stop playing catch-up. Lead the market with our AI solutions that help you anticipate and solve challenges before they even arise.",
    buttonText: "Start Your Project"
  },
  services: [
    { id: crypto.randomUUID(), title: "Full Stack Development", desc: "We have amassed unmatched expertise dealing with both front-end and back-end technologies for full-stack development.", iconUrl: "" },
    { id: crypto.randomUUID(), title: "Mobile App Development", desc: "We build superior mobile apps or revamp your existing mobile application with customizable project modifications.", iconUrl: "" },
    { id: crypto.randomUUID(), title: "Web Application Development", desc: "Our web design and development company provides top-tier web design services aimed at enhancing our clients' online visibility.", iconUrl: "" },
    { id: crypto.randomUUID(), title: "E-commerce Development", desc: "We develop scalable solutions with excellent user experiences, smart designs, and robust and seamless online E-commerce stores.", iconUrl: "" },
    { id: crypto.randomUUID(), title: "Digital Marketing Services", desc: "Our expert team will elevate your digital presence, ensuring your brand shines brilliantly in the online business success.", iconUrl: "" },
    { id: crypto.randomUUID(), title: "Product Development", desc: "Develop your custom digital product and unique business offering with our robust and reliable Product development services.", iconUrl: "" },
  ],
  products: [
    { id: crypto.randomUUID(), title: "Software Development", desc: "Custom software solutions tailored to your specific business needs and workflows.", category: "left", iconUrl: "" },
    { id: crypto.randomUUID(), title: "Prototyping", desc: "Rapid prototyping to visualize your ideas and validate concepts before full-scale development.", category: "left", iconUrl: "" },
    { id: crypto.randomUUID(), title: "Web Development", desc: "Responsive and modern websites built with the latest technologies for impactful online presence.", category: "left", iconUrl: "" },
    { id: crypto.randomUUID(), title: "Apps Development", desc: "Native and cross-platform mobile applications that engage users and drive growth.", category: "right", iconUrl: "" },
    { id: crypto.randomUUID(), title: "Digital Marketing", desc: "Strategic marketing campaigns to increase brand visibility and reach your target audience.", category: "right", iconUrl: "" },
    { id: crypto.randomUUID(), title: "Project Management", desc: "Efficient project planning and execution to ensure timely delivery and quality results.", category: "right", iconUrl: "" },
  ],
  jobs: [
    {
      id: crypto.randomUUID(),
      title: "React Developer (Senior)",
      category: "Engineering",
      salary: "Not Disclosed",
      type: "Full Time",
      desc: "We are seeking a talented and experienced Front End Developer with a strong focus on React JS to join our dynamic team.",
      requirements: ["5+ years experience in web development", "Expert in React, Vue.js, or Angular", "Strong knowledge of HTML5, CSS3, JavaScript", "Experience with responsive design"],
      location: "Patna",
      iconUrl: "",
      publishDate: "22-Oct-2024",
      skills: "Front-end frameworks (React), Knowledge of cloud services (AWS, Azure, Google), Figma, Adobe XD, HTML5, CSS3, and JavaScript and User Interface Design",
      experience: "Minimum of 3 Years",
      education: "Bachelor's degree in Computer Science, Information Technology, or a related field.",
      applyLink: "",
      responsibilities: [
        "Develop user interfaces with a strong emphasis on usability and responsive design using React JS.",
        "Collaborate with UI/UX designers to implement responsive and visually appealing designs.",
        "Ensure cross-browser compatibility and optimize applications for maximum speed and scalability."
      ]
    }
  ],
  industries: [
    {
      id: "ecommerce", 
      label: "E-commerce",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      description: "Custom online stores with seamless checkout and inventory management.",
      bullets: ["Custom storefront & product catalog", "Seamless checkout & payment integration", "Inventory & order management", "Analytics & conversion optimization"],
      caseStudy: { title: "AI-Powered Product Recommendations Boost Sales", description: "Implementing smart product suggestions increased average order value and improved customer retention.", stats: [{ label: "Revenue Growth", value: "+45%" }, { label: "Customer Retention", value: "+30%" }] },
      testimonial: { quote: "Their e-commerce expertise transformed our online presence and doubled our conversion rates.", author: "Sarah Chen", role: "CEO, ShopWave Digital" }
    },
    {
      id: "healthcare", 
      label: "Healthcare",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
      description: "HIPAA-compliant solutions for telehealth, EHR, and patient management.",
      bullets: ["Telehealth & virtual consultations", "EHR/EMR system integrations", "Patient portal & scheduling", "HIPAA-compliant data handling"],
      caseStudy: { title: "Telehealth Platform Reduces Wait Times by 60%", description: "A comprehensive virtual care solution streamlined patient-doctor interactions.", stats: [{ label: "Wait Time Reduced", value: "60%" }, { label: "Patient Satisfaction", value: "95%" }] },
      testimonial: { quote: "They delivered a HIPAA-compliant platform that our patients and doctors love using daily.", author: "Dr. James Morrison", role: "CTO, MedConnect Health" }
    },
    {
      id: "education", 
      label: "Education",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop",
      description: "LMS platforms, e-learning apps, and virtual classroom solutions.",
      bullets: ["Learning management systems", "Interactive virtual classrooms", "Student progress tracking", "Content authoring & delivery"],
      caseStudy: { title: "Virtual Classroom Increases Student Engagement", description: "An immersive learning platform with real-time collaboration tools transformed remote education.", stats: [{ label: "Engagement Up", value: "+70%" }, { label: "Completion Rate", value: "92%" }] },
      testimonial: { quote: "The platform revolutionized how we deliver education to students across the country.", author: "Prof. Maria Gonzalez", role: "Director, EduTech Academy" }
    },
    {
      id: "realestate", 
      label: "Real Estate",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
      description: "Property listings, CRM tools, and virtual tour integrations.",
      bullets: ["Property listing & search portals", "CRM & lead management", "Virtual tour integrations", "Transaction management tools"],
      caseStudy: { title: "Smart CRM Doubles Agent Productivity", description: "An integrated CRM with AI-powered lead scoring helped agents close deals faster.", stats: [{ label: "Productivity", value: "2x" }, { label: "Lead Conversion", value: "+55%" }] },
      testimonial: { quote: "Our agents now close deals 40% faster thanks to the intelligent CRM platform.", author: "Robert Kim", role: "VP Operations, PrimeRealty Group" }
    },
    {
      id: "finance", 
      label: "Finance",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
      description: "Fintech solutions, banking apps, and secure payment platforms.",
      bullets: ["Digital banking & wallet solutions", "Payment gateway integrations", "Regulatory compliance (PCI-DSS)", "Real-time analytics dashboards"],
      caseStudy: { title: "Mobile Banking App Reaches 1M Users", description: "A secure, intuitive mobile banking experience drove rapid user adoption.", stats: [{ label: "User Adoption", value: "1M+" }, { label: "Transaction Speed", value: "+80%" }] },
      testimonial: { quote: "They built a secure fintech platform that our customers trust with their financial data.", author: "Lisa Park", role: "CTO, FinEdge Solutions" }
    },
    {
      id: "travel", 
      label: "Travel & Tourism",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop",
      description: "Booking engines, itinerary planners, and travel management systems.",
      bullets: ["Booking & reservation engines", "Itinerary planning tools", "Travel management platforms", "Multi-language & currency support"],
      caseStudy: { title: "Smart Booking Engine Increases Conversions", description: "An AI-driven booking platform with personalized recommendations improved travel planning.", stats: [{ label: "Bookings Up", value: "+50%" }, { label: "User Satisfaction", value: "98%" }] },
      testimonial: { quote: "The booking platform they built handles millions of searches with lightning speed.", author: "David Lee", role: "Founder, TravelSmart Co." }
    },
    {
      id: "logistics", 
      label: "Logistics",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop",
      description: "Fleet tracking, warehouse management, and supply chain optimization.",
      bullets: ["Fleet tracking & route optimization", "Warehouse management systems", "Supply chain visibility", "Last-mile delivery solutions"],
      caseStudy: { title: "Route Optimization Cuts Delivery Costs", description: "AI-powered routing reduced fuel costs and delivery times across a nationwide fleet.", stats: [{ label: "Cost Reduction", value: "35%" }, { label: "On-Time Delivery", value: "99%" }] },
      testimonial: { quote: "Their logistics platform gave us complete visibility across our entire supply chain.", author: "Mark Thompson", role: "COO, SwiftShip Logistics" }
    },
    {
      id: "saas", 
      label: "Startups & SaaS",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
      description: "MVP development, rapid prototyping, and scalable SaaS architecture.",
      bullets: ["MVP development & validation", "Rapid prototyping & iteration", "Scalable SaaS architecture", "CI/CD & DevOps setup"],
      caseStudy: { title: "MVP to Market in 8 Weeks", description: "Rapid prototyping and agile development helped a startup launch and secure Series A funding.", stats: [{ label: "Time to Market", value: "8 weeks" }, { label: "Funding Raised", value: "$5M" }] },
      testimonial: { quote: "They turned our idea into a production-ready SaaS product in record time.", author: "Alex Rivera", role: "CEO, LaunchPad.io" }
    }
  ],
  testimonials: [
    { id: crypto.randomUUID(), name: "Sarah Mitchell", company: "NovaTech Inc.", text: "TechNest transformed our outdated platform into a sleek, high-performing web app. Their team's expertise and professionalism exceeded our expectations.", rating: 5 },
    { id: crypto.randomUUID(), name: "James Rodriguez", company: "GreenLeaf Health", text: "Working with TechNest was a game-changer. They delivered our healthcare app on time, within budget, and with exceptional quality.", rating: 5 },
  ],
  teamTestimonials: [
    {
      id: crypto.randomUUID(),
      name: "Om Prakash",
      role: "Manager",
      quote: "The company fosters a culture of continuous learning. There are opportunities to learn from experienced colleagues and stay up-to-date on industry trends",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
      rating: 5
    },
    {
      id: crypto.randomUUID(),
      name: "Gauri Shankar Prasad",
      role: "HOD, iOS Dept.",
      quote: "The collaborative tools and processes implemented here streamline teamwork and communication. This allows us to work efficiently and achieve results quickly.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
      rating: 5
    }
  ],
  chatbot: [
    { id: crypto.randomUUID(), keywords: ["service", "offer", "do you do", "what can you"], answer: "We offer Full Stack Development, Mobile App Development, Web Development, E-commerce Solutions, and Digital Marketing." },
    { id: crypto.randomUUID(), keywords: ["price", "cost", "quote", "estimate", "much"], answer: "Our pricing is project-based and highly competitive. Please leave your email or use the Contact Us form for a custom quote!" },
  ],
  footer: {
    description: "TechNest is run by a dedicated team of developers, designers, and strategists, with help from our amazing clients!",
    newsletterText: "Get a free consultation on sign up!",
    tags: ["Web Dev", "Mobile Apps", "UI/UX", "React", "Node.js", "SEO", "E-commerce", "SaaS", "Cloud", "Marketing", "AI Solutions"],
    copyrightText: `Copyright © ${new Date().getFullYear()}, TechNest, LLC.`,
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#",
      instagram: "#",
      whatsapp: "1234567890"
    }
  }
};

type SiteDataContextType = {
  siteData: SiteData;
  isLoading: boolean;
  updateSection: (key: keyof Omit<SiteData, 'testimonials' | 'chatbot'>, data: any) => Promise<void>;
  updateTestimonials: (data: Testimonial[]) => Promise<void>;
  updateChatbot: (data: ChatbotQA[]) => Promise<void>;
  refreshData: () => Promise<void>;
};

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

export const SiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteData, setSiteData] = useState<SiteData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [settingsRes, testimonialsRes, chatbotRes] = await Promise.all([
        supabase.from('site_settings').select('*'),
        supabase.from('testimonials').select('*').order('created_at', { ascending: true }),
        supabase.from('chatbot_knowledge').select('*').order('created_at', { ascending: true })
      ]);

      const getSetting = (key: string, fallback: any) => {
        const found = settingsRes.data?.find(s => s.key === key);
        return found ? found.value : fallback;
      };

      setSiteData({
        general: getSetting('general', defaultData.general),
        hero: getSetting('hero', defaultData.hero),
        about: getSetting('about', defaultData.about),
        cta: getSetting('cta', defaultData.cta),
        services: getSetting('services', defaultData.services),
        products: getSetting('products', defaultData.products),
        jobs: getSetting('jobs', defaultData.jobs),
        industries: getSetting('industries', defaultData.industries),
        footer: getSetting('footer', defaultData.footer),
        teamTestimonials: getSetting('teamTestimonials', defaultData.teamTestimonials),
        testimonials: testimonialsRes.data?.length ? testimonialsRes.data : defaultData.testimonials,
        chatbot: chatbotRes.data?.length ? chatbotRes.data : defaultData.chatbot
      });
    } catch (error) {
      console.error("Error fetching data from Supabase:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const updateSection = async (key: keyof Omit<SiteData, 'testimonials' | 'chatbot'>, data: any) => {
    const newData = Array.isArray(data) ? data : { ...siteData[key], ...data };
    await supabase.from('site_settings').upsert({ key, value: newData });
    setSiteData(prev => ({ ...prev, [key]: newData }));
  };

  const updateTestimonials = async (newData: Testimonial[]) => {
    const { data: current } = await supabase.from('testimonials').select('id');
    const currentIds = current?.map(c => c.id) || [];
    const newIds = newData.map(n => n.id);
    const toDelete = currentIds.filter(id => !newIds.includes(id));
    
    if (toDelete.length > 0) {
      await supabase.from('testimonials').delete().in('id', toDelete);
    }
    
    if (newData.length > 0) {
      const payload = newData.map(n => ({
        id: n.id,
        name: n.name,
        company: n.company,
        text: n.text,
        rating: n.rating
      }));
      await supabase.from('testimonials').upsert(payload);
    }
    await refreshData();
  };

  const updateChatbot = async (newData: ChatbotQA[]) => {
    const { data: current } = await supabase.from('chatbot_knowledge').select('id');
    const currentIds = current?.map(c => c.id) || [];
    const newIds = newData.map(n => n.id);
    const toDelete = currentIds.filter(id => !newIds.includes(id));
    
    if (toDelete.length > 0) {
      await supabase.from('chatbot_knowledge').delete().in('id', toDelete);
    }
    
    if (newData.length > 0) {
      const payload = newData.map(n => ({
        id: n.id,
        keywords: n.keywords,
        answer: n.answer
      }));
      await supabase.from('chatbot_knowledge').upsert(payload);
    }
    await refreshData();
  };

  return (
    <SiteDataContext.Provider value={{ siteData, isLoading, updateSection, updateTestimonials, updateChatbot, refreshData }}>
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (!context) throw new Error("useSiteData must be used within a SiteDataProvider");
  return context;
};
