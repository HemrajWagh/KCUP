"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { X, ArrowUp, Headphones } from 'lucide-react';
import { LucideIcon } from "lucide-react";


// Dynamically import Lottie to prevent SSR issues with window/browser APIs
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import swipeRightAnimation from '@/public/assets/map-json/swipeRight.json';

export default function Footer() {
  const [isShow, setIsShow] = useState(false);
  const topPosToStartShowing = 500;

  useEffect(() => {
    const checkScroll = () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      setIsShow(scrollPosition >= topPosToStartShowing);
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const gotoTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
      // Note: left: 0 omitted as modern standard scrollTo prefers implicit alignment unless horizontal layout shifting is enforced
    });
  };

  const openCommonForm = () => {
    console.log('Open Common Form');
    // Implement state handling context (e.g., useModalStore.getState().open('COMMON_FORM'))
  };

  return (
    <footer className="relative w-full overflow-hidden bg-slate-950 text-slate-300">
      
      {/* --- SVG PATTERN BACKGROUND LAYER --- */}
      <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-lighten z-0">
        {/* <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-geometric-pattern" width="200" height="400" patternUnits="userSpaceOnUse" patternTransform="scale(0.5)">
              <g fill="#f38036">
                <path d="M69.67,108.92c-1.89,2.09-2.5,2.67-5.11,5.48l-38.3-31.64-14.25,11.79H.36l25.9-21.38,43.4,35.75" />
                <path d="M69.67,124.08l-43.4-35.75-25.9,21.38h11.65l14.25-11.79,38.3,31.64c2.61-2.81,3.22-3.39,5.11-5.48" />
                <path d="M67.66,102.1l43.4,35.75,25.9-21.38h-11.65l-14.25,11.79-38.3-31.64c-2.61,2.81-3.22,3.39-5.11,5.48" />
                <path d="M69.34,144.29l-43.4-35.75L.04,129.92h11.65l14.25-11.79,38.3,31.64c2.61-2.81,3.22-3.39,5.11-5.48" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-geometric-pattern)" />
        </svg> */}
      </div>

      {/* --- MAIN INTERFACE CONTENT CONTAINER --- */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 z-10">
        
        {/* Top/Main Details Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pb-12 border-b border-slate-800">
          
          {/* Brand Presentation Section (8/12 Grid Columns) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="max-w-[280px] brightness-110">
              <img 
                src="/assets/icons/kumarCorpLogo.png" 
                alt="Kumar Corp Logo" 
                className="w-full h-auto object-contain"
              />
            </div>
            
            {/* HQ Glass Card Banner */}
            <div className="group relative rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-900/40 backdrop-blur-md shadow-2xl transition-all duration-500 hover:border-orange-500/30">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 z-10" />
              {/* <img 
                src="/assets/footer/HEADQUATERS-BANNER.jpg" 
                alt="Corporate Headquarters" 
                className="w-full h-[240px] object-cover filter contrast-125 brightness-90 transition-transform duration-700 group-hover:scale-105"
              /> */}
            </div>
          </div>

          {/* Connect & Corporate Contact Details Glass Card (4/12 Grid Columns) */}
          <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-2xl space-y-6">
            
            {/* Call To Action Lead Block */}
            <div className="pb-4 border-b border-white/5 space-y-3">
              <span className="text-xs font-semibold tracking-widest --color-brand-orange uppercase block">Looking for help?</span>
              <button 
                onClick={openCommonForm}
                className="w-full flex items-center justify-between group px-4 py-3 rounded-xl --color-brand-orange text-white font-medium shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all duration-300"
              >
                <span className="flex items-center gap-2 text-sm">
                  <Headphones className="w-4 h-4" /> Connect with an Expert
                </span>
                <span className="text-lg font-bold transform group-hover:translate-x-1 transition-transform">&rarr;</span>
              </button>
            </div>

            {/* Corporate Location Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white tracking-wide">Corporate Office</h3>
              <div className="space-y-2 text-sm leading-relaxed text-slate-300">
                <p className="text-white font-medium">2413 East Street, Pune, India</p>
                <div className="space-y-1 font-mono text-xs text-slate-400">
                  <p>P: +91 (20) 67641660 / 1661 / 1662</p>
                  <p>P: +91 (20) 30583660 / 3661 / 3662</p>
                  <p>F: +91 (20) 26353365</p>
                </div>
                
                <div className="pt-2 border-t border-white/5 space-y-1">
                  <p className="text-xs">
                    <span className="text-slate-400">Sales Enquiry:</span>{' '}
                    <a href="mailto:sales@kumarworld.com" className="--color-brand-orange hover:underline transition">sales@kumarworld.com</a>
                  </p>
                  <p className="text-xs">
                    <span className="text-slate-400">Phone:</span>{' '}
                    <a href="tel:+919595110011" className="text-white hover:--color-brand-orange transition font-medium">+91 9595 110011</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Structured Social Network Matrix + Timestamp */}
            {/* <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {[
                  // { icon: Youtube, url: "https://www.youtube.com/channel/UCSfnHQmlu8aEC64uXm9npIQ", label: "Youtube" },
                  // { icon: Instagram, url: "https://instagram.com/kumarproperties", label: "Instagram" },
                  // { icon: Facebook, url: "https://www.facebook.com/kumarpropertiespune", label: "Facebook" },
                  // { icon: Twitter, url: "https://twitter.com/Kumarproperties", label: "Twitter" },
                  // { icon: Linkedin, url: "https://www.linkedin.com/company/kumar-properties", label: "Linkedin" }
                ].map((social, idx) => (
                  <a 
                    key={idx}
                    href={social.url} 
                    target="_blank" 
                    rel="noreferrer"
                    title={social.label}
                    className="p-2 rounded-lg bg-white/[0.03] border border-white/10 text-slate-400 hover:text-orange-400 hover:bg-white/[0.08] hover:scale-105 transition-all duration-200"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
              <span className="text-xs font-mono font-bold tracking-wider text-white bg-white/10 px-2.5 py-1 rounded-md">IN 2026</span>
            </div> */}

          </div>
        </div>

        {/* --- DYNAMIC SITE LINK NAVIGATION SYSTEM --- */}
        <div className="py-10">
          <nav className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-4 gap-x-6 text-sm">
            {[
              { name: "About Us", path: "/about-us" },
              { name: "Projects", path: "/projects" },
              { name: "Testimonials", path: "/testimonials" },
              { name: "Media", path: "/media" },
              { name: "Contact Us", path: "/contact" },
              { name: "Disclaimer", path: "/disclaimer" },
              { name: "Careers", path: "/careers" },
              { name: "Policies", path: "/policies" },
              { name: "Grievance Redressal Cell", path: "/grievance" }
            ].map((link, i) => (
              <Link 
                key={i} 
                href={link.path} 
                className="flex items-center gap-2 group text-slate-400 hover:text-white transition-colors duration-200"
              >
                <span className="w-1.5 h-1.5 rounded-sm bg-orange-500/60 group-hover:--color-brand-orange transition-colors" />
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* --- REGULATORY LEGAL COMPLIANCE & ACCREDITATION FOOTNOTE --- */}
        <div className="pt-8 border-t border-slate-900 text-xs text-slate-500 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p>&copy; 2026 Kumar Corporation. All rights reserved.</p>
            <p className="font-medium text-slate-400">Powered by Kumar Properties Support</p>
          </div>
          <p className="leading-relaxed bg-slate-900/30 border border-slate-950 p-4 rounded-xl text-justify">
            All projects have been registered via MahaRERA registration and are available tracking verification metrics on the official web portal{' '}
            <a 
              href="https://maharera.maharashtra.gov.in" 
              target="_blank" 
              rel="noreferrer"
              className="text-orange-500/80 hover:--color-brand-orange transition underline decoration-dotted"
            >
              https://maharera.maharashtra.gov.in
            </a>{' '}
            under validation logs of currently active registered real estate ventures.
          </p>
        </div>

      </div>

      {/* --- SCROLL-TO-TOP FLOATING LOTTIE COMPONENT TRIGGER --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
        {isShow && (
          <button 
            onClick={gotoTop} 
            className="group flex h-12 w-12 items-center justify-center rounded-full --color-brand-orange text-white shadow-xl hover:bg-orange-600 active:scale-95 transition-all duration-300"
            title="Scroll to top"
          >
            {/* Lottie Animation Context Container Fallback Wrapper */}
            <div className="w-6 h-6 flex items-center justify-center overflow-hidden">
              {swipeRightAnimation ? (
                <Lottie animationData={swipeRightAnimation} loop={true} className="rotate-[270deg]" />
              ) : (
                <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              )}
            </div>
          </button>
        )}
      </div>

    </footer>);
}