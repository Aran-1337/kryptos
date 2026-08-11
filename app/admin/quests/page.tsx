'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, Plus, Edit2, Trash2, Save, Gift, Wallet, Shield, CheckCircle2, X, Sparkles, Sliders } from 'lucide-react';

export default function AdminQuestsPage() {
  // Custom Points Engine Rules State
  const [pointsPerMinute, setPointsPerMinute] = useState('1');
  const [pointsPerExamScore, setPointsPerExamScore] = useState('10');
  const [pointsPerAssignment, setPointsPerAssignment] = useState('50');

  // Quests & Rewards State
  const [quests, setQuests] = useState<any[]>([]);

  // Modals state
  const [showAddQuestModal, setShowAddQuestModal] = useState(false);
  const [editingQuest, setEditingQuest] = useState<any>(null);
  const [savedMsg, setSavedMsg] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pointsReward, setPointsReward] = useState('500');
  const [rewardType, setRewardType] = useState<'money' | 'physical'>('money');
  const [rewardAmount, setRewardAmount] = useState('50');
  const [rewardGiftName, setRewardGiftName] = useState('مجموعة المذكرات الورقية المطبوعة + ميدالية التفوق البرمجي 🏅');
  const [icon, setIcon] = useState('🏆');

  useEffect(() => {
    // Load Points Rules
    try {
      const savedRules = localStorage.getItem('points_calculation_rules');
      if (savedRules) {
        const parsed = JSON.parse(savedRules);
        if (parsed.pointsPerMinute) setPointsPerMinute(parsed.pointsPerMinute);
        if (parsed.pointsPerExamScore) setPointsPerExamScore(parsed.pointsPerExamScore);
        if (parsed.pointsPerAssignment) setPointsPerAssignment(parsed.pointsPerAssignment);
      }
    } catch {}

    // Load Admin Quests
    try {
      const savedQuests = localStorage.getItem('admin_quests');
      if (savedQuests) {
        setQuests(JSON.parse(savedQuests));
      } else {
        // Default initial quests
        const initial = [
          {
            id: 'q-1',
            title: 'بطل الخوارزميات (تخطّي امتحان الأسبوع بنسبة 90%+)',
            description: 'حل امتحان الخوارزميات والحصول على درجة ممتاز بدون أي إنذارات.',
            pointsReward: 300,
            rewardType: 'money',
            rewardAmount: 50,
            icon: '🏆',
            active: true
          },
          {
            id: 'q-2',
            title: 'وسام المتفوق البرمجي (هدية ملموسة فاخرة 🎁)',
            description: 'إكمال الدورة التأسيسية والحصول على أعلى درجة في الاختبار الشامل.',
            pointsReward: 1000,
            rewardType: 'physical',
            rewardGiftName: 'مجموعة المذكرات الورقية المطبوعة + ميدالية التفوق البرمجي 🏅',
            icon: '🎁',
            active: true
          },
          {
            id: 'q-3',
            title: 'الانضباط البرمجي (مشاهدة 4 دروس عملي هذا الأسبوع)',
            description: 'إنجاز 4 دروس فيديو كاملة في كورس أولى ثانوي بدون تخطي.',
            pointsReward: 200,
            rewardType: 'money',
            rewardAmount: 35,
            icon: '⚡️',
            active: true
          }
        ];
        setQuests(initial);
        localStorage.setItem('admin_quests', JSON.stringify(initial));
      }
    } catch {}
  }, []);

  const handleSavePointsRules = () => {
    const rules = { pointsPerMinute, pointsPerExamScore, pointsPerAssignment };
    localStorage.setItem('points_calculation_rules', JSON.stringify(rules));
    window.dispatchEvent(new Event('points_rules_updated'));
    setSavedMsg('✅ تم حفظ قواعد احتساب النقاط التلقائية بنجاح!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handleSaveQuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingQuest) {
      const updated = quests.map(q => q.id === editingQuest.id ? {
        ...q, title, description, pointsReward: Number(pointsReward),
        rewardType, rewardAmount: Number(rewardAmount), rewardGiftName, icon
      } : q);
      setQuests(updated);
      localStorage.setItem('admin_quests', JSON.stringify(updated));
    } else {
      const newQ = {
        id: 'q-' + Date.now(),
        title, description, pointsReward: Number(pointsReward),
        rewardType, rewardAmount: Number(rewardAmount), rewardGiftName, icon,
        active: true
      };
      const updated = [...quests, newQ];
      setQuests(updated);
      localStorage.setItem('admin_quests', JSON.stringify(updated));
    }

    window.dispatchEvent(new Event('admin_quests_updated'));
    setShowAddQuestModal(false);
    setEditingQuest(null);
    resetForm();
    setSavedMsg('✅ تم حفظ وتحديث التحدي بنجاح!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handleDeleteQuest = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا التحدي؟')) {
      const updated = quests.filter(q => q.id !== id);
      setQuests(updated);
      localStorage.setItem('admin_quests', JSON.stringify(updated));
      window.dispatchEvent(new Event('admin_quests_updated'));
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPointsReward('500');
    setRewardType('money');
    setRewardAmount('50');
    setRewardGiftName('مجموعة المذكرات الورقية المطبوعة + ميدالية التفوق البرمجي 🏅');
    setIcon('🏆');
  };

  const openEdit = (q: any) => {
    setEditingQuest(q);
    setTitle(q.title);
    setDescription(q.description);
    setPointsReward(String(q.pointsReward || 500));
    setRewardType(q.rewardType);
    setRewardAmount(String(q.rewardAmount || 50));
    setRewardGiftName(q.rewardGiftName || '');
    setIcon(q.icon || '🏆');
    setShowAddQuestModal(true);
  };

  return (
    <div style={{ width: '100%', fontFamily: 'Tajawal, sans-serif', direction: 'rtl', maxWidth: 1280, margin: '0 auto' }}>
      
      {/* Toast Notification */}
      {savedMsg && (
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--surface)', color: 'var(--text-main)', padding: '12px 24px', borderRadius: 12,
            fontWeight: 800, zIndex: 9999, boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid var(--border)'
          }}
        >
          {savedMsg}
        </motion.div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 6px' }}>إدارة التحديات والمكافآت وقواعد النقاط 🎯🎁</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>تحديد عدد النقاط التي يكتسبها الطالب من المشاهدات والامتحانات والواجبات، وإنشاء تحديات وجوائز جديدة.</p>
        </div>

        <button
          onClick={() => { resetForm(); setEditingQuest(null); setShowAddQuestModal(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(108,34,249,0.3)', fontFamily: 'Tajawal, sans-serif' }}
        >
          <Plus size={18} /> إنشاء تحدي ومكافأة جديدة
        </button>
      </div>

      {/* Section 1: Points Engine Rules Manager */}
      <div style={{ background: 'var(--surface)', borderRadius: 20, border: '2px solid #6C22F9', padding: 24, marginBottom: 32, boxShadow: '0 4px 20px rgba(108,34,249,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sliders size={20} color="#6C22F9" /> 1. قواعد واحتساب كسب النقاط للطلاب (Custom Points Rules)
          </h3>
          <span style={{ fontSize: 12.5, color: '#10b981', fontWeight: 800 }}>تحديد الأدمن للقيم ⚙️</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 20 }}>
          <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 14, border: '1px solid var(--border)' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
              🎥 نقاط مشاهدة الشرح والفيديوهات
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="number" value={pointsPerMinute} onChange={e => setPointsPerMinute(e.target.value)}
                style={{ width: 90, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontWeight: 900, fontSize: 15, textAlign: 'center', fontFamily: 'Tajawal, sans-serif' }}
              />
              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 700 }}>نقطة / لكل 1 دقيقة مشاهدة</span>
            </div>
          </div>

          <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 14, border: '1px solid var(--border)' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
              📝 نقاط درجات الاختبارات والامتحانات
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="number" value={pointsPerExamScore} onChange={e => setPointsPerExamScore(e.target.value)}
                style={{ width: 90, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontWeight: 900, fontSize: 15, textAlign: 'center', fontFamily: 'Tajawal, sans-serif' }}
              />
              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 700 }}>نقطة / لكل 1% درجة مئوية</span>
            </div>
          </div>

          <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 14, border: '1px solid var(--border)' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
              📤 نقاط تسليم الواجبات والتطبيقات
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="number" value={pointsPerAssignment} onChange={e => setPointsPerAssignment(e.target.value)}
                style={{ width: 90, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontWeight: 900, fontSize: 15, textAlign: 'center', fontFamily: 'Tajawal, sans-serif' }}
              />
              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 700 }}>نقطة / لكل واجب أو مشروع</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleSavePointsRules}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#6C22F9', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, fontWeight: 800, fontSize: 13.5, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
          >
            <Save size={16} /> حفظ قواعد احتساب النقاط
          </button>
        </div>
      </div>

      {/* Section 2: Active Quests & Rewards List */}
      <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', marginBottom: 16 }}>
        🎯 قائمة التحديات والجوائز المتاحة للطلاب ({quests.length})
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        {quests.map(q => (
          <div key={q.id} style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: 24, boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ fontSize: 32 }}>{q.icon || '🏆'}</span>
                <span style={{ background: q.rewardType === 'money' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: q.rewardType === 'money' ? '#10b981' : '#d97706', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800 }}>
                  {q.rewardType === 'money' ? `💰 مكافأة مالية (${q.rewardAmount} ج.م)` : '🎁 هدية ملموسة شحن'}
                </span>
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 8px', lineHeight: 1.5 }}>{q.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.6 }}>{q.description}</p>

              <div style={{ background: 'var(--bg)', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 12.5, fontWeight: 800, color: '#6C22F9', display: 'inline-block', marginBottom: 16 }}>
                ⚡️ المكافأة: +{q.pointsReward || 500} نقطة XP + {q.rewardType === 'money' ? `${q.rewardAmount} ج.م بمحفظة الطالب` : q.rewardGiftName}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <button
                onClick={() => openEdit(q)}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '8px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 800, cursor: 'pointer' }}
              >
                <Edit2 size={14} /> تعديل التحدي
              </button>
              <button
                onClick={() => handleDeleteQuest(q.id)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(239,68,68,0.12)', border: 'none', color: '#ef4444', padding: '8px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 800, cursor: 'pointer' }}
              >
                <Trash2 size={14} /> حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Quest Modal */}
      <AnimatePresence>
        {showAddQuestModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddQuestModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ position: 'relative', background: 'var(--surface)', borderRadius: 24, border: '1px solid var(--border)', padding: 28, width: '100%', maxWidth: 560, zIndex: 1000, fontFamily: 'Tajawal, sans-serif', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: 'var(--text-main)' }}>
                  {editingQuest ? 'تعديل بيانات التحدي 🎯' : 'إنشاء تحدي ومكافأة جديدة 🎯'}
                </h3>
                <button onClick={() => setShowAddQuestModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <form onSubmit={handleSaveQuestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>عنوان التحدي</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="مثلاً: بطل الخوارزميات أو وسام المتفوق البرمجي" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 13.5, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>وصف التحدي والهدف المطلوبة</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="حل امتحان الخوارزميات والحصول على درجة ممتاز..." style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 13.5, fontFamily: 'Tajawal, sans-serif', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>نقاط XP المكافأة</label>
                    <input type="number" value={pointsReward} onChange={e => setPointsReward(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 13.5, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>أيقونة التحدي</label>
                    <select value={icon} onChange={e => setIcon(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 13.5, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}>
                      <option value="🏆">🏆 كاس التفوق</option>
                      <option value="🎁">🎁 هدية ملموسة</option>
                      <option value="⚡️">⚡️ صاعقة التميز</option>
                      <option value="🥇">🥇 وسام ذهبي</option>
                      <option value="🔥">🔥 شعلة الشغف</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>نوع الجائزة والمكافأة</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <button
                      type="button" onClick={() => setRewardType('money')}
                      style={{ padding: '10px 14px', borderRadius: 10, border: rewardType === 'money' ? '2px solid #10b981' : '1px solid var(--border)', background: rewardType === 'money' ? 'rgba(16,185,129,0.12)' : 'var(--bg)', color: rewardType === 'money' ? '#10b981' : 'var(--text-main)', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
                    >
                      💰 مبلغ مالي بالمحفظة
                    </button>
                    <button
                      type="button" onClick={() => setRewardType('physical')}
                      style={{ padding: '10px 14px', borderRadius: 10, border: rewardType === 'physical' ? '2px solid #f59e0b' : '1px solid var(--border)', background: rewardType === 'physical' ? 'rgba(245,158,11,0.12)' : 'var(--bg)', color: rewardType === 'physical' ? '#d97706' : 'var(--text-main)', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
                    >
                      🎁 هدية عينية (شحن)
                    </button>
                  </div>
                </div>

                {rewardType === 'money' ? (
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>المبلغ المالي المعطى للرصيد (بالجنيه)</label>
                    <input type="number" value={rewardAmount} onChange={e => setRewardAmount(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 13.5, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                  </div>
                ) : (
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>تفاصيل الهدية العينية (تصل الطالب شحن للعنوان)</label>
                    <input type="text" value={rewardGiftName} onChange={e => setRewardGiftName(e.target.value)} placeholder="مثلاً: كتاب ورقي مطبوع + ميدالية التفوق" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 13.5, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
                  <button type="button" onClick={() => setShowAddQuestModal(false)} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer' }}>إلغاء</button>
                  <button type="submit" style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#6C22F9', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>حفظ التحدي</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
