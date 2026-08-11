'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, LayoutTemplate, Home, Info, BellRing, Sparkles, CheckCircle2, Plus, Trash2, HelpCircle, Award, Layers, RefreshCw, Type } from 'lucide-react';

const defaultCmsData = {
  heroHeader: {
    badge: 'المقاعد محدودة — احجز مكانك الآن ⚡️',
    titleLine1: 'ابدأ رحلتك في البرمجة',
    titleHighlight: 'بطريقتك الخاصة',
    subtitle: 'تعلم البرمجة والذكاء الاصطناعي خطوة بخطوة بلغة بسيطة ومنهج عملي. انطلق نحو مهارات عالية ومشاريع تصنع فرقاً.'
  },
  heroStats: [
    { value: '1,250+', label: 'طالب فهموا البرمجة', isAuto: true },
    { value: '4.9/5', label: 'متوسط تقييم الطلبة', isAuto: true },
    { value: '124+', label: 'ساعة شرح وتطبيق', isAuto: true },
    { value: '20+', label: 'مشروع عملي بتعمله', isAuto: true }
  ],
  whyBetter: {
    title: 'إيه اللي بيميزنا عن الباقيين؟',
    subtitle: 'مش بس كورسات، ده نظام متكامل صُمم عشان يوصلك للنتيجة اللي بتحلم بيها',
    features: [
      { title: 'ابدأ من الصفر', desc: 'هنبدأ معاك خطوة بخطوة مهما كان مستواك، لحد ما تبقى فاهم كل جزء' },
      { title: 'الفهم قبل الحفظ', desc: 'بنبسط أصعب الأفكار بطريقة سهلة تخليك تفهم وتهضم من غير تعقيد' },
      { title: 'حل وتدريب مستمر', desc: 'بعد كل شرح، فيه حل أسئلة وتطبيقات الرد المباشر وتزويد الفهم' },
      { title: 'امتحانات على كل درس', desc: 'اختبر نفسك بعد كل درس واعرف نقاط قوتك والأجزاء اللي محتاجة مراجعة' },
      { title: 'مراجعات شاملة', desc: 'مراجعات منظمة تجمع المنهج بالكامل وتثبت أهم النقاط قبل الامتحان' },
      { title: 'متابعة مستواك', desc: 'اعرف تقدمك أول بأول وشوف نقاط القوة والأجزاء اللي محتاجة تحسين' },
      { title: 'استعداد للامتحانات', desc: 'تدريب على شكل الامتحان وأسئلة متنوعة تساعدك تحقق أعلى الدرجات' },
      { title: 'دعم في أي وقت', desc: 'ارجع للدروس في أي وقت وذاكر بالسرعة اللي تناسبك ومن أي مكان' }
    ]
  },
  faqs: [
    { id: 1, q: 'إزاي أقدر أشترك في الكورسات؟', a: 'الموضوع بسيط جداً! كل اللي عليك تعمله إنك تنشئ حساب جديد، وتختار الكورس أو الباقة اللي تناسبك وتضغط على اشتراك. الدفع بيتم بوسائل متعددة وسهلة.' },
    { id: 2, q: 'هل الكورسات مسجلة ولا لايف؟', a: 'المنصة تجمع بين الشرح المسجل عالي الدقة والمشاهدة في أي وقت، مع حصص بث مباشر أسبوعية للمراجعة والرد على الأسئلة.' },
    { id: 3, q: 'هل فيه شهادة بعد إتمام الكورس؟', a: 'نعم! بمجرد إتمام الكورس واجتياز الامتحانات بنجاح، بتنزل لك شهادة معتمدة موثقة برقم مسلسل يمكنك تحميلها.' },
    { id: 4, q: 'لو واجهتني مشكلة تقنية، أعمل إيه؟', a: 'فريق الدعم الفني متواجد 24/7 لمساعدتك عبر الشات المباشر أو الواتساب فوراً.' }
  ],
  cta: {
    title: 'مستعد تبدأ رحلتك في عالم البرمجة؟',
    subtitle: 'انضم لآلاف الطلاب اللي غيروا مستقبلهم معانا. مفيش وقت أنسب من دلوقتي عشان تستثمر في نفسك وتتعلم مهارات المستقبل.',
    buttonText: 'أنشئ حسابك مجاناً ←'
  }
};

