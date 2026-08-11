'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { BarChart3, Users, Users2, BookOpen, KeyRound, Settings, LogOut, Menu, X, CreditCard, FileCheck2, Video, Wallet, LineChart, LayoutTemplate, Tag, Trophy, MessageSquare, Truck, Star, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import NotificationCenter from '../components/NotificationCenter';

// Grouped Admin Sidebar Sections
const adminSidebarSections = [
  {
    title: 'الرئيسية والتحليلات',
    items: [
      { href: '/admin', label: 'الرئيسية', icon: <BarChart3 size={18} /> },
      { href: '/admin/analytics', label: 'تحليلات الزيارات', icon: <LineChart size={18} /> },
      { href: '/admin/leaderboard', label: 'لوحة الأوائل 🏆', icon: <Trophy size={18} /> },
      { href: '/admin/quests', label: 'التحديات والمكافآت 🎯', icon: <Flame size={18} /> },
    ]
  },
  {
    title: 'المحتوى والتدريس',
    items: [
      { href: '/admin/courses', label: 'إدارة الكورسات', icon: <BookOpen size={18} /> },
      { href: '/admin/exams', label: 'الامتحانات والأسئلة', icon: <FileCheck2 size={18} /> },
      { href: '/admin/live', label: 'البث المباشر', icon: <Video size={18} /> },
      { href: '/admin/support', label: 'أسئلة الطلاب والردود 💬', icon: <MessageSquare size={18} /> },
      { href: '/admin/reviews', label: 'تقييمات وآراء الطلاب ⭐️', icon: <Star size={18} /> },
      { href: '/admin/cms', label: 'إدارة محتوى الصفحات CMS', icon: <LayoutTemplate size={18} /> },
    ]
  },
  {
    title: 'المبيعات والشحن والدفع',
    items: [
      { href: '/admin/books', label: 'إدارة الكتب والشحن 📚', icon: <Truck size={18} /> },
      { href: '/admin/payments', label: 'طلبات الدفع', icon: <CreditCard size={18} /> },
      { href: '/admin/coupons', label: 'أكواد الخصم والبروموكود', icon: <Tag size={18} /> },
      { href: '/admin/codes', label: 'أكواد التفعيل المباشر', icon: <KeyRound size={18} /> },
      { href: '/admin/payment-settings', label: 'إعدادات وسائط الدفع', icon: <Wallet size={18} /> },
    ]
  },
  {
    title: 'الأمان والنظام',
    items: [
      { href: '/admin/team', label: 'إدارة الفريق 👥', icon: <Users2 size={18} /> },
      { href: '/admin/students', label: 'الطلاب وحماية الأجهزة', icon: <Users size={18} /> },
      { href: '/admin/settings', label: 'الإعدادات العامة', icon: <Settings size={18} /> },
    ]
  }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [adminUser, setAdminUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('admin_user');
      if (stored) setAdminUser(JSON.parse(stored));
    } catch {}
  }, []);

  const [sidebarLogo, setSidebarLogo] = useState('/Logo-cropped.png');

  const loadSidebarLogo = () => {
    try {
      const saved = localStorage.getItem('brand_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.desktopLogo) setSidebarLogo(parsed.desktopLogo);
      }
    } catch {}
  };

  useEffect(() => {
    loadSidebarLogo();
    window.addEventListener('brand_settings_updated', loadSidebarLogo);
    return () => window.removeEventListener('brand_settings_updated', loadSidebarLogo);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/v1/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {}
    // Clear cookie and local storage
    document.cookie = 'admin_token=; path=/; max-age=0';
    localStorage.removeItem('admin_user');
    window.location.href = '/admin/login';
  };

  const SidebarContent = () => (
    <>
      {/* Logo Container */}
      <div style={{ padding: '20px 18px 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <img src={`${sidebarLogo}?v=10`} alt="Logo" style={{ width: '100%', maxWidth: 234, height: 'auto', maxHeight: 68, display: 'block', objectFit: 'contain', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }} />
        </Link>
      </div>

      {/* Categorized Menu Sections */}
      <div style={{ padding: '16px 16px', flex: 1, overflowY: 'auto' }}>
        {adminSidebarSections.map((section, sIdx) => (
          <div key={sIdx} style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, marginBottom: 8, paddingInline: 10, letterSpacing: '0.5px' }}>
              {section.title}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {section.items.map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                      borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 13.5,
                      transition: 'all 0.2s',
                      background: isActive ? 'rgba(108,34,249,0.15)' : 'transparent',
                      color: isActive ? '#6C22F9' : 'var(--text-main)'
                    }}
                    onMouseOver={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(108,34,249,0.06)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', width: '100%',
          background: 'none', border: 'none', color: '#ef4444', fontWeight: 700, fontSize: 14,
          cursor: 'pointer', transition: 'all 0.2s', borderRadius: 10
        }}
        onClick={handleLogout}
        onMouseOut={e => e.currentTarget.style.background = 'none'}
        >
          <LogOut size={18} /> تسجيل الخروج
        </button>
      </div>
    </>
  );

  if (!mounted) return null;

  // Standalone pages — no sidebar/layout wrapper
  if (pathname === '/admin/login' || pathname === '/admin/accept-invite') {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-main)', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      
      {/* Desktop Sidebar */}
      <div className="desktop-sidebar" style={{ width: 270, background: 'var(--surface)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, right: 0, zIndex: 50 }}>
        <SidebarContent />
      </div>

      {/* Main Content Area */}
      <div className="main-content" style={{ flex: 1, paddingRight: 270, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
        
        {/* Header */}
        <header style={{ height: 74, background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', position: 'sticky', top: 0, zIndex: 40 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}>
              <Menu size={24} />
            </button>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {adminSidebarSections.flatMap(s => s.items).find(l => l.href === pathname)?.label || 'لوحة الإدارة'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Dark Mode Toggle */}
            <ThemeToggle />

            {/* Admin Dedicated Notification Center */}
            <NotificationCenter isAdmin={true} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 12, borderLeft: '1px solid var(--border)' }}>
              <div style={{ textAlign: 'left' }} className="hidden-mobile">
                <p style={{ margin: 0, fontSize: 13.5, fontWeight: 800, color: 'var(--text-main)' }}>{adminUser?.name || 'المهندس عبدالرحمن'}</p>
                <p style={{ margin: 0, fontSize: 11.5, color: 'var(--text-muted)' }}>{adminUser?.email || 'المدير العام'}</p>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #6C22F9, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 16 }}>
                ع
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: '28px', flex: 1, overflowX: 'hidden', background: 'var(--bg)' }}>
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(15,10,50,0.6)', zIndex: 99, backdropFilter: 'blur(4px)' }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ position: 'fixed', top: 0, bottom: 0, right: 0, width: 270, background: 'var(--surface)', zIndex: 100, display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 40px rgba(0,0,0,0.1)' }}
            >
              <button onClick={() => setIsMobileMenuOpen(false)} style={{ position: 'absolute', top: 20, left: 20, background: 'rgba(0,0,0,0.05)', border: 'none', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}>
                <X size={18} />
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 991px) {
          .desktop-sidebar { display: none !important; }
          .main-content { padding-right: 0 !important; }
          .mobile-menu-btn { display: flex !important; }
          .hidden-mobile { display: none !important; }
          main { padding: 20px !important; }
        }
      `}</style>
    </div>
  );
}
