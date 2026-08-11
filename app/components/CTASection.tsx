'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Rocket } from 'lucide-react';

const defaultCta = {
  title: 'مستعد تبدأ رحلتك في عالم البرمجة؟',
  subtitle: 'انضم لآلاف الطلاب اللي غيروا مستقبلهم معانا. مفيش وقت أنسب من دلوقتي عشان تستثمر في نفسك وتتعلم مهارات المستقبل.',
  buttonText: 'أنشئ حسابك مجاناً'
};

export default function CTASection() {
  const [ctaData, setCtaData] = useState(defaultCta);

  const loadCmsCta = () => {
    try {
      const saved = localStorage.getItem('cms_homepage_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.cta) {
          setCtaData(parsed.cta);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCmsCta();
    const handleCmsUpdate = () => loadCmsCta();
    window.addEventListener('storage', handleCmsUpdate);
    window.addEventListener('cms_updated', handleCmsUpdate);
    return () => {
      window.removeEventListener('storage', handleCmsUpdate);
      window.removeEventListener('cms_updated', handleCmsUpdate);
    };
  }, []);

  return (
    <section style={{ padding: '100px 24px', background: 'var(--bg)', borderTop: '1px solid var(--border)', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      <div className="container" style={{ margin: '0 auto', maxWidth: 1000 }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'linear-gradient(135deg, #16133a 0%, #2a1b54 100%)',
            borderRadius: 32,
            padding: '64px 40px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(22,19,58,0.2)'
          }}
        >
          {/* Decorative elements */}
          <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, background: 'radial-gradient(circle, rgba(108,34,249,0.3) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: -50, left: -50, width: 300, height: 300, background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)', borderRadius: '50%' }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
            }}>
              <Rocket size={32} color="#fff" />
            </div>
            
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, color: '#fff', margin: '0 0 20px', lineHeight: 1.3 }}>
              {ctaData.title}
            </h2>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.8 }}>
              {ctaData.subtitle}
            </p>
            
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" style={{
                background: '#6C22F9', color: '#fff', padding: '16px 40px', borderRadius: 16,
                fontSize: 18, fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10,
                boxShadow: '0 10px 30px rgba(108,34,249,0.3)', transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {ctaData.buttonText.replace('←', '').replace('→', '').trim()}
                <ArrowLeft size={20} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
