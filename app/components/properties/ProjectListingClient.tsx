'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { Search, SlidersHorizontal, X, MapPin, Building, ArrowUpRight, ChevronDown } from 'lucide-react';

// ==========================================
// 1. CRASH-PROOF API SERVICE
// ==========================================
// ==========================================
// 1. CRASH-PROOF API SERVICE
// ==========================================
const safeFetch = async (url: string) => {
  try {
    const res = await fetch(url);
    const contentType = res.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    } else {
      const textResponse = await res.text();
      console.error(`❌ API Error on ${url}: Expected JSON, received HTML.`, textResponse.substring(0, 100) + '...');
      return { data: [] }; 
    }
  } catch (error) {
    console.error(`❌ Network Error on ${url}:`, error);
    return { data: [] };
  }
};

const ApiService = {
  getProjects: async (params: any = {}) => {
    const queryString = new URLSearchParams(params).toString();
    // Connects to: ApartmentRouter.get('/')
    return safeFetch(`/api-proxy/app/apartment?${queryString}`); 
  },
  getCities: async () => {
    // Connects to: ApartmentRouter.get('/apt_cities')
    return safeFetch('/api-proxy/app/apartment/apt_cities');
  },
  getLocations: async (cityId: string) => {
    // Connects to: ApartmentRouter.get('/apt_locations')
    return safeFetch(`/api-proxy/app/apartment/apt_locations?city_id=${cityId}`);
  },
  getAptTypes: async (params: any) => {
    const queryString = new URLSearchParams(params).toString();
    // Connects to: ApartmentRouter.get('/apt_types')
    return safeFetch(`/api-proxy/app/apartment/apt_types?${queryString}`);
  }
};

// --- Types ---
type PropertyType = 'RESIDENTIAL' | 'COMMERCIAL';
type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'newest';

// ==========================================
// 2. LUXURY CUSTOM DROPDOWN COMPONENT
// ==========================================
function CustomSelect({ value, options, onChange, placeholder, disabled, className = "" }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt: any) => opt.value === value);

  return (
    <div ref={ref} className={`relative w-full ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)} 
        className="w-full flex justify-between items-center py-5 pl-6 pr-5 cursor-pointer rounded-[1.5rem] bg-gray-50/50 hover:bg-white transition-colors"
      >
        <span className="font-bold text-brand-black truncate select-none">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-orange' : ''}`} />
      </div>

      <div 
        className={`absolute top-[calc(100%+8px)] left-0 right-0 bg-white/95 backdrop-blur-2xl border border-white/50 rounded-[1.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-300 origin-top z-[60] ${
          isOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="max-h-[280px] overflow-y-auto hide-scrollbar py-3">
          <div 
            onClick={() => { onChange(''); setIsOpen(false); }} 
            className="px-6 py-3 cursor-pointer font-bold text-muted-foreground hover:bg-gray-50 hover:text-brand-black transition-colors select-none"
          >
            {placeholder}
          </div>
          {options.map((opt: any) => (
            <div 
              key={opt.value} 
              onClick={() => { onChange(opt.value); setIsOpen(false); }} 
              className={`px-6 py-3 cursor-pointer font-bold transition-all select-none ${
                value === opt.value 
                  ? 'bg-brand-blue text-brand-cream' 
                  : 'text-brand-black hover:bg-brand-orange/10 hover:text-brand-orange hover:pl-8'
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. MAIN COMPONENT
// ==========================================
export default function ProjectListingClient() {
  const [activeTab, setActiveTab] = useState<PropertyType>('RESIDENTIAL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data States
  const [fetchedProjects, setFetchedProjects] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [aptTypes, setAptTypes] = useState<string[]>([]);
  
  const [filters, setFilters] = useState({ cityId: '', locationId: '', aptType: '', status: '' });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const mainRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

  // --- Core API Execution ---
  const executeSearch = async (currentFilters = filters, tab = activeTab) => {
    setIsLoading(true);
    try {
      const res = await ApiService.getProjects({
        city_id: currentFilters.cityId,
        location_id: currentFilters.locationId,
        apt_type: currentFilters.aptType,
        status: currentFilters.status,
        property_type: tab
      });
      
      // CRITICAL FIX: Bulletproof Array Check to prevent .map errors
      let results = [];
      if (Array.isArray(res)) {
        results = res;
      } else if (res && Array.isArray(res.data)) {
        results = res.data;
      }

      setFetchedProjects(results);
    } catch (error) {
      console.error("Search failed", error);
      setFetchedProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Initial Load ---
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [projectsRes, citiesRes] = await Promise.all([
          ApiService.getProjects({ property_type: 'RESIDENTIAL' }),
          ApiService.getCities()
        ]);
        
        let initialProjects = Array.isArray(projectsRes) ? projectsRes : (projectsRes?.data || []);
        
        const sortedProjects = initialProjects.sort((a: any, b: any) => {
          if (a.status === 'Ongoing' && b.status !== 'Ongoing') return -1;
          if (a.status !== 'Ongoing' && b.status === 'Ongoing') return 1;
          return 0;
        });

        setFetchedProjects(sortedProjects);
        setCities(Array.isArray(citiesRes) ? citiesRes : (citiesRes?.data?.cities || citiesRes?.cities || []));
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // --- Handlers (Auto-Fetch on Change) ---
  const handleCityChange = async (cityId: string) => {
    const newFilters = { ...filters, cityId, locationId: '', aptType: '' };
    setFilters(newFilters);
    setLocations([]);
    setAptTypes([]);
    
    executeSearch(newFilters, activeTab); // Auto-update grid
    
    if (cityId) {
      const res = await ApiService.getLocations(cityId);
      setLocations(Array.isArray(res) ? res : (res?.data?.locations || res?.locations || []));
    }
  };

  const handleLocationChange = async (locationId: string) => {
    const newFilters = { ...filters, locationId, aptType: '' };
    setFilters(newFilters);
    setAptTypes([]);
    
    executeSearch(newFilters, activeTab); // Auto-update grid
    
    if (locationId) {
      const res = await ApiService.getAptTypes({ location_id: locationId, property_type: activeTab });
      setAptTypes(Array.isArray(res) ? res : (res?.data?.apt_type || res?.apt_type || []));
    }
  };

  const handleTabChange = (tab: PropertyType) => {
    setActiveTab(tab);
    const resetFilters = { cityId: '', locationId: '', aptType: '', status: '' };
    setFilters(resetFilters);
    setSearchQuery('');
    setLocations([]);
    setAptTypes([]);
    executeSearch(resetFilters, tab);
  };

  const handleClearFilters = () => {
    const resetFilters = { cityId: '', locationId: '', aptType: '', status: '' };
    setFilters(resetFilters);
    setSearchQuery('');
    setLocations([]);
    setAptTypes([]);
    executeSearch(resetFilters, activeTab);
  };

  // --- LIVE DYNAMIC SEARCH (Runs instantly as user types) ---
  const displayedProjects = useMemo(() => {
    if (!searchQuery.trim()) return fetchedProjects;
    
    // Split the query into individual words so they can search "Pune 2 BHK"
    const queryWords = searchQuery.toLowerCase().split(' ').filter(Boolean);
    
    return fetchedProjects.filter((project: any) => {
      // Combine all relevant fields into one searchable string
      const searchableText = `${project.title || ''} ${project.sub_title || ''} ${project.location_name || ''} ${project.locationName || ''} ${project.city_name || ''}`.toLowerCase();
      
      // Ensure EVERY word typed exists in the property data
      return queryWords.every(word => searchableText.includes(word));
    });
  }, [fetchedProjects, searchQuery]);

  // --- Animations ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-word', 
        { y: 50, opacity: 0, rotateX: -20 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out' }
      );
      gsap.fromTo('.hero-sub',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.4, ease: 'power2.out' }
      );
      gsap.fromTo('.filter-bar',
        { y: 40, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, delay: 0.6, ease: 'expo.out' }
      );
    }, mainRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!gridRef.current || displayedProjects.length === 0) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.project-card');
      gsap.fromTo(cards,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', clearProps: 'all' }
      );
    }, gridRef);
    return () => ctx.revert();
  }, [displayedProjects]);

  const formatPrice = (price: number | string | null | undefined): string => {
  // 1. Check for missing values
  if (price === null || price === undefined || price === '') {
    return 'Price on Request';
  }

  let numPrice = price;

  // 2. Stricter parsing for strings
  if (typeof price === 'string') {
    // Strip commas just in case the API sends pre-formatted numbers like "1,50,00,000"
    const cleanString = price.replace(/,/g, '').trim();
    
    // Number() returns NaN for "3 BHK...", whereas parseFloat() would incorrectly return 3
    numPrice = Number(cleanString);
  }

  // 3. Handle the NaN result from text strings
  if (typeof numPrice === 'number' && isNaN(numPrice)) {
    // Option A: Return the original string (e.g., "3 BHK Contact Us For Pricing")
    return String(price); 
    
    // Option B: Standardize all text to your default fallback
    // return 'Price on Request'; 
  }

  // 4. Format the valid number
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numPrice as number);
};

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const cityOptions = cities.map(c => ({ value: c.city_id, label: c.name }));
  const locationOptions = locations.map(l => ({ value: l.location_id, label: l.name }));
  const aptOptions = aptTypes.map(t => ({ value: t, label: t }));
  const statusOptions = [
    { value: 'Ongoing', label: 'Ongoing' },
    { value: 'New', label: 'New Launch' },
    { value: 'Sold', label: 'Sold' },
  ];

  return (
    <div ref={mainRef} className="min-h-screen bg-[var(--color-brand-cream)] selection:bg-brand-orange selection:text-white pb-32">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden flex flex-col items-center text-center">
        <div ref={heroTextRef} className="max-w-5xl mx-auto z-10">
          <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-black text-brand-black tracking-tighter leading-[0.9] mb-8 flex flex-wrap justify-center gap-x-6">
            <span className="hero-word">Curating</span>
            <span className="hero-word special-text text-brand-orange font-light tracking-tight">Exceptional</span>
            <span className="hero-word">Spaces.</span>
          </h1>
          <p className="hero-sub text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium tracking-wide">
            Discover architectural masterpieces tailored for your lifestyle and business aspirations.
          </p>
        </div>

        <div className="hero-sub mt-12 bg-white/60 backdrop-blur-xl p-2 rounded-full inline-flex border border-gray-200 shadow-sm relative z-10">
          <button
            onClick={() => handleTabChange('RESIDENTIAL')}
            className={`relative px-10 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-bold transition-all duration-500 ${activeTab === 'RESIDENTIAL' ? 'text-brand-cream shadow-lg' : 'text-muted-foreground hover:text-brand-black'}`}
          >
            {activeTab === 'RESIDENTIAL' && <span className="absolute inset-0 bg-brand-black rounded-full -z-10" />}
            Residential
          </button>
          <button
            onClick={() => handleTabChange('COMMERCIAL')}
            className={`relative px-10 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-bold transition-all duration-500 ${activeTab === 'COMMERCIAL' ? 'text-brand-cream shadow-lg' : 'text-muted-foreground hover:text-brand-black'}`}
          >
            {activeTab === 'COMMERCIAL' && <span className="absolute inset-0 bg-brand-black rounded-full -z-10" />}
            Commercial
          </button>
        </div>
      </section>

      {/* --- ADVANCED FILTER BAR --- */}
      <section className="container mx-auto px-4 md:px-8 relative z-[50] filter-bar mb-16">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_40px_rgb(0,0,0,0.04)] border border-white p-3 flex flex-col xl:flex-row gap-3 items-center transition-all">
          
          {/* Dynamic Live Search Input */}
          <div className="relative w-full xl:w-[30%] group bg-gray-50/50 rounded-[1.5rem] overflow-hidden hover:bg-white transition-colors">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand-blue transition-colors h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search properties, locations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-transparent focus:ring-0 outline-none transition-all font-bold text-brand-black placeholder:text-muted-foreground placeholder:font-medium"
            />
          </div>

          <div className="hidden xl:flex flex-1 items-center gap-3 w-full">
            <CustomSelect 
              value={filters.cityId} 
              onChange={handleCityChange} 
              options={cityOptions} 
              placeholder="All Cities" 
            />

            <CustomSelect 
              value={filters.locationId} 
              onChange={handleLocationChange} 
              options={locationOptions} 
              placeholder="Locations" 
              disabled={!filters.cityId}
            />

            {activeTab === 'RESIDENTIAL' && (
              <CustomSelect 
                value={filters.aptType} 
                onChange={(val: string) => {
                  const newFilters = {...filters, aptType: val};
                  setFilters(newFilters);
                  executeSearch(newFilters, activeTab);
                }} 
                options={aptOptions} 
                placeholder="Config" 
                disabled={aptOptions.length === 0}
              />
            )}

            <CustomSelect 
              value={filters.status} 
              onChange={(val: string) => {
                const newFilters = {...filters, status: val};
                setFilters(newFilters);
                executeSearch(newFilters, activeTab);
              }} 
              options={statusOptions} 
              placeholder="Status" 
            />
            
            {(activeFilterCount > 0 || searchQuery) && (
              <button onClick={handleClearFilters} className="p-4 text-muted-foreground hover:text-destructive transition-colors tooltip bg-gray-50 hover:bg-destructive/10 rounded-full" title="Clear Filters">
                <X className="h-5 w-5" />
              </button>
            )}
            
            {/* The "Search" button is removed since filtering is entirely dynamic and automatic now! */}
          </div>

          <button 
            className="xl:hidden w-full py-5 bg-brand-black text-brand-cream rounded-[1.5rem] flex items-center justify-center gap-3 font-bold text-sm tracking-widest uppercase"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <SlidersHorizontal className="h-5 w-5" />
            Filters {(activeFilterCount > 0 || searchQuery) && `(${activeFilterCount + (searchQuery ? 1 : 0)})`}
          </button>
        </div>
      </section>

      {/* --- MAIN CINEMATIC GRID --- */}
      <section className="container mx-auto px-4 md:px-8 mt-12 min-h-[50vh] relative z-10">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-brand-blue rounded-full animate-spin"></div>
          </div>
        ) : displayedProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Search className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-3xl font-black mb-2 text-brand-black">No spaces found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">We couldn&apos;t find any properties matching your exact criteria.</p>
            <button onClick={handleClearFilters} className="px-8 py-4 bg-brand-black text-white font-bold tracking-widest uppercase text-sm rounded-full hover:bg-brand-orange transition-colors">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" ref={gridRef}>
            {displayedProjects.map((project: any) => (
              <Link 
                // href={`/${activeTab.toLowerCase()}-project/${project.slug}`} 
                href={`/properties/${project.slug}`} 
                key={project.id || project.slug}
                className="project-card group relative block h-[400px] md:h-[480px] lg:h-[520px] w-full rounded-[2rem] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-700"
              >
                <Image 
                  src={project.title_image?.[0] || 'https://images.unsplash.com/photo-1600607687931-cebf004f560a?auto=format&fit=crop&q=80'} 
                  alt={project.title || 'Project'}
                  fill
                  loading="eager" 
                  className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/30 opacity-80 group-hover:opacity-95 transition-opacity duration-700 z-10"></div>
                
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                  <div className={`px-4 py-2 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white border border-white/20 ${
                      project.status === 'Ongoing' ? 'bg-brand-blue/60' : 
                      project.status === 'Ready' || project.status === 'Ready to Move' ? 'bg-brand-teal/60' : 
                      project.status === 'Sold' ? 'bg-destructive/60' : 'bg-brand-orange/60'
                    }`}>
                    {project.status || 'New'}
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 group-hover:bg-brand-orange group-hover:border-brand-orange transition-all duration-500">
                    <ArrowUpRight size={18} />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 z-20 flex flex-col justify-end h-full">
                  <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    
                    <h3 className="text-2xl lg:text-3xl font-black text-brand-cream mb-1.5 leading-tight drop-shadow-md line-clamp-1">
                      {project.title}
                    </h3>
                    
                    <p className="special-text italic text-brand-cream/80 text-lg lg:text-xl mb-5 line-clamp-1 drop-shadow-md">
                      {project.sub_title}
                    </p>
                    
                    <div className="flex flex-wrap gap-2.5 mb-5">
                      <span className="px-3.5 py-2 bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-full text-[10px] lg:text-[11px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-brand-orange" /> 
                        <span className="truncate max-w-[120px]">{project.location_name || project.locationName || 'Pune'}</span>
                      </span>
                      {project.aptTypes?.slice(0, 1).map((apt: string) => (
                        <span key={apt} className="px-3.5 py-2 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-full text-[10px] lg:text-[11px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                          <Building className="h-3 w-3" /> {apt}
                        </span>
                      ))}
                    </div>
                    
                    <div className="pt-5 border-t border-white/20 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                      <div>
                        <p className="text-[9px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Starting From</p>
                        <p className="text-xl lg:text-2xl font-black text-brand-cream">{formatPrice(project.tags?.[0] || project.min_price)}</p>
                      </div>
                      <span className="text-[10px] lg:text-xs font-bold text-brand-orange uppercase tracking-widest flex items-center gap-1.5">
                        Explore
                      </span>
                    </div>

                  </div>
                </div>

              </Link>
            ))}
          </div>
        )}
      </section>

      {/* --- MOBILE FILTER DRAWER --- */}
      <div className={`fixed inset-0 z-[100] pointer-events-none ${isMobileFilterOpen ? 'pointer-events-auto' : ''}`}>
        <div 
          className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-500 ${isMobileFilterOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileFilterOpen(false)}
        />
        
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white text-brand-black shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-8 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-2xl font-black uppercase tracking-tighter">Refine Search</h3>
            <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 hover:rotate-90 transition-transform">
              <X size={24} />
            </button>
          </div>

          <div className="p-8 flex-1 overflow-y-auto space-y-8">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">City</label>
              <CustomSelect value={filters.cityId} onChange={handleCityChange} options={cityOptions} placeholder="All Cities" className="bg-gray-50 rounded-[1.5rem]" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Location</label>
              <CustomSelect value={filters.locationId} onChange={handleLocationChange} options={locationOptions} placeholder="Locations" disabled={!filters.cityId} className="bg-gray-50 rounded-[1.5rem]" />
            </div>

            {activeTab === 'RESIDENTIAL' && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Configuration</label>
                <CustomSelect 
                  value={filters.aptType} 
                  onChange={(val: string) => {
                    const newFilters = {...filters, aptType: val};
                    setFilters(newFilters);
                    executeSearch(newFilters, activeTab);
                  }} 
                  options={aptOptions} 
                  placeholder="Config" 
                  disabled={aptOptions.length === 0} 
                  className="bg-gray-50 rounded-[1.5rem]" 
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</label>
              <CustomSelect 
                value={filters.status} 
                onChange={(val: string) => {
                  const newFilters = {...filters, status: val};
                  setFilters(newFilters);
                  executeSearch(newFilters, activeTab);
                }} 
                options={statusOptions} 
                placeholder="Status" 
                className="bg-gray-50 rounded-[1.5rem]" 
              />
            </div>
          </div>

          <div className="p-8 bg-white border-t border-gray-200 flex gap-4">
            <button onClick={handleClearFilters} className="flex-1 py-4 font-bold text-muted-foreground hover:text-brand-black">Clear</button>
            <button onClick={() => setIsMobileFilterOpen(false)} className="flex-[2] py-4 bg-brand-black text-brand-cream rounded-full font-bold uppercase tracking-widest hover:bg-brand-orange transition-colors">Apply Filters</button>
          </div>
        </div>
      </div>

    </div>
  );
}

      {/* <section className="container mx-auto px-4 md:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0061AF] rounded-full animate-spin"></div>
          </div>
        ) : allProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Search className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-3xl font-black mb-2 text-gray-900">No spaces found</h3>
            <p className="text-gray-500 mb-6 max-w-md">We couldn&apos;t find any properties matching your exact criteria.</p>
            <button onClick={handleClearFilters} className="px-8 py-4 bg-black text-white font-bold tracking-widest uppercase text-sm rounded-full hover:bg-[#F58220] transition-colors">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" ref={gridRef}>
            {allProjects.map((project: any) => (
              <Link 
                href={`/${activeTab.toLowerCase()}-project/${project.slug}`} 
                key={project.id || project.slug}
                className="project-card group relative block w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-shadow duration-700"
              >
                <Image 
                  src={project.title_image?.[0] || 'https://images.unsplash.com/photo-1600607687931-cebf004f560a?auto=format&fit=crop&q=80'} 
                  alt={project.title || 'Project'}
                  fill
                  loading="eager" 
                  className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700 z-10"></div>
                
                <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
                  <div className={`px-4 py-2 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-white border border-white/20 ${
                      project.status === 'Ongoing' ? 'bg-[#0061AF]/70' : 
                      project.status === 'Ready' || project.status === 'Ready to Move' ? 'bg-[#00A79D]/70' : 
                      project.status === 'Sold' ? 'bg-red-600/70' : 'bg-[#F58220]/70'
                    }`}>
                    {project.status || 'New'}
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:bg-[#F58220] group-hover:border-[#F58220] transition-all duration-500">
                    <ArrowUpRight size={18} />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col justify-end h-full">
                  <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    
                    <h3 className="text-2xl lg:text-3xl font-black text-white mb-1.5 leading-tight drop-shadow-md line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 font-special italic text-lg mb-4 line-clamp-1 drop-shadow-md">
                      {project.sub_title}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-[#F58220]" /> {project.location_name || project.locationName || 'Pune'}
                      </span>
                      {project.aptTypes?.slice(0, 1).map((apt: string) => (
                        <span key={apt} className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                          <Building className="h-3 w-3" /> {apt}
                        </span>
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t border-white/20 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                      <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Starting From</p>
                        <p className="text-xl font-black text-white">{formatPrice(project.tags?.[0] || project.min_price)}</p>
                      </div>
                      <span className="text-[10px] font-bold text-[#F58220] uppercase tracking-[0.15em] flex items-center gap-1.5">
                        Explore
                      </span>
                    </div>

                  </div>
                </div>

              </Link>
            ))}
          </div>
        )}
      </section>       */}

      {/* --- MAIN CINEMATIC GRID --- */}
      {/* <section className="container mx-auto px-4 md:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0061AF] rounded-full animate-spin"></div>
          </div>
        ) : allProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Search className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-3xl font-black mb-2 text-gray-900">No spaces found</h3>
            <p className="text-gray-500 mb-6 max-w-md">We couldn&apos;t find any properties matching your exact criteria.</p>
            <button onClick={handleClearFilters} className="px-8 py-4 bg-black text-white font-bold tracking-widest uppercase text-sm rounded-full hover:bg-[#F58220] transition-colors">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10" ref={gridRef}>
            {allProjects.map((project: any) => (
              <Link 
                href={`/${activeTab.toLowerCase()}-project/${project.slug}`} 
                key={project.id || project.slug}
                // THE SHAPE CHANGER: Replace `h-[450px]` with `aspect-[4/3]` (Landscape) or `aspect-square` (Square)
                className="project-card group relative block w-full aspect-[4/3] rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-shadow duration-700"
              >
                <Image 
                  src={project.title_image?.[0] || 'https://images.unsplash.com/photo-1600607687931-cebf004f560a?auto=format&fit=crop&q=80'} 
                  alt={project.title || 'Project'}
                  fill
                  loading="eager" 
                  className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-700 z-10"></div>
                
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                  <div className={`px-5 py-2 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white border border-white/20 ${
                      project.status === 'Ongoing' ? 'bg-[#0061AF]/70' : 
                      project.status === 'Ready' || project.status === 'Ready to Move' ? 'bg-[#00A79D]/70' : 
                      project.status === 'Sold' ? 'bg-red-600/70' : 'bg-[#F58220]/70'
                    }`}>
                    {project.status || 'New'}
                  </div>
                  
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 group-hover:bg-[#F58220] group-hover:border-[#F58220] transition-all duration-500">
                    <ArrowUpRight size={20} />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 flex flex-col justify-end h-full">
                  <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight drop-shadow-md">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 font-special italic text-xl mb-6 line-clamp-1 drop-shadow-md">
                      {project.sub_title}
                    </p>
                    
                    <div className="flex flex-wrap gap-3 mb-6">
                      <span className="px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-[#F58220]" /> {project.location_name || project.locationName || 'Pune'}
                      </span>
                      {project.aptTypes?.slice(0, 2).map((apt: string) => (
                        <span key={apt} className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2">
                          <Building className="h-3 w-3" /> {apt}
                        </span>
                      ))}
                    </div>
                    
                    <div className="pt-6 border-t border-white/20 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Starting From</p>
                        <p className="text-2xl font-black text-white">{formatPrice(project.tags?.[0] || project.min_price)}</p>
                      </div>
                      <span className="text-xs font-bold text-[#F58220] uppercase tracking-widest flex items-center gap-2">
                        Explore
                      </span>
                    </div>

                  </div>
                </div>

              </Link>
            ))}
          </div>
        )}
      </section> */}

      {/* --- MAIN CINEMATIC GRID --- */}
      {/* <section className="container mx-auto px-4 md:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0061AF] rounded-full animate-spin"></div>
          </div>
        ) : allProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Search className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-3xl font-black mb-2 text-gray-900">No spaces found</h3>
            <p className="text-gray-500 mb-6 max-w-md">We couldn&apos;t find any properties matching your exact criteria.</p>
            <button onClick={handleClearFilters} className="px-8 py-4 bg-black text-white font-bold tracking-widest uppercase text-sm rounded-full hover:bg-[#F58220] transition-colors">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10" ref={gridRef}>
            {allProjects.map((project: any) => (
              <Link 
                href={`/${activeTab.toLowerCase()}-project/${project.slug}`} 
                key={project.id || project.slug}
                className="project-card group relative block h-[450px] md:h-[550px] w-full rounded-[2rem] overflow-hidden cursor-pointer"
              >
                <Image 
                  src={project.title_image?.[0] || 'https://images.unsplash.com/photo-1600607687931-cebf004f560a?auto=format&fit=crop&q=80'} 
                  alt={project.title || 'Project'}
                  fill
                  loading="eager" 
                  className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 opacity-70 group-hover:opacity-90 transition-opacity duration-700 z-10"></div>
                
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                  <div className={`px-5 py-2 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white border border-white/20 ${
                      project.status === 'Ongoing' ? 'bg-[#0061AF]/50' : 
                      project.status === 'Ready' || project.status === 'Ready to Move' ? 'bg-[#00A79D]/50' : 
                      project.status === 'Sold' ? 'bg-red-600/50' : 'bg-[#F58220]/50'
                    }`}>
                    {project.status || 'New'}
                  </div>
                  
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 group-hover:bg-[#F58220] group-hover:border-[#F58220] transition-all duration-500">
                    <ArrowUpRight size={20} />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 flex flex-col justify-end h-full">
                  <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight drop-shadow-md">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 font-special italic text-xl mb-6 line-clamp-1 drop-shadow-md">
                      {project.sub_title}
                    </p>
                    
                    <div className="flex flex-wrap gap-3 mb-6">
                      <span className="px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-[#F58220]" /> {project.location_name || project.locationName || 'Pune'}
                      </span>
                      {project.aptTypes?.slice(0, 2).map((apt: string) => (
                        <span key={apt} className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2">
                          <Building className="h-3 w-3" /> {apt}
                        </span>
                      ))}
                    </div>
                    
                    <div className="pt-6 border-t border-white/20 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Starting From</p>
                        <p className="text-2xl font-black text-white">{formatPrice(project.tags?.[0] || project.min_price)}</p>
                      </div>
                      <span className="text-xs font-bold text-[#F58220] uppercase tracking-widest flex items-center gap-2">
                        Explore
                      </span>
                    </div>

                  </div>
                </div>

              </Link>
            ))}
          </div>
        )}
      </section> */}

      {/* --- MOBILE FILTER DRAWER --- */}
      {/* ... (Your exact same mobile filter drawer code remains here untouched to save space, just paste it back!) */}
      
