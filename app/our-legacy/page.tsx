
import { Metadata } from 'next';
import AboutUsClient from '@/app/components/about-us/AboutUsClient';
import OurValues from '../components/about-us/OurValues';
import MilestonesTimeline from '../components/about-us/MilestonesTimeline';

export default function OurPhilosophy() {
  return (
    <>
      {/* <AboutTheBrand/>
      <AboutTheBrand />
      <BrandPhilosophy />
      <BrandPositioning/> */}
      {/* <MilestonesTimeline/> */}
      <AboutUsClient />
      <OurValues/>
    </>
  )
}
