"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useScroll, useMotionValueEvent ,Variants } from 'framer-motion';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  
  // State for Dock Dropdowns (Added 'about')
  const [activeDropdown, setActiveDropdown] = useState<'projects' | 'socials' | 'about' | null>(null);
  
  // Smart Scroll States
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Smart Scroll Logic
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    if (latest < 50) {
      setIsScrolled(false);
      setIsHidden(false);
    } else {
      setIsScrolled(true);
      if (latest > previous && latest > 150) {
        setIsHidden(true);
        setActiveDropdown(null); 
      } else {
        setIsHidden(false);
      }
    }
  });

  // Lock body scroll & Handle Escape Key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      const chatbot = document.querySelector('#kenytChatBubble') as HTMLElement;
      if (chatbot) chatbot.style.display = 'none';
    } else {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    }
    return () => { 
      document.body.style.overflow = 'unset'; 
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // --- Framer Motion Variants ---
  const glassPanelVariant = {
    hidden: { x: "-100%" },
    show: { x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    exit: { x: "-100%", transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
    exit: { opacity: 0, transition: { staggerChildren: 0.03, staggerDirection: -1 } }
  };

  const slideUpItem = {
    hidden: { y: 60, opacity: 0, rotateX: -20 },
    show: { y: 0, opacity: 1, rotateX: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    exit: { y: 20, opacity: 0, transition: { duration: 0.3 } }
  };

  const megaMenuVariant:Variants  = {
    hidden: { opacity: 0, y: 20, scale: 0.98, filter: "blur(5px)" },
    show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: 15, scale: 0.98, filter: "blur(5px)", transition: { duration: 0.2, ease: "easeIn" } }
  };

  const dropdownVariant = {
    hidden: { opacity: 0, y: 15, scale: 0.95, filter: "blur(4px)" },
    show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: 10, scale: 0.95, filter: "blur(4px)", transition: { duration: 0.2, ease: "easeIn" } }
  };

  const links = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/properties" },
    { name: "About Us", path: "/about-us" },
    { name: "Media", path: "/media" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Blogs", path: "/blogs-listing" },
    { name: "NRI Corner", path: "/nri-corner" },
    { name: "Grievance", path: "/grievance" },
    { name: "Careers", path: "/careers" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <>
      {/* --- SMART DYNAMIC ISLAND NAVBAR --- */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: isHidden ? -120 : 0, scale: isScrolled ? 0.95 : 1 }}
        transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
        className="fixed top-4 md:top-6 left-0 w-full z-50 flex justify-center pointer-events-none"
      >
        <div className={`pointer-events-auto flex items-center justify-between transition-all duration-500 shadow-xl
          ${isScrolled 
            ? 'w-[95%] md:w-auto md:min-w-[700px] bg-white/80 backdrop-blur-3xl border border-white/50 rounded-full px-2 py-2' 
            : 'w-[95%] md:w-[95%] lg:w-[90%] max-w-7xl bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2.5rem] px-3 md:px-8 py-3'}
        `}>
          
          {/* --- LEFT SECTION: Menu & Projects --- */}
          <div className="flex items-center gap-1 md:gap-2 relative flex-1 justify-start">
            
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(true);
              }}
              className="flex items-center gap-2 rounded-full transition-all duration-300 group px-2 md:px-3 py-2 hover:bg-white/50 cursor-pointer"
            >
              <div className="p-1.5 rounded-full transition-all duration-300 flex items-center justify-center bg-brand-black/5 group-hover:bg-brand-black/10">
                <img src="/assets/header/menu-icon.svg" alt="Menu" className="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover:scale-110" />
              </div>
              <span className="hidden xl:block text-xs font-bold tracking-widest uppercase text-brand-black transition-colors group-hover:text-brand-orange">
                Menu
              </span>
            </button>

            {/* PROJECTS TRIGGER */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('projects')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveDropdown(activeDropdown === 'projects' ? null : 'projects');
                }}
                className="flex items-center gap-1 md:gap-2 rounded-full transition-all duration-300 group px-2 md:px-3 py-2 hover:bg-white/50 cursor-pointer"
              >
                <span className="hidden lg:block text-xs font-bold tracking-widest uppercase text-brand-black transition-colors group-hover:text-brand-orange">
                  Projects
                </span>
                <svg className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'projects' ? 'rotate-180 text-brand-orange' : 'text-brand-black/50'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {activeDropdown === 'projects' && (
                  <motion.div
                    variants={megaMenuVariant}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="absolute top-[130%] left-[-10px] md:left-[-20px] w-[88vw] sm:w-[500px] md:w-[850px] max-h-[75vh] overflow-y-auto md:overflow-visible bg-white/95 backdrop-blur-3xl border border-white/50 shadow-[0_30px_60px_rgba(0,0,0,0.15)] rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 z-50 cursor-default"
                  >
                    <div className="flex-[2.2] border-b md:border-b-0 md:border-r border-black/10 pb-6 md:pb-0 md:pr-8">
                      <h4 className="text-xs md:text-sm font-black tracking-widest uppercase text-brand-black/40 mb-4 md:mb-6">Explore Portfolios</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        <Link href="/properties/residential" className="group relative overflow-hidden rounded-xl md:rounded-2xl h-32 sm:h-40 md:h-56 shadow-lg bg-black">
                          <img src="/assets/header/Residential.jpg" alt="Residential" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
                          <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full transform transition-transform duration-500">
                            <span className="block text-white font-black tracking-wider uppercase text-lg md:text-xl mb-1 group-hover:text-brand-orange transition-colors">Residential</span>
                            <span className="block text-white/80 text-xs md:text-sm font-medium tracking-wide">Premium living spaces</span>
                          </div>
                        </Link>
                        
                        <Link href="/properties/commercial" className="group relative overflow-hidden rounded-xl md:rounded-2xl h-32 sm:h-40 md:h-56 shadow-lg bg-black">
                          <img src="/assets/header/Commercial.jpg" alt="Commercial" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
                          <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full transform transition-transform duration-500">
                            <span className="block text-white font-black tracking-wider uppercase text-lg md:text-xl mb-1 group-hover:text-brand-orange transition-colors">Commercial</span>
                            <span className="block text-white/80 text-xs md:text-sm font-medium tracking-wide">World-class business hubs</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                    
                    <div className="flex-[1] flex flex-col">
                      <h4 className="text-xs md:text-sm font-black tracking-widest uppercase text-brand-black/40 mb-4 md:mb-6">Locations</h4>
                      <ul className="flex flex-col gap-1 md:gap-2 flex-grow">
                        {['Pune', 'Bengaluru', 'Mumbai'].map((loc) => (
                          <li key={loc}>
                            <Link href={`/properties/location/${loc.toLowerCase().replace(' ', '-')}`} className="flex items-center justify-between p-3 md:p-4 rounded-lg md:rounded-xl hover:bg-brand-black/5 transition-all duration-300 group">
                              <span className="text-sm md:text-base font-bold text-brand-black group-hover:text-brand-orange transition-colors">{loc}</span>
                              <svg className="w-4 h-4 md:w-5 md:h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* --- CENTER: Anchor Logo --- */}
          <div className="flex-shrink-0 flex justify-center items-center px-2 md:px-6">
            <Link href="/" className="transition-all duration-500 hover:scale-105">
              <img
                src="/assets/common/Corp_Crafting_Homes_Logo_80.png"
                alt="Kumar Corp"
                className="h-9 sm:h-12 w-auto object-contain transition-transform duration-500"
              />
            </Link>
          </div>

          {/* --- RIGHT SECTION: About Us & Connect --- */}
          <div className="flex items-center gap-1 md:gap-2 relative flex-1 justify-end">
            
            {/* NEW: ABOUT US TRIGGER */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('about')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveDropdown(activeDropdown === 'about' ? null : 'about');
                }}
                className="flex items-center gap-1 md:gap-2 rounded-full transition-all duration-300 group px-2 md:px-3 py-2 hover:bg-white/50 cursor-pointer"
              >
                <span className="hidden lg:block text-xs font-bold tracking-widest uppercase text-brand-black transition-colors group-hover:text-brand-orange">
                  About Us
                </span>
                <svg className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'about' ? 'rotate-180 text-brand-orange' : 'text-brand-black/50'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* NEW: ABOUT US MEGA MENU */}
              <AnimatePresence>
                {activeDropdown === 'about' && (
                  <motion.div
                    variants={megaMenuVariant}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    /* Anchored to the right side on desktop so it doesn't overflow off-screen */
                    className="absolute top-[130%] right-[-10px] md:right-[-40px] w-[88vw] sm:w-[500px] md:w-[750px] max-h-[75vh] overflow-y-auto md:overflow-visible bg-white/95 backdrop-blur-3xl border border-white/50 shadow-[0_30px_60px_rgba(0,0,0,0.15)] rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col md:flex-row gap-4 md:gap-6 z-50 cursor-default"
                  >
                    {[
                      { title: 'Our Philosophy', desc: 'The core values driving us', img: 'crafting', path: '/our-philosophy' },
                      { title: 'Our Legacy', desc: 'Crafting homes since 1966', img: 'Timeline', path: '/our-legacy' },
                      { title: 'Leadership', desc: 'The visionaries behind Kumar', img: 'Mission-&-Vision', path: '/leadership' },
                    ].map((item) => (
                      <Link href={item.path} key={item.title} className="flex-1 group relative overflow-hidden rounded-xl md:rounded-2xl h-32 sm:h-40 md:h-56 shadow-lg bg-black">
                        <img src={`/assets/header/${item.img}.jpg`} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
                        <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full transform transition-transform duration-500">
                          <span className="block text-white font-black tracking-wider uppercase text-lg md:text-xl mb-1 group-hover:text-brand-orange transition-colors">{item.title}</span>
                          <span className="block text-white/80 text-xs md:text-sm font-medium tracking-wide">{item.desc}</span>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CONNECT TRIGGER */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('socials')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveDropdown(activeDropdown === 'socials' ? null : 'socials');
                }}
                className="flex items-center gap-2 rounded-full transition-all duration-300 group px-2 md:px-3 py-2 hover:bg-white/50 cursor-pointer"
              >
                <span className="hidden xl:block text-xs font-bold tracking-widest uppercase text-brand-black transition-colors group-hover:text-brand-orange">
                  Connect
                </span>
                <div className="p-1.5 rounded-full transition-all duration-300 flex items-center justify-center bg-brand-black/5 group-hover:bg-brand-orange">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover:scale-110 group-hover:text-white text-brand-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              </button>

              <AnimatePresence>
                {activeDropdown === 'socials' && (
                  <motion.div
                    variants={dropdownVariant}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="absolute top-[130%] right-[-10px] md:right-0 w-[200px] md:min-w-[220px] bg-white/95 backdrop-blur-3xl border border-white/50 shadow-[0_20px_40px_rgba(0,0,0,0.1)] rounded-2xl p-3 flex flex-col gap-1 z-50"
                  >
                    <a href="https://instagram.com/kumarproperties" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-black/5 transition-colors group">
                      <img src="/assets/header/instagram.svg" alt="Instagram" className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                      <span className="text-sm font-semibold text-brand-black">Instagram</span>
                    </a>
                    <a href="https://facebook.com/kumarproperties" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-black/5 transition-colors group">
                      <img src="/assets/header/facebook.svg" alt="Facebook" className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                      <span className="text-sm font-semibold text-brand-black">Facebook</span>
                    </a>
                    <a href="https://www.youtube.com/channel/UCSfnHQmlu8aEC64uXm9npIQ" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-black/5 transition-colors group">
                      <img src="/assets/header/youtube.svg" alt="YouTube" className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                      <span className="text-sm font-semibold text-brand-black">YouTube</span>
                    </a>
                    
                    <div className="h-[1px] bg-black/10 my-1 w-full" />
                    
                    <a href="tel:9595110011" className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-orange/10 transition-colors group">
                      <img src="/assets/icons/call.svg" alt="Call" className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                      <span className="text-sm font-bold text-brand-orange">Call 9595110011</span>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </motion.div>

      {/* --- CINEMATIC LIQUID GLASS MENU --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.4 } }}
            className="fixed inset-0 z-[100] flex"
          >
            {/* 1. Cinematic Video Background */}
            <div className="absolute inset-0 z-0 bg-brand-black overflow-hidden">
              <motion.video
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.8 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/assets/header/cinematic-bg.mp4" type="video/mp4" />
                <img 
                  src="/assets/header/Dustak_Web_1205-x-900.jpg" 
                  alt="Kumar Corp Architecture" 
                  className="w-full h-full object-cover" 
                />
              </motion.video>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-black/90 via-brand-black/50 to-brand-black/80" />
            </div>

            {/* 2. Sliding Frosted Glass Panel */}
            <motion.div 
              variants={glassPanelVariant}
              initial="hidden"
              animate="show"
              exit="exit"
              className="relative z-10 w-full lg:w-[45%] xl:w-[40%] h-full flex flex-col p-8 sm:p-12 md:p-16 bg-white/10 backdrop-blur-3xl border-r border-white/20 shadow-[20px_0_60px_rgba(0,0,0,0.5)] overflow-y-auto"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

              <div className="flex items-center gap-6 mb-12">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                  }}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-brand-orange hover:border-brand-orange hover:shadow-[0_0_20px_rgba(245,130,32,0.4)] transition-all duration-300 group cursor-pointer flex-shrink-0"
                >
                  <img src="/assets/header/cross.png" alt="Close" className="w-4 h-4 brightness-0 invert group-hover:scale-90 transition-all" />
                </button>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xs sm:text-sm font-bold tracking-widest uppercase text-brand-cream/80"
                >
                  Generational Legacy
                </motion.div>
              </div>

              {/* 3. Staggered Links */}
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                exit="exit"
                className="flex flex-col gap-2 sm:gap-4 my-auto perspective-1000"
              >
                {links.map((link, index) => {
                  const isHovered = hoveredLink !== null && hoveredLink !== index;
                  
                  return (
                    <motion.div 
                      key={link.path} 
                      variants={slideUpItem} 
                      className="overflow-hidden py-1"
                      onMouseEnter={() => setHoveredLink(index)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      <Link 
                        href={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`group flex items-center text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight transition-all duration-400 ease-out
                          ${isHovered ? 'text-brand-cream/20 blur-[2px] scale-95' : 'text-brand-cream hover:text-brand-orange hover:translate-x-4'}
                        `}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center"
              >
                <span className="text-brand-cream/60 text-sm font-normal tracking-wide">Crafting Homes since 1966.</span>
                
                <div className="flex gap-4">
                  <a href="https://instagram.com/kumarproperties" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
                    <img src="/assets/header/instagram.svg" alt="IG" className="w-4 h-4 brightness-0 invert opacity-60 hover:opacity-100" />
                  </a>
                  <a href="https://www.youtube.com/channel/UCSfnHQmlu8aEC64uXm9npIQ" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
                    <img src="/assets/header/youtube.svg" alt="YT" className="w-4 h-4 brightness-0 invert opacity-60 hover:opacity-100" />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion';

// export default function Header() {
//   const pathname = usePathname();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  
//   // State for Dock Dropdowns
//   const [activeDropdown, setActiveDropdown] = useState<'projects' | 'socials' | null>(null);
  
//   // Smart Scroll States
//   const { scrollY } = useScroll();
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isHidden, setIsHidden] = useState(false);

//   // Smart Scroll Logic
//   useMotionValueEvent(scrollY, "change", (latest) => {
//     const previous = scrollY.getPrevious() ?? 0;
    
//     if (latest < 50) {
//       setIsScrolled(false);
//       setIsHidden(false);
//     } else {
//       setIsScrolled(true);
//       if (latest > previous && latest > 150) {
//         setIsHidden(true);
//         setActiveDropdown(null); // Close dropdowns on scroll down
//       } else {
//         setIsHidden(false);
//       }
//     }
//   });

//   // Lock body scroll & Handle Escape Key
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') {
//         setIsMenuOpen(false);
//         setActiveDropdown(null);
//       }
//     };

//     if (isMenuOpen) {
//       document.body.style.overflow = 'hidden';
//       window.addEventListener('keydown', handleKeyDown);
//       const chatbot = document.querySelector('#kenytChatBubble') as HTMLElement;
//       if (chatbot) chatbot.style.display = 'none';
//     } else {
//       document.body.style.overflow = 'unset';
//       window.removeEventListener('keydown', handleKeyDown);
//     }
//     return () => { 
//       document.body.style.overflow = 'unset'; 
//       window.removeEventListener('keydown', handleKeyDown);
//     };
//   }, [isMenuOpen]);

//   useEffect(() => {
//     setIsMenuOpen(false);
//     setActiveDropdown(null);
//   }, [pathname]);

//   // --- Framer Motion Variants ---
//   const glassPanelVariant = {
//     hidden: { x: "-100%" },
//     show: { x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
//     exit: { x: "-100%", transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } }
//   };

//   const staggerContainer = {
//     hidden: { opacity: 0 },
//     show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
//     exit: { opacity: 0, transition: { staggerChildren: 0.03, staggerDirection: -1 } }
//   };

//   const slideUpItem = {
//     hidden: { y: 60, opacity: 0, rotateX: -20 },
//     show: { y: 0, opacity: 1, rotateX: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
//     exit: { y: 20, opacity: 0, transition: { duration: 0.3 } }
//   };

//   // Upgraded Mega Menu Animation Variant
//   const megaMenuVariant = {
//     hidden: { opacity: 0, y: 20, scale: 0.98, filter: "blur(5px)" },
//     show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
//     exit: { opacity: 0, y: 15, scale: 0.98, filter: "blur(5px)", transition: { duration: 0.2, ease: "easeIn" } }
//   };

//   const dropdownVariant = {
//     hidden: { opacity: 0, y: 15, scale: 0.95, filter: "blur(4px)" },
//     show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.3, ease: "easeOut" } },
//     exit: { opacity: 0, y: 10, scale: 0.95, filter: "blur(4px)", transition: { duration: 0.2, ease: "easeIn" } }
//   };

//   const links = [
//     { name: "Home", path: "/" },
//     { name: "Projects", path: "/properties" },
//     { name: "About Us", path: "/about-us" },
//     { name: "Media", path: "/media" },
//     { name: "Testimonials", path: "/testimonials" },
//     { name: "Blogs", path: "/blogs-listing" },
//     { name: "NRI Corner", path: "/nri-corner" },
//     { name: "Grievance", path: "/grievance" },
//     { name: "Careers", path: "/careers" },
//     { name: "Contact Us", path: "/contact" },
//   ];

//   return (
//     <>
//       {/* --- SMART DYNAMIC ISLAND NAVBAR --- */}
//       <motion.div 
//         initial={{ y: -100 }}
//         animate={{ y: isHidden ? -120 : 0, scale: isScrolled ? 0.95 : 1 }}
//         transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
//         className="fixed top-4 md:top-6 left-0 w-full z-50 flex justify-center pointer-events-none"
//       >
//         <div className={`pointer-events-auto flex items-center justify-between transition-all duration-500 shadow-xl
//           ${isScrolled 
//             ? 'w-[95%] md:w-auto md:min-w-[700px] bg-white/80 backdrop-blur-3xl border border-white/50 rounded-full px-2 py-2' 
//             : 'w-[95%] md:w-[90%] max-w-7xl bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2.5rem] px-4 md:px-8 py-3'}
//         `}>
          
//           {/* --- LEFT SECTION: Menu & Projects --- */}
//           <div className="flex items-center gap-1 md:gap-2 relative">
//             <button 
//               onClick={() => setIsMenuOpen(true)}
//               className="flex items-center gap-2 rounded-full transition-all duration-300 group px-3 py-2 hover:bg-white/50"
//             >
//               <div className="p-1.5 rounded-full transition-all duration-300 flex items-center justify-center bg-brand-black/5 group-hover:bg-brand-black/10">
//                 <img src="/assets/header/menu-icon.svg" alt="Menu" className="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover:scale-110" />
//               </div>
//               <span className="hidden lg:block text-xs font-bold tracking-widest uppercase text-brand-black transition-colors group-hover:text-brand-orange">
//                 Menu
//               </span>
//             </button>

//             {/* UPGRADED: Projects Mega Menu Trigger */}
//             <div 
//               className="relative"
//               onMouseEnter={() => setActiveDropdown('projects')}
//               onMouseLeave={() => setActiveDropdown(null)}
//             >
//               <button className="flex items-center gap-2 rounded-full transition-all duration-300 group px-3 py-2 hover:bg-white/50">
//                 <span className="hidden md:block text-xs font-bold tracking-widest uppercase text-brand-black transition-colors group-hover:text-brand-orange">
//                   Projects
//                 </span>
//                 <svg className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'projects' ? 'rotate-180 text-brand-orange' : 'text-brand-black/50'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>

//               {/* UPGRADED: Huge Projects Mega Menu Panel */}
//               <AnimatePresence>
//                 {activeDropdown === 'projects' && (
//                   <motion.div
//                     variants={megaMenuVariant}
//                     initial="hidden"
//                     animate="show"
//                     exit="exit"
//                     // w-[850px] makes it very wide and prominent. left-[-20px] centers it slightly relative to the trigger.
//                     className="absolute top-[130%] left-[-20px] w-[850px] bg-white/95 backdrop-blur-3xl border border-white/50 shadow-[0_30px_60px_rgba(0,0,0,0.15)] rounded-3xl p-8 flex gap-8 z-50 cursor-default"
//                   >
//                     {/* Large Image Grid (Left Side) */}
//                     <div className="flex-[2.2] border-r border-black/10 pr-8">
//                       <h4 className="text-sm font-black tracking-widest uppercase text-brand-black/40 mb-6">Explore Portfolios</h4>
                      
//                       <div className="grid grid-cols-2 gap-6">
//                         {/* Residential Card */}
//                         <Link href="/properties/residential" className="group relative overflow-hidden rounded-2xl h-56 shadow-lg bg-black">
//                           <img src="/assets/projects/residential-thumb.jpg" alt="Residential" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
//                           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
                          
//                           <div className="absolute bottom-0 left-0 p-6 w-full transform transition-transform duration-500">
//                             <span className="block text-white font-black tracking-wider uppercase text-xl mb-1 group-hover:text-brand-orange transition-colors">Residential</span>
//                             <span className="block text-white/80 text-sm font-medium tracking-wide">Premium living spaces</span>
//                           </div>
//                         </Link>

//                         {/* Commercial Card */}
//                         <Link href="/properties/commercial" className="group relative overflow-hidden rounded-2xl h-56 shadow-lg bg-black">
//                           <img src="/assets/projects/commercial-thumb.jpg" alt="Commercial" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
//                           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
                          
//                           <div className="absolute bottom-0 left-0 p-6 w-full transform transition-transform duration-500">
//                             <span className="block text-white font-black tracking-wider uppercase text-xl mb-1 group-hover:text-brand-orange transition-colors">Commercial</span>
//                             <span className="block text-white/80 text-sm font-medium tracking-wide">World-class business hubs</span>
//                           </div>
//                         </Link>
//                       </div>
//                     </div>

//                     {/* Locations Column (Right Side) */}
//                     <div className="flex-[1] flex flex-col">
//                       <h4 className="text-sm font-black tracking-widest uppercase text-brand-black/40 mb-6">Destinations</h4>
//                       <ul className="flex flex-col gap-2 flex-grow">
//                         {['Pune', 'Bengaluru', 'Mumbai', 'Other Cities'].map((loc) => (
//                           <li key={loc}>
//                             <Link href={`/properties/location/${loc.toLowerCase().replace(' ', '-')}`} className="flex items-center justify-between p-4 rounded-xl hover:bg-brand-black/5 transition-all duration-300 group">
//                               <span className="text-base font-bold text-brand-black group-hover:text-brand-orange transition-colors">{loc}</span>
//                               {/* Sleek Arrow Icon that slides in on hover */}
//                               <svg className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//                               </svg>
//                             </Link>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>

//           {/* --- CENTER: Anchor Logo --- */}
//           <Link href="/" className="transition-all duration-500 hover:scale-105 mx-4 md:mx-8">
//             <img
//               src="/assets/common/Corp_Crafting_Homes_Logo_80.png"
//               alt="Kumar Corp"
//               className="h-10 sm:h-12 w-auto object-contain transition-transform duration-500"
//             />
//           </Link>

//           {/* --- RIGHT SECTION: Social Connect Dropdown --- */}
//           <div 
//             className="relative flex items-center justify-end"
//             onMouseEnter={() => setActiveDropdown('socials')}
//             onMouseLeave={() => setActiveDropdown(null)}
//           >
//             <button className="flex items-center gap-2 rounded-full transition-all duration-300 group px-3 py-2 hover:bg-white/50">
//               <span className="hidden lg:block text-xs font-bold tracking-widest uppercase text-brand-black transition-colors group-hover:text-brand-orange">
//                 Connect
//               </span>
//               <div className="p-1.5 rounded-full transition-all duration-300 flex items-center justify-center bg-brand-black/5 group-hover:bg-brand-orange">
//                 <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover:scale-110 group-hover:text-white text-brand-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
//                 </svg>
//               </div>
//             </button>

//             {/* Socials Dropdown Panel */}
//             <AnimatePresence>
//               {activeDropdown === 'socials' && (
//                 <motion.div
//                   variants={dropdownVariant}
//                   initial="hidden"
//                   animate="show"
//                   exit="exit"
//                   className="absolute top-[130%] right-0 min-w-[220px] bg-white/95 backdrop-blur-3xl border border-white/50 shadow-[0_20px_40px_rgba(0,0,0,0.1)] rounded-2xl p-3 flex flex-col gap-1 z-50"
//                 >
//                   <a href="https://instagram.com/kumarproperties" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-black/5 transition-colors group">
//                     <img src="/assets/header/instagram.svg" alt="Instagram" className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
//                     <span className="text-sm font-semibold text-brand-black">Instagram</span>
//                   </a>
//                   <a href="https://facebook.com/kumarproperties" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-black/5 transition-colors group">
//                     <img src="/assets/header/facebook.svg" alt="Facebook" className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
//                     <span className="text-sm font-semibold text-brand-black">Facebook</span>
//                   </a>
//                   <a href="https://www.youtube.com/channel/UCSfnHQmlu8aEC64uXm9npIQ" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-black/5 transition-colors group">
//                     <img src="/assets/header/youtube.svg" alt="YouTube" className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
//                     <span className="text-sm font-semibold text-brand-black">YouTube</span>
//                   </a>
                  
//                   <div className="h-[1px] bg-black/10 my-1 w-full" />
                  
//                   <a href="tel:9595110011" className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-orange/10 transition-colors group">
//                     <img src="/assets/icons/call.svg" alt="Call" className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
//                     <span className="text-sm font-bold text-brand-orange">Call 9595110011</span>
//                   </a>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </motion.div>

//       {/* --- CINEMATIC LIQUID GLASS MENU --- */}
//       <AnimatePresence>
//         {isMenuOpen && (
//           <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0, transition: { delay: 0.4 } }}
//             className="fixed inset-0 z-[100] flex"
//           >
//             {/* 1. Cinematic Background */}
//             <div className="absolute inset-0 z-0 bg-brand-black overflow-hidden">
//               <motion.img
//                 initial={{ scale: 1.1 }}
//                 animate={{ scale: 1 }}
//                 transition={{ duration: 1.5, ease: "easeOut" }}
//                 src="/assets/header/Dustak_Web_1205-x-900.jpg"
//                 alt="Kumar Corp Architecture"
//                 className="w-full h-full object-cover opacity-80"
//               />
//               <div className="absolute inset-0 bg-gradient-to-r from-brand-black/90 via-brand-black/50 to-brand-black/80" />
//             </div>

//             {/* 2. Sliding Frosted Glass Panel */}
//             <motion.div 
//               variants={glassPanelVariant}
//               initial="hidden"
//               animate="show"
//               exit="exit"
//               className="relative z-10 w-full lg:w-[45%] xl:w-[40%] h-full flex flex-col p-8 sm:p-12 md:p-16 bg-white/10 backdrop-blur-3xl border-r border-white/20 shadow-[20px_0_60px_rgba(0,0,0,0.5)] overflow-y-auto"
//             >
//               <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

//               <div className="flex items-center gap-6 mb-12">
//                 <button 
//                   onClick={() => setIsMenuOpen(false)}
//                   className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-brand-orange hover:border-brand-orange hover:shadow-[0_0_20px_rgba(245,130,32,0.4)] transition-all duration-300 group cursor-pointer flex-shrink-0"
//                 >
//                   <img src="/assets/header/cross.png" alt="Close" className="w-4 h-4 brightness-0 invert group-hover:scale-90 transition-all" />
//                 </button>
//                 <motion.div 
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.3 }}
//                   className="text-xs sm:text-sm font-bold tracking-widest uppercase text-brand-cream/80"
//                 >
//                   Generational Legacy
//                 </motion.div>
//               </div>

//               {/* 3. Staggered Links */}
//               <motion.div 
//                 variants={staggerContainer}
//                 initial="hidden"
//                 animate="show"
//                 exit="exit"
//                 className="flex flex-col gap-2 sm:gap-4 my-auto perspective-1000"
//               >
//                 {links.map((link, index) => {
//                   const isHovered = hoveredLink !== null && hoveredLink !== index;
                  
//                   return (
//                     <motion.div 
//                       key={link.path} 
//                       variants={slideUpItem} 
//                       className="overflow-hidden py-1"
//                       onMouseEnter={() => setHoveredLink(index)}
//                       onMouseLeave={() => setHoveredLink(null)}
//                     >
//                       <Link 
//                         href={link.path}
//                         onClick={() => setIsMenuOpen(false)}
//                         className={`group flex items-center text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight transition-all duration-400 ease-out
//                           ${isHovered ? 'text-brand-cream/20 blur-[2px] scale-95' : 'text-brand-cream hover:text-brand-orange hover:translate-x-4'}
//                         `}
//                       >
//                         {link.name}
//                       </Link>
//                     </motion.div>
//                   );
//                 })}
//               </motion.div>

//               <motion.div 
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.8 }}
//                 className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center"
//               >
//                 <span className="text-brand-cream/60 text-sm font-normal tracking-wide">Crafting Homes since 1966.</span>
                
//                 <div className="flex gap-4">
//                   <a href="https://instagram.com/kumarproperties" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
//                     <img src="/assets/header/instagram.svg" alt="IG" className="w-4 h-4 brightness-0 invert opacity-60 hover:opacity-100" />
//                   </a>
//                   <a href="https://www.youtube.com/channel/UCSfnHQmlu8aEC64uXm9npIQ" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
//                     <img src="/assets/header/youtube.svg" alt="YT" className="w-4 h-4 brightness-0 invert opacity-60 hover:opacity-100" />
//                   </a>
//                 </div>
//               </motion.div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }


// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion';

// export default function Header() {
//   const pathname = usePathname();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  
//   // Smart Scroll States
//   const { scrollY } = useScroll();
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isHidden, setIsHidden] = useState(false);

//   // Smart Scroll Logic: Morphs from transparent top-bar to floating glass pill
//   useMotionValueEvent(scrollY, "change", (latest) => {
//     const previous = scrollY.getPrevious() ?? 0;
    
//     // If at the very top, make it transparent and wide
//     if (latest < 50) {
//       setIsScrolled(false);
//       setIsHidden(false);
//     } else {
//       setIsScrolled(true);
//       // Hide when scrolling down, show when scrolling up
//       if (latest > previous && latest > 150) {
//         setIsHidden(true);
//       } else {
//         setIsHidden(false);
//       }
//     }
//   });

//   // Lock body scroll & Handle Escape Key
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') setIsMenuOpen(false);
//     };

//     if (isMenuOpen) {
//       document.body.style.overflow = 'hidden';
//       window.addEventListener('keydown', handleKeyDown);
//       const chatbot = document.querySelector('#kenytChatBubble') as HTMLElement;
//       if (chatbot) chatbot.style.display = 'none';
//     } else {
//       document.body.style.overflow = 'unset';
//       window.removeEventListener('keydown', handleKeyDown);
//     }
//     return () => { 
//       document.body.style.overflow = 'unset'; 
//       window.removeEventListener('keydown', handleKeyDown);
//     };
//   }, [isMenuOpen]);

//   useEffect(() => {
//     setIsMenuOpen(false);
//   }, [pathname]);

//   // --- Cinematic Framer Motion Variants ---
//   const glassPanelVariant = {
//     hidden: { x: "-100%" },
//     show: { x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
//     exit: { x: "-100%", transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } }
//   };

//   const staggerContainer = {
//     hidden: { opacity: 0 },
//     show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
//     exit: { opacity: 0, transition: { staggerChildren: 0.03, staggerDirection: -1 } }
//   };

//   const slideUpItem = {
//     hidden: { y: 60, opacity: 0, rotateX: -20 },
//     show: { y: 0, opacity: 1, rotateX: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
//     exit: { y: 20, opacity: 0, transition: { duration: 0.3 } }
//   };

//   const links = [
//     { name: "Home", path: "/" },
//     { name: "Projects", path: "/properties" },
//     { name: "About Us", path: "/about-us" },
//     { name: "Media", path: "/media" },
//     { name: "Testimonials", path: "/testimonials" },
//     { name: "Blogs", path: "/blogs-listing" },
//     { name: "NRI Corner", path: "/nri-corner" },
//     { name: "Grievance", path: "/grievance" },
//     { name: "Careers", path: "/careers" },
//     { name: "Contact Us", path: "/contact" },
//   ];

//   return (
//     <>
//       {/* --- SMART DYNAMIC ISLAND NAVBAR --- */}
//       {/* --- THE SPATIAL GLASS DOCK (APPLE STYLE) --- */}
//       <motion.div 
//         initial={{ y: -100 }}
//         animate={{ 
//           y: isHidden ? -120 : 0,
//           scale: isScrolled ? 0.95 : 1,
//         }}
//         transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
//         className="fixed top-4 md:top-6 left-0 w-full z-50 flex justify-center pointer-events-none"
//       >
//         {/* 
//           The Dock Container:
//           Now it ALWAYS has a frosted glass background. 
//           At the top: It's wide, highly blurred, and slightly transparent (bg-white/40).
//           Scrolled: It shrinks and becomes more solid (bg-white/80).
//         */}
//         <div className={`pointer-events-auto flex items-center justify-between transition-all duration-500 overflow-hidden shadow-xl
//           ${isScrolled 
//             ? 'w-[90%] md:w-auto md:min-w-[500px] bg-white/80 backdrop-blur-3xl border border-white/50 rounded-full px-2 py-2' 
//             : 'w-[95%] md:w-[85%] max-w-6xl bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2.5rem] px-6 md:px-10 py-3'}
//         `}>
          
//           {/* Menu Trigger (Left) */}
//           <button 
//             onClick={() => setIsMenuOpen(true)}
//             className="flex items-center gap-3 rounded-full transition-all duration-300 group px-4 py-2 hover:bg-white/50"
//           >
//             <div className="p-1.5 rounded-full transition-all duration-300 flex items-center justify-center bg-brand-black/5 group-hover:bg-brand-black/10">
//               <img 
//                 src="/assets/header/menu-icon.svg" 
//                 alt="Menu" 
//                 className="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover:scale-110" 
//               />
//             </div>
//             <span className="hidden md:block text-xs font-bold tracking-widest uppercase text-brand-black transition-colors group-hover:text-brand-orange">
//               Menu
//             </span>
//           </button>

//           {/* CENTER: The Anchor Logo (Original Colors, No Glow) */}
//           <Link href="/" className="transition-all duration-500 hover:scale-105 mx-4 md:mx-8">
//             <img
//               src="/assets/common/Corp_Crafting_Homes_Logo_80.png"
//               alt="Kumar Corp"
//               className="h-10 sm:h-12 w-auto object-contain transition-transform duration-500"
//             />
//           </Link>

//           {/* Quick Action (Right) */}
//           <a 
//             href="tel:9595110011" 
//             className="flex items-center gap-3 rounded-full transition-all duration-300 group px-4 py-2 hover:bg-white/50"
//           >
//             <span className="hidden md:block text-xs font-bold tracking-widest uppercase text-brand-black transition-colors group-hover:text-brand-orange">
//               Call Us
//             </span>
//             <div className="p-1.5 rounded-full transition-all duration-300 flex items-center justify-center bg-brand-black/5 group-hover:bg-brand-orange">
//               <img 
//                 src="/assets/icons/call.svg" 
//                 alt="Call" 
//                 className="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover:scale-110 group-hover:brightness-0 group-hover:invert" 
//               />
//             </div>
//           </a>
//         </div>
//       </motion.div>

//       {/* --- CINEMATIC LIQUID GLASS MENU --- */}
//       <AnimatePresence>
//         {isMenuOpen && (
//           <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0, transition: { delay: 0.4 } }}
//             className="fixed inset-0 z-[100] flex"
//           >
//             {/* 1. Cinematic Background with Parallax Scale */}
//             <div className="absolute inset-0 z-0 bg-brand-black overflow-hidden">
//               <motion.img
//                 initial={{ scale: 1.1 }}
//                 animate={{ scale: 1 }}
//                 transition={{ duration: 1.5, ease: "easeOut" }}
//                 src="/assets/header/Dustak_Web_1205-x-900.jpg"
//                 alt="Kumar Corp Architecture"
//                 className="w-full h-full object-cover opacity-80"
//               />
//               <div className="absolute inset-0 bg-gradient-to-r from-brand-black/90 via-brand-black/50 to-brand-black/80" />
//             </div>

//             {/* 2. Sliding Frosted Glass Panel */}
//             <motion.div 
//               variants={glassPanelVariant}
//               initial="hidden"
//               animate="show"
//               exit="exit"
//               className="relative z-10 w-full lg:w-[45%] xl:w-[40%] h-full flex flex-col p-8 sm:p-12 md:p-16 bg-white/10 backdrop-blur-3xl border-r border-white/20 shadow-[20px_0_60px_rgba(0,0,0,0.5)] overflow-y-auto"
//             >
//               <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

//               <div className="flex items-center gap-6 mb-12">
//                 <button 
//                   onClick={() => setIsMenuOpen(false)}
//                   className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-brand-orange hover:border-brand-orange hover:shadow-[0_0_20px_rgba(245,130,32,0.4)] transition-all duration-300 group cursor-pointer flex-shrink-0"
//                 >
//                   <img src="/assets/header/cross.png" alt="Close" className="w-4 h-4 brightness-0 invert group-hover:scale-90 transition-all" />
//                 </button>
//                 <motion.div 
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.3 }}
//                   className="text-xs sm:text-sm font-bold tracking-widest uppercase text-brand-cream/80"
//                 >
//                   Generational Legacy
//                 </motion.div>
//               </div>

//               {/* 3. Staggered Links with Sibling Dimming (Hyper-Focus) */}
//               <motion.div 
//                 variants={staggerContainer}
//                 initial="hidden"
//                 animate="show"
//                 exit="exit"
//                 className="flex flex-col gap-2 sm:gap-4 my-auto perspective-1000"
//               >
//                 {links.map((link, index) => {
//                   const isHovered = hoveredLink !== null && hoveredLink !== index;
                  
//                   return (
//                     <motion.div 
//                       key={link.path} 
//                       variants={slideUpItem} 
//                       className="overflow-hidden py-1"
//                       onMouseEnter={() => setHoveredLink(index)}
//                       onMouseLeave={() => setHoveredLink(null)}
//                     >
//                       <Link 
//                         href={link.path}
//                         onClick={() => setIsMenuOpen(false)}
//                         className={`group flex items-center text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight transition-all duration-400 ease-out
//                           ${isHovered ? 'text-brand-cream/20 blur-[2px] scale-95' : 'text-brand-cream hover:text-brand-orange hover:translate-x-4'}
//                         `}
//                       >
//                         {link.name}
//                       </Link>
//                     </motion.div>
//                   );
//                 })}
//               </motion.div>

//               <motion.div 
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.8 }}
//                 className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center"
//               >
//                 <span className="text-brand-cream/60 text-sm font-normal tracking-wide">Crafting Homes since 1966.</span>
                
//                 {/* Micro Social Links in Footer */}
//                 <div className="flex gap-4">
//                   <a href="https://instagram.com/kumarproperties" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
//                     <img src="/assets/header/instagram.svg" alt="IG" className="w-4 h-4 brightness-0 invert opacity-60 hover:opacity-100" />
//                   </a>
//                   <a href="https://www.youtube.com/channel/UCSfnHQmlu8aEC64uXm9npIQ" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
//                     <img src="/assets/header/youtube.svg" alt="YT" className="w-4 h-4 brightness-0 invert opacity-60 hover:opacity-100" />
//                   </a>
//                 </div>
//               </motion.div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }

// "use client";

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion';

// export default function HeaderVisionOS() {
//   const pathname = usePathname();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  
//   const { scrollY } = useScroll();
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isHidden, setIsHidden] = useState(false);

