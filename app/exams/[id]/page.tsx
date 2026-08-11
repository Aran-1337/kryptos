'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, HelpCircle, Award, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

// Mock Exam Data
const rawExamData = {
  id: 1,
  title: 'امتحان الشامل في الخوارزميات وتراكيب البيانات',
  course: 'كورس أولى ثانوي - الترم الأول',
  durationMinutes: 30,
  startTime: '2026-08-06T02:00:00.000Z',
  questions: [
    {
      id: 'q1',
      text: 'ما هي المخرجات المتوقعة للكود التالي في لغة بايثون؟',
      code: 'x = [1, 2, 3]\nx.append([4, 5])\nprint(len(x))',
      options: ['4', '5', '3', 'Error'],
      correctAnswer: '4'
    },
    {
      id: 'q2',
      text: 'أي من التراكيب التالية يعتمد على مبدأ (LIFO - Last In First Out)؟',
      options: ['Stack (المكدس)', 'Queue (الطابور)', 'Array (المصفوفة)', 'Tree (الشجرة)'],
      correctAnswer: 'Stack (المكدس)'
    },
    {
      id: 'q3',
      text: 'ما هو تعقيد الوقت (Time Complexity) لخوارزمية البحث الثنائي (Binary Search)؟',
      options: ['O(log n)', 'O(n)', 'O(n^2)', 'O(1)'],
      correctAnswer: 'O(log n)'
    }
  ]
};

