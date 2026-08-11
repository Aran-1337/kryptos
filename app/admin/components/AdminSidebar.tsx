'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { href: '/admin', icon: '📊', label: 'الرئيسية' },
  { href: '/admin/courses', icon: '📚', label: 'الكورسات' },
  { href: '/admin/lessons', icon: '🎬', label: 'الدروس' },
  { href: '/admin/ai', icon: '🤖', label: 'مساعد AI' },
  { href: '/admin/exams', icon: '📝', label: 'الامتحانات' },
  { href: '/admin/assignments', icon: '📋', label: 'الواجبات' },
  { href: '/admin/students', icon: '👥', label: 'الطلاب' },
  { href: '/admin/analytics', icon: '📈', label: 'التحليلات' },
  { href: '/admin/announcements', icon: '📢', label: 'الإعلانات' },
  { href: '/admin/comments', icon: '💬', label: 'التعليقات' },
  { href: '/admin/live', icon: '🔴', label: 'البث المباشر' },
  { href: '/admin/certificates', icon: '🏆', label: 'الشهادات' },
  { href: '/admin/coupons', icon: '🎟️', label: 'الكوبونات' },
  { href: '/admin/content', icon: '🖼️', label: 'المحتوى' },
  { href: '/admin/earnings', icon: '💰', label: 'الأرباح' },
  { href: '/admin/settings', icon: '⚙️', label: 'الإعدادات' },
];

export default function AdminSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  return (
    <aside style={{
      width: collapsed ? 72 : 240, minHeight: '100vh', background: '#fff',
      borderLeft: '1px solid #ebebf5', display: 'flex', flexDirection: 'column',
      transition: 'width .25s', position: 'fixed', right: 0, top: 0, zIndex: 100,
      boxShadow: '0 0 20px rgba(108,99,255,.07)',
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 0' : '20px 20px', display: 'flex', alignItems: 'center',
        gap: 10, borderBottom: '1px solid #ebebf5', justifyContent: collapsed ? 'center' : 'space-between',
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>🎓</span>
            <span style={{ fontWeight: 800, fontSize: 16, color: '#16133a' }}>لوحة التحكم</span>
          </div>
        )}
        {collapsed && <span style={{ fontSize: 24 }}>🎓</span>}
        <button onClick={onToggle} style={{
          background: 'none', border: 'none', cursor: 'pointer', fontSize: 18,
          color: '#7c7a9a', padding: 4,
        }}>
          {collapsed ? '◀' : '▶'}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {navItems.map(item => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: collapsed ? '12px 0' : '11px 20px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              background: active ? '#eeeeff' : 'transparent',
              color: active ? '#6c63ff' : '#7c7a9a',
              fontWeight: active ? 700 : 500, fontSize: 14,
              borderRadius: 10, margin: '2px 8px',
              textDecoration: 'none', transition: 'all .18s',
              borderRight: active ? '3px solid #6c63ff' : '3px solid transparent',
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid #ebebf5' }}>
        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: collapsed ? '12px 0' : '11px 20px', justifyContent: collapsed ? 'center' : 'flex-start',
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#ef4444', fontWeight: 600, fontSize: 14,
          fontFamily: "'Tajawal',sans-serif", borderRadius: 10,
          transition: 'background .18s',
        }}>
          <span style={{ fontSize: 18 }}>🚪</span>
          {!collapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
}
