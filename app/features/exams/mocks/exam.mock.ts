import { Exam } from '../types/exam.types';

export const initialExams: Exam[] = [
  { 
    id: 1, 
    title: 'امتحان الشامل في الخوارزميات وتراكيب البيانات', 
    course: 'كورس أولى ثانوي - الترم الأول', 
    questionsCount: 3, 
    duration: '30 دقيقة', 
    startTime: '2026-08-06 الساعة 02:00 مساءً', 
    status: 'مجدول (جاهز)', 
    isShuffled: true,
    submissionsCount: 45,
    questions: [
      {
        id: 'q1',
        text: 'ما هي التعقدية الزمنية (Time Complexity) للبحث الثنائي Binary Search؟',
        options: ['O(1)', 'O(N)', 'O(log N)', 'O(N²)'],
        correctOptionIndex: 2,
        points: 5,
        explanation: 'يقوم البحث الثنائي بتقسيم مصفوفة البيانات المرتبة إلى النصف في كل خطوة.'
      },
      {
        id: 'q2',
        text: 'أي من تراكيب البيانات التالية يعتمد على مبدأ (LIFO - Last In First Out)؟',
        options: ['الكتلة (Queue)', 'المكدس (Stack)', 'المصفوفة (Array)', 'القائمة الموصولة (LinkedList)'],
        correctOptionIndex: 1,
        points: 5,
        explanation: 'الـ Stack يعتمد على مبدأ آخر عنصر يدخل هو أول عنصر يخرج.'
      },
      {
        id: 'q3',
        text: 'في لغة بايثون، ما هو الكود الصحيح لتعريف مصفوفة قائمة جديدة؟',
        options: ['arr = []', 'arr = {}', 'arr = ()', 'arr = <>'],
        correctOptionIndex: 0,
        points: 5,
        explanation: 'الأقواس المربعة [] هي الطريقة القياسية لإنشاء القوائم (Lists) في بايثون.'
      }
    ],
    studentResults: [
      { id: 101, name: 'أحمد محمود', score: '15 / 15', percentage: '100%', tabSwitchCount: 0, autoSubmitted: false, timeTaken: '22 دقيقة', status: 'ممتاز ✅' },
      { id: 102, name: 'سارة خالد', score: '10 / 15', percentage: '67%', tabSwitchCount: 2, autoSubmitted: false, timeTaken: '28 دقيقة', status: '⚠️ مغادرة (مرتين)' },
      { id: 103, name: 'عمر طارق', score: '05 / 15', percentage: '33%', tabSwitchCount: 3, autoSubmitted: true, timeTaken: '08 دقائق', status: '🚨 طرد إجباري (غش)' },
      { id: 104, name: 'مريم سعيد', score: '15 / 15', percentage: '100%', tabSwitchCount: 0, autoSubmitted: false, timeTaken: '18 دقيقة', status: 'ممتاز ✅' },
    ]
  },
  { 
    id: 2, 
    title: 'اختبار قصير: أساسيات بايثون', 
    course: 'الكورس التأسيسي في البرمجة', 
    questionsCount: 2, 
    duration: '15 دقيقة', 
    startTime: '2026-08-10 الساعة 06:00 مساءً', 
    status: 'مجدول', 
    isShuffled: true,
    submissionsCount: 12,
    questions: [
      {
        id: 'q201',
        text: 'ما ناتج تنفيذ الأمر print(2 ** 3) في لغة بايثون؟',
        options: ['6', '8', '9', '5'],
        correctOptionIndex: 1,
        points: 5,
        explanation: 'العلامة ** تعني الأسس، 2 أس 3 يساوي 8.'
      }
    ],
    studentResults: []
  },
];
