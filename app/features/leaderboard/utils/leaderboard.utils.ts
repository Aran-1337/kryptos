import { StudentLeaderboardItem } from '../types/leaderboard.types';

export function filterLeaderboard(
  students: StudentLeaderboardItem[],
  search: string,
  selectedGrade: string
): StudentLeaderboardItem[] {
  const query = search.trim().toLowerCase();
  return students.filter(s => {
    const matchesSearch = !query || s.name.toLowerCase().includes(query) || s.governorate.toLowerCase().includes(query);
    const matchesGrade = selectedGrade === 'all' || s.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });
}

export function getRankBadgeColors(idx: number): { bg: string; color: string } {
  switch (idx) {
    case 0:
      return { bg: '#fef3c7', color: '#b45309' };
    case 1:
      return { bg: '#f1f5f9', color: '#475569' };
    case 2:
      return { bg: '#ffedd5', color: '#c2410c' };
    default:
      return { bg: 'var(--bg)', color: 'var(--text-muted)' };
  }
}
