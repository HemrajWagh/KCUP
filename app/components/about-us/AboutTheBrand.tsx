"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for Tailwind class merging
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AboutTheBrand() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  const isTextInView = useInView(textRef, { once: true, margin: "-100px" });

  // Scroll parallax for the image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-[var(--color-brand-cream)] text-[var(--color-brand-black)] overflow-hidden py-24 md:py-40"
    >
      {/* Subtle Grain Overlay for Premium Feel */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]  repeat" />

      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 mb-20 md:mb-32"
        >
          <div className="h-[1px] w-12 bg-[var(--color-brand-orange)]" />
          <h5 className="uppercase tracking-widest text-sm text-[var(--color-brand-orange)]">
            Our Brand
          </h5>
        </motion.div>

        {/* Massive Typographic Statement */}
        <div className="max-w-5xl mb-24 md:mb-40" ref={textRef}>
          <h2 className="text-5xl md:text-7xl lg:text-8xl leading-[1.1] md:leading-[1.05] tracking-tight h1 text-[var(--color-brand-black)]">
            <span className="block overflow-hidden">
              <motion.span 
                className="block"
                initial={{ y: "100%" }}
                animate={isTextInView ? { y: 0 } : {}}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                Crafting Homes
              </motion.span>
            </span>
            <span className="block overflow-hidden flex items-center gap-4 md:gap-8">
              <motion.span 
                className="block"
                initial={{ y: "100%" }}
                animate={isTextInView ? { y: 0 } : {}}
                transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                for <span className="special-text text-[var(--color-brand-orange)] ">Generations.</span>
              </motion.span>
            </span>
          </h2>
        </div>

        {/* Asymmetrical Grid: Content & Parallax Media */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Column: Flowing Text */}
          <div className="lg:col-span-5 lg:col-start-2 space-y-12 z-10">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl leading-relaxed text-foreground/80 font-sans"
            >
              For over six decades, the brand has stood for more than just real estate. It has become a trusted institution built on legacy, enduring relationships and the belief that homes should serve generations, not moments.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-lg md:text-xl leading-relaxed text-foreground/70 font-sans mb-8">
                Beyond amenities and specifications, our focus has always been on emotional value. We create spaces where families grow together, children become parents, and every generation finds comfort, familiarity and belonging.
              </p>
              
              <div className="p-8 border-l-2 border-[var(--color-brand-orange)] bg-background/50 backdrop-blur-sm rounded-r-2xl">
                <p className="text-2xl md:text-3xl special-text text-[var(--color-brand-black)] leading-snug">
                  "Because a truly meaningful home is one people return to, generation after generation."
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Parallax Image */}
          <div className="lg:col-span-5 lg:col-start-8 relative h-[60vh] md:h-[80vh] w-full rounded-[var(--radius-md)] overflow-hidden shadow-2xl">
            <motion.div 
              className="absolute inset-[-20%] w-[140%] h-[140%]"
              style={{ y: imageY }}
            >
              <img 
                src="/assets/about-us/qa.png" 
                alt="Crafting homes for generations"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/10" />
            </motion.div>
            
            {/* Design Element over image */}
            <div className="absolute bottom-6 right-6 bg-[var(--color-brand-orange)] p-4 rounded-full shadow-lg">
              <ArrowDownRight className="w-8 h-8 text-[var(--color-brand-black)]" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
// "use client";

// import { motion } from 'framer-motion';

// export default function AboutTheBrand() {
//   const lines = [
//     "The feeling of home is precious.",
//     "People seek it everywhere they go.",
//     "They breathe it in and over time, it runs through their veins.",
//     "And when a home is made with genuine care, that feeling becomes irreplaceable.",
//     "Every part of it speaks a language you instinctively understand.",
//     "It is this feeling that we try to evoke.",
//     "Because when we do, it wins the hearts of those who live in it.",
//     "And the next generation who return seeking it again."
//   ];

//   return (
//     <section className="relative w-full py-32 bg-[#000000] text-white overflow-hidden">
      
//       {/* Subtle Ambient Glow */}
//       <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#F58220]/10 blur-[150px] rounded-full pointer-events-none" />

//       <div className="container mx-auto px-8 lg:px-[15%]">
        
//         {/* Brand Header */}
//         <motion.div 
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           className="mb-20"
//         >
//           <span className="font-['Nexa'] font-bold text-[10px] tracking-[0.4em] uppercase text-[#F58220]">
//             The Philosophy
//           </span>
//         </motion.div>

//         {/* Narrative Flow */}
//         <div className="space-y-8 md:space-y-12">
//           {lines.map((line, i) => (
//             <motion.div 
//               key={i}
//               initial={{ opacity: 0, x: -20 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               transition={{ delay: i * 0.15, duration: 1 }}
//               className="overflow-hidden"
//             >
//               <p className={`font-['Bodoni_Moda'] italic text-2xl md:text-4xl lg:text-5xl leading-tight ${
//                 i > 5 ? 'text-white font-bold' : 'text-white/80'
//               }`}>
//                 {line}
//               </p>
//             </motion.div>
//           ))}
//         </div>

//         {/* Closing Signature */}
//         <motion.div 
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           transition={{ delay: 1.5, duration: 2 }}
//           className="mt-24 border-t border-white/20 pt-8"
//         >
//           <p className="font-['Nexa'] text-[10px] uppercase tracking-[0.3em] text-white/40">
//             Kumar Corp — Legacy in every detail
//           </p>
//         </motion.div>
//       </div>
//     </section>
//   );
// }