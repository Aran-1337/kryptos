'use client';
import { useState, useEffect } from 'react';
import { Save, User, Mail, Users, Share2, Image as ImageIcon, Globe, CheckCircle2, Upload, FileImage, Bot, MessageSquare, GraduationCap, ToggleLeft, ToggleRight, Plus, Trash2, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAcademicGrades, saveAcademicGrades, AcademicGrade } from '../../utils/academicGrades';

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState('منصة المهندس عبدالرحمن حامد');
  const [siteDesc, setSiteDesc] = useState('منصة تعليمية احترافية في مجالات البرمجة والذكاء الاصطناعي، خطوتك الأولى لاحتراف التكنولوجيا.');
  
  // Logos & Tab Settings
  const [desktopLogo, setDesktopLogo] = useState('/Logo-cropped.png');
  const [mobileLogo, setMobileLogo] = useState('/mobile-logo.png');
  const [tabIcon, setTabIcon] = useState('/logo-only.png');
  const [tabTitle, setTabTitle] = useState('منصة المهندس عبدالرحمن حامد | البرمجة والذكاء الاصطناعى');

  const [email, setEmail] = useState('info@abdelrahmanhamed.com');
  const [phone, setPhone] = useState('+20 100 000 0000');
  const [youtube, setYoutube] = useState('https://youtube.com/@abdelrahmanhamed');
  const [tiktok, setTiktok] = useState('https://tiktok.com/@abdelrahmanhamed');
  const [facebook, setFacebook] = useState('https://facebook.com/abdelrahmanhamed');
  const [whatsappGroup, setWhatsappGroup] = useState('https://whatsapp.com/channel/...');
  const [fbGroup, setFbGroup] = useState('https://facebook.com/groups/...');
  const [telegram, setTelegram] = useState('https://t.me/...');

  // Academic Grades State
  const [grades, setGrades] = useState<AcademicGrade[]>([]);
  const [newGradeName, setNewGradeName] = useState('');

  const [showWhatsappBanner, setShowWhatsappBanner] = useState(true);

  // AI Bot Answers Modal & State
  const [showBotModal, setShowBotModal] = useState(false);
  const [botWhatsappReply, setBotWhatsappReply] = useState('يمكنك التواصل المباشر مع المهندس عبدالرحمن حامد وفريق الدعم عبر الواتساب فوراً: https://wa.me/201012345678 🟢');
  const [botCoursesReply, setBotCoursesReply] = useState('نقدم كورسات كاملة وشاملة في البرمجة والذكاء الاصطناعي لصفوف أولى ثانوي وثانية ثانوي وتأسيس البرمجة من الصفر. تشمل الشرح، التطبيقات العملية، الامتحانات المجدولة والشهادات!');
  const [botPaymentReply, setBotPaymentReply] = useState('يمكنك الاشتراك بسهولة عبر محفظة الطالب الرقمية أو التحويل عبر فودافون كاش (01012345678)، InstaPay، أو فوري وأمان والتفعيل فوري ⚡️');
  const [botBooksReply, setBotBooksReply] = useState('نوفر نوعين من المذكرات في قسم (الكتب والمذكرات): مذكرات مطبوعة ورقية تصلك لشحن المنزل بكافة المحافظات، أو مكتبة رقمية لتحميل الـ PDF فوراً!');

  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    setGrades(getAcademicGrades());

    try {
      const saved = localStorage.getItem('brand_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.siteName) setSiteName(parsed.siteName);
        if (parsed.siteDesc) setSiteDesc(parsed.siteDesc);
        if (parsed.desktopLogo) setDesktopLogo(parsed.desktopLogo);
        if (parsed.mobileLogo) setMobileLogo(parsed.mobileLogo);
        if (parsed.tabIcon) setTabIcon(parsed.tabIcon);
        if (parsed.tabTitle) setTabTitle(parsed.tabTitle);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.youtube) setYoutube(parsed.youtube);
        if (parsed.tiktok) setTiktok(parsed.tiktok);
        if (parsed.facebook) setFacebook(parsed.facebook);
        if (parsed.whatsappGroup) setWhatsappGroup(parsed.whatsappGroup);
        if (parsed.fbGroup) setFbGroup(parsed.fbGroup);
        if (parsed.telegram) setTelegram(parsed.telegram);
        if (parsed.showWhatsappBanner !== undefined) setShowWhatsappBanner(parsed.showWhatsappBanner);

        // Load Bot Replies
        if (parsed.botWhatsappReply) setBotWhatsappReply(parsed.botWhatsappReply);
        if (parsed.botCoursesReply) setBotCoursesReply(parsed.botCoursesReply);
        if (parsed.botPaymentReply) setBotPaymentReply(parsed.botPaymentReply);
        if (parsed.botBooksReply) setBotBooksReply(parsed.botBooksReply);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleToggleGrade = (id: string) => {
    const updated = grades.map(g => g.id === id ? { ...g, active: !g.active } : g);
    setGrades(updated);
    saveAcademicGrades(updated);
  };

  const handleAddGrade = () => {
    if (!newGradeName.trim()) return;
    const newG: AcademicGrade = {
      id: 'g-' + Date.now(),
      name: newGradeName.trim(),
      subtitle: 'مرحلة دراسية مخصصة',
      desc: 'محتوى تعليمي شامل لهذه المرحلة الدراسية.',
      img: '/th1.webp',
      href: `/courses?grade=${grades.length + 1}`,
      active: true
    };
    const updated = [...grades, newG];
    setGrades(updated);
    saveAcademicGrades(updated);
    setNewGradeName('');
  };

  const [deleteGradeTarget, setDeleteGradeTarget] = useState<{ id: string; name: string } | null>(null);

  const handleDeleteGrade = (id: string, name: string) => {
    setDeleteGradeTarget({ id, name });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setter(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    const brandData = {
      siteName, siteDesc, desktopLogo, mobileLogo, tabIcon, tabTitle,
      email, phone, youtube, tiktok, facebook, whatsappGroup, fbGroup, telegram,
      showWhatsappBanner,
      botWhatsappReply, botCoursesReply, botPaymentReply, botBooksReply
    };

    localStorage.setItem('brand_settings', JSON.stringify(brandData));
    window.dispatchEvent(new Event('brand_settings_updated'));
    saveAcademicGrades(grades);

    // Dynamically update document title & favicon instantly
    if (typeof document !== 'undefined') {
      document.title = tabTitle;
      const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (favicon) {
        favicon.href = tabIcon;
      }
    }

    setSavedMsg('✅ تم حفظ جميع الإعدادات والشعارات ورُدود المساعد بنجاح!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', maxWidth: 1280, margin: '0 auto', fontFamily: 'Tajawal, sans-serif', direction: 'rtl', position: 'relative' }}>
      
      {/* Toast Notification */}
      {savedMsg && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--surface)', color: 'var(--text-main)', padding: '12px 24px', borderRadius: 12,
            fontWeight: 800, zIndex: 9999, boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            border: '1px solid var(--border)', fontFamily: 'Tajawal, sans-serif'
          }}
        >
          {savedMsg}
        </motion.div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 6 }}>الإعدادات وهوية المنصة ⚙️</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>تحكم كامل في الصفوف الدراسية، بيانات المنصة الأساسية، وسائل التواصل، وشعارات الموقع.</p>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowBotModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', color: '#6C22F9', border: '1.5px solid #6C22F9', padding: '12px 20px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
          >
            <Bot size={18} /> تخصيص الردود الآلية للمساعد الذكي 🤖
          </button>

          <button
            onClick={handleSaveSettings}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(108,34,249,0.3)', fontFamily: 'Tajawal, sans-serif' }}
          >
            <Save size={18} /> حفظ التغييرات
          </button>
        </div>
      </div>

      {/* 2-Column Responsive Grid Layout for Platform Core Settings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: 24, width: '100%' }}>
        
        {/* Section 1: Basic Platform Info */}
        <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={20} color="#6C22F9" /> 1. البيانات الأساسية للمنصة والدعم
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>اسم المنصة</label>
              <input type="text" value={siteName} onChange={e => setSiteName(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13.5, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>وصف المنصة (يظهر في محركات البحث وفي الفوتر)</label>
              <textarea value={siteDesc} onChange={e => setSiteDesc(e.target.value)} rows={3} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13.5, fontFamily: 'Tajawal, sans-serif', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>البريد الإلكتروني الرسمي</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', textAlign: 'left', boxSizing: 'border-box' }} dir="ltr" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>رقم واتساب الدعم الفني</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', textAlign: 'left', boxSizing: 'border-box' }} dir="ltr" />
              </div>
            </div>

            {/* WhatsApp Banner Toggle Control */}
            <div style={{ background: 'var(--bg)', padding: '14px 16px', borderRadius: 12, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
              <div>
                <label style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: 2 }}>
                  إظهار بنر "مراسلة الواتساب المباشر" للطلاب 🟢
                </label>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>التحكم في ظهور أو إخفاء بنر التواصل عبر الواتساب في صفحة الطالب</span>
              </div>
              <button
                type="button"
                onClick={() => setShowWhatsappBanner(!showWhatsappBanner)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: showWhatsappBanner ? '#10b981' : 'var(--text-muted)' }}
              >
                {showWhatsappBanner ? <ToggleRight size={34} /> : <ToggleLeft size={34} />}
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Logos & Favicon Upload */}
        <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ImageIcon size={20} color="#6C22F9" /> 2. رفع شعارات المنصة وأيقونة المتصفح (Logos & Favicon)
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Desktop Logo */}
            <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 14, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text-main)' }}>شعار الكمبيوتر (Desktop Logo)</label>
                <label htmlFor="upload-desktop" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#6C22F9', color: '#fff', padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>
                  <Upload size={13} /> رفع صورة
                </label>
                <input id="upload-desktop" type="file" accept="image/*" onChange={e => handleFileUpload(e, setDesktopLogo)} style={{ display: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 80, height: 44, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, flexShrink: 0, overflow: 'hidden' }}>
                  <img src={desktopLogo} alt="Desktop Preview" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
                <input type="text" value={desktopLogo} onChange={e => setDesktopLogo(e.target.value)} placeholder="/Logo-cropped.png" style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', outline: 'none', fontSize: 12.5, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
              </div>
            </div>

            {/* Mobile Logo */}
            <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 14, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text-main)' }}>شعار الموبايل (Mobile Logo)</label>
                <label htmlFor="upload-mobile" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#6C22F9', color: '#fff', padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>
                  <Upload size={13} /> رفع صورة
                </label>
                <input id="upload-mobile" type="file" accept="image/*" onChange={e => handleFileUpload(e, setMobileLogo)} style={{ display: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 80, height: 44, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, flexShrink: 0, overflow: 'hidden' }}>
                  <img src={mobileLogo} alt="Mobile Preview" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
                <input type="text" value={mobileLogo} onChange={e => setMobileLogo(e.target.value)} placeholder="/mobile-logo.png" style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', outline: 'none', fontSize: 12.5, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
              </div>
            </div>

            {/* Browser Tab Icon & Title */}
            <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 14, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text-main)' }}>أيقونة التاب (Favicon Icon)</label>
                  <label htmlFor="upload-favicon" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#6C22F9', color: '#fff', padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>
                    <Upload size={13} /> رفع الأيقونة
                  </label>
                  <input id="upload-favicon" type="file" accept="image/*" onChange={e => handleFileUpload(e, setTabIcon)} style={{ display: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, flexShrink: 0, overflow: 'hidden' }}>
                    <img src={tabIcon} alt="Tab Icon Preview" style={{ width: 26, height: 26, objectFit: 'contain' }} />
                  </div>
                  <input type="text" value={tabIcon} onChange={e => setTabIcon(e.target.value)} placeholder="/logo-only.png" style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', outline: 'none', fontSize: 12.5, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>عنوان لسان المتصفح (Tab Title)</label>
                <input type="text" value={tabTitle} onChange={e => setTabTitle(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Social Media & Community */}
        <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: 20, gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Share2 size={20} color="#6C22F9" /> 3. منصات التواصل ومجتمع الطلاب
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#ef4444', marginBottom: 6 }}>رابط قناة يوتيوب</label>
              <input type="url" value={youtube} onChange={e => setYoutube(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', textAlign: 'left', boxSizing: 'border-box' }} dir="ltr" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>رابط حساب تيك توك</label>
              <input type="url" value={tiktok} onChange={e => setTiktok(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', textAlign: 'left', boxSizing: 'border-box' }} dir="ltr" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1877f2', marginBottom: 6 }}>رابط صفحة فيسبوك</label>
              <input type="url" value={facebook} onChange={e => setFacebook(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', textAlign: 'left', boxSizing: 'border-box' }} dir="ltr" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#25d366', marginBottom: 6 }}>رابط قناة واتساب</label>
              <input type="url" value={whatsappGroup} onChange={e => setWhatsappGroup(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', textAlign: 'left', boxSizing: 'border-box' }} dir="ltr" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1877f2', marginBottom: 6 }}>جروب فيسبوك الطلاب</label>
              <input type="url" value={fbGroup} onChange={e => setFbGroup(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', textAlign: 'left', boxSizing: 'border-box' }} dir="ltr" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#229ed9', marginBottom: 6 }}>جروب تليجرام الطلاب</label>
              <input type="url" value={telegram} onChange={e => setTelegram(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', textAlign: 'left', boxSizing: 'border-box' }} dir="ltr" />
            </div>
          </div>
        </div>

      </div>

      {/* Academic Grades Global Manager Card */}
      <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
          <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <GraduationCap size={22} color="#6C22F9" /> 🎓 إدارة المراحل والصفوف الدراسية بالمنصة (Academic Grades System)
          </h3>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>إلغاء أو تفعيل أي صف ينعكس أوتوماتيكياً في الواجهة ولوحة الأوائل والكورسات!</span>
        </div>

        {/* Grades Toggle List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 20 }}>
          {grades.map(g => (
            <div key={g.id} style={{ background: 'var(--bg)', border: g.active ? '1.5px solid #6C22F9' : '1px solid var(--border)', padding: '14px 16px', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 2px', fontSize: 14.5, fontWeight: 900, color: g.active ? 'var(--text-main)' : 'var(--text-muted)' }}>{g.name}</h4>
                <span style={{ fontSize: 11.5, color: g.active ? '#10b981' : '#ef4444', fontWeight: 800 }}>{g.active ? 'مفعلة بالمنصة 🟢' : 'معطلة (مخفية) 🔴'}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => handleToggleGrade(g.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: g.active ? '#10b981' : 'var(--text-muted)' }}
                  title={g.active ? 'إلغاء التفعيل' : 'تفعيل الصف'}
                >
                  {g.active ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
                <button onClick={() => handleDeleteGrade(g.id, g.name)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="حذف">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Grade Form */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'var(--bg)', padding: 12, borderRadius: 12, border: '1px solid var(--border)', maxWidth: 500 }}>
          <input
            type="text"
            value={newGradeName}
            onChange={e => setNewGradeName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddGrade()}
            placeholder="إضافة صف دراسي جديد (مثلاً: ثالثة ثانوي)..."
            style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif' }}
          />
          <button
            onClick={handleAddGrade}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#6C22F9', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontWeight: 800, fontSize: 13, cursor: 'pointer' }}
          >
            <Plus size={14} /> إضافة الصف
          </button>
        </div>
      </div>

      {/* Save Button Bar */}
      <div style={{ background: 'var(--surface)', padding: '18px 24px', borderRadius: 16, border: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <button
          onClick={handleSaveSettings}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff', border: 'none', padding: '12px 36px', borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 14px rgba(108,34,249,0.3)', fontFamily: 'Tajawal, sans-serif' }}
        >
          <Save size={18} /> حفظ جميع التغييرات
        </button>
      </div>

      {/* ─── Dedicated AI Bot Answers Modal ───────────────────────────────── */}
      <AnimatePresence>
        {showBotModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowBotModal(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(15,10,42,0.75)', backdropFilter: 'blur(8px)' }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{
                position: 'relative', width: '100%', maxWidth: 680, maxHeight: '90vh',
                background: 'var(--surface)', borderRadius: 24, padding: 32, overflowY: 'auto',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)', border: '1px solid var(--border)',
                zIndex: 1000, fontFamily: 'Tajawal, sans-serif'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(108,34,249,0.15)', color: '#6C22F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={24} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>تخصيص رُدود وإجابات المساعد الذكي 🤖</h2>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>تحكم في الإجابات الأوتوماتيكية الصادرة من البوت عند سؤال الطلاب</span>
                  </div>
                </div>
                <button onClick={() => setShowBotModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={22} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13.5, fontWeight: 800, color: '#6C22F9', marginBottom: 6 }}>رد "التحدث مع المدرس / الواتساب / الدعم الفني"</label>
                  <textarea
                    value={botWhatsappReply}
                    onChange={e => setBotWhatsappReply(e.target.value)}
                    rows={2}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13.5, fontFamily: 'Tajawal, sans-serif', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13.5, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>رد استفسار "الكورسات والصفوف المتاحة"</label>
                  <textarea
                    value={botCoursesReply}
                    onChange={e => setBotCoursesReply(e.target.value)}
                    rows={2}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13.5, fontFamily: 'Tajawal, sans-serif', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13.5, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>رد استفسار "طرق الشحن والاشتراك والمحفظة"</label>
                  <textarea
                    value={botPaymentReply}
                    onChange={e => setBotPaymentReply(e.target.value)}
                    rows={2}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13.5, fontFamily: 'Tajawal, sans-serif', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13.5, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>رد استفسار "المذكرات والكتب ورسوم الشحن"</label>
                  <textarea
                    value={botBooksReply}
                    onChange={e => setBotBooksReply(e.target.value)}
                    rows={2}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13.5, fontFamily: 'Tajawal, sans-serif', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <button onClick={() => setShowBotModal(false)} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>إلغاء</button>
                <button
                  onClick={() => { handleSaveSettings(); setShowBotModal(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 10, border: 'none', background: '#6C22F9', color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Save size={16} /> حفظ ردود المساعد الذكي
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Popup Modal */}
      <AnimatePresence>
        {deleteGradeTarget && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteGradeTarget(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', zIndex: 1001 }} />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{
                position: 'relative', zIndex: 1002, background: 'var(--surface)',
                borderRadius: 24, padding: 32, width: '100%', maxWidth: 440,
                textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                border: '1px solid var(--border)', fontFamily: 'Tajawal, sans-serif'
              }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: 20,
                background: 'rgba(239,68,68,0.12)', color: '#ef4444',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <Trash2 size={32} />
              </div>

              <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 10px' }}>
                تأكيد حذف المرحلة الدراسية ⚠️
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 24px' }}>
                هل أنت متأكد من حذف المرحلة الدراسية <strong>"{deleteGradeTarget.name}"</strong>؟ لن تتمكن من التراجع عن هذه الخطوة.
              </p>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button
                  onClick={() => setDeleteGradeTarget(null)}
                  style={{ flex: 1, padding: '12px 20px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    const updated = grades.filter(g => g.id !== deleteGradeTarget.id);
                    setGrades(updated);
                    saveAcademicGrades(updated);
                    setDeleteGradeTarget(null);
                  }}
                  style={{ flex: 1, padding: '12px 20px', borderRadius: 12, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(239,68,68,0.3)', fontFamily: 'Tajawal, sans-serif' }}
                >
                  نعم، تأكيد الحذف 🗑️
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