//   useMotionValueEvent(scrollY, "change", (latest) => {
//     const previous = scrollY.getPrevious() ?? 0;
//     if (latest < 50) {
//       setIsScrolled(false);
//       setIsHidden(false);
//     } else {
//       setIsScrolled(true);
//       setIsHidden(latest > previous && latest > 150);
//     }
//   });

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsMenuOpen(false); };
//     if (isMenuOpen) {
//       document.body.style.overflow = 'hidden';
//       window.addEventListener('keydown', handleKeyDown);
//     } else {
//       document.body.style.overflow = 'unset';
//       window.removeEventListener('keydown', handleKeyDown);
//     }
//     return () => { document.body.style.overflow = 'unset'; window.removeEventListener('keydown', handleKeyDown); };
//   }, [isMenuOpen]);

//   useEffect(() => setIsMenuOpen(false), [pathname]);

//   // --- Spatial / VisionOS Animations ---
//   const spatialWindowVariant = {
//     hidden: { opacity: 0, scale: 0.9, y: -40, filter: "blur(20px)" },
//     show: { 
//       opacity: 1, 
//       scale: 1, 
//       y: 0,
//       filter: "blur(0px)",
//       transition: { duration: 0.7, type: "spring", bounce: 0.25, transformOrigin: "top center" } 
//     },
//     exit: { 
//       opacity: 0, 
//       scale: 0.95, 
//       y: -20,
//       filter: "blur(15px)",
//       transition: { duration: 0.4, ease: "easeOut" } 
//     }
//   };

