'use client';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video } from 'lucide-react';
import Link from 'next/link';

export default function SchedulePage() {
  const schedule = [
    { day: 'الإثنين 12 أكتوبر', title: 'مراجعة الخوارزميات', time: '7:00 م - 9:00 م', type: 'بث مباشر', link: '/live' },
    { day: 'الخميس 15 أكتوبر', title: 'أساسيات بايثون', time: '5:00 م - 7:00 م', type: 'درس مسجل', link: '/dashboard/courses' },
    { day: 'السبت 17 أكتوبر', title: 'امتحان منتصف الشهر', time: 'طوال اليوم', type: 'امتحان', link: '/dashboard/courses' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#16133a', marginBottom: 8 }}>الجدول الدراسي</h1>
        <p style={{ color: '#6b7280', fontSize: 15 }}>تابع مواعيد الحصص والبث المباشر والامتحانات.</p>
      </div>

      <div style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', padding: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {schedule.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 24, paddingBottom: 16, borderBottom: i !== schedule.length - 1 ? '1px solid #f1f5f9' : 'none' }}
            >
              <div style={{ width: 64, height: 64, borderRadius: 16, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6C22F9', flexShrink: 0 }}>
                <Calendar size={24} />
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#6C22F9', background: 'rgba(108,34,249,0.1)', padding: '4px 10px', borderRadius: 8 }}>{item.day}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#6b7280' }}>{item.type}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#16133a', margin: '8px 0' }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: '#6b7280', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={14} /> {item.time}
                </p>
              </div>

              <Link href={item.link} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#6C22F9', color: '#fff', padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                <Video size={16} /> الدخول
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
