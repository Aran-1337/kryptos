'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, Award, CheckCircle2, Gift, Wallet, ArrowLeft, Sparkles, Clock, Truck, MapPin, Phone, User, X, Check } from 'lucide-react';
import Link from 'next/link';

export interface QuestItem {
  id: string;
  title: string;
  description: string;
  rewardType: 'money' | 'physical'; // 'money' = مبلغ مالي, 'physical' = هدية ملموسة
  rewardAmount?: number;
  rewardGiftName?: string;
  progress: number;
  isCompleted: boolean;
  isClaimed: boolean;
  shipmentSubmitted?: boolean;
  icon: string;
}

const initialQuests: QuestItem[] = [
  {
    id: 'q-1',
    title: 'بطل الخوارزميات (تخطّي امتحان الأسبوع بنسبة 90%+)',
    description: 'حل امتحان الخوارزميات والحصول على درجة ممتاز بدون أي إنذارات.',
    rewardType: 'money',
    rewardAmount: 50,
    progress: 100,
    isCompleted: true,
    isClaimed: false,
    icon: '🏆'
  },
  {
    id: 'q-2',
    title: 'وسام المتفوق البرمجي (هدية قيمة 🎁)',
    description: 'إكمال الدورة التأسيسية والحصول على أعلى درجة في الاختبار الشامل.',
    rewardType: 'physical',
    rewardGiftName: 'مجموعة المذكرات الورقية المطبوعة + ميدالية التفوق البرمجي 🏅',
    progress: 100,
    isCompleted: true,
    isClaimed: false,
    icon: '🎁'
  },
  {
    id: 'q-3',
    title: 'الانضباط البرمجي (مشاهدة 4 دروس عملي هذا الأسبوع)',
    description: 'إنجاز 4 دروس فيديو كاملة في كورس أولى ثانوي بدون تخطي.',
    rewardType: 'money',
    rewardAmount: 35,
    progress: 75,
    isCompleted: false,
    isClaimed: false,
    icon: '⚡️'
  },
  {
    id: 'q-4',
    title: 'المتفوّق المتصاعد (الحصول على المركز الأول في الدفعة)',
    description: 'التواجد ضمن الثلاثة الأوائل في لوحة المتفوقين لهذا الأسبوع.',
    rewardType: 'money',
    rewardAmount: 100,
    progress: 100,
    isCompleted: true,
    isClaimed: true,
    icon: '🥇'
  }
];

