'use client';
import { useState } from 'react';
import { Bell, X, CheckCheck, Clock, Award, Video, FileCheck2, Sparkles, PackageCheck, MessageSquare, CreditCard, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationCenterProps {
  isAdmin?: boolean;
}

const studentNotifications = [
  {
    id: 1,
    title: 'تذكير بموعد الامتحان المجدول ⏰',
    desc: 'امتحان الشامل في الخوارزميات وتراكيب البيانات ينطلق اليوم الساعة 02:00 مساءً.',
    time: 'منذ 15 دقيقة',
    type: 'exam',
    read: false
  },
  {
    id: 2,
    title: 'تهانينا! مكافأة تفوق 🎁',
    desc: 'تمت إضافة 300 ج.م في محفظتك الرقمية لحصولك على المركز الأول.',
    time: 'منذ ساعتين',
    type: 'reward',
    read: false
  },
  {
    id: 3,
    title: 'تم رفع كورس جديد 🚀',
    desc: 'كورس البرمجة والذكاء الاصطناعي - الترم الأول أصبح متاحاً الآن في مكتبتك.',
    time: 'منذ يوم واحد',
    type: 'course',
    read: false
  }
];

const adminNotifications = [
  {
    id: 101,
    title: 'طلب شراء مذكرة جديد 📦',
    desc: 'قام الطالب أحمد محمود بطلب شحن مذكرة الشامل في البرمجة للقاهرة.',
    time: 'منذ 10 دقائق',
    type: 'book',
    read: false
  },
  {
    id: 102,
    title: 'سؤال برمجي بانتظار الرد 💬',
    desc: 'سارة خالد طرحت سؤالاً في درس المتغيرات في كورس أولى ثانوي.',
    time: 'منذ 25 دقيقة',
    type: 'question',
    read: false
  },
  {
    id: 103,
    title: 'طلب تأكيد شحن محفظة 💳',
    desc: 'تحويل بقيمة 350 ج.م كاش برقم عملية 98412 بانتظار الاعتماد.',
    time: 'منذ ساعة واحدة',
    type: 'payment',
    read: false
  },
  {
    id: 104,
    title: 'تقييم جديد بانتظار الموافقة ⭐️',
    desc: 'عمر طارق ترك تقييم 5 نجوم لكورس ثانية ثانوي بانتظار موافقة النشر.',
    time: 'منذ ساعتين',
    type: 'review',
    read: true
  }
];

export default function NotificationCenter({ isAdmin = false }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(isAdmin ? adminNotifications : studentNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'book': return <PackageCheck size={18} color="#6C22F9" />;
      case 'question': return <MessageSquare size={18} color="#3b82f6" />;
      case 'payment': return <CreditCard size={18} color="#10b981" />;
      case 'review': return <Star size={18} color="#f59e0b" />;
      case 'exam': return <FileCheck2 size={18} color="#ef4444" />;
      case 'reward': return <Sparkles size={18} color="#10b981" />;
      default: return <Video size={18} color="#8b5cf6" />;
    }
  };

  return (
    <div style={{ position: 'relative', fontFamily: 'Tajawal, sans-serif' }}>
      
      {/* Bell Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative', background: 'var(--surface)', border: '1px solid var(--border)',
          width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--text-main)', transition: 'all 0.2s'
        }}
        title={isAdmin ? "تنبيهات وإشعارات الإدارة" : "التنبيهات والإشعارات"}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: -2, right: -2, background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 900, width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--surface)', boxShadow: '0 2px 6px rgba(239,68,68,0.4)' }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Popover Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            style={{
              position: 'absolute', top: 56, left: 0, zIndex: 100,
              width: 360, background: 'var(--surface)', borderRadius: 20,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '1px solid var(--border)',
              overflow: 'hidden', direction: 'rtl'
            }}
          >
            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bell size={18} color="#6C22F9" />
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--text-main)' }}>
                  {isAdmin ? 'تنبيهات الإدارة والطلبات 🔔' : 'مركز الإشعارات والتنبيهات 🔔'}
                </h3>
              </div>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllAsRead} style={{ background: 'none', border: 'none', color: '#6C22F9', fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCheck size={14} /> تحديد الكل كقروء
                </button>
              )}
            </div>

            {/* List */}
            <div style={{ maxHeight: 380, overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                  لا توجد إشعارات جديدة حالياً
                </div>
              ) : (
                notifications.map(n => (
                  <div 
                    key={n.id}
                    onClick={() => handleMarkAsRead(n.id)}
                    style={{
                      padding: '16px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer',
                      background: n.read ? 'transparent' : 'rgba(108,34,249,0.05)',
                      display: 'flex', gap: 14, transition: 'background 0.2s', position: 'relative'
                    }}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {getIcon(n.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>{n.title}</h4>
                      <p style={{ margin: '0 0 6px', fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>{n.desc}</p>
                      <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{n.time}</span>
                    </div>
                    {!n.read && (
                      <span style={{ position: 'absolute', top: 18, left: 16, width: 8, height: 8, background: '#6C22F9', borderRadius: '50%' }} />
                    )}
                  </div>
                ))
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
