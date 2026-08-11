'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaRocket, FaCode, FaArrowLeft } from 'react-icons/fa';
import { BsStars } from 'react-icons/bs';
import { curriculumItems } from './data';

export default function CurriculumSection() {
  return (
    <section style={{ padding: 'clamp(48px, 8vw, 88px) 0', background: 'var(--surface)', position: 'relative', overflow: 'hidden' }}>

      {/* Top border line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(108,99,255,0.3), transparent)' }} />

      {/* Background blobs */}
      <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container" style={{ paddingInline: 'clamp(16px, 4vw, 32px)' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(36px, 6vw, 60px)' }}
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
            <FaCode size={12} />
            المنهج الدراسي
          </motion.div>

          <h2 style={{ fontSize: 'clamp(22px, 4vw, 42px)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 16, letterSpacing: '-0.5px' }}>
            هنتعلم إيه في{' '}
            <span className="gradient-text">أولى ثانوي؟</span>
          </h2>
          <p style={{ fontSize: 'clamp(13px, 2vw, 15px)', color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto', lineHeight: 1.9 }}>
            في أولى ثانوي، الطالب يبدأ يتعرف على أساسيات التكنولوجيا والمعلومات والبرمجة بطريقة مناسبة لسنّه ومستواه.
          </p>
        </motion.div>

        {/* Count badge */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}
        >
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {curriculumItems.length} وحدة دراسية
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </motion.div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))', gap: 'clamp(10px, 2vw, 16px)', marginBottom: 'clamp(36px, 6vw, 56px)' }}>
          {curriculumItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: (i % 4) * 0.07 }}
              whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(108,99,255,0.12)' }}
              style={{
                background: 'var(--bg)',
                border: '1.5px solid var(--border)',
                borderRadius: 18,
                padding: 'clamp(16px, 2.5vw, 20px) clamp(14px, 2vw, 18px)',
                display: 'flex', flexDirection: 'column', gap: 12,
                position: 'relative', overflow: 'hidden',
                transition: 'transform 0.25s, box-shadow 0.25s',
                cursor: 'default',
              }}
            >
              {/* Left accent bar */}
              <div style={{
                position: 'absolute', top: 0, bottom: 0, right: 0, width: 3,
                background: item.bg,
                borderRadius: '0 18px 18px 0',
              }} />

              {/* Icon + Tag row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 13,
                  background: item.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: `0 3px 10px ${item.bg === 'var(--primary-light)' ? 'rgba(108,99,255,0.18)' : 'rgba(0,0,0,0.07)'}`,
                }}>
                  {item.icon}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 800,
                  background: item.bg, color: item.color,
                  padding: '4px 12px', borderRadius: 50,
                  border: `1px solid ${item.color}22`,
                }}>
                  {item.tag}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6, lineHeight: 1.5 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.85, margin: 0 }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55 }}
          style={{
            position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg, #16133a 0%, #2d2870 55%, #1e1b5e 100%)',
            borderRadius: 'clamp(16px, 3vw, 24px)',
            padding: 'clamp(28px, 5vw, 48px) clamp(20px, 4vw, 32px)',
            textAlign: 'center',
            boxShadow: '0 16px 48px rgba(22,19,58,0.28)',
          }}
        >
          <div style={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 24, right: 36, opacity: 0.25 }}>
            <BsStars size={44} color="#fff" />
          </div>
          <div style={{ position: 'absolute', bottom: 20, left: 36, opacity: 0.12 }}>
            <BsStars size={64} color="#fff" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.2 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 50, padding: '5px 16px',
              fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.8)',
              marginBottom: 20,
            }}>
              <FaCode size={11} />
              من الوعي الرقمي للبرمجة
            </div>

            <p style={{ fontSize: 'clamp(15px, 3vw, 22px)', fontWeight: 900, color: '#fff', marginBottom: 10, lineHeight: 1.5 }}>
              من التكنولوجيا اللي حواليك…
            </p>
            <p style={{ fontSize: 'clamp(13px, 2vw, 15px)', color: 'rgba(255,255,255,0.65)', marginBottom: 32 }}>
              إلى أول خطوة في البرمجة — رحلة كاملة من الوعي الرقمي لحد كتابة أول كود Python
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block' }}>
              <Link href="/courses?grade=1" className="btn btn-lg" style={{
                background: '#fff', color: 'var(--primary)',
                gap: 9, fontWeight: 800,
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              }}>
                <FaRocket size={15} />
                ابدأ الكورس
                <FaArrowLeft size={13} />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
