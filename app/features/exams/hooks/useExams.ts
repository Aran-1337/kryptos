'use client';
import { useState, useMemo, useEffect } from 'react';
import { Exam, Question } from '../types/exam.types';
import { initialExams } from '../mocks/exam.mock';
import { examsService } from '../services/exams.service';

export function useExams() {
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [search, setSearch] = useState('');
  const [showNewExamModal, setShowNewExamModal] = useState(false);
  const [selectedExamResults, setSelectedExamResults] = useState<Exam | null>(null);
  const [editingQuestionsExam, setEditingQuestionsExam] = useState<Exam | null>(null);

  // Form State for Exam Creation/Edit
  const [examTitle, setExamTitle] = useState('');
  const [examCourse, setExamCourse] = useState('كورس أولى ثانوي - الترم الأول');
  const [examStartTime, setExamStartTime] = useState('');
  const [examDuration, setExamDuration] = useState('30');
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [questionsList, setQuestionsList] = useState<Question[]>([]);

  // Question Form State inside modal
  const [qText, setQText] = useState('');
  const [qOpt0, setQOpt0] = useState('');
  const [qOpt1, setQOpt1] = useState('');
  const [qOpt2, setQOpt2] = useState('');
  const [qOpt3, setQOpt3] = useState('');
  const [qCorrectIndex, setQCorrectIndex] = useState(0);
  const [qPoints, setQPoints] = useState('5');
  const [qExplanation, setQExplanation] = useState('');

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false,
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Load from service on mount
  useEffect(() => {
    examsService.getExams().then(data => {
      if (data && data.length > 0) {
        setExams(data);
      }
    });
  }, []);

  const filteredExams = useMemo(() => {
    return exams.filter(e => 
      e.title.toLowerCase().includes(search.toLowerCase()) || 
      e.course.toLowerCase().includes(search.toLowerCase())
    );
  }, [exams, search]);

  const handleAddQuestion = () => {
    if (!qText.trim() || !qOpt0.trim() || !qOpt1.trim()) {
      alert('يرجى كتابة نص السؤال والإجابتين على الأقل.');
      return;
    }
    const newQ: Question = {
      id: Date.now().toString(),
      text: qText,
      options: [qOpt0, qOpt1, qOpt2 || 'غ/م', qOpt3 || 'غ/م'].filter(Boolean),
      correctOptionIndex: qCorrectIndex,
      points: Number(qPoints) || 5,
      explanation: qExplanation,
    };

    setQuestionsList(prev => [...prev, newQ]);
    // Reset question form
    setQText(''); 
    setQOpt0(''); 
    setQOpt1(''); 
    setQOpt2(''); 
    setQOpt3(''); 
    setQExplanation('');
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestionsList(prev => prev.filter(q => q.id !== id));
  };

  const handleAddQuestionToExistingExam = () => {
    if (!editingQuestionsExam) return;
    if (!qText.trim() || !qOpt0.trim()) { 
      alert('يرجى ادخال نص السؤال والخيارات'); 
      return; 
    }
    const newQ: Question = {
      id: Date.now().toString(),
      text: qText,
      options: [qOpt0, qOpt1, qOpt2 || 'غ/م', qOpt3 || 'غ/م'].filter(Boolean),
      correctOptionIndex: qCorrectIndex,
      points: Number(qPoints) || 5,
    };
    setEditingQuestionsExam({
      ...editingQuestionsExam,
      questions: [...(editingQuestionsExam.questions || []), newQ],
    });
    setQText(''); 
    setQOpt0(''); 
    setQOpt1(''); 
    setQOpt2(''); 
    setQOpt3('');
  };

  const handleRemoveQuestionFromExistingExam = (questionId: string) => {
    if (!editingQuestionsExam) return;
    const updatedQ = editingQuestionsExam.questions.filter(item => item.id !== questionId);
    setEditingQuestionsExam({ ...editingQuestionsExam, questions: updatedQ });
  };

  const handleSaveNewExam = () => {
    if (!examTitle.trim()) {
      alert('يرجى كتابة عنوان الامتحان.');
      return;
    }
    const newExam: Exam = {
      id: Date.now(),
      title: examTitle,
      course: examCourse,
      questionsCount: questionsList.length,
      duration: `${examDuration} دقيقة`,
      startTime: examStartTime || '2026-08-15 الساعة 08:00 مساءً',
      status: 'مجدول (جاهز)',
      isShuffled: shuffleQuestions,
      submissionsCount: 0,
      questions: questionsList,
      studentResults: [],
    };

    examsService.createExam(exams, newExam).then(updated => {
      setExams(updated);
      setShowNewExamModal(false);
      setExamTitle(''); 
      setQuestionsList([]);
      showToast('تم إنشاء وحفظ الامتحان بنجاح! 🚀');
    });
  };

  const handleSaveQuestionsForExam = () => {
    if (!editingQuestionsExam) return;
    examsService.updateQuestions(exams, editingQuestionsExam.id, editingQuestionsExam.questions).then(updated => {
      setExams(updated);
      setEditingQuestionsExam(null);
      showToast('تم تحديث أسئلة الامتحان بنجاح! ✅');
    });
  };

  const handleDeleteExam = (id: number, title: string) => {
    if (confirm(`هل أنت متأكد من حذف امتحان "${title}"؟`)) {
      examsService.deleteExam(exams, id).then(updated => {
        setExams(updated);
        showToast(`تم حذف امتحان "${title}" بنجاح.`);
      });
    }
  };

  const openNewExamModal = () => {
    setShowNewExamModal(true);
    setQuestionsList([]);
  };

  return {
    exams,
    filteredExams,
    search,
    setSearch,
    showNewExamModal,
    setShowNewExamModal,
    openNewExamModal,
    selectedExamResults,
    setSelectedExamResults,
    editingQuestionsExam,
    setEditingQuestionsExam,
    examTitle,
    setExamTitle,
    examCourse,
    setExamCourse,
    examStartTime,
    setExamStartTime,
    examDuration,
    setExamDuration,
    shuffleQuestions,
    setShuffleQuestions,
    shuffleOptions,
    setShuffleOptions,
    questionsList,
    qText,
    setQText,
    qOpt0,
    setQOpt0,
    qOpt1,
    setQOpt1,
    qOpt2,
    setQOpt2,
    qOpt3,
    setQOpt3,
    qCorrectIndex,
    setQCorrectIndex,
    qPoints,
    setQPoints,
    qExplanation,
    setQExplanation,
    toast,
    setToast,
    handleAddQuestion,
    handleRemoveQuestion,
    handleAddQuestionToExistingExam,
    handleRemoveQuestionFromExistingExam,
    handleSaveNewExam,
    handleSaveQuestionsForExam,
    handleDeleteExam,
  };
}
