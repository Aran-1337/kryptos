'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { BookOrder, BookOrderStatus } from '../types/book.types';

interface TrackingModalProps {
  isOpen: boolean;
  order: BookOrder | null;
  onClose: () => void;
  onUpdateStatus: (status: BookOrderStatus) => void;
}

export default function TrackingModal({
  isOpen,
  order,
  onClose,
  onUpdateStatus,
}: TrackingModalProps) {
  return (
    <AnimatePresence>
      {isOpen && order && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1001 }}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            style={{ position: 'relative', zIndex: 1002, background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: 28, width: '100%', maxWidth: 440, fontFamily: 'Tajawal, sans-serif', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', direction: 'rtl' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: 'var(--text-main)' }}>
                تحديث حالة الطلب ({order.id})
              </h3>
              <button
                type="button"
                onClick={onClose}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <button
                type="button"
                onClick={() => onUpdateStatus('pending')}
                style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', textAlign: 'right', fontWeight: 800, cursor: 'pointer' }}
              >
                📦 قيد التحضير والتجهيز
              </button>
              <button
                type="button"
                onClick={() => onUpdateStatus('shipped')}
                style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: '#3b82f6', textAlign: 'right', fontWeight: 800, cursor: 'pointer' }}
              >
                🚚 تم التسليم لشركة الشحن
              </button>
              <button
                type="button"
                onClick={() => onUpdateStatus('delivered')}
                style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: '#10b981', textAlign: 'right', fontWeight: 800, cursor: 'pointer' }}
              >
                ✅ تم التوصيل والإنهاء
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