//   const staggerContainer = {
//     hidden: { opacity: 0 },
//     show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
//   };

//   const slideUpItem = {
//     hidden: { y: 20, opacity: 0, scale: 0.95 },
//     show: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", bounce: 0.4 } },
//   };

//   const links = [
//     { name: 'Home', path: '/' },
//     { name: 'Projects', path: '/projects' },
//     { name: 'About Us', path: '/about-us' },
//     { name: 'Media', path: '/media' },
//     { name: 'Testimonials', path: '/testimonials' },
//     { name: 'Blogs', path: '/blogs-listing' },
//     { name: 'NRI Corner', path: '/nri-corner' },
//     { name: 'Careers', path: '/careers' },
//     { name: 'Contact Us', path: '/contact' },
//   ];

//   return (
//     <>
//       {/* --- THE FLOATING DOCK (Unchanged, remains the perfect pill) --- */}
//       <motion.div 
//         initial={{ y: -100 }}
//         animate={{ y: isHidden ? -120 : 0, scale: isScrolled ? 0.95 : 1 }}
//         transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
//         className="fixed top-4 md:top-6 left-0 w-full z-50 flex justify-center pointer-events-none"
//       >
//         <div className={`pointer-events-auto flex items-center justify-between transition-all duration-500 overflow-hidden shadow-2xl
//           ${isScrolled ? 'w-[90%] md:w-auto md:min-w-[500px] bg-white/70 backdrop-blur-3xl border border-white/50 rounded-full px-2 py-2' : 'w-full px-6 md:px-12 py-2 bg-transparent border-transparent'}
//         `}>
//           <button onClick={() => setIsMenuOpen(true)} className={`flex items-center gap-3 rounded-full transition-all duration-300 group ${isScrolled ? 'px-4 py-2 hover:bg-white/50' : 'px-0 hover:opacity-80'}`}>
//             <div className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center ${isScrolled ? 'bg-brand-black/5' : 'bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/40'}`}>
//               <img src="/assets/header/menu-icon.svg" alt="Menu" className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover:scale-110 ${isScrolled ? '' : 'brightness-0 invert'}`} />
//             </div>
//             <span className={`hidden md:block text-xs font-bold tracking-widest uppercase transition-colors ${isScrolled ? 'text-brand-black' : 'text-white drop-shadow-md'}`}>Menu</span>
//           </button>