export default function AdminCMSPage() {
  const [cmsData, setCmsData] = useState(defaultCmsData);
  const [activeTab, setActiveTab] = useState<'hero' | 'stats' | 'features' | 'faqs' | 'cta'>('hero');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cms_homepage_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCmsData({
          ...defaultCmsData,
          ...parsed,
          heroHeader: { ...defaultCmsData.heroHeader, ...parsed.heroHeader }
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSaveAll = () => {
    localStorage.setItem('cms_homepage_data', JSON.stringify(cmsData));
    window.dispatchEvent(new Event('cms_updated'));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleStatChange = (index: number, field: 'value' | 'label', val: string) => {
    const newStats = [...cmsData.heroStats];
    newStats[index][field] = val;
    setCmsData({ ...cmsData, heroStats: newStats });
  };

  const handleFeatureChange = (index: number, field: 'title' | 'desc', val: string) => {
    const newFeat = [...cmsData.whyBetter.features];
    newFeat[index][field] = val;
    setCmsData({ ...cmsData, whyBetter: { ...cmsData.whyBetter, features: newFeat } });
  };

  const handleFaqChange = (index: number, field: 'q' | 'a', val: string) => {
    const newFaqs = [...cmsData.faqs];
    newFaqs[index][field] = val;
    setCmsData({ ...cmsData, faqs: newFaqs });
  };

  const handleAddFaq = () => {
    const newFaq = { id: Date.now(), q: 'سؤال جديد...', a: 'الإجابة الشافية هنا...' };
    setCmsData({ ...cmsData, faqs: [...cmsData.faqs, newFaq] });
  };

  const handleDeleteFaq = (index: number) => {
    const newFaqs = cmsData.faqs.filter((_, i) => i !== index);
    setCmsData({ ...cmsData, faqs: newFaqs });
  };

  return (
    <div style={{ width: '100%', fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 6px' }}>التحكم الكامل في نصوص الهيرو والصفحة الرئيسية (CMS) ⚙️</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>تحديد جملة الهيرو الملونة بالبنفسجي، العنوان، الوصف، الإحصائيات التلقائية، والمميزات بنقرة زر.</p>
        </div>

        <button 
          onClick={handleSaveAll}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#10b981', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 900, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.35)' }}
        >
          <Save size={18} /> {isSaved ? 'تم الحفظ وتحديث المنصة ✅' : 'حفظ التعديلات فوراً'}
        </button>
      </div>

      {/* Main Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 16, flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('hero')}
          style={{ padding: '10px 20px', borderRadius: 12, border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer', background: activeTab === 'hero' ? '#6C22F9' : 'var(--surface)', color: activeTab === 'hero' ? '#fff' : 'var(--text-main)', border: '1px solid var(--border)' }}
        >
          ✨ عنوان ووصف الهيرو (Hero Title & Highlight)
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          style={{ padding: '10px 20px', borderRadius: 12, border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer', background: activeTab === 'stats' ? '#6C22F9' : 'var(--surface)', color: activeTab === 'stats' ? '#fff' : 'var(--text-main)', border: '1px solid var(--border)' }}
        >
          📊 الإحصائيات التلقائية (Stats)
        </button>
        <button 
          onClick={() => setActiveTab('features')}
          style={{ padding: '10px 20px', borderRadius: 12, border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer', background: activeTab === 'features' ? '#6C22F9' : 'var(--surface)', color: activeTab === 'features' ? '#fff' : 'var(--text-main)', border: '1px solid var(--border)' }}
        >
          ⚡️ مميزات المنصة (Why Better)
        </button>
        <button 
          onClick={() => setActiveTab('faqs')}
          style={{ padding: '10px 20px', borderRadius: 12, border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer', background: activeTab === 'faqs' ? '#6C22F9' : 'var(--surface)', color: activeTab === 'faqs' ? '#fff' : 'var(--text-main)', border: '1px solid var(--border)' }}
        >
          ❓ الأسئلة الشائعة (FAQ)
        </button>
        <button 
          onClick={() => setActiveTab('cta')}
          style={{ padding: '10px 20px', borderRadius: 12, border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer', background: activeTab === 'cta' ? '#6C22F9' : 'var(--surface)', color: activeTab === 'cta' ? '#fff' : 'var(--text-main)', border: '1px solid var(--border)' }}
        >
          🚀 بنر التسجيل والدعوة (CTA)
        </button>
      </div>

      {/* Tab 0: Hero Title & Color Highlight Controller */}
      {activeTab === 'hero' && (
        <div style={{ background: 'var(--surface)', padding: 28, borderRadius: 20, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', marginBottom: 20 }}>التحكم في نصوص واجهة الهيرو وتحديد الكلمة الملونة بالبنفسجي</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>السطر الأول من العنوان الرئيسي (اللون الداكن/العادي)</label>
              <input 
                type="text" 
                value={cmsData.heroHeader.titleLine1} 
                onChange={e => setCmsData({ ...cmsData, heroHeader: { ...cmsData.heroHeader, titleLine1: e.target.value } })}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontWeight: 900, fontSize: 16, outline: 'none', fontFamily: 'Tajawal, sans-serif' }}
              />
            </div>

            <div style={{ background: 'rgba(108,34,249,0.06)', padding: 16, borderRadius: 14, border: '1px dashed #6C22F9' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#6C22F9', marginBottom: 6 }}>الكلمة أو الجملة الملونة بالبنفسجي المميز (Purple Gradient Highlight) 🎨</label>
              <input 
                type="text" 
                value={cmsData.heroHeader.titleHighlight} 
                onChange={e => setCmsData({ ...cmsData, heroHeader: { ...cmsData.heroHeader, titleHighlight: e.target.value } })}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '2px solid #6C22F9', background: 'var(--surface)', color: '#6C22F9', fontWeight: 900, fontSize: 16, outline: 'none', fontFamily: 'Tajawal, sans-serif' }}
              />
              <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, display: 'block' }}>أي نص تكتبه هنا يظهر فوراً باللون البنفسجي الساطع المتدرج في السطر الثاني من الهيرو!</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>نص البادج الترحيبي أعلى الهيرو (Hero Badge)</label>
              <input 
                type="text" 
                value={cmsData.heroHeader.badge} 
                onChange={e => setCmsData({ ...cmsData, heroHeader: { ...cmsData.heroHeader, badge: e.target.value } })}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontWeight: 700, fontSize: 14, outline: 'none', fontFamily: 'Tajawal, sans-serif' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>الوصف الفرعي للهيرو (Hero Subtitle / Description)</label>
              <textarea 
                rows={3}
                value={cmsData.heroHeader.subtitle} 
                onChange={e => setCmsData({ ...cmsData, heroHeader: { ...cmsData.heroHeader, subtitle: e.target.value } })}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 14, outline: 'none', fontFamily: 'Tajawal, sans-serif', resize: 'vertical' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Hero Stats Controller */}
      {activeTab === 'stats' && (
        <div style={{ background: 'var(--surface)', padding: 28, borderRadius: 20, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ background: 'rgba(16,185,129,0.1)', padding: 16, borderRadius: 14, border: '1px solid rgba(16,185,129,0.3)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <RefreshCw size={20} color="#10b981" />
            <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-main)', fontWeight: 700 }}>
              💡 الأرقام أدناه تُحسب وتتحدث أوتوماتيكياً حسب تقييمات الطلاب الحقيقية، عدد ساعات الكورسات المرفوعة، وعدد الطلاب المسجلين بالمنصة.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {cmsData.heroStats.map((stat, idx) => (
              <div key={idx} style={{ background: 'var(--bg)', padding: 20, borderRadius: 16, border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#6C22F9', display: 'block', marginBottom: 10 }}>الرقم الإحصائي #{idx + 1}</span>
                
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>القيمة والرقم (أوتوماتيكي أو يدوي)</label>
                  <input 
                    type="text" 
                    value={stat.value} 
                    onChange={e => handleStatChange(idx, 'value', e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontWeight: 800, fontSize: 15, outline: 'none', fontFamily: 'Tajawal, sans-serif' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>النص والوصف (مثال: متوسط تقييم الطلبة)</label>
                  <input 
                    type="text" 
                    value={stat.label} 
                    onChange={e => handleStatChange(idx, 'label', e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontWeight: 700, fontSize: 13, outline: 'none', fontFamily: 'Tajawal, sans-serif' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Why Better Features Grid Controller */}
      {activeTab === 'features' && (
        <div style={{ background: 'var(--surface)', padding: 28, borderRadius: 20, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', marginBottom: 20 }}>تعديل عنوان ونصوص كروت "إيه اللي بيميزنا عن الباقيين؟"</h3>

          <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>عنوان القسم الرئيسي</label>
            <input 
              type="text" 
              value={cmsData.whyBetter.title} 
              onChange={e => setCmsData({ ...cmsData, whyBetter: { ...cmsData.whyBetter, title: e.target.value } })}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontWeight: 900, fontSize: 16, outline: 'none', fontFamily: 'Tajawal, sans-serif' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {cmsData.whyBetter.features.map((feat, idx) => (
              <div key={idx} style={{ background: 'var(--bg)', padding: 20, borderRadius: 16, border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#6C22F9', display: 'block', marginBottom: 10 }}>كارت الميزة #{idx + 1}</span>
                
                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>عنوان الكارت</label>
                  <input 
                    type="text" 
                    value={feat.title} 
                    onChange={e => handleFeatureChange(idx, 'title', e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontWeight: 800, fontSize: 14, outline: 'none', fontFamily: 'Tajawal, sans-serif' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>الوصف المكتوب</label>
                  <textarea 
                    rows={2} 
                    value={feat.desc} 
                    onChange={e => handleFeatureChange(idx, 'desc', e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 13, outline: 'none', fontFamily: 'Tajawal, sans-serif', resize: 'vertical' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: FAQs Manager */}
      {activeTab === 'faqs' && (
        <div style={{ background: 'var(--surface)', padding: 28, borderRadius: 20, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>إدارة الأسئلة الشائعة والإجابات (FAQ)</h3>
            <button 
              onClick={handleAddFaq}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#6C22F9', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 10, fontWeight: 800, fontSize: 13, cursor: 'pointer' }}
            >
              <Plus size={16} /> إضافة سؤال جديد
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {cmsData.faqs.map((faq, idx) => (
              <div key={faq.id || idx} style={{ background: 'var(--bg)', padding: 20, borderRadius: 16, border: '1px solid var(--border)', position: 'relative' }}>
                <button 
                  onClick={() => handleDeleteFaq(idx)}
                  style={{ position: 'absolute', top: 16, left: 16, background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  title="حذف هذا السؤال"
                >
                  <Trash2 size={18} />
                </button>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>السؤال المطروح</label>
                  <input 
                    type="text" 
                    value={faq.q} 
                    onChange={e => handleFaqChange(idx, 'q', e.target.value)}
                    style={{ width: '90%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontWeight: 800, fontSize: 14, outline: 'none', fontFamily: 'Tajawal, sans-serif' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>الإجابة المفصلة</label>
                  <textarea 
                    rows={3} 
                    value={faq.a} 
                    onChange={e => handleFaqChange(idx, 'a', e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 13, outline: 'none', fontFamily: 'Tajawal, sans-serif', resize: 'vertical' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: CTA Banner Controller */}
      {activeTab === 'cta' && (
        <div style={{ background: 'var(--surface)', padding: 28, borderRadius: 20, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', marginBottom: 20 }}>تعديل نصوص بنر التسجيل والدعوة السفلي (CTA Banner)</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>عنوان البنر الرئيسي</label>
              <input 
                type="text" 
                value={cmsData.cta.title} 
                onChange={e => setCmsData({ ...cmsData, cta: { ...cmsData.cta, title: e.target.value } })}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontWeight: 900, fontSize: 16, outline: 'none', fontFamily: 'Tajawal, sans-serif' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>الوصف الفرعي للبنر</label>
              <textarea 
                rows={3} 
                value={cmsData.cta.subtitle} 
                onChange={e => setCmsData({ ...cmsData, cta: { ...cmsData.cta, subtitle: e.target.value } })}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 14, outline: 'none', fontFamily: 'Tajawal, sans-serif', resize: 'vertical' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>نص زرار الاشتراك والتسجيل</label>
              <input 
                type="text" 
                value={cmsData.cta.buttonText} 
                onChange={e => setCmsData({ ...cmsData, cta: { ...cmsData.cta, buttonText: e.target.value } })}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: '#6C22F9', fontWeight: 900, fontSize: 15, outline: 'none', fontFamily: 'Tajawal, sans-serif' }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