//     </div>
//   );
// }



// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import gsap from 'gsap';
// import { Search, SlidersHorizontal, X, MapPin, Building, ArrowRight, ChevronDown } from 'lucide-react';


// const safeFetch = async (url: string) => {
//   try {
//     const res = await fetch(url);
    
//     // Check if the response is actually JSON before parsing
//     const contentType = res.headers.get("content-type");
//     if (contentType && contentType.includes("application/json")) {
//       return await res.json();
//     } else {
//       const textResponse = await res.text();
//       console.error(`❌ API Error on ${url}: Expected JSON, received HTML.`, textResponse.substring(0, 100) + '...');
//       return { data: [] }; 
//     }
//   } catch (error) {
//     console.error(`❌ Network Error on ${url}:`, error);
//     return { data: [] };
//   }
// };

// const ApiService = {
//   getProjects: async (params: any = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     // Matches: indexRouter.use('/app/apartment') -> ApartmentRouter.get('/')
//     return safeFetch(`/api-proxy/app/apartment?${queryString}`); 
//   },
//   getCities: async () => {
//     // Matches: indexRouter.use('/app/apartment') -> ApartmentRouter.get('/apt_cities')
//     return safeFetch('/api-proxy/app/apartment/apt_cities');
//   },
//   getLocations: async (cityId: string) => {
//     // Matches: indexRouter.use('/app/apartment') -> ApartmentRouter.get('/apt_locations')
//     return safeFetch(`/api-proxy/app/apartment/apt_locations?city_id=${cityId}`);
//   },
//   getAptTypes: async (params: any) => {
//     const queryString = new URLSearchParams(params).toString();
//     // Matches: indexRouter.use('/app/apartment') -> ApartmentRouter.get('/apt_types')
//     return safeFetch(`/api-proxy/app/apartment/apt_types?${queryString}`);
//   }
// };


// // --- Types ---
// type PropertyType = 'RESIDENTIAL' | 'COMMERCIAL';
// type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'newest';

// export default function ProjectListingClient() {
//   // --- State ---
//   const [activeTab, setActiveTab] = useState<PropertyType>('RESIDENTIAL');
//   const [searchQuery, setSearchQuery] = useState('');
  
//   // API Data States
//   const [allProjects, setAllProjects] = useState<any[]>([]);
//   const [cities, setCities] = useState<any[]>([]);
//   const [locations, setLocations] = useState<any[]>([]);
//   const [aptTypes, setAptTypes] = useState<string[]>([]);
  
//   // Filter States
//   const [filters, setFilters] = useState({ cityId: '', locationId: '', aptType: '', status: '' });
//   const [sortBy, setSortBy] = useState<SortOption>('featured');
  
//   // UI States
//   const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   // --- Refs for Animation ---
//   const mainRef = useRef<HTMLDivElement>(null);
//   const gridRef = useRef<HTMLDivElement>(null);
//   const heroTextRef = useRef<HTMLDivElement>(null);

//   // ==========================================
//   // INITIAL DATA LOAD
//   // ==========================================
//   useEffect(() => {
//     const loadInitialData = async () => {
//       setIsLoading(true);
//       try {
//         const [projectsRes, citiesRes] = await Promise.all([
//           ApiService.getProjects({ property_type: 'RESIDENTIAL' }),
//           ApiService.getCities()
//         ]);
        
