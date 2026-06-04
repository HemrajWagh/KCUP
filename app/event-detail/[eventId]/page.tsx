'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, ArrowLeft, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { ApiService } from '../../services/api';


export default function MediaEventDetail() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Ref for animations
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!eventId) return;

    const fetchEventData = async () => {
      try {
        setLoading(true);
        
        // Fetch actual data from your backend
        const res = await ApiService.getActivityById(eventId);
        
        // Handle response (check if backend wraps it in { data: ... } or returns the object directly)
        if (res) {
          setEventData(res.data || res);
        } else {
          setEventData(null);
        }
        
      } catch (error) {
        console.error("Failed to fetch event data:", error);
        setEventData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  // GSAP Entrance Animations
  useEffect(() => {
    if (loading || !eventData || !containerRef.current) return;
    
    const ctx = gsap.context(() => {
      // Stagger the text content on the left
      gsap.fromTo(
        '.stagger-element',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
      );
      
      // Smooth scale-in for the media on the right
      gsap.fromTo(
        '.media-element',
        { scale: 0.95, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power2.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [loading, eventData]);

  // Date Formatter
  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const VIDEO_MAPPINGS: Record<string, string> = {
    'Kumar Corp Rewards & Recognition Event': 'https://www.youtube.com/embed/3QYGFeLOnkE?modestbranding=1&rel=0',
    'Kumar Corp proudly partners with The Ultimate Move-A-Thon 2025.': 'https://www.youtube.com/embed/m_lejkG1bIo?modestbranding=1&rel=0',
    'Kumar Premier League 2025': 'https://www.youtube.com/embed/BWD2Lave8N8?modestbranding=1&rel=0',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-brand-cream)] flex flex-col justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#F58220] mb-4" />
        <p className="text-gray-500 font-medium tracking-wide">Loading details...</p>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-[var(--color-brand-cream)] flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-3xl font-black mb-4">Event not found</h2>
          <button onClick={() => router.push('/media')} className="text-[#F58220] font-bold hover:underline">
            Return to Media
          </button>
        </div>
      </div>
    );
  }

  const activeVideoUrl = VIDEO_MAPPINGS[eventData.title];

  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] selection:bg-[#F58220] selection:text-white pt-28 pb-20">
      <section ref={containerRef} className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Back Button */}
        <div className="mb-10 stagger-element">
          <button 
            onClick={() => router.push('/media')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-500 hover:text-black hover:border-black hover:shadow-md transition-all duration-300 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Media</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Text & Content */}
          <div className="w-full lg:w-5/12 space-y-8 mt-2">
            <div className="stagger-element">
              {/* Date Pill */}
              <div className="inline-flex items-center gap-2 text-[#F58220] bg-[#F58220]/5 border border-[#F58220]/20 px-4 py-2 rounded-full font-bold text-sm tracking-wide mb-6">
                <Calendar size={16} />
                <span>{formatDate(eventData.date?.start_date)}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black leading-[1.1] tracking-tight">
                {eventData.title}
              </h1>
            </div>

            {/* Divider */}
            <div className="w-12 h-1 bg-[#F58220] rounded-full stagger-element"></div>

            {/* Render HTML Content safely */}
            <div 
              className="prose prose-lg prose-gray max-w-none text-gray-600 font-medium leading-relaxed stagger-element"
              dangerouslySetInnerHTML={{ __html: eventData.desc }}
            />
          </div>

          {/* Right Column: Media (Image or Iframe) */}
          <div className="w-full lg:w-7/12 media-element">
            <div className="relative w-full rounded-[1.5rem] overflow-hidden shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-gray-100 bg-white">
              
              {/* Decorative Browser-like Top Bar for Video */}
              {activeVideoUrl && (
                <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              )}

              {activeVideoUrl ? (
                <div className="relative pt-[56.25%] bg-black">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={activeVideoUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
                  <img 
                    src={eventData.thumb} 
                    alt={eventData.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle Gradient Overlay for premium feel */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60"></div>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </section>
    </main>
  );
}