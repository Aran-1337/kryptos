'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  visible: boolean;
  onClose?: () => void;
}

export default function Toast({
  message,
  type = 'success',
  visible,
  onClose,
}: ToastProps) {
  const getColors = () => {
    switch (type) {
      case 'error':
        return { bg: '#ef4444', icon: <AlertCircle size={18} /> };
      case 'info':
        return { bg: '#6C22F9', icon: <Info size={18} /> };
      case 'success':
      default:
        return { bg: '#10b981', icon: <CheckCircle2 size={18} /> };
    }
  };

  const { bg, icon } = getColors();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            zIndex: 9999,
            background: bg,
            color: '#fff',
            padding: '12px 24px',
            borderRadius: 14,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontWeight: 800,
            fontSize: 14,
            fontFamily: 'Tajawal, sans-serif',
            direction: 'rtl',
          }}
        >
          {icon}
          <span>{message}</span>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.8)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                marginRight: 6,
                padding: 0,
              }}
            >
              <X size={16} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
