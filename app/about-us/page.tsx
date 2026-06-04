// app/about-us/page.tsx
import { Metadata } from 'next';
import AboutUsClient from '@/app/components/about-us/AboutUsClient';
import AboutTheBrand from '@/app/components/about-us/AboutTheBrand';
import BrandPhilosophy from '../components/about-us/BrandPhilosophy';
import BrandPositioning from '../components/about-us/BrandPositioning';

export const metadata: Metadata = {
  title: 'About Kumar Corp | Legacy, Vision & Directors',
  description: 'Founded in 1966, Kumar Properties is a well-diversified, value-driven enterprise. Learn about our legacy, corporate profile, and leadership.',
};

export default function AboutUsPage() {
  return (
    // <main className="min-h-screen">
      <>
      <AboutTheBrand />
      <BrandPhilosophy />
      <BrandPositioning/>
      <AboutUsClient />
    </>
    // </main>
  );
}