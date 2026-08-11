'use client';
import { useEffect, useState } from 'react';

export default function AdminHeader({ sidebarWidth }: { sidebarWidth: number }) {
  const [user, setUser] = useState<{ name: string; avatar?: { url: string }; role: string } | null>(null);

  useEffect(() => {
    const u = localStorage.getItem('adminUser');
    if (u) setUser(JSON.parse(u));
  }, []);

  return (
    <header style={{
      position: 'fixed', top: 0, right: sidebarWidth, left: 0, height: 64, zIndex: 99,
      background: '#fff', borderBottom: '1px solid #ebebf5',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', boxShadow: '0 1px 4px rgba(80,70,200,.07)',
      transition: 'right .25s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 13, color: '#7c7a9a' }}>
          {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: user?.avatar?.url ? `url(${user.avatar.url}) center/cover` : 'linear-gradient(135deg,#6c63ff,#4f46e5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 15,
        }}>
          {!user?.avatar?.url && (user?.name?.[0] || 'A')}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#16133a' }}>{user?.name || 'المدير'}</div>
          <div style={{ fontSize: 12, color: '#7c7a9a' }}>{user?.role === 'admin' ? 'مشرف' : 'مدرس'}</div>
        </div>
      </div>
    </header>
  );
}
