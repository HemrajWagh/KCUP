'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { ApiService } from '../services/api';

type TabType = 'EVENT' | 'Exhibition' | 'CSR-ACTIVITIES';

export default function MediaPage() {
  const router = useRouter();

  // --- State ---
  const [activeTab, setActiveTab] = useState<TabType>('EVENT');
  const [isLoading, setIsLoading] = useState(false);
  
  // Data States
  const [eventData, setEventData] = useState<any[]>([]);
  const [exhibitionData, setExhibitionData] = useState<any[]>([]);
  const [csrData, setCsrData] = useState<any[]>([]);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [tableSize, setTableSize] = useState(6);

  // --- Refs for Animation ---
  const mainRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // --- Mock Data Fetching ---
  // useEffect(() => {
  //   // Replace with your actual API calls
  //   setEventData(Array(15).fill({ _id: '1', title: 'Medical Health Checkup at Park Infinia', thumb: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800', date: { start_date: '2026-10-04T00:00:00Z' } }));
  //   setExhibitionData(Array(10).fill({ _id: '2', title: 'Pune Real Estate Expo 2026', location: 'BCC Ground, Pune', files: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'], date: { start_date: '2026-11-12T00:00:00Z' } }));
  //   setCsrData(Array(8).fill({ _id: '3', title: 'Tree Plantation Drive', thumb: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800', date: { start_date: '2026-08-22T00:00:00Z' } }));
  // }, []);

  type TabType = 'EVENT' | 'EXHIBITION' | 'CSR_ACTIVITY';

  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all three data sets in parallel using your centralized ApiService
        const [events, exhibitions, csrs] = await Promise.all([
          ApiService.getActivities('EVENT', 100, 0),
          ApiService.getActivities('EXHIBITION', 100, 0),
          ApiService.getActivities('CSR_ACTIVITY', 100, 0)
        ]);

        // Ensure we set arrays (checking if your backend wraps it in a { data: [...] } object or returns the array directly)
        setEventData(Array.isArray(events) ? events : events?.data || []);
        setExhibitionData(Array.isArray(exhibitions) ? exhibitions : exhibitions?.data || []);
        setCsrData(Array.isArray(csrs) ? csrs : csrs?.data || []);

        /* 
        ================================================================
        MOCK DATA SETUP (Commented out for future reference/testing)
        ================================================================
        
        setEventData(Array(15).fill({ _id: '1', title: 'Medical Health Checkup at Park Infinia', thumb: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800', date: { start_date: '2026-10-04T00:00:00Z' } }));
        
        setExhibitionData(Array(10).fill({ _id: '2', title: 'Pune Real Estate Expo 2026', location: 'BCC Ground, Pune', files: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'], date: { start_date: '2026-11-12T00:00:00Z' } }));
        
        setCsrData(Array(8).fill({ _id: '3', title: 'Tree Plantation Drive', thumb: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800', date: { start_date: '2026-08-22T00:00:00Z' } }));
        
        */

      } catch (error) {
        console.error("Failed to fetch media data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMediaData();
  }, []);

  // --- Initial Hero Animation ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-word', 
        { y: 50, opacity: 0, rotateX: -20 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.1, ease: 'power3.out' }
      );
      gsap.fromTo('.hero-sub',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.4, ease: 'power2.out' }
      );
    }, mainRef);
    return () => ctx.revert();
  }, []);

  // --- Grid Animation on Tab Change ---
  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.media-card');
      if (cards.length > 0) {
        gsap.fromTo(cards,
          { y: 40, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.05, ease: 'power2.out', clearProps: 'all' }
        );
      }
    }, gridRef);
    return () => ctx.revert();
  }, [activeTab, currentPage, tableSize]);

  // --- Handlers ---
  const handleTabChange = (tab: TabType) => {
    setIsLoading(true);
    setActiveTab(tab);
    setCurrentPage(1); // Reset pagination on tab change
    setTimeout(() => setIsLoading(false), 300); // Simulate subtle load transition
  };

  const goToPage = (id: string) => {
    router.push(`/event-detail/${id}`);
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // --- Get Active Data Set ---
  const currentDataSet = useMemo(() => {
    if (activeTab === 'EVENT') return eventData;
    if (activeTab === 'EXHIBITION') return exhibitionData;
    return csrData;
  }, [activeTab, eventData, exhibitionData, csrData]);

  const paginatedData = currentDataSet.slice((currentPage - 1) * tableSize, currentPage * tableSize);

  return (
    <div ref={mainRef} className="min-h-screen bg-[#faf6f0] selection:bg-[#F58220] selection:text-white pb-24">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden flex flex-col items-center text-center">
        <div className="max-w-4xl mx-auto z-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-black tracking-tight leading-[1.1] mb-6 flex flex-wrap justify-center gap-x-4">
            <span className="hero-word">Our</span>
            <span className="hero-word special-text text-[#F58220]">Media</span>
            <span className="hero-word">& Events.</span>
          </h1>
          <p className="hero-sub text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Stay updated with our latest milestones, upcoming exhibitions, and community initiatives shaping the future.
          </p>
        </div>

        {/* --- TAB SWITCHER --- */}
        {/* --- TAB SWITCHER --- */}
        <div className="hero-sub mt-12 bg-white/80 backdrop-blur-md p-1.5 rounded-full inline-flex flex-wrap justify-center gap-1 border border-gray-200 shadow-sm relative z-10">
          {(['EVENT', 'EXHIBITION', 'CSR_ACTIVITY'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`relative px-6 md:px-8 py-3 rounded-full text-xs md:text-sm uppercase tracking-widest font-bold transition-all duration-500 ${
                activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-black'
              }`}
            >
              {activeTab === tab && <span className="absolute inset-0 bg-[#F58220] rounded-full -z-10 layout-id-tab" />}
              {/* Prettify the Enum for the user */}
              {tab === 'CSR_ACTIVITY' ? 'CSR Activities' : tab === 'EXHIBITION' ? 'Exhibitions' : 'Events'}
            </button>
          ))}
        </div>
      </section>

      {/* --- CSR DEDICATED TEXT (Only shows when CSR is active) --- */}
      {activeTab === 'CSR_ACTIVITY' && (
        <section className="container mx-auto px-4 md:px-8 max-w-4xl mb-12 text-center animate-in fade-in slide-in-from-bottom-4">
          <p className="text-gray-500 font-medium font-special italic text-lg leading-relaxed">
            Kumar Corp understands that success in business is deeply rooted in the progress of the society. 
            The group aims to enrich society by helping poor and needy sections. Being a good corporate citizen 
            is integral to advancing the way people live and work through initiatives in education, health, and sports.
          </p>
        </section>
      )}

      {/* --- MAIN GRID --- */}
      <section className="container mx-auto px-4 md:px-8 min-h-[50vh]">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#F58220] rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10" ref={gridRef}>
              {paginatedData.map((item, index) => (
                <div 
                  key={index}
                  onClick={() => goToPage(item._id)}
                  className="media-card cursor-pointer group block relative bg-white rounded-[1.5rem] overflow-hidden hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 will-change-transform flex flex-col h-full"
                >
                  {/* Image Wrapper */}
                  <div className="relative h-[280px] w-full overflow-hidden">
                    {/* Status/Type Badge */}
                    <div className="absolute top-5 left-5 z-20 flex gap-2">
                      <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border border-white/20 text-white bg-black/60">
                        {activeTab === 'CSR_ACTIVITY' ? 'CSR' : activeTab}
                      </span>
                    </div>

                    <img 
                      src={item.thumb || item.files?.[0]} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Elegant Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
                    
                    {/* Location Info inside Image (Only for Exhibitions) */}
                    {activeTab === 'EXHIBITION' && item.location && (
                      <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center gap-2 text-white/90">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm font-medium tracking-wide line-clamp-1">{item.location}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-black group-hover:text-[#F58220] transition-colors line-clamp-2 mb-4">
                      {item.title}
                    </h3>
                    
                    {/* Card Footer */}
                    <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between items-end">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</p>
                        <p className="text-lg font-black text-black flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#F58220]" />
                          {formatDate(item.date?.start_date)}
                        </p>
                      </div>
                      
                      <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-black group-hover:border-black group-hover:text-white transition-all duration-300 -rotate-45 group-hover:rotate-0 flex-shrink-0">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* --- PAGINATION & CONTROLS --- */}
            {currentDataSet.length > 0 && (
              <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-200 pt-8">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-wide">Items per page</span>
                  <div className="relative group">
                    <select 
                      value={tableSize}
                      onChange={(e) => {
                        setTableSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="appearance-none bg-white border border-gray-200 py-2 pl-4 pr-10 rounded-lg text-sm font-bold focus:border-black outline-none cursor-pointer hover:border-gray-300 transition-all shadow-sm"
                    >
                      <option value={6}>6</option>
                      <option value={12}>12</option>
                      <option value={18}>18</option>
                    </select>
                    {/* Custom Dropdown Arrow */}
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-sm font-medium text-gray-500">
                    Showing <strong className="text-black">{(currentPage - 1) * tableSize + 1}</strong> to <strong className="text-black">{Math.min(currentPage * tableSize, currentDataSet.length)}</strong> of {currentDataSet.length}
                  </span>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 disabled:opacity-30 hover:border-black transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={currentPage * tableSize >= currentDataSet.length}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 disabled:opacity-30 hover:border-black transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}




// import React from 'react'

// function Media() {
//   return (
//     <div className="mediaPage">
//   <div className="wrapper container">
//     <div className="tabs_wrap Media row ">
//       <ul className="col-lg-12">
//         <li (click)="selectTab('EVENT')" [ngclass]="{ 'active': selectedTab === 'EVENT' }" data-tabs="EVENT">
//           Events
//         </li>
//         <li (click)="selectTab('Exhibition')" [ngclass]="{ 'active': selectedTab === 'Exhibition' }" data-tabs="Exhibition">
//           Exhibitions</li>
//         <li (click)="selectTab('CSR-ACTIVITIES')" [ngclass]="{ 'active': selectedTab === 'CSR-ACTIVITIES' }" data-tabs="CSR-ACTIVITIES">
//           CSR Activities</li>
//       </ul>
//     </div>
//   </div>
//   <div className="container-fluid">
//     <div [ngclass]="{
//     'd-block': selectedTab === 'EVENT',
//     'd-none': selectedTab != 'EVENT'
//   }" className="container-fluid">
//       <div *ngif="false" className="row rotateReverse">
//         <div className="imageText col-lg-6 col-xl-6">
//           <div className="headding">
//             <h1>Upcoming
//               Events</h1>
//           </div>
//           <div className="belowText">
//             <h3>Medical Health Checkup</h3>
//             <p>Park Infinia Site – 4th and 5th October 2018</p>
//           </div>
//           <div className="KnowMore">
//             <span>Know More <button className="btn"><i className="fa-solid fa-arrow-right" /></button></span>
//           </div>
//         </div>
//         <div className="MainImg col-lg-6 col-xl-6">
//           <img src="assets/media/Rectangle 255 (1).png" alt />
//         </div>
//       </div>
//       <div className="row">
//         <div className="col-lg-6 col-md-6 Events">
//           <h1>Events</h1>
//         </div>
//       </div>
//       <div className="container-fluid  ">
//         <div className="row" style={{"margin-top":"5%"}}>
//           <div *ngfor="let event of eventData  | paginate
//           : {
//                id: 'pagination1',
//               itemsPerPage: tableSize,
//               currentPage: page,
//               totalItems: count
//             };
//       let i = index" className="card-padding col-lg-4 col-md-6 col-sm-12">
//             <div *ngif="event.thumb">
//               <div className="card">
//                 <div className="inner-padding">
//                   <div className="hoverDiv">
//                     <div className="viewBlog">
//                       <div (click)="gotopage(event._id)">
//                         <span>View</span>
//                         <img className="arrow" src="../../assets/blogs/blogsArrow.png" alt />
//                       </div>
//                     </div>
//                     <img className="card-img-top" src="{{event.thumb}}" alt="Card image cap" />
//                   </div>
//                   <div className="card-body">
//                     <p className="card-text">{'{'}{'{'}event.title{'}'}{'}'}</p>
//                   </div>
//                   <div className="card-footer">
//                     <div className="footerContent">
//                       <img src="../../assets/icons/calendar 1.png" alt />
//                       <span>{'{'}{'{'}((event.date.start_date | date : "mediumDate") !.split(",")[0] ){'}'}{'}'}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="row">
//           <div className="pagination-controls d-flex justify-content-end ">
//             <div className="d-flex dropdown-box">
//               <label htmlFor="cards-per-page">Items per page:</label>
//               <div className="select">
//                 <div className="selectBtn select-Btn" data-type="firstOption">6</div>
//                 <div className="selectDropdown small-select">
//                   <div className="option" data-type="firstOption">12</div>
//                   <div className="option" data-type="secondOption">6</div>
//                   <div className="option" data-type="thirdOption">8</div>
//                 </div>
//               </div>
//             </div>
//             <span>1 - 6 of 100</span>
//             <div>
//               <div className="d-flex">
//                 <button className="btn " (click)="previousPage()" [disabled]="currentPage === 1"><i className="fa-solid fa-chevron-left" /></button>
//                 <button className="btn " (click)="nextPage()" [disabled]="currentPage === totalPages"><i className="fa-solid fa-chevron-right" /></button>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="row" style={{"-webkit-text-align":"end","text-align":"end"}}>
//           <div className="d-flex col-lg-12 col-sm-12 col-md-12 paginationBox justify-content-end">
//             <div className="itemsperPage">
//               <label htmlFor="cards-per-page">Items per page:</label>
//             </div>
//             <div className="marRight">
//               <div className="select itemsPrPg-div" tabIndex={1}>
//                 <div className="selectBtn select-Btn itemsPrPg" style={{"width":"100% !important"}} data-type="firstOption">
//                   6
//                 </div>
//                 <div className="selectDropdown small-select">
//                   <div className="option" (click)="updateTableSize(6)" value={6} data-type="firstOption">
//                     <div><span>6</span></div>
//                   </div>
//                   <div className="option" (click)="updateTableSize(12)" value={12} data-type="secondOption">
//                     <div><span>12</span></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <span className="pageCount">{'{'}{'{'} tableSize * page - tableSize + 1 {'}'}{'}'} -
//               {'{'}{'{'}
//               tableSize * page &lt; eventData.length ? tableSize * page : eventData.length {'}'}{'}'} of {'{'}{'{'} eventData.length
//               {'}'}{'}'}</span>
//             <div>
//               <pagination-controls id="pagination1" previouslabel nextlabel (pagechange)="onTableDataChange($event)">
//               </pagination-controls>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
//   <div className="container-fluid">
//     <div [ngclass]="{
//     'd-block': selectedTab === 'Exhibition',
//     'd-none': selectedTab != 'Exhibition'
//   }" className="container-fluid">
//       <div *ngif="false" className="row rotateReverse ">
//         <div className="imageText col-lg-6 col-xl-6">
//           <div className="headding">
//             <h1>Upcoming
//               EXIBITIONS</h1>
//           </div>
//           <div className="belowText">
//             <h3>Medical Health Checkup</h3>
//             <p>Park Infinia Site – 4th and 5th October 2018</p>
//           </div>
//           <div className="KnowMore">
//             <span>Know More <button className="btn"><i className="fa-solid fa-arrow-right" /></button></span>
//           </div>
//         </div>
//         <div className="MainImg col-lg-6 col-xl-6">
//           <img src="assets/media/Rectangle 255 (1).png" alt />
//         </div>
//       </div>
//       <div className="row">
//         <div className="col-lg-6 Events">
//           <h1>Exhibitions</h1>
//         </div>
//       </div>
//       <div className="container-fluid  " style={{"margin-bottom":"5%"}}>
//         <div className="row" style={{"margin-top":"5%"}}>
//           <div *ngfor="let exhibition of exhibitionData  | paginate
//             : {
//               id: 'pagination2',
//                 itemsPerPage: tableSize2,
//                 currentPage: page2,
//                 totalItems: count2
//               };
//         let i = index" className="card-padding col-lg-4 col-md-6 col-sm-12">
//             <div className="card">
//               <div className="inner-padding">
//                 <div>
//                   <img className="card-img-top" src="{{exhibition.files[0]}}" alt="Card image cap" />
//                 </div>
//                 <div className="card-body">
//                   <p className="card-text">{'{'}{'{'}exhibition.title{'}'}{'}'}</p>
//                   <p className="card-text">{'{'}{'{'}exhibition.location{'}'}{'}'}</p>
//                 </div>
//                 <div className="card-footer">
//                   <div className="footerContent">
//                     <img src="../../assets/icons/calendar 1.png" alt />
//                     <span>{'{'}{'{'}(exhibition.date.start_date | date : "mediumDate") !.split(",")[0] {'}'}{'}'}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="row" *ngif="false" style={{"-webkit-text-align":"end","text-align":"end"}}>
//           <div className="d-flex col-lg-12 col-sm-12 col-md-12 paginationBox justify-content-end">
//             <span className="pageCount">{'{'}{'{'} tableSize2 * page2 - tableSize2 + 1 {'}'}{'}'} -
//               {'{'}{'{'}
//               tableSize2 * page2 &lt; exhibitionData.length ? tableSize2 * page2 : exhibitionData.length {'}'}{'}'} of {'{'}{'{'}
//               exhibitionData.length {'}'}{'}'}</span>
//             <div>
//               <pagination-controls id="pagination2" previouslabel nextlabel (pagechange)="onTableDataChange2($event)">
//               </pagination-controls>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
//   <div className="container-fluid">
//     <div [ngclass]="{
//     'd-block': selectedTab === 'CSR-ACTIVITIES',
//     'd-none': selectedTab != 'CSR-ACTIVITIES'
//   }" className="container-fluid">
//       <div *ngif="false" className="row CsrContainer">
//         <div className="imageText col-lg-6 col-xl-6">
//           <div className="headding CSR-headding">
//             <h1>Upcoming
//               CSR ACTIVITY</h1>
//           </div>
//           <div className="belowText">
//             <h3>Medical Health Checkup</h3>
//             <p>Park Infinia Site – 4th and 5th October 2018</p>
//           </div>
//           <div className="KnowMore">
//             <span>Know More <button className="btn"><i className="fa-solid fa-arrow-right" /></button></span>
//           </div>
//         </div>
//         <div className="MainImg col-lg-6 col-xl-6">
//           <img src="assets/media/Rectangle 255 (1).png" alt />
//         </div>
//       </div>
//       <div className="row csr-para">
//         <div className="container">
//           <p className="co-lg-12 col-sm-12 col-xs-12 col-md-12 kumarGrowUp">Kumar Corp – Top builder in
//             pune as a
//             group understands
//             that success in
//             business is
//             deeply
//             rooted in the progress of the society. The group aims to enrich society by helping poor and
//             needy sections of people/society. Being a good corporate citizen is integral to the group’s
//             corporate purpose of advancing the way people live and work.
//             Kumar Corp as a group has taken several initiatives in the fields of education,
//             health,
//             and sports.</p>
//         </div>
//       </div>
//       <div className="row">
//         <div className="col-lg-6  CSR-ACTIVITIES">
//           <h1>CSR Activities</h1>
//         </div>
//       </div>
//       <div className="container-fluid  " style={{"margin-bottom":"5%"}}>
//         <div className="row" style={{"margin-top":"5%"}}>
//           <div *ngfor="let csr of CSRData  | paginate
//              : {
//               id: 'pagination3',
//                  itemsPerPage: tableSize3,
//                  currentPage: page3,
//                  totalItems: count3
//                };
//          let i = index" className="card-padding col-lg-4 col-md-6 col-sm-12">
//             <div className="card">
//               <div className="inner-padding">
//                 <div className="hoverDiv">
//                   <div className="viewBlog">
//                     <div (click)="gotopage(csr._id)">
//                       <span>View</span>
//                       <img className="arrow" src="../../assets/blogs/blogsArrow.png" alt />
//                     </div>
//                   </div>
//                   <img className="card-img-top" src="{{csr.thumb}}" alt="Card image cap" />
//                 </div>
//                 <div className="card-body">
//                   <p className="card-text">{'{'}{'{'}csr.title{'}'}{'}'}</p>
//                 </div>
//                 <div className="card-footer">
//                   <div className="footerContent">
//                     <img src="../../assets/icons/calendar 1.png" alt />
//                     <span>{'{'}{'{'}(csr.date.start_date | date : "mediumDate") !.split(",")[0] {'}'}{'}'}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="row" *ngif="false" style={{"-webkit-text-align":"end","text-align":"end"}}>
//           <div className="col-lg-5 col-md-4 col-sm-12" />
//           <div className="d-flex col-lg-12 col-sm-12 col-md-12 paginationBox justify-content-end">
//             <div className="itemsperPage">
//               <label htmlFor="cards-per-page">Items per page:</label>
//             </div>
//             <div className="marRight">
//               <div className="select itemsPrPg-div" tabIndex={1}>
//                 <div className="selectBtn select-Btn itemsPrPg" style={{"width":"100% !important"}} data-type="firstOption">
//                   6
//                 </div>
//                 <div className="selectDropdown small-select">
//                   <div className="option" (click)="updateTableSize(6)" value={6} data-type="firstOption">
//                     <div><span>6</span></div>
//                   </div>
//                   <div className="option" (click)="updateTableSize(12)" value={12} data-type="secondOption">
//                     <div><span>12</span></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <span className="pageCount">{'{'}{'{'} tableSize3 * page3 - tableSize3 + 1 {'}'}{'}'} -
//               {'{'}{'{'}
//               tableSize3 * page3 &lt; CSRData.length ? tableSize3 * page3 : CSRData.length {'}'}{'}'} of {'{'}{'{'} CSRData.length
//               {'}'}{'}'}</span>
//             <div>
//               <pagination-controls id="pagination3" previouslabel nextlabel (pagechange)="onTableDataChange3($event)">
//               </pagination-controls>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
// //     <div className="mediaPage">
// //   <div className="wrapper container">
// //     <div className="tabs_wrap Media row ">
// //       <ul className="col-lg-12">
// //         <li (click)="selectTab('EVENT')" [ngclass]="{ 'active': selectedTab === 'EVENT' }" data-tabs="EVENT">
// //           Events
// //         </li>
// //         <li (click)="selectTab('Exhibition')" [ngclass]="{ 'active': selectedTab === 'Exhibition' }" data-tabs="Exhibition">
// //           Exhibitions</li>
// //         <li (click)="selectTab('CSR-ACTIVITIES')" [ngclass]="{ 'active': selectedTab === 'CSR-ACTIVITIES' }" data-tabs="CSR-ACTIVITIES">
// //           CSR Activities</li>
// //       </ul>
// //     </div>
// //   </div>
// //   <div className="container-fluid">
// //     <div [ngclass]="{
// //     'd-block': selectedTab === 'EVENT',
// //     'd-none': selectedTab != 'EVENT'
// //   }" className="container-fluid">
// //       <div  className="row rotateReverse">
// //         <div className="imageText col-lg-6 col-xl-6">
// //           <div className="headding">
// //             <h1>Upcoming
// //               Events</h1>
// //           </div>
// //           <div className="belowText">
// //             <h3>Medical Health Checkup</h3>
// //             <p>Park Infinia Site – 4th and 5th October 2018</p>
// //           </div>
// //           <div className="KnowMore">
// //             <span>Know More <button className="btn"><i className="fa-solid fa-arrow-right" /></button></span>
// //           </div>
// //         </div>
// //         <div className="MainImg col-lg-6 col-xl-6">
// //           <img src="assets/media/Rectangle 255 (1).png" alt />
// //         </div>
// //       </div>
// //       <div className="row">
// //         <div className="col-lg-6 col-md-6 Events">
// //           <h1>Events</h1>
// //         </div>
// //       </div>
// //       <div className="container-fluid  ">
// //         <div className="row" style={{"margin-top":"5%"}}>
// //           <div *ngfor="let event of eventData  | paginate
// //           : {
// //                id: 'pagination1',
// //               itemsPerPage: tableSize,
// //               currentPage: page,
// //               totalItems: count
// //             };
// //       let i = index" className="card-padding col-lg-4 col-md-6 col-sm-12">
// //             <div >
// //               <div className="card">
// //                 <div className="inner-padding">
// //                   <div className="hoverDiv">
// //                     <div className="viewBlog">
// //                       <div (click)="gotopage(event._id)">
// //                         <span>View</span>
// //                         <img className="arrow" src="../../assets/blogs/blogsArrow.png" alt />
// //                       </div>
// //                     </div>
// //                     <img className="card-img-top" src="{{event.thumb}}" alt="Card image cap" />
// //                   </div>
// //                   <div className="card-body">
// //                     <p className="card-text">{'{'}{'{'}event.title{'}'}{'}'}</p>
// //                   </div>
// //                   <div className="card-footer">
// //                     <div className="footerContent">
// //                       <img src="../../assets/icons/calendar 1.png" alt />
// //                       <span>{'{'}{'{'}((event.date.start_date | date : "mediumDate") !.split(",")[0] ){'}'}{'}'}</span>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //         <div className="row">
// //           <div className="pagination-controls d-flex justify-content-end ">
// //             <div className="d-flex dropdown-box">
// //               <label htmlFor="cards-per-page">Items per page:</label>
// //               <div className="select">
// //                 <div className="selectBtn select-Btn" data-type="firstOption">6</div>
// //                 <div className="selectDropdown small-select">
// //                   <div className="option" data-type="firstOption">12</div>
// //                   <div className="option" data-type="secondOption">6</div>
// //                   <div className="option" data-type="thirdOption">8</div>
// //                 </div>
// //               </div>
// //             </div>
// //             <span>1 - 6 of 100</span>
// //             <div>
// //               <div className="d-flex">
// //                 <button className="btn " (click)="previousPage()" [disabled]="currentPage === 1"><i className="fa-solid fa-chevron-left" /></button>
// //                 <button className="btn " (click)="nextPage()" [disabled]="currentPage === totalPages"><i className="fa-solid fa-chevron-right" /></button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //         <div className="row" style={{"-webkit-text-align":"end","text-align":"end"}}>
// //           <div className="d-flex col-lg-12 col-sm-12 col-md-12 paginationBox justify-content-end">
// //             <div className="itemsperPage">
// //               <label htmlFor="cards-per-page">Items per page:</label>
// //             </div>
// //             <div className="marRight">
// //               <div className="select itemsPrPg-div" tabIndex={1}>
// //                 <div className="selectBtn select-Btn itemsPrPg" style={{"width":"100% !important"}} data-type="firstOption">
// //                   6
// //                 </div>
// //                 <div className="selectDropdown small-select">
// //                   <div className="option" (click)="updateTableSize(6)" value={6} data-type="firstOption">
// //                     <div><span>6</span></div>
// //                   </div>
// //                   <div className="option" (click)="updateTableSize(12)" value={12} data-type="secondOption">
// //                     <div><span>12</span></div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //             <span className="pageCount">{'{'}{'{'} tableSize * page - tableSize + 1 {'}'}{'}'} -
// //               {'{'}{'{'}
// //               tableSize * page &lt; eventData.length ? tableSize * page : eventData.length {'}'}{'}'} of {'{'}{'{'} eventData.length
// //               {'}'}{'}'}</span>
// //             <div>
// //               <pagination-controls id="pagination1" previouslabel nextlabel (pagechange)="onTableDataChange($event)">
// //               </pagination-controls>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   </div>
// //   <div className="container-fluid">
// //     <div [ngclass]="{
// //     'd-block': selectedTab === 'Exhibition',
// //     'd-none': selectedTab != 'Exhibition'
// //   }" className="container-fluid">
// //       <div  className="row rotateReverse ">
// //         <div className="imageText col-lg-6 col-xl-6">
// //           <div className="headding">
// //             <h1>Upcoming
// //               EXIBITIONS</h1>
// //           </div>
// //           <div className="belowText">
// //             <h3>Medical Health Checkup</h3>
// //             <p>Park Infinia Site – 4th and 5th October 2018</p>
// //           </div>
// //           <div className="KnowMore">
// //             <span>Know More <button className="btn"><i className="fa-solid fa-arrow-right" /></button></span>
// //           </div>
// //         </div>
// //         <div className="MainImg col-lg-6 col-xl-6">
// //           <img src="assets/media/Rectangle 255 (1).png" alt />
// //         </div>
// //       </div>
// //       <div className="row">
// //         <div className="col-lg-6 Events">
// //           <h1>Exhibitions</h1>
// //         </div>
// //       </div>
// //       <div className="container-fluid  " style={{"margin-bottom":"5%"}}>
// //         <div className="row" style={{"margin-top":"5%"}}>
// //           <div *ngfor="let exhibition of exhibitionData  | paginate
// //             : {
// //               id: 'pagination2',
// //                 itemsPerPage: tableSize2,
// //                 currentPage: page2,
// //                 totalItems: count2
// //               };
// //         let i = index" className="card-padding col-lg-4 col-md-6 col-sm-12">
// //             <div className="card">
// //               <div className="inner-padding">
// //                 <div>
// //                   <img className="card-img-top" src="{{exhibition.files[0]}}" alt="Card image cap" />
// //                 </div>
// //                 <div className="card-body">
// //                   <p className="card-text">{'{'}{'{'}exhibition.title{'}'}{'}'}</p>
// //                   <p className="card-text">{'{'}{'{'}exhibition.location{'}'}{'}'}</p>
// //                 </div>
// //                 <div className="card-footer">
// //                   <div className="footerContent">
// //                     <img src="../../assets/icons/calendar 1.png" alt />
// //                     <span>{'{'}{'{'}(exhibition.date.start_date | date : "mediumDate") !.split(",")[0] {'}'}{'}'}</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //         <div className="row"  style={{"-webkit-text-align":"end","text-align":"end"}}>
// //           <div className="d-flex col-lg-12 col-sm-12 col-md-12 paginationBox justify-content-end">
// //             <span className="pageCount">{'{'}{'{'} tableSize2 * page2 - tableSize2 + 1 {'}'}{'}'} -
// //               {'{'}{'{'}
// //               tableSize2 * page2 &lt; exhibitionData.length ? tableSize2 * page2 : exhibitionData.length {'}'}{'}'} of {'{'}{'{'}
// //               exhibitionData.length {'}'}{'}'}</span>
// //             <div>
// //               <pagination-controls id="pagination2" previouslabel nextlabel (pagechange)="onTableDataChange2($event)">
// //               </pagination-controls>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   </div>
// //   <div className="container-fluid">
// //     <div [ngclass]="{
// //     'd-block': selectedTab === 'CSR-ACTIVITIES',
// //     'd-none': selectedTab != 'CSR-ACTIVITIES'
// //   }" className="container-fluid">
// //       <div  className="row CsrContainer">
// //         <div className="imageText col-lg-6 col-xl-6">
// //           <div className="headding CSR-headding">
// //             <h1>Upcoming
// //               CSR ACTIVITY</h1>
// //           </div>
// //           <div className="belowText">
// //             <h3>Medical Health Checkup</h3>
// //             <p>Park Infinia Site – 4th and 5th October 2018</p>
// //           </div>
// //           <div className="KnowMore">
// //             <span>Know More <button className="btn"><i className="fa-solid fa-arrow-right" /></button></span>
// //           </div>
// //         </div>
// //         <div className="MainImg col-lg-6 col-xl-6">
// //           <img src="assets/media/Rectangle 255 (1).png" alt />
// //         </div>
// //       </div>
// //       <div className="row csr-para">
// //         <div className="container">
// //           <p className="co-lg-12 col-sm-12 col-xs-12 col-md-12 kumarGrowUp">Kumar Corp – Top builder in
// //             pune as a
// //             group understands
// //             that success in
// //             business is
// //             deeply
// //             rooted in the progress of the society. The group aims to enrich society by helping poor and
// //             needy sections of people/society. Being a good corporate citizen is integral to the group’s
// //             corporate purpose of advancing the way people live and work.
// //             Kumar Corp as a group has taken several initiatives in the fields of education,
// //             health,
// //             and sports.</p>
// //         </div>
// //       </div>
// //       <div className="row">
// //         <div className="col-lg-6  CSR-ACTIVITIES">
// //           <h1>CSR Activities</h1>
// //         </div>
// //       </div>
// //       <div className="container-fluid  " style={{"margin-bottom":"5%"}}>
// //         <div className="row" style={{"margin-top":"5%"}}>
// //           <div *ngfor="let csr of CSRData  | paginate
// //              : {
// //               id: 'pagination3',
// //                  itemsPerPage: tableSize3,
// //                  currentPage: page3,
// //                  totalItems: count3
// //                };
// //          let i = index" className="card-padding col-lg-4 col-md-6 col-sm-12">
// //             <div className="card">
// //               <div className="inner-padding">
// //                 <div className="hoverDiv">
// //                   <div className="viewBlog">
// //                     <div (click)="gotopage(csr._id)">
// //                       <span>View</span>
// //                       <img className="arrow" src="../../assets/blogs/blogsArrow.png" alt />
// //                     </div>
// //                   </div>
// //                   <img className="card-img-top" src="{{csr.thumb}}" alt="Card image cap" />
// //                 </div>
// //                 <div className="card-body">
// //                   <p className="card-text">{'{'}{'{'}csr.title{'}'}{'}'}</p>
// //                 </div>
// //                 <div className="card-footer">
// //                   <div className="footerContent">
// //                     <img src="../../assets/icons/calendar 1.png" alt />
// //                     <span>{'{'}{'{'}(csr.date.start_date | date : "mediumDate") !.split(",")[0] {'}'}{'}'}</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //         <div className="row" style={{"-webkit-text-align":"end","text-align":"end"}}>
// //           <div className="col-lg-5 col-md-4 col-sm-12" />
// //           <div className="d-flex col-lg-12 col-sm-12 col-md-12 paginationBox justify-content-end">
// //             <div className="itemsperPage">
// //               <label htmlFor="cards-per-page">Items per page:</label>
// //             </div>
// //             <div className="marRight">
// //               <div className="select itemsPrPg-div" tabIndex={1}>
// //                 <div className="selectBtn select-Btn itemsPrPg" style={{"width":"100% !important"}} data-type="firstOption">
// //                   6
// //                 </div>
// //                 <div className="selectDropdown small-select">
// //                   <div className="option" (click)="updateTableSize(6)" value={6} data-type="firstOption">
// //                     <div><span>6</span></div>
// //                   </div>
// //                   <div className="option" (click)="updateTableSize(12)" value={12} data-type="secondOption">
// //                     <div><span>12</span></div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //             <span className="pageCount">{'{'}{'{'} tableSize3 * page3 - tableSize3 + 1 {'}'}{'}'} -
// //               {'{'}{'{'}
// //               tableSize3 * page3 &lt; CSRData.length ? tableSize3 * page3 : CSRData.length {'}'}{'}'} of {'{'}{'{'} CSRData.length
// //               {'}'}{'}'}</span>
// //             <div>
// //               <pagination-controls id="pagination3" previouslabel nextlabel (pagechange)="onTableDataChange3($event)">
// //               </pagination-controls>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   </div>
// // </div>
// )
// }

// export default Media