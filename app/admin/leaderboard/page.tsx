'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, Medal, Award, Star, Search, Plus, Edit2, Trash2, ExternalLink, Eye, EyeOff, Check, X, Shield, Filter } from 'lucide-react';
import Link from 'next/link';

interface StudentLeaderboardItem {
  id: string;
  rank: number;
  name: string;
  grade: string;
  governorate: string;
  score: string;
  points: number;
  badge: string;
  isPinned: boolean;
  isVisible: boolean;
}

const initialStudents: StudentLeaderboardItem[] = [
  { id: '1', rank: 1, name: 'أحمد محمود العبد', grade: 'أولى ثانوي', governorate: 'القاهرة', score: '99.5%', points: 2950, badge: '🥇 المركز الأول (العبقري)', isPinned: true, isVisible: true },
  { id: '2', rank: 2, name: 'سارة خالد السيد', grade: 'ثانية ثانوي', governorate: 'الإسكندرية', score: '98.8%', points: 2820, badge: '🥈 المركز الثاني', isPinned: true, isVisible: true },
  { id: '3', rank: 3, name: 'عمر طارق إبراهيم', grade: 'أولى ثانوي', governorate: 'المنصورة', score: '97.4%', points: 2710, badge: '🥉 المركز الثالث', isPinned: true, isVisible: true },
  { id: '4', rank: 4, name: 'مريم سعيد النجار', grade: 'تأسيس', governorate: 'أسيوط', score: '96.2%', points: 2540, badge: '⭐ متفوق رائع', isPinned: false, isVisible: true },
  { id: '5', rank: 5, name: 'يوسف حسن علي', grade: 'ثانية ثانوي', governorate: 'الجيزة', score: '95.0%', points: 2410, badge: '⭐ متفوق رائع', isPinned: false, isVisible: true },
  { id: '6', rank: 6, name: 'نور أحمد مصطفى', grade: 'أولى ثانوي', governorate: 'طنطا', score: '94.5%', points: 2380, badge: '⭐ متفوق رائع', isPinned: false, isVisible: true },
];

import { getAcademicGrades, AcademicGrade } from '../../utils/academicGrades';

