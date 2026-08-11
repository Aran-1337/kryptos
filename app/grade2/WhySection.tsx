'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaRocket, FaArrowLeft } from 'react-icons/fa';
import { BsStars } from 'react-icons/bs';
import { whyCards, progressSteps } from './data';

export default function WhySection() {
  return (
    <section style={{ padding: 'clamp(48px, 8vw, 88px) 0', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(108,99,255,0.3), transparent)' }} />
      <div style={{ position: 'absolute', top: '20%', right: '-100px', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '-80px', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container" style={{ paddingInline: 'clamp(16px, 4vw, 32px)' }}>

        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(36px, 6vw, 64px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.4 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20,
              background: 'linear-gradient(135deg, var(--primary-light), #e8e6ff)',
              border: '1.5px solid rgba(108,99,255,0.25)', borderRadius: 50,
              padding: '7px 20px', fontSize: 13, fontWeight: 800, color: 'var(--primary)',
              boxShadow: '0 2px 16px rgba(108,99,255,0.12)',
            }}
          >
            <BsStars size={13} />
            السبب الحقيقي
          </motion.div>

          <h2 style={{ fontSize: 'clamp(22px, 4vw, 42px)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 16, letterSpacing: '-0.5px' }}>
            ليه{' '}
            <span className="gradient-text">تانية ثانوي</span>
            {' '}مهمة؟
          </h2>
          <p style={{ fontSize: 'clamp(13px, 2vw, 15px)', color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto', lineHeight: 1.9 }}>
            تانية ثانوي هي مرحلة التعمق الحقيقي. الطالب اللي يتقن البرمجة والخوارزميات هنا، هيدخل تالتة ثانوي وهو جاهز للتخصص والتميز.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 'clamp(12px, 2vw, 20px)', marginBottom: 'clamp(40px, 7vw, 72px)' }}>
          {whyCards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                background: 'var(--surface)',
                border: '1.5px solid var(--border)',
                borderRadius: 20,
                padding: 'clamp(20px, 3vw, 28px) clamp(16px, 2.5vw, 24px)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(108,99,255,0.06)',
                transition: 'transform 0.28s, box-shadow 0.28s',
                cursor: 'default',
              }}
              whileHover={{ y: -6, boxShadow: '0 12px 36px rgba(108,99,255,0.14)' }}
            >
              <div style={{
                position: 'absolute', top: 20, left: 20,
                fontSize: 48, fontWeight: 900, lineHeight: 1,
                color: 'rgba(108,99,255,0.06)',
                fontFamily: 'monospace',
                userSelect: 'none',
              }}>
                {i + 1}
              </div>

              <div style={{
                position: 'absolute', top: 0, right: 0, left: 0, height: 3,
                background: `linear-gradient(90deg, transparent, ${c.bg === 'var(--primary-light)' ? 'rgba(108,99,255,0.5)' : c.bg === '#fef3c7' ? 'rgba(245,158,11,0.5)' : c.bg === '#d1fae5' ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)'}, transparent)`,
                borderRadius: '20px 20px 0 0',
              }} />

              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: c.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
                boxShadow: `0 4px 12px ${c.bg === 'var(--primary-light)' ? 'rgba(108,99,255,0.2)' : c.bg === '#fef3c7' ? 'rgba(245,158,11,0.2)' : c.bg === '#d1fae5' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
              }}>
                {c.icon}
              </div>

              <h3 style={{ fontSize: 'clamp(15px, 2vw, 17px)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 10 }}>{c.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.9, margin: 0 }}>{c.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55 }}
          style={{ marginBottom: 'clamp(32px, 5vw, 48px)' }}
        >
          <p style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 28, letterSpacing: 1, textTransform: 'uppercase' }}>
            رحلتك معانا
          </p>

          <div className="timeline-desktop" style={{ position: 'relative', alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'nowrap', gap: 0 }}>
            <div style={{
              position: 'absolute', top: 24, right: '10%', left: '10%', height: 2,
              background: 'linear-gradient(90deg, var(--primary-light), var(--primary), var(--primary-dark))',
              borderRadius: 2, zIndex: 0,
            }} />
            {progressSteps.map((s, i, arr) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', zIndex: 1 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: i === arr.length - 1
                      ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))'
                      : 'var(--surface)',
                    color: i === arr.length - 1 ? '#fff' : 'var(--primary)',
                    border: i === arr.length - 1 ? 'none' : '2px solid var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: 16,
                    boxShadow: i === arr.length - 1
                      ? '0 4px 20px rgba(108,99,255,0.45)'
                      : '0 2px 8px rgba(108,99,255,0.15)',
                  }}>
                    {s.num}
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 700,
                    color: i === arr.length - 1 ? 'var(--primary)' : 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                  }}>
                    {s.label}
                  </span>
                </motion.div>
                {i < arr.length - 1 && <div style={{ width: 48, flexShrink: 0 }} />}
              </div>
            ))}
          </div>

          <div className="timeline-mobile" style={{ flexDirection: 'column', alignItems: 'center', maxWidth: 300, margin: '0 auto' }}>
            {progressSteps.map((s, i, arr) => (
              <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', position: 'relative' }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 16, zIndex: 1, width: '100%' }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                    background: i === arr.length - 1
                      ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))'
                      : 'var(--surface)',
                    color: i === arr.length - 1 ? '#fff' : 'var(--primary)',
                    border: i === arr.length - 1 ? 'none' : '2px solid var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: 15,
                    boxShadow: i === arr.length - 1
                      ? '0 4px 20px rgba(108,99,255,0.45)'
                      : '0 2px 8px rgba(108,99,255,0.15)',
                  }}>
                    {s.num}
                  </div>
                  <span style={{
                    fontSize: 14, fontWeight: 700,
                    color: i === arr.length - 1 ? 'var(--primary)' : 'var(--text-muted)',
                  }}>
                    {s.label}
                  </span>
                </motion.div>

                {/* Vertical Line aligned with center of circle */}
                {i < arr.length - 1 && (
                  <div style={{
                    width: 2, height: 28,
                    background: 'linear-gradient(180deg, var(--primary), var(--primary-light))',
                    marginRight: 21,
                    marginTop: 4,
                    marginBottom: 4,
                    zIndex: 0
                  }} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55 }}
          style={{
            position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg, #16133a 0%, #2d2870 50%, #1e1b5e 100%)',
            borderRadius: 'clamp(16px, 3vw, 24px)',
            padding: 'clamp(28px, 5vw, 44px) clamp(20px, 4vw, 32px)',
            textAlign: 'center',
            boxShadow: '0 16px 48px rgba(22,19,58,0.3)',
          }}
        >
          <div style={{ position: 'absolute', top: 20, right: 32, opacity: 0.3 }}>
            <BsStars size={40} color="#fff" />
          </div>
          <div style={{ position: 'absolute', bottom: 20, left: 32, opacity: 0.15 }}>
            <BsStars size={60} color="#fff" />
          </div>
          <div style={{ position: 'absolute', top: '-40%', left: '50%', transform: 'translateX(-50%)', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <motion.div
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.2 }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 50, padding: '5px 16px', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: 20 }}>
              <BsStars size={11} />
              لا تفوّت الفرصة
            </div>

            <p style={{ fontSize: 'clamp(15px, 3vw, 22px)', fontWeight: 900, color: '#fff', marginBottom: 10, lineHeight: 1.5 }}>
              تانية ثانوي مش سنة عادية…
            </p>
            <p style={{ fontSize: 'clamp(13px, 2vw, 15px)', color: 'rgba(255,255,255,0.65)', marginBottom: 28 }}>
              دي السنة اللي بتعمق فهمك وبتحدد مسارك في تالتة ثانوي والجامعة.
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block' }}>
              <Link href="/courses?grade=2" className="btn btn-lg" style={{
                background: '#fff', color: 'var(--primary)',
                gap: 9, fontWeight: 800,
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              }}>
                <FaRocket size={15} />
                ابدأ دلوقتي
                <FaArrowLeft size={13} />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>

      <style>{`
        .timeline-desktop { display: flex !important; }
        .timeline-mobile { display: none !important; }
        @media (max-width: 640px) {
          .timeline-desktop { display: none !important; }
          .timeline-mobile { display: flex !important; }
        }
      `}</style>
    </section>
  );
}
