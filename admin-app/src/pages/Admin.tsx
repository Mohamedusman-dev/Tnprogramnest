import { useState, useEffect } from "react";
import { useSiteData } from "@/context/SiteDataContext";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, Settings, MessageSquare, Users, Save, Plus, Trash2, 
  Globe, Loader2, LogOut, Briefcase, Package, Image as ImageIcon, Upload, 
  FileText, Menu, X, Link as LinkIcon, Factory, Heart, GraduationCap, 
  Mail, Lock, Mailbox, FileSpreadsheet, FileText as FileTextIcon, Pencil, Layout, FolderGit2, Star
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- Custom Image Uploader Component ---
const ImageUploader = ({ value, onChange, label }: { value: string, onChange: (val: string) => void, label: string }) => {
  const [mode, setMode] = useState<'url' | 'local'>('url');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        toast.error("File size must be less than 500KB to save in database.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="flex gap-2 mb-2">
        <button 
          onClick={() => setMode('url')} 
          className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${mode === 'url' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          <ImageIcon size={12} className="inline mr-1" /> URL
        </button>
        <button 
          onClick={() => setMode('local')} 
          className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${mode === 'local' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          <Upload size={12} className="inline mr-1" /> Upload Local
        </button>
      </div>

      {mode === 'url' ? (
        <input 
          key="url-input"
          type="text" 
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.png"
          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
        />
      ) : (
        <input 
          key="file-input"
          type="file" 
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm text-slate-900 bg-white file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
        />
      )}

      {value && (
        <div className="mt-2 p-2 bg-slate-50 rounded border border-slate-100 inline-block">
          <img src={value} alt="Preview" className="h-10 object-contain" />
        </div>
      )}
    </div>
  );
};

// --- Custom Comma Separated Input Component ---
const CommaSeparatedInput = ({ value, onChange, placeholder, rows = 2, className }: { value: string[], onChange: (val: string[]) => void, placeholder?: string, rows?: number, className?: string }) => {
  const [str, setStr] = useState((value || []).join(", "));
  
  useEffect(() => {
    const currentArr = str.split(",").map(s => s.trim()).filter(Boolean);
    const propArr = (value || []).map(s => s.trim()).filter(Boolean);
    if (currentArr.join(",") !== propArr.join(",")) {
      setStr((value || []).join(", "));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setStr(e.target.value);
    onChange(e.target.value.split(",").map(s => s.trim()).filter(Boolean));
  };

  if (rows === 1) {
    return <input type="text" value={str} onChange={handleChange} placeholder={placeholder} className={className} />;
  }
  return <textarea rows={rows} value={str} onChange={handleChange} placeholder={placeholder} className={className} />;
};

const StatEditor = ({ title, stats, onChange, showIcon = false }: { title: string, stats: any[], onChange: (val: any[]) => void, showIcon?: boolean }) => {
  if (!stats) return null;
  return (
    <div className="mb-6 border-b border-slate-100 pb-6 last:border-0 last:pb-0">
      <h4 className="font-semibold text-slate-800 mb-3">{title}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div>
              <label className="block text-[11px] uppercase text-slate-500 font-semibold mb-1">Number Value</label>
              <input type="number" value={stat.value} onChange={(e) => {
                const newStats = structuredClone(stats);
                newStats[index].value = Number(e.target.value);
                onChange(newStats);
              }} className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-900 bg-white" />
            </div>
            <div>
              <label className="block text-[11px] uppercase text-slate-500 font-semibold mb-1">Suffix (e.g. +, %)</label>
              <input type="text" value={stat.suffix} onChange={(e) => {
                const newStats = structuredClone(stats);
                newStats[index].suffix = e.target.value;
                onChange(newStats);
              }} className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-900 bg-white" />
            </div>
            <div>
              <label className="block text-[11px] uppercase text-slate-500 font-semibold mb-1">Label</label>
              <input type="text" value={stat.label} onChange={(e) => {
                const newStats = structuredClone(stats);
                newStats[index].label = e.target.value;
                onChange(newStats);
              }} className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-900 bg-white" />
            </div>
            {showIcon && (
              <div>
                <label className="block text-[11px] uppercase text-slate-500 font-semibold mb-1">Icon (Lucide)</label>
                <input type="text" value={stat.icon || ""} onChange={(e) => {
                  const newStats = structuredClone(stats);
                  newStats[index].icon = e.target.value;
                  onChange(newStats);
                }} className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-900 bg-white" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Admin = () => {
  const { siteData, updateSection, updateChatbot, isLoading } = useSiteData();
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Auth States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Contact Messages State
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [editingMessage, setEditingMessage] = useState<any>(null);

  // Local Form States
  const [generalForm, setGeneralForm] = useState(siteData.general);
  const [heroForm, setHeroForm] = useState(siteData.hero);
  const [aboutForm, setAboutForm] = useState(siteData.about);
  const [servicesForm, setServicesForm] = useState(siteData.services);
  const [productsForm, setProductsForm] = useState(siteData.products);
  const [jobsForm, setJobsForm] = useState(siteData.jobs || []);
  const [industriesForm, setIndustriesForm] = useState(siteData.industries || []);
  
  // Portfolio States
  const [portfolioPageForm, setPortfolioPageForm] = useState(siteData.portfolioPage);
  const [portfolioProjectsForm, setPortfolioProjectsForm] = useState(siteData.portfolioProjects || []);
  
  // Service Pages State
  const [selectedServiceSlug, setSelectedServiceSlug] = useState("full-stack-development");
  const [servicePagesForm, setServicePagesForm] = useState<Record<string, any>>(siteData.servicePages || {});
  
  // Training Page Forms
  const [trainingForm, setTrainingForm] = useState(siteData.trainingPrograms || []);
  const [trainingTopicsForm, setTrainingTopicsForm] = useState(siteData.trainingTopics || []);
  const [trainingAudiencesForm, setTrainingAudiencesForm] = useState(siteData.trainingAudiences || []);
  const [trainingFormatsForm, setTrainingFormatsForm] = useState(siteData.trainingFormats || []);
  const [trainingGalleryForm, setTrainingGalleryForm] = useState(siteData.trainingGallery || []);
  const [trainingTestimonialsForm, setTrainingTestimonialsForm] = useState(siteData.trainingTestimonials || []);

  const [teamTestimonialsForm, setTeamTestimonialsForm] = useState(siteData.teamTestimonials || []);
  const [clutchReviewsForm, setClutchReviewsForm] = useState(siteData.clutchReviews || []);
  const [chatbotForm, setChatbotForm] = useState(siteData.chatbot);
  const [footerForm, setFooterForm] = useState(siteData.footer);

  // Check Auth Session
  useEffect(() => {
    const clearInvalidSession = async () => {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      await supabase.auth.signOut().catch(console.error);
    };

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session error:", error.message);
          await clearInvalidSession();
        }
        setSession(session);
      } catch (err) {
        console.error("Unexpected session error:", err);
        await clearInvalidSession();
      } finally {
        setAuthLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event as string) === 'TOKEN_REFRESH_FAILED') {
        console.error("Token refresh failed, signing out.");
        clearInvalidSession();
      }
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync local state when global state loads from DB
  useEffect(() => {
    setGeneralForm(siteData.general);
    setHeroForm(siteData.hero);
    setAboutForm(siteData.about);
    setServicesForm(siteData.services || []);
    setProductsForm(siteData.products || []);
    setJobsForm(siteData.jobs || []);
    setIndustriesForm(siteData.industries || []);
    setPortfolioPageForm(siteData.portfolioPage);
    setPortfolioProjectsForm(siteData.portfolioProjects || []);
    setServicePagesForm(siteData.servicePages || {});
    
    setTrainingForm(siteData.trainingPrograms || []);
    setTrainingTopicsForm(siteData.trainingTopics || []);
    setTrainingAudiencesForm(siteData.trainingAudiences || []);
    setTrainingFormatsForm(siteData.trainingFormats || []);
    setTrainingGalleryForm(siteData.trainingGallery || []);
    setTrainingTestimonialsForm(siteData.trainingTestimonials || []);

    setTeamTestimonialsForm(siteData.teamTestimonials || []);
    setClutchReviewsForm(siteData.clutchReviews || []);
    setChatbotForm(siteData.chatbot || []);
    if(siteData.footer) setFooterForm(siteData.footer);
  }, [siteData]);

  // Fetch Contact Messages
  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setContactMessages(data || []);
    } catch (error) {
      toast.error("Failed to fetch contact messages.");
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'messages' && session) {
      fetchMessages();
    }
  }, [activeTab, session]);

  // Contact Message Actions
  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message? This action cannot be undone.")) return;
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) throw error;
      setContactMessages(prev => prev.filter(m => m.id !== id));
      toast.success("Message deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete message.");
    }
  };

  const handleUpdateMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMessage) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({
          name: editingMessage.name,
          email: editingMessage.email,
          phone: editingMessage.phone,
          service: editingMessage.service,
          details: editingMessage.details
        })
        .eq('id', editingMessage.id);
        
      if (error) throw error;
      
      setContactMessages(prev => prev.map(m => m.id === editingMessage.id ? editingMessage : m));
      setEditingMessage(null);
      toast.success("Message updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update message.");
    } finally {
      setIsSaving(false);
    }
  };

  // Export Functions
  const exportToCSV = () => {
    if (contactMessages.length === 0) return toast.error("No data to export");
    
    const headers = ["Date", "Name", "Email", "Phone", "Service", "Details"];
    const csvData = contactMessages.map(msg => [
      new Date(msg.created_at).toLocaleDateString(),
      `"${(msg.name || '').replace(/"/g, '""')}"`,
      `"${(msg.email || '').replace(/"/g, '""')}"`,
      `"${(msg.phone || '').replace(/"/g, '""')}"`,
      `"${(msg.service || '').replace(/"/g, '""')}"`,
      `"${(msg.details || '').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [headers.join(","), ...csvData.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `contact_leads_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    if (contactMessages.length === 0) return toast.error("No data to export");
    
    const doc = new jsPDF();
    doc.text("Contact Messages / Leads", 14, 15);
    
    const tableColumn = ["Date", "Name", "Email", "Phone", "Service"];
    const tableRows: any[] = [];
    
    contactMessages.forEach(msg => {
      const msgData = [
        new Date(msg.created_at).toLocaleDateString(),
        msg.name || '-',
        msg.email || '-',
        msg.phone || '-',
        msg.service || '-'
      ];
      tableRows.push(msgData);
    });
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [91, 124, 250] }
    });
    
    doc.save(`contact_leads_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Logged in successfully!");
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
  };

  const handleSaveSection = async (key: keyof Omit<typeof siteData, 'testimonials' | 'chatbot'>, formState: any) => {
    setIsSaving(true);
    try {
      await updateSection(key, formState);
      toast.success(`Section saved to database!`);
    } catch (error) {
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveGeneral = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        updateSection('general', generalForm),
        updateSection('hero', heroForm),
        updateSection('about', aboutForm)
      ]);
      toast.success("General, Hero, and About settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save general settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePortfolio = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        updateSection('portfolioProjects', portfolioProjectsForm),
        updateSection('portfolioPage', portfolioPageForm)
      ]);
      toast.success("Portfolio data saved successfully!");
    } catch (error) {
      toast.error("Failed to save portfolio data.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveServicePages = async () => {
    setIsSaving(true);
    try {
      await updateSection('servicePages', servicePagesForm);
      toast.success("Service pages data saved successfully!");
    } catch (error) {
      toast.error("Failed to save service pages data.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTrainingPage = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        updateSection('trainingPrograms', trainingForm),
        updateSection('trainingTopics', trainingTopicsForm),
        updateSection('trainingAudiences', trainingAudiencesForm),
        updateSection('trainingFormats', trainingFormatsForm),
        updateSection('trainingGallery', trainingGalleryForm),
        updateSection('trainingTestimonials', trainingTestimonialsForm),
      ]);
      toast.success("All Training Page data saved!");
    } catch (error) {
      toast.error("Failed to save training page data.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveChatbot = async () => {
    setIsSaving(true);
    try {
      await updateChatbot(chatbotForm);
      await updateSection('general', generalForm); // Save the general settings (like suggestions and bg image)
      toast.success("Chatbot settings and knowledge saved!");
    } catch (error) {
      toast.error("Failed to save chatbot data.");
    } finally {
      setIsSaving(false);
    }
  };

  // Add/Remove Handlers
  const addService = () => setServicesForm([...servicesForm, { id: crypto.randomUUID(), title: "", desc: "", iconUrl: "" }]);
  const removeService = (id: string) => setServicesForm(servicesForm.filter(s => s.id !== id));
  
  const addProduct = () => setProductsForm([...productsForm, { id: crypto.randomUUID(), title: "", desc: "", iconUrl: "", category: "left" }]);
  const removeProduct = (id: string) => setProductsForm(productsForm.filter(p => p.id !== id));

  const addJob = () => setJobsForm([...jobsForm, { id: crypto.randomUUID(), title: "", category: "", salary: "", type: "Full-time", desc: "", requirements: [], location: "", iconUrl: "", applyLink: "" }]);
  const removeJob = (id: string) => setJobsForm(jobsForm.filter(j => j.id !== id));

  const addIndustry = () => setIndustriesForm([...industriesForm, { 
    id: crypto.randomUUID(), 
    label: "New Industry", 
    image: "", 
    description: "", 
    bullets: [], 
    caseStudy: { title: "", description: "", stats: [{label: "Stat 1", value: "100%"}, {label: "Stat 2", value: "200%"}] }, 
    testimonial: { quote: "", author: "", role: "" } 
  }]);
  const removeIndustry = (id: string) => setIndustriesForm(industriesForm.filter(i => i.id !== id));

  // Portfolio Handlers
  const addPortfolioProject = () => setPortfolioProjectsForm([...portfolioProjectsForm, { 
    id: crypto.randomUUID(), title: "", description: "", image: "", category: "Web App", status: "Completed", techStack: [], cta: "View Project", rating: 5 
  }]);
  const removePortfolioProject = (id: string) => setPortfolioProjectsForm(portfolioProjectsForm.filter(p => p.id !== id));

  // Service Pages Handlers
  const currentServiceData = servicePagesForm[selectedServiceSlug] || { industries: [], faqs: [] };
  const updateCurrentServiceData = (key: string, value: any) => {
    setServicePagesForm(prev => ({
      ...prev,
      [selectedServiceSlug]: {
        ...(prev[selectedServiceSlug] || { industries: [], faqs: [] }),
        [key]: value
      }
    }));
  };

  // Training Page Handlers
  const addTrainingProgram = () => setTrainingForm([...trainingForm, { id: crypto.randomUUID(), title: "", duration: "", audience: "", mode: "", iconName: "Code", desc: "" }]);
  const removeTrainingProgram = (id: string) => setTrainingForm(trainingForm.filter(p => p.id !== id));

  const addTrainingFormat = () => setTrainingFormatsForm([...trainingFormatsForm, { id: crypto.randomUUID(), title: "", iconName: "CheckCircle2" }]);
  const removeTrainingFormat = (id: string) => setTrainingFormatsForm(trainingFormatsForm.filter(f => f.id !== id));

  const addGalleryImage = () => setTrainingGalleryForm([...trainingGalleryForm, ""]);
  const removeGalleryImage = (index: number) => setTrainingGalleryForm(trainingGalleryForm.filter((_, i) => i !== index));

  const addTrainingTestimonial = () => setTrainingTestimonialsForm([...trainingTestimonialsForm, { id: crypto.randomUUID(), quote: "", author: "", role: "" }]);
  const removeTrainingTestimonial = (id: string) => setTrainingTestimonialsForm(trainingTestimonialsForm.filter(t => t.id !== id));

  // Other Handlers
  const addClutchReview = () => setClutchReviewsForm([...clutchReviewsForm, { id: crypto.randomUUID(), author: "", company: "", text: "", rating: "5.0" }]);
  const removeClutchReview = (id: string) => setClutchReviewsForm(clutchReviewsForm.filter(t => t.id !== id));

  const addTeamTestimonial = () => setTeamTestimonialsForm([...teamTestimonialsForm, { id: crypto.randomUUID(), name: "", role: "", quote: "", image: "", rating: 5 }]);
  const removeTeamTestimonial = (id: string) => setTeamTestimonialsForm(teamTestimonialsForm.filter(t => t.id !== id));

  const addChatbotQA = () => setChatbotForm([...chatbotForm, { id: crypto.randomUUID(), keywords: [], answer: "" }]);
  const removeChatbotQA = (id: string) => setChatbotForm(chatbotForm.filter(c => c.id !== id));

  const navItems = [
    { id: "general", label: "General Settings", icon: Settings },
    { id: "service_pages", label: "Service Pages", icon: Layout },
    { id: "portfolio_projects", label: "Portfolio Projects", icon: FolderGit2 },
    { id: "services", label: "What We Offer", icon: Briefcase },
    { id: "products", label: "Our Products", icon: Package },
    { id: "industries", label: "Focus Industries", icon: Factory },
    { id: "training", label: "Training Programs", icon: GraduationCap },
    { id: "jobs", label: "Open Positions", icon: FileText },
    { id: "team_testimonials", label: "Team Testimonials", icon: Heart },
    { id: "clutch_reviews", label: "Clutch Reviews", icon: Star },
    { id: "chatbot", label: "Chatbot Data", icon: MessageSquare },
    { id: "messages", label: "Contact Messages", icon: Mailbox },
    { id: "footer", label: "Footer & Social", icon: Globe },
  ];

  // --- Render Auth Screen if not logged in ---
  if (authLoading || (!session && !authLoading && isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eef2f6]">
        <Loader2 className="w-8 h-8 animate-spin text-[#5B7cFA]" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eef2f6] p-4 sm:p-6 md:p-8 font-sans">
        <div className="max-w-[1000px] w-full bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          
          {/* Left Side - Blue Gradient & Decorations */}
          <div className="w-full md:w-[45%] lg:w-1/2 bg-[#5b7cfa] p-10 md:p-16 text-white relative overflow-hidden flex flex-col justify-center min-h-[320px] md:min-h-full">
            {/* Decorative Elements matching the reference */}
            {/* Top Left Dots */}
            <div className="absolute top-8 left-8 grid grid-cols-4 gap-2 opacity-40">
              {[...Array(16)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-white rounded-full"></div>)}
            </div>
            {/* Top Shapes */}
            <div className="absolute top-0 left-24 w-16 h-16 bg-white/10 rounded-b-full"></div>
            <div className="absolute top-12 left-40 w-4 h-16 bg-white/10 rounded-full"></div>
            <div className="absolute top-8 left-52 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
            <div className="absolute top-16 left-60 w-8 h-8 border-2 border-white/30 rounded-full"></div>
            
            {/* Bottom Right Concentric Circles & Cyan Orb */}
            <div className="absolute -bottom-16 -right-16 w-64 h-64 border-[1px] border-white/20 rounded-full flex items-center justify-center">
              <div className="w-48 h-48 border-[2px] border-white/30 rounded-full flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-cyan-300 to-blue-600 rounded-full shadow-[0_0_30px_rgba(34,211,238,0.6)]"></div>
              </div>
            </div>
            {/* Bottom Left Dots & Cross */}
            <div className="absolute bottom-12 left-10 grid grid-cols-4 gap-2 opacity-40">
              {[...Array(16)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-white rounded-full"></div>)}
            </div>
            <div className="absolute bottom-24 left-12 w-4 h-4 bg-cyan-300 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"></div>
            <div className="absolute bottom-12 left-32 text-white/50 text-2xl font-bold rotate-45">+</div>
            
            {/* Content */}
            <div className="relative z-10 mt-8 md:mt-0">
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold mb-4 leading-[1.1] tracking-tight">
                Adventure<br/>starts here
              </h1>
              <p className="text-white/90 text-sm md:text-base max-w-[280px] leading-relaxed">
                Sign in to manage your website content, view leads, and control your digital presence.
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full md:w-[55%] lg:w-1/2 p-8 md:p-16 flex flex-col justify-center items-center bg-white relative">
            {/* Subtle background circles on the right side like the reference */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f4f7fb] rounded-bl-full opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 border-[20px] border-[#f4f7fb] rounded-tr-full opacity-50 pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-10 grid grid-cols-5 gap-2 opacity-20 pointer-events-none">
              {[...Array(25)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>)}
            </div>

            <div className="w-full max-w-[360px] relative z-10">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-white text-[#5b7cfa] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_8px_20px_rgba(91,124,250,0.15)] border border-slate-50">
                  <LayoutDashboard size={32} strokeWidth={2.5} />
                </div>
                <h2 className="text-[22px] font-bold text-slate-800">Hello ! Welcome back</h2>
              </div>

              <form onSubmit={handleAuth} className="space-y-5">
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-2">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-[#5b7cfa]" />
                    </div>
                    <input 
                      type="email" 
                      required
                      value={email || ""}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#f8fafc] border border-transparent text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#5b7cfa]/30 focus:ring-4 focus:ring-[#5b7cfa]/10 outline-none transition-all text-[14px]"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-[#5b7cfa]" />
                    </div>
                    <input 
                      type="password" 
                      required
                      value={password || ""}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#f8fafc] border border-transparent text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#5b7cfa]/30 focus:ring-4 focus:ring-[#5b7cfa]/10 outline-none transition-all text-[14px]"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[13px] pt-2 pb-4">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" className="peer appearance-none w-4 h-4 rounded bg-[#f8fafc] border border-slate-200 checked:bg-[#5b7cfa] checked:border-[#5b7cfa] transition-colors cursor-pointer" />
                      <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="text-slate-500 font-medium group-hover:text-slate-700 transition-colors">Remember me</span>
                  </label>
                  <button type="button" onClick={() => toast.info("Please contact the super admin to reset your password.")} className="text-[#5b7cfa] hover:underline font-medium">
                    Reset Password!
                  </button>
                </div>

                <button 
                  type="submit" 
                  disabled={authLoading}
                  className="w-full bg-[#5b7cfa] hover:bg-[#4a6be0] text-white py-3.5 rounded-xl font-semibold transition-all disabled:opacity-70 flex justify-center items-center shadow-[0_8px_20px_rgba(91,124,250,0.25)] hover:shadow-[0_10px_25px_rgba(91,124,250,0.35)] hover:-translate-y-0.5 text-[15px]"
                >
                  {authLoading ? <Loader2 size={18} className="animate-spin" /> : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Render Admin Dashboard ---
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans overflow-x-hidden">
      
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-20 md:hidden" 
            onClick={() => setIsSidebarOpen(false)} 
          />
        )}
      </AnimatePresence>

      <aside className={`w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-30 shadow-2xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <LayoutDashboard size={20} className="text-primary" />
            Admin Panel
          </h1>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-2">
          <a href={import.meta.env.VITE_WEBSITE_URL || "#"} target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm">
            <Globe size={16} />
            View Website
          </a>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 flex flex-col min-h-screen w-full max-w-[100vw]">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-slate-600 hover:text-primary p-1" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="font-semibold text-slate-800 text-sm md:text-base truncate">
              Dashboard / {navItems.find(n => n.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-2 md:gap-3 text-sm text-slate-600">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
              {session.user.email?.charAt(0).toUpperCase()}
            </span>
            <span className="hidden sm:inline-block truncate max-w-[150px] md:max-w-none">{session.user.email}</span>
          </div>
        </header>

        <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-5xl mx-auto w-full">
          
          {/* General Settings Tab (Merged Hero & About) */}
          {activeTab === "general" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">General Settings</h2>
                  <p className="text-slate-500 mt-1 text-sm md:text-base">Manage your website's core information, hero, and about sections.</p>
                </div>
                <button disabled={isSaving} onClick={handleSaveGeneral} className="w-full sm:w-auto justify-center bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all disabled:opacity-70">
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
                </button>
              </div>

              {/* Core Information */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Core Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                  <ImageUploader 
                    label="Logo Image" 
                    value={generalForm.logoUrl} 
                    onChange={(val) => setGeneralForm({...generalForm, logoUrl: val})} 
                  />
                  <ImageUploader 
                    label="Chatbot Icon" 
                    value={generalForm.chatbotIconUrl || ""} 
                    onChange={(val) => setGeneralForm({...generalForm, chatbotIconUrl: val})} 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email</label>
                    <input 
                      type="email" 
                      value={generalForm.email || ""}
                      onChange={(e) => setGeneralForm({...generalForm, email: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Contact Phone</label>
                    <input 
                      type="text" 
                      value={generalForm.phone || ""}
                      onChange={(e) => setGeneralForm({...generalForm, phone: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Physical Address</label>
                  <textarea 
                    rows={3}
                    value={generalForm.address || ""}
                    onChange={(e) => setGeneralForm({...generalForm, address: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 bg-white"
                  />
                </div>
              </div>

              {/* Hero Section */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Hero Section</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Main Title</label>
                    <input 
                      type="text" 
                      value={heroForm.title || ""}
                      onChange={(e) => setHeroForm({...heroForm, title: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Highlight Text (Gradient)</label>
                    <input 
                      type="text" 
                      value={heroForm.highlight || ""}
                      onChange={(e) => setHeroForm({...heroForm, highlight: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Mini Description (Left Border Text)</label>
                    <textarea 
                      rows={2}
                      value={heroForm.miniDescription || ""}
                      onChange={(e) => setHeroForm({...heroForm, miniDescription: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Main Description</label>
                    <textarea 
                      rows={4}
                      value={heroForm.description || ""}
                      onChange={(e) => setHeroForm({...heroForm, description: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4">About Section</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                    <input 
                      type="text" 
                      value={aboutForm.title || ""}
                      onChange={(e) => setAboutForm({...aboutForm, title: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Highlight Text (Gradient)</label>
                    <input 
                      type="text" 
                      value={aboutForm.highlight || ""}
                      onChange={(e) => setAboutForm({...aboutForm, highlight: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea 
                      rows={4}
                      value={aboutForm.description || ""}
                      onChange={(e) => setAboutForm({...aboutForm, description: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Statistics Counters Section */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Website Statistics Counters</h3>
                
                <StatEditor 
                  title="Hero Section Stats" 
                  stats={generalForm.stats?.hero || []} 
                  showIcon={true}
                  onChange={(newStats) => setGeneralForm({...generalForm, stats: {...generalForm.stats, hero: newStats}})} 
                />
                
                <StatEditor 
                  title="About Section Stats" 
                  stats={generalForm.stats?.about || []} 
                  onChange={(newStats) => setGeneralForm({...generalForm, stats: {...generalForm.stats, about: newStats}})} 
                />
                
                <StatEditor 
                  title="Training Page Stats" 
                  stats={generalForm.stats?.training || []} 
                  onChange={(newStats) => setGeneralForm({...generalForm, stats: {...generalForm.stats, training: newStats}})} 
                />

                <StatEditor 
                  title="Portfolio Page Stats" 
                  stats={generalForm.stats?.portfolio || []} 
                  showIcon={true}
                  onChange={(newStats) => setGeneralForm({...generalForm, stats: {...generalForm.stats, portfolio: newStats}})} 
                />
              </div>

            </motion.div>
          )}

          {/* Service Pages Content Tab */}
          {activeTab === "service_pages" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">Service Pages Content</h2>
                  <p className="text-slate-500 mt-1 text-sm md:text-base">Manage Industries and FAQs for each specific service page.</p>
                </div>
                <button disabled={isSaving} onClick={handleSaveServicePages} className="w-full sm:w-auto justify-center bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all disabled:opacity-70">
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 mb-8">
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Service Page to Edit</label>
                <select 
                  value={selectedServiceSlug} 
                  onChange={(e) => setSelectedServiceSlug(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 bg-white"
                >
                  <option value="full-stack-development">Full Stack Development</option>
                  <option value="mobile-app-development">Mobile App Development</option>
                  <option value="web-application-development">Web Application Development</option>
                  <option value="e-commerce-development">E-commerce Development</option>
                  <option value="digital-marketing-services">Digital Marketing Services</option>
                  <option value="product-development">Product Development</option>
                  <option value="hire-dedicated-developers">Hire Dedicated Developers</option>
                  <option value="managed-services">Managed Services</option>
                  <option value="cms-development">CMS Development</option>
                </select>
              </div>

              {/* Industries We Serve */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900">Industries We Serve</h3>
                  <button onClick={() => updateCurrentServiceData('industries', [...(currentServiceData.industries || []), { label: "New Industry", desc: "" }])} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium flex items-center gap-1 text-sm transition-all">
                    <Plus size={16} /> Add Industry
                  </button>
                </div>
                <div className="space-y-4">
                  {(currentServiceData.industries || []).map((ind: any, index: number) => (
                    <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative">
                      <button onClick={() => {
                        const newInds = [...currentServiceData.industries];
                        newInds.splice(index, 1);
                        updateCurrentServiceData('industries', newInds);
                      }} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      <div className="space-y-3 pr-8">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Industry Name</label>
                          <input type="text" value={ind.label || ""} onChange={(e) => {
                            const newInds = [...currentServiceData.industries];
                            newInds[index].label = e.target.value;
                            updateCurrentServiceData('industries', newInds);
                          }} className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm text-slate-900 bg-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Description</label>
                          <textarea rows={3} value={ind.desc || ""} onChange={(e) => {
                            const newInds = [...currentServiceData.industries];
                            newInds[index].desc = e.target.value;
                            updateCurrentServiceData('industries', newInds);
                          }} className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm text-slate-900 bg-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!currentServiceData.industries || currentServiceData.industries.length === 0) && (
                    <p className="text-sm text-slate-500 italic">No industries added yet. The default ones will be shown on the website.</p>
                  )}
                </div>
              </div>

              {/* FAQs */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h3>
                  <button onClick={() => updateCurrentServiceData('faqs', [...(currentServiceData.faqs || []), { q: "", a: "" }])} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium flex items-center gap-1 text-sm transition-all">
                    <Plus size={16} /> Add FAQ
                  </button>
                </div>
                <div className="space-y-4">
                  {(currentServiceData.faqs || []).map((faq: any, index: number) => (
                    <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative">
                      <button onClick={() => {
                        const newFaqs = [...currentServiceData.faqs];
                        newFaqs.splice(index, 1);
                        updateCurrentServiceData('faqs', newFaqs);
                      }} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      <div className="space-y-3 pr-8">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Question</label>
                          <input type="text" value={faq.q || ""} onChange={(e) => {
                            const newFaqs = [...currentServiceData.faqs];
                            newFaqs[index].q = e.target.value;
                            updateCurrentServiceData('faqs', newFaqs);
                          }} className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm text-slate-900 bg-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Answer</label>
                          <textarea rows={2} value={faq.a || ""} onChange={(e) => {
                            const newFaqs = [...currentServiceData.faqs];
                            newFaqs[index].a = e.target.value;
                            updateCurrentServiceData('faqs', newFaqs);
                          }} className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm text-slate-900 bg-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!currentServiceData.faqs || currentServiceData.faqs.length === 0) && (
                    <p className="text-sm text-slate-500 italic">No FAQs added yet. The default ones will be shown on the website.</p>
                  )}
                </div>
              </div>

            </motion.div>
          )}

          {/* Portfolio Projects Tab */}
          {activeTab === "portfolio_projects" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">Portfolio Projects</h2>
                  <p className="text-slate-500 mt-1 text-sm md:text-base">Manage the projects displayed on the main Portfolio page.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button onClick={addPortfolioProject} className="justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all">
                    <Plus size={18} /> Add Project
                  </button>
                  <button disabled={isSaving} onClick={handleSavePortfolio} className="justify-center bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all disabled:opacity-70">
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
                  </button>
                </div>
              </div>

              {/* Portfolio Page Header Editor */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Portfolio Page Header</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Badge Text</label>
                    <input 
                      type="text" 
                      value={portfolioPageForm?.badge || ""} 
                      onChange={e => setPortfolioPageForm({...portfolioPageForm, badge: e.target.value})} 
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Title Part 1</label>
                    <input 
                      type="text" 
                      value={portfolioPageForm?.title1 || ""} 
                      onChange={e => setPortfolioPageForm({...portfolioPageForm, title1: e.target.value})} 
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Title Part 2 (Gradient)</label>
                    <input 
                      type="text" 
                      value={portfolioPageForm?.title2 || ""} 
                      onChange={e => setPortfolioPageForm({...portfolioPageForm, title2: e.target.value})} 
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea 
                    rows={2} 
                    value={portfolioPageForm?.description || ""} 
                    onChange={e => setPortfolioPageForm({...portfolioPageForm, description: e.target.value})} 
                    className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white" 
                  />
                </div>
              </div>

              {/* Projects List */}
              <h3 className="text-lg font-bold text-slate-900 mb-4">Projects List</h3>
              <div className="grid grid-cols-1 gap-6 md:gap-8">
                {portfolioProjectsForm.map((p, index) => (
                  <div key={p.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 relative">
                    <button 
                      onClick={() => removePortfolioProject(p.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    
                    <div className="space-y-6 pr-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Project Title</label>
                          <input 
                            type="text" 
                            value={p.title || ""}
                            onChange={(e) => {
                              const newForm = structuredClone(portfolioProjectsForm);
                              newForm[index].title = e.target.value;
                              setPortfolioProjectsForm(newForm);
                            }}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                            <input 
                              type="text" 
                              value={p.category || ""}
                              onChange={(e) => {
                                const newForm = structuredClone(portfolioProjectsForm);
                                newForm[index].category = e.target.value;
                                setPortfolioProjectsForm(newForm);
                              }}
                              placeholder="e.g. Web App"
                              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                            <select 
                              value={p.status || "Completed"}
                              onChange={(e) => {
                                const newForm = structuredClone(portfolioProjectsForm);
                                newForm[index].status = e.target.value;
                                setPortfolioProjectsForm(newForm);
                              }}
                              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                            >
                              <option value="Completed">Completed</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Coming Soon">Coming Soon</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Rating (1-5)</label>
                            <input 
                              type="number" 
                              min="1" max="5"
                              value={p.rating || 5}
                              onChange={(e) => {
                                const newForm = structuredClone(portfolioProjectsForm);
                                newForm[index].rating = parseInt(e.target.value) || 5;
                                setPortfolioProjectsForm(newForm);
                              }}
                              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                        <textarea 
                          rows={2}
                          value={p.description || ""}
                          onChange={(e) => {
                            const newForm = structuredClone(portfolioProjectsForm);
                            newForm[index].description = e.target.value;
                            setPortfolioProjectsForm(newForm);
                          }}
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Tech Stack (Comma Separated)</label>
                          <CommaSeparatedInput 
                            rows={2}
                            value={p.techStack || []}
                            onChange={(val) => {
                              const newForm = structuredClone(portfolioProjectsForm);
                              newForm[index].techStack = val;
                              setPortfolioProjectsForm(newForm);
                            }}
                            placeholder="React, Node.js, AWS..."
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Button Text (CTA)</label>
                          <input 
                            type="text" 
                            value={p.cta || ""}
                            onChange={(e) => {
                              const newForm = structuredClone(portfolioProjectsForm);
                              newForm[index].cta = e.target.value;
                              setPortfolioProjectsForm(newForm);
                            }}
                            placeholder="e.g. View Project"
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white mb-4"
                          />
                          
                          <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={p.featured || false}
                                onChange={(e) => {
                                  const newForm = structuredClone(portfolioProjectsForm);
                                  newForm[index].featured = e.target.checked;
                                  setPortfolioProjectsForm(newForm);
                                }}
                                className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                              />
                              <span className="text-sm font-medium text-slate-700">Set as Featured (Top)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={p.highlight || false}
                                onChange={(e) => {
                                  const newForm = structuredClone(portfolioProjectsForm);
                                  newForm[index].highlight = e.target.checked;
                                  setPortfolioProjectsForm(newForm);
                                }}
                                className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                              />
                              <span className="text-sm font-medium text-slate-700">Set as Highlight (2nd)</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <ImageUploader 
                        label="Project Image" 
                        value={p.image} 
                        onChange={(val) => {
                          const newForm = structuredClone(portfolioProjectsForm);
                          newForm[index].image = val;
                          setPortfolioProjectsForm(newForm);
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Footer & Social Tab */}
          {activeTab === "footer" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">Footer & Social Links</h2>
                  <p className="text-slate-500 mt-1 text-sm md:text-base">Manage footer content, tags, and social media URLs.</p>
                </div>
                <button disabled={isSaving} onClick={() => handleSaveSection('footer', footerForm)} className="w-full sm:w-auto justify-center bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all disabled:opacity-70">
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
                </button>
              </div>

              <div className="space-y-6">
                {/* Social Links */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <LinkIcon size={18} className="text-primary" /> Social Media Links
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['facebook', 'twitter', 'linkedin', 'instagram', 'whatsapp'].map((platform) => (
                      <div key={platform}>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5 capitalize">
                          {platform} {platform === 'whatsapp' ? 'Number' : 'URL'}
                        </label>
                        <input 
                          type={platform === 'whatsapp' ? 'text' : 'url'} 
                          value={footerForm.social?.[platform as keyof typeof footerForm.social] || ""}
                          onChange={(e) => setFooterForm({
                            ...footerForm, 
                            social: { ...(footerForm.social || {}), [platform]: e.target.value }
                          })}
                          placeholder={platform === 'whatsapp' ? "e.g. 919876543210 (with country code)" : `https://${platform}.com/yourpage`}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Content */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-5">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Footer Content</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Footer Description (Bottom Left)</label>
                    <textarea 
                      rows={2}
                      value={footerForm.description || ""}
                      onChange={(e) => setFooterForm({...footerForm, description: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Newsletter Text</label>
                      <input 
                        type="text" 
                        value={footerForm.newsletterText || ""}
                        onChange={(e) => setFooterForm({...footerForm, newsletterText: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Copyright Text</label>
                      <input 
                        type="text" 
                        value={footerForm.copyrightText || ""}
                        onChange={(e) => setFooterForm({...footerForm, copyrightText: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Expertise Tags (Comma Separated)</label>
                    <CommaSeparatedInput 
                      rows={3}
                      value={footerForm.tags || []}
                      onChange={(val) => setFooterForm({ ...footerForm, tags: val })}
                      placeholder="Web Dev, Mobile Apps, UI/UX, React..."
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">What We Offer</h2>
                  <p className="text-slate-500 mt-1 text-sm md:text-base">Manage your services and their icons.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button onClick={addService} className="justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all">
                    <Plus size={18} /> Add Service
                  </button>
                  <button disabled={isSaving} onClick={() => handleSaveSection('services', servicesForm)} className="justify-center bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all disabled:opacity-70">
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {servicesForm.map((s, index) => (
                  <div key={s.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 relative">
                    <button 
                      onClick={() => removeService(s.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="space-y-4 pr-6">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Service Title</label>
                        <input 
                          type="text" 
                          value={s.title || ""}
                          onChange={(e) => {
                            const newForm = structuredClone(servicesForm);
                            newForm[index].title = e.target.value;
                            setServicesForm(newForm);
                          }}
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                        <textarea 
                          rows={2}
                          value={s.desc || ""}
                          onChange={(e) => {
                            const newForm = structuredClone(servicesForm);
                            newForm[index].desc = e.target.value;
                            setServicesForm(newForm);
                          }}
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                        />
                      </div>
                      <ImageUploader 
                        label="Service Icon" 
                        value={s.iconUrl} 
                        onChange={(val) => {
                          const newForm = structuredClone(servicesForm);
                          newForm[index].iconUrl = val;
                          setServicesForm(newForm);
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">Our Products</h2>
                  <p className="text-slate-500 mt-1 text-sm md:text-base">Manage the products shown around the central graphic.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button onClick={addProduct} className="justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all">
                    <Plus size={18} /> Add Product
                  </button>
                  <button disabled={isSaving} onClick={() => handleSaveSection('products', productsForm)} className="justify-center bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all disabled:opacity-70">
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {productsForm.map((p, index) => (
                  <div key={p.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 relative">
                    <button 
                      onClick={() => removeProduct(p.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="space-y-4 pr-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Product Title</label>
                          <input 
                            type="text" 
                            value={p.title || ""}
                            onChange={(e) => {
                              const newForm = structuredClone(productsForm);
                              newForm[index].title = e.target.value;
                              setProductsForm(newForm);
                            }}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Position</label>
                          <select 
                            value={p.category || "left"}
                            onChange={(e) => {
                              const newForm = structuredClone(productsForm);
                              newForm[index].category = e.target.value as 'left' | 'right';
                              setProductsForm(newForm);
                            }}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white text-slate-900"
                          >
                            <option value="left">Left Side</option>
                            <option value="right">Right Side</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                        <input 
                          type="text"
                          value={p.desc || ""}
                          onChange={(e) => {
                            const newForm = structuredClone(productsForm);
                            newForm[index].desc = e.target.value;
                            setProductsForm(newForm);
                          }}
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                        />
                      </div>
                      <ImageUploader 
                        label="Product Icon" 
                        value={p.iconUrl} 
                        onChange={(val) => {
                          const newForm = structuredClone(productsForm);
                          newForm[index].iconUrl = val;
                          setProductsForm(newForm);
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Focus Industries Tab */}
          {activeTab === "industries" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">Focus Industries</h2>
                  <p className="text-slate-500 mt-1 text-sm md:text-base">Manage the industries and case studies displayed.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button onClick={addIndustry} className="justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all">
                    <Plus size={18} /> Add Industry
                  </button>
                  <button disabled={isSaving} onClick={() => handleSaveSection('industries', industriesForm)} className="justify-center bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all disabled:opacity-70">
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:gap-8">
                {industriesForm.map((ind, index) => (
                  <div key={ind.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 relative">
                    <button 
                      onClick={() => removeIndustry(ind.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    
                    <div className="space-y-6 pr-6">
                      {/* Basic Info */}
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-3 border-b pb-2">Basic Info</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Industry Label</label>
                            <input 
                              type="text" 
                              value={ind.label || ""}
                              onChange={(e) => {
                                const newForm = structuredClone(industriesForm);
                                newForm[index].label = e.target.value;
                                setIndustriesForm(newForm);
                              }}
                              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                            <textarea 
                              rows={2}
                              value={ind.description || ""}
                              onChange={(e) => {
                                const newForm = structuredClone(industriesForm);
                                newForm[index].description = e.target.value;
                                setIndustriesForm(newForm);
                              }}
                              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <ImageUploader 
                            label="Industry Image" 
                            value={ind.image} 
                            onChange={(val) => {
                              const newForm = structuredClone(industriesForm);
                              newForm[index].image = val;
                              setIndustriesForm(newForm);
                            }} 
                          />
                        </div>
                        <div className="mt-4">
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Bullet Points (Comma Separated)</label>
                          <CommaSeparatedInput 
                            rows={2}
                            value={ind.bullets || []}
                            onChange={(val) => {
                              const newForm = structuredClone(industriesForm);
                              newForm[index].bullets = val;
                              setIndustriesForm(newForm);
                            }}
                            placeholder="e.g. Custom storefront, Payment integration, Analytics"
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                          />
                        </div>
                      </div>

                      {/* Case Study */}
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-3 border-b pb-2">Case Study</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Case Study Title</label>
                            <input 
                              type="text" 
                              value={ind.caseStudy?.title || ""}
                              onChange={(e) => {
                                const newForm = structuredClone(industriesForm);
                                newForm[index].caseStudy.title = e.target.value;
                                setIndustriesForm(newForm);
                              }}
                              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Case Study Description</label>
                            <textarea 
                              rows={2}
                              value={ind.caseStudy?.description || ""}
                              onChange={(e) => {
                                const newForm = structuredClone(industriesForm);
                                newForm[index].caseStudy.description = e.target.value;
                                setIndustriesForm(newForm);
                              }}
                              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {ind.caseStudy?.stats?.map((stat, statIndex) => (
                            <div key={statIndex} className="flex gap-2">
                              <div className="flex-1">
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Stat {statIndex + 1} Label</label>
                                <input 
                                  type="text" 
                                  value={stat.label || ""}
                                  onChange={(e) => {
                                    const newForm = structuredClone(industriesForm);
                                    newForm[index].caseStudy.stats[statIndex].label = e.target.value;
                                    setIndustriesForm(newForm);
                                  }}
                                  placeholder="e.g. Revenue Growth"
                                  className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Stat {statIndex + 1} Value</label>
                                <input 
                                  type="text" 
                                  value={stat.value || ""}
                                  onChange={(e) => {
                                    const newForm = structuredClone(industriesForm);
                                    newForm[index].caseStudy.stats[statIndex].value = e.target.value;
                                    setIndustriesForm(newForm);
                                  }}
                                  placeholder="e.g. +45%"
                                  className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Testimonial */}
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-3 border-b pb-2">Industry Testimonial</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Quote</label>
                            <textarea 
                              rows={2}
                              value={ind.testimonial?.quote || ""}
                              onChange={(e) => {
                                const newForm = structuredClone(industriesForm);
                                newForm[index].testimonial.quote = e.target.value;
                                setIndustriesForm(newForm);
                              }}
                              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Author Name</label>
                            <input 
                              type="text" 
                              value={ind.testimonial?.author || ""}
                              onChange={(e) => {
                                const newForm = structuredClone(industriesForm);
                                newForm[index].testimonial.author = e.target.value;
                                setIndustriesForm(newForm);
                              }}
                              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Author Role</label>
                            <input 
                              type="text" 
                              value={ind.testimonial?.role || ""}
                              onChange={(e) => {
                                const newForm = structuredClone(industriesForm);
                                newForm[index].testimonial.role = e.target.value;
                                setIndustriesForm(newForm);
                              }}
                              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Training Programs Tab */}
          {activeTab === "training" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">Training Programs</h2>
                  <p className="text-slate-500 mt-1 text-sm md:text-base">Manage workshops, topics, audiences, and gallery.</p>
                </div>
                <button disabled={isSaving} onClick={handleSaveTrainingPage} className="w-full sm:w-auto justify-center bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all disabled:opacity-70">
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
                </button>
              </div>

              {/* Programs List */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900">Training Programs</h3>
                  <button onClick={addTrainingProgram} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium flex items-center gap-1 text-sm transition-all">
                    <Plus size={16} /> Add Program
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trainingForm.map((prog, index) => (
                    <div key={prog.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative">
                      <button onClick={() => removeTrainingProgram(prog.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      <div className="space-y-3 pr-8">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Title</label>
                          <input type="text" value={prog.title || ""} onChange={(e) => {
                            const newForm = structuredClone(trainingForm);
                            newForm[index].title = e.target.value;
                            setTrainingForm(newForm);
                          }} className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm text-slate-900 bg-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Duration</label>
                            <input type="text" value={prog.duration || ""} onChange={(e) => {
                              const newForm = structuredClone(trainingForm);
                              newForm[index].duration = e.target.value;
                              setTrainingForm(newForm);
                            }} className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm text-slate-900 bg-white" />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Mode</label>
                            <input type="text" value={prog.mode || ""} onChange={(e) => {
                              const newForm = structuredClone(trainingForm);
                              newForm[index].mode = e.target.value;
                              setTrainingForm(newForm);
                            }} className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm text-slate-900 bg-white" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Audience</label>
                            <input type="text" value={prog.audience || ""} onChange={(e) => {
                              const newForm = structuredClone(trainingForm);
                              newForm[index].audience = e.target.value;
                              setTrainingForm(newForm);
                            }} className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm text-slate-900 bg-white" />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Icon (Lucide)</label>
                            <input type="text" value={prog.iconName || ""} onChange={(e) => {
                              const newForm = structuredClone(trainingForm);
                              newForm[index].iconName = e.target.value;
                              setTrainingForm(newForm);
                            }} className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm text-slate-900 bg-white" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Description</label>
                          <textarea rows={2} value={prog.desc || ""} onChange={(e) => {
                            const newForm = structuredClone(trainingForm);
                            newForm[index].desc = e.target.value;
                            setTrainingForm(newForm);
                          }} className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm text-slate-900 bg-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topics & Audiences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Topics Covered</h3>
                  <CommaSeparatedInput 
                    rows={4}
                    value={trainingTopicsForm || []}
                    onChange={(val) => setTrainingTopicsForm(val)}
                    placeholder="Web Development, App Development, AI Tools..."
                    className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                  />
                  <p className="text-xs text-slate-500 mt-2">Comma separated list of topics.</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Target Audiences</h3>
                  <CommaSeparatedInput 
                    rows={4}
                    value={trainingAudiencesForm || []}
                    onChange={(val) => setTrainingAudiencesForm(val)}
                    placeholder="Schools, Colleges, Engineering Students..."
                    className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                  />
                  <p className="text-xs text-slate-500 mt-2">Comma separated list of audiences.</p>
                </div>
              </div>

              {/* Formats & Gallery */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900">Program Formats</h3>
                  <button onClick={addTrainingFormat} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium flex items-center gap-1 text-sm transition-all">
                    <Plus size={16} /> Add Format
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {trainingFormatsForm.map((format, index) => (
                    <div key={format.id} className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-200">
                      <input type="text" value={format.title} onChange={(e) => {
                        const newForm = structuredClone(trainingFormatsForm);
                        newForm[index].title = e.target.value;
                        setTrainingFormatsForm(newForm);
                      }} className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded" placeholder="Format Title" />
                      <input type="text" value={format.iconName} onChange={(e) => {
                        const newForm = structuredClone(trainingFormatsForm);
                        newForm[index].iconName = e.target.value;
                        setTrainingFormatsForm(newForm);
                      }} className="w-24 px-2 py-1 text-sm border border-slate-300 rounded" placeholder="Icon" />
                      <button onClick={() => removeTrainingFormat(format.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900">Event Gallery</h3>
                  <button onClick={addGalleryImage} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium flex items-center gap-1 text-sm transition-all">
                    <Plus size={16} /> Add Image
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {trainingGalleryForm.map((img, index) => (
                    <div key={index} className="bg-slate-50 p-3 rounded-lg border border-slate-200 relative">
                      <button onClick={() => removeGalleryImage(index)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 z-10 bg-white rounded-full p-1 shadow-sm transition-colors"><Trash2 size={14} /></button>
                      <ImageUploader 
                        label={`Image ${index + 1}`} 
                        value={img} 
                        onChange={(val) => {
                          const newForm = [...trainingGalleryForm];
                          newForm[index] = val;
                          setTrainingGalleryForm(newForm);
                        }} 
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Institution Testimonials */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900">Institution Testimonials</h3>
                  <button onClick={addTrainingTestimonial} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium flex items-center gap-1 text-sm transition-all">
                    <Plus size={16} /> Add Testimonial
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trainingTestimonialsForm.map((t, index) => (
                    <div key={t.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative">
                      <button onClick={() => removeTrainingTestimonial(t.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      <div className="space-y-3 pr-8">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Quote</label>
                          <textarea rows={2} value={t.quote || ""} onChange={(e) => {
                            const newForm = structuredClone(trainingTestimonialsForm);
                            newForm[index].quote = e.target.value;
                            setTrainingTestimonialsForm(newForm);
                          }} className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm text-slate-900 bg-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Author Name</label>
                            <input type="text" value={t.author || ""} onChange={(e) => {
                              const newForm = structuredClone(trainingTestimonialsForm);
                              newForm[index].author = e.target.value;
                              setTrainingTestimonialsForm(newForm);
                            }} className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm text-slate-900 bg-white" />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Role / Institution</label>
                            <input type="text" value={t.role || ""} onChange={(e) => {
                              const newForm = structuredClone(trainingTestimonialsForm);
                              newForm[index].role = e.target.value;
                              setTrainingTestimonialsForm(newForm);
                            }} className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm text-slate-900 bg-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

          {/* Jobs Tab */}
          {activeTab === "jobs" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">Open Positions</h2>
                  <p className="text-slate-500 mt-1 text-sm md:text-base">Manage career opportunities displayed on the Careers page.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button onClick={addJob} className="justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all">
                    <Plus size={18} /> Add Job
                  </button>
                  <button disabled={isSaving} onClick={() => handleSaveSection('jobs', jobsForm)} className="justify-center bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all disabled:opacity-70">
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:gap-8">
                {jobsForm.map((job, index) => (
                  <div key={job.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 relative">
                    <button 
                      onClick={() => removeJob(job.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    
                    <div className="space-y-6 pr-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Job Title</label>
                          <input 
                            type="text" 
                            value={job.title || ""}
                            onChange={(e) => {
                              const newForm = structuredClone(jobsForm);
                              newForm[index].title = e.target.value;
                              setJobsForm(newForm);
                            }}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                            <input 
                              type="text" 
                              value={job.category || ""}
                              onChange={(e) => {
                                const newForm = structuredClone(jobsForm);
                                newForm[index].category = e.target.value;
                                setJobsForm(newForm);
                              }}
                              placeholder="e.g. Engineering"
                              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Job Type</label>
                            <select 
                              value={job.type || "Full Time"}
                              onChange={(e) => {
                                const newForm = structuredClone(jobsForm);
                                newForm[index].type = e.target.value;
                                setJobsForm(newForm);
                              }}
                              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                            >
                              <option value="Full Time">Full Time</option>
                              <option value="Part Time">Part Time</option>
                              <option value="Contract">Contract</option>
                              <option value="Internship">Internship</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Location</label>
                          <input 
                            type="text" 
                            value={job.location || ""}
                            onChange={(e) => {
                              const newForm = structuredClone(jobsForm);
                              newForm[index].location = e.target.value;
                              setJobsForm(newForm);
                            }}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Salary</label>
                          <input 
                            type="text" 
                            value={job.salary || ""}
                            onChange={(e) => {
                              const newForm = structuredClone(jobsForm);
                              newForm[index].salary = e.target.value;
                              setJobsForm(newForm);
                            }}
                            placeholder="e.g. Not Disclosed"
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Apply Link (Optional)</label>
                          <input 
                            type="url" 
                            value={job.applyLink || ""}
                            onChange={(e) => {
                              const newForm = structuredClone(jobsForm);
                              newForm[index].applyLink = e.target.value;
                              setJobsForm(newForm);
                            }}
                            placeholder="https://forms.gle/..."
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Job Description</label>
                        <textarea 
                          rows={3}
                          value={job.desc || ""}
                          onChange={(e) => {
                            const newForm = structuredClone(jobsForm);
                            newForm[index].desc = e.target.value;
                            setJobsForm(newForm);
                          }}
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Requirements (Comma Separated)</label>
                        <CommaSeparatedInput 
                          rows={3}
                          value={job.requirements || []}
                          onChange={(val) => {
                            const newForm = structuredClone(jobsForm);
                            newForm[index].requirements = val;
                            setJobsForm(newForm);
                          }}
                          placeholder="5+ years experience, Expert in React, Strong communication..."
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                        />
                      </div>

                      <ImageUploader 
                        label="Job Icon (Optional)" 
                        value={job.iconUrl} 
                        onChange={(val) => {
                          const newForm = structuredClone(jobsForm);
                          newForm[index].iconUrl = val;
                          setJobsForm(newForm);
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Team Testimonials Tab */}
          {activeTab === "team_testimonials" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">Team Testimonials</h2>
                  <p className="text-slate-500 mt-1 text-sm md:text-base">Manage employee feedback shown on the Careers page.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button onClick={addTeamTestimonial} className="justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all">
                    <Plus size={18} /> Add Testimonial
                  </button>
                  <button disabled={isSaving} onClick={() => handleSaveSection('teamTestimonials', teamTestimonialsForm)} className="justify-center bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all disabled:opacity-70">
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {teamTestimonialsForm.map((t, index) => (
                  <div key={t.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 relative">
                    <button 
                      onClick={() => removeTeamTestimonial(t.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="space-y-4 pr-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Employee Name</label>
                          <input 
                            type="text" 
                            value={t.name || ""}
                            onChange={(e) => {
                              const newForm = structuredClone(teamTestimonialsForm);
                              newForm[index].name = e.target.value;
                              setTeamTestimonialsForm(newForm);
                            }}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Role / Position</label>
                          <input 
                            type="text" 
                            value={t.role || ""}
                            onChange={(e) => {
                              const newForm = structuredClone(teamTestimonialsForm);
                              newForm[index].role = e.target.value;
                              setTeamTestimonialsForm(newForm);
                            }}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Rating (1-5)</label>
                        <input 
                          type="number" 
                          min="1" max="5"
                          value={t.rating || 5}
                          onChange={(e) => {
                            const newForm = structuredClone(teamTestimonialsForm);
                            newForm[index].rating = parseInt(e.target.value) || 5;
                            setTeamTestimonialsForm(newForm);
                          }}
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Quote</label>
                        <textarea 
                          rows={3}
                          value={t.quote || ""}
                          onChange={(e) => {
                            const newForm = structuredClone(teamTestimonialsForm);
                            newForm[index].quote = e.target.value;
                            setTeamTestimonialsForm(newForm);
                          }}
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                        />
                      </div>
                      <ImageUploader 
                        label="Employee Profile Image" 
                        value={t.image} 
                        onChange={(val) => {
                          const newForm = structuredClone(teamTestimonialsForm);
                          newForm[index].image = val;
                          setTeamTestimonialsForm(newForm);
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Clutch Reviews Tab */}
          {activeTab === "clutch_reviews" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">Clutch Reviews</h2>
                  <p className="text-slate-500 mt-1 text-sm md:text-base">Manage the reviews shown in the Clutch carousel.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button onClick={addClutchReview} className="justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all">
                    <Plus size={18} /> Add Review
                  </button>
                  <button disabled={isSaving} onClick={() => handleSaveSection('clutchReviews', clutchReviewsForm)} className="justify-center bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all disabled:opacity-70">
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {clutchReviewsForm.map((r, index) => (
                  <div key={r.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 relative">
                    <button 
                      onClick={() => removeClutchReview(r.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="space-y-4 pr-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Author (e.g. CEO,)</label>
                          <input 
                            type="text" 
                            value={r.author || ""}
                            onChange={(e) => {
                              const newForm = structuredClone(clutchReviewsForm);
                              newForm[index].author = e.target.value;
                              setClutchReviewsForm(newForm);
                            }}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Company</label>
                          <input 
                            type="text" 
                            value={r.company || ""}
                            onChange={(e) => {
                              const newForm = structuredClone(clutchReviewsForm);
                              newForm[index].company = e.target.value;
                              setClutchReviewsForm(newForm);
                            }}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Rating (e.g. 5.0)</label>
                        <input 
                          type="text" 
                          value={r.rating || "5.0"}
                          onChange={(e) => {
                            const newForm = structuredClone(clutchReviewsForm);
                            newForm[index].rating = e.target.value;
                            setClutchReviewsForm(newForm);
                          }}
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Review Text</label>
                        <textarea 
                          rows={3}
                          value={r.text || ""}
                          onChange={(e) => {
                            const newForm = structuredClone(clutchReviewsForm);
                            newForm[index].text = e.target.value;
                            setClutchReviewsForm(newForm);
                          }}
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Chatbot Tab */}
          {activeTab === "chatbot" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">Chatbot Knowledge Base</h2>
                  <p className="text-slate-500 mt-1 text-sm md:text-base">Train the chatbot on how to respond to specific keywords.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button onClick={addChatbotQA} className="justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all">
                    <Plus size={18} /> Add Q&A
                  </button>
                  <button disabled={isSaving} onClick={handleSaveChatbot} className="justify-center bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all disabled:opacity-70">
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
                  </button>
                </div>
              </div>

              {/* Chatbot General Settings */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Chatbot Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Suggested Questions (Comma Separated)</label>
                    <CommaSeparatedInput 
                      rows={3}
                      value={generalForm.chatbotSuggestions || []}
                      onChange={(val) => setGeneralForm({ ...generalForm, chatbotSuggestions: val })}
                      placeholder="What services do you offer?, How much does it cost?..."
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 bg-white"
                    />
                    <p className="text-xs text-slate-500 mt-2">These appear as quick-click chips above the chat input.</p>
                  </div>
                  <div>
                    <ImageUploader 
                      label="Chatbot Background Image (Optional)" 
                      value={generalForm.chatbotBgUrl || ""} 
                      onChange={(val) => setGeneralForm({...generalForm, chatbotBgUrl: val})} 
                    />
                    <p className="text-xs text-slate-500 mt-2">A subtle background watermark for the chat window.</p>
                  </div>
                </div>
              </div>

              {/* Knowledge Base */}
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                {chatbotForm.map((c, index) => (
                  <div key={c.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 relative">
                    <button 
                      onClick={() => removeChatbotQA(c.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="space-y-4 pr-6">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Keywords (Comma Separated)</label>
                        <CommaSeparatedInput 
                          rows={1}
                          value={c.keywords || []}
                          onChange={(val) => {
                            const newForm = structuredClone(chatbotForm);
                            newForm[index].keywords = val;
                            setChatbotForm(newForm);
                          }}
                          placeholder="price, cost, quote"
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Bot Answer</label>
                        <textarea 
                          rows={2}
                          value={c.answer || ""}
                          onChange={(e) => {
                            const newForm = structuredClone(chatbotForm);
                            newForm[index].answer = e.target.value;
                            setChatbotForm(newForm);
                          }}
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Contact Messages Tab */}
          {activeTab === "messages" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">Contact Messages</h2>
                  <p className="text-slate-500 mt-1 text-sm md:text-base">View and manage leads from the website.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button onClick={exportToCSV} className="flex-1 sm:flex-none justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all">
                    <FileSpreadsheet size={18} className="text-green-600" /> Export CSV
                  </button>
                  <button onClick={exportToPDF} className="flex-1 sm:flex-none justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all">
                    <FileTextIcon size={18} className="text-red-500" /> Export PDF
                  </button>
                </div>
              </div>

              {loadingMessages ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : contactMessages.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                  <Mailbox className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No Messages Yet</h3>
                  <p className="text-slate-500">When users submit the contact form, their messages will appear here.</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Info</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Service</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {contactMessages.map((msg) => (
                          <tr key={msg.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                              {new Date(msg.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-900 whitespace-nowrap">
                              {msg.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              <div className="flex flex-col gap-1">
                                <a href={`mailto:${msg.email}`} className="hover:text-primary transition-colors">{msg.email}</a>
                                <a href={`tel:${msg.phone}`} className="hover:text-primary transition-colors">{msg.phone}</a>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                              <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                {msg.service || 'Not specified'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={msg.details}>
                              {msg.details}
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => setEditingMessage(msg)}
                                  className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                  title="Edit Message"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete Message"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Edit Message Modal */}
              <AnimatePresence>
                {editingMessage && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
                    >
                      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                        <h3 className="text-lg font-bold text-slate-900">Edit Lead Details</h3>
                        <button onClick={() => setEditingMessage(null)} className="text-slate-400 hover:text-slate-600">
                          <X size={20} />
                        </button>
                      </div>
                      
                      <div className="p-6 overflow-y-auto">
                        <form id="edit-message-form" onSubmit={handleUpdateMessage} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Name</label>
                              <input 
                                type="text" 
                                required
                                value={editingMessage.name || ""}
                                onChange={(e) => setEditingMessage({...editingMessage, name: e.target.value})}
                                className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Service</label>
                              <input 
                                type="text" 
                                value={editingMessage.service || ""}
                                onChange={(e) => setEditingMessage({...editingMessage, service: e.target.value})}
                                className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Email</label>
                              <input 
                                type="email" 
                                required
                                value={editingMessage.email || ""}
                                onChange={(e) => setEditingMessage({...editingMessage, email: e.target.value})}
                                className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Phone</label>
                              <input 
                                type="text" 
                                value={editingMessage.phone || ""}
                                onChange={(e) => setEditingMessage({...editingMessage, phone: e.target.value})}
                                className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Project Details</label>
                            <textarea 
                              rows={5}
                              value={editingMessage.details || ""}
                              onChange={(e) => setEditingMessage({...editingMessage, details: e.target.value})}
                              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm resize-none"
                            />
                          </div>
                        </form>
                      </div>
                      
                      <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                        <button 
                          onClick={() => setEditingMessage(null)}
                          className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          form="edit-message-form"
                          disabled={isSaving}
                          className="px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
                        >
                          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Admin;
