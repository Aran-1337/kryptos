import { CmsData } from '../types/cms.types';

export function normalizeCmsData(
  parsed: any,
  defaults: CmsData
): CmsData {
  if (!parsed || typeof parsed !== 'object') {
    return defaults;
  }

  return {
    heroHeader: {
      badge: parsed.heroHeader?.badge ?? defaults.heroHeader.badge,
      titleLine1: parsed.heroHeader?.titleLine1 ?? defaults.heroHeader.titleLine1,
      titleHighlight: parsed.heroHeader?.titleHighlight ?? defaults.heroHeader.titleHighlight,
      subtitle: parsed.heroHeader?.subtitle ?? defaults.heroHeader.subtitle,
    },
    heroStats: Array.isArray(parsed.heroStats) && parsed.heroStats.length > 0
      ? parsed.heroStats.map((st: any, i: number) => ({
          value: st?.value ?? defaults.heroStats[i]?.value ?? '',
          label: st?.label ?? defaults.heroStats[i]?.label ?? '',
          isAuto: st?.isAuto ?? true,
        }))
      : defaults.heroStats,
    whyBetter: {
      title: parsed.whyBetter?.title ?? defaults.whyBetter.title,
      subtitle: parsed.whyBetter?.subtitle ?? defaults.whyBetter.subtitle,
      features: Array.isArray(parsed.whyBetter?.features) && parsed.whyBetter.features.length > 0
        ? parsed.whyBetter.features.map((f: any, i: number) => ({
            title: f?.title ?? defaults.whyBetter.features[i]?.title ?? '',
            desc: f?.desc ?? defaults.whyBetter.features[i]?.desc ?? '',
          }))
        : defaults.whyBetter.features,
    },
    faqs: Array.isArray(parsed.faqs) && parsed.faqs.length > 0
      ? parsed.faqs.map((faq: any, i: number) => ({
          id: faq?.id ?? Date.now() + i,
          q: faq?.q ?? '',
          a: faq?.a ?? '',
        }))
      : defaults.faqs,
    cta: {
      title: parsed.cta?.title ?? defaults.cta.title,
      subtitle: parsed.cta?.subtitle ?? defaults.cta.subtitle,
      buttonText: parsed.cta?.buttonText ?? defaults.cta.buttonText,
    },
  };
}

export function validateCmsData(data: CmsData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data.heroHeader.titleLine1.trim()) {
    errors.push('عنوان الهيرو الرئيسي لا يمكن أن يكون فارغاً');
  }
  if (!data.whyBetter.title.trim()) {
    errors.push('عنوان قسم المميزات لا يمكن أن يكون فارغاً');
  }
  if (!data.cta.title.trim()) {
    errors.push('عنوان بنر الدعوة لا يمكن أن يكون فارغاً');
  }
  return {
    valid: errors.length === 0,
    errors,
  };
}
