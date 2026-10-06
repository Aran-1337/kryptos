import { Quest, PointsCalculationRules } from '../types/quest.types';

export const defaultPointsRules: PointsCalculationRules = {
  pointsPerMinute: '1',
  pointsPerExamScore: '10',
  pointsPerAssignment: '50',
};

export const initialQuests: Quest[] = [
  {
    id: 'q-1',
    title: 'بطل الخوارزميات (تخطّي امتحان الأسبوع بنسبة 90%+)',
    description: 'حل امتحان الخوارزميات والحصول على درجة ممتاز بدون أي إنذارات.',
    pointsReward: 300,
    rewardType: 'money',
    rewardAmount: 50,
    grade: 'الصف الأول الثانوي',
    icon: '🏆',
    active: true,
  },
  {
    id: 'q-2',
    title: 'وسام المتفوق البرمجي (هدية ملموسة فاخرة 🎁)',
    description: 'إكمال دورة بايثون والذكاء الاصطناعي والحصول على أعلى درجة في الاختبار الشامل.',
    pointsReward: 1000,
    rewardType: 'physical',
    rewardGiftName: 'مجموعة المذكرات الورقية المطبوعة + ميدالية التفوق البرمجي 🏅',
    grade: 'الصف الثاني الثانوي',
    icon: '🎁',
    active: true,
  },
  {
    id: 'q-3',
    title: 'الانضباط البرمجي الأسبوعي (مشاهدة 4 دروس كاملة)',
    description: 'إنجاز 4 دروس فيديو كاملة في المنهج هذا الأسبوع بدون تخطي.',
    pointsReward: 200,
    rewardType: 'money',
    rewardAmount: 35,
    grade: 'الصف الأول الثانوي',
    icon: '⚡️',
    active: true,
  },
  {
    id: 'q-4',
    title: 'المتفوّق المتصاعد (المركز الأول في الدفعة) 🥇',
    description: 'التواجد ضمن الثلاثة الأوائل في لوحة المتفوقين لهذا الأسبوع.',
    pointsReward: 400,
    rewardType: 'money',
    rewardAmount: 100,
    grade: 'all',
    icon: '🥇',
    active: true,
  },
];
