'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import './HeroSection.css';
import { FaRocket, FaBook, FaBrain, FaChartLine } from 'react-icons/fa';
import { MdPlayLesson, MdOutlineTrackChanges } from 'react-icons/md';
import { motion } from 'framer-motion';
import HeroStats from './HeroStats';

const miniCards = [
  { icon: <FaBook size={22} color="var(--primary)" />, label: 'محتوى حديث' },
  { icon: <MdPlayLesson size={22} color="#f59e0b" />, label: 'شرح مبسط' },
  { icon: <FaBrain size={22} color="#10b981" />, label: 'تطبيق عملي' },
  { icon: <MdOutlineTrackChanges size={22} color="#ef4444" />, label: 'متابعة مستمرة' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const defaultHeroContent = {
  badge: 'المقاعد محدودة — احجز مكانك الآن ⚡️',
  titleLine1: 'ابدأ رحلتك في البرمجة',
  titleHighlight: 'بطريقتك الخاصة',
  subtitle: 'تعلم البرمجة والذكاء الاصطناعي خطوة بخطوة بلغة بسيطة ومنهج عملي. انطلق نحو مهارات عالية ومشاريع تصنع فرقاً.'
};

export default function HeroSection() {
  const [heroContent, setHeroContent] = useState(defaultHeroContent);

  const loadCmsHero = () => {
    try {
      const saved = localStorage.getItem('cms_homepage_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.heroHeader) {
          setHeroContent(parsed.heroHeader);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCmsHero();
    const handleCmsUpdate = () => loadCmsHero();
    window.addEventListener('storage', handleCmsUpdate);
    window.addEventListener('cms_updated', handleCmsUpdate);
    return () => {
      window.removeEventListener('storage', handleCmsUpdate);
      window.removeEventListener('cms_updated', handleCmsUpdate);
    };
  }, []);

  return (
    <section className="hero-section" style={{
      position: 'relative',
      minHeight: 'calc(100svh - 68px)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Background */}
      <div className="hero-bg" style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/ss.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
      }} />
      
      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(255,255,255,0.15)',
      }} className="hero-overlay" />

      {/* Aligned Container - Shifted Right */}
      <div className="hero-container" style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', alignItems: 'center', width: '100%', paddingRight: '5vw', paddingLeft: '24px' }}>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="hero-content"
        >
          <motion.div variants={fadeUp} className="hero-badge">
            <span className="hero-badge-dot" />
            {heroContent.badge}
          </motion.div>

          <motion.h1 variants={fadeUp} className="hero-title">
            <span style={{ display: 'block', color: 'var(--text-main)' }}>{heroContent.titleLine1}</span>
            <span style={{
              display: 'block',
              background: 'linear-gradient(135deg, #6C22F9, #3b0099)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>{heroContent.titleHighlight}</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="hero-desc">
            {heroContent.subtitle}
          </motion.p>

          <motion.div variants={fadeUp} className="hero-btns">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} style={{ display: 'contents' }}>
              <Link href="/courses" className="btn btn-primary btn-lg" style={{ gap: 10 }}>
                <FaRocket size={18} />
                ابدأ التعلم الآن
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} style={{ display: 'contents' }}>
              <Link href="/courses" className="btn btn-outline btn-lg" style={{ gap: 10 }}>
                <FaChartLine size={18} />
                تصفح الكورسات
              </Link>
            </motion.div>
          </motion.div>

          <motion.div variants={container} className="hero-cards">
            {miniCards.map(({ icon, label }) => (
              <motion.div
                key={label}
                variants={cardVariant}
                whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(108,34,249,0.18)' }}
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(108,34,249,0.2)',
                  borderRadius: 14,
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: '#000',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'default',
                  flexShrink: 0,
                }}
              >
                {icon}
                {label}
              </motion.div>
            ))}
          </motion.div>

          <HeroStats />
        </motion.div>
      </div>
    </section>
  );
}
