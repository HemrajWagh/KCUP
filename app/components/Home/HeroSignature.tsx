"use client";

import { motion } from "framer-motion";

export default function HeroGrowthSignature() {
  return (
    // Height set to 320px. The footer bar sits perfectly in the bottom 40px.
    <div className="absolute bottom-0 left-0 w-full overflow-hidden h-[320px] pointer-events-none flex justify-center z-20">
      
      <div className="relative h-full w-full max-w-[1920px]">
        
        {/* Soft orange glow behind the geometric peak */}
        <motion.div
          animate={{
            opacity: [0.15, 0.35, 0.15],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[300px] bottom-[80px] -translate-x-1/2 h-[250px] w-[350px] rounded-[100%] bg-[#F58220] blur-[75px] -z-10"
        />

        {/* Architectural Vectors */}
        <svg
          viewBox="0 0 1920 320"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-0 w-full h-full drop-shadow-2xl"
        >
          {/* LAYER 3: Inner Orange Chevron */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            d="M-250 600 L150 200 L220 270"
            fill="none"
            stroke="#F58220"
            strokeWidth="40"
            strokeLinejoin="miter"
            strokeLinecap="butt"
          />

          {/* LAYER 4: Inner White Chevron */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            d="M-250 544 L150 144 L276 270"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="40"
            strokeLinejoin="miter"
            strokeLinecap="butt"
          />

          {/* LAYER 5: Base Orange (The Outermost Umbrella & Footer Bar) */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            d="M-250 488 L150 88 L362 300 L1940 300"
            fill="none"
            stroke="#F58220"
            strokeWidth="40"
            strokeLinejoin="miter"
            strokeLinecap="butt"
          />
        </svg>

        {/* Contact Info Bar (Overlays exactly onto the bottom 40px orange stroke) */}
        <div className="absolute bottom-0 right-0 w-[calc(100%-400px)] h-[40px] flex items-center justify-center lg:justify-start px-8 pointer-events-auto">
          <div className="flex flex-wrap items-center gap-6 text-white text-sm md:text-base font-semibold tracking-wide">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              9595 11 00 11
            </span>
            <span className="hidden md:block text-orange-200">|</span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg>
              www.kumarcorp.co.in
            </span>
          </div>
        </div>

        {/* Stats Text (Floating above the bar and to the right of the arrows) */}
        <div className="absolute bottom-[65px] right-8 lg:right-32 pointer-events-auto">
          <p className="text-white text-lg md:text-[22px] font-bold tracking-wide">
            140+ Projects Delivered <span className="mx-2 font-normal text-gray-400">|</span> <span className="font-medium">43,000+ Happy Customers</span>
          </p>
        </div>

      </div>
    </div>
  );
}