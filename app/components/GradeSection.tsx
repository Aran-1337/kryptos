'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaGraduationCap, FaCode, FaBrain } from 'react-icons/fa';
import { getAcademicGrades, AcademicGrade } from '../utils/academicGrades';

export default function GradeSection() {
  const [activeGrades, setActiveGrades] = useState<AcademicGrade[]>([]);

  const loadGrades = () => {
    const all = getAcademicGrades();
    setActiveGrades(all.filter(g => g.active));
  };

  useEffect(() => {
    loadGrades();
    window.addEventListener('academic_grades_updated', loadGrades);
    return () => window.removeEventListener('academic_grades_updated', loadGrades);
  }, []);

  if (activeGrades.length === 0) return null;

  return (
    <section style={{ background: 'linear-gradient(180deg, var(--bg) 0%, #eeeeff55 100%)', padding: '90px 0' }}>
      <div className="container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <span className="badge badge-primary" style={{ fontSize: 13, marginBottom: 16 }}>
            <FaGraduationCap size={13} />
            الصفوف الدراسية
          </span>
          <h2 className="section-title" style={{ fontSize: 'clamp(26px, 4vw, 42px)', marginBottom: 12 }}>
            اختر <span className="gradient-text">صفك الدراسي</span>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto' }}>
            ابدأ رحلة التفوق مع محتوى تعليمي مصمم خصيصًا ليك.
          </p>
        </motion.div>

        {/* Dynamic Active Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
          {activeGrades.map((grade, i) => (
            <motion.div
              key={grade.id || grade.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              style={{
                position: 'relative',
                height: 480,
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(108,34,249,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.04)';
              }}
            >
              {/* Background Image */}
              <Image
                src={grade.img}
                alt={grade.name}
                fill
                style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                className="grade-card-img"
              />

              {/* Gradient Overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(15,10,50,0.85) 0%, rgba(15,10,50,0.4) 55%, rgba(15,10,50,0.05) 100%)',
              }} />

              {/* Top Tag */}
              <div style={{
                position: 'absolute', top: 20, right: 20,
                background: 'rgba(108,34,249,0.85)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: 99,
                fontSize: 13,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <FaCode size={14} />
                <span>المرحلة الدراسية</span>
              </div>

              {/* Content */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: 32, color: '#fff',
                display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                <h3 style={{ fontSize: 26, fontWeight: 900, margin: 0, color: '#fff' }}>
                  {grade.name}
                </h3>

                <h4 style={{ fontSize: 16, fontWeight: 700, color: '#a78bfa', margin: 0 }}>
                  {grade.subtitle}
                </h4>

                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.7 }}>
                  {grade.desc}
                </p>

                <Link
                  href={grade.href}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: '#fff',
                    color: '#6C22F9',
                    padding: '12px 24px',
                    borderRadius: 14,
                    fontWeight: 800,
                    fontSize: 14,
                    textDecoration: 'none',
                    marginTop: 8,
                    width: 'fit-content',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    transition: 'gap 0.2s ease, background 0.2s ease',
                  }}
                >
                  <span>استكشف الكورسات</span>
                  <FaArrowLeft size={13} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
