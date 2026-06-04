'use client';

import React from 'react';
import Link from 'next/link';

// 1. Explicitly type the incoming backend properties
interface TestimonialSectionProps {
  testimonialVideos?: string[];
  swiperRef?: React.RefObject<HTMLDivElement | null>;
}

export const TestimonialsSection: React.FC<TestimonialSectionProps> = ({ 
  testimonialVideos = [], 
  swiperRef 
}) => {
  
  return (
    <div className="container-fluid FIFTHSECTION">
      {/* Header Title Section */}
      <div className="headding-wrapper">
        <div className="headding animate-words-from-customers">
          <h1>Words from our customers</h1>
        </div>
        
        <Link 
          href="/testimonials" 
          className="view-all d-flex animate-customers-view-all text-decoration-none" 
          style={{ opacity: 0.7 }}
        >
          <hr style={{ width: '20vw' }} />
          &nbsp; &nbsp;
          <p className="cursor--pointer mb-2 me-2 text-white">View All &nbsp;</p>
          <img className="right-arrow" src="/assets/common/blogs-left-arrow.svg" alt="View All" />
        </Link>
      </div>

      {/* Hidden Layout Player (Preserved from original Angular Source) */}
      <div className="modal-body">
        <div className="d-none">
          <iframe
            width="200"
            height="200"
            src="https://www.youtube.com/embed/cXlxMP9PU8I"
            title="Featured Testimonial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Video Slider Track Container */}
      <section className="pt-5 pb-5">
        <div className="container-fluid p-0">
          <div className="swiper-block">
            <div className="p-0 VideoslideContainer">
              
              {!testimonialVideos || testimonialVideos.length === 0 ? (
                /* Dynamic Guard: Shows a clean loading state if the API is slow */
                <div className="w-100 text-center text-muted py-5">
                  <div className="spinner-border text-warning mb-2" role="status"></div>
                  <p className="font-sans">Loading customer stories...</p>
                </div>
              ) : (
                /* The Swiper Instance Container */
                <div 
                  className="swiper-container animate-words-from-customers-carousel swiper" 
                  ref={swiperRef}
                >
                  <div className="swiper-wrapper">
                    {testimonialVideos.map((videoUrl: string, i: number) => (
                      <div key={i} className="swiper-slide mobile-look">
                        <div className="video-container">
                          <iframe 
                            className="responsive-video" 
                            src={videoUrl} 
                            title={`Customer Testimonial ${i + 1}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};