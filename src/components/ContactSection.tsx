import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Linkedin, Instagram, Loader2 } from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";
import { useState } from "react";
import { useSiteData } from "@/context/SiteDataContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const ContactSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { siteData } = useSiteData();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", service: "", details: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('contact_messages').insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        details: formData.details
      }]);
      
      if (error) throw error;
      
      toast.success("Thank you! We'll get back to you shortly.");
      setFormData({ name: "", email: "", phone: "", service: "", details: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-us" className="py-12 md:py-16 bg-slate-50 text-slate-900" ref={ref}>
      <div className="container mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Get in Touch</p>
          <h2 className="section-title text-slate-900">Contact Us</h2>
          <p className="text-slate-600 text-base md:text-xl max-w-2xl mx-auto mt-3 md:mt-4 px-2">
            Ready to start your project? Let's talk about your vision.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-6 md:p-8 space-y-4 sm:space-y-5 rounded-xl sm:rounded-2xl shadow-xl border border-slate-100">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Full Name</label>
                  <input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    placeholder="John Doe" 
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email</label>
                  <input 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    placeholder="john@example.com" 
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all" 
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Phone</label>
                  <input 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="+1 (555) 000-0000" 
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Service Required</label>
                  <select 
                    name="service" 
                    value={formData.service} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  >
                    <option value="" className="text-slate-500">Select a service</option>
                    <option value="Web Development">Web Development</option>
                    <option value="App Development">App Development</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Full Stack Development">Full Stack Development</option>
                    <option value="Hire Developers">Hire Developers</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Project Details</label>
                <textarea 
                  name="details" 
                  value={formData.details} 
                  onChange={handleChange} 
                  rows={4} 
                  placeholder="Tell us about your project..." 
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none" 
                />
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary-gradient shine-effect flex items-center gap-2 w-full justify-center py-3 sm:py-3.5 mt-2 disabled:opacity-70">
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <>Send Message <Send size={18} /></>}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-4 sm:space-y-5"
          >
            {[
              { icon: Mail, title: "Email Us", value: siteData.general.email, href: `mailto:${siteData.general.email}` },
              { icon: Phone, title: "Call Us", value: siteData.general.phone, href: `tel:${siteData.general.phone.replace(/[^0-9+]/g, '')}` },
              { icon: MapPin, title: "Visit Us", value: siteData.general.address, href: null },
            ].map((c) => (
              <div key={c.title} className="bg-white p-4 sm:p-5 flex items-start gap-4 rounded-xl shadow-md border border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <c.icon className="text-primary" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1 text-slate-900">{c.title}</p>
                  {c.href ? (
                    <a href={c.href} className="text-sm text-slate-600 hover:text-primary transition-colors break-all">{c.value}</a>
                  ) : (
                    <p className="text-sm text-slate-600 whitespace-pre-line">{c.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="bg-white p-4 sm:p-5 rounded-xl shadow-md border border-slate-100">
              <p className="font-semibold text-sm mb-4 text-slate-900">Follow Us</p>
              <div className="flex gap-5">
                <a href={siteData.footer?.social?.facebook} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-primary transition-colors hover:-translate-y-0.5 transform">
                  <Facebook size={22} strokeWidth={1.5} />
                </a>
                <a href={siteData.footer?.social?.twitter} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-primary transition-colors hover:-translate-y-0.5 transform">
                  <Twitter size={22} strokeWidth={1.5} />
                </a>
                <a href={siteData.footer?.social?.linkedin} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-primary transition-colors hover:-translate-y-0.5 transform">
                  <Linkedin size={22} strokeWidth={1.5} />
                </a>
                <a href={siteData.footer?.social?.instagram} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-primary transition-colors hover:-translate-y-0.5 transform">
                  <Instagram size={22} strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
