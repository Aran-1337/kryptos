'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShieldCheck, Award, Users, Code, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'طالب وطالبة', value: '+10,000' },
    { label: 'ساعة تدريبية', value: '+500' },
    { label: 'نسبة النجاح والتفوق', value: '99%' },
    { label: 'مشروع تخرج محترف', value: '+1,200' },
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '60px 0', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      <div className="container">
        
        {/* Hero About */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'center', marginBottom: 80 }}>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            <span style={{ background: 'rgba(108,34,249,0.1)', color: '#6C22F9', padding: '6px 16px', borderRadius: 20, fontSize: 14, fontWeight: 800 }}>
              🚀 من نحن
            </span>
            <h1 style={{ fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 900, color: '#16133a', margin: '20px 0', lineHeight: 1.3 }}>
              أول منصة تعليمية متخصصة في البرمجة والذكاء الاصطناعي لطلاب الثانوية
            </h1>
            <p style={{ fontSize: 16, color: '#4b5563', lineHeight: 1.9, marginBottom: 28 }}>
              هدفنا تمكين جيل جديد من الطلاب العربي لاحتراف تكنولوجيا المستقبل وتزويدهم بالمهارات العملية والذهنية للوصول لأعلى المستويات الأكاديمية والمهنية.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['منهج مطابق للتحديثات الوزارية الحديثة', 'تطبيقات عملي وشرح خوارزميات خطوة بخطوة', 'دعم فني ومتابعة مستمرة مع ولي الأمر والطالب'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 700, color: '#16133a' }}>
                  <CheckCircle size={18} color="#10b981" /> {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ position: 'relative', height: 400, borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <Image src="/hero1.webp" alt="حول المنصة" fill style={{ objectFit: 'cover' }} />
          </motion.div>
        </div>

        {/* Stats */}
        <div style={{ background: 'linear-gradient(135deg, rgba(15,10,50,0.95) 0%, rgba(108,34,249,0.85) 100%)', borderRadius: 24, padding: '48px 32px', color: '#fff', marginBottom: 80 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, textAlign: 'center' }}>
            {stats.map((stat, i) => (
              <div key={i}>
                <h3 style={{ fontSize: 36, fontWeight: 900, marginBottom: 4 }}>{stat.value}</h3>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', margin: 0, fontWeight: 600 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