//           <Link href="/" className={`transition-all duration-500 hover:scale-105 ${isScrolled ? 'mx-8' : 'absolute left-1/2 -translate-x-1/2'}`}>
//             <img src="/assets/common/Corp_Crafting_Homes_Logo_80.png" alt="Kumar Corp" className={`h-8 sm:h-10 w-auto object-contain transition-all duration-500 ${isScrolled ? 'drop-shadow-none' : 'drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] brightness-0 invert'}`} />
//           </Link>

//           <a href="tel:9595110011" className={`flex items-center gap-3 rounded-full transition-all duration-300 group ${isScrolled ? 'px-4 py-2 hover:bg-white/50' : 'px-0 hover:opacity-80'}`}>
//             <span className={`hidden md:block text-xs font-bold tracking-widest uppercase transition-colors ${isScrolled ? 'text-brand-black' : 'text-white drop-shadow-md'}`}>Call Us</span>
//             <div className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center ${isScrolled ? 'bg-brand-black/5' : 'bg-brand-orange shadow-[0_0_15px_rgba(245,130,32,0.5)] border border-brand-orange/50'}`}>
//               <img src="/assets/icons/call.svg" alt="Call" className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover:scale-110 ${isScrolled ? '' : 'brightness-0 invert'}`} />
//             </div>
//           </a>
//         </div>
//       </motion.div>

