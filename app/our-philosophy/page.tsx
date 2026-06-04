
import { Metadata } from 'next';
import AboutUsClient from '@/app/components/about-us/AboutUsClient';
import AboutTheBrand from '@/app/components/about-us/AboutTheBrand';
import BrandPhilosophy from '../components/about-us/BrandPhilosophy';
import BrandPositioning from '../components/about-us/BrandPositioning';

export default function OurPhilosophy() {
  return (
    <>
      <AboutTheBrand/>
      <BrandPhilosophy />
      <BrandPositioning/>
      {/* <AboutUsClient /> */}
    </>
  )
}
