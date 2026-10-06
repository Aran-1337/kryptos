import { Exam, Question } from '../types/exam.types';
import { initialExams } from '../mocks/exam.mock';

// Simulated persistence using local storage or fallback to mock
const STORAGE_KEY = 'admin_exams_data';

export const examsService = {
  async getExams(): Promise<Exam[]> {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // fallback to mock if JSON parse fails
        }
      }
    }
    return [...initialExams];
  },

  async saveAll(exams: Exam[]): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
    }
  },

  async deleteExam(exams: Exam[], id: number): Promise<Exam[]> {
    const updated = exams.filter(e => e.id !== id);
    await this.saveAll(updated);
    return updated;
  },

  async createExam(exams: Exam[], newExam: Exam): Promise<Exam[]> {
    const updated = [newExam, ...exams];
    await this.saveAll(updated);
    return updated;
  },

  async updateQuestions(exams: Exam[], examId: number, questions: Question[]): Promise<Exam[]> {
    const updated = exams.map(e => e.id === examId ? {
      ...e,
      questions,
      questionsCount: questions.length,
    } : e);
    await this.saveAll(updated);
    return updated;
  },
};
