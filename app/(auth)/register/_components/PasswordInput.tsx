'use client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  showStrength?: boolean;
  placeholder?: string;
}

function getStrength(p: string): { score: number; label: string; color: string } {
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[a-z]/.test(p)) score++;
  if (/\d/.test(p)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(p)) score++;
  const map = [
    { label: '', color: 'var(--border)' },
    { label: 'ضعيفة جداً', color: '#ef4444' },
    { label: 'ضعيفة', color: '#f97316' },
    { label: 'متوسطة', color: '#f59e0b' },
    { label: 'قوية', color: '#10b981' },
    { label: 'قوية جداً', color: '#059669' },
  ];
  return { score, ...map[score] };
}

export default function PasswordInput({ label, name, value, onChange, error, showStrength, placeholder }: Props) {
  const [show, setShow] = useState(false);
  const strength = showStrength ? getStrength(value) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
        {label} <span style={{ color: 'var(--danger)' }}>*</span>
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || label}
          className="input"
          style={{ paddingLeft: 44, borderColor: error ? 'var(--danger)' : undefined }}
          autoComplete={name === 'password' ? 'new-password' : 'off'}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
          }}
          tabIndex={-1}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {showStrength && value.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{
                flex: 1, height: 4, borderRadius: 4,
                background: i <= strength!.score ? strength!.color : 'var(--border)',
                transition: 'background .3s',
              }} />
            ))}
          </div>
          <span style={{ fontSize: 12, color: strength!.color, fontWeight: 700 }}>{strength!.label}</span>
        </div>
      )}

      {error && <span style={{ fontSize: 12, color: 'var(--danger)', fontWeight: 600 }}>{error}</span>}
    </div>
  );
}
