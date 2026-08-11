'use client';
import PasswordInput from './PasswordInput';
import { FiUser, FiMail, FiPhone } from 'react-icons/fi';

interface FormData {
  firstName: string; fatherName: string; lastName: string;
  email: string; phone: string; password: string; confirmPassword: string;
}
interface Props {
  data: FormData;
  errors: Record<string, string>;
  onChange: (field: keyof FormData, value: string) => void;
}

function Field({ label, name, value, onChange, error, type = 'text', placeholder, icon }: {
  label: string; name: string; value: string;
  onChange: (v: string) => void; error?: string;
  type?: string; placeholder?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 5 }}>
        {icon && <span style={{ color: 'var(--primary)', display: 'flex' }}>{icon}</span>}
        {label} <span style={{ color: 'var(--danger)' }}>*</span>
      </label>
      <input
        type={type} name={name} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || label}
        className="input"
        style={{
          borderColor: error ? 'var(--danger)' : undefined,
          background: error ? '#fff5f5' : undefined,
        }}
        autoComplete="off"
      />
      {error && (
        <span style={{ fontSize: 12, color: 'var(--danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
          ⚠ {error}
        </span>
      )}
    </div>
  );
}

function EmailField({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
  const handleChange = (val: string) => {
    onChange(val.trim());
  };
  const liveError = value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'البريد الإلكتروني غير صالح' : '';
  const displayError = error || liveError;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ color: 'var(--primary)', display: 'flex' }}><FiMail size={14} /></span>
        البريد الإلكتروني <span style={{ color: 'var(--danger)' }}>*</span>
      </label>
      <input
        type="email" name="email" value={value}
        onChange={e => handleChange(e.target.value)}
        placeholder="example@email.com"
        className="input"
        style={{ borderColor: displayError ? 'var(--danger)' : undefined, background: displayError ? '#fff5f5' : undefined }}
        autoComplete="off"
      />
      {displayError && (
        <span style={{ fontSize: 12, color: 'var(--danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>⚠ {displayError}</span>
      )}
    </div>
  );
}

function PhoneField({ value, onChange, error, label }: { value: string; onChange: (v: string) => void; error?: string; label: string }) {
  const handleChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length >= 2 && !digits.startsWith('01')) return;
    onChange(digits);
  };
  const liveError = value && value.length > 0 && value.length < 11 ? `رقم الهاتف يجب أن يكون 11 رقم` : '';
  const displayError = error || liveError;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ color: 'var(--primary)', display: 'flex' }}><FiPhone size={14} /></span>
        {label} <span style={{ color: 'var(--danger)' }}>*</span>
      </label>
      <input
        type="tel" name="phone" value={value}
        onChange={e => handleChange(e.target.value)}
        placeholder="01xxxxxxxxx"
        className="input"
        maxLength={11}
        style={{ borderColor: displayError ? 'var(--danger)' : undefined, background: displayError ? '#fff5f5' : undefined }}
        autoComplete="off"
      />
      {displayError && (
        <span style={{ fontSize: 12, color: 'var(--danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>⚠ {displayError}</span>
      )}
    </div>
  );
}

export default function Step1Account({ data, errors, onChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Name row */}
      <div style={{ background: 'var(--bg)', borderRadius: 14, padding: '16px', border: '1px solid var(--border)' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          <FiUser size={14} color="var(--primary)" /> الاسم الكامل
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
          <Field label="الاسم الأول" name="firstName" value={data.firstName} onChange={v => onChange('firstName', v)} error={errors.firstName} />
          <Field label="اسم الأب" name="fatherName" value={data.fatherName} onChange={v => onChange('fatherName', v)} error={errors.fatherName} />
          <Field label="اسم العائلة" name="lastName" value={data.lastName} onChange={v => onChange('lastName', v)} error={errors.lastName} />
        </div>
      </div>

      {/* Contact */}
      <div style={{ background: 'var(--bg)', borderRadius: 14, padding: '16px', border: '1px solid var(--border)' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          <FiPhone size={14} color="var(--primary)" /> بيانات التواصل
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <EmailField value={data.email} onChange={v => onChange('email', v)} error={errors.email} />
          <PhoneField value={data.phone} onChange={v => onChange('phone', v)} error={errors.phone} label="رقم هاتف الطالب" />
        </div>
      </div>

      {/* Password */}
      <div style={{ background: 'var(--bg)', borderRadius: 14, padding: '16px', border: '1px solid var(--border)' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 14 }}>🔐 كلمة المرور</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <PasswordInput label="كلمة المرور" name="password" value={data.password} onChange={v => onChange('password', v)} error={errors.password} showStrength />
          <PasswordInput label="تأكيد كلمة المرور" name="confirmPassword" value={data.confirmPassword} onChange={v => onChange('confirmPassword', v)} error={errors.confirmPassword} placeholder="أعد كتابة كلمة المرور" />
        </div>
      </div>
    </div>
  );
}
