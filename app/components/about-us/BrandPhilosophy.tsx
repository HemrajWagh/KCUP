"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform ,Variants} from "framer-motion";

export default function BrandPhilosophy() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Staggered text animation variants
  // const textReveal = {
  //   hidden: { opacity: 0, y: 30 },
  //   visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  // };

  // High-end Awwwards-style Clip Path reveal (Wipes from bottom to top)
  const clipPathReveal = {
    hidden: { clipPath: "inset(100% 0 0 0)" },
    visible: { 
      clipPath: "inset(0% 0 0 0)", 
      transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } 
    }
  };

  // Image scales down to exactly 1 (0% crop when finished)
  const imageScaleDown = {
    hidden: { scale: 1.15 },
    visible: { 
      scale: 1, 
      transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  // Parallax hooks for the first image (Mother & Child - Square)
  const image1Ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scrollY1 } = useScroll({
    target: image1Ref,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollY1, [0, 1], ["-10%", "10%"]);
  const scale1 = useTransform(scrollY1, [0, 1], [1.05, 1]);

  // Parallax hooks for the second image (Grandfather & Child - 16:9)
  const image2Ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scrollY2 } = useScroll({
    target: image2Ref,
    offset: ["start end", "end start"],
  });
  const y2 = useTransform(scrollY2, [0, 1], ["-15%", "15%"]);

  // Staggered text animation variants
    

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
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-[var(--color-brand-cream)] text-[var(--color-brand-black)] overflow-hidden py-24 md:py-40"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        
        {/* === SECTION HEADER === */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-4 mb-20 md:mb-32"
        >
          <div className="h-[1px] w-12 bg-[var(--color-brand-orange)]" />
          <h5 className="uppercase tracking-widest text-sm text-[var(--color-brand-orange)]">
            Brand Philosophy
          </h5>
        </motion.div>

        {/* === PART 1: MOTHER & CHILD === */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-32 md:mb-48">
          
          {/* Editorial Quote Content */}
          <motion.div 
            className="lg:col-span-6 lg:col-start-1 space-y-8 z-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } }
            }}
          >
            <motion.div variants={textReveal} className="relative">
              {/* Large decorative quote mark */}
              <span className="absolute -top-10 -left-6 text-7xl md:text-9xl text-[var(--color-brand-orange)] opacity-20 font-special leading-none select-none">
                &ldquo;
              </span>
              <p className="text-2xl md:text-3xl lg:text-4xl leading-[1.2] special-text text-[var(--color-brand-black)]">
                The feeling of home is deeply personal. People search for it everywhere they go, and when they finally find it, it becomes a part of who they are.
              </p>
            </motion.div>

            <motion.div variants={textReveal} className="pl-4 md:pl-8 border-l-2 border-[var(--color-brand-orange)] space-y-6 mt-12">
              <p className="text-lg md:text-xl leading-relaxed text-foreground/70 font-sans">
                A thoughtfully crafted home carries warmth, familiarity and care in every detail. It speaks a language people instinctively understand — one that creates comfort, trust and lasting emotional connection.
              </p>
              <p className="text-lg md:text-xl font-bold leading-relaxed text-[var(--color-brand-black)] uppercase tracking-wide text-sm">
                This is the feeling we strive to create through every space we build.
              </p>
            </motion.div>
          </motion.div>

          {/* Square Image Content (Perfectly matches 731x731px) */}
          <div className="lg:col-span-5 lg:col-start-8 w-full aspect-square rounded-[var(--radius-lg)] overflow-hidden relative shadow-2xl" ref={image1Ref}>
            <motion.div className="w-full h-full relative" style={{ y: y1, scale: scale1 }}>
              <Image 
                src="/assets/about-us/crafting.png" 
                alt="Mother and child sharing a moment in their home"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover "
                priority
              />
              <div className="absolute inset-0 bg-[var(--color-brand-orange)]/5 mix-blend-multiply" />
            </motion.div>
          </div>
          {/* <motion.div 
            className="lg:col-span-5 lg:col-start-8 w-full aspect-square rounded-[var(--radius-lg)] overflow-hidden relative shadow-2xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={clipPathReveal}
          >
            <motion.div className="w-full h-full relative" variants={imageScaleDown}>
              <Image 
                src="/assets/about-us/mother-and-child.jpg" 
                alt="Mother and child sharing a moment in their home"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </motion.div>
          </motion.div> */}
        </div>

        {/* === PART 2: GRANDFATHER & CHILD === */}
        <div className="relative w-full mt-32 md:mt-48">
          
          {/* Statement Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 md:mb-16 text-center md:text-left"
          >
            {/* <h2 className="text-4xl md:text-6xl lg:text-7xl leading-[1.1] md:leading-[1.05] tracking-tight h1 text-[var(--color-brand-black)]"> */}
            <h2 className="text-5xl md:text-7xl lg:text-8xl leading-[1.1] md:leading-[1.05] tracking-tight h1 text-[var(--color-brand-black)]">
              Spaces You Return To, <br className="hidden md:block" />
              <span className="special-text text-[var(--color-brand-orange)]">Time After Time.</span>
            </h2>
          </motion.div>

          {/* Cinematic Image (Exactly 16:9 to match 1920x1080px with 0 crop) */}
          <div className="lg:col-span-8 rounded-[var(--radius-lg)] overflow-hidden shadow-2xl bg-black relative" ref={image2Ref}>
              <div className="relative w-full aspect-video">
                <motion.div className="absolute inset-[-20%] w-[140%] h-[140%]" style={{ y: y2 }}>
                  <Image 
                    src="/assets/about-us/Grand-Father-&-Child-1.jpg" 
                    alt="Grandfather and child representing generational legacy"
                    fill
                    sizes="(max-width: 1024px) 100vw, 75vw"
                    className="object-cover "
                  />
                </motion.div>
              </div>
            </div>

          {/* Swiss Architectural 3-Column Text Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-12 md:mt-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.2 } }
            }}
          >
            {/* Column 1 */}
            <motion.div variants={textReveal} className="border-t border-[var(--color-brand-black)]/20 pt-6">
              <p className="text-lg md:text-xl leading-relaxed text-foreground/80 font-sans">
                Our philosophy is reflected in both our actions and our creations. It is measured, responsible and rooted in long-term thinking.
              </p>
            </motion.div>
            
            {/* Column 2 */}
            <motion.div variants={textReveal} className="border-t border-[var(--color-brand-black)]/20 pt-6">
              <p className="text-lg md:text-xl leading-relaxed text-foreground/80 font-sans">
                Every township, residential development and commercial space is designed with clarity, purpose and care — built not merely for today, but for the decades ahead.
              </p>
            </motion.div>

            {/* Column 3 - Highlighted */}
            <motion.div variants={textReveal} className="border-t-2 border-[var(--color-brand-orange)] pt-6">
              <p className="text-xl md:text-2xl font-bold leading-snug text-[var(--color-brand-black)]">
                Because when spaces are created with sincerity and vision, people return to them. Trust grows stronger. Relationships deepen. And over time, a legacy continues to evolve.
              </p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}