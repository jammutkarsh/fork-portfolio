import Hero from '@/components/Hero';
import SectionContainer from '@/components/SectionContainer';
import { Suspense } from 'react';

export default function Page() {
  return (
    <>
      <Hero />
      <SectionContainer>
        <Suspense fallback="loading.."></Suspense>
      </SectionContainer>
    </>
  );
}
