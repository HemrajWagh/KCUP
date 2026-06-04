// lib/api.ts
// 1. Point the Base URL to the Next.js proxy
const BASE_URL = '/api-proxy/';

// 2. Core Fetch Function
const fetchFromApi = async (endpoint: string, revalidateTime = 3600) => {
  try {
    // Check if we are running on the server or the client (browser)
    const isServer = typeof window === 'undefined';

    // Set up fetch options. Only use Next.js caching if we are on the server!
    const fetchOptions: RequestInit = isServer 
      ? { next: { revalidate: revalidateTime } } 
      : { cache: 'no-store' }; // Browsers handle their own caching

    const res = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);

    if (!res.ok) {
      // 👇 ADDED THIS: Read the error message sent by your Express backend
      const errorData = await res.text(); 
      console.error(`❌ [API Service] Error ${res.status} fetching from: ${endpoint}`);
      console.error(`🚨 Backend Error Details:`, errorData); // This will tell you exactly what is wrong!
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(`❌ [API Service] Network Error:`, error);
    return null;
  }
};

/**
 * Exported API Methods
 */
export const ApiService = {
  getTrendingProjects: async () => {
    // Notice we do NOT use a leading slash here so it appends perfectly to the BASE_URL
    // Using 0 revalidate time right now so you can see live changes while coding
    return fetchFromApi('app/trending/apartment', 0); 
  },

  // 2. Fetches a specific project by its query string slug
  getProjectBySlug: async (slug: string) => {
    // Uses 0 revalidate time during your active development cycles
    return fetchFromApi(`app/apartment/?slug=${slug}`, 0); 
  },

  // Add this inside your existing ApiService object in services/api.ts
  getTestimonials: async () => {
    // Uses 3600 second revalidation caching for fast loading speeds
    return fetchFromApi('app/testimonials', 3600); 
  },

  // Fetch activities (Events, Exhibitions, CSR)
  getActivities: async (type: string, limit = 100, pageNo = 0) => {
    // Note: Revalidate set to 0 for active development. 
    // Change to 3600 when you are ready to cache in production.
    return fetchFromApi(`app/activity?type=${type}&limit=${limit}&page_no=${pageNo}`, 0);
  },

  // Fetch a single activity by ID for the detail page
  getActivityById: async (id: string) => {
    return fetchFromApi(`app/activity/${id}`, 0);
  }
};





// export async function getProjects(searchParams?: Record<string, string | number>) {
//   // 1. Grab the base URL from the environment
//   const baseUrl = 'http://localhost:3030';
  
//   // 2. Construct the full URL path
//   const url = new URL(`${baseUrl}/app/apartment/`);

//   // 3. Replicate Angular's 'params' object mapping
//   if (searchParams) {
//     Object.entries(searchParams).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         url.searchParams.append(key, String(value));
//       }
//     });
//   }

//   // 4. Native fetch replacing this.http.get()
//   const res = await fetch(url.toString(), {

//     // Next.js specific caching: Cache the result for 1 hour (3600 seconds)
//     // This is vital for real estate SEO and speed.
//     next: { revalidate: 3600 }, 
//   });

//   if (!res.ok) {
//     // Unlike Angular which relies on HttpInterceptors to catch errors,
//     // you handle fetch failures directly here.
//     throw new Error(`Failed to fetch projects: ${res.statusText}`);
//   }

//   // Native fetch does not automatically parse JSON
//   return res.json();
// }


// // app/page.tsx (or your homepage file)

// async function getTrendingProjects() {
//   const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030';
//   const targetUrl = `${baseUrl}/app/trending/apartment`;

//   try {
//     const res = await fetch(targetUrl, {
//       next: { revalidate: 3600 }, // Cache the trending list for an hour
//     });

//     if (!res.ok) {
//       console.error(`❌ Failed fetching trending projects. Status: ${res.status}`);
//       return [];
//     }

//     const json = await res.json();
    
//     // Destructuring { data } just like your Angular callback did
//     return json.data || [];
//   } catch (error) {
//     console.error("💥 Error fetching trending projects:", error);
//     return [];
//   }
// }


