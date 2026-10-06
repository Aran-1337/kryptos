import { BrandSettings } from '../types/settings.types';
import { defaultBrandSettings } from '../mocks/settings.mock';
import { getAcademicGrades, saveAcademicGrades, AcademicGrade } from '@/app/utils/academicGrades';

const BRAND_SETTINGS_STORAGE_KEY = 'brand_settings';

export const settingsService = {
  getBrandSettings(): BrandSettings {
    if (typeof window === 'undefined') {
      return { ...defaultBrandSettings };
    }
    try {
      const saved = localStorage.getItem(BRAND_SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultBrandSettings,
          ...parsed,
        };
      }
    } catch (e) {
      console.error('Failed to load brand settings from localStorage:', e);
    }
    return { ...defaultBrandSettings };
  },

  saveBrandSettings(settings: BrandSettings): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(BRAND_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      window.dispatchEvent(new Event('brand_settings_updated'));
      this.applyDocumentBranding(settings.tabTitle, settings.tabIcon);
    } catch (e) {
      console.error('Failed to save brand settings to localStorage:', e);
    }
  },

  applyDocumentBranding(tabTitle?: string, tabIcon?: string): void {
    if (typeof document === 'undefined') return;
    if (tabTitle) {
      document.title = tabTitle;
    }
    if (tabIcon) {
      const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (favicon) {
        favicon.href = tabIcon;
      }
    }
  },

  getGrades(): AcademicGrade[] {
    return getAcademicGrades();
  },

  saveGrades(grades: AcademicGrade[]): void {
    saveAcademicGrades(grades);
  },
};
