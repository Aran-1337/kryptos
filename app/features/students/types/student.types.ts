export type DeviceType = 'laptop' | 'mobile';

export interface Device {
  id: string;
  type: DeviceType;
  name: string;
  ip: string;
  city: string;
  isSameNetwork: boolean;
  lastActive: string;
  isCurrent: boolean;
}

export type StudentGrade = 'أولى ثانوي' | 'ثانية ثانوي' | 'تأسيس' | string;

export type StudentStatus = 'نشط' | 'محظور';

export interface Student {
  id: number;
  name: string;
  email: string;
  grade: StudentGrade;
  courses: number;
  joinedAt: string;
  status: StudentStatus;
  devicesCount: number;
  devices: Device[];
}

export interface StudentTeacherNote {
  note: string;
  strengths: string;
  improvement: string;
}

export type StudentNotesMap = Record<string, StudentTeacherNote | string>;

export type GradeFilter = 'all' | 'grade1' | 'grade2' | 'foundation' | string;
