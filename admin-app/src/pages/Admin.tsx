import { useState, useEffect } from "react";
import { useSiteData } from "@/context/SiteDataContext";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, Settings, MessageSquare, Users, Save, Plus, Trash2, 
  Globe, Home, Info, Loader2, LogOut, Briefcase, Package, Image as ImageIcon, Upload, FileText, Menu, X, Link as LinkIcon, Factory, Heart, GraduationCap, Mail, Lock, Mailbox, FileSpreadsheet, FileText as FileTextIcon, Pencil
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
  const { siteData, updateSection, updateTestimonials, updateChatbot, isLoading } = useSiteData();
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
  
  // Training Page Forms
  const [trainingForm, setTrainingForm] = useState(siteData.trainingPrograms || []);
  const [trainingTopicsForm, setTrainingTopicsForm] = useState(siteData.trainingTopics || []);
  const [trainingAudiencesForm, setTrainingAudiencesForm] = useState(siteData.trainingAudiences || []);
  const [trainingFormatsForm, setTrainingFormatsForm] = useState(siteData.trainingFormats || []);
  const [trainingGalleryForm, setTrainingGalleryForm] = useState(siteData.trainingGallery || []);
  const [trainingTestimonialsForm, setTrainingTestimonialsForm] = useState(siteData.trainingTestimonials || []);

  const [testimonialsForm, setTestimonialsForm] = useState(siteData.testimonials);
  const [teamTestimonialsForm, setTeamTestimonialsForm] = useState(siteData.teamTestimonials || []);
  const [chatbotForm, setChatbotForm] = useState(siteData.chatbot);
  const [footerForm, setFooterForm] = useState(siteData.footer);

  // Check Auth Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Session error:", error.message);
        // Clear invalid session data from local storage
        supabase.auth.signOut().catch(console.error);
      }
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESH_FAILED') {
        console.error("Token refresh failed, signing out.");
        setTimeout(() => {
          supabase.auth.signOut().catch(console.error);
        }, 0);
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
    
    setTrainingForm(siteData.trainingPrograms || []);
    setTrainingTopicsForm(siteData.trainingTopics || []);
    setTrainingAudiencesForm(siteData.trainingAudiences || []);
    setTrainingFormatsForm(siteData.trainingFormats || []);
    setTrainingGalleryForm(siteData.trainingGallery || []);
    setTrainingTestimonialsForm(siteData.trainingTestimonials || []);

    setTestimonialsForm(siteData.testimonials || []);
    setTeamTestimonialsForm(siteData.teamTestimonials || []);
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

  const handleSaveTestimonials = async () => {
    setIsSaving(true);
    try {
      await updateTestimonials(testimonialsForm);
      toast.success("Testimonials saved to database!");
    } catch (error) {
      toast.error("Failed to save testimonials.");
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
  const addTestimonial = () => setTestimonialsForm([...testimonialsForm, { id: crypto.randomUUID(), name: "", company: "", text: "", rating: 5 }]);
  const removeTestimonial = (id: string) => setTestimonialsForm(testimonialsForm.filter(t => t.id !== id));

  const addTeamTestimonial = () => setTeamTestimonialsForm([...teamTestimonialsForm, { id: crypto.randomUUID(), name: "", role: "", quote: "", image: "", rating: 5 }]);
  const removeTeamTestimonial = (id: string) => setTeamTestimonialsForm(teamTestimonialsForm.filter(t => t.id !== id));

  const addChatbotQA = () => setChatbotForm([...chatbotForm, { id: crypto.randomUUID(), keywords: [], answer: "" }]);
  const removeChatbotQA = (id: string) => setChatbotForm(chatbotForm.filter(c => c.id !== id));

  const navItems = [
    { id: "general", label: "General Settings", icon: Settings },
    { id: "hero", label: "Hero Section", icon: Home },
    { id: "about", label: "About Section", icon: Info },
    { id: "services", label: "What We Offer", icon: Briefcase },
    { id: "products", label: "Our Products", icon: Package },
    { id: "industries", label: "Focus Industries", icon: Factory },
    { id: "training", label: "Training Programs", icon: GraduationCap },
    { id: "jobs", label: "Open Positions", icon: FileText },
    { id: "team_testimonials", label: "Team Testimonials", icon: Heart },
    { id: "testimonials", label: "Client Testimonials", icon: Users },
    { id: "chatbot", label: "Chatbot Data", icon: MessageSquare },
    { id: "messages", label: "Contact Messages", icon: Mailbox },
    { id: "footer", label: "Footer & Social", icon: Globe },
  ];

  // --- Render Auth Screen if not logged in ---
  if (authLoading || (!session && !authLoading && isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#5B7cFA]" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row font-sans bg-slate-50">
        {/* Left Panel - Blue Design */}
        <div className="hidden md:flex md:w-1/2 bg-[#5B7cFA] text-white p-12 flex-col justify-center relative overflow-hidden">
          
          {/* Decorative Elements mimicking the reference image */}
          <div className="absolute top-12 left-12 grid grid-cols-3 gap-2 opacity-30">
            {[...Array(9)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-white rounded-full"></div>)}
          </div>
          <div className="absolute top-0 left-1/4 w-32 h-64 bg-white/10 rounded-b-full blur-sm transform -translate-y-1/2"></div>
          <div className="absolute top-20 right-20 w-12 h-12 border-4 border-white/20 rounded-full"></div>
          
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full border border-white/30 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border border-white/20 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-300 to-blue-500 shadow-lg shadow-cyan-400/50"></div>
            </div>
          </div>
          <div className="absolute bottom-32 left-8 w-6 h-6 bg-cyan-300 rounded-full shadow-md shadow-cyan-300/50"></div>
          <div className="absolute bottom-48 left-48 w-4 h-4 bg-cyan-200 rounded-full shadow-md shadow-cyan-200/50"></div>
          <div className="absolute bottom-20 left-64 text-white/50 text-2xl font-bold rotate-45">+</div>

          <div className="relative z-10 pl-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl lg:text-6xl font-bold mb-6 leading-[1.1]"
            >
              Admin<br/>Portal
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-blue-100 text-lg max-w-md"
            >
              Manage your website content, settings, and view user interactions securely.
            </motion.p>
          </div>
        </div>

        {/* Right Panel - White Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white relative">
          
          {/* Mobile decorative header (only visible on small screens) */}
          <div className="md:hidden absolute top-0 left-0 w-full h-48 bg-[#5B7cFA] rounded-b-[3rem] -z-10"></div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-[400px] bg-white md:bg-transparent p-8 md:p-0 rounded-3xl md:rounded-none shadow-xl md:shadow-none mt-16 md:mt-0"
          >
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
                <LayoutDashboard size={40} className="text-[#5B7cFA]" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-800">Hello ! Welcome back</h2>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#5B7cFA]" />
                  </div>
                  <input 
                    type="email" 
                    required
                    value={email || ""}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#5B7cFA]/20 focus:border-[#5B7cFA] outline-none transition-all bg-slate-50/50"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#5B7cFA]" />
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password || ""}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#5B7cFA]/20 focus:border-[#5B7cFA] outline-none transition-all bg-slate-50/50"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#5B7cFA] focus:ring-[#5B7cFA]" />
                  <span className="text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
                </label>
                <button type="button" onClick={() => toast.info("Please contact the super admin to reset your password.")} className="text-[#5B7cFA] hover:underline font-medium">
                  Reset Password!
                </button>
              </div>

              <button 
                type="submit" 
                disabled={authLoading}
                className="w-full bg-[#5B7cFA] hover:bg-[#4a6be0] text-white py-4 rounded-xl font-semibold transition-all disabled:opacity-70 flex justify-center items-center shadow-lg shadow-[#5B7cFA]/30 mt-2"
              >
                {authLoading ? <Loader2 size={20} className="animate-spin" /> : "Login"}
              </button>
            </form>
          </motion.div>
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
          
          {/* General Settings Tab */}
          {activeTab === "general" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">General Settings</h2>
                  <p className="text-slate-500 mt-1 text-sm md:text-base">Manage your website's core information and branding.</p>
                </div>
                <button disabled={isSaving} onClick={() => handleSaveSection('general', generalForm)} className="w-full sm:w-auto justify-center bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all disabled:opacity-70">
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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

              {/* Statistics Counters Section */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 mt-8">
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
              </div>

            </motion.div>
          )}

          {/* Contact Messages Tab */}
          {activeTab === "messages" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">Contact Messages</h2>
                  <p className="text-slate-500 mt-1 text-sm md:text-base">View, edit, and export leads from your website's contact form.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button onClick={exportToCSV} className="justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all">
                    <FileSpreadsheet size={18} /> Export CSV
                  </button>
                  <button onClick={exportToPDF} className="justify-center bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all">
                    <FileTextIcon size={18} /> Export PDF
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loadingMessages ? (
                  <div className="p-12 flex justify-center items-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : contactMessages.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <Mailbox className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No contact messages found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Name</th>
                          <th className="px-6 py-4">Contact Info</th>
                          <th className="px-6 py-4">Service</th>
                          <th className="px-6 py-4">Details</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {contactMessages.map((msg) => (
                          <tr key={msg.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 text-slate-500">
                              {new Date(msg.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-900">
                              {msg.name}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1">
                                <a href={`mailto:${msg.email}`} className="text-primary hover:underline">{msg.email}</a>
                                {msg.phone && <a href={`tel:${msg.phone}`} className="text-slate-500 hover:text-slate-700">{msg.phone}</a>}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {msg.service || 'General Inquiry'}
                              </span>
                            </td>
                            <td className="px-6 py-4 max-w-xs truncate text-slate-600" title={msg.details}>
                              {msg.details || '-'}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => setEditingMessage(msg)} 
                                  className="p-1.5 text-slate-400 hover:text-primary transition-colors bg-white rounded-md border border-slate-200 shadow-sm"
                                  title="Edit Message"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteMessage(msg.id)} 
                                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors bg-white rounded-md border border-slate-200 shadow-sm"
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
                )}
              </div>

              {/* Edit Message Modal */}
              <AnimatePresence>
                {editingMessage && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  >
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
                    >
                      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-900">Edit Message</h3>
                        <button onClick={() => setEditingMessage(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                          <X size={20} />
                        </button>
                      </div>
                      <form onSubmit={handleUpdateMessage} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                            <input 
                              type="text" 
                              value={editingMessage.name || ""}
                              onChange={(e) => setEditingMessage({...editingMessage, name: e.target.value})}
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                            <input 
                              type="email" 
                              value={editingMessage.email || ""}
                              onChange={(e) => setEditingMessage({...editingMessage, email: e.target.value})}
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                            <input 
                              type="text" 
                              value={editingMessage.phone || ""}
                              onChange={(e) => setEditingMessage({...editingMessage, phone: e.target.value})}
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Service</label>
                            <input 
                              type="text" 
                              value={editingMessage.service || ""}
                              onChange={(e) => setEditingMessage({...editingMessage, service: e.target.value})}
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Details</label>
                          <textarea 
                            rows={4}
                            value={editingMessage.details || ""}
                            onChange={(e) => setEditingMessage({...editingMessage, details: e.target.value})}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                          />
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                          <button 
                            type="button" 
                            onClick={() => setEditingMessage(null)} 
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            disabled={isSaving} 
                            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-70"
                          >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
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

          {/* Hero Section Tab */}
          {activeTab === "hero" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">Hero Section</h2>
                  <p className="text-slate-500 mt-1 text-sm md:text-base">Modify the main landing text of your website.</p>
                </div>
                <button disabled={isSaving} onClick={() => handleSaveSection('hero', heroForm)} className="w-full sm:w-auto justify-center bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all disabled:opacity-70">
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-6">
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
            </motion.div>
          )}

          {/* About Section Tab */}
          {activeTab === "about" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">About Section</h2>
                  <p className="text-slate-500 mt-1 text-sm md:text-base">Modify the text in the 'About TechNest' area.</p>
                </div>
                <button disabled={isSaving} onClick={() => handleSaveSection('about', aboutForm)} className="w-full sm:w-auto justify-center bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all disabled:opacity-70">
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-6">
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
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">Training Programs Page</h2>
                  <p className="text-slate-500 mt-1 text-sm md:text-base">Manage all content for the Training Programs page.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button disabled={isSaving} onClick={handleSaveTrainingPage} className="justify-center bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all disabled:opacity-70">
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save All Changes
                  </button>
                </div>
              </div>

              {/* 1. Programs List */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900">1. Program Cards</h3>
                  <button onClick={addTrainingProgram} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium flex items-center gap-1 text-sm transition-all">
                    <Plus size={16} /> Add Program
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  {trainingForm.map((p, index) => (
                    <div key={p.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4 relative">
                      <button onClick={() => removeTrainingProgram(p.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      <div className="space-y-3 pr-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Title</label>
                            <input type="text" value={p.title || ""} onChange={(e) => { const newForm = structuredClone(trainingForm); newForm[index].title = e.target.value; setTrainingForm(newForm); }} className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm text-slate-900 bg-white" />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Icon (Lucide)</label>
                            <input type="text" value={p.iconName || ""} onChange={(e) => { const newForm = structuredClone(trainingForm); newForm[index].iconName = e.target.value; setTrainingForm(newForm); }} className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm text-slate-900 bg-white" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Duration</label>
                            <input type="text" value={p.duration || ""} onChange={(e) => { const newForm = structuredClone(trainingForm); newForm[index].duration = e.target.value; setTrainingForm(newForm); }} className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm text-slate-900 bg-white" />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Audience</label>
                            <input type="text" value={p.audience || ""} onChange={(e) => { const newForm = structuredClone(trainingForm); newForm[index].audience = e.target.value; setTrainingForm(newForm); }} className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm text-slate-900 bg-white" />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Mode</label>
                            <input type="text" value={p.mode || ""} onChange={(e) => { const newForm = structuredClone(trainingForm); newForm[index].mode = e.target.value; setTrainingForm(newForm); }} className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm text-slate-900 bg-white" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Description</label>
                          <textarea rows={2} value={p.desc || ""} onChange={(e) => { const newForm = structuredClone(trainingForm); newForm[index].desc = e.target.value; setTrainingForm(newForm); }} className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm text-slate-900 bg-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Topics & Audiences */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4">2. Topics & Target Audience</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Topics We Cover (Comma Separated)</label>
                    <CommaSeparatedInput 
                      rows={4}
                      value={trainingTopicsForm || []}
                      onChange={(val) => setTrainingTopicsForm(val)}
                      placeholder="Web Development, App Development, AI Tools..."
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Who Is This For? (Comma Separated)</label>
                    <CommaSeparatedInput 
                      rows={4}
                      value={trainingAudiencesForm || []}
                      onChange={(val) => setTrainingAudiencesForm(val)}
                      placeholder="Schools, Colleges, Engineering Students..."
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Delivery Formats */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900">3. Program Formats</h3>
                  <button onClick={addTrainingFormat} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium flex items-center gap-1 text-sm transition-all">
                    <Plus size={16} /> Add Format
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trainingFormatsForm.map((f, index) => (
                    <div key={f.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                      <div className="flex-1 space-y-2">
                        <input 
                          type="text" 
                          value={f.title || ""}
                          onChange={(e) => { const newForm = structuredClone(trainingFormatsForm); newForm[index].title = e.target.value; setTrainingFormatsForm(newForm); }}
                          placeholder="Format Title"
                          className="w-full px-2 py-1 rounded border border-slate-300 text-sm text-slate-900 bg-white"
                        />
                        <input 
                          type="text" 
                          value={f.iconName || ""}
                          onChange={(e) => { const newForm = structuredClone(trainingFormatsForm); newForm[index].iconName = e.target.value; setTrainingFormatsForm(newForm); }}
                          placeholder="Lucide Icon Name"
                          className="w-full px-2 py-1 rounded border border-slate-300 text-xs text-slate-900 bg-white"
                        />
                      </div>
                      <button onClick={() => removeTrainingFormat(f.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Event Highlights (Gallery) */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900">4. Event Highlights (Gallery)</h3>
                  <button onClick={addGalleryImage} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium flex items-center gap-1 text-sm transition-all">
                    <Plus size={16} /> Add Image
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trainingGalleryForm.map((img, index) => (
                    <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative">
                      <button onClick={() => removeGalleryImage(index)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 z-10 bg-white rounded-full p-1 shadow-sm"><Trash2 size={14} /></button>
                      <ImageUploader 
                        label={`Image ${index + 1}`} 
                        value={img} 
                        onChange={(val) => { const newForm = [...trainingGalleryForm]; newForm[index] = val; setTrainingGalleryForm(newForm); }} 
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Institution Testimonials */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900">5. Institution Testimonials</h3>
                  <button onClick={addTrainingTestimonial} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium flex items-center gap-1 text-sm transition-all">
                    <Plus size={16} /> Add Testimonial
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {trainingTestimonialsForm.map((t, index) => (
                    <div key={t.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4 relative">
                      <button onClick={() => removeTrainingTestimonial(t.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      <div className="space-y-3 pr-6">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Quote</label>
                          <textarea rows={2} value={t.quote || ""} onChange={(e) => { const newForm = structuredClone(trainingTestimonialsForm); newForm[index].quote = e.target.value; setTrainingTestimonialsForm(newForm); }} className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm text-slate-900 bg-white" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Author Name</label>
                            <input type="text" value={t.author || ""} onChange={(e) => { const newForm = structuredClone(trainingTestimonialsForm); newForm[index].author = e.target.value; setTrainingTestimonialsForm(newForm); }} className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm text-slate-900 bg-white" />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Author Role/Institution</label>
                            <input type="text" value={t.role || ""} onChange={(e) => { const newForm = structuredClone(trainingTestimonialsForm); newForm[index].role = e.target.value; setTrainingTestimonialsForm(newForm); }} className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm text-slate-900 bg-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

          {/* Jobs / Open Positions Tab */}
          {activeTab === "jobs" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">Open Positions</h2>
                  <p className="text-slate-500 mt-1 text-sm md:text-base">Manage the job listings shown on the Careers page.</p>
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {jobsForm.map((j, index) => (
                  <div key={j.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 relative">
                    <button 
                      onClick={() => removeJob(j.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="space-y-4 pr-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Job Title</label>
                          <input 
                            type="text" 
                            value={j.title || ""}
                            onChange={(e) => {
                              const newForm = structuredClone(jobsForm);
                              newForm[index].title = e.target.value;
                              setJobsForm(newForm);
                            }}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                          <input 
                            type="text" 
                            value={j.category || ""}
                            onChange={(e) => {
                              const newForm = structuredClone(jobsForm);
                              newForm[index].category = e.target.value;
                              setJobsForm(newForm);
                            }}
                            placeholder="e.g. Engineering, Design"
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Salary (₹)</label>
                          <input 
                            type="text" 
                            value={j.salary || ""}
                            onChange={(e) => {
                              const newForm = structuredClone(jobsForm);
                              newForm[index].salary = e.target.value;
                              setJobsForm(newForm);
                            }}
                            placeholder="e.g. ₹80K - ₹120K"
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Job Type</label>
                          <input 
                            type="text" 
                            value={j.type || ""}
                            onChange={(e) => {
                              const newForm = structuredClone(jobsForm);
                              newForm[index].type = e.target.value;
                              setJobsForm(newForm);
                            }}
                            placeholder="e.g. Full-time"
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Location</label>
                          <input 
                            type="text" 
                            value={j.location || ""}
                            onChange={(e) => {
                              const newForm = structuredClone(jobsForm);
                              newForm[index].location = e.target.value;
                              setJobsForm(newForm);
                            }}
                            placeholder="e.g. Remote / Office"
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Apply Link (Google Form)</label>
                        <input 
                          type="url" 
                          value={j.applyLink || ""}
                          onChange={(e) => {
                            const newForm = structuredClone(jobsForm);
                            newForm[index].applyLink = e.target.value;
                            setJobsForm(newForm);
                          }}
                          placeholder="https://forms.gle/..."
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                        <textarea 
                          rows={2}
                          value={j.desc || ""}
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
                          value={j.requirements || []}
                          onChange={(val) => {
                            const newForm = structuredClone(jobsForm);
                            newForm[index].requirements = val;
                            setJobsForm(newForm);
                          }}
                          placeholder="e.g. 5+ years experience, React Expert, Strong Python"
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                        />
                      </div>

                      <ImageUploader 
                        label="Job Icon" 
                        value={j.iconUrl} 
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
                  <p className="text-slate-500 mt-1 text-sm md:text-base">Manage employee reviews shown on the Careers page.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button onClick={addTeamTestimonial} className="justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all">
                    <Plus size={18} /> Add Review
                  </button>
                  <button disabled={isSaving} onClick={() => handleSaveSection('teamTestimonials', teamTestimonialsForm)} className="justify-center bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all disabled:opacity-70">
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
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
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Role / Designation</label>
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
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Star Rating (1-5)</label>
                        <input 
                          type="number" 
                          min="1"
                          max="5"
                          value={t.rating || 5}
                          onChange={(e) => {
                            const newForm = structuredClone(teamTestimonialsForm);
                            newForm[index].rating = parseInt(e.target.value) || 5;
                            setTeamTestimonialsForm(newForm);
                          }}
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                        />
                      </div>
                      <ImageUploader 
                        label="Profile Image" 
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

          {/* Chatbot Tab */}
          {activeTab === "chatbot" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">Chatbot Settings</h2>
                  <p className="text-slate-500 mt-1 text-sm md:text-base">Manage your AI assistant's appearance and knowledge.</p>
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

              {/* Appearance & Suggestions */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Appearance & Default Suggestions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <ImageUploader 
                      label="Chat Background Image" 
                      value={generalForm.chatbotBgUrl || ""} 
                      onChange={(val) => setGeneralForm({...generalForm, chatbotBgUrl: val})} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Default Suggestions (Comma Separated)</label>
                    <CommaSeparatedInput 
                      rows={4}
                      value={generalForm.chatbotSuggestions || []}
                      onChange={(val) => setGeneralForm({...generalForm, chatbotSuggestions: val})}
                      placeholder="What services do you offer?, How much does it cost?..."
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Knowledge Base */}
              <h3 className="text-lg font-bold text-slate-900 mb-4">Knowledge Base (Q&A)</h3>
              <div className="space-y-4">
                {chatbotForm.map((qa, index) => (
                  <div key={qa.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 relative group">
                    <button 
                      onClick={() => removeChatbotQA(qa.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="grid gap-4 pr-8">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Keywords (comma separated)</label>
                        <CommaSeparatedInput 
                          rows={1}
                          value={qa.keywords || []}
                          onChange={(val) => {
                            const newForm = structuredClone(chatbotForm);
                            newForm[index].keywords = val;
                            setChatbotForm(newForm);
                          }}
                          placeholder="e.g. price, cost, quote"
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Bot Answer</label>
                        <textarea 
                          rows={2}
                          value={qa.answer || ""}
                          onChange={(e) => {
                            const newForm = structuredClone(chatbotForm);
                            newForm[index].answer = e.target.value;
                            setChatbotForm(newForm);
                          }}
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Client Testimonials Tab */}
          {activeTab === "testimonials" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">Client Testimonials</h2>
                  <p className="text-slate-500 mt-1 text-sm md:text-base">Manage the reviews shown on your website.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button onClick={addTestimonial} className="justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all">
                    <Plus size={18} /> Add Review
                  </button>
                  <button disabled={isSaving} onClick={handleSaveTestimonials} className="justify-center bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all disabled:opacity-70">
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {testimonialsForm.map((t, index) => (
                  <div key={t.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 relative">
                    <button 
                      onClick={() => removeTestimonial(t.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="space-y-4 pr-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Client Name</label>
                          <input 
                            type="text" 
                            value={t.name || ""}
                            onChange={(e) => {
                              const newForm = structuredClone(testimonialsForm);
                              newForm[index].name = e.target.value;
                              setTestimonialsForm(newForm);
                            }}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Company</label>
                          <input 
                            type="text" 
                            value={t.company || ""}
                            onChange={(e) => {
                              const newForm = structuredClone(testimonialsForm);
                              newForm[index].company = e.target.value;
                              setTestimonialsForm(newForm);
                            }}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Star Rating (1-5)</label>
                          <input 
                            type="number" 
                            min="1"
                            max="5"
                            value={t.rating || 5}
                            onChange={(e) => {
                              const newForm = structuredClone(testimonialsForm);
                              newForm[index].rating = parseInt(e.target.value) || 5;
                              setTestimonialsForm(newForm);
                            }}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 bg-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Review Text</label>
                        <textarea 
                          rows={3}
                          value={t.text || ""}
                          onChange={(e) => {
                            const newForm = structuredClone(testimonialsForm);
                            newForm[index].text = e.target.value;
                            setTestimonialsForm(newForm);
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

        </div>
      </main>
    </div>
  );
};

export default Admin;