// Utility to shuffle arrays for anti-cheating
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function StudentExamPage() {
  const [examStarted, setExamStarted] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(rawExamData.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Custom Pop Up Warning State
  const [tabWarnings, setTabWarnings] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const [score, setScore] = useState(0);

  useEffect(() => {
    const questionsWithShuffledOptions = rawExamData.questions.map(q => ({
      ...q,
      shuffledOptions: shuffleArray(q.options)
    }));
    setShuffledQuestions(shuffleArray(questionsWithShuffledOptions));
  }, []);

  // Countdown timer once exam starts
  useEffect(() => {
    if (!examStarted || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, isSubmitted]);

  // Anti-cheating: Tab switch / Window blur detection using custom styled Modal
  useEffect(() => {
    if (!examStarted || isSubmitted) return;
    const handleBlur = () => {
      setTabWarnings(w => {
        const next = w + 1;
        setShowWarningModal(true);
        if (next >= 3) {
          handleSubmitExam();
        }
        return next;
      });
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [examStarted, isSubmitted]);

  const handleSelectOption = (qId: string, option: string) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    setShowWarningModal(false);
    let calculatedScore = 0;
    shuffledQuestions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = shuffledQuestions[currentQIndex];

  return (
    <div style={{ background: '#0f0c29', minHeight: '100vh', color: '#fff', padding: '40px 20px', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      <div style={{ maxWidth: 850, margin: '0 auto' }}>

        {/* Start Screen */}
        {!examStarted && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#16133a', borderRadius: 24, padding: 40, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(108,34,249,0.2)', border: '2px solid #6C22F9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <HelpCircle size={40} color="#6C22F9" />
            </div>

            <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 12 }}>{rawExamData.title}</h1>
            <p style={{ color: '#b8b5d8', fontSize: 15, marginBottom: 28 }}>{rawExamData.course}</p>

            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32, textAlign: 'center' }}>
              <div>
                <span style={{ fontSize: 13, color: '#9896c0' }}>مدة الامتحان</span>
                <h3 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 800, color: '#10b981' }}>{rawExamData.durationMinutes} دقيقة</h3>
              </div>
              <div>
                <span style={{ fontSize: 13, color: '#9896c0' }}>عدد الأسئلة</span>
                <h3 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 800, color: '#3b82f6' }}>{rawExamData.questions.length} أسئلة</h3>
              </div>
              <div>
                <span style={{ fontSize: 13, color: '#9896c0' }}>نظام الحماية</span>
                <h3 style={{ margin: '4px 0 0', fontSize: 15, fontWeight: 800, color: '#ef4444' }}>منع الغش عشوائي</h3>
              </div>
            </div>

            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: 16, borderRadius: 12, color: '#fca5a5', fontSize: 14, lineHeight: 1.7, marginBottom: 32, textAlign: 'right' }}>
              <strong>⚠️ قواعد الامتحان لمنع الغش:</strong>
              <ul style={{ margin: '8px 20px 0 0' }}>
                <li>تم خلط ترتيب الأسئلة والإجابات خصيصاً لك.</li>
                <li>يُحظر مغادرة الشاشة أو فتح متصفح آخر (3 تحذيرات وسيتم تسليم الامتحان تلقائياً).</li>
                <li>التايمر يبدأ فور الضغط على زر بدء الامتحان.</li>
              </ul>
            </div>

            <button 
              onClick={() => setExamStarted(true)}
              style={{ background: 'linear-gradient(135deg, #6C22F9, #9b6cf9)', color: '#fff', border: 'none', padding: '16px 48px', borderRadius: 14, fontSize: 18, fontWeight: 900, cursor: 'pointer', boxShadow: '0 8px 24px rgba(108,34,249,0.4)' }}
            >
              ابدأ الامتحان الآن 🚀
            </button>
          </motion.div>
        )}

        {/* Live Exam Screen */}
        {examStarted && !isSubmitted && currentQ && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Header Bar with Timer */}
            <div style={{ background: '#16133a', borderRadius: 16, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <span style={{ fontSize: 13, color: '#9896c0' }}>السؤال {currentQIndex + 1} من {shuffledQuestions.length}</span>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#fff' }}>{rawExamData.title}</h3>
              </div>

              {/* Timer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: timeLeftSeconds < 300 ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.15)', border: `1px solid ${timeLeftSeconds < 300 ? '#ef4444' : '#10b981'}`, padding: '8px 16px', borderRadius: 12 }}>
                <Clock size={20} color={timeLeftSeconds < 300 ? '#ef4444' : '#10b981'} />
                <span style={{ fontSize: 18, fontWeight: 900, color: timeLeftSeconds < 300 ? '#ef4444' : '#10b981', letterSpacing: 1 }}>{formatTime(timeLeftSeconds)}</span>
              </div>
            </div>

            {/* Question Card */}
            <div style={{ background: '#16133a', borderRadius: 24, padding: 32, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 20, lineHeight: 1.5 }}>
                {currentQIndex + 1}. {currentQ.text}
              </h2>

              {currentQ.code && (
                <div style={{ background: '#09071b', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace', fontSize: 14, color: '#a78bfa', direction: 'ltr', textAlign: 'left', marginBottom: 24, whiteSpace: 'pre-wrap' }}>
                  {currentQ.code}
                </div>
              )}

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {currentQ.shuffledOptions.map((opt: string, idx: number) => {
                  const isSelected = userAnswers[currentQ.id] === opt;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(currentQ.id, opt)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderRadius: 14,
                        background: isSelected ? 'rgba(108,34,249,0.25)' : 'rgba(255,255,255,0.04)',
                        border: isSelected ? '2px solid #6C22F9' : '1px solid rgba(255,255,255,0.08)',
                        color: '#fff', fontSize: 15, fontWeight: 700, textAlign: 'right', cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ width: 24, height: 24, borderRadius: '50%', border: isSelected ? '6px solid #6C22F9' : '2px solid rgba(255,255,255,0.3)', background: isSelected ? '#fff' : 'transparent' }} />
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(i => i - 1)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px 20px', borderRadius: 12, fontWeight: 700, cursor: currentQIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentQIndex === 0 ? 0.4 : 1 }}
              >
                السؤال السابق
              </button>

              {currentQIndex === shuffledQuestions.length - 1 ? (
                <button
                  onClick={handleSubmitExam}
                  style={{ background: '#10b981', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 12, fontWeight: 900, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.4)' }}
                >
                  إنهاء وتسليم الامتحان 🏆
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQIndex(i => i + 1)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#6C22F9', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}
                >
                  السؤال التالي
                </button>
              )}
            </div>

          </div>
        )}

        {/* Results Screen */}
        {isSubmitted && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: '#16133a', borderRadius: 24, padding: 40, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Award size={40} color="#10b981" />
            </div>

            <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>تم تسليم الامتحان بنجاح! 🎉</h1>
            <p style={{ color: '#b8b5d8', fontSize: 15, marginBottom: 28 }}>نتيجة التقييم الفورية</p>

            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: 32, maxWidth: 400, margin: '0 auto 32px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: 14, color: '#9896c0' }}>درجتك الحاصل عليها</span>
              <h2 style={{ fontSize: 48, fontWeight: 900, color: '#10b981', margin: '8px 0' }}>{score} / {shuffledQuestions.length}</h2>
              <span style={{ fontSize: 13, color: '#a78bfa', fontWeight: 700 }}>نسبة النجاح: {Math.round((score / shuffledQuestions.length) * 100)}%</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <Link href="/dashboard" style={{ background: '#6C22F9', color: '#fff', padding: '12px 28px', borderRadius: 12, textDecoration: 'none', fontWeight: 800, fontSize: 15 }}>
                العودة للوحة التحكم
              </Link>
            </div>
          </motion.div>
        )}

      </div>

      {/* Perfectly Centered Anti-Cheating Warning Pop Up Modal */}
      <AnimatePresence>
        {showWarningModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
            
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(10, 8, 25, 0.85)', backdropFilter: 'blur(8px)' }}
              onClick={() => setShowWarningModal(false)}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: 480,
                background: '#16133a',
                borderRadius: 24,
                padding: 36,
                border: '2px solid #ef4444',
                boxShadow: '0 0 50px rgba(239, 68, 68, 0.4)',
                textAlign: 'center',
                zIndex: 1001
              }}
            >
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239,68,68,0.2)', border: '2px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <AlertTriangle size={32} color="#ef4444" />
              </div>

              <h3 style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 12 }}>⚠️ تنبيه أمني ضد الغش!</h3>
              <p style={{ color: '#fca5a5', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
                لقد قمت بمغادرة شاشة الامتحان أو التبديل لتبويب آخر. <br />
                <strong style={{ color: '#ef4444', fontSize: 16 }}>التحذير الحالي: ({tabWarnings}/3)</strong><br />
                في حال تكرار المغادرة للمرة الثالثة، سيتم إنهاء وتسليم الامتحان أوتوماتيكياً!
              </p>

              <button
                onClick={() => setShowWarningModal(false)}
                style={{
                  width: '100%', padding: '14px', background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: '#fff', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 900,
                  cursor: 'pointer', boxShadow: '0 6px 20px rgba(239,68,68,0.4)', transition: 'all 0.2s'
                }}
              >
                فهمت، العودة للامتحان ✍️
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
