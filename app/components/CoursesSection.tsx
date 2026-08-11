'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Star, Clock, Users, ArrowLeft } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: 'مقدمة في البرمجة باستخدام Python',
    category: 'أساسيات البرمجة',
    image: '/th1.webp',
    rating: 4.9,
    students: 1250,
    duration: '١٢ ساعة',
    price: 'مجاناً',
    level: 'مبتدئ'
  },
  {
    id: 2,
    title: 'تطبيقات الذكاء الاصطناعي في الواقع',
    category: 'الذكاء الاصطناعي',
    image: '/th2.webp',
    rating: 4.8,
    students: 840,
    duration: '٢٤ ساعة',
    price: '٤٥٠ ج.م',
    level: 'متوسط'
  },
  {
    id: 3,
    title: 'بناء مواقع الويب الحديثة (Front-End)',
    category: 'تطوير الويب',
    image: '/hero1.webp',
    rating: 5.0,
    students: 2100,
    duration: '٣٦ ساعة',
    price: '٦٠٠ ج.م',
    level: 'متقدم'
  }
];

export default function CoursesSection() {
  return (
    <section style={{ padding: '100px 0', background: '#f8f9fa', direction: 'rtl' }}>
      <div className="container" style={{ margin: '0 auto', maxWidth: 1200, padding: '0 24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 60, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(108,34,249,0.1)', color: '#6C22F9',
                padding: '6px 16px', borderRadius: 30, fontSize: 14, fontWeight: 700, marginBottom: 16
              }}>
              <BookOpen size={16} /> أحدث الكورسات
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#16133a', margin: 0 }}>
              استكشف <span style={{ color: '#6C22F9' }}>مساراتك التعليمية</span>
            </motion.h2>
          </div>
          <Link href="/courses" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            color: '#16133a', fontWeight: 700, textDecoration: 'none',
            fontSize: 15, transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = '#6C22F9'}
          onMouseOut={(e) => e.currentTarget.style.color = '#16133a'}
          >
            عرض كل الكورسات <ArrowLeft size={16} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 32
        }}>
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              style={{
                background: '#fff',
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
                border: '1px solid rgba(108,34,249,0.08)',
                display: 'flex', flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(108,34,249,0.12)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.04)';
              }}
            >
              <div style={{ position: 'relative', height: 220, width: '100%' }}>
                <Image src={course.image} alt={course.title} fill style={{ objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)',
                  padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700, color: '#6C22F9'
                }}>
                  {course.category}
                </div>
              </div>

              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#6b7280', marginBottom: 12, fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={14} /> {course.duration}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={14} /> {course.students} طالب</span>
                </div>
                
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#16133a', marginBottom: 16, lineHeight: 1.4 }}>
                  {course.title}
                </h3>
                
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f3f4f6', paddingTop: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Star size={16} fill="#f59e0b" color="#f59e0b" />
                    <span style={{ fontWeight: 800, color: '#16133a' }}>{course.rating}</span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#6C22F9' }}>
                    {course.price}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
