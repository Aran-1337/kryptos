'use client';
import { useEffect } from 'react';
import { HiAcademicCap, HiUserCircle, HiMapPin } from 'react-icons/hi2';
import { PiGraduationCapFill } from 'react-icons/pi';
import { MdLocationCity } from 'react-icons/md';
import { BsGenderMale, BsGenderFemale } from 'react-icons/bs';

const GOVERNORATES: Record<string, string[]> = {
  'القاهرة': ['مدينة نصر', 'المعادي', 'الزيتون', 'شبرا', 'مصر الجديدة', 'عين شمس', 'المطرية', 'حلوان', 'التجمع الخامس', 'أخرى'],
  'الجيزة': ['الدقي', 'المهندسين', 'العجوزة', 'الهرم', 'فيصل', 'إمبابة', 'أكتوبر', 'الشيخ زايد', 'أخرى'],
  'الإسكندرية': ['المنتزه', 'العجمي', 'سيدي بشر', 'محرم بك', 'الرمل', 'أخرى'],
  'الدقهلية': ['المنصورة', 'طلخا', 'ميت غمر', 'دكرنس', 'أخرى'],
  'الشرقية': ['الزقازيق', 'العاشر من رمضان', 'بلبيس', 'أخرى'],
  'القليوبية': ['بنها', 'شبرا الخيمة', 'قليوب', 'أخرى'],
  'الغربية': ['طنطا', 'المحلة الكبرى', 'كفر الزيات', 'أخرى'],
  'المنوفية': ['شبين الكوم', 'منوف', 'أشمون', 'أخرى'],
  'البحيرة': ['دمنهور', 'كفر الدوار', 'رشيد', 'أخرى'],
  'كفر الشيخ': ['كفر الشيخ', 'دسوق', 'فوه', 'أخرى'],
  'الفيوم': ['الفيوم', 'إطسا', 'يوسف الصديق', 'أخرى'],
  'بني سويف': ['بني سويف', 'الفشن', 'ناصر', 'أخرى'],
  'المنيا': ['المنيا', 'ملوي', 'سمالوط', 'أخرى'],
  'أسيوط': ['أسيوط', 'ديروط', 'منفلوط', 'أخرى'],
  'سوهاج': ['سوهاج', 'أخميم', 'طهطا', 'أخرى'],
  'قنا': ['قنا', 'نجع حمادي', 'دشنا', 'أخرى'],
  'الأقصر': ['الأقصر', 'إسنا', 'أرمنت', 'أخرى'],
  'أسوان': ['أسوان', 'كوم أمبو', 'إدفو', 'أخرى'],
  'البحر الأحمر': ['الغردقة', 'سفاجا', 'القصير', 'أخرى'],
  'الإسماعيلية': ['الإسماعيلية', 'القنطرة', 'أخرى'],
  'السويس': ['السويس', 'أخرى'],
  'بورسعيد': ['بورسعيد', 'أخرى'],
  'دمياط': ['دمياط', 'رأس البر', 'أخرى'],
  'شمال سيناء': ['العريش', 'رفح', 'أخرى'],
  'جنوب سيناء': ['شرم الشيخ', 'طابا', 'أخرى'],
  'مطروح': ['مرسى مطروح', 'سيوة', 'أخرى'],
  'الوادي الجديد': ['الخارجة', 'الداخلة', 'أخرى'],
};

interface FormData {
  grade: string; school: string; governorate: string;
  city: string; birthDate: string; gender: string; educationType: string;
}
interface Errors { [k: string]: string }
interface Props { data: FormData; errors: Errors; onChange: (field: keyof FormData, value: string) => void; }

const sectionCard = {
  background: 'var(--bg)',
  borderRadius: 14,
  padding: '16px',
  border: '1px solid var(--border)',
};

const sectionTitle = (color = 'var(--primary)') => ({
  fontSize: 13, fontWeight: 700, color: 'var(--text-muted)',
  marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6,
});

