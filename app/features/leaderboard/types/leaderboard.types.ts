export interface StudentLeaderboardItem {
  id: string;
  rank: number;
  name: string;
  grade: string;
  governorate: string;
  score: string;
  points: number;
  badge: string;
  isPinned: boolean;
  isVisible: boolean;
}

export interface NewStudentFormData {
  name: string;
  grade: string;
  governorate: string;
  points: string;
  score: string;
  badge: string;
}