//         // Handle sorting based on Ongoing status (from Angular logic)
//         const sortedProjects = (projectsRes.data || []).sort((a: any, b: any) => {
//           if (a.status === 'Ongoing' && b.status !== 'Ongoing') return -1;
//           if (a.status !== 'Ongoing' && b.status === 'Ongoing') return 1;
//           return 0;
//         });

//         setAllProjects(sortedProjects);
//         setCities(citiesRes.data?.cities || []);
//       } catch (error) {
//         console.error("Failed to fetch initial data", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     loadInitialData();
//   }, []);

//   // ==========================================
//   // CASCADING FILTERS LOGIC
//   // ==========================================
//   const handleCityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const cityId = e.target.value;
//     setFilters(prev => ({ ...prev, cityId, locationId: '', aptType: '' }));
//     setLocations([]);
//     setAptTypes([]);
    
//     if (cityId) {
//       const res = await ApiService.getLocations(cityId);
//       setLocations(res.data?.locations || []);
//     }
//   };

//   const handleLocationChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const locationId = e.target.value;
//     setFilters(prev => ({ ...prev, locationId, aptType: '' }));
//     setAptTypes([]);
    
//     if (locationId) {
//       const res = await ApiService.getAptTypes({ location_id: locationId, property_type: activeTab });
//       setAptTypes(res.data?.apt_type || []);
//     }
//   };

//   const executeSearch = async (currentFilters = filters, tab = activeTab) => {
//     setIsLoading(true);
//     try {
//       const res = await ApiService.getProjects({
//         city_id: currentFilters.cityId,
//         location_id: currentFilters.locationId,
//         apt_type: currentFilters.aptType,
//         status: currentFilters.status,
//         property_type: tab
//       });
      
//       let results = res.data || [];
      
//       // Local Text Search Fallback
//       if (searchQuery) {
//         const q = searchQuery.toLowerCase();
//         results = results.filter((p: any) => p.title?.toLowerCase().includes(q) || p.locationName?.toLowerCase().includes(q));
//       }

//       setAllProjects(results);
//     } catch (error) {
//       console.error("Search failed", error);
//     } finally {
//       setIsLoading(false);
//       setIsMobileFilterOpen(false);
//     }
//   };

//   const handleTabChange = (tab: PropertyType) => {
//     setActiveTab(tab);
//     const resetFilters = { cityId: '', locationId: '', aptType: '', status: '' };
//     setFilters(resetFilters);
//     setSearchQuery('');
//     setLocations([]);
//     setAptTypes([]);
//     executeSearch(resetFilters, tab);
//   };

//   const handleClearFilters = () => {
//     const resetFilters = { cityId: '', locationId: '', aptType: '', status: '' };
//     setFilters(resetFilters);
//     setSearchQuery('');
//     setLocations([]);
//     setAptTypes([]);
//     executeSearch(resetFilters, activeTab);
//   };

//   // ==========================================
//   // ANIMATIONS
//   // ==========================================
//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.fromTo('.hero-word', 
//         { y: 50, opacity: 0, rotateX: -20 },
//         { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.1, ease: 'power3.out' }
//       );
//       gsap.fromTo('.hero-sub',
//         { y: 20, opacity: 0 },
//         { y: 0, opacity: 1, duration: 1, delay: 0.4, ease: 'power2.out' }
//       );
//       gsap.fromTo('.filter-bar',
//         { y: 30, opacity: 0 },
//         { y: 0, opacity: 1, duration: 1, delay: 0.6, ease: 'back.out(1.2)' }
//       );
//     }, mainRef);
//     return () => ctx.revert();
//   }, []);

//   useEffect(() => {
//     if (!gridRef.current || allProjects.length === 0) return;
//     const ctx = gsap.context(() => {
//       const cards = gsap.utils.toArray('.project-card');
//       gsap.fromTo(cards,
//         { y: 40, opacity: 0, scale: 0.98 },
//         { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.05, ease: 'power2.out', clearProps: 'all' }
//       );
//     }, gridRef);
//     return () => ctx.revert();
//   }, [allProjects]);

//   // const formatPrice = (price: number | string) => {
//   //   if (!price) return 'Price on Request';
//   //   const numPrice = typeof price === 'string' ? parseFloat(price) : price;
//   //   return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(numPrice);
//   // };

//   const formatPrice = (price: number | string | null | undefined): string => {
//   // 1. Check for missing values
//   if (price === null || price === undefined || price === '') {
//     return 'Price on Request';
//   }

//   let numPrice = price;

//   // 2. Stricter parsing for strings
//   if (typeof price === 'string') {
//     // Strip commas just in case the API sends pre-formatted numbers like "1,50,00,000"
//     const cleanString = price.replace(/,/g, '').trim();
    
//     // Number() returns NaN for "3 BHK...", whereas parseFloat() would incorrectly return 3
//     numPrice = Number(cleanString);
//   }

//   // 3. Handle the NaN result from text strings
//   if (typeof numPrice === 'number' && isNaN(numPrice)) {
//     // Option A: Return the original string (e.g., "3 BHK Contact Us For Pricing")
//     return String(price); 
    
//     // Option B: Standardize all text to your default fallback
//     // return 'Price on Request'; 
//   }

//   // 4. Format the valid number
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     maximumFractionDigits: 0,
//   }).format(numPrice as number);
// };

//   const activeFilterCount = Object.values(filters).filter(Boolean).length + (searchQuery ? 1 : 0);

//   return (
//     <div ref={mainRef} className="min-h-screen bg-[#faf6f0] selection:bg-[#F58220] selection:text-white pb-24">
      
//       {/* --- HERO SECTION --- */}
//       <section className="relative pt-32 pb-20 px-6 overflow-hidden flex flex-col items-center text-center">
//         <div ref={heroTextRef} className="max-w-4xl mx-auto z-10">
//           <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-black tracking-tight leading-[1.1] mb-6 flex flex-wrap justify-center gap-x-4">
//             <span className="hero-word">Curating</span>
//             <span className="hero-word special-text text-[#F58220]">Exceptional</span>
//             <span className="hero-word">Spaces.</span>
//           </h1>
//           <p className="hero-sub text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
//             Discover architectural masterpieces tailored for your lifestyle and business aspirations across premium destinations.
//           </p>
//         </div>

//         {/* --- TAB SWITCHER --- */}
//         <div className="hero-sub mt-12 bg-white/80 backdrop-blur-md p-1.5 rounded-full inline-flex border border-gray-200 shadow-sm relative z-10">
//           <button
//             onClick={() => handleTabChange('RESIDENTIAL')}
//             className={`relative px-8 py-3 rounded-full text-sm uppercase tracking-widest font-bold transition-all duration-500 ${activeTab === 'RESIDENTIAL' ? 'text-white' : 'text-gray-500 hover:text-black'}`}
//           >
//             {activeTab === 'RESIDENTIAL' && <span className="absolute inset-0 bg-[#F58220] rounded-full -z-10 layout-id-tab" />}
//             Residential
//           </button>
//           <button
//             onClick={() => handleTabChange('COMMERCIAL')}
//             className={`relative px-8 py-3 rounded-full text-sm uppercase tracking-widest font-bold transition-all duration-500 ${activeTab === 'COMMERCIAL' ? 'text-white' : 'text-gray-500 hover:text-black'}`}
//           >
//             {activeTab === 'COMMERCIAL' && <span className="absolute inset-0 bg-[#F58220] rounded-full -z-10 layout-id-tab" />}
//             Commercial
//           </button>
//         </div>
//       </section>

//       {/* --- ADVANCED FILTER BAR --- */}
//       <section className="container mx-auto px-4 md:px-8 relative z-20 -mt-6 filter-bar">
//         <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-4 md:p-6 flex flex-col xl:flex-row gap-4 items-center transition-all">
          
//           <div className="relative w-full xl:w-[25%] group">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#F58220] transition-colors h-5 w-5" />
//             <input 
//               type="text" 
//               placeholder="Search by name..." 
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#F58220] focus:ring-4 focus:ring-[#F58220]/10 outline-none transition-all font-medium"
//             />
//           </div>

//           <div className="hidden xl:flex flex-1 items-center gap-4 w-full">
//             <div className="h-10 w-px bg-gray-200 mx-2"></div>
            
//             <div className="relative flex-1 group">
//               <select value={filters.cityId} onChange={handleCityChange} className="w-full appearance-none bg-transparent border border-gray-200 py-4 pl-4 pr-10 rounded-xl font-medium focus:border-black outline-none cursor-pointer hover:bg-gray-50 transition-colors">
//                 <option value="">All Cities</option>
//                 {cities.map(c => <option key={c.city_id} value={c.city_id}>{c.name}</option>)}
//               </select>
//               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none group-hover:text-black transition-colors" />
//             </div>

//             <div className="relative flex-1 group">
//               <select value={filters.locationId} onChange={handleLocationChange} disabled={!filters.cityId} className="w-full appearance-none bg-transparent border border-gray-200 py-4 pl-4 pr-10 rounded-xl font-medium focus:border-black outline-none cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
//                 <option value="">Locations</option>
//                 {locations.map(l => <option key={l.location_id} value={l.location_id}>{l.name}</option>)}
//               </select>
//               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
//             </div>

//             {activeTab === 'RESIDENTIAL' && (
//               <div className="relative flex-1 group">
//                 <select value={filters.aptType} onChange={e => setFilters({...filters, aptType: e.target.value})} className="w-full appearance-none bg-transparent border border-gray-200 py-4 pl-4 pr-10 rounded-xl font-medium focus:border-black outline-none cursor-pointer hover:bg-gray-50 transition-colors">
//                   <option value="">Configuration</option>
//                   {aptTypes.length > 0 ? aptTypes.map(t => <option key={t} value={t}>{t}</option>) : <option value="" disabled>Select Location First</option>}
//                 </select>
//                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
//               </div>
//             )}

//             <div className="relative flex-1 group">
//               <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="w-full appearance-none bg-transparent border border-gray-200 py-4 pl-4 pr-10 rounded-xl font-medium focus:border-black outline-none cursor-pointer hover:bg-gray-50 transition-colors">
//                 <option value="">Status</option>
//                 <option value="Ongoing">Ongoing</option>
//                 <option value="New">New Launch</option>
//                 <option value="Sold">Sold</option>
//               </select>
//               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
//             </div>
            
//             {activeFilterCount > 0 && (
//               <button onClick={handleClearFilters} className="p-4 text-gray-500 hover:text-red-500 transition-colors tooltip" title="Clear Filters">
//                 <X className="h-5 w-5" />
//               </button>
//             )}

//             <button onClick={() => executeSearch()} className="px-6 py-4 bg-black text-white rounded-xl font-bold hover:bg-[#F58220] transition-colors">
//               Search
//             </button>
//           </div>

//           {/* Mobile Filter Toggle */}
//           <button 
//             className="xl:hidden w-full py-4 bg-black text-white rounded-xl flex items-center justify-center gap-2 font-bold"
//             onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
//           >
//             <SlidersHorizontal className="h-5 w-5" />
//             Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
//           </button>
//         </div>
//       </section>

//       {/* --- MAIN GRID --- */}
//       <section className="container mx-auto px-4 md:px-8 mt-12 min-h-[50vh]">
//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="w-10 h-10 border-4 border-gray-200 border-t-[#F58220] rounded-full animate-spin"></div>
//           </div>
//         ) : allProjects.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-64 text-center">
//             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
//               <Search className="h-10 w-10 text-gray-300" />
//             </div>
//             <h3 className="text-3xl font-black mb-2 text-gray-900">No spaces found</h3>
//             <p className="text-gray-500 mb-6 max-w-md">We couldn&apos;t find any projects matching your exact criteria. Try adjusting your filters.</p>
//             <button onClick={handleClearFilters} className="px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-[#F58220] transition-colors">
//               Reset Filters
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10" ref={gridRef}>
//             {allProjects.map((project: any) => (
//               <Link 
//                 href={`/${activeTab.toLowerCase()}-project/${project.slug}`} 
//                 key={project.id || project.slug}
//                 className="project-card group block relative bg-white rounded-[1.5rem] overflow-hidden hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 will-change-transform"
//               >
//                 {/* Image Wrapper */}
//                 <div className="relative h-[320px] w-full overflow-hidden bg-gray-100">
//                   {/* Status Overlay Badge */}
//                   <div className="absolute top-5 left-5 z-20 flex gap-2">
//                     <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border border-white/20 text-white ${
//                       project.status === 'Ongoing' ? 'bg-[#0061AF]/90' : 
//                       project.status === 'Ready' || project.status === 'Ready to Move' ? 'bg-[#00A79D]/90' : 
//                       project.status === 'Sold' ? 'bg-red-600/90' : 'bg-[#F58220]/90'
//                     }`}>
//                       {project.status || 'New'}
//                     </span>
//                   </div>

//                   <Image 
//                     src={project.title_image?.[0] || 'https://images.unsplash.com/photo-1600607687931-cebf004f560a?auto=format&fit=crop&q=80'} 
//                     alt={project.title || 'Project'}
//                     fill
//                     loading="eager" 
//                     className="object-cover transition-transform duration-700 group-hover:scale-105"
//                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
                  
//                   {/* Location Info inside Image */}
//                   <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center gap-2 text-white/90">
//                     <MapPin className="h-4 w-4 text-[#F58220]" />
//                     <span className="text-sm font-medium tracking-wide">{project.location_name || project.locationName || 'Pune'}</span>
//                   </div>
//                 </div>
                
//                 {/* Content Section */}
//                 <div className="p-6 md:p-8 flex flex-col h-[220px]">
//                   <h3 className="text-2xl font-bold text-black group-hover:text-[#F58220] transition-colors line-clamp-1 mb-2">{project.title}</h3>
//                   <p className="text-gray-500 font-medium mb-4 font-special italic text-lg line-clamp-1">{project.sub_title}</p>
                  
//                   <div className="flex flex-wrap gap-2 mb-6 h-[28px] overflow-hidden">
//                     {project.aptTypes?.slice(0, 3).map((apt: string) => (
//                       <span key={apt} className="px-3 py-1 bg-gray-50 border border-gray-100 text-gray-600 rounded-md text-xs font-bold tracking-wide flex items-center gap-1">
//                         <Building className="h-3 w-3" /> {apt}
//                       </span>
//                     ))}
//                   </div>
                  
//                   {/* Card Footer */}
//                   <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-end">
//                     <div>
//                       <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Starting From</p>
//                       <p className="text-xl font-black text-black">{formatPrice(project.tags?.[0] || project.min_price)}</p>
//                     </div>
//                     <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-black group-hover:border-black group-hover:text-white transition-all duration-300 -rotate-45 group-hover:rotate-0">
//                       <ArrowRight className="h-5 w-5" />
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect, useRef, useMemo } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import gsap from 'gsap';
// import { Search, SlidersHorizontal, X, MapPin, Building, ArrowRight, ChevronDown } from 'lucide-react';

// // --- Types ---
// type PropertyType = 'RESIDENTIAL' | 'COMMERCIAL';
// type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'newest';

// interface Project {
//   id: string;
//   slug: string;
//   title: string;
//   sub_title: string;
//   status: 'Ongoing' | 'Ready to Move' | 'New Launch' | 'Sold';
//   propertyType: PropertyType;
//   price: number;
//   locationId: string;
//   locationName: string;
//   cityId: string;
//   cityName: string;
//   aptTypes: string[];
//   title_image: string[];
//   featured: boolean;
// }