function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <span style={{ fontSize: 12, color: 'var(--danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>⚠ {msg}</span>;
}

export default function Step2Student({ data, errors, onChange }: Props) {
  useEffect(() => {
    if (data.governorate && data.city && !GOVERNORATES[data.governorate]?.includes(data.city)) {
      onChange('city', '');
    }
  }, [data.governorate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Grade */}
      <div style={sectionCard}>
        <p style={sectionTitle()}>
          <PiGraduationCapFill size={15} color="var(--primary)" /> الصف الدراسي
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { value: 'grade1', label: 'أولى ثانوي', icon: <HiAcademicCap size={20} /> },
            { value: 'grade2', label: 'ثانية ثانوي', icon: <HiAcademicCap size={20} /> },
          ].map(g => (
            <label key={g.value} onClick={() => onChange('grade', g.value)} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '13px 16px', borderRadius: 12, cursor: 'pointer',
              border: `2px solid ${data.grade === g.value ? 'var(--primary)' : 'var(--border)'}`,
              background: data.grade === g.value ? 'var(--primary-light)' : 'var(--surface)',
              fontWeight: 700, fontSize: 14,
              color: data.grade === g.value ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'all .2s',
            }}>
              <span style={{ color: data.grade === g.value ? 'var(--primary)' : 'var(--text-muted)' }}>{g.icon}</span>
              {g.label}
            </label>
          ))}
        </div>
        <ErrorMsg msg={errors.grade} />
      </div>

      {/* Gender */}
      <div style={sectionCard}>
        <p style={sectionTitle()}>
          <HiUserCircle size={15} color="var(--primary)" /> الجنس
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { value: 'male', label: 'ذكر', icon: <BsGenderMale size={18} /> },
            { value: 'female', label: 'أنثى', icon: <BsGenderFemale size={18} /> },
          ].map(g => (
            <label key={g.value} onClick={() => onChange('gender', g.value)} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '13px 16px', borderRadius: 12, cursor: 'pointer',
              border: `2px solid ${data.gender === g.value ? 'var(--primary)' : 'var(--border)'}`,
              background: data.gender === g.value ? 'var(--primary-light)' : 'var(--surface)',
              fontWeight: 700, fontSize: 14,
              color: data.gender === g.value ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'all .2s',
            }}>
              <span style={{ color: data.gender === g.value ? 'var(--primary)' : 'var(--text-muted)' }}>{g.icon}</span>
              {g.label}
            </label>
          ))}
        </div>
        <ErrorMsg msg={errors.gender} />
      </div>

      {/* Education Type */}
      <div style={sectionCard}>
        <p style={sectionTitle()}>
          <HiAcademicCap size={15} color="var(--primary)" /> نوع التعليم
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { value: 'arabic', label: 'عربي', icon: '📚' },
            { value: 'languages', label: 'لغات', icon: '🌐' },
          ].map(t => (
            <label key={t.value} onClick={() => onChange('educationType', t.value)} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '13px 16px', borderRadius: 12, cursor: 'pointer',
              border: `2px solid ${data.educationType === t.value ? 'var(--primary)' : 'var(--border)'}`,
              background: data.educationType === t.value ? 'var(--primary-light)' : 'var(--surface)',
              fontWeight: 700, fontSize: 14,
              color: data.educationType === t.value ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'all .2s',
            }}>
              <span>{t.icon}</span>
              {t.label}
            </label>
          ))}
        </div>
        <ErrorMsg msg={errors.educationType} />
      </div>

      {/* Location */}
      <div style={sectionCard}>
        <p style={sectionTitle()}>
          <HiMapPin size={15} color="var(--primary)" /> الموقع الجغرافي
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <MdLocationCity size={14} color="var(--primary)" />
              المحافظة <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <select name="governorate" value={data.governorate} onChange={e => onChange('governorate', e.target.value)}
              className="input" style={{ borderColor: errors.governorate ? 'var(--danger)' : undefined, cursor: 'pointer' }}>
              <option value="">اختر المحافظة</option>
              {Object.keys(GOVERNORATES).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <ErrorMsg msg={errors.governorate} />
          </div>
      </div>

    </div>
  );
}
