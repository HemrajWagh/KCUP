// app/properties/[slug]/page.tsx
import { Metadata } from "next";
import { promises as fs } from 'fs';
import path from 'path';
import ProjectDetailClient from "@/app/components/properties/ProjectDetailClient";

// Helper function to fetch data (replace with your actual API endpoint)

// async function getProjectData(slug: string) {
//   try {
//     const filePath = path.join(process.cwd(), 'public', 'assets', 'map-json', 'projectsData.json');
//     const jsonData = await fs.readFile(filePath, 'utf8');
//     const allProjects = JSON.parse(jsonData);

//     // 1. Target the 'data' key or whatever array key your JSON uses
//     const projectsArray = allProjects.data || allProjects.apartments || allProjects.projects;

//     if (!Array.isArray(projectsArray)) {
//       console.error("Could not find an array in projectsData.json. Found keys:", Object.keys(allProjects));
//       return null;
//     }

//     // 2. Safely call find on the parsed array
//     const project = projectsArray.find((p: any) => p.slug === slug);
//     return project || null;
//   } catch (error) {
//     console.error("Error reading local JSON file:", error);
//     return null;
//   }
// }

// async function getProjectData(slug: string) {
//   try {
//     // Construct the absolute path to the public directory
//     const filePath = path.join(process.cwd(), 'public', 'assets', 'map-json', 'projectsData.json');
    
//     // Read the file asynchronously
//     const jsonData = await fs.readFile(filePath, 'utf8');
    
//     // Parse the JSON data
//     const allProjects = JSON.parse(jsonData);

//     // Assuming your JSON is an array of projects, find the one matching the slug
//     // If your JSON structure is different (e.g., { data: [...] }), adjust this accordingly:
//     const project = allProjects.find((p: any) => p.slug === slug);

//     console.log("Project data found:", project);

//     return project || null;
//   } catch (error) {
//     console.error("Error reading local JSON file:", error);
//     return null;
//   }
// }

async function getProjectData(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030';
  
  // FIXED: Changed 'api/projects/:slug' to 'app/apartment/?slug=:slug'
  const targetUrl = `${baseUrl}/app/apartment/?slug=${slug}`;
  
  console.log("🔍 [getProjectData] Fetching from correct endpoint:", targetUrl);

  try {
    const res = await fetch(targetUrl, {
      next: { revalidate: 0 }, 
    });

    if (!res.ok) {
      console.error(`❌ [getProjectData] Failed with status: ${res.status}`);
      return null;
    }

    const json = await res.json();
    console.log("✅ [getProjectData] Data payload received:", json);
    
    // Note: If your backend returns an array for this endpoint, 
    // you might need to return 'json[0]' or 'json.data[0]'. 
    // Check your terminal log to see if it's an array or an object!
    return json.data || json;
  } catch (error) {
    console.error("💥 [getProjectData] Network Exception:", error);
    return null;
  }
}


// async function getProjectData(slug: string) {
//   const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030';
//   const targetUrl = `${baseUrl}/api/projects/${slug}`;
  
//   console.log("🔍 [getProjectData] Attempting fetch to URL:", targetUrl);
//   console.log("🔍 [getProjectData] Passed Slug argument:", slug);

//   try {
//     const res = await fetch(targetUrl, {
//       next: { revalidate: 0 }, // Temp set to 0 to bypass caching while debugging
//     });

//     console.log(`📡 [getProjectData] Response Status: ${res.status} ${res.statusText}`);

//     if (!res.ok) {
//       // If it's a 404, let's see what HTML or message the backend is sending back
//       const errorText = await res.text();
//       console.error(`❌ [getProjectData] Server returned error payload:\n`, errorText);
//       return null;
//     }

//     const json = await res.json();
//     console.log("✅ [getProjectData] Raw JSON parsed successfully:", json);
    
//     return json.data;
//   } catch (error) {
//     console.error("💥 [getProjectData] Critical Network Crash:", error);
//     return null;
//   }
// }

