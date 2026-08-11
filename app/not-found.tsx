'use client';
import Link from 'next/link';
import { Home, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #1a1350 50%, #24243e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: 'Tajawal, sans-serif',
      direction: 'rtl',
      color: '#fff',
      textAlign: 'center',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ maxWidth: 460 }}
      >
        <div style={{
          fontSize: 100,
          fontWeight: 900,
          lineHeight: 1,
          background: 'linear-gradient(135deg, #6C22F9, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 10,
        }}>
          404
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>
          عذراً، الصفحة غير موجودة! 🧭
        </h1>

        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 32 }}>
          الصفحة التي تحاول الوصول إليها قد تكون حُذفت أو تم تغيير عنوانها أو أنك لا تملك صلاحية للوصول إليها.
        </p>

        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          background: 'linear-gradient(135deg, #6C22F9, #4f46e5)',
          color: '#fff',
          padding: '14px 28px',
          borderRadius: 14,
          fontSize: 16,
          fontWeight: 800,
          textDecoration: 'none',
          boxShadow: '0 8px 24px rgba(108,34,249,0.4)',
        }}>
          <Home size={18} /> العودة للصفحة الرئيسية
        </Link>
      </motion.div>
    </div>
  );
}
