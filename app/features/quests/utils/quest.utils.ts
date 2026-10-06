import { Quest, PointsCalculationRules } from '../types/quest.types';

/**
 * Filter quests based on selected grade tab
 */
export function filterQuestsByGrade(quests: Quest[], selectedGradeTab: string): Quest[] {
  return quests.filter(q => {
    if (selectedGradeTab === 'all') return true;
    if (selectedGradeTab === 'general') return !q.grade || q.grade === 'all';
    return q.grade === selectedGradeTab;
  });
}

/**
 * Calculates XP points based on student activity and current points rules.
 * NOTE: This is client-side preview / computation logic.
 * Server-authoritative validation will be enforced by the backend upon completion.
 */
export function calculateXpPoints(
  watchMinutes: number,
  examScorePercent: number,
  assignmentsCount: number,
  rules: PointsCalculationRules
): number {
  const watchPoints = watchMinutes * (Number(rules.pointsPerMinute) || 0);
  const examPoints = examScorePercent * (Number(rules.pointsPerExamScore) || 0);
  const assignmentPoints = assignmentsCount * (Number(rules.pointsPerAssignment) || 0);
  return Math.round(watchPoints + examPoints + assignmentPoints);
}
