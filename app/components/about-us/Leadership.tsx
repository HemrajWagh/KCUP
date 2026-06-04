"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform ,Variants} from "framer-motion";

const leaders = [
  {
    name: "Mr. Hitesh K Jain",
    title: "Managing Director",
    image: "/assets/about-us/Hitesh-Sir.jpg",
    paragraphs: [
      "They say strength is born from foundations. Mr. Hitesh Jain embodies this truth with an unyielding force. In his young age, inheriting a legacy of real estate excellence from his family, he has transformed heritage into an empire through relentless determination and a mind that thrives on bold innovation.",
      "Armed with a Bachelor’s in Civil Engineering from MIT Pune and a Master’s in Business Administration from the University of Cardiff, UK, Hitesh returned to India as a disruptor with novel ideas. His global lens ignited fresh strategies, fuelling Kumar Corp's engineering prowess.",
      "Today, as Director, he drives cutting-edge technologies from advanced construction methods to smart systems, positioning Kumar Corp as the industry's innovation vanguard. Under his watch, the brand surges forward, unbreakable and unstoppable."
    ]
  },
  {
    name: "Mr. Kewalkumar Jain",
    title: "Chairman",
    image: "/assets/about-us/Kewal-Sir.jpg", // Update with actual path
    paragraphs: [
      "For over 47 years, Kewalkumar Jain has been the driving force behind Kumar Corp’s journey. With a deep understanding of finance and a clear long-term vision, he laid the foundation for a brand built on trust, quality and consistency.",
      "Mr. Jain has guided the company through decades of growth with disciplined planning and sharp market insight. Under his leadership, Kumar Corp grew into a diversified real estate brand with landmark residential, commercial and township developments across multiple cities.",
      "His commitment to excellence and customer-first thinking continues to define the company’s legacy today."
    ]
  }
];

export default function Leadership() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Staggered text animation variants
  const textReveal:Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };


  // const textReveal: Variants = {
  //   hidden: {
  //     opacity: 0,
  //     y: 30,
  //   },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       duration: 0.8,
  //     },
  //   },
  // };

  // Parallax hook for subtle image float
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  // Creates a gentle vertical shift as you scroll past the section
  const imageParallax1 = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const imageParallax2 = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

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
          className="flex items-center gap-4 mb-8"
        >
          <div className="h-[1px] w-12 bg-[var(--color-brand-orange)]" />
          <h5 className="uppercase tracking-widest text-sm text-[var(--color-brand-orange)] font-bold">
            Leadership
          </h5>
        </motion.div>

        {/* === MAIN TITLE === */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mb-24 md:mb-40"
        >
          <h2 className="text-5xl md:text-6xl lg:text-8xl leading-[1.05] tracking-tight font-sans h1">
            The Force Behind <br className="hidden md:block"/>
            <span className="special-text text-[var(--color-brand-orange)]">The Promise.</span>
          </h2>
        </motion.div>

        {/* === LEADER 1: HITESH K JAIN (Image Left, Text Right) === */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-32 md:mb-48 ">
          
          {/* Portrait Container */}
          <motion.div 
            className="lg:col-span-5 lg:col-start-1 w-full aspect-[4/5] rounded-[2rem] md:rounded-[2.5rem] rounded-[var(--radius-lg)] overflow-hidden relative bg-black/5"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Image Parallax Wrapper */}
            <motion.div className="absolute inset-[-10%] w-[110%] h-[110%]" style={{ y: imageParallax1 }}>
              <Image 
                src={leaders[0].image}
                alt={leaders[0].name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                style={{ objectPosition: 'top center' }} 
              />
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div 
            className="lg:col-span-6 lg:col-start-7 space-y-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            <motion.div variants={textReveal} className="border-b border-[var(--color-brand-black)]/10 pb-8 mb-8">
              <h3 className="text-3xl md:text-5xl font-sans font-black text-[var(--color-brand-black)] mb-3">
                {leaders[0].name}
              </h3>
              <p className="text-sm md:text-base uppercase tracking-widest text-[var(--color-brand-orange)] font-bold">
                {leaders[0].title}
              </p>
            </motion.div>

            <div className="space-y-6">
              {leaders[0].paragraphs.map((para, idx) => (
                <motion.p key={idx} variants={textReveal} className="text-lg leading-relaxed text-foreground/80 font-sans">
                  {para}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </div>

        {/* === LEADER 2: KEWALKUMAR JAIN (Text Left, Image Right) === */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text Content - Note: On mobile, text naturally flows under the image due to DOM order visually reversing, but we use tailwind order classes to fix it */}
          <motion.div 
            className="lg:col-span-6 lg:col-start-1 space-y-10 order-2 lg:order-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            <motion.div variants={textReveal} className="border-b border-[var(--color-brand-black)]/10 pb-8 mb-8">
              <h3 className="text-3xl md:text-5xl font-sans font-black text-[var(--color-brand-black)] mb-3">
                {leaders[1].name}
              </h3>
              <p className="text-sm md:text-base uppercase tracking-widest text-[var(--color-brand-orange)] font-bold">
                {leaders[1].title}
              </p>
            </motion.div>

            <div className="space-y-6">
              {leaders[1].paragraphs.map((para, idx) => (
                <motion.p key={idx} variants={textReveal} className="text-lg leading-relaxed text-foreground/80 font-sans">
                  {para}
                </motion.p>
              ))}
            </div>
          </motion.div>

          {/* Portrait Container */}
          <motion.div 
            className="lg:col-span-5 lg:col-start-8 w-full aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden relative bg-black/5 order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Image Parallax Wrapper */}
            <motion.div className="absolute inset-[-10%] w-[120%] h-[120%]" style={{ y: imageParallax2 }}>
              <Image 
                src={leaders[1].image}
                alt={leaders[1].name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                style={{ objectPosition: 'top center' }} 
              />
            </motion.div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}