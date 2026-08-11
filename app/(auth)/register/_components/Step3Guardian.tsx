'use client';
import { HiUserCircle, HiPhone, HiShieldCheck } from 'react-icons/hi2';
import { PiUsersFill } from 'react-icons/pi';

interface GuardianData {
  fullName: string; relation: string; phone: string;
  altPhone: string; email: string;
}
interface Consents { acceptTerms: boolean; acceptPrivacy: boolean; acceptNotifications: boolean; }
interface Errors { [k: string]: string }
interface Props {
  guardian: GuardianData;
  consents: Consents;
  errors: Errors;
  studentPhone: string;
  onGuardianChange: (field: keyof GuardianData, value: string) => void;
  onConsentChange: (field: keyof Consents, value: boolean) => void;
}

const sectionCard = {
  background: 'var(--bg)',
  borderRadius: 14,
  padding: '16px',
  border: '1px solid var(--border)',
};

const sectionTitle = () => ({
  fontSize: 13, fontWeight: 700, color: 'var(--text-muted)',
  marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6,
});

function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <span style={{ fontSize: 12, color: 'var(--danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>⚠ {msg}</span>;
}

export default function Step3Guardian({ guardian, consents, errors, studentPhone, onGuardianChange, onConsentChange }: Props) {
  const handlePhone = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length >= 2 && !digits.startsWith('01')) return;
    onGuardianChange('phone', digits);
  };

  const phoneLiveError = guardian.phone && guardian.phone.length > 0 && guardian.phone.length < 11
    ? 'رقم الهاتف يجب أن يكون 11 رقم'
    : studentPhone && guardian.phone === studentPhone
    ? 'يجب أن يختلف عن رقم الطالب'
    : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Full Name */}
      <div style={sectionCard}>
        <p style={sectionTitle()}>
          <HiUserCircle size={15} color="var(--primary)" /> اسم ولي الأمر
        </p>
        <input
          type="text" name="guardianFullName" value={guardian.fullName}
          onChange={e => onGuardianChange('fullName', e.target.value)}
          placeholder="الاسم بالكامل" className="input" autoComplete="off"
          style={{ borderColor: errors['guardian.fullName'] ? 'var(--danger)' : undefined }}
        />
        <div style={{ marginTop: 6 }}><ErrorMsg msg={errors['guardian.fullName']} /></div>
      </div>

      {/* Relation */}
      <div style={sectionCard}>
        <p style={sectionTitle()}>
          <PiUsersFill size={15} color="var(--primary)" /> صلة القرابة
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { value: 'father', label: 'الأب', icon: '👨' },
            { value: 'mother', label: 'الأم', icon: '👩' },
            { value: 'other', label: 'ولي أمر آخر', icon: '👤' },
          ].map(r => (
            <label key={r.value} onClick={() => onGuardianChange('relation', r.value)} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '13px 16px', borderRadius: 12, cursor: 'pointer',
              border: `2px solid ${guardian.relation === r.value ? 'var(--primary)' : 'var(--border)'}`,
              background: guardian.relation === r.value ? 'var(--primary-light)' : 'var(--surface)',
              fontWeight: 700, fontSize: 14,
              color: guardian.relation === r.value ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'all .2s',
            }}>
              <span>{r.icon}</span>
              {r.label}
            </label>
          ))}
        </div>
        <div style={{ marginTop: 6 }}><ErrorMsg msg={errors['guardian.relation']} /></div>
      </div>

      {/* Phone */}
      <div style={sectionCard}>
        <p style={sectionTitle()}>
          <HiPhone size={15} color="var(--primary)" /> رقم هاتف ولي الأمر
        </p>
        <input
          type="tel" name="guardian.phone" value={guardian.phone}
          onChange={e => handlePhone(e.target.value)}
          placeholder="01xxxxxxxxx" className="input" maxLength={11} autoComplete="off"
          style={{ borderColor: (errors['guardian.phone'] || phoneLiveError) ? 'var(--danger)' : undefined, background: (errors['guardian.phone'] || phoneLiveError) ? '#fff5f5' : undefined }}
        />
        <div style={{ marginTop: 6 }}><ErrorMsg msg={errors['guardian.phone'] || phoneLiveError} /></div>
      </div>

      {/* Consents */}
      <div style={sectionCard}>
        <p style={sectionTitle()}>
          <HiShieldCheck size={15} color="var(--primary)" /> الموافقات
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { key: 'acceptTerms' as keyof Consents, label: 'أوافق على الشروط والأحكام', required: true },
            { key: 'acceptPrivacy' as keyof Consents, label: 'أوافق على سياسة الخصوصية', required: true },
            { key: 'acceptNotifications' as keyof Consents, label: 'أوافق على استقبال إشعارات المنصة', required: false },
          ].map(c => (
            <label key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <div
                onClick={() => onConsentChange(c.key, !consents[c.key])}
                style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  border: `2px solid ${consents[c.key] ? 'var(--primary)' : errors[c.key] ? 'var(--danger)' : 'var(--text-muted)'}`,
                  background: consents[c.key] ? 'var(--primary)' : 'var(--surface)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all .2s', cursor: 'pointer',
                }}
              >
                {consents[c.key] && <span style={{ color: '#fff', fontSize: 13, fontWeight: 900 }}>✓</span>}
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>
                {c.label}
                {!c.required && <span style={{ fontSize: 12, color: 'var(--text-muted)', marginRight: 4 }}>(اختياري)</span>}
                {c.required && <span style={{ color: 'var(--danger)', marginRight: 2 }}>*</span>}
              </span>
            </label>
          ))}
          {(errors.acceptTerms || errors.acceptPrivacy) && (
            <ErrorMsg msg="يجب الموافقة على الشروط والسياسة للمتابعة" />
          )}
        </div>
      </div>

    </div>
  );
}
