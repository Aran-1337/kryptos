'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaPlay } from 'react-icons/fa';
import { BsStars, BsShieldCheck } from 'react-icons/bs';
import { features } from './data';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

const fadeIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: 'easeOut' as const } },
};

export default function HeroSection() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #16133a 0%, #2d2870 50%, #1e1b5e 100%)',
      padding: 'clamp(50px, 8vw, 90px) 0',
      direction: 'rtl',
      overflow: 'hidden',
      position: 'relative',
      color: '#fff',
    }}>

      {/* Decorative Glowing Ambient Lights */}
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container" style={{ maxWidth: 1280, margin: '0 auto', paddingInline: 'clamp(20px, 4vw, 40px)', position: 'relative', zIndex: 1 }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
          gap: 'clamp(36px, 6vw, 72px)',
          alignItems: 'center',
        }}>

          {/* ── Right: Text Content ── */}
          <motion.div variants={container} initial="hidden" animate="show">

            {/* Badge */}
            <motion.div variants={fadeUp} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: 50, padding: '7px 20px',
              fontSize: 13, fontWeight: 800, color: '#fff',
              marginBottom: 24,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}>
              <BsStars size={15} color="#f59e0b" />
              دفعة تانية ثانوي — 2026 / 2027
            </motion.div>

            {/* Title */}
            <motion.h1 variants={fadeUp} style={{
              fontSize: 'clamp(32px, 5.5vw, 62px)',
              fontWeight: 900, lineHeight: 1.3, marginBottom: 16,
              letterSpacing: '-0.5px'
            }}>
              <span style={{ display: 'block', color: '#fff' }}>تانية ثانوي</span>
              <span style={{
                display: 'block',
                background: 'linear-gradient(135deg, #a78bfa 0%, #38bdf8 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                Programming &amp; AI
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={fadeUp} style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'rgba(255, 255, 255, 0.95)', fontWeight: 800, marginBottom: 14,
            }}>
              كملت أولى ثانوي؟ دلوقتي وقت التعمق الحقيقي في البرمجة والذكاء الاصطناعي!
            </motion.p>

            {/* Description */}
            <motion.p variants={fadeUp} style={{
              fontSize: 'clamp(14px, 1.5vw, 16px)',
              color: 'rgba(255, 255, 255, 0.75)', fontWeight: 500,
              lineHeight: 1.95, marginBottom: 36, maxWidth: 560
            }}>
              مرحلة احتراف خوارزميات Python وتطبيقات الذكاء الاصطناعي المتقدمة من خلال مشاريع برمجية حقيقية تبني بيها مستقبلك وتضمن تفوقك الدراسي والجامعي.
            </motion.p>

            {/* Action Buttons */}
            <motion.div variants={fadeUp} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 40 }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link href="/grade2/start" className="btn btn-lg" style={{
                  background: 'linear-gradient(135deg, #6C22F9, #4f46e5)',
                  color: '#fff', border: 'none', gap: 10, fontWeight: 900,
                  boxShadow: '0 8px 28px rgba(108,34,249,0.45)', padding: '14px 32px', borderRadius: 14
                }}>
                  <FaPlay size={14} />
                  ابدأ الكورس الآن
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <a href="https://wa.me/" target="_blank" rel="noreferrer" className="btn btn-lg" style={{
                  background: '#25D366', color: '#fff', border: 'none', gap: 10, fontWeight: 800,
                  boxShadow: '0 8px 24px rgba(37,211,102,0.35)', padding: '14px 28px', borderRadius: 14
                }}>
                  <FaWhatsapp size={20} />
                  تواصل عبر الواتساب
                </a>
              </motion.div>
            </motion.div>

            {/* Feature tags */}
            <motion.div variants={fadeUp} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {features.map(({ icon, label }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: 12, padding: '8px 16px',
                  fontSize: 13, fontWeight: 700, color: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(8px)',
                }}>
                  {icon}
                  {label}
                </div>
              ))}
            </motion.div>

          </motion.div>

          {/* ── Left: Full-Bleed Framed Hero Showcase ── */}
          <motion.div variants={fadeIn} initial="hidden" animate="show" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            
            {/* Main Showcase Image Container */}
            <div style={{
              position: 'relative', width: '100%', maxWidth: 580, aspectRatio: '16/11',
              borderRadius: 28, overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
              border: '3px solid rgba(255, 255, 255, 0.2)',
            }}>
              <Image
                src="/th2.webp"
                alt="تانية ثانوي - Programming & AI"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(22,19,58,0.7) 0%, transparent 50%)' }} />
            </div>

            {/* Floating Badge Top-Right */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', top: -16, right: -10, zIndex: 10,
                background: '#fff', color: '#16133a', padding: '10px 18px', borderRadius: 16,
                boxShadow: '0 12px 32px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0',
                display: 'flex', alignItems: 'center', gap: 8, fontWeight: 900, fontSize: 13
              }}
            >
              <BsStars color="#f59e0b" size={18} />
              ⭐️ 5.0/5 كورس متقدم
            </motion.div>

            {/* Floating Badge Bottom-Left */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              style={{
                position: 'absolute', bottom: -16, left: -10, zIndex: 10,
                background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', padding: '10px 18px', borderRadius: 16,
                boxShadow: '0 12px 32px rgba(16,185,129,0.35)',
                display: 'flex', alignItems: 'center', gap: 8, fontWeight: 900, fontSize: 13
              }}
            >
              <BsShieldCheck size={18} />
              👨‍🎓 +1,890 طالب مشترك
            </motion.div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
