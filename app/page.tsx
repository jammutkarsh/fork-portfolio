import Hero from '@/components/Hero';
import { ScrollProvider } from '@/components/Providers/ScrollProvider';
import SectionContainer from '@/components/SectionContainer';
import { Suspense } from 'react';

export default function Page() {
  return (
    <ScrollProvider>
      <Hero />
      <SectionContainer>
        <Suspense fallback="loading.."></Suspense>
      </SectionContainer>
    </ScrollProvider>
  );
}
