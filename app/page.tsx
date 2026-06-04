// app/page.tsx
import { Metadata } from 'next';
// import HomeClient from './components/Home/HomeClient';
// import HeaderVisionOS from '@/components/Header';
import HomeClient from './components/Home/HomeClient';
// import HeroSlider from '@/components/Home/HeroSlider';
import ProjectShowcase from './components/Home/ProjectShowcase';
import StatsSection from './components/Home/StatsSection';
import TopProjectsAccordion from './components/Home/TopProjectsAccordion';

// 1. Static Metadata for SEO (Migrated from your Angular constructor)
export const metadata: Metadata = {
  title: 'Kumar Corp | Builders in Pune | Real estate developers',
  description: 'Kumar Corp - Top builders in Pune for commercial - residential properties. 135+ projects, 40,000 happy customers, 32 million sq ft delivered.',
  keywords: ['2 & 3 bhk flats pune', 'Real estate developers', 'Builders in Pune'],
};

export default function HomePage() {
  // return <div>Hello World</div>;
  return (
    <main>
      <HomeClient />
      <TopProjectsAccordion />

    </main>
  );
}