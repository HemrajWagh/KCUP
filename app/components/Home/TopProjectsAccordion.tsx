'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowUpRight, MapPin, Building2 } from 'lucide-react';
import { ApiService } from '@/app/services/api';

// ==========================================
// 1. API SERVICE (Mocked for your structure)
// ==========================================
const mockFetchFromApi = async (endpoint: string) => {
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock API Response matching a realistic database structure
  return [
    { id: '1', slug: 'parc-reserve', title: 'The Parc Reserve', sub_title: 'Biophilic Living', city: 'Pune', location_name: 'Kalyani Nagar', property_type: 'RESIDENTIAL', status: 'Ongoing', min_price: '₹4.5 Cr', area: '2,800 sq.ft', images: ['https://images.unsplash.com/photo-1600607687931-cebf004f560a?auto=format&fit=crop&q=80&w=1600'] },
    { id: '2', slug: 'opus-business', title: 'Opus Business Park', sub_title: 'Grade-A Workspaces', city: 'Pune', location_name: 'Kharadi', property_type: 'COMMERCIAL', status: 'Ready', min_price: '₹12.0 Cr', area: '5,000 sq.ft', images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600'] },
    { id: '3', slug: 'aether-residences', title: 'Aether Residences', sub_title: 'Skyline Architecture', city: 'Pune', location_name: 'Baner', property_type: 'RESIDENTIAL', status: 'Pre-Launch', min_price: '₹2.8 Cr', area: '1,200 sq.ft', images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1600'] },
    { id: '4', slug: 'pune-icon', title: 'Kumar Icon', sub_title: 'Urban Retail', city: 'Pune', location_name: 'Camp', property_type: 'COMMERCIAL', status: 'Ready', min_price: '₹9.0 Cr', area: '3,500 sq.ft', images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1600'] },
    { id: '5', slug: 'vista-heights', title: 'Vista Heights', sub_title: 'Panoramic City Views', city: 'Pune', location_name: 'Viman Nagar', property_type: 'RESIDENTIAL', status: 'Ongoing', min_price: '₹3.5 Cr', area: '1,800 sq.ft', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600'] },
    
    { id: '6', slug: 'blr-summit', title: 'The Summit BLR', sub_title: 'Tech-Park Adjacent', city: 'Bengaluru', location_name: 'Whitefield', property_type: 'COMMERCIAL', status: 'Ongoing', min_price: '₹15.0 Cr', area: '10,000 sq.ft', images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600'] },
    { id: '7', slug: 'blr-gardens', title: 'Botanica Gardens', sub_title: 'Eco-Luxury Villas', city: 'Bengaluru', location_name: 'Indiranagar', property_type: 'RESIDENTIAL', status: 'Pre-Launch', min_price: '₹8.5 Cr', area: '4,500 sq.ft', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600'] },
    { id: '8', slug: 'blr-edge', title: 'The Edge', sub_title: 'Smart Apartments', city: 'Bengaluru', location_name: 'Koramangala', property_type: 'RESIDENTIAL', status: 'Ready', min_price: '₹3.2 Cr', area: '1,500 sq.ft', images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1600'] }
  ];
};

// export const ApiService = {
//   getTrendingProjects: async () => {
//     // In production, this uses your actual fetch logic
//     // return fetchFromApi('app/trending/apartment');
//     return mockFetchFromApi('app/trending/apartment');
//   }
// };



// ==========================================
// 2. MAIN COMPONENT
// ==========================================
type City = 'Pune' | 'Bengaluru';

export default function TopProjectsAccordion() {
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [activeCity, setActiveCity] = useState<City>('Pune');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const pageRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//   if (initialTrendingProjects.length === 0) {
//     ApiService.getTrendingProjects()
//       .then((res: any) => {
//         if (res) {
//           // ✅ FIX: Extract the deep array before passing it into your frontend state engine
//           const cleanArray = Array.isArray(res.apartments) ? res.apartments : (res.data?.apartments || []);
//           setTrendingProjects(cleanArray);
//         }
//       })
//       .catch((err) => console.error("Client API Fetch Err:", err));
//   }
// }, [initialTrendingProjects]);

  // 1. Fetch API Data on Mount
  // useEffect(() => {
  //   const fetchHomeProjects = async () => {
  //     try {
  //       setIsLoading(true);
  //       const data: any = await ApiService.getTrendingProjects();
  //       setAllProjects(data || []);
  //       console.log("Fetched Trending Projects:", data);
  //     } catch (error) {
  //       console.error("Failed to fetch trending projects", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchHomeProjects();
  // }, []);

  // 1. Fetch API Data on Mount
  useEffect(() => {
    const fetchHomeProjects = async () => {
      try {
        setIsLoading(true);
        const res: any = await ApiService.getTrendingProjects();
        
        // Extract the actual array depending on your API's JSON structure
        const projectsArray = Array.isArray(res) 
          ? res 
          : (res?.apartments || res?.data?.apartments || res?.data || []);
          
        setAllProjects(projectsArray);
        console.log("Fetched Trending Projects:", projectsArray);
      } catch (error) {
        console.error("Failed to fetch trending projects", error);
        setAllProjects([]); // Fallback to empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomeProjects();
  }, []);

  // 2. Filter by City & Limit to Top 5
  const displayProjects = useMemo(() => {
    const safeProjects = allProjects || [];
    
    const filtered = safeProjects
      .filter((p: any) => {
        // Fallback to true if city is missing just to see if data renders!
        if (!p.city_name) return false; 
        return p.city_name.toLowerCase() === activeCity.toLowerCase();
      })
      .slice(0, 5); // STRICTLY TOP 5

    // 🔴 DEBUG LOG: Check this in your browser console!
    console.log("Filtered Display Projects:", filtered); 

    return filtered;
  }, [allProjects, activeCity]);

  // 2. Filter by City & Limit to Top 5
  // const displayProjects = useMemo(() => {
  //   return allProjects
  //     .filter((p: any) => p.city === activeCity)
  //     .slice(0, 5); // STRICTLY TOP 5
  // }, [allProjects, activeCity]);

  // 3. Reset Hover & Trigger GSAP Animations when data/city changes
  useEffect(() => {
    setHoveredIndex(0); // Default open first card
    
    // Check if we have data AND the DOM is likely ready
    if (!isLoading && displayProjects.length > 0) {
      
      // Wrap in a tiny timeout to guarantee React has painted the mapped elements to the DOM
      const timer = setTimeout(() => {
        const ctx = gsap.context(() => {
          // Header Text Reveal
          gsap.fromTo('.anim-reveal', 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: 'expo.out', clearProps: 'all' }
          );
          
          // Accordion Panel Staggered Reveal
          gsap.fromTo('.accordion-panel',
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: 'power3.out', delay: 0.2, clearProps: 'all' }
          );
        }, pageRef);
        
        return () => ctx.revert();
      }, 50); // 50ms buffer for DOM paint

      return () => clearTimeout(timer);
    }
  }, [isLoading, activeCity, displayProjects]);

  // 3. Reset Hover & Trigger GSAP Animations when data/city changes
  // useEffect(() => {
  //   setHoveredIndex(0); // Default open first card
    
  //   if (!isLoading && displayProjects.length > 0) {
  //     const ctx = gsap.context(() => {
  //       // Header Text Reveal
  //       gsap.fromTo('.anim-reveal', 
  //         { y: 30, opacity: 0 },
  //         { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: 'expo.out', clearProps: 'all' }
  //       );
        
  //       // Accordion Panel Staggered Reveal
  //       gsap.fromTo('.accordion-panel',
  //         { x: 100, opacity: 0 },
  //         { x: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: 'power3.out', delay: 0.2, clearProps: 'all' }
  //       );
  //     }, pageRef);
  //     return () => ctx.revert();
  //   }
  // }, [isLoading, activeCity]);

  return (
    <div ref={pageRef} className="h-[90vh] md:h-screen w-full bg-[#faf6f0] text-black overflow-hidden flex flex-col selection:bg-[#00A79D] selection:text-white">
      
      {/* --- HEADER & CITY TOGGLE --- */}
      <header className="px-6 md:px-12 pt-12 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 z-20 shrink-0">
        <div>
          <h1 className="anim-reveal text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
            Top <span className="text-[#F58220]">Five.</span>
          </h1>
          <p className="anim-reveal text-lg font-special italic text-gray-500 mt-2">
            The most sought-after spaces in {activeCity}.
          </p>
        </div>

        {/* City Toggle Dock */}
        <div className="anim-reveal flex bg-white/50 backdrop-blur-md p-1.5 rounded-full border border-gray-200 shadow-sm">
          {(['Pune', 'Bengaluru'] as City[]).map(city => (
            <button 
              key={city}
              onClick={() => setActiveCity(city)}
              className={`px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-all duration-500 ${activeCity === city ? 'bg-[#0061AF] text-white shadow-md' : 'text-gray-500 hover:text-black hover:bg-white/50'}`}
            >
              {city}
            </button>
          ))}
        </div>
      </header>

     {/* --- THE SPATIAL ACCORDION GALLERY --- */}
      <main className="flex-1 w-full px-6 md:px-12 pb-12 flex items-center justify-center overflow-hidden">
        
        {isLoading ? (
          // Loading Skeleton
          <div className="flex gap-4 w-full h-full max-h-[75vh] animate-pulse">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`h-full rounded-[2rem] bg-gray-200 ${i === 1 ? 'w-[50vw]' : 'w-[10vw]'}`}></div>
            ))}
          </div>
        ) : displayProjects.length === 0 ? (
          // ✅ FIX: Elegant Fallback for Empty Cities
          <div className="anim-reveal w-full h-full max-h-[75vh] flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm rounded-[2rem] border border-gray-200 border-dashed">
            <h3 className="text-3xl md:text-4xl font-black text-gray-400 mb-2 uppercase tracking-tight">Coming Soon</h3>
            <p className="text-lg font-special italic text-gray-500 mb-6">We are curating exclusive spaces in {activeCity}.</p>
            <button 
              onClick={() => setActiveCity('Pune')}
              className="px-8 py-3 bg-black text-white rounded-full text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#F58220] transition-colors duration-300"
            >
              Explore Pune Instead
            </button>
          </div>
        ) : (
          // The Actual Accordion Gallery
          <div className="w-full h-full max-h-[75vh] flex gap-4 overflow-x-auto snap-x snap-mandatory md:overflow-hidden hide-scrollbar">
            
            {displayProjects.map((project: any, index: number) => {
              const isHovered = hoveredIndex === index;
              const num = (index + 1).toString().padStart(2, '0');

              return (
                <div 
                  key={project._id}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`accordion-panel group relative h-full flex-shrink-0 snap-center rounded-[2rem] overflow-hidden cursor-pointer bg-gray-900 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                    w-[85vw] md:w-[12vw] ${isHovered ? 'md:!w-[55vw]' : 'md:hover:w-[16vw]'}
                  `}
                >
                  
                  <Image 
  // ✅ FIX: Mapped to title_image instead of images
  src={project.title_image?.[0] || 'https://images.unsplash.com/photo-1600607687931-cebf004f560a?auto=format&fit=crop&q=80'} 
  alt={project.title} // Great for your real estate SEO strategy
  fill
  className={`object-cover transition-transform duration-[2s] ease-out ${isHovered ? 'scale-105' : 'scale-100 grayscale-[30%]'}`}
  sizes="(max-width: 768px) 100vw, 50vw"
  priority={index === 0}
/>
                  
                  <div className={`absolute inset-0 transition-opacity duration-700 ${isHovered ? 'bg-gradient-to-t from-black/90 via-black/20 to-transparent' : 'bg-black/50'}`}></div>

                  {/* COLLAPSED STATE (Vertical Text) */}
                  <div className={`absolute inset-0 p-6 flex flex-col justify-end transition-opacity duration-500 hidden md:flex ${isHovered ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <span className="text-3xl font-black text-white/50 mb-4">{num}</span>
                    <h2 className="text-xl font-bold text-white whitespace-nowrap transform -rotate-180 tracking-wide" style={{ writingMode: 'vertical-rl' }}>
                      {project.title}
                    </h2>
                  </div>

                  {/* EXPANDED STATE (Cinematic View) */}
                  <div className={`absolute inset-0 p-8 md:p-12 flex flex-col justify-between transition-opacity duration-[800ms] delay-100 ${isHovered ? 'opacity-100' : 'md:opacity-0 md:pointer-events-none'}`}>
                    
                    <div className="flex justify-between items-start text-white w-full">
                      <span className="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
                        {project.status}
                      </span>
                      <span className="text-6xl md:text-8xl font-black text-white/20 leading-none">{num}</span>
                    </div>

                    <div className="w-full flex flex-col md:flex-row justify-between items-end gap-8">
                      
                      {/* Left: Title & Meta */}
                      <div className="text-white flex-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-700 delay-100">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-2 leading-tight">{project.title}</h2>
                        <p className="text-xl md:text-2xl font-special italic text-[#F58220] mb-8">{project.sub_title}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium tracking-wide">
                          <span className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"><MapPin size={16} className="text-[#00A79D]" /> {project.location_name}</span>
                          <span className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"><Building2 size={16} className="text-[#00A79D]" /> {project.area}</span>
                        </div>
                      </div>

                      {/* Right: CTA */}
                      <div className="w-full md:w-auto text-left md:text-right border-t md:border-t-0 md:border-l border-white/20 pt-6 md:pt-0 md:pl-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-700 delay-150">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Starting At</p>
                        <p className="text-4xl font-black text-white mb-6">{project.min_price}</p>
                        
                        <Link 
                          href={`/project/${project.slug}`}
                          className="inline-flex items-center justify-center gap-3 w-full md:w-auto bg-[#0061AF] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-[#F58220] hover:scale-105 transition-all duration-300"
                        >
                          Explore <ArrowUpRight size={20} />
                        </Link>
                      </div>

                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Global CSS required to hide scrollbars on the mobile horizontal track */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}