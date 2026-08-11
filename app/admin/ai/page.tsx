'use client';
import { useState } from 'react';
import API from '../../lib/adminApi';

type Tool = 'summary' | 'quiz' | 'truefalse' | 'mcq' | 'assignment' | 'code' | 'title';

const tools: { id: Tool; icon: string; label: string; placeholder: string }[] = [
  { id: 'summary', icon: '📝', label: 'ملخص الدرس', placeholder: 'أدخل موضوع الدرس...' },
  { id: 'quiz', icon: '❓', label: 'أسئلة Quiz', placeholder: 'أدخل موضوع الكويز...' },
  { id: 'truefalse', icon: '✅', label: 'صح وغلط', placeholder: 'أدخل الموضوع...' },
  { id: 'mcq', icon: '🔘', label: 'اختيار من متعدد', placeholder: 'أدخل الموضوع...' },
  { id: 'assignment', icon: '📋', label: 'واجب', placeholder: 'أدخل موضوع الواجب...' },
  { id: 'code', icon: '💻', label: 'كود مثال', placeholder: 'أدخل الموضوع البرمجي...' },
  { id: 'title', icon: '🏷️', label: 'عنوان ووصف', placeholder: 'أدخل فكرة الدرس...' },
];

const prompts: Record<Tool, (t: string) => string> = {
  summary: t => `اكتب ملخصاً شاملاً باللغة العربية لدرس عن: ${t}`,
  quiz: t => `اكتب 5 أسئلة Quiz باللغة العربية عن موضوع: ${t}`,
  truefalse: t => `اكتب 5 أسئلة صح وغلط باللغة العربية عن: ${t}`,
  mcq: t => `اكتب 5 أسئلة اختيار من متعدد (4 خيارات لكل سؤال) باللغة العربية عن: ${t}`,
  assignment: t => `اكتب واجباً تفصيلياً باللغة العربية لطلاب يدرسون: ${t}`,
  code: t => `اكتب كود مثال مع شرح باللغة العربية عن: ${t}`,
  title: t => `اقترح 3 عناوين ووصف جذاب لكل منها لدرس عن: ${t}`,
};

export default function AIPage() {
  const [activeTool, setActiveTool] = useState<Tool>('summary');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const current = tools.find(t => t.id === activeTool)!;

  const generate = async () => {
    if (!input.trim()) return;
    setLoading(true); setError(''); setResult('');
    try {
      const res = await API.post('/ai/generate', { prompt: prompts[activeTool](input) });
      setResult(res.data?.data?.text || res.data?.text || 'لا يوجد رد');
    } catch {
      setError('تعذر الاتصال بـ AI. تأكد من إعداد API في الباك إند.');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#16133a', marginBottom: 8 }}>🤖 مساعد AI للمدرس</h1>
      <p style={{ color: '#7c7a9a', fontSize: 14, marginBottom: 28 }}>وفّر وقتك — اجعل الذكاء الاصطناعي يساعدك في إنشاء المحتوى</p>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
        {/* Tools List */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 12, border: '1px solid #ebebf5', height: 'fit-content' }}>
          {tools.map(t => (
            <button key={t.id} onClick={() => { setActiveTool(t.id); setResult(''); setInput(''); }} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: activeTool === t.id ? '#eeeeff' : 'transparent',
              color: activeTool === t.id ? '#6c63ff' : '#7c7a9a',
              fontWeight: activeTool === t.id ? 700 : 500, fontSize: 14,
              fontFamily: "'Tajawal',sans-serif", textAlign: 'right',
              marginBottom: 2, transition: 'all .15s',
            }}>
              <span>{t.icon}</span><span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Generator */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #ebebf5' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#16133a', marginBottom: 20 }}>
            {current.icon} {current.label}
          </h2>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#16133a', display: 'block', marginBottom: 8 }}>الموضوع أو الفكرة</label>
            <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={current.placeholder} rows={3}
              style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #ebebf5', borderRadius: 12, fontSize: 14, fontFamily: "'Tajawal',sans-serif", outline: 'none', resize: 'vertical' }} />
          </div>

          <button onClick={generate} disabled={loading || !input.trim()} style={{
            padding: '12px 28px', background: loading ? '#a5a0ff' : 'linear-gradient(135deg,#6c63ff,#4f46e5)',
            color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14,
            fontFamily: "'Tajawal',sans-serif", cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 20,
          }}>
            {loading ? '⏳ جاري التوليد...' : '✨ توليد'}
          </button>

          {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontSize: 14 }}>{error}</div>}

          {result && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#16133a' }}>النتيجة</span>
                <button onClick={() => navigator.clipboard.writeText(result)} style={{
                  padding: '6px 14px', background: '#eeeeff', color: '#6c63ff', border: 'none',
                  borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Tajawal',sans-serif",
                }}>📋 نسخ</button>
              </div>
              <div style={{
                background: '#f9f9fd', borderRadius: 12, padding: '20px', fontSize: 14,
                color: '#16133a', lineHeight: 2, whiteSpace: 'pre-wrap', border: '1px solid #ebebf5',
                maxHeight: 400, overflowY: 'auto',
              }}>{result}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