//       {/* --- VISION OS SPATIAL BENTO MENU --- */}
//       <AnimatePresence>
//         {isMenuOpen && (
//           <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0, transition: { delay: 0.4 } }}
//             className="fixed inset-0 z-[100] flex justify-center items-center p-4 sm:p-6 md:p-8"
//           >
//             {/* The Ambient Mesh Background (Replaces full image for a cleaner, OS-like feel) */}
//             <div className="absolute inset-0 z-0 bg-brand-black" onClick={() => setIsMenuOpen(false)}>
//               <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-orange/20 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse" />
//               <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-blue/20 rounded-full blur-[150px] mix-blend-screen opacity-50" />
//             </div>

//             {/* Spatial Window Overlay */}
//             <motion.div 
//               variants={spatialWindowVariant}
//               initial="hidden"
//               animate="show"
//               exit="exit"
//               className="w-full max-w-7xl h-full max-h-[90vh] relative rounded-[2rem] sm:rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.6)] border border-white/10 bg-white/5 backdrop-blur-3xl flex flex-col lg:flex-row overflow-hidden"
//             >
              
//               {/* Top Glass Reflection */}
//               <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

//               {/* Close Button */}
//               <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 sm:top-10 sm:right-10 z-[110] w-12 h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/20 hover:bg-white/30 transition-all duration-300 group cursor-pointer shadow-lg backdrop-blur-md">
//                 <img src="/assets/header/cross.png" alt="Close" className="w-4 h-4 brightness-0 invert group-hover:scale-90 transition-all" />
//               </button>

