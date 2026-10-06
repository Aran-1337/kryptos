'use client';
import React from 'react';
import { Bot, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BotFaqEditorProps {
  isOpen: boolean;
  onClose: () => void;
  botWhatsappReply: string;
  setBotWhatsappReply: (val: string) => void;
  botCoursesReply: string;
  setBotCoursesReply: (val: string) => void;
  botPaymentReply: string;
  setBotPaymentReply: (val: string) => void;
  botBooksReply: string;
  setBotBooksReply: (val: string) => void;
  onSave: () => void;
}

export default function BotFaqEditor({
  isOpen,
  onClose,
  botWhatsappReply,
  setBotWhatsappReply,
  botCoursesReply,
  setBotCoursesReply,
  botPaymentReply,
  setBotPaymentReply,
  botBooksReply,
  setBotBooksReply,
  onSave,
}: BotFaqEditorProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(15,10,42,0.75)', backdropFilter: 'blur(8px)' }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 680,
              maxHeight: '90vh',
              background: 'var(--surface)',
              borderRadius: 24,
              padding: 32,
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              border: '1px solid var(--border)',
              zIndex: 1000,
              fontFamily: 'Tajawal, sans-serif',
              direction: 'rtl',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(108,34,249,0.15)', color: '#6C22F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>تخصيص رُدود وإجابات المساعد الذكي 🤖</h2>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>تحكم في الإجابات الأوتوماتيكية الصادرة من البوت عند سؤال الطلاب</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13.5, fontWeight: 800, color: '#6C22F9', marginBottom: 6 }}>رد "التحدث مع المدرس / الواتساب / الدعم الفني"</label>
                <textarea
                  value={botWhatsappReply}
                  onChange={e => setBotWhatsappReply(e.target.value)}
                  rows={2}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13.5, fontFamily: 'Tajawal, sans-serif', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13.5, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>رد استفسار "الكورسات والصفوف المتاحة"</label>
                <textarea
                  value={botCoursesReply}
                  onChange={e => setBotCoursesReply(e.target.value)}
                  rows={2}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13.5, fontFamily: 'Tajawal, sans-serif', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13.5, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>رد استفسار "طرق الشحن والاشتراك والمحفظة"</label>
                <textarea
                  value={botPaymentReply}
                  onChange={e => setBotPaymentReply(e.target.value)}
                  rows={2}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13.5, fontFamily: 'Tajawal, sans-serif', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13.5, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>رد استفسار "المذكرات والكتب ورسوم الشحن"</label>
                <textarea
                  value={botBooksReply}
                  onChange={e => setBotBooksReply(e.target.value)}
                  rows={2}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13.5, fontFamily: 'Tajawal, sans-serif', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <button
                type="button"
                onClick={onClose}
                style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  onSave();
                  onClose();
                }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 10, border: 'none', background: '#6C22F9', color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
              >
                <Save size={16} /> حفظ ردود المساعد الذكي
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
