'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, CheckCircle2, Clock, Filter, User, Search, CornerDownLeft, Sparkles } from 'lucide-react';

export default function AdminSupportInboxPage() {
  const [questions, setQuestions] = useState([
    {
      id: 'q-1',
      studentName: 'أحمد محمود العبد',
      grade: 'أولى ثانوي',
      category: 'خوارزميات بايثون',
      date: 'منذ 15 دقيقة',
      status: 'pending', // pending, answered
      title: 'سؤال في خوارزمية البحث الخطي (Linear Search)',
      content: 'يا بشمهندس لو المصفوفة فيها عناصر مكررة، هل الخوارزمية بترجع أول عنصر ولا بتكمل لأخر المصفوفة؟',
      replyText: ''
    },
    {
      id: 'q-2',
      studentName: 'سارة خالد السيد',
      grade: 'ثانية ثانوي',
      category: 'تطبيقات الذكاء الاصطناعي',
      date: 'منذ ساعتين',
      status: 'pending',
      title: 'كيف نحدد نوع المتغير تلقائياً في بايثون؟',
      content: 'هل دالة type() بتشتغل مع الكائنات والـ Objects المخصصة ولا بس مع أنواع البيانات البسيطة؟',
      replyText: ''
    },
    {
      id: 'q-3',
      studentName: 'عمر طارق إبراهيم',
      grade: 'أولى ثانوي',
      category: 'الدعم الفني',
      date: 'أمس',
      status: 'answered',
      title: 'شحنت رصيد المحفظة ولكن الكورس لسة مظهرش',
      content: 'تم تحويل 350 ج.م كاش عبر رقم فودافون ورقم العملية 98412.',
      replyText: 'أهلاً يا عمر! تم تفعيل الكورس فوراً في حسابك وتأكيد العملية بنجاح ✅'
    }
  ]);

  const [selectedFilter, setSelectedFilter] = useState('all'); // all, pending, answered
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');

  const filteredQuestions = questions.filter(q => {
    if (selectedFilter === 'pending') return q.status === 'pending';
    if (selectedFilter === 'answered') return q.status === 'answered';
    return true;
  });

  const handleSendReply = (id: string) => {
    if (!replyInput.trim()) return;

    setQuestions(questions.map(q => {
      if (q.id === id) {
        return {
          ...q,
          status: 'answered',
          replyText: replyInput
        };
      }
      return q;
    }));

    setReplyInput('');
    setActiveReplyId(null);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 6px' }}>صندوق أسئلة واستفسارات الطلاب 💬</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>متابعة أسئلة الطلاب في المنهج والرد الفوري من المدرس أو فريق المساعدين.</p>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: 8, background: 'var(--surface)', padding: 6, borderRadius: 14, border: '1px solid var(--border)' }}>
          <button onClick={() => setSelectedFilter('all')} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer', background: selectedFilter === 'all' ? '#6C22F9' : 'transparent', color: selectedFilter === 'all' ? '#fff' : 'var(--text-main)' }}>
            جميع الأسئلة ({questions.length})
          </button>
          <button onClick={() => setSelectedFilter('pending')} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer', background: selectedFilter === 'pending' ? '#ef4444' : 'transparent', color: selectedFilter === 'pending' ? '#fff' : 'var(--text-main)' }}>
            بانتظار الرد ({questions.filter(q => q.status === 'pending').length})
          </button>
          <button onClick={() => setSelectedFilter('answered')} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer', background: selectedFilter === 'answered' ? '#10b981' : 'transparent', color: selectedFilter === 'answered' ? '#fff' : 'var(--text-main)' }}>
            تم الرد عليها ({questions.filter(q => q.status === 'answered').length})
          </button>
        </div>
      </div>

      {/* Questions Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {filteredQuestions.length === 0 ? (
          <div style={{ background: 'var(--surface)', padding: 40, borderRadius: 20, textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            لا توجد أسئلة في هذه الفئة حالياً.
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'var(--surface)', borderRadius: 18, border: '1px solid var(--border)',
                padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.03)', position: 'relative'
              }}
            >
              {/* Header Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#6C22F915', color: '#6C22F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16 }}>
                    {q.studentName.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--text-main)' }}>{q.studentName}</h4>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{q.grade} • <span style={{ color: '#6C22F9', fontWeight: 700 }}>{q.category}</span></span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={14} /> {q.date}
                  </span>
                  <span style={{
                    padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800,
                    background: q.status === 'answered' ? '#10b98115' : '#ef444415',
                    color: q.status === 'answered' ? '#10b981' : '#ef4444'
                  }}>
                    {q.status === 'answered' ? 'تم الرد ✅' : 'بانتظار الرد ⏳'}
                  </span>
                </div>
              </div>

              {/* Title & Body */}
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>{q.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 16px', background: 'var(--bg)', padding: 14, borderRadius: 12, border: '1px solid var(--border)' }}>
                {q.content}
              </p>

              {/* Existing Reply if Answered */}
              {q.replyText && (
                <div style={{ background: '#6C22F910', borderRight: '4px solid #6C22F9', padding: 14, borderRadius: '0 12px 12px 0', marginBottom: 16 }}>
                  <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 800, color: '#6C22F9' }}>ردك المعتمد:</p>
                  <p style={{ margin: 0, fontSize: 14, color: 'var(--text-main)', fontWeight: 600 }}>{q.replyText}</p>
                </div>
              )}

              {/* Reply Action */}
              <div>
                {activeReplyId === q.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                    <textarea
                      value={replyInput}
                      onChange={e => setReplyInput(e.target.value)}
                      placeholder="اكتب ردك المباشر للطالب هنا..."
                      rows={3}
                      style={{
                        width: '100%', padding: 14, borderRadius: 12, border: '1px solid var(--border)',
                        background: 'var(--bg)', color: 'var(--text-main)', outline: 'none',
                        fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box'
                      }}
                    />
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setActiveReplyId(null)}
                        style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                      >
                        إلغاء
                      </button>
                      <button
                        onClick={() => handleSendReply(q.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 8, border: 'none', background: '#6C22F9', color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}
                      >
                        <Send size={14} /> إرسال الرد للطالب
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { setActiveReplyId(q.id); setReplyInput(q.replyText || ''); }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#6C22F915', color: '#6C22F9', border: 'none', padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: 'pointer' }}
                  >
                    <CornerDownLeft size={14} /> {q.replyText ? 'تعديل الرد' : 'إضافة رد سريع'}
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

    </div>
  );
}
