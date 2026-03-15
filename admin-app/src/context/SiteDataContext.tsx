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

export type TrainingProgram = {
  id: string;
  title: string;
  duration: string;
  audience: string;
  mode: string;
  iconName: string;
  desc: string;
};

export type TrainingFormat = {
  id: string;
  title: string;
  iconName: string;
};

export type InstitutionTestimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
};

export type StatItem = {
  value: number;
  suffix: string;
  label: string;
  icon?: string;
};

export type ServicePageData = {
  industries: { label: string; desc: string }[];
  portfolio: { id: number; image: string }[];
  faqs: { q: string; a: string }[];
};

export type SiteData = {
  general: {
    logoUrl: string;
    chatbotIconUrl?: string;
    chatbotBgUrl?: string;
    chatbotSuggestions?: string[];
    email: string;
    phone: string;
    address: string;
    footerText: string;
    stats: {
      hero: StatItem[];
      about: StatItem[];
      training: StatItem[];
    };
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
  
  // Service Pages Data
  servicePages: Record<string, ServicePageData>;
  
  // Training Page Data
  trainingPrograms: TrainingProgram[];
  trainingTopics: string[];
  trainingAudiences: string[];
  trainingFormats: TrainingFormat[];
  trainingGallery: string[];
  trainingTestimonials: InstitutionTestimonial[];

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
    chatbotBgUrl: "https://images.dualite.app/a3049960-8f3c-4a3e-9330-d77f518d0627/asset-ba1c0277-0885-44dd-a846-710add5dc689.webp",
    chatbotSuggestions: [
      "What services do you offer?",
      "How much does it cost?",
      "Do you build mobile apps?",
      "Can I hire developers?",
      "What is your tech stack?",
      "How long does a project take?",
      "How can I contact you?"
    ],
    email: "hello@technest.dev",
    phone: "+1 (555) 123-4567",
    address: "123 Innovation Drive, Suite 400\nSan Francisco, CA 94105",
    footerText: "TechNest is run by a dedicated team of developers, designers, and strategists, with help from our amazing clients!",
    stats: {
      hero: [
        { value: 359, suffix: "+", label: "Projects Delivered", icon: "Briefcase" },
        { value: 216, suffix: "+", label: "Happy Clients", icon: "Users" },
        { value: 5, suffix: "+", label: "Years of Experience", icon: "Award" },
        { value: 36, suffix: "+", label: "Expert Developers", icon: "Code2" },
      ],
      about: [
        { value: 500, suffix: "+", label: "Projects" },
        { value: 300, suffix: "+", label: "Clients" },
        { value: 8, suffix: "+", label: "Years" },
        { value: 98, suffix: "%", label: "Satisfaction" },
      ],
      training: [
        { value: 10, suffix: "+", label: "Workshops Conducted" },
        { value: 500, suffix: "+", label: "Students Trained" },
        { value: 5, suffix: "+", label: "Institutions Reached" },
        { value: 100, suffix: "%", label: "Industry-Focused" },
      ]
    }
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
  servicePages: {
    "full-stack-development": {
      industries: [
        { label: "Ecommerce Development", desc: "Take your online store to new heights with our eCommerce solutions. We specialize in crafting user-friendly websites and web development services that boost sales and customer satisfaction. From online stores to B2C and B2B platforms, we've got you covered. Let's elevate your online business together.\n\nOur approach extends beyond just creating visually appealing websites. We dive deep into understanding your business model, target market, and industry trends to deliver solutions that are not only aesthetically pleasing but also highly functional and optimized for conversions. Partner with us to create an eCommerce presence that stands out and brings tangible results." },
        { label: "Laravel Development", desc: "Leverage the power of Laravel to build robust, scalable, and secure web applications. Our expert developers utilize Laravel's elegant syntax and advanced features to deliver custom solutions tailored to your business needs, ensuring high performance and maintainability. We handle everything from complex database migrations to seamless API integrations, providing a solid foundation for your digital ecosystem." },
        { label: "Node.js Development", desc: "Build fast, scalable network applications with our Node.js development services. Perfect for real-time applications, APIs, and microservices, our Node.js solutions ensure high throughput and low latency for your most demanding projects. By utilizing event-driven, non-blocking I/O models, we create lightweight yet highly efficient backends that can handle thousands of concurrent connections with ease." },
        { label: "React Web Development", desc: "Create dynamic and highly responsive user interfaces with React. Our team builds single-page applications (SPAs) that offer seamless user experiences, fast load times, and easy scalability, keeping your users engaged. We implement state-of-the-art state management tools like Redux or Zustand, and ensure your frontend architecture is modular, reusable, and easy to maintain as your platform grows." },
        { label: "Vue.js Development", desc: "Develop versatile and performant web interfaces using Vue.js. We craft intuitive front-end solutions that easily integrate with your existing projects, providing a smooth and interactive experience for your users. Whether you need a lightweight widget or a complex single-page application, our Vue.js expertise ensures a progressive, adaptable, and highly optimized user interface." },
        { label: "Custom Web Application", desc: "Get tailor-made web applications designed specifically for your unique business processes. From complex enterprise systems to innovative startup platforms, we deliver secure, scalable, and feature-rich custom solutions. Our full-stack approach means we handle the entire lifecycle—from initial wireframing and database design to frontend execution and cloud deployment, ensuring a perfect fit for your operational needs." },
        { label: "WordPress & CMS", desc: "Manage your content effortlessly with our custom WordPress and CMS development. We build secure, SEO-friendly, and highly customizable websites that give you full control over your digital presence without technical headaches. We go beyond basic templates, developing custom themes, bespoke plugins, and headless WordPress architectures that deliver lightning-fast performance and unparalleled flexibility." }
      ],
      portfolio: [
        { id: 1, image: "https://images.dualite.app/109cb605-1b9d-44d5-a79d-86b38bdfbe3a/asset-a2dac705-802d-4455-a18b-5218dceec9d9.webp" },
        { id: 2, image: "https://images.dualite.app/109cb605-1b9d-44d5-a79d-86b38bdfbe3a/asset-2bb48f2b-993b-47a3-82af-6ca9b986a6af.webp" },
        { id: 3, image: "https://images.dualite.app/109cb605-1b9d-44d5-a79d-86b38bdfbe3a/asset-c922d0d7-194e-4cce-bb8c-e3675d23c99a.webp" }
      ],
      faqs: [
        { q: "How long will the development process take?", a: "The timeline depends entirely on the complexity and scope of the project. A basic MVP can take 4-8 weeks, while a complex enterprise application might take 3-6 months. We provide a detailed timeline during the initial consultation." },
        { q: "What technologies do you use?", a: "We primarily use modern JavaScript/TypeScript stacks (React, Next.js, Node.js) as well as Python (Django) and PHP (Laravel). For databases, we use PostgreSQL, MySQL, or MongoDB depending on your data structure needs." },
        { q: "Do you provide maintenance after launch?", a: "Yes, absolutely! We offer various post-launch maintenance and support packages to ensure your application remains secure, up-to-date, and runs smoothly as your user base grows." },
        { q: "Can you redesign or upgrade an existing project?", a: "Yes, we frequently help clients modernize legacy applications. We can audit your existing codebase, suggest improvements, and migrate it to a modern, scalable architecture." },
        { q: "Will the website be SEO optimized?", a: "Yes. We build web applications with SEO best practices in mind, including proper semantic HTML, fast loading speeds (using frameworks like Next.js for Server-Side Rendering), and mobile responsiveness." },
        { q: "Who owns the source code after completion?", a: "You do. Upon project completion and final payment, we transfer 100% ownership of the source code and intellectual property rights directly to you." }
      ]
    },
    "mobile-app-development": {
      industries: [
        { label: "Healthcare Apps", desc: "Develop HIPAA-compliant mobile applications for telemedicine, patient tracking, and health monitoring. We ensure secure data handling and intuitive interfaces for both doctors and patients. Our solutions include real-time video consultations, secure messaging, wearable device integration, and automated appointment scheduling, all wrapped in a user-friendly design that prioritizes accessibility and patient care." },
        { label: "E-commerce Apps", desc: "Boost your sales with high-performance mobile commerce apps. We integrate secure payment gateways, AR product previews, and personalized push notifications to maximize conversions. By focusing on a frictionless checkout process, intelligent product recommendations, and seamless inventory synchronization, we create shopping experiences that turn casual browsers into loyal, repeat customers." },
        { label: "Fintech Solutions", desc: "Build secure, scalable mobile banking and wallet applications. We implement biometric authentication, real-time transaction processing, and bank-grade security protocols. Our fintech apps feature intuitive dashboards for expense tracking, seamless peer-to-peer transfers, and robust encryption methods, ensuring your users' financial data remains completely protected while offering a modern banking experience." },
        { label: "On-Demand Services", desc: "Launch your Uber-like app with real-time GPS tracking, driver/user matching algorithms, and seamless in-app communication and payment systems. We build dynamic two-sided marketplaces with robust admin panels to monitor operations, manage dispatching, and analyze user behavior, ensuring your on-demand service runs smoothly even during peak traffic hours." },
        { label: "EdTech Platforms", desc: "Create engaging mobile learning experiences with interactive video streaming, offline course access, gamification, and progress tracking. Our educational apps are designed to boost student retention through personalized learning paths, real-time quizzes, and collaborative discussion forums, making remote education as effective and engaging as traditional classroom learning." }
      ],
      portfolio: [
        { id: 1, image: "https://images.dualite.app/109cb605-1b9d-44d5-a79d-86b38bdfbe3a/asset-a2dac705-802d-4455-a18b-5218dceec9d9.webp" },
        { id: 2, image: "https://images.dualite.app/109cb605-1b9d-44d5-a79d-86b38bdfbe3a/asset-2bb48f2b-993b-47a3-82af-6ca9b986a6af.webp" },
        { id: 3, image: "https://images.dualite.app/109cb605-1b9d-44d5-a79d-86b38bdfbe3a/asset-c922d0d7-194e-4cce-bb8c-e3675d23c99a.webp" }
      ],
      faqs: [
        { q: "Native vs Cross-platform: Which is better?", a: "Native apps offer the best performance and access to hardware features, ideal for complex apps. Cross-platform (React Native/Flutter) is faster to build and cheaper, perfect for most business apps." },
        { q: "Do you help with App Store submission?", a: "Yes, we handle the entire submission process for both the Apple App Store and Google Play Store, ensuring all guidelines are met." },
        { q: "How much does it cost to build an app?", a: "Costs vary widely based on features, platform, and complexity. A simple app might start around $10k, while complex enterprise apps can exceed $50k. Contact us for a precise quote." },
        { q: "Will my app work on both tablets and phones?", a: "Yes, we design and develop responsive mobile applications that provide an optimal viewing and interaction experience across a wide range of devices, including both smartphones and tablets." },
        { q: "Can you integrate third-party APIs like payment gateways?", a: "Absolutely. We have extensive experience integrating various third-party APIs, including payment gateways (Stripe, PayPal), social media logins, mapping services, and custom backend systems." },
        { q: "Do you provide post-launch app maintenance?", a: "Yes, we offer comprehensive post-launch support and maintenance packages. This includes bug fixes, OS updates compatibility, performance monitoring, and adding new features as your app grows." }
      ]
    },
    "web-application-development": {
      industries: [
        { label: "SaaS Platforms", desc: "We build scalable Software-as-a-Service platforms with multi-tenant architectures, subscription billing integrations, and comprehensive admin dashboards. Our focus is on creating high-availability systems that can seamlessly handle rapid user growth, complex data processing, and automated onboarding, ensuring your SaaS product delivers consistent value and a frictionless experience to every subscriber." },
        { label: "Enterprise Portals", desc: "Streamline your internal operations with custom enterprise web portals. We focus on secure data handling, role-based access, and workflow automation. By integrating with your existing legacy systems and third-party APIs, we create centralized hubs that improve team collaboration, boost productivity, and provide actionable real-time analytics for executive decision-making." },
        { label: "Healthcare Systems", desc: "Develop secure, HIPAA-compliant web applications for patient management, telemedicine, and electronic health records (EHR). Our platforms facilitate seamless communication between healthcare providers and patients, featuring secure document sharing, automated prescription refills, and advanced scheduling systems, all while maintaining the strictest standards of medical data privacy." },
        { label: "E-learning Portals", desc: "Create engaging educational platforms with video streaming, progress tracking, and interactive assessment tools. We build robust Learning Management Systems (LMS) that support diverse content formats, automated grading, and detailed performance analytics, empowering educators to deliver personalized learning experiences to students across the globe." },
        { label: "Financial Dashboards", desc: "Build secure fintech web applications with real-time data visualization, complex reporting, and bank-grade security protocols. Our financial dashboards provide users with deep insights into their portfolios, featuring predictive analytics, automated risk assessments, and seamless integration with global financial data providers, all wrapped in a highly secure, compliant architecture." }
      ],
      portfolio: [
        { id: 1, image: "https://images.dualite.app/109cb605-1b9d-44d5-a79d-86b38bdfbe3a/asset-a2dac705-802d-4455-a18b-5218dceec9d9.webp" },
        { id: 2, image: "https://images.dualite.app/109cb605-1b9d-44d5-a79d-86b38bdfbe3a/asset-2bb48f2b-993b-47a3-82af-6ca9b986a6af.webp" },
        { id: 3, image: "https://images.dualite.app/109cb605-1b9d-44d5-a79d-86b38bdfbe3a/asset-c922d0d7-194e-4cce-bb8c-e3675d23c99a.webp" }
      ],
      faqs: [
        { q: "Difference between a website and a web app?", a: "A website is primarily informational (like a brochure), while a web app is interactive and allows users to perform actions (like a CRM, dashboard, or social network)." },
        { q: "Will my web app be scalable?", a: "Yes, we build using modern, scalable architectures (like microservices) and deploy on robust cloud platforms (AWS, GCP) to ensure your app grows with your business." },
        { q: "How do you ensure security?", a: "We follow OWASP best practices, implement secure authentication (OAuth, JWT), encrypt sensitive data, and conduct regular security audits." },
        { q: "Can you migrate my legacy system to a modern web app?", a: "Yes, we specialize in modernizing legacy applications. We can safely migrate your data and rebuild the frontend and backend using modern, efficient technologies without disrupting your business." },
        { q: "Do you offer cloud hosting and deployment?", a: "Absolutely. We handle the entire deployment process and can set up scalable cloud hosting environments on platforms like AWS, Google Cloud, or Azure tailored to your app's needs." },
        { q: "What is your testing and QA process?", a: "We perform rigorous Quality Assurance including automated unit testing, integration testing, cross-browser compatibility checks, and manual user acceptance testing (UAT) to ensure a bug-free launch." }
      ]
    },
    "e-commerce-development": {
      industries: [
        { label: "B2C Retail", desc: "Create engaging shopping experiences for consumers. We build fast, mobile-optimized stores that drive impulsive buying and build brand loyalty. Our B2C solutions feature personalized product recommendations, seamless social media integrations, one-click checkouts, and dynamic pricing models, all designed to maximize your conversion rates and increase average order values." },
        { label: "B2B Wholesale", desc: "Develop robust portals for wholesale operations. Features include bulk ordering, custom pricing tiers, and seamless ERP/CRM integrations. We understand the complexities of B2B transactions, implementing features like automated reordering, role-based purchasing approvals, and detailed inventory forecasting to streamline your entire supply chain and procurement process." },
        { label: "Marketplaces", desc: "Launch multi-vendor platforms similar to Amazon or Etsy. We handle complex vendor management, split payments, and extensive product catalogs. Our marketplace solutions include dedicated seller dashboards, automated commission calculations, robust review systems, and advanced search algorithms to ensure buyers can easily find exactly what they're looking for across thousands of listings." },
        { label: "Subscription Services", desc: "Build recurring revenue models with automated billing, subscription management, and customer portals for easy plan modifications. We integrate flexible payment gateways that handle prorated upgrades, automated dunning management for failed payments, and personalized subscriber dashboards, helping you reduce churn and build a predictable, scalable revenue stream." }
      ],
      portfolio: [
        { id: 1, image: "https://images.dualite.app/109cb605-1b9d-44d5-a79d-86b38bdfbe3a/asset-a2dac705-802d-4455-a18b-5218dceec9d9.webp" },
        { id: 2, image: "https://images.dualite.app/109cb605-1b9d-44d5-a79d-86b38bdfbe3a/asset-2bb48f2b-993b-47a3-82af-6ca9b986a6af.webp" },
        { id: 3, image: "https://images.dualite.app/109cb605-1b9d-44d5-a79d-86b38bdfbe3a/asset-c922d0d7-194e-4cce-bb8c-e3675d23c99a.webp" }
      ],
      faqs: [
        { q: "Which platform is best for my store?", a: "It depends on your needs. Shopify is great for quick setup and ease of use. WooCommerce is perfect if you want full control and use WordPress. Magento is ideal for large, complex enterprise stores." },
        { q: "Can you migrate my existing store?", a: "Yes, we specialize in seamless migrations between platforms (e.g., from WooCommerce to Shopify) ensuring no data loss and minimal downtime." },
        { q: "Do you integrate payment gateways?", a: "Absolutely. We can integrate Stripe, PayPal, Razorpay, Apple Pay, Google Pay, and custom local payment gateways based on your target market." },
        { q: "How do you handle inventory management syncing?", a: "We integrate your e-commerce platform with your existing ERP or inventory management software to ensure real-time syncing of stock levels, preventing overselling and managing multi-warehouse logistics." },
        { q: "Are the e-commerce stores mobile-friendly?", a: "Yes, all our e-commerce builds are mobile-first. We ensure the shopping experience, especially the checkout process, is highly optimized for smartphones and tablets to capture mobile shoppers." },
        { q: "Can you implement custom features like subscriptions?", a: "Yes, we can build custom functionalities including recurring subscription boxes, wholesale (B2B) pricing tiers, custom product builders, and loyalty reward programs." }
      ]
    },
    "digital-marketing-services": {
      industries: [
        { label: "B2B Services", desc: "Generate high-quality leads through targeted LinkedIn campaigns, content marketing, and SEO strategies tailored for decision-makers. We focus on account-based marketing (ABM), creating highly personalized touchpoints, authoritative whitepapers, and automated email nurturing sequences that guide enterprise prospects smoothly through complex, multi-stage sales funnels." },
        { label: "E-commerce", desc: "Drive sales and reduce cart abandonment using dynamic retargeting, Google Shopping ads, and email marketing automation. Our data-driven approach utilizes advanced tracking pixels and machine learning algorithms to serve highly relevant product ads to users who have shown purchase intent, maximizing your return on ad spend (ROAS) and boosting overall store revenue." },
        { label: "Real Estate", desc: "Capture local leads with hyper-targeted Facebook ads, local SEO, and virtual tour promotions to sell properties faster. We build comprehensive digital funnels that showcase property listings to the right demographics, utilizing lead generation forms, automated SMS follow-ups, and immersive 3D content to turn casual browsers into qualified home buyers." },
        { label: "Healthcare", desc: "Build trust and attract patients through informative content, local search optimization, and compliant social media strategies. We navigate the complexities of healthcare marketing by creating authoritative, medically accurate content that ranks highly on search engines, while implementing targeted local campaigns to drive foot traffic to your clinics and specialized practices." },
        { label: "Education", desc: "Increase enrollments with targeted PPC campaigns, engaging social media content, and SEO for educational programs. We help universities and online course creators reach prospective students by highlighting alumni success stories, optimizing program landing pages for conversions, and running highly segmented ad campaigns during peak enrollment seasons." }
      ],
      portfolio: [
        { id: 1, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop" },
        { id: 2, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop" },
        { id: 3, image: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=600&auto=format&fit=crop" }
      ],
      faqs: [
        { q: "How long does it take to see SEO results?", a: "SEO is a long-term strategy. Typically, you will start seeing noticeable improvements in rankings and traffic within 3 to 6 months, depending on the competitiveness of your industry." },
        { q: "PPC vs. SEO: Which is better?", a: "PPC provides immediate traffic and leads, while SEO builds sustainable, long-term organic traffic. We usually recommend a combined approach for the best ROI." },
        { q: "How do you track campaign success?", a: "We use advanced analytics tools like Google Analytics, Tag Manager, and custom dashboards to track KPIs such as conversion rate, cost per acquisition (CPA), and overall ROI." },
        { q: "Do you create content for social media?", a: "Yes, our team of content creators, copywriters, and designers produce high-quality, engaging content tailored specifically for each social media platform to maximize audience engagement." },
        { q: "Can you help with email marketing automation?", a: "Absolutely. We design and implement automated email drip campaigns, newsletters, and cart abandonment sequences using platforms like Mailchimp, HubSpot, or Klaviyo." },
        { q: "How much should I spend on digital ads?", a: "Your ad budget depends on your industry, goals, and target audience. We offer a free initial consultation to analyze your market and recommend a budget that will yield a positive ROI." }
      ]
    },
    "product-development": {
      industries: [
        { label: "Tech Startups", desc: "We help startups validate their ideas quickly by building robust MVPs, allowing them to secure funding and scale efficiently. Our agile development process focuses on core feature delivery, rapid iteration based on early user feedback, and scalable cloud architectures that ensure your product can handle sudden spikes in traffic as your user base grows." },
        { label: "Fintech", desc: "Developing secure, compliant, and innovative financial products including payment gateways, trading platforms, and digital wallets. We prioritize data encryption, regulatory compliance (such as PCI-DSS and KYC/AML), and real-time transaction processing, ensuring your financial product is not only cutting-edge but also completely trustworthy and secure." },
        { label: "Healthcare", desc: "Building HIPAA-compliant digital health products, telemedicine platforms, and IoT-integrated medical devices. We bridge the gap between technology and patient care, developing intuitive interfaces for healthcare professionals and patients alike, while ensuring seamless integration with existing Electronic Health Record (EHR) systems and strict adherence to data privacy laws." },
        { label: "Enterprise Software", desc: "Modernizing legacy systems and building custom enterprise resource planning (ERP) and CRM solutions. We transform outdated, siloed operations into unified, cloud-based ecosystems. Our enterprise products focus on workflow automation, advanced data analytics, and seamless third-party integrations, driving operational efficiency and reducing overhead costs." },
        { label: "EdTech", desc: "Creating interactive learning management systems (LMS), virtual classrooms, and educational mobile apps. We design digital learning environments that foster engagement through gamification, real-time collaboration tools, and adaptive learning algorithms that tailor educational content to individual student performance and learning styles." }
      ],
      portfolio: [
        { id: 1, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop" },
        { id: 2, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop" },
        { id: 3, image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop" }
      ],
      faqs: [
        { q: "What is an MVP?", a: "A Minimum Viable Product (MVP) is the first version of your product with just enough features to satisfy early customers and provide feedback for future development." },
        { q: "Do you follow Agile methodology?", a: "Yes, we use Agile/Scrum methodologies. This means we work in sprints, allowing for flexibility, regular updates, and continuous feedback throughout the development cycle." },
        { q: "Who owns the intellectual property (IP)?", a: "You do. Upon project completion and final payment, all source code and intellectual property rights are fully transferred to you." },
        { q: "How do you handle user feedback and testing?", a: "We implement beta testing phases, conduct A/B testing, and integrate analytics tools to gather real user data. This feedback loop is crucial for refining the product before a full-scale launch." },
        { q: "Can you help with product strategy and ideation?", a: "Yes, our product managers and UX strategists work closely with you during the discovery phase to validate your idea, define the target audience, and map out a strategic product roadmap." },
        { q: "What happens after the product is launched?", a: "Launch is just the beginning. We offer ongoing maintenance, server scaling, performance monitoring, and continuous iterative development to add new features based on user adoption." }
      ]
    },
    "hire-dedicated-developers": {
      industries: [
        { label: "Startups & Scale-ups", desc: "Rapidly scale your engineering team to meet aggressive product roadmaps and investor milestones without the long hiring cycles. Our dedicated developers seamlessly integrate into your fast-paced environment, bringing startup-friendly agility, modern tech stack expertise, and a proactive problem-solving mindset to help you achieve product-market fit faster." },
        { label: "Enterprise IT", desc: "Augment your internal teams with specialized skills for digital transformation, cloud migration, or legacy system modernization. We provide senior-level architects and developers who understand complex enterprise environments, strict compliance requirements, and CI/CD best practices, ensuring your large-scale projects are delivered securely and on schedule." },
        { label: "Digital Agencies", desc: "Expand your agency's delivery capacity and service offerings by white-labeling our expert development teams. Whether you need an entire squad to tackle a massive client project or a single specialist to fill a skill gap, our developers work under your brand, adapting to your project management tools and communication protocols to deliver seamless results to your clients." },
        { label: "Fintech & Healthcare", desc: "Hire developers experienced in building secure, compliant, and highly regulated software applications. Our vetted professionals possess deep domain knowledge in data encryption, HIPAA/PCI-DSS compliance, and secure API integrations, ensuring your sensitive projects are handled with the utmost security, precision, and industry-specific expertise." }
      ],
      portfolio: [
        { id: 1, image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop" },
        { id: 2, image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=600&auto=format&fit=crop" },
        { id: 3, image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=600&auto=format&fit=crop" }
      ],
      faqs: [
        { q: "How fast can I hire a developer?", a: "Typically, we can match you with the right candidate within 48-72 hours. Once approved, they can start working on your project almost immediately." },
        { q: "What if I'm not satisfied with the developer?", a: "We offer a risk-free trial period. If you are not completely satisfied with the developer's performance, we will replace them at no additional cost to you." },
        { q: "How do we communicate with the team?", a: "You have direct access to your dedicated developers. You can use your preferred communication tools like Slack, Microsoft Teams, Zoom, or Jira to manage and communicate with them." },
        { q: "Are the developers working in my time zone?", a: "We offer flexible engagement models. Our developers can adjust their working hours to ensure a significant overlap with your core team's time zone for seamless collaboration." },
        { q: "Do you handle payroll and HR management?", a: "Yes, we handle all administrative tasks including payroll, benefits, hardware provision, and HR management. You only pay a flat, predictable monthly fee." },
        { q: "Can I scale the team up or down?", a: "Absolutely. Our dedicated team model is highly flexible, allowing you to easily scale your engineering resources up or down based on your current project requirements." }
      ]
    },
    "managed-services": {
      industries: [
        { label: "Healthcare", desc: "Ensuring HIPAA compliance, securing patient data, and maintaining high availability for critical healthcare applications and systems." },
        { label: "Finance & Banking", desc: "Providing bank-grade security, PCI-DSS compliance, and robust disaster recovery solutions for financial institutions." },
        { label: "E-commerce & Retail", desc: "Ensuring 99.99% uptime during peak traffic seasons, optimizing cloud costs, and securing customer payment data." },
        { label: "SaaS & Technology", desc: "Managing complex cloud infrastructures, automating CI/CD pipelines, and scaling resources dynamically for tech companies." },
        { label: "Manufacturing", desc: "Integrating IT with operational technology (OT), securing supply chain data, and ensuring continuous production capabilities." }
      ],
      portfolio: [
        { id: 1, image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop" },
        { id: 2, image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=600&auto=format&fit=crop" },
        { id: 3, image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=600&auto=format&fit=crop" }
      ],
      faqs: [
        { q: "What is included in your managed IT services?", a: "Our managed services typically include 24/7 proactive monitoring, cloud infrastructure management, cybersecurity, backup and disaster recovery, patch management, and dedicated IT support." },
        { q: "Do you support multi-cloud environments?", a: "Yes, we have extensive experience managing complex multi-cloud and hybrid environments across AWS, Microsoft Azure, and Google Cloud Platform." },
        { q: "How do you handle security and compliance?", a: "We implement a multi-layered security approach including intrusion detection, regular vulnerability assessments, and strict access controls. We also help maintain compliance with industry standards like HIPAA, SOC 2, and GDPR." },
        { q: "What is your response time for critical issues?", a: "We offer strict Service Level Agreements (SLAs) with guaranteed response times. For critical issues, our dedicated support team responds within 15-30 minutes, 24/7/365." },
        { q: "Can you help optimize our cloud costs?", a: "Yes, cloud cost optimization (FinOps) is a core part of our managed services. We continuously analyze your usage patterns to eliminate waste, right-size resources, and implement cost-saving strategies." },
        { q: "Do you provide disaster recovery planning?", a: "Absolutely. We design, implement, and regularly test comprehensive Business Continuity and Disaster Recovery (BCDR) plans to ensure your data is safe and your operations can quickly resume in case of an emergency." }
      ]
    },
    "cms-development": {
      industries: [
        { label: "Publishing & Media", desc: "High-performance editorial workflows, multi-author management, and content distribution networks designed for digital publishers." },
        { label: "Corporate Websites", desc: "Secure, scalable, and easy-to-manage corporate portals that empower marketing teams to update content without developer intervention." },
        { label: "E-commerce Content", desc: "Integrating robust CMS capabilities alongside e-commerce engines for rich product storytelling and seamless shopping experiences." },
        { label: "Education & Non-profits", desc: "Accessible, structured content repositories for educational materials, donation campaigns, and community engagement." }
      ],
      portfolio: [
        { id: 1, image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop" },
        { id: 2, image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=600&auto=format&fit=crop" },
        { id: 3, image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=600&auto=format&fit=crop" }
      ],
      faqs: [
        { q: "What is a Headless CMS?", a: "A headless CMS separates the backend content repository from the frontend presentation layer. This allows you to manage content in one place and display it across any device or platform (website, mobile app, smartwatch) using APIs." },
        { q: "Can you migrate my existing website to a new CMS?", a: "Yes, we provide secure and seamless data migration services. We ensure all your content, images, user data, and SEO metadata are safely transferred to the new platform without downtime." },
        { q: "Do you provide training for our team?", a: "Absolutely. Upon launch, we provide comprehensive training sessions and documentation to ensure your marketing and editorial teams are comfortable managing content on the new system." },
        { q: "Which CMS platform do you recommend?", a: "It depends on your specific needs. We often recommend WordPress for ease of use, Webflow for design flexibility, or headless solutions like Sanity or Contentful for highly scalable, multi-channel content delivery." },
        { q: "Are your CMS solutions SEO-friendly?", a: "Yes, we build CMS platforms with SEO best practices at their core. We include tools for easy meta-tag management, XML sitemap generation, schema markup, and ensure the underlying code is optimized for fast loading speeds." },
        { q: "How do you ensure the CMS is secure?", a: "We implement robust security measures including two-factor authentication (2FA), role-based access control (RBAC), regular security patching, automated backups, and web application firewalls (WAF) to protect your content." }
      ]
    }
  },
  trainingPrograms: [
    { id: crypto.randomUUID(), title: "Web Development Workshop", duration: "2 Days", audience: "Schools / Colleges", mode: "Hybrid", iconName: "Code", desc: "Hands-on session covering HTML, CSS, JavaScript basics and a real project demo for students." },
    { id: crypto.randomUUID(), title: "AI Tools Awareness Session", duration: "1 Day", audience: "All Students", mode: "Online / Offline", iconName: "MonitorPlay", desc: "Introduction to ChatGPT, Midjourney, and other AI tools to boost productivity and learning." },
    { id: crypto.randomUUID(), title: "Digital Marketing Basics", duration: "3 Days", audience: "Colleges", mode: "Hybrid", iconName: "Megaphone", desc: "Learn the fundamentals of SEO, Social Media Marketing, and creating online campaigns." },
    { id: crypto.randomUUID(), title: "Career Guidance Seminar", duration: "Half Day", audience: "Final Year Students", mode: "Offline", iconName: "Target", desc: "Expert advice on choosing the right IT career path, industry trends, and job opportunities." },
    { id: crypto.randomUUID(), title: "Cyber Security Awareness", duration: "1 Day", audience: "Schools / Colleges", mode: "Online / Offline", iconName: "ShieldAlert", desc: "Essential training on internet safety, data privacy, and ethical hacking basics." },
    { id: crypto.randomUUID(), title: "Resume & LinkedIn Building", duration: "1 Day", audience: "Colleges", mode: "Hybrid", iconName: "FileText", desc: "Practical workshop on crafting ATS-friendly resumes and professional LinkedIn profiles." }
  ],
  trainingTopics: [
    "Web Development", "App Development", "Full Stack Basics", 
    "AI Tools for Students", "Career Guidance", "Resume Building", 
    "Interview Preparation", "Digital Marketing Fundamentals", 
    "Freelancing Basics", "Cyber Safety Awareness"
  ],
  trainingAudiences: [
    "Schools", "Colleges", "Polytechnic Institutes", 
    "Engineering Students", "Final Year Students", "Beginners in Tech"
  ],
  trainingFormats: [
    { id: crypto.randomUUID(), title: "One-day Workshop", iconName: "CalendarDays" },
    { id: crypto.randomUUID(), title: "3-Day Bootcamp", iconName: "Target" },
    { id: crypto.randomUUID(), title: "Weekly Training Series", iconName: "Clock" },
    { id: crypto.randomUUID(), title: "Seminar Session", iconName: "Users" },
    { id: crypto.randomUUID(), title: "Hands-on Lab Session", iconName: "Laptop" },
  ],
  trainingGallery: [
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
    "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&q=80",
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80",
    "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80"
  ],
  trainingTestimonials: [
    { id: crypto.randomUUID(), quote: "The session was highly engaging and useful for our students. They got to see how real-world coding works.", author: "Dr. Ramesh Kumar", role: "HOD Computer Science, XYZ Engineering College" },
    { id: crypto.randomUUID(), quote: "A practical workshop that gave our students real exposure to current AI technologies. Highly recommended!", author: "Priya Sharma", role: "Principal, ABC Public School" }
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

      const dbGeneral = getSetting('general', defaultData.general);

      setSiteData({
        general: {
          ...defaultData.general,
          ...dbGeneral,
          stats: {
            hero: dbGeneral.stats?.hero || defaultData.general.stats.hero,
            about: dbGeneral.stats?.about || defaultData.general.stats.about,
            training: dbGeneral.stats?.training || defaultData.general.stats.training,
          }
        },
        hero: getSetting('hero', defaultData.hero),
        about: getSetting('about', defaultData.about),
        cta: getSetting('cta', defaultData.cta),
        services: getSetting('services', defaultData.services),
        products: getSetting('products', defaultData.products),
        jobs: getSetting('jobs', defaultData.jobs),
        industries: getSetting('industries', defaultData.industries),
        
        servicePages: getSetting('servicePages', defaultData.servicePages),

        trainingPrograms: getSetting('trainingPrograms', defaultData.trainingPrograms),
        trainingTopics: getSetting('trainingTopics', defaultData.trainingTopics),
        trainingAudiences: getSetting('trainingAudiences', defaultData.trainingAudiences),
        trainingFormats: getSetting('trainingFormats', defaultData.trainingFormats),
        trainingGallery: getSetting('trainingGallery', defaultData.trainingGallery),
        trainingTestimonials: getSetting('trainingTestimonials', defaultData.trainingTestimonials),
        
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
