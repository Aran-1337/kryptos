'use client';
import { FiUser, FiBookOpen, FiUsers, FiCheck } from 'react-icons/fi';

const STEPS = [
  { label: 'بيانات الحساب', Icon: FiUser },
  { label: 'بيانات الطالب', Icon: FiBookOpen },
  { label: 'ولي الأمر', Icon: FiUsers },
];

export default function Stepper({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const { Icon } = step;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: done ? 'var(--success)' : active
                  ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))'
                  : 'var(--bg)',
                color: done || active ? '#fff' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: active ? '0 4px 16px rgba(108,99,255,0.4)' : done ? '0 2px 8px rgba(16,185,129,0.3)' : 'none',
                border: `2px solid ${done ? 'var(--success)' : active ? 'transparent' : 'var(--border)'}`,
                transition: 'all .35s',
              }}>
                {done ? <FiCheck size={20} strokeWidth={3} /> : <Icon size={20} />}
              </div>
              <span style={{
                fontSize: 12, fontWeight: active ? 800 : 600, whiteSpace: 'nowrap',
                color: active ? 'var(--primary)' : done ? 'var(--success)' : 'var(--text-muted)',
                transition: 'color .3s',
              }}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                width: 56, height: 3, margin: '0 6px', marginBottom: 24, borderRadius: 4,
                background: i < current
                  ? 'linear-gradient(90deg, var(--success), #34d399)'
                  : 'var(--border)',
                transition: 'background .4s',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
