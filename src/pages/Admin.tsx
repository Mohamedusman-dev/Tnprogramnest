import { useState, useEffect } from "react";
import { useSiteData } from "@/context/SiteDataContext";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, Settings, MessageSquare, Users, Save, Plus, Trash2, 
  Globe, Home, Info, Loader2, LogOut, Briefcase, Package, Image as ImageIcon, Upload, FileText, Menu, X, Link as LinkIcon, Factory, Heart, GraduationCap
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

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
          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
        />
      ) : (
        <input 
          key="file-input"
          type="file" 
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm text-slate-900 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
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

  // Local Form States
  const [generalForm, setGeneralForm] = useState(siteData.general);
  const [heroForm, setHeroForm] = useState(siteData.hero);
  const [aboutForm, setAboutForm] = useState(siteData.about);
  const [servicesForm, setServicesForm] = useState(siteData.services);
  const [productsForm, setProductsForm] = useState(siteData.products);
  const [jobsForm, setJobsForm] = useState(siteData.jobs || []);
  const [industriesForm, setIndustriesForm] = useState(siteData.industries || []);
  const [trainingForm, setTrainingForm] = useState(siteData.trainingPrograms || []);
  const [testimonialsForm, setTestimonialsForm] = useState(siteData.testimonials);
  const [teamTestimonialsForm, setTeamTestimonialsForm] = useState(siteData.teamTestimonials || []);
  const [chatbotForm, setChatbotForm] = useState(siteData.chatbot);
  const [footerForm, setFooterForm] = useState(siteData.footer);

  // Check Auth Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
    setTestimonialsForm(siteData.testimonials || []);
    setTeamTestimonialsForm(siteData.teamTestimonials || []);
    setChatbotForm(siteData.chatbot || []);
    if(siteData.footer) setFooterForm(siteData.footer);
  }, [siteData]);

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

  const handleSaveSection = async (key: 'general' | 'hero' | 'about' | 'services' | 'products' | 'jobs' | 'industries' | 'trainingPrograms' | 'teamTestimonials' | 'footer', formState: any) => {
    setIsSaving(true);
    try {
      await updateSection(key, formState);
      toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} saved to database!`);
    } catch (error) {
      toast.error("Failed to save changes.");
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
      toast.success("Chatbot knowledge saved to database!");
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

  const addTrainingProgram = () => setTrainingForm([...trainingForm, { id: crypto.randomUUID(), title: "", duration: "", audience: "", mode: "", iconName: "Code", desc: "" }]);
  const removeTrainingProgram = (id: string) => setTrainingForm(trainingForm.filter(p => p.id !== id));

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
    { id: "footer", label: "Footer & Social", icon: Globe },
  ];

  // --- Render Auth Screen if not logged in ---
  if (authLoading || (!session && !authLoading && isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 bg-white/10 backdrop-blur-xl p-6 sm:p-10 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md mx-4"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-primary/30 shadow-inner">
              <LayoutDashboard className="text-primary" size={32} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Admin Portal</h1>
            <p className="text-slate-300 text-sm mt-2">Sign in to manage your website</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1.5">Email Address</label>
              <input 
                type="email" 
                required
                value={email || ""}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                placeholder="admin@technest.dev"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1.5">Password</label>
              <input 
                type="password" 
                required
                value={password || ""}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              disabled={authLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-semibold transition-all disabled:opacity-70 flex justify-center items-center shadow-lg shadow-primary/25 mt-4"
            >
              {authLoading ? <Loader2 size={20} className="animate-spin" /> : "Sign In"}
            </button>
          </form>
        </motion.div>
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
          <Link to="/" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm">
            <Globe size={16} />
            View Website
          </Link>
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
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Contact Phone</label>
                    <input 
                      type="text" 
                      value={generalForm.phone || ""}
                      onChange={(e) => setGeneralForm({...generalForm, phone: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Physical Address</label>
                  <textarea 
                    rows={3}
                    value={generalForm.address || ""}
                    onChange={(e) => setGeneralForm({...generalForm, address: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900"
                  />
                </div>
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
                            social: { ...footerForm.social, [platform]: e.target.value }
                          })}
                          placeholder={platform === 'whatsapp' ? "e.g. 919876543210 (with country code)" : `https://${platform}.com/yourpage`}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900"
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
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Newsletter Text</label>
                      <input 
                        type="text" 
                        value={footerForm.newsletterText || ""}
                        onChange={(e) => setFooterForm({...footerForm, newsletterText: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Copyright Text</label>
                      <input 
                        type="text" 
                        value={footerForm.copyrightText || ""}
                        onChange={(e) => setFooterForm({...footerForm, copyrightText: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Expertise Tags (Comma Separated)</label>
                    <textarea 
                      rows={3}
                      value={(footerForm.tags || []).join(", ")}
                      onChange={(e) => setFooterForm({
                        ...footerForm, 
                        tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean)
                      })}
                      placeholder="Web Dev, Mobile Apps, UI/UX, React..."
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900"
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
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Highlight Text (Gradient)</label>
                  <input 
                    type="text" 
                    value={heroForm.highlight || ""}
                    onChange={(e) => setHeroForm({...heroForm, highlight: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mini Description (Left Border Text)</label>
                  <textarea 
                    rows={2}
                    value={heroForm.miniDescription || ""}
                    onChange={(e) => setHeroForm({...heroForm, miniDescription: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Main Description</label>
                  <textarea 
                    rows={4}
                    value={heroForm.description || ""}
                    onChange={(e) => setHeroForm({...heroForm, description: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900"
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
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Highlight Text (Gradient)</label>
                  <input 
                    type="text" 
                    value={aboutForm.highlight || ""}
                    onChange={(e) => setAboutForm({...aboutForm, highlight: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea 
                    rows={4}
                    value={aboutForm.description || ""}
                    onChange={(e) => setAboutForm({...aboutForm, description: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900"
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
                            const newForm = [...servicesForm];
                            newForm[index].title = e.target.value;
                            setServicesForm(newForm);
                          }}
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                        <textarea 
                          rows={2}
                          value={s.desc || ""}
                          onChange={(e) => {
                            const newForm = [...servicesForm];
                            newForm[index].desc = e.target.value;
                            setServicesForm(newForm);
                          }}
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                        />
                      </div>
                      <ImageUploader 
                        label="Service Icon" 
                        value={s.iconUrl} 
                        onChange={(val) => {
                          const newForm = [...servicesForm];
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
                              const newForm = [...productsForm];
                              newForm[index].title = e.target.value;
                              setProductsForm(newForm);
                            }}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Position</label>
                          <select 
                            value={p.category || "left"}
                            onChange={(e) => {
                              const newForm = [...productsForm];
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
                            const newForm = [...productsForm];
                            newForm[index].desc = e.target.value;
                            setProductsForm(newForm);
                          }}
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                        />
                      </div>
                      <ImageUploader 
                        label="Product Icon" 
                        value={p.iconUrl} 
                        onChange={(val) => {
                          const newForm = [...productsForm];
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
                                const newForm = [...industriesForm];
                                newForm[index].label = e.target.value;
                                setIndustriesForm(newForm);
                              }}
                              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                            <textarea 
                              rows={2}
                              value={ind.description || ""}
                              onChange={(e) => {
                                const newForm = [...industriesForm];
                                newForm[index].description = e.target.value;
                                setIndustriesForm(newForm);
                              }}
                              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <ImageUploader 
                            label="Industry Image" 
                            value={ind.image} 
                            onChange={(val) => {
                              const newForm = [...industriesForm];
                              newForm[index].image = val;
                              setIndustriesForm(newForm);
                            }} 
                          />
                        </div>
                        <div className="mt-4">
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Bullet Points (Comma Separated)</label>
                          <textarea 
                            rows={2}
                            value={(ind.bullets || []).join(", ")}
                            onChange={(e) => {
                              const newForm = [...industriesForm];
                              newForm[index].bullets = e.target.value.split(",").map(b => b.trim()).filter(Boolean);
                              setIndustriesForm(newForm);
                            }}
                            placeholder="e.g. Custom storefront, Payment integration, Analytics"
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
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
                                const newForm = [...industriesForm];
                                newForm[index].caseStudy.title = e.target.value;
                                setIndustriesForm(newForm);
                              }}
                              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Case Study Description</label>
                            <textarea 
                              rows={2}
                              value={ind.caseStudy?.description || ""}
                              onChange={(e) => {
                                const newForm = [...industriesForm];
                                newForm[index].caseStudy.description = e.target.value;
                                setIndustriesForm(newForm);
                              }}
                              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
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
                                    const newForm = [...industriesForm];
                                    newForm[index].caseStudy.stats[statIndex].label = e.target.value;
                                    setIndustriesForm(newForm);
                                  }}
                                  placeholder="e.g. Revenue Growth"
                                  className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Stat {statIndex + 1} Value</label>
                                <input 
                                  type="text" 
                                  value={stat.value || ""}
                                  onChange={(e) => {
                                    const newForm = [...industriesForm];
                                    newForm[index].caseStudy.stats[statIndex].value = e.target.value;
                                    setIndustriesForm(newForm);
                                  }}
                                  placeholder="e.g. +45%"
                                  className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
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
                                const newForm = [...industriesForm];
                                newForm[index].testimonial.quote = e.target.value;
                                setIndustriesForm(newForm);
                              }}
                              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Author Name</label>
                            <input 
                              type="text" 
                              value={ind.testimonial?.author || ""}
                              onChange={(e) => {
                                const newForm = [...industriesForm];
                                newForm[index].testimonial.author = e.target.value;
                                setIndustriesForm(newForm);
                              }}
                              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Author Role</label>
                            <input 
                              type="text" 
                              value={ind.testimonial?.role || ""}
                              onChange={(e) => {
                                const newForm = [...industriesForm];
                                newForm[index].testimonial.role = e.target.value;
                                setIndustriesForm(newForm);
                              }}
                              className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
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
                  <p className="text-slate-500 mt-1 text-sm md:text-base">Manage the training programs and workshops offered.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button onClick={addTrainingProgram} className="justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all">
                    <Plus size={18} /> Add Program
                  </button>
                  <button disabled={isSaving} onClick={() => handleSaveSection('trainingPrograms', trainingForm)} className="justify-center bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all disabled:opacity-70">
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {trainingForm.map((p, index) => (
                  <div key={p.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 relative">
                    <button 
                      onClick={() => removeTrainingProgram(p.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="space-y-4 pr-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Program Title</label>
                          <input 
                            type="text" 
                            value={p.title || ""}
                            onChange={(e) => {
                              const newForm = [...trainingForm];
                              newForm[index].title = e.target.value;
                              setTrainingForm(newForm);
                            }}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Icon Name (Lucide)</label>
                          <input 
                            type="text" 
                            value={p.iconName || ""}
                            onChange={(e) => {
                              const newForm = [...trainingForm];
                              newForm[index].iconName = e.target.value;
                              setTrainingForm(newForm);
                            }}
                            placeholder="e.g. Code, MonitorPlay"
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Duration</label>
                          <input 
                            type="text" 
                            value={p.duration || ""}
                            onChange={(e) => {
                              const newForm = [...trainingForm];
                              newForm[index].duration = e.target.value;
                              setTrainingForm(newForm);
                            }}
                            placeholder="e.g. 2 Days"
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Audience</label>
                          <input 
                            type="text" 
                            value={p.audience || ""}
                            onChange={(e) => {
                              const newForm = [...trainingForm];
                              newForm[index].audience = e.target.value;
                              setTrainingForm(newForm);
                            }}
                            placeholder="e.g. Schools / Colleges"
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Mode</label>
                          <input 
                            type="text" 
                            value={p.mode || ""}
                            onChange={(e) => {
                              const newForm = [...trainingForm];
                              newForm[index].mode = e.target.value;
                              setTrainingForm(newForm);
                            }}
                            placeholder="e.g. Hybrid"
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                        <textarea 
                          rows={2}
                          value={p.desc || ""}
                          onChange={(e) => {
                            const newForm = [...trainingForm];
                            newForm[index].desc = e.target.value;
                            setTrainingForm(newForm);
                          }}
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
                              const newForm = [...jobsForm];
                              newForm[index].title = e.target.value;
                              setJobsForm(newForm);
                            }}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                          <input 
                            type="text" 
                            value={j.category || ""}
                            onChange={(e) => {
                              const newForm = [...jobsForm];
                              newForm[index].category = e.target.value;
                              setJobsForm(newForm);
                            }}
                            placeholder="e.g. Engineering, Design"
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
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
                              const newForm = [...jobsForm];
                              newForm[index].salary = e.target.value;
                              setJobsForm(newForm);
                            }}
                            placeholder="e.g. ₹80K - ₹120K"
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Job Type</label>
                          <input 
                            type="text" 
                            value={j.type || ""}
                            onChange={(e) => {
                              const newForm = [...jobsForm];
                              newForm[index].type = e.target.value;
                              setJobsForm(newForm);
                            }}
                            placeholder="e.g. Full-time"
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Location</label>
                          <input 
                            type="text" 
                            value={j.location || ""}
                            onChange={(e) => {
                              const newForm = [...jobsForm];
                              newForm[index].location = e.target.value;
                              setJobsForm(newForm);
                            }}
                            placeholder="e.g. Remote / Office"
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Apply Link (Google Form)</label>
                        <input 
                          type="url" 
                          value={j.applyLink || ""}
                          onChange={(e) => {
                            const newForm = [...jobsForm];
                            newForm[index].applyLink = e.target.value;
                            setJobsForm(newForm);
                          }}
                          placeholder="https://forms.gle/..."
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                        <textarea 
                          rows={2}
                          value={j.desc || ""}
                          onChange={(e) => {
                            const newForm = [...jobsForm];
                            newForm[index].desc = e.target.value;
                            setJobsForm(newForm);
                          }}
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Requirements (Comma Separated)</label>
                        <textarea 
                          rows={3}
                          value={(j.requirements || []).join(", ")}
                          onChange={(e) => {
                            const newForm = [...jobsForm];
                            newForm[index].requirements = e.target.value.split(",").map(req => req.trim()).filter(Boolean);
                            setJobsForm(newForm);
                          }}
                          placeholder="e.g. 5+ years experience, React Expert, Strong Python"
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                        />
                      </div>

                      <ImageUploader 
                        label="Job Icon" 
                        value={j.iconUrl} 
                        onChange={(val) => {
                          const newForm = [...jobsForm];
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
                              const newForm = [...teamTestimonialsForm];
                              newForm[index].name = e.target.value;
                              setTeamTestimonialsForm(newForm);
                            }}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Role / Designation</label>
                          <input 
                            type="text" 
                            value={t.role || ""}
                            onChange={(e) => {
                              const newForm = [...teamTestimonialsForm];
                              newForm[index].role = e.target.value;
                              setTeamTestimonialsForm(newForm);
                            }}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Quote</label>
                        <textarea 
                          rows={3}
                          value={t.quote || ""}
                          onChange={(e) => {
                            const newForm = [...teamTestimonialsForm];
                            newForm[index].quote = e.target.value;
                            setTeamTestimonialsForm(newForm);
                          }}
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
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
                            const newForm = [...teamTestimonialsForm];
                            newForm[index].rating = parseInt(e.target.value) || 5;
                            setTeamTestimonialsForm(newForm);
                          }}
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                        />
                      </div>
                      <ImageUploader 
                        label="Profile Image" 
                        value={t.image} 
                        onChange={(val) => {
                          const newForm = [...teamTestimonialsForm];
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
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">Chatbot Knowledge Base</h2>
                  <p className="text-slate-500 mt-1 text-sm md:text-base">Train your AI assistant with questions and answers.</p>
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
                        <input 
                          type="text" 
                          value={(qa.keywords || []).join(", ")}
                          onChange={(e) => {
                            const newForm = [...chatbotForm];
                            newForm[index].keywords = e.target.value.split(",").map(k => k.trim());
                            setChatbotForm(newForm);
                          }}
                          placeholder="e.g. price, cost, quote"
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Bot Answer</label>
                        <textarea 
                          rows={2}
                          value={qa.answer || ""}
                          onChange={(e) => {
                            const newForm = [...chatbotForm];
                            newForm[index].answer = e.target.value;
                            setChatbotForm(newForm);
                          }}
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
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
                              const newForm = [...testimonialsForm];
                              newForm[index].name = e.target.value;
                              setTestimonialsForm(newForm);
                            }}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Company</label>
                          <input 
                            type="text" 
                            value={t.company || ""}
                            onChange={(e) => {
                              const newForm = [...testimonialsForm];
                              newForm[index].company = e.target.value;
                              setTestimonialsForm(newForm);
                            }}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
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
                              const newForm = [...testimonialsForm];
                              newForm[index].rating = parseInt(e.target.value) || 5;
                              setTestimonialsForm(newForm);
                            }}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Review Text</label>
                        <textarea 
                          rows={3}
                          value={t.text || ""}
                          onChange={(e) => {
                            const newForm = [...testimonialsForm];
                            newForm[index].text = e.target.value;
                            setTestimonialsForm(newForm);
                          }}
                          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900"
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
