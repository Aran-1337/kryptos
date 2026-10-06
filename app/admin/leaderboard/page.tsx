'use client';
import { Plus, ExternalLink } from 'lucide-react';
import AdminPageHeader from '@/app/components/layout/AdminPageHeader';
import {
  useLeaderboard,
  LeaderboardStats,
  LeaderboardFilters,
  LeaderboardTable,
  AddStudentModal,
  EditStudentModal,
} from '@/app/features/leaderboard';

export default function AdminLeaderboardPage() {
  const {
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
  } = useLeaderboard();

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* Top Header Bar */}
      <div style={{ marginBottom: 28 }}>
        <AdminPageHeader
          title="إدارة لوحة الأوائل 🏆"
          subtitle="تحكم في التكريمات، ترتيب المتفوقين، وتعيين الشارات"
          action={
            <div style={{ display: 'flex', gap: 12 }}>
              <a
                href="/leaderboard"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'var(--surface)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: '11px 20px',
                  fontSize: 14,
                  fontWeight: 800,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
              >
                <ExternalLink size={16} /> معاينة الصفحة العامة ↗
              </a>

              <button
                type="button"
                onClick={openAddModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'linear-gradient(135deg, #6C22F9, #4f46e5)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  padding: '11px 22px',
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(108,34,249,0.3)',
                  fontFamily: 'Tajawal, sans-serif',
                }}
              >
                <Plus size={18} /> إضافة متميز جديد
              </button>
            </div>
          }
        />
      </div>

      {/* Stats Quick Cards */}
      <LeaderboardStats
        topStudent={students[0]}
        totalCount={students.length}
        autoRank={autoRank}
        onToggleAutoRank={() => setAutoRank(!autoRank)}
      />

      {/* Filters & Search Header */}
      <LeaderboardFilters
        search={search}
        setSearch={setSearch}
        selectedGrade={selectedGrade}
        onSelectGrade={setSelectedGrade}
        activeGrades={activeGrades}
      />

      {/* Table Card */}
      <LeaderboardTable
        students={filtered}
        onToggleVisibility={toggleVisibility}
        onTogglePin={togglePin}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      {/* Add Modal */}
      <AddStudentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        newName={newName}
        setNewName={setNewName}
        newGrade={newGrade}
        setNewGrade={setNewGrade}
        newGov={newGov}
        setNewGov={setNewGov}
        newPoints={newPoints}
        setNewPoints={setNewPoints}
        newScore={newScore}
        setNewScore={setNewScore}
        newBadge={newBadge}
        setNewBadge={setNewBadge}
        onSubmit={handleAddStudent}
      />

      {/* Edit Modal */}
      <EditStudentModal
        student={editingStudent}
        onClose={() => setEditingStudent(null)}
        onUpdateStudent={setEditingStudent}
        onSubmit={handleUpdateStudent}
      />

    </div>
  );
}