// // --- Mock Data ---
// const MOCK_PROJECTS: Project[] = [
//   { id: '1', slug: 'kumar-parc-residences', title: 'Kumar Parc Residences', sub_title: 'Premium High-Rise Living', status: 'Ongoing', propertyType: 'RESIDENTIAL', price: 12500000, locationId: 'l1', locationName: 'Kalyani Nagar', cityId: 'c1', cityName: 'Pune', aptTypes: ['2 BHK', '3 BHK'], title_image: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800'], featured: true },
//   { id: '2', slug: 'kumar-sophia', title: 'Kumar Sophia', sub_title: 'Boutique Luxury Apartments', status: 'Ready to Move', propertyType: 'RESIDENTIAL', price: 21000000, locationId: 'l2', locationName: 'Baner', cityId: 'c1', cityName: 'Pune', aptTypes: ['3 BHK', '4 BHK'], title_image: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'], featured: false },
//   { id: '3', slug: 'kumar-business-centre', title: 'Kumar Business Centre', sub_title: 'Grade A Office Spaces', status: 'Ongoing', propertyType: 'COMMERCIAL', price: 35000000, locationId: 'l3', locationName: 'Kharadi', cityId: 'c1', cityName: 'Pune', aptTypes: ['Office', 'Retail'], title_image: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'], featured: true },
//   { id: '4', slug: 'kumar-palmsprings', title: 'Kumar Palmsprings', sub_title: 'Serene Villa Community', status: 'New Launch', propertyType: 'RESIDENTIAL', price: 45000000, locationId: 'l4', locationName: 'Undri', cityId: 'c1', cityName: 'Pune', aptTypes: ['4 BHK', '5 BHK'], title_image: ['https://images.unsplash.com/photo-1600607687931-cebf004f560a?auto=format&fit=crop&q=80&w=800'], featured: false },
//   { id: '5', slug: 'kumar-icon', title: 'Kumar Icon', sub_title: 'Urban Retail Boulevard', status: 'Ready to Move', propertyType: 'COMMERCIAL', price: 18000000, locationId: 'l1', locationName: 'Kalyani Nagar', cityId: 'c1', cityName: 'Pune', aptTypes: ['Retail'], title_image: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800'], featured: false },
//   { id: '6', slug: 'kumar-vista', title: 'Kumar Vista', sub_title: 'Panoramic City Views', status: 'Sold', propertyType: 'RESIDENTIAL', price: 9500000, locationId: 'l2', locationName: 'Baner', cityId: 'c1', cityName: 'Pune', aptTypes: ['2 BHK'], title_image: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'], featured: false },
// ];

// const CITIES = [{ id: 'c1', name: 'Pune' }, { id: 'c2', name: 'Mumbai' }, { id: 'c3', name: 'Bengaluru' }];
// const LOCATIONS = [{ id: 'l1', name: 'Kalyani Nagar', cityId: 'c1' }, { id: 'l2', name: 'Baner', cityId: 'c1' }, { id: 'l3', name: 'Kharadi', cityId: 'c1' }, { id: 'l4', name: 'Undri', cityId: 'c1' }];
// const APT_TYPES = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', 'Office', 'Retail'];
// const STATUSES = ['Ongoing', 'Ready to Move', 'New Launch', 'Sold'];

// export default function ProjectListingClient() {
//   // --- State ---
//   const [activeTab, setActiveTab] = useState<PropertyType>('RESIDENTIAL');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filters, setFilters] = useState({ cityId: '', locationId: '', aptType: '', status: '' });
//   const [sortBy, setSortBy] = useState<SortOption>('featured');
//   const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // --- Refs for Animation ---
//   const mainRef = useRef<HTMLDivElement>(null);
//   const gridRef = useRef<HTMLDivElement>(null);
//   const heroTextRef = useRef<HTMLDivElement>(null);

//   // --- Initial Hero Animation ---
//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.fromTo('.hero-word', 
//         { y: 50, opacity: 0, rotateX: -20 },
//         { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.1, ease: 'power3.out' }
//       );
//       gsap.fromTo('.hero-sub',
//         { y: 20, opacity: 0 },
//         { y: 0, opacity: 1, duration: 1, delay: 0.4, ease: 'power2.out' }
//       );
//       gsap.fromTo('.filter-bar',
//         { y: 30, opacity: 0 },
//         { y: 0, opacity: 1, duration: 1, delay: 0.6, ease: 'back.out(1.2)' }
//       );
//     }, mainRef);
//     return () => ctx.revert();
//   }, []);

//   // --- Data Processing (Search, Filter, Sort) ---
//   const filteredAndSortedProjects = useMemo(() => {
//     let result = MOCK_PROJECTS.filter(p => p.propertyType === activeTab);

//     // Search
//     if (searchQuery) {
//       const q = searchQuery.toLowerCase();
//       result = result.filter(p => p.title.toLowerCase().includes(q) || p.locationName.toLowerCase().includes(q));
//     }

//     // Dropdown Filters
//     if (filters.cityId) result = result.filter(p => p.cityId === filters.cityId);
//     if (filters.locationId) result = result.filter(p => p.locationId === filters.locationId);
//     if (filters.aptType) result = result.filter(p => p.aptTypes.includes(filters.aptType));
//     if (filters.status) result = result.filter(p => p.status === filters.status);

//     // Sorting
//     result.sort((a, b) => {
//       switch (sortBy) {
//         case 'price-asc': return a.price - b.price;
//         case 'price-desc': return b.price - a.price;
//         case 'name-asc': return a.title.localeCompare(b.title);
//         case 'featured':
//         default:
//           if (a.featured && !b.featured) return -1;
//           if (!a.featured && b.featured) return 1;
//           return 0;
//       }
//     });

//     return result;
//   }, [activeTab, searchQuery, filters, sortBy]);

//   // --- Grid Animation on Data Change ---
//   useEffect(() => {
//     if (!gridRef.current) return;
//     const ctx = gsap.context(() => {
//       const cards = gsap.utils.toArray('.project-card');
//       if (cards.length > 0) {
//         gsap.fromTo(cards,
//           { y: 40, opacity: 0, scale: 0.98 },
//           { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.05, ease: 'power2.out', clearProps: 'all' }
//         );
//       }
//     }, gridRef);
//     return () => ctx.revert();
//   }, [filteredAndSortedProjects]);

//   // --- Handlers ---
//   const handleTabChange = (tab: PropertyType) => {
//     setIsLoading(true);
//     setActiveTab(tab);
//     setFilters({ cityId: '', locationId: '', aptType: '', status: '' });
//     setSearchQuery('');
//     setTimeout(() => setIsLoading(false), 300); 
//   };

//   const handleClearFilters = () => {
//     setFilters({ cityId: '', locationId: '', aptType: '', status: '' });
//     setSearchQuery('');
//   };

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
//   };

//   const activeFilterCount = Object.values(filters).filter(Boolean).length + (searchQuery ? 1 : 0);

//   return (
//     <div ref={mainRef} className="min-h-screen bg-[#faf6f0] selection:bg-[#F58220] selection:text-white pb-24">
      
//       {/* --- HERO SECTION --- */}
//       <section className="relative pt-32 pb-20 px-6 overflow-hidden flex flex-col items-center text-center">
//         <div ref={heroTextRef} className="max-w-4xl mx-auto z-10">
//           <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-black tracking-tight leading-[1.1] mb-6 flex flex-wrap justify-center gap-x-4">
//             <span className="hero-word">Curating</span>
//             <span className="hero-word special-text text-[#F58220]">Exceptional</span>
//             <span className="hero-word">Spaces.</span>
//           </h1>
//           <p className="hero-sub text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
//             Discover architectural masterpieces tailored for your lifestyle and business aspirations across premium destinations.
//           </p>
//         </div>

//         {/* --- TAB SWITCHER --- */}
//         <div className="hero-sub mt-12 bg-white/80 backdrop-blur-md p-1.5 rounded-full inline-flex border border-gray-200 shadow-sm relative z-10">
//           <button
//             onClick={() => handleTabChange('RESIDENTIAL')}
//             className={`relative px-8 py-3 rounded-full text-sm uppercase tracking-widest font-bold transition-all duration-500 ${activeTab === 'RESIDENTIAL' ? 'text-white' : 'text-gray-500 hover:text-black'}`}
//           >
//             {activeTab === 'RESIDENTIAL' && <span className="absolute inset-0 bg-[#F58220] rounded-full -z-10 layout-id-tab" />}
//             Residential
//           </button>
//           <button
//             onClick={() => handleTabChange('COMMERCIAL')}
//             className={`relative px-8 py-3 rounded-full text-sm uppercase tracking-widest font-bold transition-all duration-500 ${activeTab === 'COMMERCIAL' ? 'text-white' : 'text-gray-500 hover:text-black'}`}
//           >
//             {activeTab === 'COMMERCIAL' && <span className="absolute inset-0 bg-[#F58220] rounded-full -z-10 layout-id-tab" />}
//             Commercial
//           </button>
//         </div>
//       </section>

//       {/* --- ADVANCED FILTER BAR --- */}
//       <section className="container mx-auto px-4 md:px-8 relative z-20 -mt-6 filter-bar">
//         <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-4 md:p-6 flex flex-col xl:flex-row gap-4 items-center transition-all">
          
//           {/* Search Input */}
//           <div className="relative w-full xl:w-[30%] group">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#F58220] transition-colors h-5 w-5" />
//             <input 
//               type="text" 
//               placeholder="Search by project name or location..." 
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#F58220] focus:ring-4 focus:ring-[#F58220]/10 outline-none transition-all font-medium"
//             />
//           </div>

//           {/* Desktop Filters */}
//           <div className="hidden xl:flex flex-1 items-center gap-4 w-full">
//             <div className="h-10 w-px bg-gray-200 mx-2"></div>
            
//             {/* Custom Selects using native underlying with Tailwind overlay for standard compliance */}
//             <div className="relative flex-1 group">
//               <select 
//                 value={filters.cityId} onChange={e => setFilters({...filters, cityId: e.target.value, locationId: ''})}
//                 className="w-full appearance-none bg-transparent border border-gray-200 py-4 pl-4 pr-10 rounded-xl font-medium focus:border-black outline-none cursor-pointer hover:bg-gray-50 transition-colors"
//               >
//                 <option value="">All Cities</option>
//                 {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//               </select>
//               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none group-hover:text-black transition-colors" />
//             </div>

//             <div className="relative flex-1 group">
//               <select 
//                 value={filters.locationId} onChange={e => setFilters({...filters, locationId: e.target.value})}
//                 disabled={!filters.cityId}
//                 className="w-full appearance-none bg-transparent border border-gray-200 py-4 pl-4 pr-10 rounded-xl font-medium focus:border-black outline-none cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <option value="">Locations</option>
//                 {LOCATIONS.filter(l => l.cityId === filters.cityId).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
//               </select>
//               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
//             </div>

//             <div className="relative flex-1 group">
//               <select 
//                 value={filters.aptType} onChange={e => setFilters({...filters, aptType: e.target.value})}
//                 className="w-full appearance-none bg-transparent border border-gray-200 py-4 pl-4 pr-10 rounded-xl font-medium focus:border-black outline-none cursor-pointer hover:bg-gray-50 transition-colors"
//               >
//                 <option value="">Configuration</option>
//                 {APT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
//               </select>
//               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
//             </div>

//             <div className="relative flex-1 group">
//               <select 
//                 value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}
//                 className="w-full appearance-none bg-transparent border border-gray-200 py-4 pl-4 pr-10 rounded-xl font-medium focus:border-black outline-none cursor-pointer hover:bg-gray-50 transition-colors"
//               >
//                 <option value="">Status</option>
//                 {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
//               </select>
//               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
//             </div>
            
//             {activeFilterCount > 0 && (
//               <button onClick={handleClearFilters} className="p-4 text-gray-500 hover:text-red-500 transition-colors tooltip" title="Clear Filters">
//                 <X className="h-5 w-5" />
//               </button>
//             )}
//           </div>

//           {/* Mobile Filter Toggle */}
//           <button 
//             className="xl:hidden w-full py-4 bg-black text-white rounded-xl flex items-center justify-center gap-2 font-bold"
//             onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
//           >
//             <SlidersHorizontal className="h-5 w-5" />
//             Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
//           </button>
//         </div>

//         {/* Sorting Row (Desktop & Mobile) */}
//         <div className="flex justify-between items-center mt-6">
//           <p className="text-gray-500 font-medium">Showing <strong className="text-black">{filteredAndSortedProjects.length}</strong> exclusive spaces</p>
//           {/* <div className="flex items-center gap-3">
//             <span className="text-sm font-bold text-gray-400 uppercase tracking-wide hidden sm:block">Sort By</span>
//             <div className="relative group">
//               <select 
//                 value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)}
//                 className="appearance-none bg-white border border-gray-200 py-2 pl-4 pr-10 rounded-lg text-sm font-bold focus:border-black outline-none cursor-pointer hover:border-gray-300 transition-all shadow-sm"
//               >
//                 <option value="featured">Featured First</option>
//                 <option value="price-desc">Price: High to Low</option>
//                 <option value="price-asc">Price: Low to High</option>
//                 <option value="name-asc">Name: A to Z</option>
//               </select>
//               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
//             </div>
//           </div> */}
//         </div>
//       </section>

//       {/* --- MAIN GRID --- */}
//       <section className="container mx-auto px-4 md:px-8 mt-12 min-h-[50vh]">
//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="w-10 h-10 border-4 border-gray-200 border-t-[#F58220] rounded-full animate-spin"></div>
//           </div>
//         ) : filteredAndSortedProjects.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-64 text-center">
//             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
//               <Search className="h-10 w-10 text-gray-300" />
//             </div>
//             <h3 className="text-3xl font-black mb-2 text-gray-900">No spaces found</h3>
//             <p className="text-gray-500 mb-6 max-w-md">We couldn't find any projects matching your exact criteria. Try adjusting your filters.</p>
//             <button onClick={handleClearFilters} className="px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-[#F58220] transition-colors">
//               Reset Filters
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10" ref={gridRef}>
//             {filteredAndSortedProjects.map((project) => (
//               <Link 
//                 href={`/${activeTab.toLowerCase()}-project/${project.slug}`} 
//                 key={project.id}
//                 className="project-card group block relative bg-white rounded-[1.5rem] overflow-hidden hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 will-change-transform"
//               >
//                 {/* Image Wrapper */}
//                 <div className="relative h-[320px] w-full overflow-hidden">
//                   {/* Status Overlay Badge */}
//                   <div className="absolute top-5 left-5 z-20 flex gap-2">
//                     <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border border-white/20 text-white ${
//                       project.status === 'Ongoing' ? 'bg-[#0061AF]/80' : 
//                       project.status === 'Ready to Move' ? 'bg-[#00A79D]/80' : 
//                       project.status === 'Sold' ? 'bg-red-600/80' : 'bg-[#F58220]/80'
//                     }`}>
//                       {project.status}
//                     </span>
//                     {project.featured && (
//                       <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FFD12E] text-black shadow-sm">
//                         Featured
//                       </span>
//                     )}
//                   </div>

//                   <Image 
//                     src={project.title_image[0]} 
//                     alt={project.title}
//                     fill
//                     className="object-cover transition-transform duration-700 group-hover:scale-105"
//                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                   />
//                   {/* Elegant Gradient Overlay */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
                  
//                   {/* Location Info inside Image */}
//                   <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center gap-2 text-white/90">
//                     <MapPin className="h-4 w-4" />
//                     <span className="text-sm font-medium tracking-wide">{project.locationName}, {project.cityName}</span>
//                   </div>
//                 </div>
                
//                 {/* Content Section */}
//                 <div className="p-6 md:p-8 flex flex-col">
//                   <div className="flex justify-between items-start mb-2">
//                     <h3 className="text-2xl font-bold text-black group-hover:text-[#F58220] transition-colors line-clamp-1">{project.title}</h3>
//                   </div>
                  
