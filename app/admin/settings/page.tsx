'use client';
import { Save, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import AdminPageHeader from '@/app/components/layout/AdminPageHeader';
import {
  useSettings,
  BrandingSettings,
  AcademicGradesManager,
  BotFaqEditor,
} from '@/app/features/settings';

export default function AdminSettingsPage() {
  const {
    siteName,
    setSiteName,
    siteDesc,
    setSiteDesc,
    desktopLogo,
    setDesktopLogo,
    mobileLogo,
    setMobileLogo,
    tabIcon,
    setTabIcon,
    tabTitle,
    setTabTitle,
    email,
    setEmail,
    phone,
    setPhone,
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
    showWhatsappBanner,
    setShowWhatsappBanner,
    grades,
    newGradeName,
    setNewGradeName,
    deleteGradeTarget,
    setDeleteGradeTarget,
    showBotModal,
    setShowBotModal,
    botWhatsappReply,
    setBotWhatsappReply,
    botCoursesReply,
    setBotCoursesReply,
    botPaymentReply,
    setBotPaymentReply,
    botBooksReply,
    setBotBooksReply,
    savedMsg,
    handleToggleGrade,
    handleAddGrade,
    handleDeleteGrade,
    handleConfirmDeleteGrade,
    handleFileUpload,
    handleSaveSettings,
  } = useSettings();

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
      <AdminPageHeader
        title="الإعدادات وهوية المنصة ⚙️"
        subtitle="تحكم كامل في الصفوف الدراسية، بيانات المنصة الأساسية، وسائل التواصل، وشعارات الموقع."
        action={
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setShowBotModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', color: '#6C22F9', border: '1.5px solid #6C22F9', padding: '12px 20px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
            >
              <Bot size={18} /> تخصيص الردود الآلية للمساعد الذكي 🤖
            </button>

            <button
              type="button"
              onClick={handleSaveSettings}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(108,34,249,0.3)', fontFamily: 'Tajawal, sans-serif' }}
            >
              <Save size={18} /> حفظ التغييرات
            </button>
          </div>
        }
      />

      {/* 2-Column Responsive Grid Layout for Platform Core Settings */}
      <BrandingSettings
        siteName={siteName}
        setSiteName={setSiteName}
        siteDesc={siteDesc}
        setSiteDesc={setSiteDesc}
        email={email}
        setEmail={setEmail}
        phone={phone}
        setPhone={setPhone}
        showWhatsappBanner={showWhatsappBanner}
        setShowWhatsappBanner={setShowWhatsappBanner}
        desktopLogo={desktopLogo}
        setDesktopLogo={setDesktopLogo}
        mobileLogo={mobileLogo}
        setMobileLogo={setMobileLogo}
        tabIcon={tabIcon}
        setTabIcon={setTabIcon}
        tabTitle={tabTitle}
        setTabTitle={setTabTitle}
        youtube={youtube}
        setYoutube={setYoutube}
        tiktok={tiktok}
        setTiktok={setTiktok}
        facebook={facebook}
        setFacebook={setFacebook}
        whatsappGroup={whatsappGroup}
        setWhatsappGroup={setWhatsappGroup}
        fbGroup={fbGroup}
        setFbGroup={setFbGroup}
        telegram={telegram}
        setTelegram={setTelegram}
        handleFileUpload={handleFileUpload}
      />

      {/* Academic Grades Global Manager Card */}
      <AcademicGradesManager
        grades={grades}
        newGradeName={newGradeName}
        setNewGradeName={setNewGradeName}
        deleteGradeTarget={deleteGradeTarget}
        setDeleteGradeTarget={setDeleteGradeTarget}
        handleToggleGrade={handleToggleGrade}
        handleAddGrade={handleAddGrade}
        handleDeleteGrade={handleDeleteGrade}
        handleConfirmDeleteGrade={handleConfirmDeleteGrade}
      />

      {/* Save Button Bar */}
      <div style={{ background: 'var(--surface)', padding: '18px 24px', borderRadius: 16, border: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <button
          type="button"
          onClick={handleSaveSettings}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff', border: 'none', padding: '12px 36px', borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 14px rgba(108,34,249,0.3)', fontFamily: 'Tajawal, sans-serif' }}
        >
          <Save size={18} /> حفظ جميع التغييرات
        </button>
      </div>

      {/* Dedicated AI Bot Answers Modal */}
      <BotFaqEditor
        isOpen={showBotModal}
        onClose={() => setShowBotModal(false)}
        botWhatsappReply={botWhatsappReply}
        setBotWhatsappReply={setBotWhatsappReply}
        botCoursesReply={botCoursesReply}
        setBotCoursesReply={setBotCoursesReply}
        botPaymentReply={botPaymentReply}
        setBotPaymentReply={setBotPaymentReply}
        botBooksReply={botBooksReply}
        setBotBooksReply={setBotBooksReply}
        onSave={handleSaveSettings}
      />

    </div>
  );
}
