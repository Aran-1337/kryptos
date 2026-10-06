export type { AcademicGrade } from '@/app/utils/academicGrades';

export interface BrandSettings {
  siteName: string;
  siteDesc: string;
  desktopLogo: string;
  mobileLogo: string;
  tabIcon: string;
  tabTitle: string;
  email: string;
  phone: string;
  youtube: string;
  tiktok: string;
  facebook: string;
  whatsappGroup: string;
  fbGroup: string;
  telegram: string;
  showWhatsappBanner: boolean;
  botWhatsappReply: string;
  botCoursesReply: string;
  botPaymentReply: string;
  botBooksReply: string;
}

export interface BotFaqSettings {
  botWhatsappReply: string;
  botCoursesReply: string;
  botPaymentReply: string;
  botBooksReply: string;
}

export interface DeleteGradeTarget {
  id: string;
  name: string;
}
