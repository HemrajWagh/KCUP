// app/components/home/HomeClient.tsx
"use client";

import { useEffect, useRef, useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Swal from 'sweetalert2';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react'; // <-- Add this
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import React from "react";
import { Clock, Maximize, Building2, Users, HardHat } from "lucide-react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";


import './home.css';
import { ApiService } from '@/app/services/api';
import { TestimonialsSection } from './TestimonialsSection';
import HeroGrowthSignature from './HeroSignature';

gsap.registerPlugin(ScrollTrigger);

// --- STATS DATA ---
const stats = [
  { id: 1, number: "60", suffix: "", title: "Years' Legacy" },
  { id: 2, number: "38", suffix: "M+", title: "Sq. Ft. Built" },
  { id: 3, number: "140", suffix: "+", title: "Projects Delivered" },
  { id: 4, number: "43000", suffix: "+", title: "Happy Customers" },
  { id: 5, number: "15", suffix: "+", title: "Ongoing Projects" },
];

// --- STAT NUMBER ANIMATION COMPONENT ---
function StatNumber({ end, suffix }: { end: number; suffix: string }) {
  // triggerOnce: false ensures it reloads on every scroll
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.1 });
  
  return (
    <div ref={ref} className="flex items-start justify-center">
      <span className="font-sans font-black text-4xl lg:text-5xl xl:text-6xl tracking-tighter text-primary leading-none">
        {inView ? <CountUp end={end} duration={2.5} separator="," /> : "0"}
      </span>
      {suffix && (
        <span className="font-sans font-bold text-xl lg:text-2xl xl:text-3xl text-primary mt-1 ml-1">
          {suffix}
        </span>
      )}
    </div>
  );
}



interface HomeClientProps {
  initialTrendingProjects?: any[];
  initialTestimonialVideos?: string[];
}

// export default function HomeClient() {
  export default function HomeClient({ initialTrendingProjects = [], 
  initialTestimonialVideos = [] }: HomeClientProps) {
  

  const router = useRouter();
  const mainSwiperRef = useRef<HTMLDivElement>(null);
  const propertySwiperRef = useRef<HTMLDivElement>(null);

  //  2. State mimicking Angular variables
  const [isLoaded, setIsLoaded] = useState(true);
   
  // const [testimonialVideos, setTestimonialVideos] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Blogslide, setBlogslide] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [projects, setProjects] = useState<any>({ apartments: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trendingProjects, setTrendingProjects] = useState<any[]>(initialTrendingProjects);
  // 1. Initialize client state directly with your server-fetched data
  // const [trendingProjects, setTrendingProjects] = useState<any[]>(initialTrendingProjects);
  const [testimonialVideos, setTestimonialVideos] = useState<string[]>(initialTestimonialVideos);

  // 2. Create isolated tracking refs for each Swiper instance
  const projectSwiperRef = useRef<HTMLDivElement | null>(null);
  const testimonialSwiperRef = useRef<HTMLDivElement | null>(null);
  

  // 1. Define static arrays FIRST so they can be used as initial state below
  const slides = [
    
    {
      image: '/assets/home/Television_1920-x-1080.jpg',
      title: 'CRAFTING HOMES',
      subtitle: 'SINCE 1966',
      text: 'From the time television, just had one channel.',
    },
    {
      image: '/assets/home/Gramaphone_1920-x-1080.jpg',
      title: 'CRAFTING HOMES',
      subtitle: 'SINCE 1966',
      text: 'From the time gramophones were the music app.',
    },
    {
      image: '/assets/home/Cycle_1920-x-1080.jpg',
      title: 'CRAFTING HOMES',
      subtitle: 'SINCE 1966',
      text: 'From the time bicycles ruled the streets.',
    },
    {
      image: '/assets/home/Banner_HZ_1.jpg',
      title: '60 years of ',
      subtitle: 'delivering',
      text: 'Tailored Real estate Solutions',
    },
    {
      image: '/assets/home/Banner_HZ_2.jpg',
      title: 'Luxury Living at   ',
      subtitle: 'its Finest',
      text: 'Explore Our High-End Properties',
    },
    {
      image: '/assets/home/Banner_HZ_3.jpg',
      title: 'Discover ',
      subtitle: 'Your Dream Community ',
      text: 'Explore Our High-End Properties',
    },
  ];
  
  const [activeSlide, setActiveSlide] = useState<any>(slides[0]); // <-- This now works perfectly!
  // Add this helper function below your hooks state definitions inside HomeClient
const handleSlideSelection = (index: number) => {
  setActiveSlide(slides[index]);
};

// Automatic transition lifecycle loop for the Hero Section
useEffect(() => {
  const interval = setInterval(() => {
    setActiveSlide((prevCurrent: any) => {
      const currentIndex = slides.findIndex(slide => slide.image === prevCurrent?.image);
      const nextIndex = (currentIndex + 1) % slides.length;
      return slides[nextIndex];
    });
  }, 6000); // 6 Seconds rotation visibility cadence

  return () => clearInterval(interval);
}, [slides]);

// Inside your useEffect block for swiper configurations, update to:
useEffect(() => {
  let propertySwiper: Swiper | null = null;

  // Keep only Property Swiper initialization safely here
  if (propertySwiperRef.current) {
    propertySwiper = new Swiper(propertySwiperRef.current, {
      modules: [Pagination, Navigation],
      speed: 2260,
      spaceBetween: 20,
      pagination: {
        el: ".swiper-pagination-prop",
        type: "fraction",
      },
      navigation: { nextEl: ".next-prop", prevEl: ".prev-prop" },
      breakpoints: { 767: { slidesPerView: 1 }, 280: { slidesPerView: 1 } },
    });
  }

  return () => {
    if (propertySwiper) propertySwiper.destroy(true, true);
  };
}, []);

//

  // 3. Form State (Replacing Angular FormGroup)
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Phone: '',
    Referral: 'KP_Corp',
    LandingPage: 'https://kumarcorp.kumarworld.com',
    Project: 'Common Enquiry'
  });