//               {/* Left Column: Hyper-Focus Navigation List */}
//               <div className="relative z-10 w-full lg:w-[55%] h-full flex flex-col p-8 sm:p-12 md:p-16 xl:p-20 justify-center">
//                 <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="text-xs sm:text-sm font-bold tracking-widest uppercase text-brand-orange mb-8 sm:mb-12">
//                   Navigation
//                 </motion.div>

//                 <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col gap-1 sm:gap-2">
//                   {links.map((link, index) => {
//                     const isHovered = hoveredLink !== null && hoveredLink !== index;
//                     return (
//                       <motion.div 
//                         key={link.path} variants={slideUpItem} className="py-1"
//                         onMouseEnter={() => setHoveredLink(index)} onMouseLeave={() => setHoveredLink(null)}
//                       >
//                         <Link href={link.path} onClick={() => setIsMenuOpen(false)} className={`group inline-block text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight transition-all duration-500 ease-out ${isHovered ? 'text-brand-cream/15 blur-[4px] scale-95' : 'text-brand-cream hover:text-brand-orange hover:translate-x-4'}`}>
//                           {link.name}
//                         </Link>
//                       </motion.div>
//                     );
//                   })}
//                 </motion.div>
//               </div>

//               {/* Right Column: The Spatial Bento Box Grid */}
//               <div className="relative z-10 hidden lg:grid w-[45%] h-full p-12 xl:p-16 grid-cols-2 grid-rows-3 gap-6">
                
