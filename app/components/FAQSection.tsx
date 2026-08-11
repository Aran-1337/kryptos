'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const defaultFaqs = [
  {
    q: 'إزاي أقدر أشترك في الكورسات؟',
    a: 'الموضوع بسيط جداً! كل اللي عليك تعمله إنك تنشئ حساب جديد، وتختار الكورس أو الباقة اللي تناسبك وتضغط على اشتراك الدفع بيتم بوسائل متعددة وسهلة.'
  },
  {
    q: 'هل الكورسات مسجلة ولا لايف؟',
    a: 'معظم كورساتنا مسجلة بأعلى جودة عشان تقدر ترجعلها في أي وقت وتتعلم بالسرعة اللي تناسبك، وبنوفر كمان مراجعات لايف أسبوعية للإجابة على كل استفساراتك.'
  },
  {
    q: 'هل فيه شهادة بعد إتمام الكورس؟',
    a: 'أكيد! بمجرد إنهائك للكورس واجتياز الامتحان النهائي والمهام العملية، هتحصل على شهادة معتمدة من المنصة تقدر تضيفها للـ CV بتاعك وتثبت كفاءتك.'
  },
  {
    q: 'لو واجهتني مشكلة تقنية، أعمل إيه؟',
    a: 'فريق الدعم الفني بتاعنا متواجد دايماً لمساعدتك. تقدر تتواصل معانا عن طريق زر الواتساب أو الإيميل الخاص بالمنصة وهنحل مشكلتك فوراً.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqsList, setFaqsList] = useState(defaultFaqs);

  const loadCmsFaqs = () => {
    try {
      const saved = localStorage.getItem('cms_homepage_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.faqs && Array.isArray(parsed.faqs)) {
          setFaqsList(parsed.faqs);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCmsFaqs();
    const handleCmsUpdate = () => loadCmsFaqs();
    window.addEventListener('storage', handleCmsUpdate);
    window.addEventListener('cms_updated', handleCmsUpdate);
    return () => {
      window.removeEventListener('storage', handleCmsUpdate);
      window.removeEventListener('cms_updated', handleCmsUpdate);
    };
  }, []);

  return (
    <section style={{ padding: '100px 0', background: 'var(--bg)', borderTop: '1px solid var(--border)', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      <div className="container" style={{ margin: '0 auto', maxWidth: 800, padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(236,72,153,0.1)', color: '#ec4899',
              padding: '6px 16px', borderRadius: 30, fontSize: 14, fontWeight: 700, marginBottom: 16
            }}>
            <HelpCircle size={16} /> الأسئلة الشائعة
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
            كل الإجابات اللي <span style={{ color: '#ec4899' }}>بتدور عليها</span>
          </motion.h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {faqsList.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: 'var(--surface)',
                  borderRadius: 16,
                  border: '1px solid var(--border)',
                  overflow: 'hidden'
                }}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'right',
                    color: 'var(--text-main)',
                    fontWeight: 800,
                    fontSize: 'clamp(16px, 2vw, 18px)'
                  }}>
                  <span>{faq.q}</span>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: isOpen ? 'rgba(108,34,249,0.15)' : 'var(--bg)',
                    color: isOpen ? '#6C22F9' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s'
                  }}>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}>
                      <div style={{
                        padding: '0 24px 24px 24px',
                        color: 'var(--text-muted)',
                        fontSize: 15,
                        lineHeight: 1.8,
                        fontWeight: 500,
                        borderTop: '1px solid var(--border)'
                      }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
