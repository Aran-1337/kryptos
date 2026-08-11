'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Download, Printer, CheckCircle2, ShieldCheck, Sparkles, X, ExternalLink } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function CertificatesPage() {
  const searchParams = useSearchParams();
  const isNewClaim = searchParams.get('new') === 'true';

  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [showCelebrationToast, setShowCelebrationToast] = useState(isNewClaim);

  const certificates = [
    {
      id: 'CERT-2026-001',
      title: 'شهادة إتمام كورس البرمجة والذكاء الاصطناعي (أولى ثانوي)',
      courseName: 'كورس البرمجة والذكاء الاصطناعي - أولى ثانوي',
      studentName: 'أحمد محمود العبد',
      date: '08 أغسطس 2026',
      grade: 'ممتاز مرتفع 🌟',
      instructor: 'م. عبدالرحمن حامد',
      hours: '35 ساعة دراسية وتطبيقية'
    },
    {
      id: 'CERT-2026-002',
      title: 'شهادة اجتياز اختبار الخوارزميات وبايثون',
      courseName: 'دورة الخوارزميات وبايثون المتقدمة',
      studentName: 'أحمد محمود العبد',
      date: '15 يوليو 2026',
      grade: 'ممتاز 🌟',
      instructor: 'م. عبدالرحمن حامد',
      hours: '20 ساعة دراسية وتطبيقية'
    }
  ];

  const handlePrintCertificate = (cert: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>شهادة إتمام - ${cert.studentName}</title>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap" rel="stylesheet">
        <style>
          @page { size: A4 landscape; margin: 0; }
          body {
            margin: 0; padding: 40px; font-family: 'Tajawal', sans-serif;
            background: #fff; color: #16133a; direction: rtl; box-sizing: border-box;
          }
          .cert-border {
            border: 12px double #6C22F9; padding: 40px; height: 82vh;
            display: flex; flex-direction: column; justify: space-between;
            position: relative; background: radial-gradient(circle, rgba(108,34,249,0.02) 0%, transparent 70%);
          }
          .header { text-align: center; }
          .header h1 { font-size: 38px; color: #6C22F9; margin: 0 0 10px; font-weight: 900; }
          .header h2 { font-size: 20px; color: #64748b; margin: 0; font-weight: 700; }
          .body-content { text-align: center; margin: 30px 0; }
          .student-name { font-size: 34px; font-weight: 900; color: #16133a; border-bottom: 2px solid #6C22F9; display: inline-block; padding-bottom: 6px; margin: 15px 0; }
          .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px; }
          .seal { text-align: center; border: 2px dashed #6C22F9; padding: 10px 20px; border-radius: 12px; color: #6C22F9; font-weight: 900; font-size: 13px; }
          @media print {
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="cert-border">
          <div class="header">
            <h1 style="color: #6C22F9;">🎓 شهادة تقدير وإتمام كورس معتمدة</h1>
            <h2>منصة المهندس عبدالرحمن حامد للبرمجة والذكاء الاصطناعي</h2>
          </div>

          <div class="body-content">
            <p style="font-size: 18px; color: #475569;">تشهد المنصة بأن الطالب المتميز:</p>
            <div class="student-name">${cert.studentName}</div>
            <p style="font-size: 18px; color: #475569; max-width: 700px; margin: 15px auto; line-height: 1.8;">
              قد أتم بنجاح كافة متطلبات <strong>[ ${cert.courseName} ]</strong> بواقع (${cert.hours}) واجتاز الاختبار الشامل والتطبيقات البرمجية بتقدير ممتاز (<strong>${cert.grade}</strong>).
            </p>
          </div>

          <div class="footer">
            <div>
              <p style="margin: 0; font-size: 13px; color: #64748b;">تاريخ الإصدار: <strong>${cert.date}</strong></p>
              <p style="margin: 4px 0 0; font-size: 13px; color: #64748b;">رقم المسلسل الموثق: <strong>${cert.id}</strong></p>
            </div>
            <div class="seal">
              ختم التوثيق والتفوق 🏅<br>
              معتمد أونلاين
            </div>
            <div style="text-align: left;">
              <p style="margin: 0; font-size: 14px; font-weight: 900;">توقيع المحاضر والمهندس:</p>
              <p style="margin: 4px 0 0; font-size: 16px; font-weight: 900; color: #6C22F9;">${cert.instructor}</p>
            </div>
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* Toast notification for newly claimed certificate */}
      <AnimatePresence>
        {showCelebrationToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff',
              padding: '16px 24px', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              boxShadow: '0 10px 30px rgba(16,185,129,0.3)', border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Award size={28} />
              <div>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>🎉 ألف مبروك! تم إصدار وتوثيق شهادتك الجديدة بنجاح!</h4>
                <p style={{ margin: 0, fontSize: 13, opacity: 0.9 }}>يمكنك الآن تحميلها أو طباعتها بجودة عالية لاستخدامها في ملفك الشخصي.</p>
              </div>
            </div>
            <button onClick={() => setShowCelebrationToast(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 8 }}>شهاداتي المعتمدة 🎓</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>إنجازاتك والشهادات الموثقة برقم مسلسل التي حصلت عليها من المنصة بعد إتمام الكورسات.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
        {certificates.map((cert, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            style={{
              background: 'var(--surface)', borderRadius: 24, padding: 28,
              boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative'
            }}
          >
            <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Award size={36} />
            </div>
            
            <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-main)', marginBottom: 6, lineHeight: 1.5 }}>{cert.title}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>المحاضر: {cert.instructor} • {cert.date}</p>
            
            <div style={{ background: 'var(--bg)', width: '100%', padding: '12px', borderRadius: 12, marginBottom: 20, fontSize: 12.5, fontWeight: 800, color: 'var(--text-main)', border: '1px solid var(--border)' }}>
              التقدير: <span style={{ color: '#10b981' }}>{cert.grade}</span> | الكود المسلسل: <span style={{ color: '#6C22F9' }}>{cert.id}</span>
            </div>

            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              <button
                onClick={() => handlePrintCertificate(cert)}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#6C22F9', color: '#fff', border: 'none', padding: '12px', borderRadius: 12, fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', boxShadow: '0 4px 14px rgba(108,34,249,0.3)' }}
              >
                <Printer size={16} /> طباعة وتحميل الشهادة PDF
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
