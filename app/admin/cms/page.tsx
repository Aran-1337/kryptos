'use client';

import React from 'react';
import {
  useCms,
  CmsHeader,
  CmsTabs,
  HeroEditor,
  StatsEditor,
  FeaturesEditor,
  FaqsEditor,
  CtaEditor,
} from '@/app/features/cms';

export default function AdminCMSPage() {
  const {
    cmsData,
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
  } = useCms();

  return (
    <div
      style={{
        width: '100%',
        fontFamily: 'Tajawal, sans-serif',
        direction: 'rtl',
      }}
    >
      {/* Title & Save Button */}
      <CmsHeader isSaved={isSaved} onSave={handleSaveAll} />

      {/* Main Tabs */}
      <CmsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab 0: Hero Title & Highlight Controller */}
      {activeTab === 'hero' && (
        <HeroEditor
          heroHeader={cmsData.heroHeader}
          onChange={handleHeroChange}
        />
      )}

      {/* Tab 1: Hero Stats Controller */}
      {activeTab === 'stats' && (
        <StatsEditor
          heroStats={cmsData.heroStats}
          onStatChange={handleStatChange}
        />
      )}

      {/* Tab 2: Why Better Features Grid Controller */}
      {activeTab === 'features' && (
        <FeaturesEditor
          whyBetter={cmsData.whyBetter}
          onTitleChange={handleWhyBetterTitleChange}
          onFeatureChange={handleFeatureChange}
        />
      )}

      {/* Tab 3: FAQs Manager */}
      {activeTab === 'faqs' && (
        <FaqsEditor
          faqs={cmsData.faqs}
          onAddFaq={handleAddFaq}
          onDeleteFaq={handleDeleteFaq}
          onFaqChange={handleFaqChange}
        />
      )}

      {/* Tab 4: CTA Banner Controller */}
      {activeTab === 'cta' && (
        <CtaEditor cta={cmsData.cta} onChange={handleCtaChange} />
      )}
    </div>
  );
}
