'use client';
import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  maxWidth?: number | string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'بحث...',
  maxWidth = 400,
  style,
  ...props
}: SearchInputProps) {
  return (
    <div style={{ position: 'relative', flex: 1, maxWidth }}>
      <Search
        size={18}
        color="var(--text-muted)"
        style={{
          position: 'absolute',
          right: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
        }}
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px 42px 10px 14px',
          borderRadius: 12,
          border: '1px solid var(--border)',
          outline: 'none',
          fontSize: 14,
          fontFamily: 'Tajawal, sans-serif',
          background: 'var(--bg)',
          color: 'var(--text-main)',
          boxSizing: 'border-box',
          ...style,
        }}
        {...props}
      />
    </div>
  );
}
