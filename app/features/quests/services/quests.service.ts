import { Quest, PointsCalculationRules, QuestFormData } from '../types/quest.types';
import { defaultPointsRules, initialQuests } from '../mocks/quest.mock';

const POINTS_RULES_KEY = 'points_calculation_rules';
const ADMIN_QUESTS_KEY = 'admin_quests';

export const questsService = {
  getPointsRules(): PointsCalculationRules {
    if (typeof window === 'undefined') return { ...defaultPointsRules };
    try {
      const saved = localStorage.getItem(POINTS_RULES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          pointsPerMinute: parsed.pointsPerMinute ?? defaultPointsRules.pointsPerMinute,
          pointsPerExamScore: parsed.pointsPerExamScore ?? defaultPointsRules.pointsPerExamScore,
          pointsPerAssignment: parsed.pointsPerAssignment ?? defaultPointsRules.pointsPerAssignment,
        };
      }
    } catch (e) {
      console.error('Failed to load points rules:', e);
    }
    return { ...defaultPointsRules };
  },

  savePointsRules(rules: PointsCalculationRules): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(POINTS_RULES_KEY, JSON.stringify(rules));
      window.dispatchEvent(new Event('points_rules_updated'));
    } catch (e) {
      console.error('Failed to save points rules:', e);
    }
  },

  getQuests(): Quest[] {
    if (typeof window === 'undefined') return [...initialQuests];
    try {
      const saved = localStorage.getItem(ADMIN_QUESTS_KEY);
      if (saved) {
        return JSON.parse(saved);
      } else {
        localStorage.setItem(ADMIN_QUESTS_KEY, JSON.stringify(initialQuests));
        return [...initialQuests];
      }
    } catch (e) {
      console.error('Failed to load quests:', e);
    }
    return [...initialQuests];
  },

  saveQuests(quests: Quest[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ADMIN_QUESTS_KEY, JSON.stringify(quests));
      window.dispatchEvent(new Event('admin_quests_updated'));
    } catch (e) {
      console.error('Failed to save quests:', e);
    }
  },

  deleteQuest(quests: Quest[], id: string): Quest[] {
    const updated = quests.filter(q => q.id !== id);
    this.saveQuests(updated);
    return updated;
  },

  upsertQuest(quests: Quest[], formData: QuestFormData, editingId?: string | null): Quest[] {
    let updated: Quest[];
    if (editingId) {
      updated = quests.map(q => q.id === editingId ? {
        ...q,
        title: formData.title,
        description: formData.description,
        pointsReward: Number(formData.pointsReward) || 500,
        rewardType: formData.rewardType,
        rewardAmount: Number(formData.rewardAmount) || 0,
        rewardGiftName: formData.rewardGiftName,
        icon: formData.icon,
        grade: formData.questGrade,
      } : q);
    } else {
      const newQuest: Quest = {
        id: 'q-' + Date.now(),
        title: formData.title,
        description: formData.description,
        pointsReward: Number(formData.pointsReward) || 500,
        rewardType: formData.rewardType,
        rewardAmount: Number(formData.rewardAmount) || 0,
        rewardGiftName: formData.rewardGiftName,
        icon: formData.icon,
        grade: formData.questGrade,
        active: true,
      };
      updated = [...quests, newQuest];
    }
    this.saveQuests(updated);
    return updated;
  },
};
