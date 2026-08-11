'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createCourse, updateCourse } from '../../lib/adminApi';

interface CourseData {
  _id?: string; title?: string; description?: string; price?: number;
  category?: string; level?: string; isPublished?: boolean;
  thumbnail?: { url: string };
}

export default function CourseForm({ initial }: { initial?: CourseData }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    price: initial?.price ?? 0,
    category: initial?.category || '',
    level: initial?.level || 'beginner',
    isPublished: initial?.isPublished ?? false,
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState(initial?.thumbnail?.url || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setThumbnail(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (thumbnail) fd.append('thumbnail', thumbnail);
      if (initial?._id) await updateCourse(initial._id, fd);
      else await createCourse(fd);
      router.push('/admin/courses');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'حدث خطأ');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', border: '1.5px solid #ebebf5', borderRadius: 12,
    fontSize: 14, fontFamily: "'Tajawal',sans-serif", outline: 'none', color: '#16133a',
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#7c7a9a' }}>←</button>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#16133a' }}>
          {initial?._id ? 'تعديل الكورس' : 'إنشاء كورس جديد'}
        </h1>
      </div>

      {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #ebebf5' }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#16133a', marginBottom: 16 }}>معلومات الكورس</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#16133a', display: 'block', marginBottom: 6 }}>عنوان الكورس *</label>
                  <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="أدخل عنوان الكورس" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#16133a', display: 'block', marginBottom: 6 }}>الوصف</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="وصف الكورس..." rows={5}
                    style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#16133a', display: 'block', marginBottom: 6 }}>التصنيف</label>
                    <input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="مثال: برمجة" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#16133a', display: 'block', marginBottom: 6 }}>المستوى</label>
                    <select value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}
                      style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="beginner">مبتدئ</option>
                      <option value="intermediate">متوسط</option>
                      <option value="advanced">متقدم</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Thumbnail */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #ebebf5' }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#16133a', marginBottom: 16 }}>صورة الغلاف</h2>
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  border: '2px dashed #ebebf5', borderRadius: 12, padding: 20,
                  textAlign: 'center', cursor: 'pointer', transition: 'border-color .2s',
                  background: preview ? `url(${preview}) center/cover` : '#f9f9fd',
                  minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                {!preview && <div><div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div><div style={{ fontSize: 13, color: '#7c7a9a' }}>اضغط لرفع صورة</div></div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
            </div>

            {/* Price & Publish */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #ebebf5' }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#16133a', marginBottom: 16 }}>السعر والنشر</h2>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#16133a', display: 'block', marginBottom: 6 }}>السعر (ج.م)</label>
                <input type="number" min={0} value={form.price} onChange={e => setForm(p => ({ ...p, price: +e.target.value }))} style={inputStyle} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.isPublished} onChange={e => setForm(p => ({ ...p, isPublished: e.target.checked }))}
                  style={{ width: 18, height: 18, accentColor: '#6c63ff' }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: '#16133a' }}>نشر الكورس</span>
              </label>
            </div>

            <button type="submit" disabled={loading} style={{
              padding: '14px', background: loading ? '#a5a0ff' : 'linear-gradient(135deg,#6c63ff,#4f46e5)',
              color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
              fontFamily: "'Tajawal',sans-serif", cursor: loading ? 'not-allowed' : 'pointer',
            }}>
              {loading ? 'جاري الحفظ...' : (initial?._id ? 'حفظ التعديلات' : 'إنشاء الكورس')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
