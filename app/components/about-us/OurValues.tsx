"use client";

import { useRef } from "react";
import { motion,Variants } from "framer-motion";
import { 
  Fingerprint, 
  Sparkles, 
  Scale, 
  Layers, 
  Handshake 
} from "lucide-react";

const valuesData = [
  {
    title: "Integrity",
    text: "Every long-standing relationship begins here. Integrity shapes how we plan, build and deliver. It is the reason families return to us, and the reason our commitments hold steady, year after year.",
    icon: Fingerprint,
  },
  {
    title: "Excellence",
    text: "We approach every detail with care. The aim is simple: create spaces that feel right today and remain dependable tomorrow.",
    icon: Sparkles,
  },
  {
    title: "Responsibility",
    text: "Growth means little without responsibility. Our approach to minimal debt and careful resource management ensures that each decision strengthens the company.",
    icon: Scale,
  },
  {
    title: "Expertise",
    text: "Decades of experience bring a certain clarity. With more than 35 million sq. ft. delivered and a team of specialists across engineering, construction and marketing, we rely on skill built over time, not shortcuts.",
    icon: Layers,
  },
  {
    title: "Trust",
    text: "It grows when projects are delivered as promised, when processes remain transparent and when customers feel supported long after possession. It is the value that ties our past to our future.",
    icon: Handshake,
  }
];

export default function OurValues() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation for the entire grid container to stagger its children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  // Animation for individual value items
  const itemVariants:Variants  = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    },
  };

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
          className="flex items-center gap-4 mb-16 md:mb-24"
        >
          <div className="h-[1px] w-12 bg-[var(--color-brand-orange)]" />
          <h5 className="uppercase tracking-widest text-sm text-[var(--color-brand-orange)] font-bold">
            Our Core Values
          </h5>
        </motion.div>

        {/* === MAIN TITLE === */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mb-20 md:mb-32"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl leading-[1.15] tracking-tight font-sans">
            <span className="special-text text-[var(--color-brand-orange)] block mb-2">The Values</span>
            That Light Our Path.
          </h2>
        </motion.div>

        {/* === ARCHITECTURAL GRID === */}
        {/* 
          Using a CSS grid with specific borders to create a blueprint/architectural feel.
          On large screens, it's 3 columns. Because there are 5 items, the last spot is left intentionally blank.
        */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-[var(--color-brand-black)]/10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {valuesData.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="group p-8 md:p-12 border-b md:border-r border-[var(--color-brand-black)]/10 flex flex-col justify-between hover:bg-[var(--color-brand-orange)]/5 transition-colors duration-500"
                // Tailwind trick to remove the right border on the last item of a row
                style={{
                  borderRightWidth: (index + 1) % 3 === 0 ? 0 : undefined,
                }}
              >
                <div>
                  {/* Icon Container with subtle hover lift */}
                  <div className="mb-10 text-[var(--color-brand-orange)] transform group-hover:-translate-y-2 transition-transform duration-500 ease-out">
                    <Icon strokeWidth={1.5} size={40} />
                  </div>
                  
                  {/* Small, refined heading */}
                  <h4 className="text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[var(--color-brand-black)] mb-6">
                    {item.title}
                  </h4>
                  
                  {/* Body Text */}
                  <p className="text-base md:text-lg leading-relaxed text-foreground/70 font-sans">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
          
          {/* 
            Empty 6th Grid Cell (Desktop Only) 
            Fills the remaining space in the 3-column layout to maintain the border structure.
          */}
          <div className="hidden lg:block border-b border-[var(--color-brand-black)]/10 pointer-events-none" />

        </motion.div>
      </div>
    </section>
  );
}