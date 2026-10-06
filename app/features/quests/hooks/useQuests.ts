'use client';
import { useState, useEffect, useMemo } from 'react';
import { Quest, QuestRewardType, QuestFormData } from '../types/quest.types';
import { questsService } from '../services/quests.service';
import { filterQuestsByGrade } from '../utils/quest.utils';
import { getAcademicGrades, AcademicGrade } from '@/app/utils/academicGrades';

export function useQuests() {
  // Custom Points Engine Rules State
  const [pointsPerMinute, setPointsPerMinute] = useState('1');
  const [pointsPerExamScore, setPointsPerExamScore] = useState('10');
  const [pointsPerAssignment, setPointsPerAssignment] = useState('50');

  // Academic Grades State
  const [availableGrades, setAvailableGrades] = useState<AcademicGrade[]>([]);
  const [selectedGradeTab, setSelectedGradeTab] = useState('all');

  // Quests & Rewards State
  const [quests, setQuests] = useState<Quest[]>([]);

  // Modals state
  const [showAddQuestModal, setShowAddQuestModal] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [savedMsg, setSavedMsg] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pointsReward, setPointsReward] = useState('500');
  const [rewardType, setRewardType] = useState<QuestRewardType>('money');
  const [rewardAmount, setRewardAmount] = useState('50');
  const [rewardGiftName, setRewardGiftName] = useState('مجموعة المذكرات الورقية المطبوعة + ميدالية التفوق البرمجي 🏅');
  const [icon, setIcon] = useState('🏆');
  const [questGrade, setQuestGrade] = useState('all');

  useEffect(() => {
    // Load Academic Grades
    const gList = getAcademicGrades().filter(g => g.active);
    setAvailableGrades(gList);

    // Load Points Rules
    const rules = questsService.getPointsRules();
    setPointsPerMinute(rules.pointsPerMinute);
    setPointsPerExamScore(rules.pointsPerExamScore);
    setPointsPerAssignment(rules.pointsPerAssignment);

    // Load Admin Quests
    const loadedQuests = questsService.getQuests();
    setQuests(loadedQuests);
  }, []);

  const filteredQuests = useMemo(() => {
    return filterQuestsByGrade(quests, selectedGradeTab);
  }, [quests, selectedGradeTab]);

  const handleSavePointsRules = () => {
    questsService.savePointsRules({
      pointsPerMinute,
      pointsPerExamScore,
      pointsPerAssignment,
    });
    setSavedMsg('✅ تم حفظ قواعد احتساب النقاط التلقائية بنجاح!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPointsReward('500');
    setRewardType('money');
    setRewardAmount('50');
    setRewardGiftName('مجموعة المذكرات الورقية المطبوعة + ميدالية التفوق البرمجي 🏅');
    setIcon('🏆');
    setQuestGrade('all');
  };

  const handleSaveQuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formData: QuestFormData = {
      title,
      description,
      pointsReward,
      rewardType,
      rewardAmount,
      rewardGiftName,
      icon,
      questGrade,
    };

    const updated = questsService.upsertQuest(quests, formData, editingQuest?.id);
    setQuests(updated);

    setShowAddQuestModal(false);
    setEditingQuest(null);
    resetForm();
    setSavedMsg('✅ تم حفظ وتحديث التحدي بنجاح!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handleDeleteQuest = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا التحدي؟')) {
      const updated = questsService.deleteQuest(quests, id);
      setQuests(updated);
    }
  };

  const openEdit = (q: Quest) => {
    setEditingQuest(q);
    setTitle(q.title);
    setDescription(q.description);
    setPointsReward(String(q.pointsReward || 500));
    setRewardType(q.rewardType);
    setRewardAmount(String(q.rewardAmount || 50));
    setRewardGiftName(q.rewardGiftName || '');
    setIcon(q.icon || '🏆');
    setQuestGrade(q.grade || 'all');
    setShowAddQuestModal(true);
  };

  const openCreate = () => {
    resetForm();
    setEditingQuest(null);
    setShowAddQuestModal(true);
  };

  return {
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
    resetForm,
    openEdit,
    openCreate,
  };
}
