export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  points: number;
  explanation?: string;
}

export interface StudentResult {
  id: number;
  name: string;
  score: string;
  percentage: string;
  tabSwitchCount: number;
  autoSubmitted: boolean;
  timeTaken: string;
  status: string;
}

export interface Exam {
  id: number;
  title: string;
  course: string;
  questionsCount: number;
  duration: string;
  startTime: string;
  status: string;
  isShuffled: boolean;
  submissionsCount: number;
  questions: Question[];
  studentResults: StudentResult[];
}

export interface NewExamDraft {
  title: string;
  course: string;
  startTime: string;
  duration: string;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  questions: Question[];
}
