'use client';
import { useEffect, useState, useRef } from 'react';
import API from '../../lib/adminApi';

interface Course { _id: string; title: string; }
interface Lesson { _id: string; title: string; type: string; isFree: boolean; duration?: number; section?: { title: string }; }

export default function LessonsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'video', isFree: false, content: '', sectionId: '' });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    API.get('/courses').then(r => setCourses(r.data?.data?.courses || r.data?.courses || []));
  }, []);

  const loadLessons = (courseId: string) => {
    setLoading(true);
    API.get(`/courses/${courseId}/sections`).then(r => {
      const sections = r.data?.data?.sections || r.data?.sections || [];
      const all: Lesson[] = sections.flatMap((s: { lessons?: Lesson[]; title: string }) =>
        (s.lessons || []).map((l: Lesson) => ({ ...l, section: { title: s.title } }))
      );
      setLessons(all);
    }).finally(() => setLoading(false));
  };

  const handleCourseChange = (id: string) => { setSelectedCourse(id); if (id) loadLessons(id); else setLessons([]); };

  const typeIcons: Record<string, string> = { video: '🎬', pdf: '📄', zip: '🗜️', article: '📝', code: '💻' };

  const inputStyle = { width: '100%', padding: '11px 14px', border: '1.5px solid #ebebf5', borderRadius: 10, fontSize: 14, fontFamily: "'Tajawal',sans-serif", outline: 'none' };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#16133a' }}>إدارة الدروس</h1>
        {selectedCourse && (
          <button onClick={() => setShowForm(true)} style={{
            background: 'linear-gradient(135deg,#6c63ff,#4f46e5)', color: '#fff',
            padding: '10px 22px', borderRadius: 12, fontWeight: 700, fontSize: 14,
            border: 'none', cursor: 'pointer', fontFamily: "'Tajawal',sans-serif",
          }}>+ إضافة درس</button>
        )}
      </div>

      <div style={{ marginBottom: 20 }}>
        <select value={selectedCourse} onChange={e => handleCourseChange(e.target.value)}
          style={{ padding: '11px 16px', border: '1.5px solid #ebebf5', borderRadius: 12, fontSize: 14, fontFamily: "'Tajawal',sans-serif", outline: 'none', minWidth: 280, cursor: 'pointer' }}>
          <option value="">اختر كورساً...</option>
          {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
        </select>
      </div>

      {loading ? <div style={{ color: '#7c7a9a', padding: 40, textAlign: 'center' }}>جاري التحميل...</div> : selectedCourse ? (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #ebebf5', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f9f9fd', borderBottom: '1px solid #ebebf5' }}>
                {['الدرس', 'الفصل', 'النوع', 'الوصول', 'إجراءات'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'right', color: '#7c7a9a', fontWeight: 600, fontSize: 13 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lessons.length ? lessons.map(l => (
                <tr key={l._id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#16133a' }}>
                    {typeIcons[l.type] || '📄'} {l.title}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#7c7a9a' }}>{l.section?.title || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: '#eeeeff', color: '#6c63ff' }}>
                      {l.type === 'video' ? 'فيديو' : l.type === 'pdf' ? 'PDF' : l.type === 'zip' ? 'ZIP' : l.type === 'article' ? 'مقال' : 'كود'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: l.isFree ? '#d1fae5' : '#fef3c7', color: l.isFree ? '#065f46' : '#92400e' }}>
                      {l.isFree ? 'مجاني' : 'مدفوع'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={async () => { if (confirm('حذف الدرس؟')) { await API.delete(`/courses/${selectedCourse}/sections/${l.section}/lessons/${l._id}`); loadLessons(selectedCourse); } }} style={{
                      padding: '6px 14px', background: '#fee2e2', color: '#ef4444',
                      border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: "'Tajawal',sans-serif",
                    }}>حذف</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#7c7a9a' }}>لا توجد دروس في هذا الكورس</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 16, padding: 60, textAlign: 'center', border: '1px solid #ebebf5', color: '#7c7a9a' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎬</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>اختر كورساً لعرض دروسه</div>
        </div>
      )}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}
          onClick={() => setShowForm(false)}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, width: 500, boxShadow: '0 8px 40px rgba(0,0,0,.15)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#16133a', marginBottom: 20 }}>إضافة درس جديد</h2>
            <form onSubmit={async (e) => {
              e.preventDefault(); setSaving(true);
              try {
                const fd = new FormData();
                fd.append('title', form.title); fd.append('type', form.type); fd.append('isFree', String(form.isFree));
                if (form.content) fd.append('content', form.content);
                if (file) fd.append('file', file);
                await API.post(`/courses/${selectedCourse}/sections/${form.sectionId}/lessons`, fd);
                setShowForm(false); loadLessons(selectedCourse);
              } catch { alert('فشل الإضافة'); }
              finally { setSaving(false); }
            }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="عنوان الدرس" style={inputStyle} />
              <input value={form.sectionId} onChange={e => setForm(p => ({ ...p, sectionId: e.target.value }))} placeholder="ID الفصل (Section)" style={inputStyle} />
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="video">🎬 فيديو</option>
                <option value="pdf">📄 PDF</option>
                <option value="zip">🗜️ ZIP</option>
                <option value="article">📝 مقال</option>
                <option value="code">💻 كود</option>
              </select>
              {['video', 'pdf', 'zip'].includes(form.type) && (
                <div>
                  <button type="button" onClick={() => fileRef.current?.click()} style={{ padding: '10px 18px', background: '#eeeeff', color: '#6c63ff', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: "'Tajawal',sans-serif" }}>
                    📎 {file ? file.name : 'رفع ملف'}
                  </button>
                  <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={e => setFile(e.target.files?.[0] || null)} />
                </div>
              )}
              {['article', 'code'].includes(form.type) && (
                <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder={form.type === 'code' ? 'أدخل الكود هنا...' : 'اكتب المقال هنا...'} rows={6}
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: form.type === 'code' ? 'monospace' : "'Tajawal',sans-serif" }} />
              )}
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.isFree} onChange={e => setForm(p => ({ ...p, isFree: e.target.checked }))} style={{ width: 18, height: 18, accentColor: '#6c63ff' }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: '#16133a' }}>درس مجاني</span>
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" disabled={saving} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg,#6c63ff,#4f46e5)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Tajawal',sans-serif" }}>
                  {saving ? 'جاري الحفظ...' : 'إضافة'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Tajawal',sans-serif" }}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
