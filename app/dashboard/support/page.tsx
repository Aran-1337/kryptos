'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, PhoneCall, HelpCircle, CheckCircle2, Clock, Image as ImageIcon, Code, Plus, ArrowLeft } from 'lucide-react';

export default function StudentSupportPage() {
  const [questions, setQuestions] = useState([
    {
      id: 'q-1',
      title: 'سؤال في خوارزمية البحث الخطي (Linear Search)',
      category: 'أولى ثانوي',
      date: '06 أغسطس 2026',
      status: 'تم الرد من المدرس ✅',
      content: 'يا بشمهندس لو المصفوفة فيها عناصر مكررة، هل الخوارزمية بترجع أول عنصر ولا بتكمل؟',
      reply: 'أهلاً يا أحمد! الخوارزمية بشكل افتراضي بتتوقف وترجع أول دالة مطابقة (Index)، ولكن تقدر تعدل الـ Loop بحيث تجمع كل الأماكن المكررة في List.'
    },
    {
      id: 'q-2',
      title: 'مشكلة في تفعيل كورس ثانية ثانوي',
      category: 'الدعم الفني',
      date: '05 أغسطس 2026',
      status: 'قيد المراجعة ⏳',
      content: 'شحنت رصيد المحفظة ولكن الكورس لسة مظهرش في قائمة كورساتي.',
      reply: null
    }
  ]);

  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState('أولى ثانوي');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showWhatsappBanner, setShowWhatsappBanner] = useState(true);
  const [whatsappPhone, setWhatsappPhone] = useState('201012345678');

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('brand_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.showWhatsappBanner !== undefined) {
          setShowWhatsappBanner(parsed.showWhatsappBanner);
        }
        if (parsed.phone) {
          const clean = parsed.phone.replace(/[^0-9]/g, '');
          setWhatsappPhone(clean.startsWith('20') ? clean : '2' + clean.replace(/^0/, ''));
        }
      }
    } catch {}
  };

  useEffect(() => {
    loadSettings();
    window.addEventListener('brand_settings_updated', loadSettings);
    return () => window.removeEventListener('brand_settings_updated', loadSettings);
  }, []);

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionTitle.trim() || !newQuestionContent.trim()) return;

    const newQ = {
      id: Date.now().toString(),
      title: newQuestionTitle,
      category: newQuestionCategory,
      date: 'اليوم',
      status: 'تم الإرسال للمدرس ⏳',
      content: newQuestionContent,
      reply: null
    };

    setQuestions([newQ, ...questions]);
    setNewQuestionTitle('');
    setNewQuestionContent('');
    setShowForm(false);
  };

  return (
    <div style={{ maxWidth: 950, margin: '0 auto', fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 6px' }}>تواصل مع المدرس والدعم المباشر 💬</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>اطرح أي سؤال في المنهج أو البرمجة وسيقوم المهندس عبدالرحمن بالرد عليك فوراً.</p>
        </div>

        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#6C22F9', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(108,34,249,0.35)' }}
        >
          <Plus size={18} /> طرح سؤال جديد للمدرس
        </button>
      </div>

      {/* New Question Form Card */}
      {showForm && (
        <motion.form 
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmitQuestion}
          style={{ background: 'var(--surface)', padding: 28, borderRadius: 20, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--text-main)' }}>إضافة استفسار أو سؤال برمجي جديد</h3>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>عنوان السؤال المختصر</label>
            <input 
              type="text" 
              value={newQuestionTitle} 
              onChange={e => setNewQuestionTitle(e.target.value)} 
              placeholder="مثال: استفسار في خوارزمية Loops في بايثون..."
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', outline: 'none', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>القسم أو المرحلة</label>
            <select 
              value={newQuestionCategory} 
              onChange={e => setNewQuestionCategory(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', outline: 'none', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif' }}
            >
              <option value="أولى ثانوي">أولى ثانوي (Programming & AI)</option>
              <option value="ثانية ثانوي">ثانية ثانوي (Python Algorithms)</option>
              <option value="تأسيس البرمجة">تأسيس البرمجة من الصفر</option>
              <option value="الدعم الفني والاشتراكات">الدعم الفني والاشتراكات</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>تفاصيل السؤال والكود</label>
            <textarea 
              rows={4} 
              value={newQuestionContent} 
              onChange={e => setNewQuestionContent(e.target.value)} 
              placeholder="اكتب سؤالك بالتفصيل، ويمكنك إرفاق أجزاء من الكود أو أي استفسار..."
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', outline: 'none', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: 'var(--bg)', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer' }}>إلغاء</button>
            <button type="submit" style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#6C22F9', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>إرسال للمدرس</button>
          </div>
        </motion.form>
      )}

      {/* Direct WhatsApp Call Banner */}
      {showWhatsappBanner && (
        <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: 20, padding: 24, color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 32, boxShadow: '0 8px 24px rgba(16,185,129,0.25)' }}>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 900, color: '#fff' }}>تحتاج إجابة وتواصل مباشر جداً عبر الواتساب؟ ⚡️</h3>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.9 }}>تواصل مع المهندس عبدالرحمن مباشرة للمساعدة في أي مسألة أو كود برمجي.</p>
          </div>
          <a 
            href={`https://wa.me/${whatsappPhone}`} target="_blank" rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#065f46', padding: '12px 24px', borderRadius: 12, fontWeight: 900, fontSize: 14, textDecoration: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
          >
            <PhoneCall size={18} /> مراسلة الواتساب المباشر
          </a>
        </div>
      )}

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {questions.map(q => (
          <div key={q.id} style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: 'rgba(108,34,249,0.12)', color: '#6C22F9', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>
                  {q.category}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>• {q.date}</span>
              </div>

              <span style={{ fontSize: 12, fontWeight: 800, color: q.reply ? '#10b981' : '#f59e0b' }}>
                {q.status}
              </span>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 10px' }}>{q.title}</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.7, background: 'var(--bg)', padding: 14, borderRadius: 12 }}>
              {q.content}
            </p>

            {/* Teacher Reply */}
            {q.reply && (
              <div style={{ background: 'rgba(108,34,249,0.08)', borderRight: '4px solid #6C22F9', padding: 16, borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <strong style={{ fontSize: 13, color: '#6C22F9' }}>رد المهندس عبدالرحمن حامد:</strong>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--text-main)', lineHeight: 1.7, fontWeight: 600 }}>
                  {q.reply}
                </p>
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}
