'use client';

import HeroSection from './HeroSection';
import WhySection from './WhySection';
import CurriculumSection from './CurriculumSection';

export default function Grade2Page() {
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', direction: 'rtl' }}>
      <HeroSection />
      <WhySection />
      <CurriculumSection />
    </main>
  );
}