//   useEffect(() => {
//   if (trendingProjects) {
//     // 🔵 LOOK HERE: This prints directly to your browser's Developer Tools Console!
//     console.log("💎 Current Client State (trendingProjects):", trendingProjects);
//     console.log("📐 First item shape check:", trendingProjects[0]);
//   }
// }, [trendingProjects]);

useEffect(() => {
  if (initialTrendingProjects.length === 0) {
    ApiService.getTrendingProjects()
      .then((res: any) => {
        if (res) {
          // ✅ FIX: Extract the deep array before passing it into your frontend state engine
          const cleanArray = Array.isArray(res.apartments) ? res.apartments : (res.data?.apartments || []);
          setTrendingProjects(cleanArray);
        }
      })
      .catch((err) => console.error("Client API Fetch Err:", err));
  }
}, [initialTrendingProjects]);

  // 4. Initialize API Data
  useEffect(() => {
    // Keep only your asynchronous data fetching here
    // fetch('/api/trending-projects') 
    //   .then(res => res.json())
    //   .then(data => setProjects(data))
    //   .catch(err => console.error(err));

    // fetch('/api/blogs') 
    //   .then(res => res.json())
    //   .then(data => setBlogslide(data))
    //   .catch(err => console.error(err));

  }, []);

  // Initialize GSAP and Swiper (Replacing ngAfterViewInit)
  // Initialize Swipers
  useEffect(() => {
    let mainSwiper: Swiper | null = null;
    let propertySwiper: Swiper | null = null;

    // 1. Initialize Main Swiper Safely
    if (mainSwiperRef.current) {
      mainSwiper = new Swiper(mainSwiperRef.current, {
        modules: [Pagination, Autoplay],
        slidesPerView: 1,
        loop: true,
        speed: 3000,
        spaceBetween: 300,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
          reverseDirection: true,
        },
        pagination: { el: ".swiper-pagination-vertical", clickable: true },
        on: {
          slideChange: (swiper) => {
            // Update React state
            setActiveSlide(slides[swiper.realIndex]);
            // Fire GSAP animation safely
            const carouselText = document.querySelector(
              ".animate-carousel-text",
            );
            if (carouselText) {
              gsap
                .timeline()
                .fromTo(
                  carouselText,
                  { x: -1000, opacity: 0.2 },
                  {
                    x: 0,
                    opacity: 0.9,
                    duration: 3,
                    ease: "power1.easeInOutQuad",
                  },
                )
                .to(carouselText, { opacity: 0, duration: 3, delay: 1.8 });
            }
          },
        },
      });
    }

    // 2. Initialize Property Swiper Safely
    if (propertySwiperRef.current) {
      propertySwiper = new Swiper(propertySwiperRef.current, {
        modules: [Pagination, Navigation],
        speed: 2260,
        spaceBetween: 20,
        pagination: {
          el: ".swiper-pagination-prop",
          type: "fraction",
        },
        navigation: { nextEl: ".next-prop", prevEl: ".prev-prop" },
        breakpoints: { 767: { slidesPerView: 1 }, 280: { slidesPerView: 1 } },
      });
    }

    // CRITICAL: Cleanup function to prevent React 18 from breaking Swiper
    return () => {
      if (mainSwiper) mainSwiper.destroy(true, true);
      if (propertySwiper) propertySwiper.destroy(true, true);
    };
  }, []); // <-- Empty dependency array ensures this only runs on mount

  

  // ⚡ ENGINE 2: Initialize Testimonials Swiper Carousel
  useEffect(() => {
    if (testimonialSwiperRef.current && testimonialVideos.length > 0) {
      const testimonialsCarousel = new Swiper(testimonialSwiperRef.current, {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: testimonialVideos.length > 1,
        observer: true,
        observeParents: true,
        breakpoints: {
          992: { slidesPerView: 2 },
        }
      });
    }
  }, [testimonialVideos]);

  // 3. GSAP Animations (Safely wrapped for React 18 / Next.js)
  useGSAP(
    () => {
      // We register the plugin inside the hook to prevent SSR crashes
      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".centerImg",
          start: "-50% 90%",
          end: "bottom 100%",
          scrub: 0.5,
        },
      });

      gsap.to("#rotating-img", {
        rotation: 360,
        duration: 30,
        repeat: -1,
        ease: "linear",
        transformOrigin: "50% 50%",
      });

      gsap.from(".projectShowCaseCarousel .image1 img", {
        y: "100%",
        scrollTrigger: {
          trigger: ".projectShowCaseCarousel",
          start: "top bottom",
          end: "bottom 70%",
          snap: {
            snapTo: "labels",
            duration: { min: 0.2, max: 3 },
            delay: 0.2,
            ease: "power1.inOut",
          },
          scrub: 1,
          toggleClass: "hiddencarousel",
        },
      });

      gsap.from(".projectShowCaseCarousel .image2 img", {
        y: "150%",
        scrollTrigger: {
          trigger: ".projectShowCaseCarousel-wrapper",
          start: "top 40%",
          end: "top 40%",
          scrub: 1,
          toggleClass: "hiddencarousel",
        },
        duration: 3,
        delay: 4,
      });

      tl.from(".scale-image", {
        scale: 2, // React/GSAP syntax: no need for a function here
        duration: 2,
      });

      tl.fromTo(
        ".upword-Img-building",
        { y: 300, opacity: 0 },
        { y: 0, ease: "power1.easeInOutQuad", opacity: 1, duration: 2 },
      );

      gsap.fromTo(
        ".animate-downword-image",
        { y: 200, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: ".animate-downword-image",
            start: "-200% 60%",
            end: "-20% 80%",
            scrub: 0.6,
          },
        },
      );

      tl.from(".inner-text-animate", {
        y: "100%",
        opacity: 0,
        scrollTrigger: {
          trigger: ".inner-text-animate",
          start: "top bottom",
          end: "top 85%",
          scrub: 4,
        },
      });

      gsap.fromTo(
        ".quality-Assurance",
        { y: -300 },
        {
          y: 0,
          scrollTrigger: {
            trigger: ".quality-Assurance",
            start: "top bottom",
            end: "center 25%",
            scrub: 4,
          },
        },
      );

      gsap.fromTo(
        ".Premium",
        { y: "10%" },
        {
          y: 0,
          scrollTrigger: {
            trigger: ".Premium",
            start: "50% 80%",
            end: "90% 90%",
            scrub: 5,
          },
        },
      );

      gsap.from(".animate-input", {
        y: "80%",
        scrollTrigger: {
          trigger: ".animate-input",
          start: "top 80%",
          end: "bottom 90%",
          scrub: 3,
        },
      });

      gsap.from(".contact-us-animate", {
        y: "80%",
        scrollTrigger: {
          trigger: ".contact-us-animate",
          start: "top 80%",
          end: "bottom 90%",
          scrub: 3,
        },
      });

      gsap.from(".lets-simplify-animate", {
        y: "50%",
        scrollTrigger: {
          trigger: ".lets-simplify-animate",
          start: "top 90%",
          end: "bottom 40%",
          scrub: 3,
        },
      });

      gsap.from(".projects-animate", {
        x: "100%",
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: ".projects-animate",
          start: "top 80%",
          end: "top 20%",
          scrub: 1.5,
        },
      });

      gsap.from(".animate-customers-view-all", {
        x: "-30%",
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: ".animate-customers-view-all",
          start: "top 90%",
          end: "bottom 60%",
          scrub: 5,
        },
      });

      gsap.from(".animate-Blogs-view-all ", {
        x: "-30%",
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: ".animate-Blogs-view-all ",
          start: "top 90%",
          end: "bottom 60%",
          scrub: 5,
        },
      });

      gsap.from(".swiper-container-Blog ", {
        x: "80%",
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: ".swiper-container-Blog ",
          start: "top 90%",
          end: "bottom 60%",
          scrub: 5,
        },
      });

      gsap.from(".desktop-animate-blogs-headding", {
        y: "80%",
        scrollTrigger: {
          trigger: ".desktop-animate-blogs-headding",
          start: "top 100%",
          end: "bottom 70%",
          scrub: 1,
        },
      });

      gsap.from(".desktop-animate-lets-connect", {
        y: "80%",
        scrollTrigger: {
          trigger: ".desktop-animate-lets-connect",
          start: "-20% 100%",
          end: "-30% 70%",
          scrub: 1,
        },
      });

      gsap.from(".letsconnect-arrow ", {
        x: "-50%",
        opacity: 0,
        duration: 1,
        zIndex: 1,
        scrollTrigger: {
          trigger: ".letsconnect-arrow ",
          start: "top 90%",
          end: "bottom 60%",
          scrub: 5,
        },
      });

      // We keep the setTimeout for the final animations because they likely depend
      // on the Swiper galleries finishing their DOM injection
      const timer = setTimeout(() => {
        gsap.from(".animate-words-from-customers-carousel ", {
          x: "80%",
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: ".animate-words-from-customers-carousel ",
            start: "top 90%",
            end: "bottom 60%",
            scrub: 5,
          },
        });

        gsap.from(".animate-words-from-customers", {
          y: "70%",
          scrollTrigger: {
            trigger: ".animate-words-from-customers",
            start: "top 90%",
            end: "bottom 50%",
            scrub: 2,
          },
        });

        gsap.from(".image-animate", {
          x: "-100%",
          opacity: 0,
          duration: 2,
          scrollTrigger: {
            trigger: ".image-animate",
            start: "top 80%",
            end: "top 20%",
            scrub: 1.6,
          },
        });

        gsap.from(".from-top-animate", {
          y: "-100%",
          opacity: 0,
          duration: 2,
          scrollTrigger: {
            trigger: ".image-animate",
            start: "top 80%",
            end: "top 20%",
            scrub: 1.6,
          },
        });

        gsap.from(".propertyDetail", {
          x: "-100%",
          opacity: 0,
          duration: 5,
          scrollTrigger: {
            trigger: ".image-animate",
            start: "top 80%",
            end: "top 20%",
            scrub: 1.6,
          },
        });

        // Force GSAP to recalculate positions after everything loads
        ScrollTrigger.refresh();
      }, 700);

      // Clean up the timer if the component unmounts early
      return () => clearTimeout(timer);
    },
    { dependencies: [isLoaded], revertOnUpdate: true },
  );
  

  // Handle Form Submission (Replacing connect())
  const handleConnect = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.Name || !formData.Email || !formData.Phone) {
      Swal.fire({
        title: "Error!",
        text: "Please fill all the details!",
        icon: "error",
        confirmButtonColor: "#f27f0c",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API Call - Replace with your actual endpoints
      // await apiService.submitEnquiryForm(formData);
      // await apiService.postQlead(new URLSearchParams(formData as any).toString());

      Swal.fire({
        title: "Success!",
        text: "Thank you for sharing your contact details. Our representative will get back to you shortly!",
        icon: "success",
        confirmButtonColor: "#f27f0c",
        confirmButtonText: "Projects",
      }).then((result) => {
        if (result.isConfirmed) router.push("/projects");
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Server is not responding!",
        icon: "error",
        confirmButtonColor: "#f27f0c",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* SECTION FIRST  */}
      {/* SECTION FIRST - HERO SLIDER */}

      {/* SECTION FIRST - LIQUID GLASS HERO */}
      {/* SECTION FIRST - ADVANCED FLOATING GLASS SLIDER */}
      {/* <section className="relative min-h-[90vh] w-full overflow-hidden bg-brand-black">
 SECTION FIRST - ADVANCED FLOATING GLASS SLIDER */}
    
    {/* SECTION FIRST - ADVANCED FLOATING GLASS SLIDER */}
      {/* SECTION FIRST - ADVANCED FLOATING GLASS SLIDER */}
      {/* CHANGED: Added flex flex-col md:block to handle mobile stacking flawlessly */}
      {/* SECTION FIRST - ADVANCED FLOATING GLASS SLIDER */}
      {/* FIX APPLIED: Added pt-20 sm:pt-24 md:pt-0 to push the mobile image below your fixed navbar */}

      {/* SECTION FIRST - ADVANCED FLOATING GLASS SLIDER */}
      <section className="relative h-[100dvh] w-full flex flex-col md:block overflow-hidden bg-brand-black pt-20 sm:pt-24 md:pt-0">
        
        {/* 1. Crystal Clear Full-Bleed Images */}
        <div className="relative md:absolute top-0 left-0 w-full aspect-video md:aspect-auto md:h-full md:inset-0 z-0 bg-brand-black shrink-0">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.img
              key={activeSlide?.image}
              src={activeSlide?.image}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </AnimatePresence>

          {/* Restored Original Horizontal Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black/80 via-brand-black/40 to-transparent w-full lg:w-2/3 pointer-events-none" />
          
          {/* Added Mobile Vertical Gradient (Blends the bottom edge of the landscape image smoothly) */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent block md:hidden pointer-events-none" />
        </div>

        {/* SPACER: This forces the card to the absolute bottom of the screen on mobile */}
        <div className="flex-grow block md:hidden pointer-events-none" />

        {/* 2. Floating Frosted Glass Content Panel */}
        {/* Changed mobile alignment to justify-end (bottom) with pb-24 to leave room for the slider dots */}
        <div className="relative md:absolute z-10 w-full md:inset-0 flex flex-col justify-end md:justify-center md:items-center pt-0 md:pt-24 lg:pt-32 pb-20 md:pb-0">
          <div className="container mx-auto px-4 md:px-6 lg:px-16 w-full h-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide?.title + activeSlide?.subtitle}
                initial={{ opacity: 0, x: -40, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full h-auto md:max-w-md lg:max-w-lg min-h-[300px] flex flex-col justify-center relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-8 sm:p-8 md:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-2xl"
              >
                {/* Glass Top-Edge Highlight */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

                {/* HEADING */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-cream uppercase leading-snug tracking-tight drop-shadow-md text-balance break-words">
                  {activeSlide?.title}
                  <span className="block text-brand-orange mt-1 drop-shadow-lg">
                    {activeSlide?.subtitle}
                  </span>
                </h1>

                <p className="mt-4 sm:mt-5 text-sm sm:text-base text-brand-cream/90 font-normal tracking-wide text-pretty">
                  {activeSlide?.text}
                </p>

                <div className="mt-6 sm:mt-8">
                  <Link href="/projects" className="inline-block group">
                    <button className="flex items-center gap-3 bg-brand-orange px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-brand-cream uppercase tracking-wider rounded-full transition-all duration-300 hover:bg-white hover:text-brand-black hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-95">
                      Know More
                      <img
                        src="/assets/common/Vector.png"
                        alt="Arrow indicator"
                        className="w-4 h-auto brightness-0 invert transition-transform duration-300 group-hover:invert-0 group-hover:translate-x-1.5"
                      />
                    </button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* 3. Advanced Glass Slider Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:bottom-12 md:right-16 z-20 flex gap-3">
          {slides.map((slide, index) => {
            const isCurrent =
              slides.findIndex((s) => s.image === activeSlide?.image) === index;

            return (
              <button
                key={index}
                onClick={() => handleSlideSelection(index)}
                className="relative h-1.5 w-16 sm:w-24 overflow-hidden rounded-full bg-white/20 backdrop-blur-md cursor-pointer transition-all hover:bg-white/40"
                aria-label={`Go to slide ${index + 1}`}
              >
                {isCurrent && (
                  <motion.div
                    key={activeSlide?.image}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 6, ease: "linear" }}
                    className="absolute top-0 left-0 h-full bg-brand-orange shadow-[0_0_10px_rgba(245,130,32,0.8)]"
                  />
                )}
              </button>
            );
          })}
        </div>
        <HeroGrowthSignature />
      </section>

      {/* <section className="relative h-[100dvh] w-full flex flex-col md:block overflow-hidden bg-brand-black pt-20 sm:pt-24 md:pt-0">
        
      

        <AnimatePresence mode="popLayout" initial={false}>
  <motion.img
    key={`mobile-${activeSlide?.image}`}
    src={activeSlide?.mobileImage} // <-- Your vertical image (e.g., 1080x1920)
    initial={{ opacity: 0, scale: 1.05 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1.2, ease: "easeInOut" }}
    className="block md:hidden absolute inset-0 w-full h-full object-cover object-center"
  />

  <motion.img
    key={`desktop-${activeSlide?.image}`}
    src={activeSlide?.image} // <-- Your landscape image (e.g., 1920x1080)
    initial={{ opacity: 0, scale: 1.05 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1.2, ease: "easeInOut" }}
    className="hidden md:block absolute inset-0 w-full h-full object-cover object-center"
  />
</AnimatePresence>

        <div className="relative md:absolute z-10 -mt-10 md:mt-0 flex-1 md:inset-0 flex md:items-center pt-0 md:pt-24 lg:pt-32">
          <div className="container mx-auto px-0 md:px-6 lg:px-16 w-full h-full md:h-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide?.title + activeSlide?.subtitle}
                initial={{ opacity: 0, x: -40, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full h-full md:h-auto md:max-w-md lg:max-w-lg min-h-[300px] flex flex-col justify-center relative overflow-hidden rounded-t-[2.5rem] md:rounded-[2rem] border-t md:border border-white/20 bg-white/10 p-8 sm:p-8 md:p-10 shadow-[0_-8px_32px_0_rgba(0,0,0,0.25)] md:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-2xl"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-cream uppercase leading-snug tracking-tight drop-shadow-md text-balance break-words">
                  {activeSlide?.title}
                  <span className="block text-brand-orange mt-1 drop-shadow-lg">
                    {activeSlide?.subtitle}
                  </span>
                </h1>

                <p className="mt-4 sm:mt-5 text-sm sm:text-base text-brand-cream/90 font-normal tracking-wide text-pretty">
                  {activeSlide?.text}
                </p>

                <div className="mt-6 sm:mt-8">
                  <Link href="/projects" className="inline-block group">
                    <button className="flex items-center gap-3 bg-brand-orange px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-brand-cream uppercase tracking-wider rounded-full transition-all duration-300 hover:bg-white hover:text-brand-black hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-95">
                      Know More
                      <img
                        src="/assets/common/Vector.png"
                        alt="Arrow indicator"
                        className="w-4 h-auto brightness-0 invert transition-transform duration-300 group-hover:invert-0 group-hover:translate-x-1.5"
                      />
                    </button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:bottom-12 md:right-16 z-20 flex gap-3">
          {slides.map((slide, index) => {
            const isCurrent =
              slides.findIndex((s) => s.image === activeSlide?.image) === index;

            return (
              <button
                key={index}
                onClick={() => handleSlideSelection(index)}
                className="relative h-1.5 w-16 sm:w-24 overflow-hidden rounded-full bg-white/20 backdrop-blur-md cursor-pointer transition-all hover:bg-white/40"
                aria-label={`Go to slide ${index + 1}`}
              >
                {isCurrent && (
                  <motion.div
                    key={activeSlide?.image}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 6, ease: "linear" }}
                    className="absolute top-0 left-0 h-full bg-brand-orange shadow-[0_0_10px_rgba(245,130,32,0.8)]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </section> */}

      {/* <div className="container-fluid section-first position-relative">
        <div className="row d-flex TopCarousel">
          <div className="col-lg-5 col-md-5 col-sm-12 carouselText">
            <div style={{ overflow: "hidden" }}>
              <div className="animate-carousel-text">
                <h1 className="h1">
                  {activeSlide?.title}
                  <span>{activeSlide?.subtitle}</span>
                </h1>
                <span className="bannerText">{activeSlide?.text}</span>
                <Link href="/projects" className="knowmore">
                  <button className="btn KnowMoreBtn">
                    Know More <img src="/assets/common/Vector.png" alt="" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="carousel col-lg-7 col-md-7 col-sm-12 d-flex">
            <div className="swiper" ref={mainSwiperRef}>
              <div className="swiper-wrapper">
                {slides.map((slide, i) => (
                  <div key={i} className={`swiper-slide slide-${i}`}>
                    <div className="image-container">
                      <img
                        src={slide.image}
                        alt=""
                        className="img-fluid"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="swiper-custom-bullets">
          <div className="swiper-pagination swiper-pagination-bullets swiper-pagination-vertical"></div>
        </div>
      </div> */}

      {/* SECTION SECOND */}
      {/* <div
        className="container-fluid projectShowCaseCarousel-wrapper"
        style={{ overflow: "hidden" }}
      >
        <div className="row projectShowCaseCarousel">
          <div className="image2 col-lg-4 col-sm-12">
            <img src="/assets/home/image1.png" alt="" />
          </div>
          {isLoaded && (
            <div className="col-lg-8 imgText">
              <div className="image1 col-lg-4 col-sm-12 col-xs-12">
                <img src="/assets/home/image2.png" alt="" />
              </div>
              <div className="textPart col-lg-6 col-sm-6 col-xs-12">
                <table className="table">
                  <tbody>
                    <tr>
                      <td>
                        140+ Projects Completed{" "}
                        <img
                          src="/assets/home/projectsCompletedIcon.png"
                          alt=""
                          width="32px"
                          className="ms-3"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          src="/assets/home/OnGoingProjectsIcon.png"
                          alt=""
                          width="38px"
                          className="me-3"
                        />{" "}
                        15+ ongoing projects
                      </td>
                    </tr>
                    <tr>
                      <td>
                        42k+ Happy Customers{" "}
                        <img
                          src="/assets/home/HappyFamlyIcon.png"
                          alt=""
                          width="38px"
                          className="ms-3"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: 0 }}>
                        <img
                          src="/assets/home/constructionIcon.png"
                          alt=""
                          width="9%"
                          className="me-1"
                        />{" "}
                        36+ Million Sq. Ft constructed
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div> */}

      {/* SECTION THIRD (World of Kumar) */}



{/* export default function GenerationsOfStewardship() { */}
  {/* return ( */}
    {/* // min-h-screen and h-[100dvh] force it to be exactly one fold */}
    <section className="relative w-full overflow-hidden">
      
      <div className="w-full relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] ">
        
        {/* The Text Block */}
        <div className="w-full bg-white/90 backdrop-blur-xl border-t border-white/60 px-4 md:px-8 py-5 lg:py-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-12 items-center">
            
            <div className="flex-1 md:border-l-[4px] md:border-primary md:pl-6">
              <p className="text-sm md:text-base lg:text-lg font-medium leading-snug text-brand-black/90">
                <span className="special-text text-xl md:text-2xl text-primary mr-2">
                  Established in <span className="font-sans font-bold italic not-italic">1966</span>
                </span> 
                by visionary Mr. K. H. Oswal, Kumar Corp has spent six decades shaping the urban landscape, ensuring our builds remain relevant and reassuring for generations.
              </p>
            </div>

            <div className="flex-1">
              <p className="text-xs md:text-sm lg:text-base font-normal leading-snug text-brand-black/70">
                Today, led by the second generation and a team of experienced professionals, we continue to uphold our founding values while steering with a steady eye on the future.
              </p>
            </div>
            
          </div>
        </div>

        {/* The Grand Stats Ribbon */}
        <div className="w-full bg-brand-black py-6 md:py-8 relative">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80"></div>
          
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-0">
              
              {stats.map((stat, index) => {
                const numericValue = parseInt(stat.number);
                return (
                  <div 
                    key={stat.id} 
                    className={`
                      flex flex-col items-center text-center px-2
                      ${index !== stats.length - 1 ? 'lg:border-r border-white/10' : ''}
                      ${index % 2 !== 0 ? 'border-l border-white/10 lg:border-l-0' : ''}
                    `}
                  >
                    <StatNumber end={numericValue} suffix={stat.suffix} />
                    <h3 className="special-text mt-1 md:mt-2 text-brand-cream/80 text-xs md:text-sm lg:text-base tracking-wide uppercase">
                      {stat.title}
                    </h3>
                  </div>
                );
              })}
              
            </div>
          </div>
        </div>

      </div>
      {/* ========================================== */}
      {/* 1. THE ARTWORK (Restored EXACTLY to your original state) */}
      {/* ========================================== */}
      {/* No flex wrappers here. Just your original container so your CSS works perfectly. */}
      <div className="container-fluid animate-all-images pt-4 desktop-world">
        <div className="row allImages">
          <div className="textWorld"></div>
          
          <div className="positionedImage">
            <div className="upword-Img-building">
              <img src="/assets/home/upword-Img-building.png" alt="" />
              <h1 className="quality-Assurance font-sans font-black text-4xl md:text-5xl lg:text-7xl tracking-tighter text-brand-black uppercase drop-shadow-sm">
                GENERATIONS OF
              </h1>
            </div>
            
            <div className="centerImg z-10 relative">
              <h1 className="Premium font-sans font-black text-5xl md:text-7xl lg:text-8xl xl:text-9xl tracking-tighter text-primary uppercase drop-shadow-md">
                STEWARDSHIP
              </h1>
              <img
                src="/assets/home/Stats_653-x-569.png"
                alt=""
                className="scale-image relative z-0"
              />
            </div>
            
            <div className="downwordImage">
              <img
                src="/assets/home/downwordImage.png"
                alt=""
                className="animate-downword-image"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 2 & 3. THE UNIFIED BOTTOM DOCK */}
      {/* ========================================== */}
      {/* 
        This is placed immediately after your images in the normal document flow. 
        If your custom CSS absolute-positions the images, this dock might overlap them. 
        If it overlaps, increase the "mt-32" below until it clears the images. 
      */}
      

    </section>

    
     {/* <div className="container-fluid animate-all-images pt-4 desktop-world">
  <div className="row allImages">
    <div className="textWorld ">
    </div>
    
    <div className="positionedImage">
      <div className="upword-Img-building">
        <img src="/assets/home/upword-Img-building.png" alt="" />
        <h1 className="quality-Assurance font-sans font-black text-4xl md:text-5xl lg:text-7xl tracking-tighter text-brand-black uppercase drop-shadow-sm">
          GENERATIONS OF
        </h1>
      </div>
      
      <div className="centerImg">
        <h1 className="Premium font-sans font-black text-5xl md:text-7xl lg:text-9xl tracking-tighter text-primary uppercase drop-shadow-md">
          STEWARDSHIP
        </h1>
        <img
          src="/assets/home/Stats_653-x-569.png"
          alt=""
          className="scale-image"
        />
      </div>
      
      <div className="downwordImage">
        <img
          src="/assets/home/downwordImage.png"
          alt=""
          className="animate-downword-image"
        />
      </div>
    </div>
    <br />
    
    <div className="worldKumarPara ">
      <div className="innerText relative sm:-mt-20 sm:mx-6 md:mt-0 md:mx-0 md:absolute md:inset-x-12 md:bottom-12 lg:bottom-16 lg:left-16 lg:right-16 flex flex-col lg:flex-row justify-between items-end gap-6 lg:gap-8 pb-4 md:pb-0">
        
        <div className="inner-text-animate max-w-3xl border-l-4 border-primary pl-5 py-2 md:pl-8 md:py-3 bg-white/30 backdrop-blur-[2px] rounded-r-lg">
          <p className="text-base md:text-lg lg:text-xl font-medium leading-relaxed text-brand-black mb-3">
            <span className="special-text text-xl md:text-2xl lg:text-3xl text-primary mr-2">
              Established in 1966
            </span> 
            by the visionary entrepreneur Mr. K. H. Oswal, Kumar Corp has spent close to six decades shaping the urban landscape. Each development has been approached with a long-term view, ensuring that what is built today remains relevant, resilient, and reassuring for the generations that follow.
          </p>
          <p className="text-sm md:text-base font-normal leading-relaxed text-brand-black/80">
            Today, the organisation is led by the second generation of the founding family, supported by a team of experienced professionals. Together, they continue to uphold the values on which the company was built, while steering it with a steady eye on the future.
          </p>
        </div>

      </div>
    </div>
  </div>
</div> */}

      {/* FOURTH SECTION (Projects) */}
  {/* <div className="container-fluid FourthSection mb-5 d-flex flex-column">
  <div className="view-all projects-animate d-flex text-white mt-5 align-items-center cursor--pointer">
    <hr style={{ width: '20vw' }} /> &nbsp;&nbsp;
    <Link href="/properties" style={{ opacity: 0.6, color: '#dedede' }}>
      View All &nbsp;
    </Link>
    <img 
      src="/assets/common/blogs-left-arrow.svg" 
      alt="Left Arrow" 
      className="right-arrow" 
    />
  </div>

  <div>
    {!trendingProjects || trendingProjects.length === 0 ? (
      <div className="w-100 text-center text-muted py-5 my-4">
        <div className="spinner-border text-warning mb-3" role="status"></div>
        <p className="font-sans">Loading trending real estate opportunities...</p>
      </div>
    ) : (
      <div className="swiper properties" ref={propertySwiperRef}>
        <div className="swiper-wrapper">
          {trendingProjects.map((project: any, i: number) => (
            <div key={project.id || i} className="swiper-slide">
              <div className="ImgCenter">
                
                <div className="propertyDetail">
                  <div className="propertyDetail-wrapper">
                    <div>
                      <span className="name">{project.title}</span>
                    </div>
                    <div>
                      <span className="location">
                        {project.tags?.[0] !== "Commercial" 
                          ? project.sub_title 
                          : project.tags?.[0]}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'inline-block', position: 'relative' }} className="image-animate hoverableImg">
                  <Link href={`/properties/${project.slug}`} className="explore cursor--pointer">
                    Explore{' '}
                    <img 
                      src="/assets/home/exploreArrow.png" 
                      alt="Explore Arrow" 
                      style={{ width: '28%', marginLeft: '3%' }} 
                    />
                  </Link>
                  <img 
                    className="mainImg" 
                    src={project.title_image?.[0] || '/assets/common/placeholder.jpg'} 
                    alt={project.title || 'Project Image'} 
                  />
                </div>

              </div>
            </div>
          ))}
          
        </div>
      </div>
    )}
      <div className="rightBelowCornerBox">
      <div className="hr d-flex align-items-center gap-2">
        <span className="mr-1">
          <img src="/assets/common/blogs-left-arrow.svg" alt="" className="prev-prop swiper-button-prev right-left" />
        </span>
        <span>
          <img src="/assets/common/blogs-left-arrow.svg" alt="" className="next-prop swiper-button-next right-arrow" />
        </span>
        <hr className="w-50" />
        <div className="swiper-pagination-prop">1-10</div>
      </div>
    </div>
  </div>
</div> */}

{/* <TestimonialsSection 
        testimonialVideos={testimonialVideos} 
        swiperRef={testimonialSwiperRef} 
      /> */}

{/* <div className="container-fluid FIFTHSECTION">
      <div className="headding-wrapper">
        <div className="headding animate-words-from-customers">
          <h1>Words from our customers</h1>
        </div>
        
        <Link 
          href="/testimonials" 
          className="view-all d-flex animate-customers-view-all text-decoration-none" 
          style={{ opacity: 0.699999988079071 }}
        >
          <hr style={{ width: '20vw' }} />
          &nbsp; &nbsp;
          <p className="cursor--pointer mb-2 me-2 text-white">View All &nbsp;</p>
          <img className="right-arrow" src="/assets/common/blogs-left-arrow.svg" alt="" />
        </Link>
      </div>

      <div className="modal-body">
        <div className="d-none">
          <iframe
            width="200"
            height="200"
            src="https://www.youtube.com/embed/cXlxMP9PU8I"
            title="Featured Customer Testimonial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <br />
        </div>
      </div>

      <section className="pt-5 pb-5">
        <div className="container-fluid p-0">
          <div className="swiper-block">
            <div className="p-0 VideoslideContainer">
              
              <div 
                className="swiper-container animate-words-from-customers-carousel swiper" 
                ref={testimonialSwiperRef}
              >
                <div className="swiper-wrapper">
                  {testimonialVideos && testimonialVideos.length > 0 ? (
                    testimonialVideos.map((videoUrl: string, i: number) => (
                      <div key={i} className="swiper-slide mobile-look">
                        <div className="video-container">
                          <iframe 
                            className="responsive-video" 
                            src={videoUrl} 
                            title={`Customer Testimonial Video ${i + 1}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="w-100 text-center text-muted py-4">
                      <p>Loading testimonial video reels...</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div> */}


      {/* CONTACT SECTION (Forms) */}
      {/* <form onSubmit={handleConnect}>
        <div className="container-fluid mt-5 contact-portion">
          <div className="row">
            <div className="contactText col-lg-4">
              <div style={{ overflow: "hidden" }}>
                <h1 className="text-center contact-us-animate">
                  Contact <span className="contact-us"> Us</span>
                </h1>
              </div>
              <p>Lets Take the first steps</p>
            </div>

            <div
              className="col-lg-8 contactInput"
              style={{ overflow: "hidden" }}
            >
              <div
                className="animate-input"
                style={{ display: "inline-block" }}
              >
                <div className="firstTwoInputs">
                  <div className="mt-5 inputSpacing">
                    <label>NAME*</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="Your Name here"
                      value={formData.Name}
                      onChange={(e) =>
                        setFormData({ ...formData, Name: e.target.value })
                      }
                    />
                  </div>
                  <div className="mt-5 mobile-input">
                    <label>MOBILE NUMBER*</label>
                    <input
                      type="tel"
                      required
                      className="form-control"
                      placeholder="Your Mobile Number here"
                      value={formData.Phone}
                      onChange={(e) =>
                        setFormData({ ...formData, Phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="mt-4 EmailInput">
                  <label>EMAIL ID*</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder="Your Email here"
                    value={formData.Email}
                    onChange={(e) =>
                      setFormData({ ...formData, Email: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="letSimplifyTab" style={{ overflow: "hidden" }}>
              <div className="simplify col-xl-6 lets-simplify-animate">
                <div className="col-6">Let’s simplify the</div>
                <div className="col-8">purchase of your first house</div>
              </div>
            </div>

            <button
              type="submit"
              className="letsconnect col-lg-12 cursor--pointer bg-transparent border-0"
            >
              <div style={{ overflow: "hidden" }}>
                <img
                  src="/assets/home/connectArrow.png"
                  alt=""
                  className="letsconnect-arrow"
                  style={{ zIndex: 999 }}
                />
              </div>
              <h1 className="text-center desktop-animate-lets-connect">
                Let’s Connect
              </h1>
            </button>
          </div>
        </div>
      </form> */}
    </>
  );
}