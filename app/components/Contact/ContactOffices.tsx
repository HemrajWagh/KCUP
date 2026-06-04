"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation, Share2, MapPin, Phone, Mail, Printer } from "lucide-react";

// --- Location Data ---
const locations = [
  {
    id: "pune",
    title: "Pune – Corporate Office",
    address: "2413 East Street, Pune, Maharashtra, India 411001",
    phones: [
      "+91 (20) 67641660 / 661 / 662",
      "+91 (20) 30583660 / 635",
      "+91 9595 110011 (Sales)"
    ],
    emails: ["sales@kumarworld.com"],
    fax: "+91 20 26353365",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18306.178520844045!2d73.86244784006512!3d18.510438999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c1cdb405ca79%3A0x8d6c7e4f52bda07a!2sKumar%20Properties%20Pvt.%20Ltd.%20-%20Corporate%20Office!5e1!3m2!1sen!2sin!4v1748948076893!5m2!1sen!2sin",
    dirUrl: "https://www.google.com/maps/dir//Kumar+Properties+Pvt.+Ltd.+-+Corporate+Office+Ground+Floor,+Kumar+Capital+2413,+East+St,+Camp+Pune,+Maharashtra+411001/@18.510439,73.8799573,8408m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x3bc2c1cdb405ca79:0x8d6c7e4f52bda07a!2m2!1d73.8799573!2d18.510439"
  },
  {
    id: "mumbai",
    title: "Mumbai Office",
    address: "21, Hazarimal Somani Marg, Waudby Road, Opp. Bombay Gymkhana, Fort, Mumbai – 400 001, India",
    phones: ["+91-22-2209 4876", "+91-22-2209 4797", "+91 9595 110011 (Sales)"],
    emails: [],
    fax: "+91-22-2209 4796",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120686.09106658926!2d72.82265376549236!3d19.044367446531915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d10772ca5ffd%3A0xa9acc39d563f982c!2sKumar%20Properties%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1691135955765!5m2!1sen!2sin",
    dirUrl: "https://goo.gl/maps/kFnrjSn81hicuq3T8"
  },
  {
    id: "bengaluru",
    title: "Bengaluru Office",
    address: "33, Crescent Road High Grounds, Opp Taj West End Hotel, Bengaluru, India",
    phones: ["+91 (80) 41280992", "+91 76 76777111 (Sales)"],
    emails: ["bangalore@kumarworld.com"],
    fax: "+91-22-2209 4796",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31102.06340794359!2d77.54432527431642!3d12.987329000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae22d67d49a92d%3A0xad734413c1e88160!2sKumar%20Properties!5e0!3m2!1sen!2sin!4v1691136083003!5m2!1sen!2sin",
    dirUrl: "https://goo.gl/maps/X343ZJiaw6b5VGc7A"
  }
];

export default function ContactOffices() {
  const [activeLocationId, setActiveLocationId] = useState(locations[0].id);
  
  const activeLocation = locations.find(loc => loc.id === activeLocationId) || locations[0];

  // --- Handlers ---
  const handleShare = async (url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Kumar Corp",
          text: "Discover Your Dream Community",
          url: url,
        });
      } catch (error) {
        console.log("Error sharing", error);
      }
    } else {
      // Fallback for desktop browsers that don't support navigator.share
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const handleDirections = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <section className="relative w-full bg-[var(--color-brand-cream)] text-[var(--color-brand-black)] py-24 md:py-32">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-4 mb-16 md:mb-24"
        >
          <div className="h-[1px] w-12 bg-[var(--color-brand-orange)]" />
          <h5 className="uppercase tracking-widest text-sm text-[var(--color-brand-orange)] font-bold">
            Our Locations
          </h5>
        </motion.div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: Bespoke Accordion List */}
          <div className="lg:col-span-5 flex flex-col border-t border-[var(--color-brand-black)]/10">
            {locations.map((loc) => {
              const isActive = activeLocationId === loc.id;

              return (
                <div 
                  key={loc.id} 
                  className="border-b border-[var(--color-brand-black)]/10 overflow-hidden"
                >
                  {/* Accordion Header */}
                  <button 
                    onClick={() => setActiveLocationId(loc.id)}
                    className="w-full text-left py-8 flex items-center justify-between group"
                  >
                    <h3 className={`text-2xl md:text-3xl font-sans transition-colors duration-300 ${isActive ? "text-[var(--color-brand-orange)] font-bold" : "text-[var(--color-brand-black)] font-medium group-hover:text-[var(--color-brand-orange)]/70"}`}>
                      {loc.title}
                    </h3>
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${isActive ? "border-[var(--color-brand-orange)] bg-[var(--color-brand-orange)] text-white" : "border-[var(--color-brand-black)]/20 text-[var(--color-brand-black)]/40"}`}>
                      <motion.div
                        animate={{ rotate: isActive ? 180 : 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      >
                        ↓
                      </motion.div>
                    </div>
                  </button>

                  {/* Accordion Body (Framer Motion AnimatePresence) */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="pb-8 space-y-6 text-foreground/80 font-sans">
                          
                          {/* Address */}
                          <div className="flex items-start gap-4">
                            <MapPin className="w-5 h-5 mt-1 text-[var(--color-brand-orange)] shrink-0" />
                            <p className="text-lg leading-relaxed">{loc.address}</p>
                          </div>

                          {/* Phones */}
                          {loc.phones.length > 0 && (
                            <div className="flex items-start gap-4">
                              <Phone className="w-5 h-5 mt-1 text-[var(--color-brand-orange)] shrink-0" />
                              <div className="space-y-1">
                                {loc.phones.map((phone, i) => (
                                  <p key={i} className="text-lg">{phone}</p>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Emails */}
                          {loc.emails.length > 0 && (
                            <div className="flex items-start gap-4">
                              <Mail className="w-5 h-5 mt-1 text-[var(--color-brand-orange)] shrink-0" />
                              <div className="space-y-1">
                                {loc.emails.map((email, i) => (
                                  <a key={i} href={`mailto:${email}`} className="text-lg hover:text-[var(--color-brand-orange)] transition-colors inline-block">
                                    {email}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Fax */}
                          {loc.fax && (
                            <div className="flex items-start gap-4">
                              <Printer className="w-5 h-5 mt-1 text-[var(--color-brand-orange)] shrink-0" />
                              <p className="text-lg">{loc.fax}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Right: Premium Map Container */}
          <div className="lg:col-span-7 w-full aspect-square md:aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden shadow-2xl relative bg-black/5 group">
            
            {/* 
                Map Crossfade Wrapper 
                We use the activeLocationId as the `key` so Framer Motion knows to unmount the old iframe 
                and fade in the new one, avoiding the ugly native browser load flash.
            */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLocation.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full pointer-events-auto"
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={activeLocation.mapSrc}
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="filter grayscale-[20%] contrast-[1.1] transition-all duration-700" // Subtle filter for a more editorial map look
                />
              </motion.div>
            </AnimatePresence>

            {/* Overlaid Action Buttons */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-4 pointer-events-none">
              
              <button 
                onClick={() => handleDirections(activeLocation.dirUrl)}
                className="pointer-events-auto flex items-center gap-2 px-6 py-4 bg-[var(--color-brand-black)] text-[var(--color-brand-cream)] rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[var(--color-brand-orange)] transition-colors duration-300 shadow-xl"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </button>

              <button 
                onClick={() => handleShare(activeLocation.dirUrl)}
                className="pointer-events-auto flex items-center gap-2 px-6 py-4 bg-white/90 backdrop-blur-md text-[var(--color-brand-black)] rounded-full text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors duration-300 shadow-xl"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}