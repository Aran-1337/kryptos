'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function HeroStats() {
  const [statsList, setStatsList] = useState([
    { value: '1,250+', label: 'طالب فهموا البرمجة' },
    { value: '4.9/5', label: 'متوسط تقييم الطلبة' },
    { value: '120+', label: 'ساعة شرح وتطبيق' },
    { value: '20+', label: 'مشروع عملي بتعمله' },
  ]);

  const calculateDynamicStats = () => {
    try {
      // 1. Calculate Average Rating from real approved student reviews
      let calculatedRating = '4.9/5';
      const approvedReviews = localStorage.getItem('approved_reviews');
      if (approvedReviews) {
        const revs = JSON.parse(approvedReviews);
        if (Array.isArray(revs) && revs.length > 0) {
          const sum = revs.reduce((acc: number, r: any) => acc + (r.rating || 5), 0);
          const avg = (sum / revs.length).toFixed(1);
          calculatedRating = `${avg}/5`;
        }
      }

      // 2. Check if Admin CMS has manual overrides or automatic dynamic calculation
      const savedCms = localStorage.getItem('cms_homepage_data');
      if (savedCms) {
        const parsed = JSON.parse(savedCms);
        if (parsed.heroStats && Array.isArray(parsed.heroStats)) {
          // If auto mode is enabled or default, inject live calculated rating
          const updated = parsed.heroStats.map((st: any, idx: number) => {
            if (idx === 1 && (!st.isManualOverride)) {
              return { ...st, value: calculatedRating };
            }
            return st;
          });
          setStatsList(updated);
          return;
        }
      }

      // Fallback dynamic list
      setStatsList([
        { value: '1,250+', label: 'طالب فهموا البرمجة' },
        { value: calculatedRating, label: 'متوسط تقييم الطلبة' },
        { value: '124+', label: 'ساعة شرح وتطبيق' },
        { value: '20+', label: 'مشروع عملي بتعمله' },
      ]);

    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    calculateDynamicStats();
    const handleUpdate = () => calculateDynamicStats();
    
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('cms_updated', handleUpdate);
    window.addEventListener('reviews_updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('cms_updated', handleUpdate);
      window.removeEventListener('reviews_updated', handleUpdate);
    };
  }, []);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%',
          marginTop: 40,
        }}
        className="hero-stats-strip"
      >
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', maxWidth: 820, alignItems: 'stretch' }}>
          {statsList.map((stat, i) => (
            <div key={i} className="stat-item" style={{ 
              textAlign: 'center', 
              flex: 1, 
              borderRight: i !== 0 ? '1px solid rgba(108,34,249,0.3)' : 'none',
              padding: '0 10px'
            }}>
              <h3 style={{ 
                fontSize: 'clamp(22px, 3vw, 36px)', 
                fontWeight: 900, 
                color: '#6C22F9', 
                marginBottom: 4,
                textAlign: 'center',
                direction: 'ltr'
              }}>
                {stat.value}
              </h3>
              <p style={{ fontSize: 'clamp(12px, 1.5vw, 15px)', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 900px) {
          .hero-stats-strip {
            margin-top: 24px !important;
          }
          .hero-stats-strip > div {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 12px !important;
          }
          .hero-stats-strip .stat-item {
            border-right: none !important;
            padding: 14px 8px !important;
            background: var(--bg);
            border: 1px solid var(--border) !important;
            border-radius: 14px;
          }
        }
      `}</style>
    </>
  );
}
