'use client';
import { useState, useEffect } from 'react';
import { AcademicGrade, DeleteGradeTarget } from '../types/settings.types';
import { defaultBrandSettings } from '../mocks/settings.mock';
import { settingsService } from '../services/settings.service';

export function useSettings() {
  const [siteName, setSiteName] = useState(defaultBrandSettings.siteName);
  const [siteDesc, setSiteDesc] = useState(defaultBrandSettings.siteDesc);

  // Logos & Tab Settings
  const [desktopLogo, setDesktopLogo] = useState(defaultBrandSettings.desktopLogo);
  const [mobileLogo, setMobileLogo] = useState(defaultBrandSettings.mobileLogo);
  const [tabIcon, setTabIcon] = useState(defaultBrandSettings.tabIcon);
  const [tabTitle, setTabTitle] = useState(defaultBrandSettings.tabTitle);

  // Contacts & Socials
  const [email, setEmail] = useState(defaultBrandSettings.email);
  const [phone, setPhone] = useState(defaultBrandSettings.phone);
  const [youtube, setYoutube] = useState(defaultBrandSettings.youtube);
  const [tiktok, setTiktok] = useState(defaultBrandSettings.tiktok);
  const [facebook, setFacebook] = useState(defaultBrandSettings.facebook);
  const [whatsappGroup, setWhatsappGroup] = useState(defaultBrandSettings.whatsappGroup);
  const [fbGroup, setFbGroup] = useState(defaultBrandSettings.fbGroup);
  const [telegram, setTelegram] = useState(defaultBrandSettings.telegram);

  // WhatsApp Banner Toggle
  const [showWhatsappBanner, setShowWhatsappBanner] = useState(defaultBrandSettings.showWhatsappBanner);

  // Academic Grades State
  const [grades, setGrades] = useState<AcademicGrade[]>([]);
  const [newGradeName, setNewGradeName] = useState('');
  const [deleteGradeTarget, setDeleteGradeTarget] = useState<DeleteGradeTarget | null>(null);

  // AI Bot Answers Modal & State
  const [showBotModal, setShowBotModal] = useState(false);
  const [botWhatsappReply, setBotWhatsappReply] = useState(defaultBrandSettings.botWhatsappReply);
  const [botCoursesReply, setBotCoursesReply] = useState(defaultBrandSettings.botCoursesReply);
  const [botPaymentReply, setBotPaymentReply] = useState(defaultBrandSettings.botPaymentReply);
  const [botBooksReply, setBotBooksReply] = useState(defaultBrandSettings.botBooksReply);

  // Toast / Saved Message State
  const [savedMsg, setSavedMsg] = useState('');

  // Load from service on mount
  useEffect(() => {
    setGrades(settingsService.getGrades());
    const brand = settingsService.getBrandSettings();

    setSiteName(brand.siteName);
    setSiteDesc(brand.siteDesc);
    setDesktopLogo(brand.desktopLogo);
    setMobileLogo(brand.mobileLogo);
    setTabIcon(brand.tabIcon);
    setTabTitle(brand.tabTitle);
    setEmail(brand.email);
    setPhone(brand.phone);
    setYoutube(brand.youtube);
    setTiktok(brand.tiktok);
    setFacebook(brand.facebook);
    setWhatsappGroup(brand.whatsappGroup);
    setFbGroup(brand.fbGroup);
    setTelegram(brand.telegram);
    setShowWhatsappBanner(brand.showWhatsappBanner);

    // Bot replies
    setBotWhatsappReply(brand.botWhatsappReply);
    setBotCoursesReply(brand.botCoursesReply);
    setBotPaymentReply(brand.botPaymentReply);
    setBotBooksReply(brand.botBooksReply);
  }, []);

  const handleToggleGrade = (id: string) => {
    const updated = grades.map(g => g.id === id ? { ...g, active: !g.active } : g);
    setGrades(updated);
    settingsService.saveGrades(updated);
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
      active: true,
    };
    const updated = [...grades, newG];
    setGrades(updated);
    settingsService.saveGrades(updated);
    setNewGradeName('');
  };

  const handleDeleteGrade = (id: string, name: string) => {
    setDeleteGradeTarget({ id, name });
  };

  const handleConfirmDeleteGrade = () => {
    if (!deleteGradeTarget) return;
    const updated = grades.filter(g => g.id !== deleteGradeTarget.id);
    setGrades(updated);
    settingsService.saveGrades(updated);
    setDeleteGradeTarget(null);
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
      siteName,
      siteDesc,
      desktopLogo,
      mobileLogo,
      tabIcon,
      tabTitle,
      email,
      phone,
      youtube,
      tiktok,
      facebook,
      whatsappGroup,
      fbGroup,
      telegram,
      showWhatsappBanner,
      botWhatsappReply,
      botCoursesReply,
      botPaymentReply,
      botBooksReply,
    };

    settingsService.saveBrandSettings(brandData);
    settingsService.saveGrades(grades);

    setSavedMsg('✅ تم حفظ جميع الإعدادات والشعارات ورُدود المساعد بنجاح!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return {
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
  };
}