// async function getProjectData(slug: string) {
//   // Fallback to localhost if the env variable isn't loaded yet
//   const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030';
  
//   try {
//     const res = await fetch(`${baseUrl}/api/projects/${slug}`, {
//       next: { revalidate: 3600 }, // Cache the response, revalidate every hour
//     });

//     if (!res.ok) {
//       console.error(`❌ Fetch failed with status: ${res.status}`);
//       return null;
//     }

//     const json = await res.json();
//     console.log("Project response json", json);
    
//     return json.data;
//   } catch (error) {
//     console.error("❌ Network error inside getProjectData:", error);
//     return null;
//   }
// }
// async function getProjectData(slug: string) {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${slug}`,
//     {
//       next: { revalidate: 3600 }, // Cache the response, revalidate every hour
//     },
//   );
//   if (!res.ok) return null;
//   const json = await res.json();
//   console.log("Project response json", json);
//   return json.data;
// }
// async function getProjectData(slug: string) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${slug}`, {
//     next: { revalidate: 3600 } // Cache the response, revalidate every hour
//   });
//   if (!res.ok) return null;
//   const json = await res.json();
//   return json.data;
// }

// 1. Dynamic SEO Metadata Generation
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectData(slug);

  if (!project) return { title: "Project Not Found" };

  const metaMap: Record<string, string> = {};
  project.meta_tags?.forEach((meta: any) => {
    if (meta.name === "Title") metaMap.title = meta.tag;
    if (meta.name === "Description") metaMap.description = meta.tag;
    if (meta.name === "Keyword") metaMap.keywords = meta.tag;
  });

  return {
    title: metaMap.title || `${project.title} | Premium Real Estate`,
    description: metaMap.description || project.sub_title,
    keywords: metaMap.keywords,
  };
}

// export default async function ProjectsPage({
//   searchParams, // Next.js automatically passes the URL query strings here
// }: {
//   searchParams: Promise<Record<string, string>>;
// }) {
//   // 1. Await the incoming URL parameters (e.g., ?city=Pune&beds=3)
//   const params = await searchParams;

//   // 2. Await your translated service function
//   const projectsResponse = await getProjects(params);

//   // Assuming the API returns { data: [...] }
//   const projects = projectsResponse.data || [];

//   return (
//     <div className="container mx-auto">
//       <h1>Our Projects</h1>
//       {/* Map through your projects instantly on the server */}
//       <div className="grid">
//         {projects.map((project: any) => (
//           <div key={project.id}>{project.slug}</div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default async function ProjectPage({
//   searchParams,
// }: {
//   searchParams: Promise<{ slug: string }>;
// }) {
//   const { slug } = await searchParams;
//   const projectData = await getProjectData(slug);
//   if (!projectData) {
//     console.log("projectData:", projectData);
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Project Not Found.
//       </div>
//     );
//   }

//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "RealEstateListing",
//     name: projectData.title,
//     description: projectData.description,
//     image: projectData.title_image?.[0],
//     address: {
//       "@type": "PostalAddress",
//       addressLocality: projectData.city_name,
//       addressRegion: "Maharashtra",
//       addressCountry: "IN",
//     },
//   };

//   return (
//     <main className="min-h-screen">
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//       />
//       {/* 3. Pass data to the interactive Client Component */}
//       <ProjectDetailClient projectData={projectData} />
//     </main>
//   );
// }


export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await the params Promise (Fixes the Sync Dynamic API Error!)
  const resolvedParams = await params;
  const projectData = await getProjectData(resolvedParams.slug);
  console.log("Project data in page component:", projectData);

  if (!projectData) {
    return <div className="min-h-screen flex items-center justify-center">Project Not Found</div>;
  }

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: projectData.title,
    description: projectData.description,
    image: projectData.title_image?.[0],
    address: {
      '@type': 'PostalAddress',
      addressLocality: projectData.city_name,
      addressRegion: 'Maharashtra',
      addressCountry: 'IN'
    }
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Pass local data to the interactive Client Component */}
      <ProjectDetailClient projectData={projectData} />
    </main>
  );
}