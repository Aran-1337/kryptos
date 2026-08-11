'use client';
import { use } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Award, Download, Share2, CheckCircle2, ShieldCheck, ArrowRight, QrCode } from 'lucide-react';

export default function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);

  const certData = {
    id: 'MN-2026-9842',
    studentName: 'أحمد محمود العبد',
    courseTitle: 'كورس البرمجة والخوارزميات الشامل (أولى ثانوي)',
    grade: 'الدرجة النهائية: 95% (ممتاز مرتفع)',
    issueDate: '06 أغسطس 2026',
    instructor: 'م. عبدالرحمن حامد',
    verifyUrl: `http://localhost:3000/certificates/${unwrappedParams.id}`
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f0a28', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Tajawal, sans-serif', direction: 'rtl', color: '#fff' }}>
      
      {/* Top Header Controls */}
      <div style={{ maxWidth: 900, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
          <ArrowRight size={16} /> العودة للوحة الطالب
        </Link>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#6C22F9', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(108,34,249,0.4)' }}>
            <Download size={16} /> طباعة / تحميل الشهادة PDF
          </button>
        </div>
      </div>

      {/* Certificate Frame */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        style={{
          width: '100%', maxWidth: 900, background: '#ffffff', color: '#16133a', borderRadius: 24, padding: '48px 40px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)', border: '12px solid #6C22F9', position: 'relative', overflow: 'hidden'
        }}
      >
        {/* Decorative Corners */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, background: 'linear-gradient(135deg, #6C22F9 0%, transparent 70%)', opacity: 0.15 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 120, height: 120, background: 'linear-gradient(315deg, #6C22F9 0%, transparent 70%)', opacity: 0.15 }} />

        {/* Certificate Header Logo & Seal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: 24, marginBottom: 32 }}>
          <Image src="/Logo-cropped.png" alt="Platform Logo" width={180} height={40} style={{ objectFit: 'contain' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ecfdf5', color: '#10b981', border: '1px solid #a7f3d0', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 800 }}>
            <ShieldCheck size={16} /> شهادة موثقة ورسمية
          </div>
        </div>

        {/* Main Body Text */}
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: '#6C22F9', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
            CERTIFICATE OF COMPLETION • شهادة إتمام كورس
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, color: '#16133a', margin: '0 0 16px', fontFamily: 'Tajawal, sans-serif' }}>
            شهـادة تقـديـر وتـميّـز
          </h1>
          <p style={{ fontSize: 16, color: '#64748b', marginBottom: 24 }}>تشهد منصة المهندس للبرمجة والعلوم أن الطالب:</p>

          {/* Student Name Display */}
          <div style={{ display: 'inline-block', borderBottom: '3px solid #6C22F9', paddingBottom: 8, marginBottom: 24 }}>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, color: '#6C22F9', margin: 0 }}>
              {certData.studentName}
            </h2>
          </div>

          <p style={{ fontSize: 16, color: '#475569', maxWidth: 650, margin: '0 auto 32px', lineHeight: 1.8 }}>
            قد أتم بنجاح واقتدار دراسة وتطبيق كافة متطلبات وتدريبات:
            <br />
            <strong style={{ color: '#16133a', fontSize: 18 }}>{certData.courseTitle}</strong>
            <br />
            وحصل على التقييم العام: <span style={{ color: '#10b981', fontWeight: 900 }}>{certData.grade}</span>
          </p>
        </div>

        {/* Footer Signatures & QR Code Verification */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 24, borderTop: '2px solid #f1f5f9', marginTop: 16 }}>
          
          {/* Instructor Signature */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 4px', fontWeight: 700 }}>محاضر الكورس</p>
            <p style={{ fontSize: 16, fontWeight: 900, color: '#16133a', margin: 0 }}>{certData.instructor}</p>
            <div style={{ marginTop: 8, fontSize: 12, color: '#6C22F9', fontWeight: 800, fontStyle: 'italic' }}>توقيع م اعتماد الإلكتروني ✓</div>
          </div>

          {/* Golden Medal Badge */}
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)' }}>
            <Award size={36} />
          </div>

          {/* QR Code Verification */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>
              <QrCode size={56} color="#16133a" />
            </div>
            <p style={{ fontSize: 11, color: '#64748b', margin: 0, fontWeight: 700 }}>رمز التحقق: {certData.id}</p>
          </div>

        </div>

      </motion.div>

    </div>
  );
}
