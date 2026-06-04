import { Metadata } from 'next';
import ProjectListingClient from '../components/properties/ProjectListingClient';

export const metadata: Metadata = {
  title: '2-3 BHK Flats Pune | Luxurious flats in Pune | Kumar Corp',
  description: 'Kumar Corp - Top builders in Pune for commercial - residential properties. 140+ projects, 42,000 happy customers, 36 million sq ft delivered.',
  keywords: '2 & 3 bhk flats pune',
  alternates: {
    canonical: 'https://kumarcorp.co.in/2-3-bhk-flats-pune',
  },
};

export default function ProjectsPage() {
  return (
    <main>
      <ProjectListingClient />
    </main>
  );
}