"use client";

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion ,Variants } from 'framer-motion';

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// const itemVariants = {
//   hidden: { opacity: 0, y: 30 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
// };

export default function MilestonesTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const track = trackRef.current;
    if (!track) return;

    // 1. GRAND ENTRANCE REVEAL (On Page Load)
    const tl = gsap.timeline();
    
    // Background horse fades in and scales down to feel massive
    tl.fromTo(".grand-horse", 
      { scale: 1.15, opacity: 0, filter: "blur(10px)" },
      { scale: 1, opacity: 0.3, filter: "blur(0px)", duration: 2.5, ease: "power3.out" }
    )
    // Intro typography staggered reveal
    .from(".intro-text-line", {
      y: 80,
      opacity: 0,
      rotateX: -20,
      stagger: 0.15,
      duration: 1.2,
      ease: "power4.out",
    }, "-=1.5")
    .from(".intro-subtext", {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: "power2.out"
    }, "-=0.8");

    // 2. HORIZONTAL SCROLL PINNING
    const scrollTween = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1, // Smooth, buttery scrub
        start: "top top",
        end: () => `+=${track.scrollWidth}`, 
        invalidateOnRefresh: true,
      }
    });

    // 3. CINEMATIC PARALLAX FOR THE STATIC HORSE
    // As the user scrubs through the timeline, the background horse pans slightly to create immense depth
    gsap.to(".grand-horse", {
      x: "-15vw", 
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        scrub: 1,
        start: "top top",
        end: () => `+=${track.scrollWidth}`, 
      }
    });

    // Add this inside useGSAP
gsap.fromTo(".est-reveal", 
  { width: "0%", opacity: 0 },
  { width: "100%", opacity: 1, duration: 2, ease: "power4.inOut" }
);

