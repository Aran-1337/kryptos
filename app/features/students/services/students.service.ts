import { Student, StudentNotesMap, StudentTeacherNote } from '../types/student.types';
import { initialStudents, initialStudentNotes } from '../mocks/student.mock';

const STUDENTS_STORAGE_KEY = 'admin_students_list';
const TEACHER_NOTES_STORAGE_KEY = 'student_teacher_notes';

export const studentsService = {
  getStudents(): Student[] {
    if (typeof window === 'undefined') return initialStudents;
    try {
      const saved = localStorage.getItem(STUDENTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to read students from localStorage', e);
    }
    return initialStudents;
  },

  saveStudents(students: Student[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students to localStorage', e);
    }
  },

  getTeacherNotes(): StudentNotesMap {
    if (typeof window === 'undefined') return initialStudentNotes;
    try {
      const saved = localStorage.getItem(TEACHER_NOTES_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to read teacher notes from localStorage', e);
    }
    return initialStudentNotes;
  },

  saveTeacherNote(studentId: number | string, noteData: StudentTeacherNote): StudentNotesMap {
    const currentNotes = this.getTeacherNotes();
    const updated: StudentNotesMap = {
      ...currentNotes,
      [String(studentId)]: noteData,
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(TEACHER_NOTES_STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('teacher_notes_updated'));
      } catch (e) {
        console.error('Failed to save teacher note to localStorage', e);
      }
    }

    return updated;
  },
};