//                   <p className="text-gray-500 font-medium mb-6 font-special italic text-lg">{project.sub_title}</p>
                  
//                   <div className="flex flex-wrap gap-2 mb-8">
//                     {project.aptTypes.map(apt => (
//                       <span key={apt} className="px-3 py-1 bg-gray-50 border border-gray-100 text-gray-600 rounded-md text-xs font-bold tracking-wide flex items-center gap-1">
//                         <Building className="h-3 w-3" /> {apt}
//                       </span>
//                     ))}
//                   </div>
                  
//                   {/* Card Footer */}
//                   <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between items-end">
//                     <div>
//                       <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Starting From</p>
//                       <p className="text-xl font-black text-black">{formatPrice(project.price)}</p>
//                     </div>
                    
//                     <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-black group-hover:border-black group-hover:text-white transition-all duration-300 -rotate-45 group-hover:rotate-0">
//                       <ArrowRight className="h-5 w-5" />
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }



// 'use client';

// import { useState, useEffect, useRef, useMemo } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import gsap from 'gsap';
// import { Search, SlidersHorizontal, X, MapPin, Building2, MoveRight, ChevronDown } from 'lucide-react';

// // ==========================================
// // 1. MOCK API SERVICE (Matches your Angular Service)
// // ==========================================
// const ApiService = {
//   getProjects: async (filters: any = {}) => {
//     // Simulate network delay
//     await new Promise(res => setTimeout(res, 500));
//     return {
//       data: [
//         { id: '1', slug: 'parc-residences', title: 'Kumar Parc Residences', sub_title: '2 & 3 BHK Flats In Magarpatta, Pune', status: 'Ongoing', propertyType: 'RESIDENTIAL', cityId: 'c1', locationId: 'l1', title_image: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200'] },
//         { id: '2', slug: 'kumar-plumeria', title: 'Kumar Plumeria', sub_title: 'Premium Flats in Bengaluru', status: 'New', propertyType: 'RESIDENTIAL', cityId: 'c3', locationId: 'l3', title_image: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200'] },
//         { id: '3', slug: 'kumar-primus', title: 'Kumar Primus', sub_title: 'Premium Commercial Spaces', status: 'Ready', propertyType: 'COMMERCIAL', cityId: 'c1', locationId: 'l1', title_image: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200'] },
//         { id: '4', slug: 'kumar-corp-commercials', title: 'Kumar Corp Commercials', sub_title: 'A Grade Workspaces', status: 'Ongoing', propertyType: 'COMMERCIAL', cityId: 'c1', locationId: 'l2', title_image: ['https://kpassets.kumarworld.com/assets/common/uploads/files/aa326577-f4dd-4ee7-816f-e0123d4ee794.jpg'] },
//       ]
//     };
//   },
//   getCities: async () => ({ data: { cities: [{ city_id: 'c1', name: 'Pune', residential_property_count: 5, commercial_property_count: 2 }, { city_id: 'c2', name: 'Mumbai', residential_property_count: 3, commercial_property_count: 0 }, { city_id: 'c3', name: 'Bengaluru', residential_property_count: 2, commercial_property_count: 1 }] } }),
//   getLocations: async (cityId: string) => ({ data: { locations: [{ location_id: 'l1', name: 'Magarpatta' }, { location_id: 'l2', name: 'Baner' }, { location_id: 'l3', name: 'Whitefield' }] } }),
//   getAptTypes: async (params: any) => ({ data: { apt_type: ['2 BHK', '3 BHK', '4 BHK', 'Office'] } }),
// };

// // ==========================================
// // 2. COMPONENT
// // ==========================================
// export default function ProjectListingClient() {
//   // --- Core State ---
//   const [selectedTab, setSelectedTab] = useState<'RESIDENTIAL' | 'COMMERCIAL'>('RESIDENTIAL');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

//   // --- Data State ---
//   const [allProjects, setAllProjects] = useState<any[]>([]);
//   const [unfilteredProjects, setUnfilteredProjects] = useState<any[]>([]);
//   const [cities, setCities] = useState<any[]>([]);
//   const [locations, setLocations] = useState<any[]>([]);
//   const [aptTypes, setAptTypes] = useState<string[]>([]);

//   // --- Filter State (Matching Angular Logic) ---
//   const [selectedCityId, setSelectedCityId] = useState<string>('');
//   const [selectedCityName, setSelectedCityName] = useState<string>('');
//   const [selectedLocationId, setSelectedLocationId] = useState<string>('');
//   const [selectedConfig, setSelectedConfig] = useState<string>('');
//   const [selectedStatus, setSelectedStatus] = useState<string>('all');

//   // --- Hover / Hero Interaction State ---
//   const [currentProjectDetails, setCurrentProjectDetails] = useState<any>(null);
  
//   // Refs
//   const mainRef = useRef<HTMLDivElement>(null);
//   const heroTextRef = useRef<HTMLDivElement>(null);
//   const sliderRef = useRef<HTMLDivElement>(null);

//   // --- 1. Initial Load ---
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       setIsLoading(true);
//       try {
//         const [projectsRes, citiesRes] = await Promise.all([
//           ApiService.getProjects(),
//           ApiService.getCities()
//         ]);
        
//         const initialProjects = projectsRes.data;
//         setUnfilteredProjects(initialProjects);
//         setCities(citiesRes.data.cities);
        
//         // Filter for default tab
//         const defaultFiltered = initialProjects.filter((p: any) => p.propertyType === 'RESIDENTIAL');
//         setAllProjects(defaultFiltered);
//       } catch (err) {
//         console.error("Failed to load initial data", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchInitialData();
//   }, []);

//   // --- 2. Dynamic Defaults (Matching Angular Logic) ---
//   const defaultHero = useMemo(() => {
//     if (selectedTab === 'COMMERCIAL') {
//       return { title: 'Kumar Primus', sub_title: 'Premium Commercial Spaces', slug: 'kumar-primus' };
//     }
//     if (selectedCityName === 'Bengaluru' || selectedCityName === 'Bangalore') {
//       return { title: 'Kumar Plumeria', sub_title: 'Premium Flats in Bengaluru', slug: 'kumar-plumeria' };
//     }
//     return { title: 'Kumar Parc Residences', sub_title: '2 & 3 BHK Flats In Magarpatta, Pune', slug: 'parc-residences' };
//   }, [selectedTab, selectedCityName]);

//   const activeHeroData = currentProjectDetails || defaultHero;

//   // --- 3. Hero Text Animation (Triggered on hover change) ---
//   useEffect(() => {
//     if (heroTextRef.current) {
//       gsap.fromTo(heroTextRef.current.children,
//         { y: 40, opacity: 0 },
//         { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', overwrite: true }
//       );
//     }
//   }, [activeHeroData.title]); // Re-run when title changes

//   // --- 4. Handlers (Cascading Filters) ---
//   const handleTabSwitch = (tab: 'RESIDENTIAL' | 'COMMERCIAL') => {
//     setSelectedTab(tab);
//     handleClearFilters();
    
//     // Sort logic from Angular
//     const filtered = unfilteredProjects
//       .filter((p: any) => p.propertyType === tab)
//       .sort((a: any, b: any) => {
//         if (a.status === 'Ongoing' && b.status !== 'Ongoing') return -1;
//         if (a.status !== 'Ongoing' && b.status === 'Ongoing') return 1;
//         return 0;
//       });
      
//     setAllProjects(filtered);
//     setCurrentProjectDetails(null);
//   };

//   const onCitySelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const cityId = e.target.value;
//     const cityName = e.target.options[e.target.selectedIndex].text;
    
//     setSelectedCityId(cityId);
//     setSelectedCityName(cityName);
//     setSelectedLocationId(''); // Reset cascading children
//     setSelectedConfig('');
    
//     if (cityId) {
//       setIsLoading(true);
//       const res = await ApiService.getLocations(cityId);
//       setLocations(res.data.locations);
//       setIsLoading(false);
//     } else {
//       setLocations([]);
//     }
//     executeSearch(cityId, '', selectedConfig, selectedStatus, selectedTab);
//   };

//   const onLocationSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const locId = e.target.value;
//     setSelectedLocationId(locId);
//     setSelectedConfig('');
    
//     if (locId) {
//       setIsLoading(true);
//       const res = await ApiService.getAptTypes({ location_id: locId, property_type: selectedTab });
//       setAptTypes(res.data.apt_type);
//       setIsLoading(false);
//     } else {
//       setAptTypes([]);
//     }
//     executeSearch(selectedCityId, locId, '', selectedStatus, selectedTab);
//   };

//   const executeSearch = async (city: string, loc: string, config: string, status: string, tab: string) => {
//     setIsLoading(true);
//     const res = await ApiService.getProjects({
//       city_id: city,
//       location_id: loc,
//       apt_type: config,
//       status: status === 'all' ? '' : status,
//       property_type: tab
//     });
//     setAllProjects(res.data);
//     setIsLoading(false);
//   };

//   const handleApply = () => {
//     setIsMobileFilterOpen(false);
//     executeSearch(selectedCityId, selectedLocationId, selectedConfig, selectedStatus, selectedTab);
//   };

//   const handleClearFilters = () => {
//     setSelectedCityId('');
//     setSelectedCityName('');
//     setSelectedLocationId('');
//     setSelectedConfig('');
//     setSelectedStatus('all');
//     setLocations([]);
//     setAptTypes([]);
//   };

//   return (
//     <div ref={mainRef} className="min-h-screen bg-[#111111] text-white selection:bg-[#F58220] flex flex-col font-sans overflow-hidden">
      
//       {/* ==========================================
//           TOP NAVIGATION & TABS
//       ========================================== */}
//       <header className="px-6 md:px-12 pt-10 pb-6 flex justify-between items-center z-20">
//         <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-full inline-flex border border-white/20">
//           <button
//             onClick={() => handleTabSwitch('RESIDENTIAL')}
//             className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-all duration-500 ${selectedTab === 'RESIDENTIAL' ? 'bg-[#0061AF] text-white' : 'text-gray-400 hover:text-white'}`}
//           >
//             Residential
//           </button>
//           <button
//             onClick={() => handleTabSwitch('COMMERCIAL')}
//             className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-all duration-500 ${selectedTab === 'COMMERCIAL' ? 'bg-[#F58220] text-white' : 'text-gray-400 hover:text-white'}`}
//           >
//             Commercial
//           </button>
//         </div>
        
//         {/* Desktop Filter Toggle */}
//         <button 
//           onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
//           className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all font-bold text-sm tracking-widest uppercase"
//         >
//           <SlidersHorizontal size={18} /> Filters
//         </button>
//       </header>

//       {/* ==========================================
//           DYNAMIC HERO SECTION (Controlled by Hover)
//       ========================================== */}
//       <section className="flex-1 px-6 md:px-12 flex flex-col justify-center pb-12 z-10 pointer-events-none">
//         <div ref={heroTextRef} className="max-w-4xl relative">
          
//           <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black tracking-tighter leading-[1.1] mb-4 text-white">
//             {activeHeroData.title}
//           </h1>
          
//           <p className="text-xl md:text-3xl font-special italic text-gray-400 mb-10 max-w-2xl">
//             {activeHeroData.sub_title}
//           </p>
          
//           <div className="pointer-events-auto">
//             {allProjects.length > 0 ? (
//               <Link 
//                 href={`/${selectedTab === 'COMMERCIAL' ? 'commercial-project' : 'project'}/${activeHeroData.slug}`}
//                 className="inline-flex items-center gap-4 bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-[#F58220] hover:text-white transition-colors group"
//               >
//                 Explore Property 
//                 <div className="w-8 h-8 rounded-full border border-black group-hover:border-white flex items-center justify-center transition-colors">
//                   <MoveRight size={16} />
//                 </div>
//               </Link>
//             ) : (
//               <p className="text-[#F58220] font-bold uppercase tracking-widest">No Projects Available</p>
//             )}
//           </div>

//         </div>
//       </section>

//       {/* ==========================================
//           HORIZONTAL INTERACTIVE GALLERY
//       ========================================== */}
//       <section className="w-full pb-12 px-6 md:px-12 z-20">
//         <div className="flex items-center gap-4 mb-6">
//           <div className="h-px bg-white/20 flex-1"></div>
//           <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Hover to Preview • Scroll to Explore</span>
//           <div className="h-px bg-white/20 flex-1"></div>
//         </div>

//         {isLoading ? (
//           <div className="flex gap-4 h-[35vh] animate-pulse">
//             {[1,2,3,4].map(i => <div key={i} className="min-w-[280px] md:min-w-[400px] h-full bg-white/10 rounded-[2rem]"></div>)}
//           </div>
//         ) : (
//           <div 
//             ref={sliderRef}
//             className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8"
//           >
//             {allProjects.map((project) => {
//               const isCommercialException = project.title === 'Kumar Corp Commercials';
//               const imageSrc = isCommercialException 
//                 ? 'https://kpassets.kumarworld.com/assets/common/uploads/files/aa326577-f4dd-4ee7-816f-e0123d4ee794.jpg' 
//                 : project.title_image[0];

//               const route = selectedTab === 'COMMERCIAL' ? 'commercial-project' : 'project';

//               return (
//                 <Link
//                   key={project.id}
//                   href={`/${route}/${project.slug}`}
//                   onMouseEnter={() => setCurrentProjectDetails(project)}
//                   onMouseLeave={() => setCurrentProjectDetails(null)}
//                   className="group relative flex-shrink-0 w-[75vw] md:w-[400px] h-[35vh] snap-center rounded-[2rem] overflow-hidden cursor-pointer bg-gray-900 border border-white/10 hover:border-white/40 transition-all duration-500"
//                 >
//                   <Image 
//                     src={imageSrc} 
//                     alt={project.title}
//                     fill
//                     className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-[1.5s] ease-out group-hover:scale-105"
//                     sizes="(max-width: 768px) 75vw, 400px"
//                   />
                  
//                   {/* Internal Card Badges */}
//                   <div className="absolute top-6 left-6 flex gap-2">
//                     <span className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
//                       {project.status}
//                     </span>
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         )}
//       </section>

//       {/* ==========================================
//           ADVANCED FILTER DRAWER (Desktop & Mobile)
//       ========================================== */}
//       <div className={`fixed inset-0 z-50 pointer-events-none ${isMobileFilterOpen ? 'pointer-events-auto' : ''}`}>
//         <div 
//           className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-500 ${isMobileFilterOpen ? 'opacity-100' : 'opacity-0'}`}
//           onClick={() => setIsMobileFilterOpen(false)}
//         />
        
//         <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-[#faf6f0] text-black shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//           <div className="p-8 border-b border-gray-200 flex justify-between items-center">
//             <h3 className="text-2xl font-black uppercase tracking-tighter">Refine Search</h3>
//             <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 hover:rotate-90 transition-transform">
//               <X size={24} />
//             </button>
//           </div>

//           <div className="p-8 flex-1 overflow-y-auto space-y-8">
            
//             {/* City */}
//             <div className="flex flex-col gap-2">
//               <label className="text-xs font-bold uppercase tracking-widest text-gray-500">City</label>
//               <div className="relative group">
//                 <select value={selectedCityId} onChange={onCitySelect} className="w-full appearance-none bg-white border border-gray-300 py-4 pl-4 pr-10 rounded-xl font-bold focus:border-black outline-none cursor-pointer">
//                   <option value="">Select City</option>
//                   {cities.map(c => (
//                     // Logic from Angular to only show cities with properties for the active tab
//                     ((selectedTab === 'RESIDENTIAL' && c.residential_property_count > 0) || 
//                      (selectedTab === 'COMMERCIAL' && c.commercial_property_count > 0)) &&
//                     <option key={c.city_id} value={c.city_id}>{c.name}</option>
//                   ))}
//                 </select>
//                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
//               </div>
//             </div>

