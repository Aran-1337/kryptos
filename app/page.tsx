'use client';
import HeroSection from './components/HeroSection';
import CoursesSection from './components/CoursesSection';
import WhyBetterSection from './components/WhyBetterSection';
import GradeSection from './components/GradeSection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import CTASection from './components/CTASection';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <WhyBetterSection />
      <CoursesSection />
      <GradeSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
