"use client";

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// --- MILESTONES DATA ---
const milestones = [
  { year: "1966", text: "Founded by Mr. K.H. Oswal" },
  { year: "1975", text: "Introduced the concept of branded apartments" },
  { year: "1979", text: "Specialised in residential developments" },
  { year: "1986", text: "Expanded into premium bungalow projects" },
  { year: "1992", text: "Launched luxury mega-residential complexes; established a strong identity" },
  { year: "1995", text: "Diversified into IT parks and commercial real estate" },
  { year: "2004", text: "Marked its entry into the Mumbai market" },
  { year: "2008", text: "Ventured into large-scale integrated townships" },
  { year: "2016", text: "Ventured into Bengaluru" },
  { year: "2019", text: "Adopted next-gen construction technologies" },
  { year: "2023", text: "Evolving into Kumar Corp and taking forward the legacy" },
  { year: "2026", text: "A monumental leap to customer centricity, powered by AI innovations and Kumar Klub" }
];

export default function MilestonesTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const track = trackRef.current;
    if (!track) return;

    // 1. HORIZONTAL SCROLL PINNING (The Advanced Interaction)
    const scrollTween = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1, // Smooth, buttery scrub
        start: "top top",
        end: () => `+=${track.scrollWidth}`, // 1:1 scroll distance
        invalidateOnRefresh: true,
      }
    });

    // 2. CONTINUOUS HORSE GALLOP
    // The horse runs on a permanent loop independently of the scroll
    gsap.fromTo(".running-horse-container", 
      { x: "-20vw" }, 
      { 
        x: "120vw", 
        duration: 22, 
        repeat: -1, 
        ease: "linear" 
      }
    );

    // Organic galloping bounce
    gsap.to(".running-horse-img", {
      y: -20,
      duration: 0.35,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });

    // 3. CINEMATIC MONOLITH REVEALS
    // Cards rise and tilt into place as they enter the horizontal view
    const cards = gsap.utils.toArray('.milestone-monolith');
    cards.forEach((card: any) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          containerAnimation: scrollTween, // Links to the horizontal track
          start: "left 90%",
          toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0,
        rotateX: 10,
        duration: 1.2,
        ease: "power3.out"
      });
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative bg-[#000000] text-[#FFFFFF] h-screen overflow-hidden perspective-[1000px]">
      
      {/* ========================================= */}
      {/* BACKGROUND LAYER                          */}
      {/* ========================================= */}
      
      {/* Ambient Orange Backlight */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40 pointer-events-none">
        <div className="w-[70vw] h-[50vh] bg-[#F58220]/20 rounded-[100%] blur-[120px] mix-blend-screen animate-pulse" />
      </div>

      {/* The Running Horse (Silhouetted against the glow) */}
      <div className="running-horse-container absolute top-[45%] transform -translate-y-1/2 z-0 pointer-events-none opacity-60 flex items-center">
        <img 
          src="/assets/about-us/horse-running.png" 
          alt="Running Horse" 
          className="running-horse-img w-[450px] lg:w-[750px] object-contain filter drop-shadow-[0_0_30px_rgba(245,130,32,0.4)]" 
        />
      </div>

      {/* Fine Depth Grid */}
      <div className="absolute inset-0 z-0 bg-[url('/assets/grid-pattern.svg')] opacity-[0.04] pointer-events-none" />

      {/* ========================================= */}
      {/* THE HORIZONTAL GALLERY TRACK              */}
      {/* ========================================= */}
      
      <div ref={trackRef} className="relative h-full flex items-center w-[max-content] z-10 pt-10">
        
        {/* Continuous Ground Line (Anchors the design) */}
        <div className="absolute bottom-[15vh] left-0 w-full h-[1px] bg-white/10 z-0">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-[#F58220] to-[#F58220]/10 shadow-[0_0_20px_#F58220]" />
        </div>

        {/* 1. EDITORIAL INTRO SLIDE (Takes up exactly 100vw) */}
        <div className="w-screen h-full flex-shrink-0 flex flex-col justify-center px-8 md:px-[10%]">
          <div className="max-w-5xl relative z-20">
            <h1 className="font-['Nexa'] font-black text-6xl sm:text-8xl lg:text-[10rem] leading-[0.9] tracking-tighter uppercase relative z-20 drop-shadow-2xl">
              MILESTONES<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/80 to-white/30">THAT MOVED US</span><br />
              <span className="text-[#F58220]">FORWARD</span>
            </h1>
            <p className="font-['Bodoni_Moda'] italic text-2xl lg:text-4xl text-[#FFFFFF]/70 mt-12 max-w-2xl leading-relaxed">
              Scroll to explore a legacy built on trust, innovation, and an unwavering commitment to excellence since 1966.
            </p>
          </div>
        </div>

        {/* 2. THE GLASS MONOLITHS */}
        <div className="flex items-end gap-8 lg:gap-16 px-16 pr-[30vw] h-full pb-[15vh] z-10">
          {milestones.map((item, index) => (
            <div 
              key={index} 
              className="milestone-monolith relative flex-shrink-0 w-[350px] md:w-[450px] h-[65vh] flex flex-col justify-end"
            >
              
              {/* Ground Anchor Node */}
              <div className="absolute -bottom-[6px] left-8 w-3 h-3 bg-[#000000] border-2 border-[#F58220] rounded-full shadow-[0_0_15px_rgba(245,130,32,1)] z-30" />

              {/* The Glass Panel */}
              <div className="w-full h-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 hover:border-[#F58220]/40 transition-colors duration-700 rounded-[2.5rem] p-10 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group">
                
                {/* Internal Hover Glow */}
                <div className="absolute -inset-10 bg-gradient-to-br from-[#F58220]/0 via-[#F58220]/0 to-[#F58220]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2.5rem]" />

                {/* Massive Watermark Year (Nexa Black) */}
                <div className="absolute top-0 right-[-10%] select-none pointer-events-none z-0 transform translate-y-[-20%]">
                  <span className="font-['Nexa'] font-black text-[12rem] md:text-[16rem] leading-none text-transparent stroke-text opacity-[0.15] group-hover:opacity-[0.25] transition-opacity duration-700"
                        style={{ WebkitTextStroke: "2px #FFFFFF" }}>
                    {item.year.substring(2)} {/* Shows just '66' or '26' for artistic crop */}
                  </span>
                </div>

                {/* Top Section */}
                <div className="relative z-10">
                  <span className="font-['Nexa'] font-bold text-5xl md:text-6xl text-[#F58220] tracking-tighter block mb-2 drop-shadow-md">
                    {item.year}
                  </span>
                  <div className="w-12 h-1 bg-[#FFFFFF]/20 group-hover:bg-[#F58220]/50 transition-colors duration-500 mt-6" />
                </div>

                {/* Bottom Section (Description) */}
                <div className="relative z-10 mt-auto pt-8">
                  <p className="font-['Nexa'] font-normal text-lg md:text-xl text-[#FFFFFF]/80 leading-[1.8] tracking-wide">
                    {item.text}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}