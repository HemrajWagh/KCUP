"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Briefcase, MapPin, Users, UploadCloud, X, ArrowRight } from "lucide-react";

// --- Job Data ---
const jobs = [
  {
    id: "sr-planning-engineer",
    title: "Sr Planning Engineer",
    experience: "2-3 years",
    vacancies: "01",
    location: "Camp, Pune",
  },
  {
    id: "manager-billing",
    title: "Asst Manager / Manager – Billing & Estimation",
    experience: "2-3 years",
    vacancies: "01",
    location: "Camp, Pune",
  },
  {
    id: "sales-executive",
    title: "Sales Executive – Corporate Product",
    experience: "2-3 years",
    vacancies: "01",
    location: "Camp, Pune",
  },
  {
    id: "environmental-executive",
    title: "Environmental Executive",
    experience: "2-3 years",
    vacancies: "01",
    location: "Camp, Pune",
  }
];

// --- Animation Variants ---
const textReveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
  }
};

const drawerVariants: Variants = {
  hidden: { x: "100%" },
  visible: { 
    x: "0%", 
    transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] } 
  },
  exit: { 
    x: "100%", 
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] } 
  }
};

export default function Careers() {
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  
  // Modal / Drawer State
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");

  // Form State
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---
  const handleApplyClick = (jobTitle: string) => {
    setSelectedJobTitle(jobTitle);
    setIsApplyOpen(true);
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  };

  const closeDrawer = () => {
    setIsApplyOpen(false);
    document.body.style.overflow = "auto";
    setFileName(null); // Reset form mock state
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, send FormData to API here
    alert("Application submitted successfully. We will be in touch!");
    closeDrawer();
  };

  return (
    <section className="relative w-full bg-[var(--color-brand-cream)] text-[var(--color-brand-black)] py-24 md:py-40 min-h-screen">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        
        {/* === HEADER === */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-4 mb-12"
        >
          <div className="h-[1px] w-12 bg-[var(--color-brand-orange)]" />
          <h5 className="uppercase tracking-widest text-sm text-[var(--color-brand-orange)] font-bold">
            Careers
          </h5>
        </motion.div>

        <motion.div 
          className="max-w-4xl mb-20 md:mb-32"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          <motion.h1 variants={textReveal} className="text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight font-sans font-black text-[var(--color-brand-black)] mb-8">
            Join Our <span className="special-text font-normal text-[var(--color-brand-orange)]">Team.</span>
          </motion.h1>
          <motion.p variants={textReveal} className="text-xl md:text-2xl leading-relaxed text-foreground/80 font-sans">
            Discover exciting career opportunities in real estate. We are looking for motivated individuals who are passionate about the industry and ready to make a meaningful impact in transforming how people buy, sell, and invest in properties.
          </motion.p>
        </motion.div>

        {/* === ARCHITECTURAL JOB LIST === */}
        <div className="w-full border-t-2 border-[var(--color-brand-black)]">
          {jobs.map((job) => {
            const isActive = activeJobId === job.id;

            return (
              <div key={job.id} className="border-b border-[var(--color-brand-black)]/20">
                {/* Accordion Header */}
                <button 
                  onClick={() => setActiveJobId(isActive ? null : job.id)}
                  className="w-full py-8 md:py-10 flex flex-col md:flex-row md:items-center justify-between group text-left gap-4"
                >
                  <h3 className={`text-2xl md:text-4xl font-sans transition-colors duration-300 ${isActive ? "text-[var(--color-brand-orange)]" : "text-[var(--color-brand-black)] group-hover:text-[var(--color-brand-orange)]/70"}`}>
                    {job.title}
                  </h3>
                  <div className={`shrink-0 w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${isActive ? "border-[var(--color-brand-orange)] bg-[var(--color-brand-orange)] text-white" : "border-[var(--color-brand-black)]/20 text-[var(--color-brand-black)]"}`}>
                    <motion.div animate={{ rotate: isActive ? 45 : 0 }} transition={{ duration: 0.3 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </motion.div>
                  </div>
                </button>

                {/* Accordion Body */}
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-12 pt-4 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16">
                        
                        <div className="flex items-center gap-4 text-foreground/70">
                          <Briefcase className="w-6 h-6 text-[var(--color-brand-orange)]" />
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-black)]">Experience</p>
                            <p className="text-lg">{job.experience}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-foreground/70">
                          <Users className="w-6 h-6 text-[var(--color-brand-orange)]" />
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-black)]">Vacancies</p>
                            <p className="text-lg">{job.vacancies}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-foreground/70">
                          <MapPin className="w-6 h-6 text-[var(--color-brand-orange)]" />
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-black)]">Location</p>
                            <p className="text-lg">{job.location}</p>
                          </div>
                        </div>

                        <div className="mt-4 md:mt-0 md:ml-auto">
                          <button 
                            onClick={() => handleApplyClick(job.title)}
                            className="group flex items-center gap-3 px-8 py-4 bg-[var(--color-brand-black)] text-white rounded-full text-sm font-bold uppercase tracking-[0.15em] hover:bg-[var(--color-brand-orange)] transition-colors duration-300"
                          >
                            Apply Now
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                        
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Fallback Email Contact */}
        <div className="mt-16 text-center md:text-left">
          <p className="text-lg text-foreground/70 font-sans">
            Don't see a fit? Share your resume with us directly at: <br className="md:hidden" />
            <a href="mailto:hr@kumarworld.com" className="text-[var(--color-brand-orange)] font-bold hover:underline transition-all">hr@kumarworld.com</a>
          </p>
        </div>

      </div>

      {/* === APPLICATION SLIDE-OVER DRAWER (REPLACES MODAL) === */}
      <AnimatePresence>
        {isApplyOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Blurred Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            />

            {/* The Drawer Panel */}
            <motion.div 
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-2xl h-full bg-[var(--color-brand-cream)] shadow-2xl flex flex-col z-10 overflow-y-auto"
            >
              <div className="p-8 md:p-12 lg:p-16 flex flex-col h-full">
                
                {/* Drawer Header */}
                <div className="flex items-start justify-between mb-12">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-[var(--color-brand-orange)] mb-2">Application</p>
                    <h2 className="text-3xl md:text-4xl font-sans font-black text-[var(--color-brand-black)] leading-tight">
                      {selectedJobTitle}
                    </h2>
                  </div>
                  <button onClick={closeDrawer} className="p-3 bg-black/5 hover:bg-black/10 rounded-full transition-colors">
                    <X className="w-6 h-6 text-[var(--color-brand-black)]" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col gap-8">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold uppercase tracking-widest text-[var(--color-brand-black)]">Name *</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="John Doe" 
                        className="px-6 py-4 bg-white border border-[var(--color-brand-black)]/10 rounded-full focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors w-full text-lg"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold uppercase tracking-widest text-[var(--color-brand-black)]">Phone *</label>
                      <input 
                        required 
                        type="tel" 
                        placeholder="+91" 
                        pattern="[0-9]{10}"
                        className="px-6 py-4 bg-white border border-[var(--color-brand-black)]/10 rounded-full focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors w-full text-lg"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-[var(--color-brand-black)]">Email *</label>
                    <input 
                      required 
                      type="email" 
                      placeholder="john@example.com" 
                      className="px-6 py-4 bg-white border border-[var(--color-brand-black)]/10 rounded-full focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors w-full text-lg"
                    />
                  </div>

                  {/* Drag & Drop Resume */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-[var(--color-brand-black)]">Resume / CV *</label>
                    
                    <div 
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative w-full border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-300 ${fileName ? 'border-[var(--color-brand-orange)] bg-[var(--color-brand-orange)]/5' : 'border-[var(--color-brand-black)]/20 hover:border-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange)]/5 bg-white'}`}
                    >
                      <input 
                        ref={fileInputRef} 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileSelect}
                        accept=".pdf,.doc,.docx"
                        required={!fileName}
                      />
                      <UploadCloud className={`w-12 h-12 mb-4 ${fileName ? 'text-[var(--color-brand-orange)]' : 'text-[var(--color-brand-black)]/30'}`} />
                      {fileName ? (
                        <p className="text-lg font-bold text-[var(--color-brand-orange)]">{fileName}</p>
                      ) : (
                        <div>
                          <p className="text-lg text-[var(--color-brand-black)] font-medium mb-1">Click to Upload</p>
                          <p className="text-sm text-foreground/50">or drag and drop your file here</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Footer */}
                  <div className="mt-auto pt-8">
                    <button 
                      type="submit" 
                      className="w-full py-5 bg-[var(--color-brand-orange)] text-white rounded-full text-lg font-bold uppercase tracking-[0.15em] hover:bg-[var(--color-brand-black)] transition-colors duration-300"
                    >
                      Submit Application
                    </button>
                  </div>

                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}