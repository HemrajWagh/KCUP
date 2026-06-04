

"use client";

import React, { useMemo, useEffect, useRef,useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Swiper from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Shadcn UI Components
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// import "./project-detail.css";

// Safely register plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}


// interface ProjectData {
//   flat_details?: {
//     amenities?: {
//       images?: string[];
//     };
//   };
// }
// export interface Certifications {
//   certified_by?: string[];
//   description?: string;
//   description_logo?: string;
//   qr_images?: string[];
// }
// export interface FlatDetails {
// 	amenities: Amenities;
// 	specification: Specification;
// 	isometric_view: IsometricView;
// }
// export interface Amenities {
// 	images: string[];
// 	bulleting: Bulleting[];
// }


// export interface Bulleting {
// 	title: string;
// 	points: string[];
// }

// export interface Specification {
// 	top_image: string;
// 	bottom_image: string;
// 	bulleting: Bulleting[];
// }

// export interface IsometricView {
// 	media: string[];
// }


// export interface ProjectData {
//   flat_details?: {
//     amenities?: {
//       images?: string[];
//       bulleting?: {
//         title: string;
//         points: string[];
//       }[];
//     };
//     specification?: {
//       bulleting?: {
//         title: string;
//         points: string[];
//       }[];
//     };
//     isometric_view?: {
//       media?: string[];
//     };
//   };

//   certification?: {
//     qr_images?: string[];
//     certified_by?: string[];
//     description?: string;
//     description_logo?: string;
//   };
// }

export interface ProjectData {
  flat_details?: FlatDetails;
  certification?: Certification;
  gallery_medias?: string[];
  apt_type?: string[];
  layout?: string;
  apartment_document?: ApartmentDocument[];
  // maps?: MapSection[];
  meta_tags?: MetaTag[];
  title?: string;
  sub_title?: string;
  description?: string;
  title_image?: string[];
  tech_stack?: string;
  entries?: string;
  tags?: string;
  city_name?: string;
  flat_view?: string;
}

export interface FlatDetails {
  amenities?: Amenities;
  specification?: Specification;
  isometric_view?: IsometricView;
}

export interface Amenities {
  images?: string[];
  bulleting?: Bulleting[];
}

export interface Specification {
  top_image?: string;
  bottom_image?: string;
  bulleting?: Bulleting[];
}

export interface Bulleting {
  title: string;
  points: string[];
}

export interface Certification {
  certified_by?: string[];
  description?: string;
  description_logo?: string;
  qr_images?: string[];
}

export interface IsometricView {
  media?: string[];
}

export interface ApartmentDocument {
  title: string;
  location: string;
}

export interface MetaTag {
  key: string;
  tag: string;
}

export enum LocationType {
  School = "School",
  Hospital = "Hospital",
  IT = "IT",
  Malls = "Malls",
  Others = "Others",
  Park = "Park",
}

export interface MapEntry {
  distance?: string;
  location_name?: string;
}

export interface MapSet {
  type: LocationType;
  title?: string;
  locations?: MapEntry[];
}



const splitParagraphIntoSentences = (paragraph: string): string[] => {
  if (!paragraph) return [];
  return paragraph.split(/[.?]/).filter((sentence) => sentence.trim() !== "");
};

// Register ScrollTrigger outside the component to avoid re-registering
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}


// export default function ProjectDetailClient({
//   projectData,
// }: {
//   projectData: any;
// })


export default function ProjectDetailClient({
  projectData,
}: {
  projectData: ProjectData;
}) {
  const containerRef = useRef<HTMLDivElement>(null);



  const [locationData, setLocationData] = useState<any>(
    projectData?.maps?.length > 0 ? projectData.maps[0] : null,
  );

  const [location, setLocation] = useState<string>(
    projectData?.maps?.length > 0 ? projectData.maps[0].type : "School",
  );

  const [selectedTab, setSelectedTab] = useState<string>(() => {
    if (projectData?.flat_view?.terrace_view_360) return "terrace360";
    if (projectData?.flat_view?.walk_through) return "walkthrough";
    if (projectData?.flat_view?.flat_view_360) return "flat360";
    return "live";
  });

  const [tabSelected, setTabSelected] = useState<string>(() => {
    if (projectData?.flat_details?.amenities?.bulleting?.[0])
      return "ammenties";
    if (projectData?.flat_details?.specification?.bulleting) return "flat360";
    return "live";
  });

  // Modals & Timers
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formSubmissionStatus, setFormSubmissionStatus] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [floorModalVisible, setFloorModalVisible] = useState(false);

  // const [floorModalVisible, setFloorModalVisible] = useState(false);
const [floorImg, setFloorImg] = useState("");
const [magnifier, setMagnifier] = useState({ show: false, x: 0, y: 0, width: 0, height: 0 });
const [zoomLevel, setZoomLevel] = useState(2.5);

  // Cinematic Hero State
  const [activeIndex, setActiveIndex] = useState(0);

  

// Gallery States
const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
// const [galleryModalOpen, setGalleryModalOpen] = useState(false);
const [activeImageIndex, setActiveImageIndex] = useState(0);

// ==========================================
// DATA MAPPING (IMPORTANT)
// Assuming your new API structure looks like this. 
// If you still only have the old flat array, it safely falls back to "All".
// ==========================================
const galleryCategories = projectData?.gallery_categories?.length > 0 
  ? projectData.gallery_categories 
  : [
      { name: "All Photos", images: projectData?.gallery_medias || [] }
    ];

// Get the images for whatever tab is currently clicked
const currentImages = galleryCategories[activeCategoryIndex]?.images || [];


// 1. Modal & Navigation States
const [galleryModalOpen, setGalleryModalOpen] = useState(false);
// const [activeImageIndex, setActiveImageIndex] = useState(0);
const [activeCategory, setActiveCategory] = useState("All");

// 2. Smart Data Mapper (Handles both old flat arrays and new categorized APIs)
const galleryItems = projectData?.gallery_medias?.map((media: any, index: any) => {
  return {
    // If it's a string, use it. If it's an object, get the URL.
    src: typeof media === 'string' ? media : media?.url || media?.src,
    // Assign category (fallback to 'Actual Photos' if none exists)
    category: typeof media === 'object' && media.category ? media.category : 'Actual Photos',
    // Assign caption (fallback to a generic name)
    caption: typeof media === 'object' && media.caption ? media.caption : `Architectural View ${index + 1}`
  };
}) || [];

// 3. Extract unique categories (plus "All")
const uniqueCategories = ["All", "Sample Flat", "Club House", "Indoor", "Outdoor", "Actual Photos"].filter(
  (cat) => cat === "All" || galleryItems.some((item: any) => item.category === cat)
);

// 4. Filter images based on selected tab
const filteredGallery = activeCategory === "All" 
  ? galleryItems 
  : galleryItems.filter((item: any) => item.category === activeCategory);

  // galleryItems.filter((item: any) => item.category === activeCategory);

// 5. Modal Navigation Handlers
const nextGalleryImage = (e: any) => {
  e.stopPropagation();
  setActiveImageIndex((prev) => (prev + 1) % filteredGallery.length);
};

const prevGalleryImage = (e: any) => {
  e.stopPropagation();
  setActiveImageIndex((prev) => (prev - 1 + filteredGallery.length) % filteredGallery.length);
};
  