export default function AdminLeaderboardPage() {
  const [students, setStudents] = useState<StudentLeaderboardItem[]>(initialStudents);
  const [search, setSearch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [autoRank, setAutoRank] = useState(true);
  const [editingStudent, setEditingStudent] = useState<StudentLeaderboardItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [activeGrades, setActiveGrades] = useState<AcademicGrade[]>([]);

  useEffect(() => {
    const loadGrades = () => {
      const all = getAcademicGrades();
      setActiveGrades(all.filter(g => g.active));
    };
    loadGrades();
    window.addEventListener('academic_grades_updated', loadGrades);
    return () => window.removeEventListener('academic_grades_updated', loadGrades);
  }, []);

  // New Student Form State
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState('أولى ثانوي');
  const [newGov, setNewGov] = useState('القاهرة');
  const [newPoints, setNewPoints] = useState('');
  const [newScore, setNewScore] = useState('');
  const [newBadge, setNewBadge] = useState('⭐ متفوق رائع');

  const filtered = students.filter(s => {
    const matchesSearch = s.name.includes(search) || s.governorate.includes(search);
    const matchesGrade = selectedGrade === 'all' || s.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const toggleVisibility = (id: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, isVisible: !s.isVisible } : s));
  };

  const togglePin = (id: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, isPinned: !s.isPinned } : s));
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف الطالب "${name}" من لوحة الأوائل؟`)) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: StudentLeaderboardItem = {
      id: Date.now().toString(),
      rank: students.length + 1,
      name: newName,
      grade: newGrade,
      governorate: newGov,
      points: Number(newPoints) || 2000,
      score: newScore ? `${newScore}%` : '95%',
      badge: newBadge,
      isPinned: false,
      isVisible: true,
    };
    setStudents([newItem, ...students]);
    setShowAddModal(false);
    setNewName(''); setNewPoints(''); setNewScore('');
  };

  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setStudents(prev => prev.map(s => s.id === editingStudent.id ? editingStudent : s));
    setEditingStudent(null);
  };

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* Top Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 6px' }}>
            إدارة لوحة الأوائل 🏆
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>
            تحكم في التكريمات، ترتيب المتفوقين، وتعيين الشارات
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <a
            href="/leaderboard"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--surface)', color: 'var(--text-main)',
              border: '1px solid var(--border)', borderRadius: 12,
              padding: '11px 20px', fontSize: 14, fontWeight: 800,
              textDecoration: 'none', transition: 'all 0.2s'
            }}
          >
            <ExternalLink size={16} /> معاينة الصفحة العامة ↗
          </a>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff',
              border: 'none', borderRadius: 12, padding: '11px 22px',
              fontSize: 14, fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(108,34,249,0.3)', fontFamily: 'Tajawal, sans-serif'
            }}
          >
            <Plus size={18} /> إضافة متميز جديد
          </button>
        </div>
      </div>

      {/* Stats Quick Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        <div style={{ background: 'var(--surface)', padding: '20px 24px', borderRadius: 20, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 700 }}>المركز الأول الحالى 👑</span>
            <Crown size={20} color="#f59e0b" />
          </div>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: 'var(--text-main)' }}>{students[0]?.name || '-'}</p>
          <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 700 }}>{students[0]?.score} ({students[0]?.points} pt)</span>
        </div>

        <div style={{ background: 'var(--surface)', padding: '20px 24px', borderRadius: 20, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 700 }}>إجمالي الطلاب المكرمين</span>
            <Trophy size={20} color="#6C22F9" />
          </div>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#6C22F9' }}>{students.length} طالب</p>
        </div>

        <div style={{ background: 'var(--surface)', padding: '20px 24px', borderRadius: 20, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 700 }}>آلية الترتيب والنقاط التلقائية ⚡️</span>
            <Shield size={20} color={autoRank ? '#22c55e' : '#94a3b8'} />
          </div>
          <button
            onClick={() => setAutoRank(!autoRank)}
            style={{
              background: autoRank ? 'rgba(34,197,94,0.15)' : 'rgba(148,163,184,0.15)',
              color: autoRank ? '#22c55e' : '#64748b',
              border: 'none', borderRadius: 10, padding: '6px 14px',
              fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif'
            }}
          >
            {autoRank ? 'مفعل (امتحانات + دقائق مشاهدة + تسليمات 🎯)' : 'يدوي (تحديد الأدمن)'}
          </button>
        </div>
      </div>

      {/* Filters & Search Header */}
      <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', right: 14, transform: 'translateY(-50%)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث عن اسم طالب أو محافظة..."
              style={{
                width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '10px 42px 10px 14px', color: 'var(--text-main)',
                fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Grade filter tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: 'الكل' },
              ...activeGrades.map(g => ({ key: g.name, label: g.name }))
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setSelectedGrade(tab.key)}
                style={{
                  padding: '8px 16px', borderRadius: 10, border: 'none',
                  fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif',
                  background: selectedGrade === tab.key ? '#6C22F9' : 'var(--bg)',
                  color: selectedGrade === tab.key ? '#fff' : 'var(--text-muted)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Table Card */}
      <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', color: 'var(--text-muted)', fontSize: 13, borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px', fontWeight: 700 }}>الترتيب</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>اسم الطالب</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>المرحلة</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>المحافظة</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>النقاط</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>النسبة</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>الشارة</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>الظهور</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((st, idx) => (
                <tr key={st.id} style={{ borderBottom: '1px solid var(--border)', background: st.isPinned ? 'rgba(108,34,249,0.03)' : 'transparent' }}>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      width: 32, height: 32, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13,
                      background: idx === 0 ? '#fef3c7' : idx === 1 ? '#f1f5f9' : idx === 2 ? '#ffedd5' : 'var(--bg)',
                      color: idx === 0 ? '#b45309' : idx === 1 ? '#475569' : idx === 2 ? '#c2410c' : 'var(--text-muted)'
                    }}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontWeight: 800, color: 'var(--text-main)', fontSize: 14 }}>
                    {st.name} {st.isPinned && <span title="مثبت في القمة">📌</span>}
                  </td>
                  <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-muted)' }}>{st.grade}</td>
                  <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-muted)' }}>{st.governorate}</td>
                  <td style={{ padding: '16px', fontWeight: 900, color: '#6C22F9', fontSize: 14 }}>{st.points} pt</td>
                  <td style={{ padding: '16px', fontWeight: 900, color: '#22c55e', fontSize: 14 }}>{st.score}</td>
                  <td style={{ padding: '16px', fontSize: 12, fontWeight: 700, color: 'var(--text-main)' }}>
                    <span style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 8 }}>
                      {st.badge}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button
                      onClick={() => toggleVisibility(st.id)}
                      style={{
                        background: st.isVisible ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                        color: st.isVisible ? '#22c55e' : '#ef4444',
                        border: 'none', borderRadius: 8, padding: '6px 12px',
                        fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif'
                      }}
                    >
                      {st.isVisible ? 'ظاهر' : 'مخفي'}
                    </button>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => togglePin(st.id)}
                        title={st.isPinned ? 'إلغاء التثبيت' : 'تثبيت بالقمة'}
                        style={{ background: st.isPinned ? 'rgba(245,158,11,0.2)' : 'var(--bg)', color: '#f59e0b', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 10px', cursor: 'pointer' }}
                      >
                        📌
                      </button>
                      <button
                        onClick={() => setEditingStudent({ ...st })}
                        title="تعديل"
                        style={{ background: 'rgba(108,34,249,0.1)', color: '#6C22F9', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer' }}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(st.id, st.name)}
                        title="حذف"
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ position: 'relative', width: '100%', maxWidth: 480, background: 'var(--surface)', borderRadius: 24, padding: 32, zIndex: 201, boxShadow: '0 30px 60px rgba(0,0,0,0.3)', maxHeight: '85vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: 'var(--text-main)' }}>إضافة طالب متميز جديد</h2>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'var(--bg)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>اسم الطالب الكامل</label>
                  <input value={newName} onChange={e => setNewName(e.target.value)} required placeholder="أحمد محمد"
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 14px', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>المرحلة</label>
                    <select value={newGrade} onChange={e => setNewGrade(e.target.value)}
                      style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 14px', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}>
                      <option value="أولى ثانوي">أولى ثانوي</option>
                      <option value="ثانية ثانوي">ثانية ثانوي</option>
                      <option value="تأسيس">تأسيس</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>المحافظة</label>
                    <input value={newGov} onChange={e => setNewGov(e.target.value)} placeholder="القاهرة"
                      style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 14px', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>النقاط</label>
                    <input type="number" value={newPoints} onChange={e => setNewPoints(e.target.value)} required placeholder="2500"
                      style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 14px', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>النسبة المئوية (%)</label>
                    <input value={newScore} onChange={e => setNewScore(e.target.value)} placeholder="98.5"
                      style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 14px', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>الشارة التكريمية</label>
                  <input value={newBadge} onChange={e => setNewBadge(e.target.value)} placeholder="⭐ متفوق رائع"
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 14px', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                </div>

                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  style={{ background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontSize: 15, fontWeight: 900, fontFamily: 'Tajawal, sans-serif', cursor: 'pointer', marginTop: 8 }}>
                  إضافة للوحة الشرف
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingStudent && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEditingStudent(null)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ position: 'relative', width: '100%', maxWidth: 480, background: 'var(--surface)', borderRadius: 24, padding: 32, zIndex: 201, boxShadow: '0 30px 60px rgba(0,0,0,0.3)', maxHeight: '85vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: 'var(--text-main)' }}>تعديل بيانات {editingStudent.name}</h2>
                <button onClick={() => setEditingStudent(null)} style={{ background: 'var(--bg)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUpdateStudent} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>الاسم الكامل</label>
                  <input value={editingStudent.name} onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 14px', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>النقاط</label>
                    <input type="number" value={editingStudent.points} onChange={e => setEditingStudent({ ...editingStudent, points: Number(e.target.value) })}
                      style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 14px', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>النسبة المئوية</label>
                    <input value={editingStudent.score} onChange={e => setEditingStudent({ ...editingStudent, score: e.target.value })}
                      style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 14px', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>الشارة التكريمية</label>
                  <input value={editingStudent.badge} onChange={e => setEditingStudent({ ...editingStudent, badge: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 14px', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button type="submit" style={{ flex: 1, background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff', border: 'none', borderRadius: 14, padding: '13px', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>
                    حفظ التغييرات
                  </button>
                  <button type="button" onClick={() => setEditingStudent(null)} style={{ background: 'var(--bg)', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: 14, padding: '13px 20px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
