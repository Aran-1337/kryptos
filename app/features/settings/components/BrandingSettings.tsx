'use client';
import React from 'react';
import { User, Image as ImageIcon, Share2, ToggleRight, ToggleLeft } from 'lucide-react';
import ImageUploadField from './ImageUploadField';

interface BrandingSettingsProps {
  siteName: string;
  setSiteName: (val: string) => void;
  siteDesc: string;
  setSiteDesc: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  showWhatsappBanner: boolean;
  setShowWhatsappBanner: (val: boolean) => void;
  desktopLogo: string;
  setDesktopLogo: (val: string) => void;
  mobileLogo: string;
  setMobileLogo: (val: string) => void;
  tabIcon: string;
  setTabIcon: (val: string) => void;
  tabTitle: string;
  setTabTitle: (val: string) => void;
  youtube: string;
  setYoutube: (val: string) => void;
  tiktok: string;
  setTiktok: (val: string) => void;
  facebook: string;
  setFacebook: (val: string) => void;
  whatsappGroup: string;
  setWhatsappGroup: (val: string) => void;
  fbGroup: string;
  setFbGroup: (val: string) => void;
  telegram: string;
  setTelegram: (val: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => void;
}

export default function BrandingSettings({
  siteName,
  setSiteName,
  siteDesc,
  setSiteDesc,
  email,
  setEmail,
  phone,
  setPhone,
  showWhatsappBanner,
  setShowWhatsappBanner,
  desktopLogo,
  setDesktopLogo,
  mobileLogo,
  setMobileLogo,
  tabIcon,
  setTabIcon,
  tabTitle,
  setTabTitle,
  youtube,
  setYoutube,
  tiktok,
  setTiktok,
  facebook,
  setFacebook,
  whatsappGroup,
  setWhatsappGroup,
  fbGroup,
  setFbGroup,
  telegram,
  setTelegram,
  handleFileUpload,
}: BrandingSettingsProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: 24, width: '100%' }}>
      
      {/* Section 1: Basic Platform Info */}
      <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <User size={20} color="#6C22F9" /> 1. البيانات الأساسية للمنصة والدعم
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>اسم المنصة</label>
            <input 
              type="text" 
              value={siteName} 
              onChange={e => setSiteName(e.target.value)} 
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13.5, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>وصف المنصة (يظهر في محركات البحث وفي الفوتر)</label>
            <textarea 
              value={siteDesc} 
              onChange={e => setSiteDesc(e.target.value)} 
              rows={3} 
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13.5, fontFamily: 'Tajawal, sans-serif', resize: 'vertical', boxSizing: 'border-box' }} 
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>البريد الإلكتروني الرسمي</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', textAlign: 'left', boxSizing: 'border-box' }} 
                dir="ltr" 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>رقم واتساب الدعم الفني</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', textAlign: 'left', boxSizing: 'border-box' }} 
                dir="ltr" 
              />
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
          <ImageUploadField
            id="upload-desktop"
            label="شعار الكمبيوتر (Desktop Logo)"
            value={desktopLogo}
            onChangeText={setDesktopLogo}
            onFileSelect={e => handleFileUpload(e, setDesktopLogo)}
            previewWidth={80}
            previewHeight={44}
            placeholder="/Logo-cropped.png"
          />

          {/* Mobile Logo */}
          <ImageUploadField
            id="upload-mobile"
            label="شعار الموبايل (Mobile Logo)"
            value={mobileLogo}
            onChangeText={setMobileLogo}
            onFileSelect={e => handleFileUpload(e, setMobileLogo)}
            previewWidth={80}
            previewHeight={44}
            placeholder="/mobile-logo.png"
          />

          {/* Browser Tab Icon & Title */}
          <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 14, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <ImageUploadField
                id="upload-favicon"
                label="أيقونة التاب (Favicon Icon)"
                uploadButtonText="رفع الأيقونة"
                value={tabIcon}
                onChangeText={setTabIcon}
                onFileSelect={e => handleFileUpload(e, setTabIcon)}
                previewWidth={42}
                previewHeight={42}
                isSquareIcon={true}
                placeholder="/logo-only.png"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>عنوان لسان المتصفح (Tab Title)</label>
              <input 
                type="text" 
                value={tabTitle} 
                onChange={e => setTabTitle(e.target.value)} 
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} 
              />
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
            <input 
              type="url" 
              value={youtube} 
              onChange={e => setYoutube(e.target.value)} 
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', textAlign: 'left', boxSizing: 'border-box' }} 
              dir="ltr" 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>رابط حساب تيك توك</label>
            <input 
              type="url" 
              value={tiktok} 
              onChange={e => setTiktok(e.target.value)} 
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', textAlign: 'left', boxSizing: 'border-box' }} 
              dir="ltr" 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1877f2', marginBottom: 6 }}>رابط صفحة فيسبوك</label>
            <input 
              type="url" 
              value={facebook} 
              onChange={e => setFacebook(e.target.value)} 
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', textAlign: 'left', boxSizing: 'border-box' }} 
              dir="ltr" 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#25d366', marginBottom: 6 }}>رابط قناة واتساب</label>
            <input 
              type="url" 
              value={whatsappGroup} 
              onChange={e => setWhatsappGroup(e.target.value)} 
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', textAlign: 'left', boxSizing: 'border-box' }} 
              dir="ltr" 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1877f2', marginBottom: 6 }}>جروب فيسبوك الطلاب</label>
            <input 
              type="url" 
              value={fbGroup} 
              onChange={e => setFbGroup(e.target.value)} 
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', textAlign: 'left', boxSizing: 'border-box' }} 
              dir="ltr" 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#229ed9', marginBottom: 6 }}>جروب تليجرام الطلاب</label>
            <input 
              type="url" 
              value={telegram} 
              onChange={e => setTelegram(e.target.value)} 
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', textAlign: 'left', boxSizing: 'border-box' }} 
              dir="ltr" 
            />
          </div>
        </div>
      </div>

    </div>
  );
}