// Add this to your other state variables
// NEW: Controls the dynamic zoom power (default 2.5x)

  // Derived Data
  const sentencesArray = splitParagraphIntoSentences(projectData?.description);
  const validTags = projectData?.tags?.filter(
    (tag: string) => tag && tag !== "Contact Us For Pricing",
  );

  // --- AUTO-PLAY CINEMATIC SLIDER ---
  useEffect(() => {
    if (!projectData?.title_image?.length) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % projectData.title_image.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [projectData?.title_image]);

  // --- GSAP ANIMATIONS ---
  useGSAP(
    () => {
      gsap.from(".details-wrapper", {
        scrollTrigger: {
          trigger: ".littleDetail",
          toggleActions: "restart pause pause reset",
          start: "0 80%",
        },
        y: "60%",
        duration: 1,
        ease: "power1.out",
      });
      // Additional GSAP configurations remain exactly the same as your prior code...
      ScrollTrigger.refresh();
    },
    { scope: containerRef },
  );

  // --- SWIPER INITIALIZATION ---
  useEffect(() => {
    if (projectData?.gallery_medias?.length) {
      new Swiper(".swiper-container-Gallary", {
        modules: [Navigation, Pagination],
        slidesPerView: 2.8,
        spaceBetween: 24,
        loop: true,
        pagination: { el: ".swiper-pagination", dynamicBullets: true },
        navigation: { nextEl: ".swiper-next", prevEl: ".swiper-prev" },
        breakpoints: { 320: { slidesPerView: 1 }, 640: { slidesPerView: 2.8 } },
      });
    }
  }, [projectData, modalVisible, floorModalVisible]); // Re-init if dialogs open

  // --- HELPER FUNCTIONS ---
  const mapLocationSelect = (locType: string) => {
    setLocation(locType);
    const foundData = projectData?.maps?.find((m: any) => m.type === locType);
    if (foundData) setLocationData(foundData);
  };

  const openCommonForm = () => {
    setIsFormOpen(true);
  };

  const handleDocumentDownload = (url: string) => {
    if (formSubmissionStatus) {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.download = "kumarcorp.pdf";
      a.click();
    } else {
      openCommonForm();
      localStorage.setItem("currentPdf", url);
    }
  };


  const processToWords = (sentences: any) => {
    if (!sentences || sentences.length === 0) return [];
    const paragraph = sentences.map((s: any) => s.trim() + ".").join(" ");
    return paragraph.split(" ");
  };

  const words1 = useMemo(() => processToWords(sentencesArray.slice(0, 5)), [sentencesArray]);
  const words2 = useMemo(() => processToWords(sentencesArray.slice(5)), [sentencesArray]);

  useEffect(() => {
    // Refresh ScrollTrigger after component mounts to recalculate heights
    ScrollTrigger.refresh();

    let ctx = gsap.context(() => {
      
      // 1. Header Animation
      gsap.fromTo(
        ".header-anim",
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%", // Plays when top of section hits 85% down the screen
            // Reverses when top of section goes back below 95% of the screen
            end: "top 95%", 
            toggleActions: "play reverse play reverse", 
            markers: true, // 🔴 VISUAL DEBUGGER - Remove this once it works!
          },
        }
      );

      // 2. Word-by-Word Animation
      gsap.fromTo(
        ".word-anim",
        { y: "120%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.03,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%", // Plays slightly after the header
            end: "top 95%",   // Reverses when you scroll back up past the top
            toggleActions: "play reverse play reverse", 
            markers: true, // 🔴 VISUAL DEBUGGER - Remove this once it works!
          },
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  // const [amenityImgIndex, setAmenityImgIndex] = useState(0);



// Add these to the top of your component alongside your other states
const [amenityImgIndex, setAmenityImgIndex] = useState(0);
const [isGalleryHovered, setIsGalleryHovered] = useState(false);

// Auto-rotate effect
useEffect(() => {
  const images = projectData?.flat_details?.amenities?.images || [];
  // Stop rotating if there's only 1 image, or if the user is hovering over the gallery
  if (images.length <= 1 || isGalleryHovered) return;

  const timer = setInterval(() => {
    setAmenityImgIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, 4000); // Changes image every 4 seconds

  
  

  return () => clearInterval(timer);
}, [projectData?.flat_details?.amenities?.images, isGalleryHovered]);

  return (
    <div
      ref={containerRef}
      className="w-full bg-[var(--color-brand-cream)] min-h-screen relative"
    >
      {/* ========================================= */}
      {/* PHASE 2: NEW CINEMATIC HERO SECTION       */}
      {/* ========================================= */}
      {/* Hero section remains identical to the previous implementation */}
   <section className="relative w-full flex flex-col md:block md:h-[100dvh] px-3 pb-3 pt-20 sm:px-4 sm:pb-4 sm:pt-24 md:p-6 lg:p-8 bg-[var(--color-brand-cream)] dark:bg-zinc-950">
      
      {/* Hero Image Container */}
      <div className="relative w-full aspect-[4/3] sm:aspect-video md:aspect-auto md:h-full rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl shrink-0">
        
        {/* Floating Back Button */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-10 md:left-10 z-50">
          <Link
            href="/properties"
            className="group flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-xl border border-white/30 shadow-xl rounded-full transition-all duration-300 hover:scale-105"
          >
            <img
              src="/assets/header/cross.png"
              alt="Back"
              className="w-4 h-4 sm:w-5 sm:h-5 object-contain opacity-90 group-hover:opacity-100"
            />
          </Link>
        </div>

        <AnimatePresence mode="popLayout" initial={false}>
          {(projectData?.title_image?.length ?? 0) > 0  && (
            <motion.img
              key={activeIndex}
              src={projectData.title_image[activeIndex]}
              alt={projectData?.title}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          )}
        </AnimatePresence>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 md:bg-gradient-to-t md:from-black/60 md:via-black/10 md:to-transparent pointer-events-none" />
      </div>

      {/* Floating Hero Content Island */}
      <div className="relative z-20 -mt-16 mx-4 sm:-mt-24 sm:mx-8 md:mt-0 md:mx-0 md:absolute md:inset-x-12 lg:inset-x-16 md:bottom-12 lg:bottom-16 flex flex-col lg:flex-row justify-between items-end gap-6 lg:gap-8 pb-8 md:pb-0 pointer-events-none">
        
        {/* Glass Card Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="w-full lg:w-auto max-w-3xl bg-black/40 sm:bg-black/30 md:bg-white/10 backdrop-blur-xl md:backdrop-blur-2xl border border-white/20 rounded-2xl md:rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-2xl pointer-events-auto"
        >
          {/* Sub Header */}
          <span className="text-white/80 text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase mb-2 sm:mb-3 block">
            {projectData?.sub_title || "Premium Residence"}
          </span>
          
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase leading-[1.1] tracking-tight text-white drop-shadow-lg">
            {projectData?.title}
          </h1>

          {/* Tags */}
          {validTags?.length > 0 && (
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-6 sm:mt-8">
              {validTags.map((tag: any, index: any) => (
                <button
                  key={index}
                  onClick={openCommonForm}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/30 text-[10px] sm:text-xs font-semibold tracking-wider uppercase transition-all duration-300 backdrop-blur-md shadow-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Premium Pill Indicators */}
        {(projectData?.title_image?.length ?? 1) > 1  && (
          <div className="flex gap-2 sm:gap-3 items-center bg-black/40 md:bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-3 lg:px-6 lg:py-4 rounded-full shadow-2xl w-full lg:w-auto justify-center lg:justify-start pointer-events-auto">
            {projectData.title_image.map((_: any, index: any) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className="relative h-1.5 sm:h-2 w-8 sm:w-12 bg-white/30 rounded-full overflow-hidden transition-all hover:bg-white/60"
                aria-label={`View image ${index + 1}`}
              >
                {activeIndex === index && (
                  <motion.div
                    layoutId="pillIndicator"
                    className="absolute top-0 left-0 h-full w-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                  />
                )}
              </button>
            ))}
          </div>
        )}
        
      </div>
    </section>

      {/* ========================================= */}
      {/* CONTENT SECTIONS (TAILWIND + SHADCN)      */}
      {/* ========================================= */}

     <section 
  ref={containerRef}
  className="relative z-20 w-full bg-[var(--color-brand-cream)] dark:bg-[#0a0a0a] py-16 md:py-24 lg:py-32 border-t border-gray-200 dark:border-zinc-900"
>
  <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
    
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 max-w-7xl mx-auto">
      
      {/* LEFT COLUMN: Editorial Header */}
      <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="flex items-center gap-3 text-brand-orange text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">
            <span className="w-8 h-[2px] bg-brand-orange"></span>
            The Vision
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase text-brand-black dark:text-white tracking-tighter leading-none">
            Project <br className="hidden lg:block" /> Overview
          </h2>
        </motion.div>
      </div>

      {/* RIGHT COLUMN: Typography Layout */}
      <div className="lg:col-span-8 flex flex-col gap-8 md:gap-10">
        
        {/* Lede Paragraph (Paragraph 1) - Larger, darker, more impact */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-lg md:text-xl lg:text-2xl text-brand-black dark:text-zinc-200 leading-relaxed md:leading-loose font-medium tracking-tight text-justify"
        >
          {/* We safely join the array of words back into a single string for perfect rendering */}
          {words1.join(" ")}
        </motion.p>

        {/* Body Paragraph (Paragraph 2) - Standard weight, slightly faded */}
        {words2.length > 0 && (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-base md:text-lg lg:text-xl text-gray-500 dark:text-zinc-400 leading-relaxed md:leading-loose font-light text-justify"
          >
            {words2.join(" ")}
          </motion.p>
        )}
        
      </div>
      
    </div>

  </div>
</section>

 {/* ========================================= */}
{/* RERA / STATUTORY SECTION (Centered)       */}
{/* ========================================= */}
{projectData?.certification?.description && (
  <section className="w-full py-10 md:py-16 bg-[var(--color-brand-cream)] dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800">
    <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-[9%]">
      
      {/* 1. Title Area */}
      <div className="flex items-center gap-4 mb-5">
        <img
          src={
            projectData?.city_name === "Bengaluru"
              ? "/assets/icons/Karnatak RERA Logo_200 x 200.png"
              : "/assets/icons/mahaReraIcon2.png"
          }
          alt="RERA Logo"
          className="w-12 h-12 md:w-16 md:h-16 object-contain"
        />
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          {projectData?.city_name === "Bengaluru" ? "Karnataka RERA" : "MahaRERA"}
        </h3>
      </div>

      {/* 2. Text Area */}
      <div className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-8">
        <span>
          <strong className="font-semibold text-gray-900 dark:text-gray-100">
            The project has been registered via {projectData?.city_name === "Bengaluru" ? "KarnatakaRERA" : "MahaRERA"} registration number:
          </strong>
        </span>
        <br />
        <span className="mt-1 inline-block">
          {projectData?.certification?.description} are available on the website{" "}
          <a
            href={
              projectData?.city_name === "Bengaluru"
                ? "http://rera.karnataka.gov.in"
                : "https://maharera.maharashtra.gov.in"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium hover:underline underline-offset-4 transition-colors break-words"
          >
            {projectData?.city_name === "Bengaluru"
              ? "rera.karnataka.gov.in"
              : "https://maharera.maharashtra.gov.in"}
          </a>{" "}
          under registered projects.
        </span>
      </div>

      {/* 3. Credentials and Bigger QR Codes Area (ALWAYS CENTERED) */}
      {projectData?.certification?.qr_images?.[0] && (
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mt-10">
          
          {/* Industry Logos */}
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            
            {/* Credai */}
            <div className={projectData?.city_name === "Bengaluru" ? "flex items-center gap-3" : "flex flex-col items-center gap-1.5"}>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center">
                Member of
              </span>
              <img
                src={
                  projectData?.city_name === "Bengaluru"
                    ? "/assets/icons/credai.png"
                    : "/assets/icons/Credai-Logo.png"
                }
                alt="Credai Logo"
                className="h-12 w-auto object-contain rounded-md"
              />
            </div>

            {/* IGBC (Conditional) */}
            {([
              "Kumar Park Infinia",
              "Kumar Prospera",
              "Princetown Royal",
              "Hill View Residency",
              "Kumar Primavera",
            ].includes(projectData?.title) ||
              projectData?.city_name === "Bengaluru") && (
              <div className={projectData?.city_name === "Bengaluru" ? "flex items-center gap-3" : "flex flex-col items-center gap-1.5"}>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center">
                  IGBC Certified
                </span>
                <img
                  src="/assets/icons/igbc.png"
                  alt="IGBC Logo"
                  className="h-12 w-auto object-contain rounded-md"
                />
              </div>
            )}
          </div>

          {/* Enlarge QR Images (ALWAYS CENTERED) */}
          <div className="flex flex-wrap justify-center gap-6">
            {projectData.certification.qr_images.map((qrImage:string, i: number) => (
              <div
                key={i}
                className="flex-shrink-0 bg-white dark:bg-zinc-100 p-2 rounded-xl shadow-sm border border-gray-200"
              >
                <img
                  src={qrImage}
                  alt="QR Code Verification"
                  className="w-32 h-32 md:w-44 md:h-44 object-contain"
                />
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  </section>
)}

        {projectData?.city_name === "Bengaluru" && (
            <div className="mahaReraDiv mb-3">
              <div className="animate-mahaTitle" style={{ overflow: "hidden" }}>
                <div className="mahaReraTitle d-flex">
                  <img
                    src="/assets/icons/Karnatak RERA Logo_200 x 200.png"
                    alt="Karnataka RERA"
                  />
                  <span>Karnataka Rera</span>
                </div>
              </div>

              <div className="animate-mahaText" style={{ overflow: "hidden" }}>
                <div className="mahaText">
                  <span>
                    <strong>
                      The project has been registered via Karnataka RERA
                      registration number:
                    </strong>
                  </span>
                  <br />
                  <span>
                    {projectData?.certification?.description} are available on
                    the website{" "}
                    <a
                      className="mahaLink"
                      href="http://rera.karnataka.gov.in"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      rera.karnataka.gov.in
                    </a>{" "}
                    under registered projects.
                  </span>
                </div>
              </div>

              {projectData?.certification?.qr_images?.[0] && (
                <div
                  className="row qrDiv"
                  style={{
                    padding: "0 3%",
                    marginTop: "5%",
                    justifyContent: "center",
                  }}
                >
                  <div className="col-lg-3 col-md-3 col-sm-12 qrs blend-1">
                    <div className="d-flex mb-3">
                      <span>Member of &nbsp; &nbsp;</span>
                      <img src="/assets/icons/credai.png" alt="Credai" />
                    </div>
                    <div className="d-flex">
                      <span>IGBC Certified</span>
                      <img src="/assets/icons/igbc.png" alt="IGBC" />
                    </div>
                  </div>

                  {projectData?.certification?.qr_images.map(
                    (qrImage: string, i: number) => (
                      <div
                        key={i}
                        className="col-lg-3 col-md-3 col-sm-12 qrdiv qrs"
                      >
                        <img src={qrImage} alt="QR Code" />
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          )}

        {/* 360 VIEWS & WALKTHROUGHS (Shadcn Tabs) */}
        {/* ========================================= */}
{/* 1. VIRTUAL EXPERIENCE (360 & LIVE VIEWS)  */}
{/* ========================================= */}

{(() => {
  const flatView = projectData?.flat_view || {};
  const projectTitle = projectData?.title || "";
  
  // 1. Dynamically build tabs with exact Angular text logic
  const availableTabs = [];
  
  if (flatView.terrace_view_360 && projectTitle === "Kumar Parc Residences") {
    availableTabs.push({
      id: "terrace360",
      label: "Terrace 360°",
      src: flatView.terrace_view_360,
      caption: `${projectTitle} Terrace View`
    });
  }
  
  if (flatView.walk_through) {
    let label = "Walkthrough";
    let caption = `${projectTitle} Walkthrough`;

    // Title specific logic from your Angular template
    if (projectTitle === "Kumar Parc Residences") {
      label = "Amenities 360°";
      caption = `${projectTitle} Amenities 360° View`;
    } else if (projectTitle === "Kumar Palmspring Towers") {
      label = "Sample Flat";
      caption = `${projectTitle} 3 BHK Sample Flat Video`;
    } else if (
      ["Kumar Prakruti", "Kumar Prospera", "Kumar Park Infinia", "Princetown Royal", "Princetown Towers", "Kumar Prithvi", "Kumar Siddhachal"].includes(projectTitle)
    ) {
      label = "Sample Flat";
      caption = `${projectTitle} Sample Flat Video`;
    }

    availableTabs.push({ id: "walkthrough", label, src: flatView.walk_through, caption });
  }

  if (flatView.flat_view_360) {
    availableTabs.push({ 
      id: "flat360", 
      label: "Flat 360°", 
      src: flatView.flat_view_360,
      caption: `${projectTitle} Flat 360° View`
    });
  }

  if (flatView.live_view) {
    availableTabs.push({ 
      id: "live", 
      label: "Live View", 
      src: flatView.live_view,
      caption: `${projectTitle} Live Construction View`
    });
  }

  // Check if project needs Construction Updates link
  const showConstruction = [
    "Kumar Parc Residences", "Kumar Paradise", "Kumar Prospera", "Kumar Palmspring Towers", 
    "Princetown Royal", "Princetown Tower", "Kumar Siddhachal", "Kumar Peninsula", 
    "Kumar Priyadarshan", "Kumar Prakruti", "Kumar Pinnacle", "Kumar Panache"
  ].includes(projectTitle);

  if (availableTabs.length === 0 && !showConstruction) return null;

  return (
    <section className="relative z-20 w-full bg-[var(--color-brand-cream)] dark:bg-zinc-950 py-12 md:py-24 overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
        
        {/* Section Headings */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          <span className="special-text text-brand-orange text-sm md:text-lg mb-1 md:mb-2">
            Explore Immersive
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase text-brand-black dark:text-white tracking-tight">
            Virtual Experience
          </h2>
          <div className="h-1 w-12 md:w-16 bg-brand-orange mt-4 md:mt-6 rounded-full"></div>
        </div>

        {availableTabs.length > 0 && (
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full max-w-6xl mx-auto flex flex-col items-center">
            
            {/* Tabs List Wrapper - Handled for mobile overflow */}
            <div className="w-full max-w-[100vw] overflow-x-auto [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden flex md:justify-center mb-6 md:mb-10 pb-2">
              <TabsList className="inline-flex w-max p-2 bg-gray-200/60 dark:bg-zinc-800/60 rounded-full shadow-inner border border-gray-200 dark:border-zinc-700 items-center">
                {availableTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    // Increased vertical size: py-4 on mobile, py-5 on desktop. Increased side padding.
                    className="relative shrink-0 px-8 py-3.5 md:px-10 md:py-5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 data-[state=active]:text-white transition-colors duration-300 z-10 outline-none"
                  >
                    {selectedTab === tab.id && (
                      <motion.div
                        layoutId="virtual-tour-active-tab-clean"
                        className="absolute inset-0 bg-brand-orange rounded-full -z-10 shadow-[0_4px_15px_rgba(245,130,32,0.4)]"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }} 
                      />
                    )}
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Iframe Wrapper */}
            <div className="w-full p-1.5 md:p-3 bg-white dark:bg-zinc-900 rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-zinc-800">
              <div className="relative rounded-[1rem] md:rounded-[2rem] overflow-hidden bg-zinc-100 dark:bg-black flex flex-col">
                {availableTabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="m-0 focus-visible:outline-none w-full flex flex-col">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col w-full"
                    >
                      {/* Video Frame */}
                      <iframe 
                        src={tab.src} 
                        className="w-full aspect-[4/3] sm:aspect-video min-h-[300px] md:min-h-[550px] flex-grow" 
                        frameBorder="0" 
                        allowFullScreen
                      />
                      
                      {/* Integrated Caption Bar */}
                      <div className="w-full py-4 md:py-6 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 text-center">
                        <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand-orange">
                          {tab.caption}
                        </p>
                      </div>
                    </motion.div>
                  </TabsContent>
                ))}
              </div>
            </div>

          </Tabs>
        )}

        {/* Construction Updates Button (Converted from Angular) */}
        {showConstruction && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 md:mt-24 flex flex-col items-center justify-center text-center"
          >
            <h3 className="text-xl md:text-2xl font-bold text-brand-black dark:text-white mb-6">
              Construction Updates
            </h3>
            <Link 
              href="/work-progress"
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white uppercase tracking-widest text-sm bg-brand-orange rounded-full overflow-hidden shadow-[0_10px_20px_rgba(245,130,32,0.3)] transition-transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              Click Here
            </Link>
          </motion.div>
        )}

      </div>
    </section>
  );
})()}

{/* ========================================= */}
{/* 2. PROJECT DETAILS (Amenities, Specs, Plans) */}
{/* ========================================= */}
{(() => {
  const hasAmenities = !!projectData?.flat_details?.amenities?.bulleting?.[0];
  const hasSpecs = !!projectData?.flat_details?.specification?.bulleting?.[0];
  const hasFloorPlan = !!projectData?.flat_details?.isometric_view?.media?.[0];
  
  if (!hasAmenities && !hasSpecs && !hasFloorPlan) return null;

  return (
    <section className="relative z-20 px-4 md:px-[9%] py-8 md:py-16 bg-[var(--color-brand-cream)]">
      
      {/* Section Headings */}
      <div className="flex flex-col items-center text-center mb-10 md:mb-16">
        <span className="special-text text-brand-orange text-lg md:text-xl md:mb-1">
          Discover Premium
        </span>
        <h2 className="text-3xl md:text-5xl font-black uppercase text-brand-black tracking-tight">
          Project Details
        </h2>
        <div className="h-1 w-12 bg-brand-orange mt-6 rounded-full"></div>
      </div>

      <Tabs value={tabSelected} onValueChange={setTabSelected} className="w-full max-w-7xl mx-auto flex flex-col items-center">
  
  {/* Scrollable Mobile Tabs Wrapper (Matches Virtual Experience styling) */}
  <div className="w-full max-w-[100vw] overflow-x-auto [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden flex md:justify-center mb-10 md:mb-16 pb-2">
    <TabsList className="inline-flex w-max p-2 bg-gray-200/60 dark:bg-zinc-800/60 rounded-full shadow-inner border border-gray-200 dark:border-zinc-700 items-center">
      
      {hasAmenities && (
        <TabsTrigger
          value="ammenties"
          className="relative shrink-0 px-8 py-3.5 md:px-10 md:py-5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 data-[state=active]:text-white transition-colors duration-300 z-10 outline-none"
        >
          {tabSelected === "ammenties" && (
            <motion.div
              layoutId="project-details-active-tab"
              className="absolute inset-0 bg-brand-orange rounded-full -z-10 shadow-[0_4px_15px_rgba(245,130,32,0.4)]"
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }} 
            />
          )}
          Amenities
        </TabsTrigger>
      )}

      {hasSpecs && (
        <TabsTrigger
          value="flat360" // Kept as your original value so the content pane doesn't break
          className="relative shrink-0 px-8 py-3.5 md:px-10 md:py-5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 data-[state=active]:text-white transition-colors duration-300 z-10 outline-none"
        >
          {tabSelected === "flat360" && (
            <motion.div
              layoutId="project-details-active-tab"
              className="absolute inset-0 bg-brand-orange rounded-full -z-10 shadow-[0_4px_15px_rgba(245,130,32,0.4)]"
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }} 
            />
          )}
          Specifications
        </TabsTrigger>
      )}

      {hasFloorPlan && (
        <TabsTrigger
          value="live" // Kept as your original value so the content pane doesn't break
          className="relative shrink-0 px-8 py-3.5 md:px-10 md:py-5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 data-[state=active]:text-white transition-colors duration-300 z-10 outline-none"
        >
          {tabSelected === "live" && (
            <motion.div
              layoutId="project-details-active-tab"
              className="absolute inset-0 bg-brand-orange rounded-full -z-10 shadow-[0_4px_15px_rgba(245,130,32,0.4)]"
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }} 
            />
          )}
          Floor Plan
        </TabsTrigger>
      )}

    </TabsList>
  </div>

  {/* Your existing <div className="mt-4"> TabsContent blocks stay exactly the same below here */}

        <div className="mt-4">

          <TabsContent value="ammenties" className="m-0 focus-visible:outline-none">
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mt-6 md:mt-10">
    
    {/* ========================================= */}
    {/* LEFT COLUMN: Auto-Rotating Smart Gallery  */}
    {/* ========================================= */}
    <div 
      className="lg:col-span-5 lg:sticky lg:top-32 relative group"
      // Pause the auto-slider when the user's mouse is over it
      onMouseEnter={() => setIsGalleryHovered(true)}
      onMouseLeave={() => setIsGalleryHovered(false)}
    >
      
      {/* 
        Exact Proportions: Using aspect-[670/744] forces the container 
        to maintain the exact dimensions you requested. 
      */}
      <div className="relative w-full aspect-[670/744] mx-auto rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl bg-white/40 dark:bg-white/10 backdrop-blur-2xl border border-white/50 dark:border-white/20 ">
        
       <div 
  className="lg:col-span-5 lg:sticky lg:top-32 relative group"
  onMouseEnter={() => setIsGalleryHovered(true)}
  onMouseLeave={() => setIsGalleryHovered(false)}
>
  
  {/* 
    FIXED SIZE & NO BORDER: 
    - Removed border and padding.
    - Added min-h-[400px] lg:min-h-[600px] to enforce a strict minimum height.
    - Keeps aspect-[670/744] for the perfect proportion beyond the minimum.
  */}
  <div className="relative w-full min-h-[400px] lg:min-h-[600px] aspect-[670/744] mx-auto rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl bg-zinc-100 dark:bg-zinc-900">
    
    {/* 
      REMOVED `mode="popLayout"`:
      This ensures the images perfectly stack on top of each other during the crossfade
      without causing a layout recalculation (the "jerk").
    */}
    <AnimatePresence>
      {(projectData?.flat_details?.amenities?.images?.length ?? 0) > 0 && (
  <motion.img
    key={amenityImgIndex}
    src={
      projectData?.flat_details?.amenities?.images?.[amenityImgIndex] ?? ""
    }
    alt={`Amenity view ${amenityImgIndex + 1}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1, ease: "easeInOut" }}
    className="absolute inset-0 w-full h-full object-cover object-center"
  />
)}
    </AnimatePresence>

    {/* Subtle gradient overlay to make indicators pop */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

    {/* Premium Animated Progress Bar */}
    {(projectData?.flat_details?.amenities?.images?.length ?? 1) > 1 && (
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 backdrop-blur-sm z-30">
        <motion.div
          key={amenityImgIndex}
          initial={{ width: "0%" }}
          animate={{ width: isGalleryHovered ? "0%" : "100%" }}
          transition={{ duration: 4, ease: "linear" }}
          className="h-full bg-brand-orange"
        />
      </div>
    )}

    {/* Gallery Pill Indicators */}
    {(projectData?.flat_details?.amenities?.images?.length ?? 1) > 1 && (
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20 pointer-events-auto">
        <div className="flex gap-2 items-center bg-black/40 backdrop-blur-xl border border-white/20 px-4 py-2.5 rounded-full shadow-2xl">
          {projectData?.flat_details?.amenities?.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setAmenityImgIndex(index)}
              className="relative h-1.5 w-8 bg-white/30 rounded-full overflow-hidden transition-all hover:bg-white/60"
              aria-label={`View image ${index + 1}`}
            >
              {amenityImgIndex === index && (
                <motion.div
                  layoutId="amenityIndicator"
                  className="absolute top-0 left-0 h-full w-full bg-brand-orange rounded-full shadow-[0_0_10px_rgba(245,130,32,0.8)]"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    )}

  </div>
</div>

        {/* Gallery Pill Indicators */}
        {( projectData?.flat_details?.amenities?.images?.length ?? 1) > 1 && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20 pointer-events-auto">
            <div className="flex gap-2 items-center bg-black/40 backdrop-blur-xl border border-white/20 px-4 py-2.5 rounded-full shadow-2xl">
              {projectData.flat_details.amenities.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setAmenityImgIndex(index)}
                  className="relative h-1.5 w-8 bg-white/30 rounded-full overflow-hidden transition-all hover:bg-white/60"
                  aria-label={`View image ${index + 1}`}
                >
                  {amenityImgIndex === index && (
                    <motion.div
                      layoutId="amenityIndicator"
                      className="absolute top-0 left-0 h-full w-full bg-brand-orange rounded-full shadow-[0_0_10px_rgba(245,130,32,0.8)]"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>

    {/* ========================================= */}
    {/* RIGHT COLUMN: Smart Amenities List        */}
    {/* ========================================= */}
    <div className="lg:col-span-7">
      <div className="bg-white/40 dark:bg-white/5 backdrop-blur-2xl rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-12 shadow-[0_20px_60px_rgb(0,0,0,0.05)] border border-white/60 dark:border-white/10">
        
        {/* Title */}
        <div className="mb-8 md:mb-12">
          <span className="special-text text-brand-orange text-sm md:text-base mb-2 block">
            Lifestyle
          </span>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase text-brand-black dark:text-white tracking-tight">
            World-Class Facilities
          </h3>
          <div className="h-1 w-12 bg-brand-orange mt-5 rounded-full"></div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {projectData?.flat_details?.amenities?.bulleting?.map((amenity, i) => {
            
            const hasSubPoints = amenity.points && amenity.points.filter(pt => pt).length > 0;

            if (hasSubPoints) {
              return (
                <AccordionItem 
                  key={i} 
                  value={`amenity-${i}`} 
                  className="border-b border-gray-200/50 dark:border-zinc-800 last:border-none py-2"
                >
                  <AccordionTrigger className="text-left font-bold text-lg md:text-xl text-zinc-800 dark:text-zinc-200 hover:text-brand-orange dark:hover:text-brand-orange transition-colors hover:no-underline [&[data-state=open]]:text-brand-orange py-4">
                    {amenity.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-600 dark:text-zinc-400 font-light leading-relaxed pt-2 pb-6">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mt-2">
                      {amenity.points.map((pt, j) => pt ? (
                        <li key={j} className="flex items-start group/item">
                          <span className="mr-3 text-brand-orange flex-shrink-0 mt-1.5 transition-transform group-hover/item:scale-125">
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                              <circle cx="7" cy="7" r="4" fill="currentColor"/>
                              <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeOpacity="0.4"/>
                            </svg>
                          </span>
                          <span className="text-sm md:text-base font-medium">{pt}</span>
                        </li>
                      ) : null)}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              );
            } else {
              return (
                <div 
                  key={i} 
                  className="border-b border-gray-200/50 dark:border-zinc-800 last:border-none py-6 flex items-center group/static"
                >
                  <span className="mr-4 text-brand-orange transition-transform group-hover/static:scale-125">
                    <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="4" fill="currentColor"/>
                      <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeOpacity="0.4"/>
                    </svg>
                  </span>
                  <span className="text-left font-bold text-lg md:text-xl text-zinc-800 dark:text-zinc-200 group-hover/static:text-brand-orange transition-colors">
                    {amenity.title}
                  </span>
                </div>
              );
            }
          })}
        </Accordion>
      </div>
    </div>

  </div>
</TabsContent>
          
       

          {/* SPECIFICATIONS CONTENT */}
         
         <TabsContent value="flat360" className="m-0 focus-visible:outline-none">
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mt-6 md:mt-10">
    
    {/* ========================================= */}
    {/* LEFT COLUMN: Editorial Overlapping Images */}
 
<div className="lg:col-span-5 lg:sticky lg:top-32 relative">
  
  {/* 
    Increased bottom margin (mb-32 md:mb-40) to guarantee the 
    hanging bottom image doesn't crash into the content below it.
  */}
  <div className="relative w-full mb-32 md:mb-40">
    
    {/* Top Image (Main) - Aspect 543/751 */}
    {projectData?.flat_details?.specification?.top_image && (
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
       
        className="w-[95%] md:w-[90%] aspect-[543/751] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative z-10 group"
      >
        <img
          src={projectData.flat_details.specification.top_image}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          alt="Specification Main View"
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[2rem] md:rounded-[2.5rem] pointer-events-none" />
      </motion.div>
    )}

    {/* Bottom Image (Overlap) - Aspect 281/255 */}
    {projectData?.flat_details?.specification?.bottom_image && (
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="absolute right-0 bottom-0 translate-y-[50%] w-[65%] md:w-[60%] z-20"
      >
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="w-full aspect-[281/255] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative group"
        >
          <img
            src={projectData.flat_details.specification.bottom_image}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            alt="Specification Detail View"
          />
          {/* Internal White Border */}
          <div className="absolute inset-0 border-[3px] border-white dark:border-zinc-900 rounded-[1.5rem] md:rounded-[2rem] pointer-events-none opacity-90" />
        </motion.div>
      </motion.div>
    )}

  </div>
</div>

    {/* ========================================= */}
    {/* RIGHT COLUMN: Smart Specifications List   */}
    {/* ========================================= */}
    <div className="lg:col-span-7">
      <div className="bg-white/40 dark:bg-white/5 backdrop-blur-2xl rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-12 shadow-[0_20px_60px_rgb(0,0,0,0.05)] border border-white/60 dark:border-white/10">
        
        {/* Title */}
        <div className="mb-8 md:mb-12">
          <span className="special-text text-brand-orange text-sm md:text-base mb-2 block">
            Finest Details
          </span>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase text-brand-black dark:text-white tracking-tight">
            Specifications
          </h3>
          <div className="h-1 w-12 bg-brand-orange mt-5 rounded-full"></div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {projectData?.flat_details?.specification?.bulleting?.map((spec:Bulleting, i:number) => {
            
            const hasSubPoints = spec.points && spec.points.filter(pt => pt).length > 0;

            if (hasSubPoints) {
              return (
                <AccordionItem 
                  key={i} 
                  value={`spec-${i}`} 
                  className="border-b border-gray-200/50 dark:border-zinc-800 last:border-none py-2"
                >
                  <AccordionTrigger className="text-left font-bold text-lg md:text-xl text-zinc-800 dark:text-zinc-200 hover:text-brand-orange dark:hover:text-brand-orange transition-colors hover:no-underline [&[data-state=open]]:text-brand-orange py-4">
                    {spec.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-600 dark:text-zinc-400 font-light leading-relaxed pt-2 pb-6">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mt-2">
                      {spec.points.map((pt, j:number) => pt ? (
                        <li key={j} className="flex items-start group/item">
                          <span className="mr-3 text-brand-orange flex-shrink-0 mt-1.5 transition-transform group-hover/item:scale-125">
                            {/* Custom Dot-Ring SVG */}
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                              <circle cx="7" cy="7" r="4" fill="currentColor"/>
                              <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeOpacity="0.4"/>
                            </svg>
                          </span>
                          <span className="text-sm md:text-base font-medium">{pt}</span>
                        </li>
                      ) : null)}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              );
            } else {
              return (
                <div 
                  key={i} 
                  className="border-b border-gray-200/50 dark:border-zinc-800 last:border-none py-6 flex items-center group/static"
                >
                  <span className="mr-4 text-brand-orange transition-transform group-hover/static:scale-125">
                    <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="4" fill="currentColor"/>
                      <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeOpacity="0.4"/>
                    </svg>
                  </span>
                  <span className="text-left font-bold text-lg md:text-xl text-zinc-800 dark:text-zinc-200 group-hover/static:text-brand-orange transition-colors">
                    {spec.title}
                  </span>
                </div>
              );
            }
          })}
        </Accordion>
      </div>
    </div>

  </div>
</TabsContent>


{/* FLOOR PLAN CONTENT (Grid Gallery)         */}

<TabsContent value="live" className="m-0 focus-visible:outline-none">
  <div className="mt-8 md:mt-12">
    
    {/* Title Header */}
    <div className="flex flex-col items-center text-center mb-10 md:mb-16">
      <span className="special-text text-brand-orange text-sm md:text-base mb-2 block">
        Architectural Brilliance
      </span>
      <h3 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase text-brand-black dark:text-white tracking-tight">
        Master Floor Plans
      </h3>
      <div className="h-1 w-12 bg-brand-orange mt-5 rounded-full"></div>
    </div>

    {/* The Gallery Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
      {projectData?.flat_details?.isometric_view?.media?.map((plan: string, i: number) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.1 }}
          className="cursor-pointer group flex flex-col"
          onClick={() => {
            setFloorImg(plan);
            setZoomLevel(2.5); // Reset zoom when opening a new image
            setFloorModalVisible(true);
          }}
        >
          {/* Image Card */}
          <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden bg-white dark:bg-zinc-900 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-zinc-800 p-6 md:p-8 flex items-center justify-center transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(245,130,32,0.15)] group-hover:border-brand-orange/50">
            
            <img
              src={plan}
              alt={`Floor Plan ${i + 1}`}
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
            />
            
            <div className="absolute inset-0 bg-brand-orange/5 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
              <div className="flex items-center gap-2 bg-brand-orange text-white font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-full shadow-[0_10px_20px_rgba(245,130,32,0.4)] transform translate-y-8 group-hover:translate-y-0 transition-all duration-500">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
                Inspect Plan
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center text-center px-4">
            <span className="text-brand-orange font-bold text-xs uppercase tracking-[0.2em] mb-1">
              Configuration {i + 1}
            </span>
            <span className="text-zinc-800 dark:text-zinc-200 font-semibold text-lg md:text-xl">
              {projectData?.title} Master Plan
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</TabsContent>

{/* ========================================= */}
{/* ADVANCED MAGNIFIER LIGHTBOX MODAL         */}
{/* ========================================= */}
<AnimatePresence>
  {floorModalVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      // NEW: Removed black backdrop. Replaced with bright frosted glass.
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-100/80 dark:bg-zinc-950/80 backdrop-blur-2xl p-4 md:p-10 overflow-hidden"
      onClick={() => setFloorModalVisible(false)}
    >
      
      {/* Ambient Orange Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[50vw] h-[50vw] bg-brand-orange/10 blur-[120px] rounded-full" />
      </div>

      {/* Floating Close Button (Now Orange) */}
      <button 
        className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 md:w-14 md:h-14 bg-white dark:bg-zinc-800 hover:bg-brand-orange text-brand-orange hover:text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-200 dark:border-zinc-700 hover:border-brand-orange transition-all duration-300 z-50"
        onClick={() => setFloorModalVisible(false)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* Image Container */}
      <div 
        className="relative inline-block bg-white dark:bg-zinc-900 rounded-[2rem] p-4 md:p-8 shadow-[0_30px_100px_rgba(245,130,32,0.15)] border border-white dark:border-zinc-800 z-10"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* The Image with Hover Tracking */}
        <div 
          className="relative cursor-crosshair overflow-hidden rounded-xl"
          onMouseEnter={() => setMagnifier(prev => ({ ...prev, show: true }))}
          onMouseLeave={() => setMagnifier(prev => ({ ...prev, show: false }))}
          onMouseMove={(e) => {
            const { top, left, width, height } = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;
            setMagnifier({ show: true, x, y, width, height });
          }}
        >
          <img
            src={floorImg}
            alt="Floor Plan Expanded"
            className="w-auto h-auto max-w-[90vw] max-h-[70vh] object-contain block"
          />

          {/* THE ADVANCED LENS MAGNIFIER (400x400px) */}
          {magnifier.show && (
            <div
              className="absolute pointer-events-none rounded-full border-4 border-brand-orange bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3),inset_0_0_30px_rgba(0,0,0,0.2)] z-50 overflow-hidden"
              style={{
                width: "400px",
                height: "400px",
                top: `${magnifier.y - 200}px`,
                left: `${magnifier.x - 200}px`,
                backgroundImage: `url('${floorImg}')`,
                backgroundRepeat: "no-repeat",
                // Dynamic Zoom Math using the state variable
                backgroundSize: `${magnifier.width * zoomLevel}px ${magnifier.height * zoomLevel}px`,
                backgroundPositionX: `${-magnifier.x * zoomLevel + 200}px`,
                backgroundPositionY: `${-magnifier.y * zoomLevel + 200}px`,
              }}
            >
              {/* Precision Crosshair inside the lens */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 opacity-40">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-brand-orange" />
                <div className="absolute left-1/2 top-0 w-[1px] h-full bg-brand-orange" />
              </div>
            </div>
          )}
        </div>
        
      </div>

      {/* ADVANCED ZOOM CONTROL PANEL */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 md:gap-6 bg-white dark:bg-zinc-900 p-4 md:px-8 md:py-5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-brand-orange/20 z-50"
      >
        <span className="text-brand-orange font-black text-xs md:text-sm uppercase tracking-widest flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
          Zoom Power
        </span>
        
        {/* The Slider */}
        <input 
          type="range" 
          min="1.5" 
          max="5" 
          step="0.1" 
          value={zoomLevel} 
          onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
          className="w-32 md:w-48 h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-brand-orange"
        />
        
        <span className="bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-md font-mono font-bold text-sm md:text-base min-w-[3.5rem] text-center">
          {zoomLevel.toFixed(1)}x
        </span>
      </motion.div>

    </motion.div>
  )}
</AnimatePresence>

{/* ========================================= */}
{/* MAGNIFIER LIGHTBOX MODAL                  */}
{/* ========================================= */}
<AnimatePresence>
  {floorModalVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-brand-black/90 backdrop-blur-2xl p-4 md:p-10"
      onClick={() => setFloorModalVisible(false)} // Close if clicking background
    >
      
      {/* Floating Close Button */}
      <button 
        className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-brand-orange text-white rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20 transition-colors shadow-2xl z-50"
        onClick={() => setFloorModalVisible(false)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* 
        Image Container 
        Stop propagation so clicking the image doesn't close the modal 
      */}
      <div 
        className="relative inline-block bg-white dark:bg-zinc-900 rounded-[2rem] p-4 md:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/10"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* The Image with Hover Tracking */}
        <div 
          className="relative cursor-crosshair overflow-hidden rounded-xl"
          onMouseEnter={() => setMagnifier(prev => ({ ...prev, show: true }))}
          onMouseLeave={() => setMagnifier(prev => ({ ...prev, show: false }))}
          onMouseMove={(e) => {
            // Calculate exact mouse position relative to the image
            const { top, left, width, height } = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;
            setMagnifier({ show: true, x, y, width, height });
          }}
        >
          <img
            src={floorImg}
            alt="Floor Plan Expanded"
            className="w-auto h-auto max-w-[90vw] max-h-[80vh] object-contain block"
          />

          {/* 
            THE LENS MAGNIFIER 
            Only shows when mouse is moving over the image 
          */}
          {magnifier.show && (
            <div
              className="absolute pointer-events-none rounded-full border-[3px] border-brand-orange/80 shadow-[0_10px_40px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(0,0,0,0.5)] z-50"
              style={{
                // Dimensions of the magnifying glass
                width: "250px",
                height: "250px",
                // Center the lens exactly on the cursor
                top: `${magnifier.y - 125}px`,
                left: `${magnifier.x - 125}px`,
                // Draw the image inside the lens
                backgroundImage: `url('${floorImg}')`,
                backgroundRepeat: "no-repeat",
                // Zoom Level: 2.5x magnification
                backgroundSize: `${magnifier.width * 2.5}px ${magnifier.height * 2.5}px`,
                // Position the background exactly opposite to the mouse to create the zoom effect
                backgroundPositionX: `${-magnifier.x * 2.5 + 125}px`,
                backgroundPositionY: `${-magnifier.y * 2.5 + 125}px`,
                backgroundColor: "white" // Prevents transparency bugs on transparent PNGs
              }}
            />
          )}
        </div>
        
        {/* Helper Text below image in modal */}
        <p className="text-center mt-6 text-zinc-500 dark:text-zinc-400 text-sm font-semibold uppercase tracking-widest flex justify-center items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-orange">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
          Hover over image to zoom
        </p>

      </div>
    </motion.div>
  )}
</AnimatePresence>
          <TabsContent value="live" className="m-0 focus-visible:outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {projectData?.flat_details?.isometric_view?.media?.map((plan, i) => (
                <div
                  key={i}
                  className="cursor-pointer group relative rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 bg-white aspect-[4/3] flex items-center justify-center p-4"
                  onClick={() => {
                    setFloorImg(plan);
                    setFloorModalVisible(true);
                  }}
                >
                  <img
                    src={plan}
                    alt={`Floor Plan ${i}`}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/30 backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-brand-orange text-white text-sm font-bold tracking-wider uppercase px-8 py-3 rounded-full transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 shadow-xl">
                      View Detail
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

        </div>
      </Tabs>
    </section>
  );
})()}

  

{/* ========================================= */}
{/* CATEGORIZED PROJECT GALLERY               */}
{/* ========================================= */}
{galleryItems.length > 0 && (
  <section className="relative w-full bg-[var(--color-brand-cream)] dark:bg-[#0a0a0a] py-16 md:py-24 border-t border-gray-200 dark:border-zinc-900">
    <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
      
      <div className="flex flex-col items-center text-center mb-10 md:mb-16">
        <span className="flex items-center gap-3 text-brand-orange text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-3">
          <span className="w-8 h-[2px] bg-brand-orange"></span>
          Visual Showcase
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-brand-black dark:text-white tracking-tighter leading-none">
          Project Gallery
        </h2>
      </div>

      {/* 1. Category Tabs (Sample Flat, Club House, etc.) */}
      <div className="flex justify-center w-full mb-10">
        <div className="flex overflow-x-auto [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden border-b-2 border-gray-100 dark:border-zinc-800 w-full md:w-auto">
          <div className="flex gap-6 md:gap-10 w-max mx-auto px-4 md:px-0">
            {uniqueCategories.map((category, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveCategory(category);
                  setActiveImageIndex(0); // Reset slider when changing tabs
                }}
                className={`relative pb-4 text-xs md:text-sm font-bold uppercase tracking-widest transition-colors duration-200 ${
                  activeCategory === category 
                    ? "text-brand-black dark:text-white" 
                    : "text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                }`}
              >
                {category}
                
                {/* Active Underline Animation */}
                {activeCategory === category && (
                  <motion.div
                    layoutId="gallery-tab-underline"
                    className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-brand-orange"
                    transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredGallery.map((item: any, i: any) => (
          <div
            key={i}
            onClick={() => {
              setActiveImageIndex(i);
              setGalleryModalOpen(true);
            }}
            className="group relative w-full aspect-square md:aspect-[4/3] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden  dark:bg-zinc-900 cursor-pointer border border-gray-200 dark:border-zinc-800"
          >
            <img
              src={item.src}
              alt={item.caption}
              className="absolute inset-0 w-full h-full rounded-[2rem] md:rounded-[2.5rem] object-cover grayscale-[15%] contrast-[1.1] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-in-out"
            />
            
            {/* Hover State: Shows Category & Inspect Icon */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-orange text-white flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 shadow-2xl">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"></path><path d="M9 21H3v-6"></path><path d="M21 3l-7 7"></path><path d="M3 21l7-7"></path></svg>
              </div>
              <span className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 text-white font-bold text-xs uppercase tracking-widest">
                {item.category}
              </span>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  </section>
)}

{/* ========================================= */}
{/* ADVANCED LIGHTBOX MODAL WITH CAPTIONS     */}
{/* ========================================= */}
<AnimatePresence>
  {galleryModalOpen && filteredGallery.length > 0 && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050505]/98 backdrop-blur-2xl p-4 md:p-8"
      onClick={() => setGalleryModalOpen(false)} // Click background to close
    >
      
      {/* Top Header: Image Counter & Close Button */}
      <div className="absolute top-0 left-0 right-0 p-6 md:p-10 flex justify-between items-center z-50 pointer-events-none">
        
        <span className="text-white/50 font-mono font-bold tracking-widest text-sm md:text-base border border-white/10 bg-white/5 px-4 py-2 pointer-events-auto">
          <span className="text-white">{activeImageIndex + 1}</span> / {filteredGallery.length}
        </span>

        <button 
          className="w-12 h-12 bg-white/5 hover:bg-brand-orange text-white border border-white/10 transition-colors flex items-center justify-center pointer-events-auto"
          onClick={() => setGalleryModalOpen(false)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      {/* Main Image Viewport */}
      <div 
        className="relative w-full max-w-[95vw] md:max-w-[85vw] h-[65vh] md:h-[75vh] flex items-center justify-center mt-12 md:mt-0"
        onClick={(e) => e.stopPropagation()} 
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImageIndex}
            src={filteredGallery[activeImageIndex]?.src}
            alt={filteredGallery[activeImageIndex]?.caption}
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          />
        </AnimatePresence>

        {/* Navigation Arrows */}
        {filteredGallery.length > 1 && (
          <>
            <button 
              onClick={prevGalleryImage}
              className="absolute left-0 md:left-[-3rem] top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-black/80 hover:bg-brand-orange border border-white/10 text-white flex items-center justify-center transition-colors shadow-2xl z-50"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button 
              onClick={nextGalleryImage}
              className="absolute right-0 md:right-[-3rem] top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-black/80 hover:bg-brand-orange border border-white/10 text-white flex items-center justify-center transition-colors shadow-2xl z-50"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </>
        )}
      </div>

      {/* Bottom Category & Caption Bar */}
      <div 
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 border border-white/10 bg-black/80 px-6 py-3 shadow-2xl flex flex-col md:flex-row items-center gap-2 md:gap-4 w-max max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Category Label (e.g., "Sample Flat") */}
        <span className="text-white font-bold tracking-widest text-xs uppercase bg-brand-orange px-3 py-1">
          {filteredGallery[activeImageIndex]?.category}
        </span>
        
        {/* Separator */}
        <span className="hidden md:block text-zinc-600">|</span>

        {/* Image Caption */}
        <p className="text-zinc-300 text-xs md:text-sm font-medium italic tracking-wide text-center md:text-left">
          {filteredGallery[activeImageIndex]?.caption}
        </p>
      </div>

    </motion.div>
  )}
</AnimatePresence>


{/* ========================================= */}
{/* MASTER LAYOUT PLAN                        */}
{/* ========================================= */}
{projectData?.layout && (
  <section className="relative w-full bg-[var(--color-brand-cream)] dark:bg-[#0a0a0a] py-16 md:py-24 border-t border-gray-200 dark:border-zinc-900">
    <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
      
      {/* Advanced Header (Matching Previous Sections) */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 md:mb-16 gap-6">
        <div>
          <span className="flex items-center gap-3 text-brand-orange text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-3">
            <span className="w-8 h-[2px] bg-brand-orange"></span>
            Macro Perspective
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black uppercase text-brand-black dark:text-white tracking-tighter leading-none">
            Master <br className="hidden lg:block" /> Layout
          </h2>
        </div>
        <p className="text-gray-500 dark:text-zinc-400 max-w-sm text-sm font-medium border-l-2 border-gray-200 dark:border-zinc-800 pl-4">
          A comprehensive top-down architectural blueprint detailing spatial distribution, landscaping, and the complete structural footprint.
        </p>
      </div>

      {/* Massive Interactive Image Wrapper */}
      <div 
        className="relative w-full rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#111] shadow-2xl ring-1 ring-black/5 dark:ring-white/10 group cursor-pointer"
        onClick={() => {
          // Reusing your advanced magnifier modal from the Floor Plan section!
          setFloorImg(projectData.layout);
          setZoomLevel(2.5); 
          setFloorModalVisible(true);
        }}
      >
        
        {/* Subtle grid pattern overlay for blueprint aesthetic */}
        <div className="absolute inset-0  dark:opacity-[0.02] pointer-events-none z-10"></div>

        <img 
          src={projectData.layout} 
          alt="Project Master Layout" 
          // Keeps it contained but large, filling 16:9 on desktop
          className="w-full h-auto aspect-square md:aspect-video object-contain bg-gray-100 dark:bg-zinc-900 transition-transform duration-1000 group-hover:scale-[1.03]" 
        />
        
        {/* Hover Interaction Overlay */}
        <div className="absolute inset-0 bg-brand-black/20 dark:bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-20">
          
          <div className="bg-brand-orange text-white font-bold uppercase tracking-widest text-xs md:text-sm px-6 py-3 md:px-8 md:py-4 rounded-md shadow-[0_20px_50px_rgba(245,130,32,0.4)] flex items-center gap-3 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500">
            
            {/* Crosshair Icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            
            Inspect Blueprint
          </div>

        </div>

      </div>

    </div>
  </section>
)}

{/* ========================================= */}
{/* ADVANCED ROUTE DASHBOARD (MAP SECTION)    */}
{/* ========================================= */}
{(projectData?.maps?.[0] || projectData?.location_in_map) && (
  <section className="relative w-full bg-[var(--color-brand-cream)] dark:bg-[#0a0a0a] py-16 md:py-24 overflow-hidden">
    <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
      
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 md:mb-16 gap-6">
        <div>
          <span className="flex items-center gap-3 text-brand-orange text-sm font-bold tracking-[0.2em] uppercase mb-3">
            <span className="w-8 h-[2px] bg-brand-orange"></span>
            Strategic Location
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black uppercase text-brand-black dark:text-white tracking-tighter leading-none">
            Neighborhood <br className="hidden lg:block" /> Connectivity
          </h2>
        </div>
        <p className="text-gray-500 dark:text-zinc-400 max-w-sm text-sm font-medium border-l-2 border-gray-200 dark:border-zinc-800 pl-4">
          Explore key landmarks, essential services, and premium lifestyle hubs situated just minutes away from {projectData?.title}.
        </p>
      </div>

      {/* Split Architectural Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* LEFT: The Map Frame */}
        <div className="lg:col-span-7 xl:col-span-8 h-[400px] sm:h-[500px] lg:h-[700px] rounded-[2rem] overflow-hidden relative shadow-2xl ring-1 ring-black/5 dark:ring-white/10 group bg-zinc-100 dark:bg-zinc-900">
          
          {/* Overlay instruction that fades on hover */}
          <div className="absolute top-6 left-6 z-10 bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-lg pointer-events-none group-hover:opacity-0 transition-opacity duration-500">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-black dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
              Interactive Map
            </span>
          </div>

          <iframe
            src={projectData.location_in_map}
            // Retains color but adds a premium contrast/saturate filter
            className="absolute inset-0 w-full h-full border-0 contrast-[1.05] saturate-[1.1] transition-all duration-700"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        
        {/* RIGHT: Advanced Route Data Panel */}
        {projectData?.maps?.[0] && (
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-full bg-white dark:bg-[#111111] rounded-[2rem] p-6 lg:p-8 shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
            
            {/* 1. Segmented Control Tabs */}
            <div className="bg-gray-100 dark:bg-zinc-900 p-1.5 rounded-2xl flex overflow-x-auto [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden mb-8">
              {projectData.maps.map((locType: any, i: any) => (
                <button
                  key={i}
                  onClick={() => mapLocationSelect(locType.type)}
                  className="relative flex-1 min-w-[100px] py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-center rounded-xl transition-colors duration-300 outline-none z-10"
                >
                  {location === locType.type && (
                    <motion.div
                      layoutId="segmented-tab"
                      className="absolute inset-0 bg-white dark:bg-[#222] rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 -z-10"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                    />
                  )}
                  <span className={location === locType.type ? "text-brand-orange" : "text-gray-500 dark:text-zinc-500 hover:text-brand-black dark:hover:text-zinc-300"}>
                    {locType.type}
                  </span>
                </button>
              ))}
            </div>

            {/* 2. Dashboard Header */}
            <div className="flex justify-between items-end mb-6 pb-4 border-b border-gray-100 dark:border-zinc-800">
              <h4 className="font-black text-xl lg:text-2xl text-brand-black dark:text-white uppercase tracking-tight">
                {locationData?.title || "Key Landmarks"}
              </h4>
              <div className="text-right">
                <span className="block text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Metric</span>
                <span className="text-brand-orange text-xs font-bold uppercase tracking-widest bg-brand-orange/10 px-2 py-1 rounded">
                  Distance
                </span>
              </div>
            </div>

            {/* 3. The "Connected Route" List */}
            <div className="flex-grow max-h-[350px] lg:max-h-full overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-brand-orange/80">
              
              <div className="relative pl-3">
                {/* Continuous Vertical Track Line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-gray-100 dark:bg-zinc-800"></div>

                {locationData?.locations?.map((mapItem: any, i: any) => (
                  <div key={i} className="relative flex items-center gap-6 group py-4">
                    
                    {/* The Node (Pin) */}
                    <div className="relative z-10 flex items-center justify-center w-[14px] h-[14px] rounded-full bg-white dark:bg-[#111] border-[3px] border-gray-300 dark:border-zinc-600 group-hover:border-brand-orange transition-colors duration-300 ring-4 ring-white dark:ring-[#111]" />
                    
                    {/* Data Block */}
                    <div className="flex-1 flex justify-between items-center bg-transparent group-hover:bg-gray-50 dark:group-hover:bg-zinc-900/50 p-3 -ml-3 rounded-xl transition-all duration-300 border border-transparent group-hover:border-gray-100 dark:group-hover:border-zinc-800 group-hover:translate-x-1 cursor-default">
                      <span className="font-bold text-sm text-gray-700 dark:text-zinc-300 group-hover:text-brand-black dark:group-hover:text-white transition-colors duration-300 pr-4">
                        {mapItem.location_name}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        {/* Connecting dashed line that appears on hover */}
                        <div className="hidden sm:block w-8 border-b-2 border-dashed border-gray-200 dark:border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <span className="font-mono text-xs font-bold text-brand-orange whitespace-nowrap bg-white dark:bg-[#111] px-2 py-1 rounded shadow-sm border border-gray-100 dark:border-zinc-800 group-hover:border-brand-orange/30 transition-colors">
                          {mapItem.distance}
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
            
          </div>
        )}
      </div>
      
    </div>
  </section>
)}

      
{/* DOCUMENTS & CREDITS (TECHNICAL LEDGER)    */}

{((projectData?.apartment_document?.length ?? 0) > 0 || (projectData?.tech_stack?.entries?.length ?? 0) >0) && (
  <section className="relative w-full bg-[var(--color-brand-cream)] dark:bg-[#0a0a0a] py-16 md:py-24 border-t border-gray-200 dark:border-zinc-900">
    <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* LEFT: Legal & Documents */}
        {(projectData?.apartment_document?.length ?? 0 ) > 0 && (
          <div className={`lg:col-span-${(projectData?.tech_stack?.entries?.length ?? 0) > 0 ? "7 lg:border-r lg:border-gray-200 dark:lg:border-zinc-800 lg:pr-20" : "12"}`}>
            
            {/* Advanced Header (Matching Neighborhood Connectivity) */}
            <div className="mb-10 md:mb-14">
              <span className="flex items-center gap-3 text-brand-orange text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-3">
                <span className="w-8 h-[2px] bg-brand-orange"></span>
                Official Resources
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black uppercase text-brand-black dark:text-white tracking-tighter leading-none">
                Legal & <br className="hidden lg:block" /> Documents
              </h2>
            </div>

            {/* Document Ledger List */}
            <div className="flex flex-col border-t border-gray-200 dark:border-zinc-800">
              { projectData.apartment_document?.map((document: any, i: any) => (
                <div
                  key={i}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-b border-gray-200 dark:border-zinc-800 transition-colors duration-300 hover:bg-gray-50/50 dark:hover:bg-zinc-900/30"
                >
                  {/* Left Hover Accent */}
                  <div className="absolute left-[-1rem] md:left-[-1.5rem] top-0 bottom-0 w-1 bg-brand-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Title & Icon */}
                  <div className="flex items-center gap-4">
                    <div className="text-gray-400 group-hover:text-brand-orange transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <p className="font-bold text-base md:text-lg text-brand-black dark:text-zinc-200 group-hover:text-brand-orange transition-colors duration-300">
                      {document.title}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => handleDocumentDownload(document.location)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-brand-black dark:text-white border border-gray-300 dark:border-zinc-700 rounded-md hover:border-brand-orange hover:text-brand-orange transition-colors duration-300"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      Open
                    </button>
                    
                    <button
                      onClick={() => handleDocumentDownload(document.location)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-widest bg-brand-orange text-white rounded-md hover:bg-brand-black dark:hover:bg-white dark:hover:text-black transition-colors duration-300"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        )}

        {(projectData?.tech_stack?.entries?.length ?? 0) > 0 && (
          <div className="lg:col-span-5">
            
            {/* Advanced Header (Matching Neighborhood Connectivity) */}
            <div className="mb-10 md:mb-14">
              <span className="flex items-center gap-3 text-brand-orange text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-3">
                <span className="w-8 h-[2px] bg-brand-orange"></span>
                The Visionaries
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black uppercase text-brand-black dark:text-white tracking-tighter leading-none">
                Project <br className="hidden lg:block" /> Team
              </h2>
            </div>

            {/* Architectural Ledger List */}
            <div className="flex flex-col">
              {projectData.tech_stack.entries.map((member: any, i: any) => (
                <div
                  key={i}
                  className="group flex justify-between items-baseline py-4 border-b border-gray-100 dark:border-zinc-800 last:border-none transition-all duration-300"
                >
                  {/* Role Label */}
                  <span className="text-xs md:text-sm font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest shrink-0">
                    {member.key}
                  </span>
                  
                  {/* Dotted Leader Line (Classic Blueprint aesthetic) */}
                {/* <div className="absolute inset-0 bg-[url('https://img.magnific.com/free-vector/gray-technology-elements-transparent-background_1035-7105.jpg')] opacity-5 dark:opacity-[0.03] pointer-events-none z-10 bg-no-repeat"></div> */}
                  
                  {/* Name */}
                  <span className="text-sm md:text-base font-black text-brand-black dark:text-white text-right group-hover:text-brand-orange transition-colors duration-300">
                    {member.value}
                  </span>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* {(projectData?.tech_stack?.entries?.length ?? 0) > 0 && (
           <div className="lg:col-span-5">

    <div className="mb-10 md:mb-14">
      <span className="flex items-center gap-3 text-brand-orange text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-3">
        <span className="w-8 h-[2px] bg-brand-orange"></span>
        The Visionaries
      </span>

      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black uppercase text-brand-black dark:text-white tracking-tighter leading-none">
        Project <br className="hidden lg:block" /> Team
      </h2>
    </div>

    <div className="flex flex-col">
      {entries.map((member: TechStackEntry, i: number) => (
        <div
          key={i}
          className="group flex justify-between items-baseline py-4 border-b border-gray-100 dark:border-zinc-800 last:border-none transition-all duration-300"
        >
          <span className="text-xs md:text-sm font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-widest shrink-0">
            {member.key}
          </span>

          <span className="text-sm md:text-base font-black text-brand-black dark:text-white text-right group-hover:text-brand-orange transition-colors duration-300">
            {member.value}
          </span>
        </div>
      ))}
    </div>

  </div>
        )} */}
        
      </div>
    </div>
  </section>
)}
      </div>
  )
      {/* SHADCN DIALOGS (Replacing Bootstrap Modals)*/}
      {/* ========================================= */}

      {/* Gallery Modal */}
      <Dialog open={modalVisible} onOpenChange={setModalVisible}>
        <DialogContent className="max-w-7xl w-[95vw] bg-transparent border-none shadow-none p-0">
          {/* If using Swiper inside modal, render it here. For simplicity based on state, showing the active selected image */}
          <div className="relative flex justify-center items-center w-full h-[85vh]">
            {/* <img src={modalImg} alt="Gallery Focus" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" /> */}
          </div>
        </DialogContent>
      </Dialog>

      {/* Floor Plan Modal */}
      <Dialog open={floorModalVisible} onOpenChange={setFloorModalVisible}>
        <DialogContent className="max-w-5xl w-[95vw] bg-white rounded-3xl p-8">
          <div className="flex justify-center items-center w-full h-[80vh]">
            {/* <img src={floorImg} alt="Floor Plan Focus" className="max-w-full max-h-full object-contain" /> */}
          </div>
        </DialogContent>
      </Dialog>
}

// "use client";

// import { useEffect, useRef, useState } from 'react';
// import Link from 'next/link';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
// import { useGSAP } from '@gsap/react';
// import Swiper from 'swiper';
// import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';

// import './project-detail.css';

// // Safely register plugins
// if (typeof window !== 'undefined') {
//   gsap.registerPlugin(ScrollTrigger);
// }

// // Helper to split paragraphs safely
// const splitParagraphIntoSentences = (paragraph: string): string[] => {
//   if (!paragraph) return [];
//   return paragraph.split(/[.?]/).filter((sentence) => sentence.trim() !== '');
// };

// export default function ProjectDetailClient({ projectData }: { projectData: any }) {
//   const containerRef = useRef<HTMLDivElement>(null);

//   const [locationData, setLocationData] = useState<any>(
//     projectData?.maps?.length > 0 ? projectData.maps[0] : null
//   );

//   const [location, setLocation] = useState<string>(
//     projectData?.maps?.length > 0 ? projectData.maps[0].type : 'School'
//   );

//   const [selectedTab, setSelectedTab] = useState<string>(() => {
//     if (projectData?.flat_view?.terrace_view_360) return 'terrace360';
//     if (projectData?.flat_view?.walk_through) return 'walkthrough';
//     if (projectData?.flat_view?.flat_view_360) return 'flat360';
//     return 'live';
//   });

//   const [tabSelected, setTabSelected] = useState<string>(() => {
//     if (projectData?.flat_details?.amenities?.bulleting?.[0]) return 'ammenties';
//     if (projectData?.flat_details?.specification?.bulleting) return 'flat360';
//     return 'live';
//   });
//   // --- STATE MANAGEMENT ---
//   // const [selectedTab, setSelectedTab] = useState<string>('terrace360');
//   // const [tabSelected, setTabSelected] = useState<string>('');
//   // const [location, setLocation] = useState<string>('School');
//   // const [locationData, setLocationData] = useState<any>(null);

//   // Modals & Timers
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [formSubmissionStatus, setFormSubmissionStatus] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [floorModalVisible, setFloorModalVisible] = useState(false);
//   const [modalImg, setModalImg] = useState('');
//   const [floorImg, setFloorImg] = useState('');

//   // Derived Data
//   const sentencesArray = splitParagraphIntoSentences(projectData?.description);
//   const techStackArray = splitParagraphIntoSentences(projectData?.tech_stack?.description);

//   // --- CHATBOT & INITIALIZATION LOGIC ---
//   useEffect(() => {

//     // 1. Initial State Setup
//     // if (projectData?.maps?.length > 0) {
//     //   setLocationData(projectData.maps[0]);
//     //   setLocation(projectData.maps[0].type);
//     // }

//     // if (projectData?.flat_view?.terrace_view_360) setSelectedTab('terrace360');
//     // else if (projectData?.flat_view?.walk_through) setSelectedTab('walkthrough');
//     // else if (projectData?.flat_view?.flat_view_360) setSelectedTab('flat360');
//     // else setSelectedTab('live');

//     // if (projectData?.flat_details?.amenities?.bulleting?.[0]) setTabSelected('ammenties');
//     // else if (projectData?.flat_details?.specification?.bulleting) setTabSelected('flat360');
//     // else setTabSelected('live');

//     // 2. Chatbot Injection
//     let dataBot = '24295193';
//     switch (projectData?.title) {
//       case 'Kumar Panache': dataBot = '22671592'; break;
//       case 'Kumar Parc Residences': dataBot = '23283425'; break;
//       case 'Kumar Prospera': dataBot = 'Kumar_Prospera'; break;
//     }

//     const script = document.createElement('script');
//     script.src = 'https://www.kenyt.ai/botapp/ChatbotUI/dist/js/bot-loader.js';
//     script.setAttribute('type', 'text/javascript');
//     script.setAttribute('data-bot', dataBot);
//     script.id = 'dynamic-kenyt-bot';
//     document.body.appendChild(script);

//     // Cleanup Bot on Unmount
//     return () => {
//       const activeScript = document.getElementById('dynamic-kenyt-bot');
//       if (activeScript) activeScript.remove();

//       const elementsToRemove = ['#chatbox-container', '#kenytChatBubble'];
//       elementsToRemove.forEach(selector => {
//         const el = document.querySelector(selector);
//         if (el) el.remove();
//       });
//     };
//   }, [projectData]);

//   // --- SCROLL & TIMEOUT FORM LOGIC ---
//   useEffect(() => {
//     let timeoutId: NodeJS.Timeout;

//     const resetTimer = () => {
//       clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => {
//         if (!isFormOpen && !formSubmissionStatus) {
//           // openCommonForm();
//         }
//       }, 40000);
//     };

//     const handleScroll = () => {
//       const scrollPosition = window.scrollY;
//       const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
//       const scrolledPercentage = (scrollPosition / totalHeight) * 100;

//       if (scrolledPercentage >= 90 && !isFormOpen && !formSubmissionStatus) {
//         // openCommonForm();
//       }
//     };

//     const handleVisibilityChange = () => {
//       if (document.visibilityState === 'visible') resetTimer();
//       else clearTimeout(timeoutId);
//     };

//     window.addEventListener('scroll', handleScroll);
//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     resetTimer();

//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       clearTimeout(timeoutId);
//     };
//   }, [isFormOpen, formSubmissionStatus]);

//   // --- GSAP ANIMATIONS ---
//   useGSAP(
//     () => {
//       // gsap.from('.carouselText h1', { y: '100%', opacity: 0, duration: 1.8, ease: 'power1.out' });
//       // gsap.from('.bannerText', { y: '100%', opacity: 0, duration: 2, ease: 'power1.out' });
//       // gsap.from('.titleSwiper', { x: '-100%', opacity: 0, duration: 1.8, ease: 'power1.out' });

//       // gsap.from('.InDetail', {
//       //   scrollTrigger: { trigger: '.ModernTechContainer', toggleActions: 'restart pause complete reset' },
//       //   start: 'top 70%', y: '150%', duration: 1.3, delay: 0.2, ease: 'power1.out',
//       // });

//       // gsap.from('.mahaReraTitle', {
//       //   scrollTrigger: { trigger: '.mahaReraDiv', toggleActions: 'restart pause complete reset' },
//       //   start: 'top 70%', y: '127%', duration: 1.2, delay: 0.5, ease: 'power1.out',
//       // });

//       // gsap.from('.mahaText', {
//       //   scrollTrigger: { trigger: '.mahaReraDiv', toggleActions: 'restart pause complete reset' },
//       //   start: 'top 70%', y: '110%', duration: 1.2, delay: 0.5, ease: 'power1.out',
//       // });

//       gsap.from(".details-wrapper", {
//         scrollTrigger: {
//           trigger: ".littleDetail",
//           toggleActions: "restart pause pause reset",
//           start: "0 80%",
//         },
//         y: "60%",
//         duration: 1,
//         ease: "power1.out",
//       });

//       // 1. Immediate Entrance Animations
//       gsap.from(".carouselText h1", {
//         y: "100%",
//         opacity: 0,
//         duration: 1.8,
//         ease: "power1.out",
//       });
//       gsap.from(".bannerText", {
//         y: "100%",
//         opacity: 0,
//         duration: 2,
//         ease: "power1.out",
//       });
//       gsap.from(".titleSwiper", {
//         x: "-100%",
//         opacity: 0,
//         duration: 1.8,
//         ease: "power1.out",
//       });

//       // 2. Scroll-based Animations
//       gsap.from(".DetailContainer h3", {
//         scrollTrigger: {
//           trigger: ".ModernTechContainer",
//           toggleActions: "restart pause complete reset",
//         },
//         start: "top top",
//         end: "+=200px",
//         y: "100%",
//         duration: 1.3,
//         ease: "power1.out",
//       });

//       gsap.from(".InDetail", {
//         scrollTrigger: {
//           trigger: ".ModernTechContainer",
//           toggleActions: "restart pause complete reset",
//         },
//         start: "top 70%",
//         end: "bottom",
//         delay: 0.2,
//         y: "150%",
//         duration: 1.3,
//         ease: "power1.out",
//       });

//       gsap.from(".topImg img, .mainImg img", {
//         scrollTrigger: {
//           trigger: ".ModernTechContainer",
//           toggleActions: "restart pause complete reset",
//         },
//         start: "top 70%",
//         end: "bottom top",
//         delay: 1.5,
//         y: "100%",
//         duration: 1.3,
//         ease: "power1.out",
//       });

//       gsap.from(".mahaReraTitle", {
//         scrollTrigger: {
//           trigger: ".mahaReraDiv",
//           toggleActions: "restart pause complete reset",
//         },
//         start: "top 70%",
//         end: "+=200px",
//         delay: 0.5,
//         y: "127%",
//         duration: 1.2,
//         ease: "power1.out",
//       });

//       gsap.from(".mahaText", {
//         scrollTrigger: {
//           trigger: ".mahaReraDiv",
//           toggleActions: "restart pause complete reset",
//         },
//         start: "top 70%",
//         y: "110%",
//         duration: 1.2,
//         delay: 0.5,
//         ease: "power1.out",
//       });

//       gsap.from(".mahaText", {
//         scrollTrigger: {
//           trigger: ".mahaReraDiv",
//           toggleActions: "restart pause complete reset",
//         },
//         start: "top 70%",
//         end: "+=200px",
//         delay: 0.5,
//         y: "110%",
//         duration: 1.2,
//         ease: "power1.out",
//       });

//       gsap.from(".qrDiv", {
//         scrollTrigger: {
//           trigger: ".mahaReraDiv",
//           toggleActions: "restart pause complete reset",
//         },
//         start: "top 80%",
//         end: "+=200px",
//         delay: 1.2,
//         opacity: 0,
//         duration: 1.2,
//         ease: "power1.out",
//       });

//       gsap.from(".swiper-container-Gallary", {
//         scrollTrigger: {
//           trigger: ".GallaryCarousel",
//           toggleActions: "restart pause complete reset",
//         },
//         start: "top top",
//         end: "+=200px",
//         x: "200%",
//         duration: 1.8,
//         ease: "power1.out",
//       });

//       // Final cleanup refresh
//       ScrollTrigger.refresh();

//       // setTimeout(() => {
//       //   ScrollTrigger.refresh();
//       // }, 500);
//     },
//     { scope: containerRef },
//   );

//   // --- SWIPER INITIALIZATION ---
//   useEffect(() => {
//     new Swiper(".titleSwiper", {
//       modules: [Pagination, Autoplay],
//       autoplay: true,
//       slidesPerView: 1,
//       spaceBetween: 30,
//       pagination: { el: ".swiper-pagination", dynamicBullets: true },
//     });

//     if (projectData?.gallery_medias?.length) {
//       new Swiper(".swiper-container-Gallary", {
//         modules: [Navigation, Pagination],
//         slidesPerView: 2.8,
//         spaceBetween: 3,
//         loop: true,
//         pagination: { el: ".swiper-pagination", dynamicBullets: true },
//         navigation: { nextEl: ".swiper-next", prevEl: ".swiper-prev" },
//         breakpoints: { 320: { slidesPerView: 1 }, 640: { slidesPerView: 2.8 } },
//       });
//     }
//   }, [projectData]);

//   // --- HELPER FUNCTIONS ---
//   const mapLocationSelect = (locType: string) => {
//     setLocation(locType);
//     const foundData = projectData?.maps?.find((m: any) => m.type === locType);
//     if (foundData) setLocationData(foundData);
//   };

//   const openCommonForm = () => {
//     setIsFormOpen(true);
//     console.log("Trigger your global Form Modal State here!");
//   };

//   const handleDocumentDownload = (url: string) => {
//     if (formSubmissionStatus) {
//       const a = document.createElement("a");
//       a.href = url;
//       a.target = "_blank";
//       a.download = "kumarcorp.pdf";
//       a.click();
//     } else {
//       openCommonForm();
//       localStorage.setItem("currentPdf", url);
//     }
//   };

//   // --- JSX RENDER ---
//   return (
//     <div ref={containerRef}>
//       <div className="margins" style={{ marginLeft: "9%" }}>
//         <div className="buttonDiv" style={{ marginTop: "3%" }}>
//           <Link href="/projects">
//             <img className="back" src="/assets/blogs/backBtn.png" alt="Back" />
//           </Link>
//         </div>
//       </div>

//       <div className="detail-page">
//         <div className="p-0">
//           {/* HERO SECTION */}
//           <div className="row d-flex topDiv position-relative">
//             <div className="col-lg-5 col-xl-5 carouselText">
//               <div className="title-wrapper overflow-hidden">
//                 <h1>{projectData?.title}</h1>
//               </div>
//               <div className="bannerText-wrapper">
//                 <span className="bannerText d-block">
//                   {projectData?.sub_title}
//                 </span>
//               </div>

//               <div className="flat-size">
//                 {projectData?.tags?.[0] && (
//                   <div className="project-tags twoBhk">
//                     <ul className="my-auto">
//                       <li onClick={openCommonForm}>{projectData.tags[0]}</li>
//                     </ul>
//                   </div>
//                 )}
//                 {projectData?.tags?.[1] &&
//                   projectData.tags[1] !== "Contact Us For Pricing" && (
//                     <div className="project-tags threeBhk">
//                       <ul className="my-auto">
//                         <li onClick={openCommonForm}>{projectData.tags[1]}</li>
//                       </ul>
//                     </div>
//                   )}
//                 {projectData?.tags?.[2] &&
//                   projectData.tags[2] !== "Contact Us For Pricing" && (
//                     <div className="project-tags threeBhk">
//                       <ul className="my-auto">
//                         <li onClick={openCommonForm}>{projectData.tags[2]}</li>
//                       </ul>
//                     </div>
//                   )}
//               </div>
//             </div>

//             <div
//               className="carousel col-lg-7 col-xl-7 d-flex overflow-hidden"
//               style={{ marginTop: "3%" }}
//             >
//               <div className="swiper titleSwiper">
//                 <div className="swiper-wrapper">
//                   {projectData?.title_image?.map(
//                     (bannerImage: string, i: number) => (
//                       <div key={i} className="swiper-slide titleImgsDiv">
//                         <img src={bannerImage} alt="Property Banner" />
//                       </div>
//                     ),
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* DESCRIPTION SECTION */}
//           <div className="littleDetail px-0">
//             <div className="details-wrapper">
//               <div className="container-fluid mt-5">
//                 <div className="detail-para justify-content-between">
//                   <div className="setText px-0 pe-lg-3">
//                     {sentencesArray.slice(0, 5).map((sentence, i) => (
//                       <span key={i}>{sentence}. </span>
//                     ))}
//                   </div>
//                   <div style={{ marginTop: "2%" }} className="setText px-0">
//                     {sentencesArray.slice(5).map((sentence, i) => (
//                       <span key={i}>{sentence}. </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RERA */}

//           {projectData?.city_name !== "Bengaluru" && (
//             <div className="mahaReraDiv mb-3">
//               <div className="animate-mahaTitle" style={{ overflow: "hidden" }}>
//                 <div className="mahaReraTitle d-flex">
//                   <img
//                     src="/assets/icons/mahaReraIcon2.png"
//                     alt="MahaRera Icon"
//                   />
//                   <span>Maha Rera</span>
//                 </div>
//               </div>

//               <div className="animate-mahaText" style={{ overflow: "hidden" }}>
//                 <div className="mahaText">
//                   <span>
//                     <strong>
//                       The project has been registered via MahaRERA registration
//                       number:
//                     </strong>
//                   </span>
//                   <br />
//                   <span>
//                     {projectData?.certification?.description} are available on
//                     the website{" "}
//                     <a
//                       className="mahaLink"
//                       href="https://maharera.maharashtra.gov.in"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       https://maharera.maharashtra.gov.in
//                     </a>{" "}
//                     under registered projects.
//                   </span>
//                 </div>
//               </div>

//               {projectData?.certification?.qr_images?.[0] && (
//                 <div
//                   className="row qrDiv"
//                   style={{ padding: "0", marginTop: "2%" }}
//                 >
//                   <div className="col-lg-2 col-md-2 col-sm-12 qrs">
//                     <div className="mb-3">
//                       <span>Member of</span>
//                       <img
//                         style={{ borderRadius: "10px" }}
//                         src="/assets/icons/Credai-Logo.png"
//                         alt="Credai-Logo"
//                       />
//                     </div>

//                     {(projectData?.title === "Kumar Park Infinia" ||
//                       projectData?.title === "Kumar Prospera" ||
//                       projectData?.title === "Princetown Royal" ||
//                       projectData?.title === "Hill View Residency" ||
//                       projectData?.title === "Kumar Primavera") && (
//                       <div>
//                         <span>IGBC Certified</span>
//                         <img
//                           style={{ borderRadius: "10px" }}
//                           src="/assets/icons/igbc.png"
//                           alt="IGBC"
//                         />
//                       </div>
//                     )}
//                   </div>

//                   {/* React Map loop replacing *ngFor */}
//                   {projectData?.certification?.qr_images.map(
//                     (qrImage: string, i: number) => (
//                       <div
//                         key={i}
//                         className="col-lg-2 col-md-2 col-sm-12 qrdiv qrs"
//                       >
//                         <img src={qrImage} alt="QR Code" />
//                       </div>
//                     ),
//                   )}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* RERA */}

//           {projectData?.city_name === "Bengaluru" && (
//             <div className="mahaReraDiv mb-3">
//               <div className="animate-mahaTitle" style={{ overflow: "hidden" }}>
//                 <div className="mahaReraTitle d-flex">
//                   <img
//                     src="/assets/icons/Karnatak RERA Logo_200 x 200.png"
//                     alt="Karnataka RERA"
//                   />
//                   <span>Karnataka Rera</span>
//                 </div>
//               </div>

//               <div className="animate-mahaText" style={{ overflow: "hidden" }}>
//                 <div className="mahaText">
//                   <span>
//                     <strong>
//                       The project has been registered via Karnataka RERA
//                       registration number:
//                     </strong>
//                   </span>
//                   <br />
//                   <span>
//                     {projectData?.certification?.description} are available on
//                     the website{" "}
//                     <a
//                       className="mahaLink"
//                       href="http://rera.karnataka.gov.in"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       rera.karnataka.gov.in
//                     </a>{" "}
//                     under registered projects.
//                   </span>
//                 </div>
//               </div>

//               {projectData?.certification?.qr_images?.[0] && (
//                 <div
//                   className="row qrDiv"
//                   style={{
//                     padding: "0 3%",
//                     marginTop: "5%",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <div className="col-lg-3 col-md-3 col-sm-12 qrs blend-1">
//                     <div className="d-flex mb-3">
//                       <span>Member of &nbsp; &nbsp;</span>
//                       <img src="/assets/icons/credai.png" alt="Credai" />
//                     </div>
//                     <div className="d-flex">
//                       <span>IGBC Certified</span>
//                       <img src="/assets/icons/igbc.png" alt="IGBC" />
//                     </div>
//                   </div>

//                   {projectData?.certification?.qr_images.map(
//                     (qrImage: string, i: number) => (
//                       <div
//                         key={i}
//                         className="col-lg-3 col-md-3 col-sm-12 qrdiv qrs"
//                       >
//                         <img src={qrImage} alt="QR Code" />
//                       </div>
//                     ),
//                   )}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Views Start*/}
//           {/* Calculate how many tabs are active to dynamically set the grid columns */}
//           {(() => {
//             const flatView = projectData?.flat_view || {};
//             const activeFeaturesCount = [
//               flatView.flat_view_360,
//               flatView.walk_through,
//               flatView.live_view,
//               flatView.terrace_view_360,
//             ].filter(Boolean).length;

//             const gridColumns =
//               activeFeaturesCount > 0
//                 ? `repeat(${activeFeaturesCount}, 1fr)`
//                 : "1fr";

//             if (activeFeaturesCount === 0) return null;

//             return (
//               <div className="mt-5">
//                 <div className="wk-content wrapper">
//                   <div className="tabs_wrap">
//                     <ul style={{ gridTemplateColumns: gridColumns }}>
//                       {flatView.terrace_view_360 &&
//                         projectData?.title === "Kumar Parc Residences" && (
//                           <li
//                             onClick={() => setSelectedTab("terrace360")}
//                             className={
//                               selectedTab === "terrace360" ? "active" : ""
//                             }
//                           >
//                             Terrace 360° View
//                           </li>
//                         )}

//                       {flatView.walk_through &&
//                         projectData?.title !== "Kumar Parc Residences" &&
//                         projectData?.title !== "Kumar Palmspring Towers" &&
//                         projectData?.title !== "Kumar Prithvi" &&
//                         projectData?.title !== "Kumar Siddhachal" &&
//                         projectData?.title !== "Kumar Peninsula" &&
//                         projectData?.title !== "Princetown Tower" &&
//                         projectData?.title !== "Princetown Towers" && (
//                           <li
//                             onClick={() => setSelectedTab("walkthrough")}
//                             className={
//                               selectedTab === "walkthrough" ? "active" : ""
//                             }
//                           >
//                             Walkthrough
//                           </li>
//                         )}

//                       {(flatView.walk_through &&
//                         projectData?.title !== "Kumar Prakruti" &&
//                         projectData?.title !== "Kumar Parc Residences" &&
//                         projectData?.title !== "Kumar Prospera" &&
//                         projectData?.title !== "Kumar Park Infinia" &&
//                         projectData?.title !== "Princetown Royal") ||
//                       projectData?.title === "Princetown Towers" ||
//                       (projectData?.title === "Kumar Palmspring Towers" &&
//                         projectData?.title === "Kumar Prithvi" &&
//                         projectData?.title === "Kumar Siddhachal") ? (
//                         <li
//                           onClick={() => setSelectedTab("walkthrough")}
//                           className={
//                             selectedTab === "walkthrough" ? "active" : ""
//                           }
//                         >
//                           Sample Flat
//                         </li>
//                       ) : null}

//                       {flatView.walk_through &&
//                         projectData?.title === "Kumar Parc Residences" && (
//                           <li
//                             onClick={() => setSelectedTab("walkthrough")}
//                             className={
//                               selectedTab === "walkthrough" ? "active" : ""
//                             }
//                           >
//                             Amenities 360° View
//                           </li>
//                         )}

//                       {flatView.flat_view_360 && (
//                         <li
//                           onClick={() => setSelectedTab("flat360")}
//                           className={selectedTab === "flat360" ? "active" : ""}
//                         >
//                           Flat 360° View
//                         </li>
//                       )}

//                       {flatView.live_view && (
//                         <li
//                           onClick={() => setSelectedTab("live")}
//                           className={selectedTab === "live" ? "active" : ""}
//                         >
//                           For Live View
//                         </li>
//                       )}
//                     </ul>

//                     {/* TAB CONTENTS */}
//                     <div className="container-xl px-0 mt-5">
//                       {selectedTab === "terrace360" &&
//                         projectData?.title === "Kumar Parc Residences" && (
//                           <div className="content">
//                             <div className="terrace360">
//                               <iframe
//                                 src={flatView.terrace_view_360}
//                                 width="100%"
//                                 height="650px"
//                                 className="cursor--pointer"
//                                 frameBorder="0"
//                               />
//                               <p>{projectData?.title} Terrace View</p>
//                             </div>
//                           </div>
//                         )}

//                       {selectedTab === "walkthrough" &&
//                         projectData?.title !== "Kumar Parc Residences" &&
//                         projectData?.title !== "Kumar Palmspring Towers" &&
//                         projectData?.title !== "Kumar Prithvi" &&
//                         projectData?.title !== "Kumar Siddhachal" &&
//                         projectData?.title !== "Princetown Tower" &&
//                         projectData?.title !== "Kumar Peninsula" && (
//                           <div className="content">
//                             <div className="walkthrough">
//                               <iframe
//                                 src={flatView.walk_through}
//                                 width="100%"
//                                 height="500px"
//                                 className="cursor--pointer"
//                                 frameBorder="0"
//                               />
//                               <p>{projectData?.title} Walkthrough</p>
//                             </div>
//                           </div>
//                         )}

//                       {selectedTab === "walkthrough" &&
//                         projectData?.title === "Kumar Parc Residences" && (
//                           <div className="content">
//                             <div className="walkthrough">
//                               <iframe
//                                 src={flatView.walk_through}
//                                 width="100%"
//                                 height="650px"
//                                 className="cursor--pointer"
//                                 frameBorder="0"
//                               />
//                               <p>{projectData?.title} Amenities 360° View</p>
//                             </div>
//                           </div>
//                         )}

//                       {selectedTab === "walkthrough" &&
//                         projectData?.title !== "Kumar Parc Residences" &&
//                         projectData?.title !== "Kumar Prithvi" &&
//                         projectData?.title === "Kumar Palmspring Towers" && (
//                           <div className="content">
//                             <div className="walkthrough">
//                               <iframe
//                                 src={flatView.walk_through}
//                                 width="100%"
//                                 height="500px"
//                                 className="cursor--pointer"
//                                 frameBorder="0"
//                               />
//                               <p>
//                                 {projectData?.title} 3 BHK Sample Flat Video
//                               </p>
//                             </div>
//                           </div>
//                         )}

//                       {((selectedTab === "walkthrough" &&
//                         projectData?.title !== "Kumar Parc Residences" &&
//                         projectData?.title !== "Kumar Palmspring Towers" &&
//                         projectData?.title !== "Kumar Prospera" &&
//                         projectData?.title !== "Kumar Park Infinia" &&
//                         projectData?.title !== "Princetown Royal" &&
//                         projectData?.title !== "Kumar Prakruti" &&
//                         projectData?.title !== "Princetown Towers") ||
//                         (projectData?.title === "Kumar Prithvi" &&
//                           projectData?.title === "Kumar Siddhachal")) && (
//                         <div className="content">
//                           <div className="walkthrough">
//                             <iframe
//                               src={flatView.walk_through}
//                               width="100%"
//                               height="500px"
//                               className="cursor--pointer"
//                               frameBorder="0"
//                             />
//                             <p>{projectData?.title} Sample Flat Video</p>
//                           </div>
//                         </div>
//                       )}

//                       {selectedTab === "flat360" && (
//                         <div className="content">
//                           <iframe
//                             id="360Tag"
//                             width="100%"
//                             height="500px"
//                             frameBorder="0"
//                             src={flatView.flat_view_360}
//                           />
//                         </div>
//                       )}

//                       {selectedTab === "live" && (
//                         <div className="content">
//                           <iframe
//                             width="100%"
//                             height="500px"
//                             frameBorder="0"
//                             src={flatView.live_view}
//                           />
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })()}
//           {/* Views End*/}

//           {/* Construction photoes */}
//           {/* Array of projects that should show the Construction Updates block */}
//           {[
//             "Kumar Parc Residences",
//             "Kumar Paradise",
//             "Kumar Prospera",
//             "Kumar Palmspring Towers",
//             "Princetown Royal",
//             "Princetown Tower",
//             "Kumar Siddhachal",
//             "Kumar Peninsula",
//             "Kumar Priyadarshan",
//             "Kumar Prakruti",
//             "Kumar Pinnacle",
//             "Kumar Panache",
//           ].includes(projectData?.title) && (
//             <div className="mahaReraDiv mb-3">
//               <div className="animate-mahaTitle" style={{ overflow: "hidden" }}>
//                 <div
//                   className="mahaReraTitle d-flex"
//                   style={{ marginBottom: "0%" }}
//                 >
//                   <span>Construction Updates</span>
//                 </div>
//               </div>

//               <div className="animate-mahaText" style={{ overflow: "hidden" }}>
//                 <div className="mahaText">
//                   {/* <span><strong>Construction Work Progress Status For </strong></span> <br/> */}
//                   {/* <span>{projectData?.title}   <Link className="mahaLink" href="/work-progress" rel="noopener noreferrer"> Click Here </Link>. </span>  */}

//                   <div>
//                     <div className="wk-content wrapper">
//                       <div className="tabs_wrap">
//                         <ul style={{ gridTemplateColumns: "1fr" }}>
//                           <Link
//                             href="/work-progress"
//                             className="mahaLink"
//                             rel="noopener noreferrer"
//                           >
//                             <li className="active" data-tabs="live">
//                               Click Here
//                             </li>
//                           </Link>
//                         </ul>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Construction photoes */}

//           {/* Flat details */}
//           {/* Calculate active tabs to determine grid columns */}
//           {(() => {
//             const hasAmenities =
//               !!projectData?.flat_details?.amenities?.bulleting?.[0];
//             const hasSpecs =
//               !!projectData?.flat_details?.specification?.bulleting?.[0];
//             const hasFloorPlan =
//               !!projectData?.flat_details?.isometric_view?.media?.[0];

//             if (!hasAmenities && !hasSpecs && !hasFloorPlan) return null;

//             const tabCount = [hasAmenities, hasSpecs, hasFloorPlan].filter(
//               Boolean,
//             ).length;
//             const tabGridCols =
//               tabCount > 0 ? `repeat(${tabCount}, 1fr)` : "1fr";

//             return (
//               <div className="px-0 mt-5 ammentiesPositonsContainer">
//                 <div className="wrapper">
//                   <div className="tabs_wrap Ammenties">
//                     <ul style={{ gridTemplateColumns: tabGridCols }}>
//                       {hasAmenities && (
//                         <li
//                           onClick={() => setTabSelected("ammenties")}
//                           className={
//                             tabSelected === "ammenties" ? "active" : ""
//                           }
//                           data-tabs="ammenties"
//                         >
//                           Amenities
//                         </li>
//                       )}
//                       {/* Note: Keeping your original state mapping of 'flat360' for Specifications */}
//                       {hasSpecs && (
//                         <li
//                           onClick={() => setTabSelected("flat360")}
//                           className={tabSelected === "flat360" ? "active" : ""}
//                           data-tabs="flat360"
//                         >
//                           Specifications
//                         </li>
//                       )}
//                       {/* Note: Keeping your original state mapping of 'live' for Floor Plan */}
//                       {hasFloorPlan && (
//                         <li
//                           onClick={() => setTabSelected("live")}
//                           className={tabSelected === "live" ? "active" : ""}
//                           data-tabs="live"
//                         >
//                           Floor Plan
//                         </li>
//                       )}
//                     </ul>

//                     <div className="mt-3">
//                       {/* AMENITIES TAB */}
//                       {tabSelected === "ammenties" && (
//                         <div className="content">
//                           <div
//                             className="row ammentiesAcordian"
//                             style={{ justifyContent: "center" }}
//                           >
//                             {/* Left Side: Swiper */}
//                             <div className="col-lg-6 col-md-6 col-sm-12">
//                               <div className="swiper amenities-swiper">
//                                 <div className="swiper-wrapper">
//                                   {projectData?.flat_details?.amenities?.images?.map(
//                                     (image: string, i: number) => (
//                                       <div key={i} className="swiper-slide">
//                                         <div className="accordion-main-img">
//                                           <img src={image} alt="Amenity" />
//                                         </div>
//                                       </div>
//                                     ),
//                                   )}
//                                 </div>
//                               </div>
//                               <div className="swipe-next">
//                                 <img
//                                   style={{ transform: "rotate(180deg)" }}
//                                   src="/assets/icons/navigationIcon.png"
//                                   alt="Next"
//                                 />
//                               </div>
//                               <div className="swipe-prev">
//                                 <img
//                                   src="/assets/icons/navigationIcon.png"
//                                   alt="Prev"
//                                 />
//                               </div>
//                             </div>

//                             {/* Right Side: Accordion */}
//                             <div className="amenities-ac col-lg-6 col-md-6 col-sm-12">
//                               <div
//                                 className="Accordian accordion"
//                                 id="accordionAmenities"
//                               >
//                                 <div
//                                   style={{
//                                     maxHeight: "80vh",
//                                     overflowY: "scroll",
//                                   }}
//                                 >
//                                   {projectData?.flat_details?.amenities?.bulleting?.map(
//                                     (amenity: any, i: number) => (
//                                       <div key={i} className="accordion-item">
//                                         <h2
//                                           className="accordion-header"
//                                           id={`headingAmenity${i}`}
//                                         >
//                                           <button
//                                             className="accordion-button amenities-button"
//                                             type="button"
//                                             data-bs-toggle="collapse"
//                                             data-bs-target={`#collapseAmenity${i}`}
//                                             aria-controls={`collapseAmenity${i}`}
//                                             aria-expanded={amenity.show}
//                                             onClick={() => {
//                                               /* Handle accordion toggle state if needed */
//                                             }}
//                                           >
//                                             {amenity.title}
//                                           </button>
//                                         </h2>
//                                         <div
//                                           id={`collapseAmenity${i}`}
//                                           className={`accordion-collapse collapse ${amenity.show ? "show" : ""}`}
//                                           aria-labelledby={`headingAmenity${i}`}
//                                           data-bs-parent="#accordionAmenities"
//                                         >
//                                           <div className="accordion-body">
//                                             {/* Mapped points dynamically instead of hardcoding 14 divs */}
//                                             {amenity.points?.map(
//                                               (
//                                                 point: string,
//                                                 pIndex: number,
//                                               ) =>
//                                                 point ? (
//                                                   <div
//                                                     key={pIndex}
//                                                     className="scrollable-content"
//                                                   >
//                                                     <p>{point}</p>
//                                                   </div>
//                                                 ) : null,
//                                             )}
//                                           </div>
//                                         </div>
//                                       </div>
//                                     ),
//                                   )}
//                                 </div>

//                                 {/* Conditional Footer Note */}
//                                 {[
//                                   "Kumar Parc Residences",
//                                   "Kumar Prakruti",
//                                   "Kumar Palmspring Towers",
//                                   "Kumar Panache",
//                                   "Kumar Plumeria",
//                                   "Princeville Bengaluru",
//                                   "Kumar Princetown",
//                                   "Kumar Prospera Bengaluru",
//                                 ].includes(projectData?.title) && (
//                                   <div
//                                     style={{
//                                       fontStyle: "italic",
//                                       textAlign: "right",
//                                     }}
//                                   >
//                                     * Marked Amenities will be provided in
//                                     Future Phase
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       {/* SPECIFICATIONS TAB */}
//                       {tabSelected === "flat360" && (
//                         <div className="content">
//                           <div
//                             className="row ammentiesAcordian"
//                             style={{ justifyContent: "center" }}
//                           >
//                             {projectData?.flat_details?.specification
//                               ?.top_image && (
//                               <div className="col-lg-6 col-md-6 col-sm-12">
//                                 <div className="AccordianImgs position-relative">
//                                   <div className="accordion-spec-img specImg">
//                                     <img
//                                       src={
//                                         projectData.flat_details.specification
//                                           .top_image
//                                       }
//                                       alt="Spec Top"
//                                     />
//                                   </div>
//                                   <div className="smallImg specImg2">
//                                     <img
//                                       src={
//                                         projectData.flat_details.specification
//                                           .bottom_image
//                                       }
//                                       alt="Spec Bottom"
//                                     />
//                                   </div>
//                                 </div>
//                               </div>
//                             )}

//                             <div className="amenities-ac col-lg-6 col-md-6 col-sm-12">
//                               <div
//                                 className="Accordian accordion"
//                                 id="accordionSpecs"
//                               >
//                                 <div
//                                   style={{
//                                     maxHeight: "80vh",
//                                     overflowY: "scroll",
//                                   }}
//                                 >
//                                   {projectData?.flat_details?.specification?.bulleting?.map(
//                                     (spec: any, i: number) => (
//                                       <div key={i} className="accordion-item">
//                                         <h2
//                                           className="accordion-header"
//                                           id={`headingSpec${i}`}
//                                         >
//                                           <button
//                                             className="accordion-button"
//                                             type="button"
//                                             data-bs-toggle="collapse"
//                                             data-bs-target={`#collapseSpec${i}`}
//                                             aria-controls={`collapseSpec${i}`}
//                                             aria-expanded={spec.show}
//                                           >
//                                             {spec.title}
//                                           </button>
//                                         </h2>
//                                         <div
//                                           id={`collapseSpec${i}`}
//                                           className={`accordion-collapse collapse ${spec.show ? "show" : ""}`}
//                                           aria-labelledby={`headingSpec${i}`}
//                                           data-bs-parent="#accordionSpecs"
//                                         >
//                                           <div className="accordion-body">
//                                             {spec.points?.map(
//                                               (
//                                                 point: string,
//                                                 pIndex: number,
//                                               ) =>
//                                                 point ? (
//                                                   <div
//                                                     key={pIndex}
//                                                     className="scrollable-content"
//                                                   >
//                                                     <p>{point}</p>
//                                                   </div>
//                                                 ) : null,
//                                             )}
//                                           </div>
//                                         </div>
//                                       </div>
//                                     ),
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       {/* FLOOR PLAN TAB */}
//                       {tabSelected === "live" && (
//                         <div className="content">
//                           <div
//                             className="swiper floorPlan"
//                             style={{ marginTop: "8%" }}
//                           >
//                             <div
//                               className="swiper-wrapper floorWrapper"
//                               style={{
//                                 justifyContent: !projectData?.flat_details
//                                   ?.isometric_view?.media?.[1]
//                                   ? "center"
//                                   : "initial",
//                               }}
//                             >
//                               {projectData?.flat_details?.isometric_view?.media?.map(
//                                 (floorPlan: string, i: number) => (
//                                   <div
//                                     key={i}
//                                     className="swiper-slide"
//                                     data-bs-toggle="modal"
//                                     data-bs-target="#floorOpen"
//                                   >
//                                     <div className="floorImg">
//                                       <img
//                                         src={floorPlan}
//                                         onClick={() => {
//                                           // Trigger your modal state logic here
//                                           setFloorImg(floorPlan);
//                                           setFloorModalVisible(true);
//                                         }}
//                                         alt="Floor Plan"
//                                         className="img-fluid"
//                                       />
//                                     </div>
//                                   </div>
//                                 ),
//                               )}
//                             </div>
//                           </div>

//                           <div className="swipe-next">
//                             <img
//                               style={{ transform: "rotate(180deg)" }}
//                               src="/assets/icons/navigationIcon.png"
//                               alt="Next"
//                             />
//                           </div>
//                           <div className="swipe-prev">
//                             <img
//                               src="/assets/icons/navigationIcon.png"
//                               alt="Prev"
//                             />
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })()}
//           {/* Flat details */}

//           {/* Gallery */}
//           {projectData?.gallery_medias?.length > 0 && (
//             <div className="container-fluid GallaryHall">
//               <h1 className="text-center">Gallery</h1>
//               <div className="carousel-wrapper">
//                 <div className="GallaryCarousel">
//                   <div className="swiper-block">
//                     <div
//                       className="container-fluid"
//                       style={{ position: "relative" }}
//                     >
//                       <div style={{ overflow: "hidden" }}>
//                         {/* Swiper */}
//                         <div className="swiper-container swiper-container-Gallary">
//                           <div
//                             className="swiper-wrapper"
//                             style={{
//                               justifyContent: !projectData.gallery_medias[1]
//                                 ? "center"
//                                 : "initial",
//                             }}
//                           >
//                             {projectData.gallery_medias.map(
//                               (media: string, i: number) => (
//                                 <div
//                                   key={i}
//                                   data-bs-toggle="modal"
//                                   data-bs-target="#imageOpen"
//                                   className="swiper-slide GallarySlide"
//                                 >
//                                   <img
//                                     onClick={() => {
//                                       setModalImg(media);
//                                       setModalVisible(true);
//                                     }}
//                                     src={media}
//                                     alt={`Gallery Media ${i + 1}`}
//                                   />
//                                 </div>
//                               ),
//                             )}
//                           </div>
//                         </div>
//                       </div>

//                       {/* Custom Navigation */}
//                       <div className="swiper-next">
//                         <img
//                           style={{ transform: "rotate(180deg)" }}
//                           src="/assets/icons/navigationIcon.png"
//                           alt="Next"
//                         />
//                       </div>
//                       <div className="swiper-prev">
//                         <img
//                           src="/assets/icons/navigationIcon.png"
//                           alt="Prev"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//           {/* Gallery */}

//           {/* Gallery Image Modal */}
//           {modalVisible && (
//             <div
//               className="modal fade"
//               id="imageOpen"
//               tabIndex={-1}
//               aria-labelledby="exampleModalLabel"
//               aria-hidden="true"
//               data-bs-backdrop="static"
//             >
//               <div className="modal-dialog modal-xl modal-dialog-centered">
//                 <div className="modal-content">
//                   <div className="d-flex justify-content-end close-video">
//                     <div
//                       className="gallery-close"
//                       data-bs-dismiss="modal"
//                       aria-label="Close"
//                       onClick={() => setModalVisible(false)}
//                     >
//                       <img src="/assets/icons/cross-icon.svg" alt="Close" />
//                     </div>
//                   </div>
//                   <div className="modal-body">
//                     <div className="modal-swiper-container">
//                       <div className="swiper-wrapper">
//                         {projectData?.gallery_medias?.map(
//                           (media: string, i: number) => (
//                             <div
//                               key={i}
//                               className="swiper-slide"
//                               style={{
//                                 display: "flex",
//                                 flexDirection: "column",
//                               }}
//                             >
//                               <img
//                                 className="modalImg"
//                                 src={media}
//                                 alt={`Gallery Image ${i + 1}`}
//                               />
//                             </div>
//                           ),
//                         )}
//                       </div>
//                       <div className="swiper-button-prev"></div>
//                       <div className="swiper-button-next"></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Floor Plan Modal */}
//           {floorModalVisible && (
//             <div
//               className="modal fade"
//               id="floorOpen"
//               tabIndex={-1}
//               aria-labelledby="exampleModalLabel"
//               aria-hidden="true"
//               data-bs-backdrop="static"
//             >
//               <div className="modal-dialog modal-xl modal-dialog-centered">
//                 <div className="modal-content">
//                   <div className="d-flex justify-content-end close-video">
//                     <div
//                       className="gallery-close"
//                       data-bs-dismiss="modal"
//                       aria-label="Close"
//                       onClick={() => setFloorModalVisible(false)}
//                     >
//                       <img src="/assets/icons/cross-icon.svg" alt="Close" />
//                     </div>
//                   </div>
//                   <div className="modal-body">
//                     <div className="floor-swiper-container">
//                       <div className="swiper-wrapper">
//                         {projectData?.flat_details?.isometric_view?.media?.map(
//                           (floorPlan: string, i: number) => (
//                             <div
//                               key={i}
//                               className="swiper-slide"
//                               style={{ margin: "auto" }}
//                             >
//                               <img
//                                 className="modalImg"
//                                 style={{ aspectRatio: "initial" }}
//                                 src={floorPlan}
//                                 alt={`Floor Plan ${i + 1}`}
//                               />
//                             </div>
//                           ),
//                         )}
//                       </div>
//                       <div className="swiper-button-prev"></div>
//                       <div className="swiper-button-next"></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Layout */}
//           {projectData?.layout && (
//             <div className="layout p-0">
//               <div className="container-fluid">
//                 <h1>Layout</h1>
//               </div>
//               <img src={projectData.layout} alt="Project Layout" />
//             </div>
//           )}
//           {/* Layout */}

//           {/* MAPS SECTION */}
//           {(projectData?.maps?.[0] || projectData?.location_in_map) && (
//             <div className="margins GoogleMaps" style={{ marginBottom: "4%" }}>
//               <h2 className="my-4 text-center text-bold">Map</h2>
//               <div className="row" style={{ justifyContent: "center" }}>
//                 <div className="col-lg-7 col-md-7 col-sm-12">
//                   <iframe
//                     width="100%"
//                     src={projectData.location_in_map}
//                     height="100%"
//                     style={{ border: 0, minHeight: "350px" }}
//                     allowFullScreen
//                     loading="lazy"
//                     referrerPolicy="no-referrer-when-downgrade"
//                   />
//                 </div>

//                 {projectData?.maps?.[0] && (
//                   <div
//                     className="col-lg-5 col-md-5 col-sm-12 mobMap"
//                     style={{ paddingLeft: "3%" }}
//                   >
//                     <div
//                       style={{
//                         backgroundColor: "#333333",
//                         paddingBottom: "10%",
//                       }}
//                     >
//                       <div className="iconsDiv">
//                         <div className="d-flex" style={{ width: "100%" }}>
//                           {projectData.maps.map((locType: any, i: number) => (
//                             <div key={i} style={{ width: "20%" }}>
//                               {locType.type === "School" && (
//                                 <div
//                                   className={`iconInnerDiv ${location === "School" ? "icon-selected" : ""}`}
//                                   onClick={() => mapLocationSelect("School")}
//                                 >
//                                   <img
//                                     className={
//                                       location === "School"
//                                         ? "d-block"
//                                         : "d-none"
//                                     }
//                                     src="/assets/icons/schoolSel.png"
//                                     alt="School Selected"
//                                   />
//                                   <img
//                                     className={
//                                       location !== "School"
//                                         ? "d-block"
//                                         : "d-none"
//                                     }
//                                     src="/assets/icons/school.png"
//                                     alt="School"
//                                   />
//                                 </div>
//                               )}
//                               {/* Add IT, Hospital, Malls, Others identically mapping your Angular logic */}
//                               {locType.type === "IT" && (
//                                 <div
//                                   className={`iconInnerDiv ${location === "IT" ? "icon-selected" : ""}`}
//                                   onClick={() => mapLocationSelect("IT")}
//                                 >
//                                   <img
//                                     className={
//                                       location === "IT" ? "d-block" : "d-none"
//                                     }
//                                     src="/assets/icons/itSel.png"
//                                     alt="IT Selected"
//                                   />
//                                   <img
//                                     className={
//                                       location !== "IT" ? "d-block" : "d-none"
//                                     }
//                                     src="/assets/icons/it.png"
//                                     alt="IT"
//                                   />
//                                 </div>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       <div className="place row mt-4 px-4 text-white font-bold">
//                         <div className="col-6">
//                           <span>{locationData?.title}</span>
//                         </div>
//                         <div className="col-6 text-end">
//                           <span>Distance</span>
//                         </div>
//                       </div>

//                       <div className="px-4 mt-2 text-white/80">
//                         {locationData?.locations?.map(
//                           (mapItem: any, i: number) => (
//                             <div key={i} className="placeInfo row my-2">
//                               <div className="col-8">
//                                 <span>{mapItem.location_name}</span>
//                               </div>
//                               <div className="col-4 text-center">
//                                 <span>{mapItem.distance}</span>
//                               </div>
//                             </div>
//                           ),
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* DOCUMENTS & CREDITS SECTION */}
//           <div
//             className="row"
//             style={{ justifyContent: "center", margin: "auto" }}
//           >
//             {projectData?.apartment_document?.length > 0 && (
//               <div className="Documents col-lg-7 col-md-7 col-sm-12">
//                 <div
//                   className={
//                     projectData?.tech_stack?.entries?.length
//                       ? "borderRight"
//                       : ""
//                   }
//                 >
//                   <h1 style={{ marginBottom: "5%" }}>Documents</h1>
//                   <div
//                     className="row documentsDiv"
//                     style={{ marginBottom: "5%", justifyContent: "center" }}
//                   >
//                     <div className="documents-div">
//                       {projectData.apartment_document.map(
//                         (document: any, i: number) => (
//                           <div key={i} className="Document-row">
//                             <div className="content-div">
//                               <p className="content">{document.title}</p>
//                             </div>
//                             <div className="mobileView">
//                               <div className="document-wrapper">
//                                 <button
//                                   onClick={() =>
//                                     handleDocumentDownload(document.location)
//                                   }
//                                   className="btn btn-outline open d-flex align-items-center gap-1"
//                                 >
//                                   Open{" "}
//                                   <img
//                                     src="/assets/detailProject/open.png"
//                                     alt=""
//                                   />
//                                 </button>
//                               </div>
//                               <div className="document-wrapper">
//                                 <button
//                                   onClick={() =>
//                                     handleDocumentDownload(document.location)
//                                   }
//                                   className="download btn btn-outline text-white d-flex gap-1"
//                                 >
//                                   Download{" "}
//                                   <img
//                                     src="/assets/detailProject/download.png"
//                                     alt=""
//                                   />
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         ),
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {projectData?.tech_stack?.entries?.length > 0 && (
//               <div className="Documents col-lg-5 col-md-5 col-sm-12">
//                 <h1 style={{ marginBottom: "5%" }}>Credits</h1>
//                 <div>
//                   <div className="Address overflow-hidden">
//                     {projectData.tech_stack.entries.map(
//                       (member: any, i: number) => (
//                         <ul key={i} style={{ listStyleType: "disc" }}>
//                           <li>
//                             <span>{member.key} &nbsp;</span>
//                             {member.value}
//                           </li>
//                         </ul>
//                       ),
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