//             {/* Location */}
//             <div className="flex flex-col gap-2">
//               <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Location</label>
//               <div className="relative group">
//                 <select value={selectedLocationId} onChange={onLocationSelect} disabled={!selectedCityId} className="w-full appearance-none bg-white border border-gray-300 py-4 pl-4 pr-10 rounded-xl font-bold focus:border-black outline-none cursor-pointer disabled:opacity-50">
//                   <option value="">Select Location</option>
//                   {locations.map(l => <option key={l.location_id} value={l.location_id}>{l.name}</option>)}
//                 </select>
//                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
//               </div>
//             </div>

//             {/* Config (Only for Residential) */}
//             {selectedTab === 'RESIDENTIAL' && (
//               <div className="flex flex-col gap-2">
//                 <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Configuration</label>
//                 <div className="relative group">
//                   <select value={selectedConfig} onChange={e => { setSelectedConfig(e.target.value); executeSearch(selectedCityId, selectedLocationId, e.target.value, selectedStatus, selectedTab); }} className="w-full appearance-none bg-white border border-gray-300 py-4 pl-4 pr-10 rounded-xl font-bold focus:border-black outline-none cursor-pointer">
//                     <option value="">All Configurations</option>
//                     {aptTypes.length > 0 
//                       ? aptTypes.map(apt => <option key={apt} value={apt}>{apt}</option>)
//                       : ['1 BHK', '2 BHK', '3 BHK', '3.5 BHK', '4.5 BHK'].map(apt => <option key={apt} value={apt}>{apt}</option>) // Static fallback from Angular
//                     }
//                   </select>
//                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
//                 </div>
//               </div>
//             )}

//             {/* Status */}
//             <div className="flex flex-col gap-2">
//               <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Status</label>
//               <div className="relative group">
//                 <select value={selectedStatus} onChange={e => { setSelectedStatus(e.target.value); executeSearch(selectedCityId, selectedLocationId, selectedConfig, e.target.value, selectedTab); }} className="w-full appearance-none bg-white border border-gray-300 py-4 pl-4 pr-10 rounded-xl font-bold focus:border-black outline-none cursor-pointer">
//                   <option value="all">All</option>
//                   <option value="Ongoing">Ongoing</option>
//                   <option value="New">New Launch</option>
//                   <option value="Sold">Sold</option>
//                 </select>
//                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
//               </div>
//             </div>
            
//           </div>

//           <div className="p-8 bg-white border-t border-gray-200 flex gap-4">
//             <button onClick={handleClearFilters} className="flex-1 py-4 font-bold text-gray-500 hover:text-black">Clear</button>
//             <button onClick={handleApply} className="flex-[2] py-4 bg-black text-white rounded-full font-bold uppercase tracking-widest hover:bg-[#F58220] transition-colors">Apply Filters</button>
//           </div>
//         </div>
//       </div>

//       <style dangerouslySetInnerHTML={{__html: `
//         .hide-scrollbar::-webkit-scrollbar { display: none; }
//         .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//       `}} />
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect, useRef, useMemo } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import gsap from 'gsap';
// import { ArrowUpRight, MapPin, Wind, Sparkles, Building2 } from 'lucide-react';

// // ==========================================
// // 1. DATA MODEL
// // ==========================================
// type Category = 'ALL' | 'RESIDENTIAL' | 'COMMERCIAL';

// interface ExhibitionSpace {
//   id: string;
//   slug: string;
//   title: string;
//   tagline: string;
//   category: Category;
//   status: string;
//   price: string;
//   location: string;
//   area: string;
//   image: string;
// }

// const EXHIBITION_DATA: ExhibitionSpace[] = [
//   {
//     id: 'e1', slug: 'the-parc-reserve', title: 'The Parc Reserve', tagline: 'Biophilic Living', category: 'RESIDENTIAL', status: 'Ongoing',
//     price: '₹4.5 Cr', location: 'Kalyani Nagar', area: '2,800 sq.ft',
//     image: 'https://images.unsplash.com/photo-1600607687931-cebf004f560a?auto=format&fit=crop&q=80&w=1600'
//   },
//   {
//     id: 'e2', slug: 'opus-business', title: 'Opus Business Park', tagline: 'Grade-A Workspaces', category: 'COMMERCIAL', status: 'Ready',
//     price: '₹12.0 Cr', location: 'Kharadi', area: '5,000 sq.ft',
//     image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600'
//   },
//   {
//     id: 'e3', slug: 'aether-residences', title: 'Aether Residences', tagline: 'Skyline Architecture', category: 'RESIDENTIAL', status: 'Pre-Launch',
//     price: '₹2.8 Cr', location: 'Baner', area: '1,200 sq.ft',
//     image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1600'
//   },
//   {
//     id: 'e4', slug: 'lumiere-estates', title: 'Lumiere Estates', tagline: 'Heritage Meets Horizon', category: 'RESIDENTIAL', status: 'Ongoing',
//     price: '₹7.5 Cr', location: 'Worli', area: '4,000 sq.ft',
//     image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600'
//   },
//   {
//     id: 'e5', slug: 'kumar-icon', title: 'Kumar Icon', tagline: 'Urban Retail', category: 'COMMERCIAL', status: 'Ready',
//     price: '₹9.0 Cr', location: 'Camp', area: '3,500 sq.ft',
//     image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1600'
//   }
// ];

// // ==========================================
// // 2. MAIN COMPONENT
// // ==========================================
// export default function ProjectListingClient() {
//   const [activeCategory, setActiveCategory] = useState<Category>('ALL');
//   const [hoveredIndex, setHoveredIndex] = useState<number | null>(0); // Default open first card on desktop
//   const pageRef = useRef<HTMLDivElement>(null);

//   const filteredSpaces = useMemo(() => {
//     if (activeCategory === 'ALL') return EXHIBITION_DATA;
//     return EXHIBITION_DATA.filter(s => s.category === activeCategory);
//   }, [activeCategory]);

//   // Entrance Animations
//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       // Header & Text Reveal
//       gsap.fromTo('.anim-reveal', 
//         { y: 30, opacity: 0 },
//         { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: 'expo.out' }
//       );
      
//       // Accordion Panel Reveal
//       gsap.fromTo('.accordion-panel',
//         { x: 100, opacity: 0 },
//         { x: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
//       );
//     }, pageRef);
//     return () => ctx.revert();
//   }, []);

//   return (
//     <div ref={pageRef} className="h-screen w-full bg-[#faf6f0] text-black overflow-hidden flex flex-col selection:bg-[#00A79D] selection:text-white">
      
//       {/* ==========================================
//           HEADER: ULTRA MINIMAL
//       ========================================== */}
//       <header className="px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 z-20 shrink-0">
//         <div>
//           <h1 className="anim-reveal text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
//             The <span className="text-[#F58220]">Portfolio.</span>
//           </h1>
//           <p className="anim-reveal text-lg font-special italic text-gray-500 mt-2">
//             Curated spaces for the modern visionary.
//           </p>
//         </div>

//         {/* Floating Filter Tabs */}
//         <div className="anim-reveal flex bg-white/50 backdrop-blur-md p-1 rounded-full border border-gray-200 shadow-sm">
//           {(['ALL', 'RESIDENTIAL', 'COMMERCIAL'] as Category[]).map(cat => (
//             <button 
//               key={cat}
//               onClick={() => setActiveCategory(cat)}
//               className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-all duration-500 ${activeCategory === cat ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>
//       </header>

//       {/* ==========================================
//           THE SPATIAL ACCORDION GALLERY
//       ========================================== */}
//       <main className="flex-1 w-full px-6 md:px-12 pb-12 flex items-center justify-center overflow-hidden">
        
//         {/* Horizontal scroll container for mobile, flex accordion for desktop */}
//         <div className="w-full h-full max-h-[75vh] flex gap-4 overflow-x-auto snap-x snap-mandatory md:overflow-hidden hide-scrollbar">
          
//           {filteredSpaces.map((space, index) => {
//             const isHovered = hoveredIndex === index;
//             const num = (index + 1).toString().padStart(2, '0');

//             return (
//               <div 
//                 key={space.id}
//                 onMouseEnter={() => setHoveredIndex(index)}
//                 onMouseLeave={() => setHoveredIndex(null)}
//                 className={`accordion-panel group relative h-full flex-shrink-0 snap-center rounded-[2rem] overflow-hidden cursor-pointer bg-gray-200 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]
//                   /* MOBILE: Fixed width blocks */
//                   w-[85vw] 
//                   /* DESKTOP: Elastic width based on hover state */
//                   md:w-[15vw] ${isHovered ? 'md:!w-[50vw]' : 'md:hover:w-[20vw]'}
//                 `}
//               >
                
//                 {/* Background Image */}
//                 <Image 
//                   src={space.image} 
//                   alt={space.title}
//                   fill
//                   className={`object-cover transition-transform duration-[2s] ease-out ${isHovered ? 'scale-105' : 'scale-100 grayscale-[30%]'}`}
//                   sizes="(max-width: 768px) 100vw, 50vw"
//                   priority={index < 2}
//                 />
                
//                 {/* Gradient Overlays */}
//                 <div className={`absolute inset-0 transition-opacity duration-700 ${isHovered ? 'bg-gradient-to-t from-black/80 via-black/20 to-transparent' : 'bg-black/40'}`}></div>

//                 {/* --------------------------------------
//                     STATE 1: COLLAPSED VIEW (Desktop Only)
//                 -------------------------------------- */}
//                 <div className={`absolute inset-0 p-8 flex flex-col justify-end transition-opacity duration-500 hidden md:flex ${isHovered ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
//                   <span className="text-4xl font-black text-white/50 mb-4">{num}</span>
//                   <div className="flex items-center">
//                     {/* Vertical Text */}
//                     <h2 className="text-2xl font-bold text-white whitespace-nowrap transform -rotate-180" style={{ writingMode: 'vertical-rl' }}>
//                       {space.title}
//                     </h2>
//                   </div>
//                 </div>

//                 {/* --------------------------------------
//                     STATE 2: EXPANDED VIEW
//                 -------------------------------------- */}
//                 <div className={`absolute inset-0 p-8 md:p-12 flex flex-col justify-between transition-opacity duration-[800ms] delay-100 ${isHovered ? 'opacity-100' : 'md:opacity-0 md:pointer-events-none'}`}>
                  
//                   {/* Top Bar */}
//                   <div className="flex justify-between items-start text-white w-full">
//                     <span className="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
//                       {space.status}
//                     </span>
//                     <span className="text-6xl md:text-8xl font-black text-white/20 leading-none">{num}</span>
//                   </div>

//                   {/* Bottom Content Area */}
//                   <div className="w-full flex flex-col md:flex-row justify-between items-end gap-8">
                    
//                     {/* Title & Specs */}
//                     <div className="text-white flex-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-700 delay-100">
//                       <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-2">{space.title}</h2>
//                       <p className="text-xl md:text-2xl font-special italic text-[#F58220] mb-8">{space.tagline}</p>
                      
//                       <div className="flex flex-wrap items-center gap-6 text-sm font-medium tracking-wide">
//                         <span className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"><MapPin size={16} /> {space.location}</span>
//                         <span className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"><Building2 size={16} /> {space.area}</span>
//                       </div>
//                     </div>

//                     {/* Price & CTA */}
//                     <div className="w-full md:w-auto text-left md:text-right border-t md:border-t-0 md:border-l border-white/20 pt-6 md:pt-0 md:pl-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-700 delay-150">
//                       <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Starting At</p>
//                       <p className="text-4xl font-black text-white mb-6">{space.price}</p>
                      
//                       <Link 
//                         href={`/project/${space.slug}`}
//                         className="inline-flex items-center justify-center gap-3 w-full md:w-auto bg-[#0061AF] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-[#F58220] hover:scale-105 transition-all duration-300"
//                       >
//                         Explore <ArrowUpRight size={20} />
//                       </Link>
//                     </div>

//                   </div>
//                 </div>

//               </div>
//             );
//           })}
//         </div>
//       </main>

//       {/* Global CSS required to hide scrollbars on the mobile horizontal track */}
//       <style dangerouslySetInnerHTML={{__html: `
//         .hide-scrollbar::-webkit-scrollbar { display: none; }
//         .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//       `}} />
//     </div>
//   );
// }

// 'use client';

// import { useState, useEffect, useRef, useMemo } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import gsap from 'gsap';
// import { ArrowRight, MapPin, Layers, Maximize, MoveUpRight, SlidersHorizontal } from 'lucide-react';

// // ==========================================
// // 1. DATA MODEL
// // ==========================================
// type Category = 'ALL' | 'RESIDENTIAL' | 'COMMERCIAL';

// interface Space {
//   id: string;
//   slug: string;
//   title: string;
//   subtitle: string;
//   category: Category;
//   status: string;
//   price: string;
//   location: string;
//   specs: { type: string; area: string; highlight: string };
//   image: string;
// }

// const SPACES: Space[] = [
//   {
//     id: 's1', slug: 'the-parc-reserve', title: 'The Parc Reserve', subtitle: 'Biophilic Living', category: 'RESIDENTIAL', status: 'Under Construction',
//     price: '₹4.5 Cr', location: 'Kalyani Nagar, Pune',
//     specs: { type: '3 & 4.5 BHK', area: '2,800 sq.ft', highlight: 'Private Pools' },
//     image: 'https://images.unsplash.com/photo-1600607687931-cebf004f560a?auto=format&fit=crop&q=80&w=1600'
//   },
//   {
//     id: 's2', slug: 'opus-business', title: 'Opus Business Park', subtitle: 'Grade-A Workspaces', category: 'COMMERCIAL', status: 'Ready to Move',
//     price: '₹12.0 Cr', location: 'Kharadi, Pune',
//     specs: { type: 'Commercial', area: '5,000+ sq.ft', highlight: 'LEED Platinum' },
//     image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600'
//   },
//   {
//     id: 's3', slug: 'aether-residences', title: 'Aether Residences', subtitle: 'Skyline Architecture', category: 'RESIDENTIAL', status: 'Pre-Launch',
//     price: '₹2.8 Cr', location: 'Baner, Pune',
//     specs: { type: '2 & 3 BHK', area: '1,200 sq.ft', highlight: 'Infinity Edge' },
//     image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1600'
//   },
//   {
//     id: 's4', slug: 'lumiere-estates', title: 'Lumiere Estates', subtitle: 'Heritage Meets Horizon', category: 'RESIDENTIAL', status: 'Ongoing',
//     price: '₹7.5 Cr', location: 'Worli, Mumbai',
//     specs: { type: '4 & 5 BHK', area: '4,000 sq.ft', highlight: 'Sea View' },
//     image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600'
//   }
// ];

// // ==========================================
// // 2. MAIN COMPONENT
// // ==========================================
// export default function ProjectListingClient() {
//   const [activeCategory, setActiveCategory] = useState<Category>('ALL');
//   const mainRef = useRef<HTMLDivElement>(null);

//   // Filter Logic
//   const filteredSpaces = useMemo(() => {
//     if (activeCategory === 'ALL') return SPACES;
//     return SPACES.filter(s => s.category === activeCategory);
//   }, [activeCategory]);

//   // Entrance Animations
//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       // Left Panel Stagger
//       gsap.fromTo('.reveal-el', 
//         { y: 50, opacity: 0 },
//         { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power4.out' }
//       );
      
//       // Right Panel Cards
//       gsap.fromTo('.stack-card',
//         { y: 150, opacity: 0, scale: 0.95 },
//         { y: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.2, ease: 'expo.out', delay: 0.3 }
//       );
//     }, mainRef);
//     return () => ctx.revert();
//   }, [activeCategory]);

