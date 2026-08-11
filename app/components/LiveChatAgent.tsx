'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, PhoneCall, Sparkles, Check, ArrowRight, ExternalLink, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveChatAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'bot',
      text: 'أهلاً بك! أنا المساعد الذكي للمهندس عبدالرحمن حامد 👋 كيف يمكنني مساعدتك اليوم؟',
      time: 'الآن'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Dynamic Bot Replies State
  const [botWhatsappReply, setBotWhatsappReply] = useState('يمكنك التواصل المباشر مع المهندس عبدالرحمن حامد وفريق الدعم عبر الواتساب فوراً: https://wa.me/201012345678 🟢');
  const [botCoursesReply, setBotCoursesReply] = useState('نقدم كورسات كاملة وشاملة في البرمجة والذكاء الاصطناعي لصفوف أولى ثانوي وثانية ثانوي وتأسيس البرمجة من الصفر. تشمل الشرح، التطبيقات العملية، الامتحانات المجدولة والشهادات!');
  const [botPaymentReply, setBotPaymentReply] = useState('يمكنك الاشتراك بسهولة عبر محفظة الطالب الرقمية أو التحويل عبر فودافون كاش (01012345678)، InstaPay، أو فوري وأمان والتفعيل فوري ⚡️');
  const [botBooksReply, setBotBooksReply] = useState('نوفر نوعين من المذكرات في قسم (الكتب والمذكرات): مذكرات مطبوعة ورقية تصلك لشحن المنزل بكافة المحافظات، أو مكتبة رقمية لتحميل الـ PDF فوراً!');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadBotSettings = () => {
    try {
      const saved = localStorage.getItem('brand_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.botWhatsappReply) setBotWhatsappReply(parsed.botWhatsappReply);
        if (parsed.botCoursesReply) setBotCoursesReply(parsed.botCoursesReply);
        if (parsed.botPaymentReply) setBotPaymentReply(parsed.botPaymentReply);
        if (parsed.botBooksReply) setBotBooksReply(parsed.botBooksReply);
      }
    } catch {}
  };

  useEffect(() => {
    loadBotSettings();
    window.addEventListener('brand_settings_updated', loadBotSettings);
    return () => window.removeEventListener('brand_settings_updated', loadBotSettings);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickQuestions = [
    'ماهي كورسات أولى وثانية ثانوي المتاحة؟',
    'كيف أشحن رصيد المحفظة وأشترك؟',
    'هل المذكرات مطبوعة وتصل للمنزل؟',
    'أحتاج التحدث مع المدرس مباشرة 👨‍🏫'
  ];

  const getBotReply = (userQuery: string) => {
    const q = userQuery.toLowerCase();
    
    if (q.includes('مدرس') || q.includes('تحدث') || q.includes('ادمن') || q.includes('أدمن') || q.includes('مباشرة') || q.includes('دعم')) {
      return botWhatsappReply;
    }

    if (q.includes('كورسات') || q.includes('أولى') || q.includes('ثانية') || q.includes('تأسيس')) {
      return botCoursesReply;
    }

    if (q.includes('شحن') || q.includes('محفظة') || q.includes('دفع') || q.includes('اشترك')) {
      return botPaymentReply;
    }

    if (q.includes('مذكرة') || q.includes('مذكرات') || q.includes('كتاب') || q.includes('شحن')) {
      return botBooksReply;
    }

    return 'شكراً لتواصلك! يمكنك مراجعة الكورسات المتاحة، أو شحن محفظتك، أو التواصل عبر الواتساب للمساعدة.';
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = { id: Date.now().toString(), sender: 'user', text: query, time: 'الآن' };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    setIsTyping(true);

    setTimeout(() => {
      const botAnswer = getBotReply(query);
      const botMsg = { id: (Date.now() + 1).toString(), sender: 'bot', text: botAnswer, time: 'الآن' };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: 28, left: 28, zIndex: 999,
          background: 'linear-gradient(135deg, #6C22F9 0%, #4f46e5 100%)',
          color: '#fff', border: 'none', borderRadius: '50%',
          width: 62, height: 62, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(108,34,249,0.45)', cursor: 'pointer', overflow: 'hidden'
        }}
        title="مساعد م. عبدالرحمن الذكي"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        <span style={{ position: 'absolute', top: 2, right: 2, width: 14, height: 14, background: '#10b981', borderRadius: '50%', border: '2px solid #fff' }} />
      </motion.button>

      {/* Floating Live Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{
              position: 'fixed', bottom: 100, left: 28, zIndex: 1000,
              width: 'min(90vw, 380px)', height: 530, background: 'var(--surface)',
              borderRadius: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              border: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
              overflow: 'hidden', fontFamily: 'Tajawal, sans-serif', direction: 'rtl'
            }}
          >
            
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #16133a, #2d2870)', padding: '16px 20px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={22} color="#a78bfa" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: '#fff' }}>مساعد م. عبدالرحمن الذكي 🤖</h3>
                  <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> متصل الآن (رد فوري)
                  </span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {/* Messages Body */}
            <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--bg)' }}>
              {messages.map(m => (
                <div 
                  key={m.id}
                  style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: m.sender === 'user' ? 'flex-start' : 'flex-end',
                  }}
                >
                  <div style={{
                    maxWidth: '82%', padding: '10px 14px', borderRadius: 16, fontSize: 13, lineHeight: 1.6, fontWeight: 600,
                    background: m.sender === 'user' ? '#6C22F9' : 'var(--surface)',
                    color: m.sender === 'user' ? '#fff' : 'var(--text-main)',
                    border: m.sender === 'user' ? 'none' : '1px solid var(--border)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}>
                    {m.text}
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, paddingInline: 4 }}>{m.time}</span>
                </div>
              ))}

              {isTyping && (
                <div style={{ display: 'flex', gap: 6, padding: '10px 14px', background: 'var(--surface)', borderRadius: 16, width: 'fit-content', border: '1px solid var(--border)' }}>
                  <span style={{ width: 6, height: 6, background: '#6C22F9', borderRadius: '50%', animation: 'ping 1s infinite' }} />
                  <span style={{ width: 6, height: 6, background: '#6C22F9', borderRadius: '50%', animation: 'ping 1s infinite 0.2s' }} />
                  <span style={{ width: 6, height: 6, background: '#6C22F9', borderRadius: '50%', animation: 'ping 1s infinite 0.4s' }} />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div style={{ padding: '8px 12px', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', gap: 6, overflowX: 'auto', whiteSpace: 'nowrap' }}>
              {quickQuestions.map((q, i) => (
                <button
                  key={i} onClick={() => handleSend(q)}
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Field */}
            <div style={{ padding: 12, background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="اكتب استفسارك هنا..."
                style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: '1px solid var(--border)', outline: 'none', fontSize: 13, background: 'var(--bg)', color: 'var(--text-main)', fontFamily: 'Tajawal, sans-serif' }}
              />
              <button
                onClick={() => handleSend()}
                style={{ width: 42, height: 42, borderRadius: 12, background: '#6C22F9', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(108,34,249,0.3)' }}
              >
                <Send size={18} />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
