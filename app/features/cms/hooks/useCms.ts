import { useState, useEffect, useCallback } from 'react';
import {
  CmsData,
  CmsTab,
  HeroHeaderData,
  CtaData,
} from '../types/cms.types';
import { defaultCmsData } from '../mocks/cms.mock';
import { cmsService } from '../services/cms.service';

export function useCms() {
  const [cmsData, setCmsData] = useState<CmsData>(defaultCmsData);
  const [activeTab, setActiveTab] = useState<CmsTab>('hero');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const loadedData = cmsService.getCmsData();
    setCmsData(loadedData);
  }, []);

  const handleSaveAll = useCallback(() => {
    cmsService.saveCmsData(cmsData);
    setIsSaved(true);
    const timer = setTimeout(() => setIsSaved(false), 2000);
    return () => clearTimeout(timer);
  }, [cmsData]);

  const handleHeroChange = useCallback((field: keyof HeroHeaderData, value: string) => {
    setCmsData(prev => ({
      ...prev,
      heroHeader: {
        ...prev.heroHeader,
        [field]: value,
      },
    }));
  }, []);

  const handleStatChange = useCallback(
    (index: number, field: 'value' | 'label', val: string) => {
      setCmsData(prev => {
        const newStats = [...prev.heroStats];
        newStats[index] = {
          ...newStats[index],
          [field]: val,
        };
        return { ...prev, heroStats: newStats };
      });
    },
    []
  );

  const handleWhyBetterTitleChange = useCallback((title: string) => {
    setCmsData(prev => ({
      ...prev,
      whyBetter: {
        ...prev.whyBetter,
        title,
      },
    }));
  }, []);

  const handleFeatureChange = useCallback(
    (index: number, field: 'title' | 'desc', val: string) => {
      setCmsData(prev => {
        const newFeat = [...prev.whyBetter.features];
        newFeat[index] = {
          ...newFeat[index],
          [field]: val,
        };
        return {
          ...prev,
          whyBetter: {
            ...prev.whyBetter,
            features: newFeat,
          },
        };
      });
    },
    []
  );

  const handleFaqChange = useCallback(
    (index: number, field: 'q' | 'a', val: string) => {
      setCmsData(prev => {
        const newFaqs = [...prev.faqs];
        newFaqs[index] = {
          ...newFaqs[index],
          [field]: val,
        };
        return { ...prev, faqs: newFaqs };
      });
    },
    []
  );

  const handleAddFaq = useCallback(() => {
    setCmsData(prev => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        { id: Date.now(), q: 'سؤال جديد...', a: 'الإجابة الشافية هنا...' },
      ],
    }));
  }, []);

  const handleDeleteFaq = useCallback((index: number) => {
    setCmsData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  }, []);

  const handleCtaChange = useCallback((field: keyof CtaData, value: string) => {
    setCmsData(prev => ({
      ...prev,
      cta: {
        ...prev.cta,
        [field]: value,
      },
    }));
  }, []);

  const handleReset = useCallback(() => {
    const defaults = cmsService.resetCmsData();
    setCmsData(defaults);
  }, []);

  return {
    cmsData,
    setCmsData,
    activeTab,
    setActiveTab,
    isSaved,
    handleSaveAll,
    handleHeroChange,
    handleStatChange,
    handleWhyBetterTitleChange,
    handleFeatureChange,
    handleFaqChange,
    handleAddFaq,
    handleDeleteFaq,
    handleCtaChange,
    handleReset,
  };
}
