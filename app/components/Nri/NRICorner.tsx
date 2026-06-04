"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { Mail } from "lucide-react";

export default function NRICorner() {
  const containerRef = useRef<HTMLDivElement>(null);

 // Staggered text animation variants
  const textReveal: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
    }
  };

  // High-end Awwwards-style Clip Path reveal
  const clipPathReveal: Variants = {
    hidden: { clipPath: "inset(100% 0 0 0)" },
    visible: { 
      clipPath: "inset(0% 0 0 0)", 
      transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] } 
    }
  };

  // Image scales down to exactly 1
  const imageScaleDown: Variants = {
    hidden: { scale: 1.15 },
    visible: { 
      scale: 1, 
      transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
    }
  };

  // --- Parallax Hooks ---
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start end", "end start"] });
  const heroParallax = useTransform(heroScroll, [0, 1], ["-2%", "2%"]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full bg-[var(--color-brand-cream)] text-[var(--color-brand-black)] overflow-hidden"
    >
      {/* =========================================
          SECTION 1: HERO & INTRO
      ========================================= */}
      <section className="pt-32 pb-24 md:pt-48 md:pb-32">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-4 mb-12 md:mb-16"
          >
            <div className="h-[1px] w-12 bg-[var(--color-brand-orange)]" />
            <h5 className="uppercase tracking-widest text-sm text-[var(--color-brand-orange)] font-bold">
              NRI Corner
            </h5>
          </motion.div>

          {/* Hero Typography */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16 md:mb-24 items-end"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            <motion.h1 variants={textReveal} className="lg:col-span-7 text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight font-sans font-black text-[var(--color-brand-black)]">
              Invest in Pune <br className="hidden md:block"/> with Kumar Corp: <br/>
              <span className="special-text font-normal text-[var(--color-brand-orange)] block mt-2">
                Your Gateway to Exclusive NRI Benefits.
              </span>
            </motion.h1>

            <motion.div variants={textReveal} className="lg:col-span-5 pb-2">
              <p className="text-lg md:text-xl leading-relaxed text-foreground/80 font-sans">
                Looking for a lucrative real estate investment opportunity? Look no further than Pune, India's thriving cosmopolitan city that promises incredible growth and exceptional returns. Pune has emerged as a hotbed for investment, attracting not only domestic buyers but also discerning NRIs seeking a slice of this vibrant real estate market.
              </p>
            </motion.div>
          </motion.div>

          {/* Cinematic Hero Image */}
          <motion.div 
            className="w-full aspect-video md:aspect-[21/9] rounded-[var(--radius-lg)] overflow-hidden shadow-2xl relative"
            ref={heroRef}
            initial="hidden"
            animate="visible"
            variants={clipPathReveal}
          >
            <motion.div className="w-full h-full relative" variants={imageScaleDown} style={{ y: heroParallax }}>
              <Image 
                src="/assets/nri-corner/nriHeroImg.png" 
                alt="Pune Cityscape / NRI Investment"
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* =========================================
          SECTION 2: WHY INVEST IN PUNE?
      ========================================= */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Text Left */}
            <motion.div 
              className="lg:col-span-6 space-y-8 order-2 lg:order-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            >
              <motion.h3 variants={textReveal} className="text-3xl md:text-5xl font-sans font-black text-[var(--color-brand-black)] mb-6">
                Why invest in <span className="special-text text-[var(--color-brand-orange)] font-normal">Pune?</span>
              </motion.h3>
              <motion.p variants={textReveal} className="text-lg md:text-xl leading-relaxed text-foreground/80 font-sans">
                Pune's strategic location, robust infrastructure, and booming IT sector make it an investor's paradise. Pune attracts a constant influx of students, professionals, and families, ensuring a steady demand for quality residential and commercial spaces. 
              </motion.p>
              <motion.p variants={textReveal} className="text-lg md:text-xl leading-relaxed text-foreground/80 font-sans">
                The city's rapid urbanization and government initiatives further enhance its growth prospects, offering immense potential for property appreciation.
              </motion.p>
            </motion.div>

            {/* Image Right (Editorial Portrait) */}
            <motion.div 
              className="lg:col-span-5 lg:col-start-8 w-full aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden relative shadow-2xl order-1 lg:order-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={clipPathReveal}
            >
              <motion.div className="w-full h-full relative" variants={imageScaleDown}>
                <Image 
                  src="/assets/nri-corner/nri-textImg1.png" 
                  alt="Pune Infrastructure"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 3: WHY KUMAR CORP?
      ========================================= */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Image Left (Editorial Portrait) */}
            <motion.div 
              className="lg:col-span-5 lg:col-start-1 w-full aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden relative shadow-2xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={clipPathReveal}
            >
              <motion.div className="w-full h-full relative" variants={imageScaleDown}>
                <Image 
                  src="/assets/nri-corner/nri-textImg2.png" 
                  alt="Kumar Corp Legacy"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </motion.div>
            </motion.div>

            {/* Text Right */}
            <motion.div 
              className="lg:col-span-6 lg:col-start-7 space-y-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            >
              <motion.h3 variants={textReveal} className="text-3xl md:text-5xl font-sans font-black text-[var(--color-brand-black)] mb-6">
                Why <span className="special-text text-[var(--color-brand-orange)] font-normal">Kumar Corp?</span>
              </motion.h3>
              <motion.p variants={textReveal} className="text-lg md:text-xl leading-relaxed text-foreground/80 font-sans">
                Kumar Corp is synonymous with trust, quality, and excellence in the real estate sector. With a legacy spanning several decades, we have earned the reputation of being pioneers in crafting iconic landmarks across Pune. 
              </motion.p>
              <motion.p variants={textReveal} className="text-lg md:text-xl leading-relaxed text-foreground/80 font-sans">
                Our commitment to delivering exceptional projects, meticulous attention to detail, and adherence to stringent quality standards set us apart. We offer a diverse portfolio of residential and commercial properties that cater to varied budgets and preferences, ensuring every NRI investor finds their dream investment with us.
              </motion.p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 4: EXCLUSIVE BENEFITS
      ========================================= */}
      <section className="pt-24 md:pt-40 pb-0">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          
          <motion.div 
            className="max-w-5xl mb-16 md:mb-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            <motion.h2 variants={textReveal} className="text-3xl md:text-5xl lg:text-6xl leading-[1.2] font-sans font-black text-[var(--color-brand-black)] mb-12">
              Exclusive NRI benefits like <span className="special-text font-normal text-[var(--color-brand-orange)]">Easy Finance, Customer Care, Exclusive Offers</span> and Referral schemes.
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 border-t border-[var(--color-brand-black)]/10 pt-12">
              <motion.p variants={textReveal} className="text-lg md:text-xl leading-relaxed text-foreground/80 font-sans">
                At Kumar Corp, we understand the unique needs and challenges faced by NRIs when it comes to investing in real estate. That's why we have designed exclusive benefits to make your investment journey hassle-free and rewarding. With our easy finance options, we provide seamless assistance in securing loans and navigating the financial aspects of your purchase. Our dedicated customer care team is always at your service, ensuring prompt and personalized assistance at every step.
              </motion.p>
              <motion.p variants={textReveal} className="text-lg md:text-xl leading-relaxed text-foreground/80 font-sans">
                Investing in Pune with Kumar Corp unlocks a world of opportunities and exclusive benefits for NRIs. With Pune's promising real estate market, our impeccable reputation, and our dedication to serving the unique needs of NRIs, we invite you to embark on a rewarding investment journey with us. Discover the joy of owning your dream property in Pune and reap the benefits of a partnership that puts your interests first.
              </motion.p>
            </div>
          </motion.div>

          {/* Bottom Massive Image */}
          <motion.div 
            className="w-full aspect-video rounded-t-[var(--radius-lg)] overflow-hidden relative shadow-2xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={clipPathReveal}
          >
            <motion.div className="w-full h-full relative" variants={imageScaleDown}>
              <Image 
                src="/assets/nri-corner/nri-bottomImg.png" 
                alt="Exclusive Benefits and Lifestyle"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          SECTION 5: CONTACT US (DARK MODE FOOTER)
      ========================================= */}
      <section className="py-24 md:py-40 bg-[var(--color-brand-black)] text-[var(--color-brand-cream)] text-center relative overflow-hidden">
        
        {/* Subtle background element */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <span className="text-[20rem] font-special leading-none select-none text-white">&amp;</span>
        </div>

        <div className="container mx-auto px-6 md:px-12 max-w-4xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            <motion.div variants={textReveal} className="w-16 h-[1px] bg-[var(--color-brand-orange)] mx-auto mb-12" />
            
            <motion.h2 variants={textReveal} className="text-sm md:text-base uppercase tracking-[0.3em] font-bold text-[var(--color-brand-orange)] mb-6">
              Contact Us
            </motion.h2>

            <motion.h3 variants={textReveal} className="text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight font-sans mb-12">
              Ready to secure your <br />
              <span className="special-text text-[var(--color-brand-cream)] opacity-90">legacy in Pune?</span>
            </motion.h3>
            
            <motion.div variants={textReveal} className="inline-block">
              <a 
                href="mailto:info@kumarworld.com" 
                className="group flex items-center gap-4 text-xl md:text-3xl text-white hover:text-[var(--color-brand-orange)] transition-colors duration-300 border-b border-white/20 hover:border-[var(--color-brand-orange)] pb-2"
              >
                <Mail className="w-6 h-6 md:w-8 md:h-8" />
                <span>info@kumarworld.com</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}