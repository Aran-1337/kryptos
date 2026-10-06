import { StudentLeaderboardItem, NewStudentFormData } from '../types/leaderboard.types';
import { initialStudents } from '../mocks/leaderboard.mock';

const LEADERBOARD_STORAGE_KEY = 'admin_leaderboard_students';

export const leaderboardService = {
  getStudents(): StudentLeaderboardItem[] {
    if (typeof window === 'undefined') return [...initialStudents];
    try {
      const saved = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(initialStudents));
    } catch (e) {
      console.error('Failed to load leaderboard students:', e);
    }
    return [...initialStudents];
  },

  saveStudents(students: StudentLeaderboardItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save leaderboard students:', e);
    }
  },

  toggleVisibility(students: StudentLeaderboardItem[], id: string): StudentLeaderboardItem[] {
    const updated = students.map(s => (s.id === id ? { ...s, isVisible: !s.isVisible } : s));
    this.saveStudents(updated);
    return updated;
  },

  togglePin(students: StudentLeaderboardItem[], id: string): StudentLeaderboardItem[] {
    const updated = students.map(s => (s.id === id ? { ...s, isPinned: !s.isPinned } : s));
    this.saveStudents(updated);
    return updated;
  },

  deleteStudent(students: StudentLeaderboardItem[], id: string): StudentLeaderboardItem[] {
    const updated = students.filter(s => s.id !== id);
    this.saveStudents(updated);
    return updated;
  },

  addStudent(students: StudentLeaderboardItem[], data: NewStudentFormData): StudentLeaderboardItem[] {
    const newItem: StudentLeaderboardItem = {
      id: Date.now().toString(),
      rank: students.length + 1,
      name: data.name,
      grade: data.grade,
      governorate: data.governorate,
      points: Number(data.points) || 2000,
      score: data.score ? `${data.score}%` : '95%',
      badge: data.badge,
      isPinned: false,
      isVisible: true,
    };
    const updated = [newItem, ...students];
    this.saveStudents(updated);
    return updated;
  },

  updateStudent(students: StudentLeaderboardItem[], updatedItem: StudentLeaderboardItem): StudentLeaderboardItem[] {
    const updated = students.map(s => (s.id === updatedItem.id ? updatedItem : s));
    this.saveStudents(updated);
    return updated;
  },
};
