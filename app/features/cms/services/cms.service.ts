import { CmsData } from '../types/cms.types';
import { defaultCmsData } from '../mocks/cms.mock';
import { normalizeCmsData } from '../utils/cms.utils';

const CMS_STORAGE_KEY = 'cms_homepage_data';
const CMS_UPDATE_EVENT = 'cms_updated';

export const cmsService = {
  getCmsData(): CmsData {
    if (typeof window === 'undefined') return defaultCmsData;
    try {
      const saved = localStorage.getItem(CMS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return normalizeCmsData(parsed, defaultCmsData);
      }
    } catch (e) {
      console.error('Failed to read CMS data from localStorage', e);
    }
    return defaultCmsData;
  },

  saveCmsData(data: CmsData): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new Event(CMS_UPDATE_EVENT));
    } catch (e) {
      console.error('Failed to save CMS data to localStorage', e);
    }
  },

  resetCmsData(): CmsData {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(CMS_STORAGE_KEY);
        window.dispatchEvent(new Event(CMS_UPDATE_EVENT));
      } catch (e) {
        console.error('Failed to reset CMS data in localStorage', e);
      }
    }
    return defaultCmsData;
  },
};
