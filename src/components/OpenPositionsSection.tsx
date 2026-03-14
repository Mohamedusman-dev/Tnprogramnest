import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Briefcase, Search, ChevronDown } from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";
import { useSiteData } from "@/context/SiteDataContext";
import { toast } from "sonner";

const OpenPositionsSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { siteData } = useSiteData();
  
  const jobs = siteData.jobs || [];

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // Hardcoded categories as requested
  const categories = ["Internship", "Development", "Other"];

  // Extract unique options for dropdowns safely and sort them alphabetically
  const types = useMemo(() => {
    const ts = jobs.map(j => j.type).filter(t => typeof t === 'string' && t.trim() !== "");
    return Array.from(new Set(ts)).sort();
  }, [jobs]);

  const locations = useMemo(() => {
    const locs = jobs.map(j => j.location).filter(l => typeof l === 'string' && l.trim() !== "");
    return Array.from(new Set(locs)).sort();
  }, [jobs]);

  // Safe Filter logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchLower = (searchTerm || "").toLowerCase().trim();
      const jobTitle = (job.title || "").toLowerCase();
      const jobDesc = (job.desc || "").toLowerCase();

      const matchSearch = !searchLower || jobTitle.includes(searchLower) || jobDesc.includes(searchLower);
      
      const matchCategory = selectedCategory ? job.category === selectedCategory : true;
      const matchType = selectedType ? job.type === selectedType : true;
      const matchLocation = selectedLocation ? job.location === selectedLocation : true;
      
      return matchSearch && matchCategory && matchType && matchLocation;
    });
  }, [jobs, searchTerm, selectedCategory, selectedType, selectedLocation]);

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 bg-white font-sans" ref={ref}>
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-[#1e293b] mb-4 tracking-tight"
          >
            Open Positions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-500 text-lg md:text-xl"
          >
            Join our growing team and make an impact
          </motion.p>
        </div>

        {/* Filters Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-center max-w-5xl mx-auto"
        >
          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="Search jobs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-lg border border-slate-200 text-slate-700 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>

          {/* Category Dropdown */}
          <div className="relative w-full md:w-48">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-700 bg-white appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm cursor-pointer"
            >
              <option value="">All Job Category</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
          </div>

          {/* Type Dropdown */}
          <div className="relative w-full md:w-48">
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-700 bg-white appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm cursor-pointer"
            >
              <option value="">All Job Type</option>
              {types.map((type, i) => (
                <option key={i} value={type}>{type}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
          </div>

          {/* Location Dropdown */}
          <div className="relative w-full md:w-48">
            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-700 bg-white appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm cursor-pointer"
            >
              <option value="">All Job Location</option>
              {locations.map((loc, i) => (
                <option key={i} value={loc}>{loc}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
          </div>
        </motion.div>

        {/* Job Cards Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            <AnimatePresence>
              {filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 flex flex-col h-full hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow duration-300"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3 xl:gap-4">
                      <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-xl bg-[#3b82f6] text-white flex items-center justify-center shrink-0 shadow-sm p-2.5">
                        {job.iconUrl ? (
                           /* Added lazy loading, dimensions, and async decoding */
                           <img 
                             src={job.iconUrl} 
                             alt={`${job.title} icon`} 
                             loading="lazy"
                             width="48"
                             height="48"
                             decoding="async"
                             className="w-full h-full object-contain filter brightness-0 invert" 
                           />
                        ) : (
                           <Briefcase size={20} strokeWidth={2} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg xl:text-xl font-bold text-[#1e293b] leading-tight">{job.title}</h3>
                        <div className="flex gap-2 mt-1.5 flex-wrap">
                          {job.type && (
                            <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[11px] xl:text-xs font-medium rounded-full">
                              {job.type}
                            </span>
                          )}
                          {job.category && (
                            <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-600 text-[11px] xl:text-xs font-medium rounded-full">
                              {job.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {job.salary && (
                      <div className="text-[#3b82f6] font-bold text-sm whitespace-nowrap pt-1 ml-2">
                        {job.salary}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {job.desc}
                  </p>

                  {/* Requirements */}
                  {job.requirements && job.requirements.length > 0 && (
                    <div className="mb-8 flex-1">
                      <h4 className="text-base font-bold text-[#1e293b] mb-3">Requirements:</h4>
                      <ul className="space-y-2.5">
                        {job.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-slate-500 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] mt-1.5 shrink-0"></span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
                    {job.applyLink ? (
                      <a 
                        href={job.applyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm inline-block"
                      >
                        Apply Now
                      </a>
                    ) : (
                      <button 
                        onClick={() => toast.info("Application link will be provided soon.")}
                        className="bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm"
                      >
                        Apply Now
                      </button>
                    )}
                    {job.location && (
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs xl:text-sm font-medium">
                        <MapPin size={14} />
                        {job.location}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100"
          >
            <p className="text-slate-500 text-lg">No open positions found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                setSelectedType("");
                setSelectedLocation("");
              }}
              className="mt-4 text-primary font-medium hover:underline"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default OpenPositionsSection;
