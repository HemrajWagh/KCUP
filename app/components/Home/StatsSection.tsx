"use client"; // Required in Next.js when using React hooks

import React from "react";
import { Clock, Maximize, Building2, Users, HardHat } from "lucide-react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const stats = [
  {
    id: 1,
    icon: Clock,
    number: "60",
    suffix: "",
    title: "Years' Legacy",
    delay: "delay-100",
  },
  {
    id: 2,
    icon: Maximize,
    number: "38+",
    suffix: "M",
    title: "Sq. Ft. Built",
    delay: "delay-200",
  },
  {
    id: 3,
    icon: Building2,
    number: "140+",
    suffix: "",
    title: "Projects Delivered",
    delay: "delay-300",
  },
  {
    id: 4,
    icon: Users,
    number: "43000+", // Note: Changed to full number so CountUp animates properly
    suffix: "",
    title: "Happy Customers",
    delay: "delay-400",
  },
  {
    id: 5,
    icon: HardHat,
    number: "15+",
    suffix: "",
    title: "Ongoing Projects",
    delay: "delay-500",
  },
];

// 1. We create a sub-component so the Hook works properly for EVERY individual card
function StatCard({ stat }: { stat: typeof stats[0] }) {
  // Setup the scroll trigger
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const Icon = stat.icon;

  // Extract just the numbers for the animation (removes the '+')
  const numericValue = parseInt(stat.number.replace(/\D/g, ""));
  const hasPlus = stat.number.includes("+");

  return (
    <div
      className={`group relative flex flex-col items-center text-center p-6 md:p-8 rounded-2xl bg-white/40 backdrop-blur-lg border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(245,130,32,0.15)] hover:-translate-y-2 transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-10 ${stat.delay} fill-mode-both`}
    >
      <div className="mb-5 p-4 rounded-full bg-gradient-to-br from-white to-gray-50 text-primary shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 ease-out">
        <Icon size={32} strokeWidth={1.5} />
      </div>

      {/* 2. Here is where your ref and CountUp go */}
      <div ref={ref} className="flex items-baseline justify-center space-x-1 mb-2">
        <span className="font-sans font-black text-5xl md:text-6xl text-brand-black tracking-tighter drop-shadow-sm group-hover:text-primary transition-colors duration-300">
          {inView ? (
            <CountUp end={numericValue} duration={2.5} separator="," />
          ) : (
            "0"
          )}
          {hasPlus && "+"}
        </span>
        {stat.suffix && (
          <span className="font-sans font-bold text-2xl text-primary">
            {stat.suffix}
          </span>
        )}
      </div>

      <h3 className="special-text text-sm md:text-base lg:text-lg text-brand-black/80 font-medium tracking-wide">
        {stat.title}
      </h3>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-primary rounded-t-full transition-all duration-500 ease-out group-hover:w-1/2" />
    </div>
  );
}

// 3. The Main Section just maps over the sub-component
export default function StatsSection() {
  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center">
        <div className="w-[80%] h-[50%] bg-primary/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}