//   return (
//     <div ref={mainRef} className="bg-[#faf6f0] min-h-screen text-black selection:bg-[#F58220] selection:text-white relative">
      
//       <div className="flex flex-col lg:flex-row w-full max-w-[1800px] mx-auto relative">
        
//         {/* ==========================================
//             LEFT PANEL: STICKY COMMAND HUB
//         ========================================== */}
//         <div className="w-full lg:w-[40%] lg:h-screen lg:sticky top-0 pt-32 pb-12 px-6 md:px-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-200 z-10 bg-[#faf6f0]">
          
//           <div>
//             <div className="reveal-el mb-4 flex items-center gap-3 text-[#0061AF] font-bold tracking-widest uppercase text-sm">
//               <div className="w-2 h-2 rounded-full bg-[#0061AF]"></div>
//               Real Estate Portfolio
//             </div>
            
//             <h1 className="reveal-el text-6xl md:text-7xl xl:text-[6rem] font-black tracking-tighter leading-[0.9] mb-8">
//               Curated <br />
//               <span className="font-special italic text-gray-400 font-light tracking-tight">Spaces.</span>
//             </h1>

//             <p className="reveal-el text-lg font-medium text-gray-500 max-w-sm mb-16">
//               Discover unparalleled architectural masterpieces designed for modern living and enterprise.
//             </p>

//             {/* Elegant Minimalist Filter */}
//             <div className="reveal-el flex flex-col gap-6">
//               <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Filter by Category</h3>
//               <div className="flex flex-wrap gap-4">
//                 {(['ALL', 'RESIDENTIAL', 'COMMERCIAL'] as Category[]).map(cat => (
//                   <button 
//                     key={cat}
//                     onClick={() => setActiveCategory(cat)}
//                     className={`relative px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 ${activeCategory === cat ? 'bg-black text-white' : 'bg-transparent border border-gray-300 text-gray-500 hover:border-black hover:text-black'}`}
//                   >
//                     {cat}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="reveal-el hidden lg:flex items-center justify-between border-t border-gray-200 pt-8 mt-12">
//             <div className="flex items-center gap-3">
//               <SlidersHorizontal size={20} className="text-gray-400" />
//               <span className="font-bold text-gray-400 uppercase tracking-widest text-xs">Advanced Search</span>
//             </div>
//             <span className="text-4xl font-black">{String(filteredSpaces.length).padStart(2, '0')}</span>
//           </div>
//         </div>

//         {/* ==========================================
//             RIGHT PANEL: THE STACKING SCROLL
//         ========================================== */}
//         <div className="w-full lg:w-[60%] px-6 md:px-12 py-12 lg:py-32 relative">
          
//           <div className="flex flex-col gap-[10vh] pb-[20vh]">
//             {filteredSpaces.map((space, index) => {
              
//               // Calculate sticky offset so they stack like a deck of cards
//               // E.g., Card 1 stops at top-32, Card 2 stops at top-40, etc.
//               const stickyTopOffset = `calc(6rem + ${index * 2}rem)`; 

//               return (
//                 <div 
//                   key={space.id} 
//                   className="stack-card sticky z-10 w-full"
//                   style={{ top: stickyTopOffset }}
//                 >
//                   <Link 
//                     href={`/project/${space.slug}`} 
//                     className="group block relative w-full h-[65vh] md:h-[75vh] rounded-[2rem] overflow-hidden shadow-[0_-20px_40px_rgb(0,0,0,0.05)] bg-white transform transition-transform duration-500 hover:-translate-y-2"
//                   >
                    
//                     {/* Background Image */}
//                     <Image 
//                       src={space.image} 
//                       alt={space.title}
//                       fill
//                       className="object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
//                       sizes="(max-width: 1024px) 100vw, 60vw"
//                     />
                    
//                     {/* Gradient Overlay */}
//                     <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80"></div>

//                     {/* Top Badges */}
//                     <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
//                       <div className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-bold uppercase tracking-widest">
//                         {space.status}
//                       </div>
//                       <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#F58220] group-hover:border-[#F58220] transition-colors">
//                         <MoveUpRight size={20} />
//                       </div>
//                     </div>

//                     {/* Bottom Data Overlay (Architectural Blueprint Style) */}
//                     <div className="absolute bottom-6 left-6 right-6 bg-black/40 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-6 text-white overflow-hidden">
//                       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        
//                         <div className="flex-1">
//                           <h2 className="text-3xl md:text-4xl font-black mb-1 group-hover:text-[#F58220] transition-colors">{space.title}</h2>
//                           <p className="text-lg font-special italic text-gray-300 mb-6">{space.subtitle}</p>
                          
//                           <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium tracking-wide">
//                             <span className="flex items-center gap-2"><MapPin size={16} className="text-[#00A79D]" /> {space.location}</span>
//                             <span className="hidden md:block w-1 h-1 rounded-full bg-white/30"></span>
//                             <span className="flex items-center gap-2"><Layers size={16} className="text-[#00A79D]" /> {space.specs.type}</span>
//                             <span className="hidden md:block w-1 h-1 rounded-full bg-white/30"></span>
//                             <span className="flex items-center gap-2"><Maximize size={16} className="text-[#00A79D]" /> {space.specs.area}</span>
//                           </div>
//                         </div>

//                         <div className="text-left md:text-right border-t md:border-t-0 md:border-l border-white/20 pt-4 md:pt-0 md:pl-6">
//                           <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Starting Price</p>
//                           <p className="text-3xl font-black whitespace-nowrap">{space.price}</p>
//                         </div>

//                       </div>
//                     </div>

//                   </Link>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }



// 'use client';

// import { useState, useEffect, useRef, useMemo } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import gsap from 'gsap';
// import { Search, Sliders, X, ArrowUpRight, MapPin, Building2, Wind } from 'lucide-react';

// // ==========================================
// // 1. DATA MODEL
// // ==========================================
// type ProjectType = 'RESIDENTIAL' | 'COMMERCIAL' | 'MIXED USE';

// interface LookbookProject {
//   id: string;
//   slug: string;
//   title: string;
//   tagline: string;
//   status: 'Pre-Launch' | 'Under Construction' | 'Ready';
//   type: ProjectType;
//   priceStart: number;
//   location: string;
//   specs: string[];
//   image: string;
// }

// const MOCK_DATA: LookbookProject[] = [
//   {
//     id: 'p1', slug: 'the-parc-reserve', title: 'The Parc Reserve', tagline: 'Biophilic Living at its Zenith', status: 'Under Construction', type: 'RESIDENTIAL',
//     priceStart: 45000000, location: 'Kalyani Nagar, Pune', specs: ['3 & 4.5 BHK', '2,800 sq.ft', '32 Floors'],
//     image: 'https://images.unsplash.com/photo-1600607687931-cebf004f560a?auto=format&fit=crop&q=80&w=1600',
//   },
//   {
//     id: 'p2', slug: 'opus-commercial', title: 'Opus Business Park', tagline: 'The New Geometry of Work', status: 'Ready', type: 'COMMERCIAL',
//     priceStart: 120000000, location: 'Kharadi, Pune', specs: ['Grade A Office', 'LEED Platinum', 'Helipad'],
//     image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600',
//   },
//   {
//     id: 'p3', slug: 'aether-residences', title: 'Aether Residences', tagline: 'Sculpted from the Sky', status: 'Pre-Launch', type: 'RESIDENTIAL',
//     priceStart: 28000000, location: 'Baner, Pune', specs: ['2 & 3 BHK', 'Smart Home', 'Infinity Pool'],
//     image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1600',
//   },
//   {
//     id: 'p4', slug: 'lumiere-estates', title: 'Lumiere Estates', tagline: 'Heritage Meets Horizon', status: 'Under Construction', type: 'RESIDENTIAL',
//     priceStart: 75000000, location: 'Worli, Mumbai', specs: ['4 & 5 BHK', 'Sea View', 'Private Elevator'],
//     image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600',
//   }
// ];

// // ==========================================
// // 2. COMPONENT
// // ==========================================
// export default function ProjectListingClient() {
//   const [projects] = useState<LookbookProject[]>(MOCK_DATA);
//   const [isCommandOpen, setIsCommandOpen] = useState(false);
//   const [activeType, setActiveType] = useState<string>('ALL');
  
//   const containerRef = useRef<HTMLDivElement>(null);

//   // Initial Entrance Animation
//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.fromTo('.anim-title', 
//         { y: 150, opacity: 0, rotateX: -30 },
//         { y: 0, opacity: 1, rotateX: 0, duration: 1.5, stagger: 0.1, ease: 'expo.out' }
//       );
//       gsap.fromTo('.anim-line',
//         { scaleX: 0 },
//         { scaleX: 1, duration: 1.5, ease: 'power3.inOut', delay: 0.5 }
//       );
//       gsap.fromTo('.lookbook-item',
//         { y: 100, opacity: 0 },
//         { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: 'power3.out', delay: 0.8 }
//       );
//     }, containerRef);
//     return () => ctx.revert();
//   }, []);

//   // Format Currency
//   const formatPrice = (val: number) => {
//     return val >= 10000000 ? `₹${(val / 10000000).toFixed(1)} Cr` : `₹${(val / 100000).toFixed(1)} L`;
//   };

//   const filteredProjects = useMemo(() => {
//     if (activeType === 'ALL') return projects;
//     return projects.filter(p => p.type === activeType);
//   }, [activeType, projects]);

//   return (
//     <div ref={containerRef} className="min-h-screen bg-[#faf6f0] text-black selection:bg-[#0061AF] selection:text-white relative pb-40">
      
//       {/* --- HERO SECTION --- */}
//       <section className="pt-32 pb-20 px-6 md:px-12 lg:px-20 max-w-[1800px] mx-auto">
//         <div className="flex flex-col md:flex-row justify-between items-end gap-10">
//           <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-[0.85] uppercase">
//             <div className="overflow-hidden"><span className="block anim-title">The</span></div>
//             <div className="overflow-hidden text-[#F58220]"><span className="block anim-title">Collection</span></div>
//           </h1>
//           <div className="max-w-sm text-right overflow-hidden pb-2">
//             <p className="text-xl md:text-2xl font-special italic text-gray-500 anim-title">
//               A curated portfolio of architectural brilliance and bespoke spaces.
//             </p>
//           </div>
//         </div>
//         <div className="w-full h-[2px] bg-black mt-16 origin-left anim-line"></div>
//       </section>

//       {/* --- LOOKBOOK GALLERY --- */}
//       <section className="px-6 md:px-12 lg:px-20 max-w-[1800px] mx-auto mt-12 flex flex-col gap-32 md:gap-48">
//         {filteredProjects.map((project, index) => {
//           const num = (index + 1).toString().padStart(2, '0');
//           // Alternate layouts to break the grid
//           const isEven = index % 2 === 0;
//           const isFullBleed = index % 3 === 2; // Every 3rd item is massive

//           if (isFullBleed) {
//             // FULL BLEED CINEMATIC LAYOUT
//             return (
//               <Link href={`/project/${project.slug}`} key={project.id} className="lookbook-item group relative block w-full h-[70vh] md:h-[85vh] rounded-3xl overflow-hidden">
//                 <Image src={project.image} alt={project.title} fill className="object-cover transition-transform duration-[2s] group-hover:scale-105" sizes="100vw" />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
//                 <div className="absolute inset-0 p-10 md:p-16 flex flex-col justify-between">
//                   <div className="flex justify-between items-start text-white">
//                     <span className="text-sm font-bold uppercase tracking-[0.3em] px-4 py-2 border border-white/30 rounded-full backdrop-blur-md bg-black/20">
//                       {project.status}
//                     </span>
//                     <span className="text-8xl md:text-[12rem] font-black opacity-20 leading-none">{num}</span>
//                   </div>
//                   <div className="text-white">
//                     <h2 className="text-5xl md:text-8xl font-black mb-4 group-hover:text-[#FFD12E] transition-colors">{project.title}</h2>
//                     <p className="text-2xl font-special italic opacity-80 mb-8">{project.tagline}</p>
//                     <div className="flex items-center gap-6">
//                       <span className="text-xl font-bold bg-white text-black px-6 py-3 rounded-full">Starts {formatPrice(project.priceStart)}</span>
//                       <div className="w-12 h-12 rounded-full border border-white flex items-center justify-center group-hover:bg-[#FFD12E] group-hover:border-[#FFD12E] group-hover:text-black transition-all">
//                         <ArrowUpRight size={24} />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             );
//           }

//           // ASYMMETRICAL OVERLAP LAYOUT
//           return (
//             <div key={project.id} className={`lookbook-item relative flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 md:gap-0`}>
              
//               {/* Giant Background Number */}
//               <div className={`absolute top-1/2 -translate-y-1/2 ${isEven ? 'right-0' : 'left-0'} text-[15rem] md:text-[25rem] font-black text-gray-100 -z-10 leading-none pointer-events-none select-none`}>
//                 {num}
//               </div>

//               {/* Image Block */}
//               <Link href={`/project/${project.slug}`} className="relative w-full md:w-3/5 h-[50vh] md:h-[70vh] group overflow-hidden rounded-[2rem] z-10">
//                 <Image src={project.image} alt={project.title} fill className="object-cover transition-transform duration-[1.5s] group-hover:scale-110" sizes="(max-width: 768px) 100vw, 60vw" />
//                 <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700"></div>
//               </Link>

//               {/* Content Block (Physically overlaps the image on desktop) */}
//               <div className={`w-full md:w-[45%] bg-white/90 backdrop-blur-xl p-8 md:p-12 lg:p-16 rounded-[2rem] shadow-[0_30px_60px_rgb(0,0,0,0.08)] z-20 ${isEven ? 'md:-ml-20' : 'md:-mr-20'}`}>
//                 <div className="flex items-center gap-3 mb-6">
//                   <span className="w-2 h-2 rounded-full bg-[#00A79D]"></span>
//                   <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">{project.status}</span>
//                 </div>
                
//                 <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">{project.title}</h2>
//                 <p className="text-xl md:text-2xl font-special italic text-[#0061AF] mb-10">{project.tagline}</p>
                
//                 <div className="space-y-4 mb-10">
//                   <div className="flex items-center gap-4 text-gray-600 font-medium pb-4 border-b border-gray-100">
//                     <MapPin size={20} className="text-[#F58220]" /> {project.location}
//                   </div>
//                   <div className="flex items-center gap-4 text-gray-600 font-medium pb-4 border-b border-gray-100">
//                     <Building2 size={20} className="text-[#F58220]" /> {project.specs.join(' • ')}
//                   </div>
//                 </div>

//                 <div className="flex justify-between items-end">
//                   <div>
//                     <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Investment</p>
//                     <p className="text-3xl font-black">{formatPrice(project.priceStart)}</p>
//                   </div>
//                   <Link href={`/project/${project.slug}`} className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center hover:bg-[#F58220] hover:-translate-y-1 transition-all duration-300">
//                     <ArrowUpRight size={24} />
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </section>

//       {/* --- THE FLOATING COMMAND PALETTE TOGGLE (Dock) --- */}
//       <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
//         <button 
//           onClick={() => setIsCommandOpen(true)}
//           className="group flex items-center gap-4 bg-black/90 backdrop-blur-md text-white px-6 py-4 rounded-full shadow-[0_20px_40px_rgb(0,0,0,0.2)] hover:bg-[#F58220] hover:scale-105 transition-all duration-300 ease-out"
//         >
//           <Search size={20} />
//           <span className="font-bold tracking-wide">Explore & Filter</span>
//           <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
//             {filteredProjects.length} Spaces
//           </div>
//         </button>
//       </div>

