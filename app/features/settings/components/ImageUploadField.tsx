'use client';
import React from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadFieldProps {
  id: string;
  label: string;
  uploadButtonText?: string;
  value: string;
  onChangeText: (val: string) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewWidth?: number | string;
  previewHeight?: number | string;
  isSquareIcon?: boolean;
  placeholder?: string;
}

export default function ImageUploadField({
  id,
  label,
  uploadButtonText = 'رفع صورة',
  value,
  onChangeText,
  onFileSelect,
  previewWidth = 80,
  previewHeight = 44,
  isSquareIcon = false,
  placeholder,
}: ImageUploadFieldProps) {
  return (
    <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 14, border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <label style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text-main)' }}>{label}</label>
        <label
          htmlFor={id}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#6C22F9',
            color: '#fff',
            padding: '5px 12px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          <Upload size={13} /> {uploadButtonText}
        </label>
        <input
          id={id}
          type="file"
          accept="image/*"
          onChange={onFileSelect}
          style={{ display: 'none' }}
        />
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div
          style={{
            width: previewWidth,
            height: previewHeight,
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 4,
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          <img
            src={value}
            alt={`${label} Preview`}
            style={
              isSquareIcon
                ? { width: 26, height: 26, objectFit: 'contain' }
                : { maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }
            }
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={e => onChangeText(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-main)',
            outline: 'none',
            fontSize: 12.5,
            fontFamily: 'Tajawal, sans-serif',
            boxSizing: 'border-box',
          }}
        />
      </div>
    </div>
  );
}