//                 {/* Bento Widget 1: Featured Image (Spans 2 columns, 2 rows) */}
//                 <motion.div 
//                   initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, type: "spring" }}
//                   className="col-span-2 row-span-2 relative rounded-3xl overflow-hidden group border border-white/10 bg-white/5 shadow-inner"
//                 >
//                   <img src="/assets/header/Dustak_Web_1205-x-900.jpg" alt="Featured" className="w-full h-full object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-105 transition-all duration-700" />
//                   <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-transparent pointer-events-none" />
//                   <div className="absolute bottom-6 left-6 right-6">
//                     <p className="special-text text-3xl text-brand-cream font-medium">Crafting Homes</p>
//                     <p className="text-brand-cream/80 text-xs tracking-widest uppercase font-bold mt-1">For Generations</p>
//                   </div>
//                 </motion.div>

//                 {/* Bento Widget 2: Direct Contact Card */}
//                 <motion.div 
//                   initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, type: "spring" }}
//                   className="col-span-1 row-span-1 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md p-6 flex flex-col justify-between hover:bg-white/10 transition-colors cursor-pointer group"
//                 >
//                   <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center group-hover:bg-brand-orange transition-colors">
//                     <img src="/assets/icons/call.svg" alt="Call" className="w-4 h-4 brightness-0 invert" />
//                   </div>
//                   <div>
//                     <p className="text-xs text-brand-cream/60 uppercase tracking-widest">Connect</p>
//                     <p className="text-lg text-brand-cream font-bold mt-1">9595 1100 11</p>
//                   </div>
//                 </motion.div>

//                 {/* Bento Widget 3: Social Hub */}
//                 <motion.div 
//                   initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: "spring" }}
//                   className="col-span-1 row-span-1 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md p-6 flex flex-col justify-between"
//                 >
//                   <p className="text-xs text-brand-cream/60 uppercase tracking-widest mb-4">Follow Us</p>
//                   <div className="flex gap-4">
//                     <a href="https://instagram.com/kumarproperties" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-orange transition-colors">
//                       <img src="/assets/header/instagram.svg" alt="IG" className="w-5 h-5 brightness-0 invert" />
//                     </a>
//                     <a href="https://www.youtube.com/channel/UCSfnHQmlu8aEC64uXm9npIQ" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-orange transition-colors">
//                       <img src="/assets/header/youtube.svg" alt="YT" className="w-5 h-5 brightness-0 invert" />
//                     </a>
//                   </div>
//                 </motion.div>

//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }