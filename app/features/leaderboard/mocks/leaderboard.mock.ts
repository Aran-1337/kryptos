import { StudentLeaderboardItem } from '../types/leaderboard.types';

export const initialStudents: StudentLeaderboardItem[] = [
  { id: '1', rank: 1, name: 'أحمد محمود العبد', grade: 'أولى ثانوي', governorate: 'القاهرة', score: '99.5%', points: 2950, badge: '🥇 المركز الأول (العبقري)', isPinned: true, isVisible: true },
  { id: '2', rank: 2, name: 'سارة خالد السيد', grade: 'ثانية ثانوي', governorate: 'الإسكندرية', score: '98.8%', points: 2820, badge: '🥈 المركز الثاني', isPinned: true, isVisible: true },
  { id: '3', rank: 3, name: 'عمر طارق إبراهيم', grade: 'أولى ثانوي', governorate: 'المنصورة', score: '97.4%', points: 2710, badge: '🥉 المركز الثالث', isPinned: true, isVisible: true },
  { id: '4', rank: 4, name: 'مريم سعيد النجار', grade: 'تأسيس', governorate: 'أسيوط', score: '96.2%', points: 2540, badge: '⭐ متفوق رائع', isPinned: false, isVisible: true },
  { id: '5', rank: 5, name: 'يوسف حسن علي', grade: 'ثانية ثانوي', governorate: 'الجيزة', score: '95.0%', points: 2410, badge: '⭐ متفوق رائع', isPinned: false, isVisible: true },
  { id: '6', rank: 6, name: 'نور أحمد مصطفى', grade: 'أولى ثانوي', governorate: 'طنطا', score: '94.5%', points: 2380, badge: '⭐ متفوق رائع', isPinned: false, isVisible: true },
];
