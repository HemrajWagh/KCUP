"use client";

import { useState, useEffect } from 'react';

export default function ProjectShowcaseTailwind() {
  // Simulating your isLoaded state
  const [isLoaded, setIsLoaded] = useState(true);

  return (
    <div className="w-full overflow-hidden py-12 px-4 sm:px-6 md:px-8">
      {/* 
        MAIN ROW (Replaces .row) 
        lg:flex-row puts the 1/3 and 2/3 columns side-by-side on desktop
      */}
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-10 max-w-7xl mx-auto">
        
        {/* LEFT COLUMN: Image 1 (Replaces col-lg-4) */}
        <div className="w-full lg:w-1/3">
          <img 
            src="/assets/home/image1.png" 
            alt="Showcase 1" 
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        {/* RIGHT COLUMN WRAPPER (Replaces col-lg-8) */}
        {isLoaded && (
          <div className="w-full lg:w-2/3 flex flex-col md:flex-row items-center gap-8 lg:gap-10">
            
            {/* INNER LEFT: Image 2 (Replaces col-lg-4 inside the col-lg-8) */}
            <div className="w-full md:w-5/12">
              <img 
                src="/assets/home/image2.png" 
                alt="Showcase 2" 
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>

            {/* INNER RIGHT: Text/Table Area (Replaces col-lg-6 inside col-lg-8) */}
            <div className="w-full md:w-7/12">
              
              {/* Tailwind Flex List (Replaces <table className="table">) */}
              <div className="flex flex-col w-full divide-y divide-gray-300/20 text-brand-cream">
                
                {/* Row 1: Text first, Icon second (Replaces ms-3) */}
                <div className="flex items-center py-4">
                  <span className="text-lg md:text-xl font-medium mr-3">
                    140+ Projects Completed
                  </span>
                  <img
                    src="/assets/home/projectsCompletedIcon.png"
                    alt=""
                    className="w-8 h-8 object-contain"
                  />
                </div>

                {/* Row 2: Icon first, Text second (Replaces me-3) */}
                <div className="flex items-center py-4">
                  <img
                    src="/assets/home/OnGoingProjectsIcon.png"
                    alt=""
                    className="w-9 h-9 object-contain mr-3"
                  />
                  <span className="text-lg md:text-xl font-medium">
                    15+ ongoing projects
                  </span>
                </div>

                {/* Row 3: Text first, Icon second (Replaces ms-3) */}
                <div className="flex items-center py-4">
                  <span className="text-lg md:text-xl font-medium mr-3">
                    42k+ Happy Customers
                  </span>
                  <img
                    src="/assets/home/HappyFamlyIcon.png"
                    alt=""
                    className="w-9 h-9 object-contain"
                  />
                </div>

                {/* Row 4: Icon first, Text second (Replaces border: 0 and me-1) */}
                <div className="flex items-center py-4 border-b-0">
                  <img
                    src="/assets/home/constructionIcon.png"
                    alt=""
                    className="w-[9%] min-w-[35px] object-contain mr-2"
                  />
                  <span className="text-lg md:text-xl font-medium">
                    36+ Million Sq. Ft constructed
                  </span>
                </div>
                
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}