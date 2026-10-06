'use client';
import { useState, useEffect, useMemo } from 'react';
import { StudentLeaderboardItem } from '../types/leaderboard.types';
import { leaderboardService } from '../services/leaderboard.service';
import { filterLeaderboard } from '../utils/leaderboard.utils';
import { getAcademicGrades, AcademicGrade } from '@/app/utils/academicGrades';

import { initialStudents } from '../mocks/leaderboard.mock';

export function useLeaderboard() {
  const [students, setStudents] = useState<StudentLeaderboardItem[]>(initialStudents);
  const [search, setSearch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [autoRank, setAutoRank] = useState(true);
  const [editingStudent, setEditingStudent] = useState<StudentLeaderboardItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [activeGrades, setActiveGrades] = useState<AcademicGrade[]>([]);

  // New Student Form State
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState('أولى ثانوي');
  const [newGov, setNewGov] = useState('القاهرة');
  const [newPoints, setNewPoints] = useState('');
  const [newScore, setNewScore] = useState('');
  const [newBadge, setNewBadge] = useState('⭐ متفوق رائع');

  useEffect(() => {
    setStudents(leaderboardService.getStudents());

    const loadGrades = () => {
      const all = getAcademicGrades();
      setActiveGrades(all.filter(g => g.active));
    };
    loadGrades();
    window.addEventListener('academic_grades_updated', loadGrades);
    return () => window.removeEventListener('academic_grades_updated', loadGrades);
  }, []);

  const filtered = useMemo(() => {
    return filterLeaderboard(students, search, selectedGrade);
  }, [students, search, selectedGrade]);

  const toggleVisibility = (id: string) => {
    const updated = leaderboardService.toggleVisibility(students, id);
    setStudents(updated);
  };

  const togglePin = (id: string) => {
    const updated = leaderboardService.togglePin(students, id);
    setStudents(updated);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف الطالب "${name}" من لوحة الأوائل؟`)) {
      const updated = leaderboardService.deleteStudent(students, id);
      setStudents(updated);
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = leaderboardService.addStudent(students, {
      name: newName,
      grade: newGrade,
      governorate: newGov,
      points: newPoints,
      score: newScore,
      badge: newBadge,
    });
    setStudents(updated);
    setShowAddModal(false);
    setNewName('');
    setNewPoints('');
    setNewScore('');
  };

  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    const updated = leaderboardService.updateStudent(students, editingStudent);
    setStudents(updated);
    setEditingStudent(null);
  };

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const openEditModal = (st: StudentLeaderboardItem) => {
    setEditingStudent({ ...st });
  };

  return {
    students,
    filtered,
    search,
    setSearch,
    selectedGrade,
    setSelectedGrade,
    autoRank,
    setAutoRank,
    editingStudent,
    setEditingStudent,
    showAddModal,
    setShowAddModal,
    activeGrades,
    newName,
    setNewName,
    newGrade,
    setNewGrade,
    newGov,
    setNewGov,
    newPoints,
    setNewPoints,
    newScore,
    setNewScore,
    newBadge,
    setNewBadge,
    toggleVisibility,
    togglePin,
    handleDelete,
    handleAddStudent,
    handleUpdateStudent,
    openAddModal,
    openEditModal,
  };
}
