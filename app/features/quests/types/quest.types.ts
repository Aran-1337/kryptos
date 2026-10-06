export type QuestRewardType = 'money' | 'physical';

export interface Quest {
  id: string;
  title: string;
  description: string;
  pointsReward: number;
  rewardType: QuestRewardType;
  rewardAmount?: number;
  rewardGiftName?: string;
  grade: string;
  icon: string;
  active: boolean;
}

export interface PointsCalculationRules {
  pointsPerMinute: string;
  pointsPerExamScore: string;
  pointsPerAssignment: string;
}

export interface QuestFormData {
  title: string;
  description: string;
  pointsReward: string;
  rewardType: QuestRewardType;
  rewardAmount: string;
  rewardGiftName: string;
  icon: string;
  questGrade: string;
}
