"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform ,Variants} from "framer-motion";

export default function BrandPositioning() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Staggered text animation variants
  // const textReveal = {
  //   hidden: { opacity: 0, y: 30 },
  //   visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
  // };


const textReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

  // Scroll logic for the "Intersection" visual
  const intersectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: intersectionRef,
    offset: ["start end", "center center"],
  });

  // Lines grow from 0% to 100% to form an intersection
  const lineScaleX = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const lineScaleY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-[var(--color-brand-cream)] text-[var(--color-brand-black)] py-24 md:py-40"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        
        {/* === SECTION HEADER === */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-4 mb-24 md:mb-32"
        >
          <div className="h-[1px] w-12 bg-[var(--color-brand-orange)]" />
          <h5 className="uppercase tracking-widest text-sm text-[var(--color-brand-orange)] font-bold">
            Brand Positioning
          </h5>
        </motion.div>

        {/* === STICKY LAYOUT: QUIET LUXURY CONTENT === */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative mb-32 md:mb-64">
          
          {/* Left: Elegant Tracking Line */}
          <div className="lg:col-span-3 lg:sticky lg:top-40 hidden lg:flex flex-col items-start h-full">
             <div className="w-[1px] h-32 bg-[var(--color-brand-orange)]/30 mb-6" />
             <p className="text-xs uppercase tracking-widest text-foreground/40 rotate-180" style={{ writingMode: 'vertical-rl' }}>
               Enduring Trust
             </p>
          </div>

          {/* Right: Refined Editorial Text */}
          <motion.div 
            className="lg:col-span-8 lg:col-start-5 space-y-12 md:space-y-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.2 } }
            }}
          >
            {/* Lead Statement - Smaller, more elegant */}
            <motion.div variants={textReveal}>
              <h3 className="text-2xl md:text-3xl lg:text-4xl leading-snug md:leading-[1.4] text-[var(--color-brand-black)] font-sans">
                More than a developer, the brand stands as a <span className="special-text text-[var(--color-brand-orange)]">trusted institution</span> shaped by legacy, credibility and enduring relationships.
              </h3>
            </motion.div>

            {/* Supporting Paragraphs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-8 md:pt-12 border-t border-[var(--color-brand-black)]/10">
              <motion.div variants={textReveal}>
                <p className="text-lg leading-relaxed text-foreground/70 font-sans">
                  Guided by the philosophy of <strong className="text-[var(--color-brand-black)] font-bold">Crafting Homes for Generations</strong>, the brand creates spaces designed to outlast changing trends — both in construction quality and emotional relevance.
                </p>
              </motion.div>
              
              <motion.div variants={textReveal}>
                <p className="text-lg leading-relaxed text-foreground/70 font-sans">
                  Its approach goes beyond delivering homes with modern amenities. It focuses on building environments where families grow, milestones unfold and generations evolve together.
                </p>
              </motion.div>
            </div>
          </motion.div>

        </div>

        {/* === THE FINALE: THE INTERSECTION === */}
        <div 
          className="relative w-full min-h-[60vh] flex flex-col items-center justify-center py-20"
          ref={intersectionRef}
        >
          {/* Animated Intersection Grid Lines */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
            {/* Horizontal Line */}
            <motion.div 
              className="absolute w-full h-[1px] bg-[var(--color-brand-black)] origin-center"
              style={{ scaleX: lineScaleX }}
            />
            {/* Vertical Line */}
            <motion.div 
              className="absolute h-[150%] w-[1px] bg-[var(--color-brand-black)] origin-bottom"
              style={{ scaleY: lineScaleY }}
            />
          </div>

          {/* Typographic Centerpiece */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-150px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center z-10 max-w-5xl px-4 bg-[var(--color-brand-cream)]/80 backdrop-blur-sm py-12"
          >
            <p className="text-sm md:text-base uppercase tracking-[0.3em] text-[var(--color-brand-orange)] font-bold mb-8">
              The Intersection
            </p>
            <h3 className="text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight font-sans text-[var(--color-brand-black)]">
              Thoughtful Design, <br/>
              Long-term Trust <br/>
              <span className="special-text text-[var(--color-brand-orange)] block mt-2">&amp; Timeless Living.</span>
            </h3>
          </motion.div>
        </div>

      </div>
    </section>
  );
}