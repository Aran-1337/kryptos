'use client';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import AdminPageHeader from '@/app/components/layout/AdminPageHeader';
import {
  useQuests,
  PointsConfig,
  GradeTabs,
  QuestsList,
  QuestFormModal,
} from '@/app/features/quests';

export default function AdminQuestsPage() {
  const {
    pointsPerMinute,
    setPointsPerMinute,
    pointsPerExamScore,
    setPointsPerExamScore,
    pointsPerAssignment,
    setPointsPerAssignment,
    availableGrades,
    selectedGradeTab,
    setSelectedGradeTab,
    quests,
    filteredQuests,
    showAddQuestModal,
    setShowAddQuestModal,
    editingQuest,
    savedMsg,
    title,
    setTitle,
    description,
    setDescription,
    pointsReward,
    setPointsReward,
    rewardType,
    setRewardType,
    rewardAmount,
    setRewardAmount,
    rewardGiftName,
    setRewardGiftName,
    icon,
    setIcon,
    questGrade,
    setQuestGrade,
    handleSavePointsRules,
    handleSaveQuestSubmit,
    handleDeleteQuest,
    openEdit,
    openCreate,
  } = useQuests();

  return (
    <div style={{ width: '100%', fontFamily: 'Tajawal, sans-serif', direction: 'rtl', maxWidth: 1280, margin: '0 auto' }}>
      
      {/* Toast Notification */}
      {savedMsg && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--surface)',
            color: 'var(--text-main)',
            padding: '12px 24px',
            borderRadius: 12,
            fontWeight: 800,
            zIndex: 9999,
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            border: '1px solid var(--border)',
          }}
        >
          {savedMsg}
        </motion.div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <AdminPageHeader
          title="إدارة التحديات والمكافآت وقواعد النقاط 🎯🎁"
          subtitle="تحديد عدد النقاط التي يكتسبها الطالب من المشاهدات والامتحانات والواجبات، وإنشاء تحديات وجوائز جديدة."
          action={
            <button
              type="button"
              onClick={openCreate}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'linear-gradient(135deg, #6C22F9, #4f46e5)',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 12,
                fontWeight: 800,
                fontSize: 14,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(108,34,249,0.3)',
                fontFamily: 'Tajawal, sans-serif',
              }}
            >
              <Plus size={18} /> إنشاء تحدي ومكافأة جديدة
            </button>
          }
        />
      </div>

      {/* Section 1: Points Engine Rules Manager */}
      <PointsConfig
        pointsPerMinute={pointsPerMinute}
        setPointsPerMinute={setPointsPerMinute}
        pointsPerExamScore={pointsPerExamScore}
        setPointsPerExamScore={setPointsPerExamScore}
        pointsPerAssignment={pointsPerAssignment}
        setPointsPerAssignment={setPointsPerAssignment}
        onSave={handleSavePointsRules}
      />

      {/* Section 2: Grade Filter Tabs */}
      <GradeTabs
        selectedGradeTab={selectedGradeTab}
        onSelectGradeTab={setSelectedGradeTab}
        availableGrades={availableGrades}
        quests={quests}
      />

      {/* Quests Grid */}
      <QuestsList
        quests={filteredQuests}
        onEdit={openEdit}
        onDelete={handleDeleteQuest}
      />

      {/* Add / Edit Quest Modal */}
      <QuestFormModal
        isOpen={showAddQuestModal}
        onClose={() => setShowAddQuestModal(false)}
        isEditing={!!editingQuest}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        questGrade={questGrade}
        setQuestGrade={setQuestGrade}
        availableGrades={availableGrades}
        pointsReward={pointsReward}
        setPointsReward={setPointsReward}
        icon={icon}
        setIcon={setIcon}
        rewardType={rewardType}
        setRewardType={setRewardType}
        rewardAmount={rewardAmount}
        setRewardAmount={setRewardAmount}
        rewardGiftName={rewardGiftName}
        setRewardGiftName={setRewardGiftName}
        onSubmit={handleSaveQuestSubmit}
      />

    </div>
  );
}