//       {/* --- FULLSCREEN COMMAND PALETTE (Blur Modal) --- */}
//       <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${isCommandOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
//         <div className="absolute inset-0 bg-[#faf6f0]/80 backdrop-blur-xl" onClick={() => setIsCommandOpen(false)}></div>
        
//         <div className={`relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isCommandOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'}`}>
          
//           <div className="flex items-center p-6 md:p-8 border-b border-gray-100">
//             <Search size={28} className="text-gray-300 mr-4" />
//             <input 
//               type="text" 
//               placeholder="Search by city, neighborhood, or lifestyle..." 
//               className="flex-1 text-2xl md:text-3xl font-bold bg-transparent outline-none placeholder:text-gray-300 text-black"
//               autoFocus={isCommandOpen}
//             />
//             <button onClick={() => setIsCommandOpen(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors ml-4">
//               <X size={28} className="text-gray-400" />
//             </button>
//           </div>

//           <div className="p-6 md:p-8 bg-gray-50 flex flex-col md:flex-row gap-12">
            
//             {/* Quick Type Toggles */}
//             <div className="flex-1">
//               <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Property Type</h4>
//               <div className="flex flex-col gap-2">
//                 {['ALL', 'RESIDENTIAL', 'COMMERCIAL'].map(type => (
//                   <button 
//                     key={type}
//                     onClick={() => { setActiveType(type); setIsCommandOpen(false); }}
//                     className={`text-left text-xl md:text-2xl font-black py-2 px-4 rounded-xl transition-all ${activeType === type ? 'bg-black text-white' : 'text-gray-400 hover:text-black hover:bg-gray-200'}`}
//                   >
//                     {type === 'ALL' ? 'Everything' : type}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Quick Filter Tags */}
//             <div className="flex-[2]">
//               <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Curated Lifestyles</h4>
//               <div className="flex flex-wrap gap-3">
//                 {['Ready to Move', 'Penthouse Collection', 'Sea View', 'Grade A Office', 'Under 5 Cr', 'Smart Homes'].map(tag => (
//                   <button key={tag} className="px-5 py-3 rounded-full border border-gray-200 text-sm font-bold text-gray-600 hover:border-black hover:text-black transition-colors">
//                     {tag}
//                   </button>
//                 ))}
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>

//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect, useRef, useMemo } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import gsap from 'gsap';
// import { Sliders, X, ArrowUpRight, MapPin, Wind, Maximize, Compass } from 'lucide-react';

// // ==========================================
// // 1. ADVANCED DATA MODEL (API READY)
// // ==========================================
// type ProjectType = 'RESIDENTIAL' | 'COMMERCIAL' | 'MIXED USE';

// interface AdvancedProject {
//   id: string;
//   slug: string;
//   title: string;
//   tagline: string;
//   status: 'Pre-Launch' | 'Under Construction' | 'Ready to Experience';
//   type: ProjectType;
//   priceRange: { min: number; max: number };
//   location: { city: string; neighborhood: string; coords: [number, number] };
//   specs: { beds?: string[]; area: string; floors: number };
//   aesthetics: { architecture: string; lifestyleTags: string[] };
//   images: string[];
//   featured: boolean;
//   completion: number;
// }

// const MOCK_API_DATA: AdvancedProject[] = [
//   {
//     id: 'p1', slug: 'the-parc-reserve', title: 'The Parc Reserve', tagline: 'Biophilic Living at its Zenith', status: 'Under Construction', type: 'RESIDENTIAL',
//     priceRange: { min: 45000000, max: 85000000 },
//     location: { city: 'Pune', neighborhood: 'Kalyani Nagar', coords: [18.547, 73.904] },
//     specs: { beds: ['3 BHK', '4.5 BHK'], area: '2,800 - 5,400 sq.ft', floors: 32 },
//     aesthetics: { architecture: 'Neo-Modernist', lifestyleTags: ['Forest Trails', 'Zen Garden', 'Private Pools'] },
//     images: ['https://images.unsplash.com/photo-1600607687931-cebf004f560a?auto=format&fit=crop&q=80&w=1200'],
//     featured: true, completion: 45
//   },
//   {
//     id: 'p2', slug: 'opus-commercial', title: 'Opus Business Park', tagline: 'The New Geometry of Work', status: 'Ready to Experience', type: 'COMMERCIAL',
//     priceRange: { min: 120000000, max: 500000000 },
//     location: { city: 'Pune', neighborhood: 'Kharadi', coords: [18.552, 73.935] },
//     specs: { area: '5,000 - 25,000 sq.ft', floors: 45 },
//     aesthetics: { architecture: 'Parametric Glass', lifestyleTags: ['LEED Platinum', 'Helipad', 'Retail Podium'] },
//     images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200'],
//     featured: true, completion: 100
//   },
//   {
//     id: 'p3', slug: 'aether-residences', title: 'Aether Residences', tagline: 'Sculpted from the Sky', status: 'Pre-Launch', type: 'RESIDENTIAL',
//     priceRange: { min: 28000000, max: 42000000 },
//     location: { city: 'Pune', neighborhood: 'Baner', coords: [18.559, 73.786] },
//     specs: { beds: ['2 BHK', '3 BHK'], area: '1,200 - 2,100 sq.ft', floors: 24 },
//     aesthetics: { architecture: 'Minimalist', lifestyleTags: ['Smart Home', 'Infinity Pool'] },
//     images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200'],
//     featured: false, completion: 10
//   },
//   {
//     id: 'p4', slug: 'lumiere-estates', title: 'Lumiere Estates', tagline: 'Heritage Meets Horizon', status: 'Under Construction', type: 'RESIDENTIAL',
//     priceRange: { min: 75000000, max: 120000000 },
//     location: { city: 'Mumbai', neighborhood: 'Worli', coords: [19.017, 72.818] },
//     specs: { beds: ['4 BHK', '5 BHK', 'Penthouse'], area: '4,000 - 8,000 sq.ft', floors: 60 },
//     aesthetics: { architecture: 'Art Deco Revival', lifestyleTags: ['Sea View', 'Private Elevator'] },
//     images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200'],
//     featured: false, completion: 60
//   }
// ];

// // ==========================================
// // 2. MAIN COMPONENT
// // ==========================================
// export default function PremiumListing() {
//   const [projects, setProjects] = useState<AdvancedProject[]>(MOCK_API_DATA);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
  
//   // Natural Language Filter State
//   const [nlType, setNlType] = useState<string>('RESIDENTIAL');
//   const [nlCity, setNlCity] = useState<string>('Pune');
  
//   const pageRef = useRef<HTMLDivElement>(null);

//   // Initial Page Load Animation
//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       // Reveal Text
//       gsap.fromTo('.reveal-text', 
//         { y: 100, opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
//         { y: 0, opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 1.2, stagger: 0.1, ease: 'power4.out' }
//       );
      
//       // Reveal Cards
//       gsap.fromTo('.editorial-card',
//         { y: 60, opacity: 0 },
//         { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'expo.out', delay: 0.5 }
//       );
//     }, pageRef);
//     return () => ctx.revert();
//   }, []);

//   // Format Currency
//   const formatPrice = (val: number) => {
//     if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
//     return `₹${(val / 100000).toFixed(1)} L`;
//   };

//   // Filter Logic
//   const filteredProjects = useMemo(() => {
//     return projects.filter(p => 
//       (nlType === 'ANY' || p.type === nlType) && 
//       (nlCity === 'ANY' || p.location.city === nlCity)
//     );
//   }, [nlType, nlCity, projects]);

//   return (
//     <div ref={pageRef} className="min-h-screen bg-[#faf6f0] text-black selection:bg-[#F58220] selection:text-white relative overflow-hidden">
      
//       {/* ==========================================
//           HERO & NATURAL LANGUAGE SEARCH
//       ========================================== */}
//       <section className="pt-40 pb-20 px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto">
//         <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter leading-[0.9] mb-12">
//           <div className="overflow-hidden"><span className="block reveal-text">Curating the</span></div>
//           <div className="overflow-hidden"><span className="block reveal-text font-special italic text-[#0061AF] font-light tracking-tight">Extraordinary.</span></div>
//         </h1>

//         {/* Natural Language Query Builder */}
//         <div className="text-2xl md:text-4xl font-medium tracking-tight text-gray-400 max-w-5xl leading-snug reveal-text">
//           I am seeking a{' '}
//           <div className="relative inline-block group">
//             <select 
//               value={nlType} 
//               onChange={e => setNlType(e.target.value)}
//               className="appearance-none bg-transparent border-b-2 border-gray-300 text-black font-bold focus:outline-none focus:border-[#F58220] cursor-pointer pr-8 hover:border-black transition-colors"
//             >
//               <option value="ANY">Masterpiece</option>
//               <option value="RESIDENTIAL">Residence</option>
//               <option value="COMMERCIAL">Workspace</option>
//             </select>
//             <span className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-black text-xl">↓</span>
//           </div>
//           {' '}located in{' '}
//           <div className="relative inline-block group">
//             <select 
//               value={nlCity} 
//               onChange={e => setNlCity(e.target.value)}
//               className="appearance-none bg-transparent border-b-2 border-gray-300 text-black font-bold focus:outline-none focus:border-[#00A79D] cursor-pointer pr-8 hover:border-black transition-colors"
//             >
//               <option value="ANY">Any City</option>
//               <option value="Pune">Pune</option>
//               <option value="Mumbai">Mumbai</option>
//             </select>
//             <span className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-black text-xl">↓</span>
//           </div>
//           .
//         </div>
//       </section>

//       {/* ==========================================
//           EDITORIAL GRID SHOWCASE
//       ========================================== */}
//       <section className="px-6 md:px-12 lg:px-20 pb-32 max-w-[1600px] mx-auto">
//         <div className="flex justify-between items-end border-b border-gray-200 pb-6 mb-12 reveal-text">
//           <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
//             {filteredProjects.length} {filteredProjects.length === 1 ? 'Property' : 'Properties'} Found
//           </p>
//           <button 
//             onClick={() => setIsFilterOpen(true)}
//             className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest hover:text-[#F58220] transition-colors"
//           >
//             <Sliders size={18} /> Deep Filter
//           </button>
//         </div>

//         {/* Asymmetrical Grid layout */}
//         <div className="grid grid-cols-1 md:grid-cols-12 gap-y-24 md:gap-x-8 lg:gap-x-12">
//           {filteredProjects.map((project, index) => {
//             // Logic to create an asymmetrical editorial layout
//             const isWide = index % 3 === 0; 
//             const colSpan = isWide ? 'md:col-span-12 lg:col-span-8' : 'md:col-span-6 lg:col-span-4';
//             const offset = (!isWide && index % 2 !== 0) ? 'lg:mt-24' : '';

//             return (
//               <Link 
//                 href={`/project/${project.slug}`} 
//                 key={project.id}
//                 className={`editorial-card group block relative ${colSpan} ${offset}`}
//               >
//                 {/* Image Container with precise overflow and clip-path for premium feel */}
//                 <div className="relative w-full overflow-hidden bg-gray-100 rounded-[2rem]" style={{ aspectRatio: isWide ? '16/9' : '3/4' }}>
                  
//                   <Image 
//                     src={project.images[0]} 
//                     alt={project.title}
//                     fill
//                     className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
//                     sizes={isWide ? "100vw" : "50vw"}
//                     priority={index < 2}
//                   />

//                   {/* Elegant Gradient & Top Badges */}
//                   <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
//                   <div className="absolute top-6 left-6 flex gap-2 z-10">
//                     <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-black">
//                       {project.status}
//                     </span>
//                   </div>

//                   {/* View Details Hover Circle */}
//                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
//                     <div className="w-24 h-24 bg-[#F58220] rounded-full flex items-center justify-center text-white transform scale-50 group-hover:scale-100 transition-transform duration-700 ease-out">
//                       <ArrowUpRight size={32} />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Data Section underneath */}
//                 <div className="mt-8 flex flex-col md:flex-row justify-between items-start gap-6">
//                   <div className="flex-1">
//                     <h2 className="text-3xl md:text-4xl font-black mb-2 group-hover:text-[#0061AF] transition-colors">{project.title}</h2>
//                     <p className="text-xl font-special italic text-gray-500 mb-6">{project.tagline}</p>
                    
//                     <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-600">
//                       <span className="flex items-center gap-1.5"><MapPin size={16} /> {project.location.neighborhood}</span>
//                       <span className="flex items-center gap-1.5"><Maximize size={16} /> {project.specs.area}</span>
//                       <span className="flex items-center gap-1.5"><Compass size={16} /> {project.aesthetics.architecture}</span>
//                     </div>
//                   </div>

//                   <div className="text-left md:text-right">
//                     <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">Priced From</p>
//                     <p className="text-2xl font-black">{formatPrice(project.priceRange.min)}</p>
//                   </div>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       </section>

//       {/* ==========================================
//           OFF-CANVAS ADVANCED FILTER (The "Deep Filter")
//       ========================================== */}
//       <div className={`fixed inset-0 z-50 pointer-events-none ${isFilterOpen ? 'pointer-events-auto' : ''}`}>
//         {/* Backdrop */}
//         <div 
//           className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isFilterOpen ? 'opacity-100' : 'opacity-0'}`}
//           onClick={() => setIsFilterOpen(false)}
//         />
        
//         {/* Panel */}
//         <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//           <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-[#faf6f0]">
//             <h3 className="text-2xl font-black">Deep Filters</h3>
//             <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:rotate-90 transition-transform duration-300">
//               <X size={24} />
//             </button>
//           </div>

//           <div className="p-8 overflow-y-auto flex-1 space-y-10">
//             {/* Status Filter */}
//             <div>
//               <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Construction Status</label>
//               <div className="flex flex-col gap-3">
//                 {['Pre-Launch', 'Under Construction', 'Ready to Experience'].map(status => (
//                   <label key={status} className="flex items-center gap-3 cursor-pointer group">
//                     <div className="w-5 h-5 rounded border-2 border-gray-300 group-hover:border-black flex items-center justify-center transition-colors">
//                       {/* Checkbox dot pseudo-element could go here */}
//                     </div>
//                     <span className="font-medium text-lg text-gray-700 group-hover:text-black">{status}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Architecture Filter */}
//             <div>
//               <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Architectural Style</label>
//               <div className="flex flex-wrap gap-2">
//                 {['Neo-Modernist', 'Parametric Glass', 'Minimalist', 'Art Deco Revival'].map(style => (
//                   <button key={style} className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium hover:border-[#0061AF] hover:text-[#0061AF] transition-colors">
//                     {style}
//                   </button>
//                 ))}
//               </div>
//             </div>
            
//             {/* Price Slider (Visual Representation) */}
//             <div>
//               <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Investment Range</label>
//               <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
//                 <div className="h-full bg-[#0061AF] w-2/3 ml-[10%]"></div>
//               </div>
//               <div className="flex justify-between mt-3 text-sm font-bold text-gray-600">
//                 <span>₹2.5 Cr</span>
//                 <span>₹10.0+ Cr</span>
//               </div>
//             </div>
//           </div>

//           <div className="p-8 border-t border-gray-100 bg-white flex gap-4">
//             <button 
//               onClick={() => setIsFilterOpen(false)}
//               className="flex-1 py-4 font-bold text-gray-500 hover:text-black transition-colors"
//             >
//               Clear All
//             </button>
//             <button 
//               onClick={() => setIsFilterOpen(false)}
//               className="flex-[2] py-4 bg-black text-white rounded-full font-bold uppercase tracking-wide hover:bg-[#F58220] transition-colors"
//             >
//               Apply Filter
//             </button>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// }