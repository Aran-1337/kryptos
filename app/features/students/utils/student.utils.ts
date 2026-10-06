import { Student, GradeFilter } from '../types/student.types';

export function hasSuspiciousDevices(student: Student): boolean {
  return student.devices.some(d => !d.isSameNetwork);
}

export function filterStudents(
  students: Student[],
  searchQuery: string,
  selectedGrade: GradeFilter
): Student[] {
  return students.filter(student => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = student.name.toLowerCase().includes(q);
      const matchEmail = student.email.toLowerCase().includes(q);
      if (!matchName && !matchEmail) return false;
    }

    // Grade filter
    if (selectedGrade && selectedGrade !== 'all') {
      if (selectedGrade === 'grade1' && student.grade !== 'أولى ثانوي') return false;
      if (selectedGrade === 'grade2' && student.grade !== 'ثانية ثانوي') return false;
      if (selectedGrade === 'foundation' && student.grade !== 'تأسيس') return false;
      if (
        selectedGrade !== 'grade1' &&
        selectedGrade !== 'grade2' &&
        selectedGrade !== 'foundation'
      ) {
        if (student.grade !== selectedGrade) return false;
      }
    }

    return true;
  });
}

export interface StudentStats {
  total: number;
  active: number;
  blocked: number;
  suspicious: number;
}

export function calculateStudentStats(students: Student[]): StudentStats {
  return {
    total: students.length,
    active: students.filter(s => s.status === 'نشط').length,
    blocked: students.filter(s => s.status === 'محظور').length,
    suspicious: students.filter(s => hasSuspiciousDevices(s)).length,
  };
}