gsap.from(".est-text", {
  opacity: 0,
  y: 20,
  delay: 1.5,
  duration: 1,
  ease: "power2.out"
});

    // 4. GLASS MONOLITH REVEALS
    const cards = gsap.utils.toArray('.milestone-monolith');
    cards.forEach((card: any) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          containerAnimation: scrollTween, 
          start: "left 95%",
          toggleActions: "play none none reverse"
        },
        y: 120,
        opacity: 0,
        rotateX: 15,
        scale: 0.95,
        duration: 1.4,
        ease: "expo.out"
      });
    });

  }, { scope: containerRef });

  return (

    <>
    <section className="relative w-full min-h-screen py-32 bg-[var(--color-brand-cream)] flex items-center justify-center overflow-hidden h-screen overflow-hidden perspective-[1200px]">
      {/* <section className="relative w-full min-h-screen py-32 bg-[#faf6f0] flex flex-col items-center justify-center overflow-hidden"> */}
      
      {/* 1. THE FOUNDATIONAL ANCHOR: The Tree */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.6, scale: 1.5}}
        transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
      >
        <img 
          src="/assets/Mission-&-Vision.png" 
          alt="Rooted Legacy" 
          className="w-[85vw] lg:w-[35vw] object-contain mix-blend-multiply" 
        />
      </motion.div>

      {/* 2. THE EDITORIAL MANIFESTO */}
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        {/* Main Hook */}
        <div className="text-center mb-24">
          <motion.h3 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="font-['Bodoni_Moda'] italic text-4xl md:text-7xl text-brand-black"
          >
            To Rise,
          </motion.h3>
          <motion.h3 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1.2 }}
            className="font-['Bodoni_Moda'] italic text-4xl md:text-7xl text-brand-orange mt-2"
          >
            We Stay Rooted.
          </motion.h3>
        </div>

        {/* The Floating Manifestos */}
        <div className="flex flex-col lg:flex-row justify-center gap-16 lg:gap-32 w-full max-w-6xl">
          
          {/* Vision Block */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="flex-1 space-y-8 p-10 bg-white/30 backdrop-blur-sm border border-black/5 rounded-[2rem] hover:bg-white/50 transition-colors"
          >
            <span className="font-['Nexa'] font-black text-[10px] uppercase tracking-[0.4em] text-brand-orange">Our Vision</span>
            <p className="font-['Nexa'] font-light text-xl lg:text-2xl leading-[1.8] text-brand-black">
              Every creation stands as a timeless legacy, crafted with uncompromising quality to nurture generations.
            </p>
          </motion.div>

          {/* Mission Block */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex-1 space-y-8 p-10 bg-white/30 backdrop-blur-sm border border-black/5 rounded-[2rem] hover:bg-white/50 transition-colors"
          >
            <span className="font-['Nexa'] font-black text-[10px] uppercase tracking-[0.4em] text-brand-orange">Our Mission</span>
            <p className="font-['Nexa'] font-light text-xl lg:text-2xl leading-[1.8] text-brand-black">
              Crafting legacies through innovative design and advanced technology to create lasting value and delight.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
    
    <section ref={containerRef} className="relative bg-[#000000] text-[#FFFFFF] h-screen overflow-hidden perspective-[1200px]">




        {/* ========================================= */}
        {/* BACKGROUND: THE MONUMENTAL HORSE          */}
        {/* ========================================= */}

        {/* Deep Ambient Base */}
        <div className="absolute inset-0 z-0 bg-[#000000] pointer-events-none" />

        {/* The Grand Static Horse */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <img
            src="/assets/horse-grand-static.png" /* Replace with your high-res horse image */
            alt="Majestic Horse"
            className="grand-horse w-full h-[120vh] object-cover object-[center_30%] mix-blend-luminosity filter grayscale contrast-125" />
        </div>

        {/* Vignette & Orange Backlight Overlays to blend the horse perfectly */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000000_85%)] pointer-events-none opacity-90" />
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none">
          <div className="w-[80vw] h-[60vh] bg-[#F58220]/30 rounded-[100%] blur-[150px] mix-blend-screen" />
        </div>

        {/* ========================================= */}
        {/* THE HORIZONTAL GALLERY TRACK              */}
        {/* ========================================= */}

        <div ref={trackRef} className="relative h-full flex items-center w-[max-content] z-10 pt-10">

          {/* Continuous Ground Line */}
          <div className="absolute bottom-[15vh] left-0 w-full h-[1px] bg-white/5 z-0">
            <div className="absolute top-0 left-0 w-[200vw] h-full bg-gradient-to-r from-transparent via-[#F58220] to-transparent shadow-[0_0_20px_#F58220]" />
          </div>

          {/* 1. EDITORIAL INTRO SLIDE */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-screen h-full flex-shrink-0 flex flex-col justify-center px-8 md:px-[12%] relative"
          >
            <div className="max-w-2xl relative z-20">

              {/* Brand Anchor with Expand Animation */}
              <motion.div variants={itemVariants} className="flex flex-col gap-6 mb-12">
                <div className="relative flex items-center gap-6 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "64px" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="h-[1px] bg-gradient-to-r from-brand-orange via-white to-transparent" />
                  <span className="font-['Nexa'] font-black text-[10px] md:text-xs tracking-[0.6em] uppercase text-white drop-shadow-[0_0_10px_rgba(245,130,32,0.8)]">
                    Est. 1966
                  </span>
                </div>
              </motion.div>

              {/* Cinematic Heading Reveal */}
              <div className="space-y-1">
                {["Milestones", "That Moved Us", "Forward"].map((text, i) => (
                  <motion.div
                    key={text}
                    initial={{ y: "100%", opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <h1 className={`font-['Nexa'] font-black text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tighter 
        ${i === 2 ? 'text-brand-orange drop-shadow-[0_0_15px_rgba(245,130,32,0.4)]' : i === 1 ? 'text-white/40' : 'text-white'}`}>
                      {text}
                    </h1>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={itemVariants} className="mt-16 flex flex-col md:flex-row items-start md:items-center gap-10">

                {/* Pulsing Navigation Hint */}
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="relative w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all duration-500 group-hover:border-brand-orange">
                    {/* Pulsing halo */}
                    <div className="absolute inset-0 rounded-full border border-brand-orange animate-ping opacity-30" />
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                  <span className="font-['Nexa'] font-bold text-[10px] uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">
                    Scroll to discover
                  </span>
                </div>

                {/* Editorial Quote */}
                <p className="font-['Bodoni_Moda'] italic text-lg lg:text-xl text-white/60 leading-relaxed max-w-sm border-l border-white/10 pl-6">
                  A legacy built on trust, innovation, and unwavering commitment.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* 2. THE GLASS MONOLITHS */}
          <div className="flex items-end gap-12 lg:gap-20 px-16 pr-[30vw] h-full pb-[15vh] z-10">
            {milestones.map((item, index) => (
              <div
                key={index}
                className="milestone-monolith relative flex-shrink-0 w-[350px] md:w-[450px] h-[65vh] flex flex-col justify-end"
              >

                {/* Ground Anchor Node */}
                <div className="absolute -bottom-[6px] left-10 w-3 h-3 bg-[#000000] border-2 border-[#F58220] rounded-full shadow-[0_0_15px_rgba(245,130,32,1)] z-30" />

                {/* The Glass Panel */}
                <div className="w-full h-full bg-white/[0.02] backdrop-blur-3xl border border-white/[0.08] hover:border-[#F58220]/40 transition-all duration-700 rounded-[2.5rem] p-10 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden group">

                  {/* Internal Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F58220]/0 via-transparent to-[#F58220]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  {/* Massive Watermark Year (Nexa Black) */}
                  <div className="absolute top-0 right-[-5%] select-none pointer-events-none z-0 transform translate-y-[-15%]">
                    <span className="font-['Nexa'] font-black text-[10rem] md:text-[14rem] leading-none text-transparent stroke-text opacity-[0.1] group-hover:opacity-[0.2] transition-opacity duration-700"
                      style={{ WebkitTextStroke: "1px rgba(255,255,255,0.8)" }}>
                      {item.year.substring(2)}
                    </span>
                  </div>

                  {/* Top Section */}
                  <div className="relative z-10">
                    <span className="font-['Nexa'] font-bold text-5xl md:text-6xl text-[#F58220] tracking-tighter block mb-2 drop-shadow-md">
                      {item.year}
                    </span>
                    <div className="w-12 h-[2px] bg-[#FFFFFF]/20 group-hover:bg-[#F58220]/60 transition-colors duration-500 mt-6" />
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

    
  </>
  );
}