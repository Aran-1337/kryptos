'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Laptop, Smartphone, LogOut } from 'lucide-react';
import { Student } from '../types/student.types';

interface StudentDevicesModalProps {
  student: Student | null;
  onClose: () => void;
  onUnbindDevice: (deviceId: string) => void;
}

export default function StudentDevicesModal({
  student,
  onClose,
  onUnbindDevice,
}: StudentDevicesModalProps) {
  return (
    <AnimatePresence>
      {student && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
            }}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            style={{
              position: 'relative',
              background: 'var(--surface)',
              borderRadius: 24,
              border: '1px solid var(--border)',
              padding: 28,
              width: '100%',
              maxWidth: 640,
              zIndex: 1000,
              fontFamily: 'Tajawal, sans-serif',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <div>
                <h3
                  style={{
                    margin: '0 0 4px',
                    fontSize: 18,
                    fontWeight: 900,
                    color: 'var(--text-main)',
                  }}
                >
                  الأجهزة المسجلة لحساب ({student.name})
                </h3>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  الحد الأقصى المسموح: جهاز كمبيوتر + جهاز موبايل فقط.
                </span>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                marginBottom: 24,
              }}
            >
              {student.devices.length === 0 ? (
                <div
                  style={{
                    padding: 30,
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                  }}
                >
                  لا توجد أجهزة مسجلة حالياً بهذا الحساب.
                </div>
              ) : (
                student.devices.map(dev => (
                  <div
                    key={dev.id}
                    style={{
                      background: 'var(--bg)',
                      borderRadius: 14,
                      border: dev.isSameNetwork
                        ? '1px solid var(--border)'
                        : '1px solid #ef4444',
                      padding: 16,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#6C22F9',
                        }}
                      >
                        {dev.type === 'laptop' ? (
                          <Laptop size={22} />
                        ) : (
                          <Smartphone size={22} />
                        )}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <h4
                            style={{
                              margin: 0,
                              fontSize: 14,
                              fontWeight: 800,
                              color: 'var(--text-main)',
                            }}
                          >
                            {dev.name}
                          </h4>
                          {dev.isCurrent && (
                            <span
                              style={{
                                background: 'rgba(34,197,94,0.15)',
                                color: '#22c55e',
                                fontSize: 10,
                                fontWeight: 900,
                                padding: '2px 8px',
                                borderRadius: 6,
                              }}
                            >
                              الجهاز الحالي
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: 'var(--text-muted)',
                            marginTop: 4,
                            display: 'flex',
                            gap: 12,
                          }}
                        >
                          <span>IP: {dev.ip}</span>
                          <span>📍 {dev.city}</span>
                          <span>⏳ النشاط: {dev.lastActive}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onUnbindDevice(dev.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        background: 'rgba(239,68,68,0.12)',
                        color: '#ef4444',
                        border: 'none',
                        padding: '8px 14px',
                        borderRadius: 8,
                        fontSize: 12.5,
                        fontWeight: 800,
                        cursor: 'pointer',
                        fontFamily: 'Tajawal, sans-serif',
                      }}
                    >
                      <LogOut size={14} /> فك الارتباط
                    </button>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 24px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#6C22F9',
                  color: '#fff',
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: 'Tajawal, sans-serif',
                }}
              >
                إغلاق
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