export default function StudentQuestsPage() {
  const [walletBalance, setWalletBalance] = useState(450);
  const [quests, setQuests] = useState<QuestItem[]>(initialQuests);
  
  // Physical Gift Shipping Modal State
  const [shippingQuest, setShippingQuest] = useState<QuestItem | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [governorate, setGovernorate] = useState('القاهرة');
  const [address, setAddress] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    const loadQuests = () => {
      try {
        const savedBalance = localStorage.getItem('student_wallet_balance');
        if (savedBalance) setWalletBalance(Number(savedBalance));

        const adminQuests = localStorage.getItem('admin_quests');
        if (adminQuests) {
          const parsed = JSON.parse(adminQuests);
          const mapped = parsed.map((q: any, idx: number) => ({
            ...q,
            progress: idx === 0 ? 100 : 75,
            isCompleted: idx === 0,
            isClaimed: false
          }));
          setQuests(mapped);
        } else {
          setQuests(initialQuests);
        }
      } catch {}
    };

    loadQuests();
    window.addEventListener('admin_quests_updated', loadQuests);
    return () => window.removeEventListener('admin_quests_updated', loadQuests);
  }, []);

  const saveQuestsData = (newQuests: QuestItem[], newBal?: number) => {
    setQuests(newQuests);
    localStorage.setItem('student_quests_data', JSON.stringify(newQuests));
    if (newBal !== undefined) {
      setWalletBalance(newBal);
      localStorage.setItem('student_wallet_balance', newBal.toString());
    }
  };

  const handleClaimReward = (quest: QuestItem) => {
    if (quest.rewardType === 'money') {
      const newBal = walletBalance + (quest.rewardAmount || 0);
      const updated = quests.map(q => q.id === quest.id ? { ...q, isClaimed: true } : q);
      saveQuestsData(updated, newBal);
      setToastMsg(`🎉 تم إضافة ${quest.rewardAmount} ج.م مباشرة إلى رصيد محفظتك بالمنصة!`);
      setTimeout(() => setToastMsg(''), 4000);
    } else {
      // Physical Gift -> Open Shipping Address Modal
      setShippingQuest(quest);
    }
  };

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingQuest || !fullName.trim() || !phone.trim() || !address.trim()) return;

    // Save Physical Order for Admin
    const newOrder = {
      id: 'GIFT-' + Date.now(),
      questTitle: shippingQuest.title,
      giftName: shippingQuest.rewardGiftName,
      studentName: fullName,
      phone,
      governorate,
      address,
      date: new Date().toLocaleDateString('ar-EG'),
      status: 'قيد الشحن'
    };

    try {
      const existing = JSON.parse(localStorage.getItem('physical_gift_orders') || '[]');
      localStorage.setItem('physical_gift_orders', JSON.stringify([newOrder, ...existing]));
    } catch {}

    const updated = quests.map(q => q.id === shippingQuest.id ? { ...q, isClaimed: true, shipmentSubmitted: true } : q);
    saveQuestsData(updated);

    setShippingQuest(null);
    setFullName('');
    setPhone('');
    setAddress('');

    setToastMsg('🚚 تم تسجيل بيانات الشحن بنجاح! سيصلك اتصال الديليفري لتسليم الجائزة الملموسة.');
    setTimeout(() => setToastMsg(''), 5000);
  };

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', fontFamily: 'Tajawal, sans-serif', direction: 'rtl', position: 'relative' }}>
      
      {/* Toast Notification */}
      {toastMsg && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--surface)', color: 'var(--text-main)', padding: '14px 28px', borderRadius: 14,
            fontWeight: 800, zIndex: 9999, boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            border: '1.5px solid #10b981', fontFamily: 'Tajawal, sans-serif'
          }}
        >
          {toastMsg}
        </motion.div>
      )}

      {/* Top Banner */}
      <div style={{ background: 'linear-gradient(135deg, #16133a 0%, #2d2870 50%, #1e1b5e 100%)', borderRadius: 24, padding: '32px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20, marginBottom: 32, boxShadow: '0 10px 30px rgba(22,19,58,0.25)', position: 'relative', overflow: 'hidden' }}>
        
        {/* Glow Light */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, background: '#6C22F9', opacity: 0.3, filter: 'blur(50px)', borderRadius: '50%' }} />

        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 800, marginBottom: 12 }}>
            <Flame size={16} color="#f59e0b" /> التحديات والجوائز المتاحة
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, margin: '0 0 8px', color: '#fff' }}>تحديات المذاكرة والجوائز 🎯</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: 0, maxWidth: 520, lineHeight: 1.6 }}>
            أنقذ تحديات الأسبوع واجمع النقاط لتحصل على مبالغ مالية تُضاف مباشرة لرصيد محفظتك، أو جوائز ملموسة تصلك حتى باب المنزل!
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', padding: '20px 28px', borderRadius: 20, textAlign: 'center' }}>
          <span style={{ fontSize: 12, opacity: 0.8, fontWeight: 700, display: 'block' }}>رصيد المحفظة المكتسب</span>
          <strong style={{ fontSize: 28, fontWeight: 900, color: '#10b981', display: 'block' }}>{walletBalance} ج.م</strong>
          <Link href="/dashboard/wallet" style={{ fontSize: 11, color: '#a78bfa', textDecoration: 'none', fontWeight: 800 }}>استخدام الرصيد 💳</Link>
        </div>
      </div>

      {/* Quests List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {quests.map(q => (
          <div key={q.id} style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: 24, boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flex: 1, minWidth: 280 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: q.rewardType === 'physical' ? 'rgba(245,158,11,0.15)' : 'rgba(108,34,249,0.12)', fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {q.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>{q.title}</h3>
                  <span style={{
                    fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6,
                    background: q.rewardType === 'physical' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                    color: q.rewardType === 'physical' ? '#d97706' : '#10b981'
                  }}>
                    {q.rewardType === 'physical' ? '🎁 هدية قيمة (شحن)' : '💰 جائزة مالية بالمحفظة'}
                  </span>
                </div>

                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 10px' }}>{q.description}</p>
                
                {/* Progress Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1, height: 8, background: 'var(--bg)', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <div style={{ width: `${q.progress}%`, height: '100%', background: q.isCompleted ? '#10b981' : '#6C22F9', borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-main)' }}>{q.progress}%</span>
                </div>
              </div>
            </div>

            {/* Action / Claim Button */}
            <div>
              {q.isClaimed ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '10px 20px', borderRadius: 12, fontWeight: 800, fontSize: 13 }}>
                  <CheckCircle2 size={16} />
                  {q.rewardType === 'physical' ? 'تم طلب شحن الهدية 🚚' : `تم استلام ${q.rewardAmount} ج.م في المحفظة`}
                </span>
              ) : q.isCompleted ? (
                <button
                  onClick={() => handleClaimReward(q)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: q.rewardType === 'physical' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12,
                    fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.3)', fontFamily: 'Tajawal, sans-serif'
                  }}
                >
                  <Gift size={18} />
                  {q.rewardType === 'physical' ? 'استلام الهدية 🎁' : `استلام جائزة ${q.rewardAmount} ج.م 🎁`}
                </button>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: 12, fontWeight: 700, fontSize: 13 }}>
                  <Clock size={15} /> جارِ التقدم ({q.rewardType === 'physical' ? 'هدية عينية' : `مكافأة ${q.rewardAmount} ج.م`})
                </span>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* ─── Physical Gift Shipping Modal ───────────────────────────────── */}
      <AnimatePresence>
        {shippingQuest && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShippingQuest(null)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(15,10,42,0.75)', backdropFilter: 'blur(8px)' }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{
                position: 'relative', width: '100%', maxWidth: 500,
                background: 'var(--surface)', borderRadius: 24, padding: '32px 28px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)', border: '1px solid var(--border)',
                zIndex: 1000, fontFamily: 'Tajawal, sans-serif'
              }}
            >
              <button onClick={() => setShippingQuest(null)} style={{ position: 'absolute', top: 20, left: 20, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={22} />
              </button>

              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Truck size={30} />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 6px' }}>طلب شحن الهدية لعنوانك 📦</h2>
                <p style={{ fontSize: 13.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                  مبروك الفوز! هذه هدية مستحقة 🎁 <strong>({shippingQuest.rewardGiftName})</strong> وسيتم شحنها وتوصيلها مجاناً حتى باب منزلك.
                </p>
              </div>

              <form onSubmit={handleSubmitShipping} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>الاسم الثلاثي للطالب</label>
                  <input
                    type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                    placeholder="مثال: أحمد محمود السيد"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>رقم الهاتف للتواصل</label>
                    <input
                      type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="01012345678"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>المحافظة</label>
                    <select
                      value={governorate} onChange={e => setGovernorate(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}
                    >
                      <option value="القاهرة">القاهرة</option>
                      <option value="الجيزة">الجيزة</option>
                      <option value="الإسكندرية">الإسكندرية</option>
                      <option value="الدقهلية (المنصورة)">الدقهلية (المنصورة)</option>
                      <option value="أسيوط">أسيوط</option>
                      <option value="سوهاج">سوهاج</option>
                      <option value="الغربية (طنطا)">الغربية (طنطا)</option>
                      <option value="محافظة أخرى">محافظة أخرى</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>العنوان التفصيلي لشحن الهدية</label>
                  <textarea
                    required rows={3} value={address} onChange={e => setAddress(e.target.value)}
                    placeholder="اسم الشارع، رقم العمارة أو الشقة، أو علامة مميزة بجوار المنزل..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: 'none',
                    padding: '14px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(245,158,11,0.3)', fontFamily: 'Tajawal, sans-serif', marginTop: 8
                  }}
                >
                  تأكيد طلب شحن الهدية 🚚
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
