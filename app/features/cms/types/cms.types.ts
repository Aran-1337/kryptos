export type CmsTab = 'hero' | 'stats' | 'features' | 'faqs' | 'cta';

export interface HeroHeaderData {
  badge: string;
  titleLine1: string;
  titleHighlight: string;
  subtitle: string;
}

export interface HeroStatItem {
  value: string;
  label: string;
  isAuto?: boolean;
}

export interface WhyBetterFeature {
  title: string;
  desc: string;
}

export interface WhyBetterData {
  title: string;
  subtitle: string;
  features: WhyBetterFeature[];
}

export interface FaqItem {
  id: number | string;
  q: string;
  a: string;
}

export interface CtaData {
  title: string;
  subtitle: string;
  buttonText: string;
}

export interface CmsData {
  heroHeader: HeroHeaderData;
  heroStats: HeroStatItem[];
  whyBetter: WhyBetterData;
  faqs: FaqItem[];
  cta: CtaData;
}
