'use client';
import { Plus } from 'lucide-react';
import AdminPageHeader from '@/app/components/layout/AdminPageHeader';
import SearchInput from '@/app/components/ui/SearchInput';
import Toast from '@/app/components/ui/Toast';
import {
  useExams,
  ExamsTable,
  QuestionBuilderModal,
  ScheduleExamModal,
  ExamResultsModal,
} from '@/app/features/exams';

export default function AdminExamsPage() {
  const {
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
    toast,
    handleAddQuestion,
    handleRemoveQuestion,
    handleAddQuestionToExistingExam,
    handleRemoveQuestionFromExistingExam,
    handleSaveNewExam,
    handleSaveQuestionsForExam,
    handleDeleteExam,
  } = useExams();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* Page Header */}
      <AdminPageHeader
        title="إدارة الامتحانات والأسئلة 📝"
        subtitle="إضافة الأسئلة والخيارات، جدولة المواعيد، وتتبع محاولات مغادرة الشاشة للطلاب."
        action={
          <button 
            type="button"
            onClick={openNewExamModal}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff',
              border: 'none', padding: '12px 24px', borderRadius: 14,
              fontWeight: 800, fontSize: 14, cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(108,34,249,0.3)', fontFamily: 'Tajawal, sans-serif'
            }}
          >
            <Plus size={18} /> إنشاء امتحان مجدول وإضافة أسئلة
          </button>
        }
      />

      {/* Main Table Card */}
      <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        
        {/* Search Toolbar */}
        <div style={{ padding: 20, borderBottom: '1px solid var(--border)', display: 'flex', gap: 16, alignItems: 'center' }}>
          <SearchInput 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث عن اسم امتحان أو كورس..." 
          />
        </div>

        {/* Exams Table */}
        <ExamsTable
          exams={filteredExams}
          onManageQuestions={setEditingQuestionsExam}
          onViewResults={setSelectedExamResults}
          onDeleteExam={handleDeleteExam}
        />
      </div>

      {/* 1. Question Manager Modal for Existing Exam */}
      <QuestionBuilderModal
        exam={editingQuestionsExam}
        onClose={() => setEditingQuestionsExam(null)}
        onSave={handleSaveQuestionsForExam}
        qText={qText}
        setQText={setQText}
        qOpt0={qOpt0}
        setQOpt0={setQOpt0}
        qOpt1={qOpt1}
        setQOpt1={setQOpt1}
        qOpt2={qOpt2}
        setQOpt2={setQOpt2}
        qOpt3={qOpt3}
        setQOpt3={setQOpt3}
        qCorrectIndex={qCorrectIndex}
        setQCorrectIndex={setQCorrectIndex}
        qPoints={qPoints}
        setQPoints={setQPoints}
        onAddQuestion={handleAddQuestionToExistingExam}
        onRemoveQuestion={handleRemoveQuestionFromExistingExam}
      />

      {/* 2. Create New Exam Modal */}
      <ScheduleExamModal
        isOpen={showNewExamModal}
        onClose={() => setShowNewExamModal(false)}
        onSave={handleSaveNewExam}
        examTitle={examTitle}
        setExamTitle={setExamTitle}
        examCourse={examCourse}
        setExamCourse={setExamCourse}
        examDuration={examDuration}
        setExamDuration={setExamDuration}
        shuffleQuestions={shuffleQuestions}
        setShuffleQuestions={setShuffleQuestions}
        shuffleOptions={shuffleOptions}
        setShuffleOptions={setShuffleOptions}
        questionsList={questionsList}
        onRemoveQuestion={handleRemoveQuestion}
        qText={qText}
        setQText={setQText}
        qOpt0={qOpt0}
        setQOpt0={setQOpt0}
        qOpt1={qOpt1}
        setQOpt1={setQOpt1}
        qOpt2={qOpt2}
        setQOpt2={setQOpt2}
        qOpt3={qOpt3}
        setQOpt3={setQOpt3}
        qCorrectIndex={qCorrectIndex}
        setQCorrectIndex={setQCorrectIndex}
        onAddQuestion={handleAddQuestion}
      />

      {/* 3. Student Results & Cheating Log Modal */}
      <ExamResultsModal
        exam={selectedExamResults}
        onClose={() => setSelectedExamResults(null)}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />

    </div>
  );
}
