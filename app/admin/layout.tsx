'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { BarChart3, Users, Users2, BookOpen, KeyRound, Settings, LogOut, Menu, X, CreditCard, FileCheck2, Video, Wallet, LineChart, LayoutTemplate, Tag, Trophy, MessageSquare, Truck, Star, Flame, ChevronDown } from 'lucide-react';
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
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

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
    document.cookie = 'admin_token=; path=/; max-age=0';
    localStorage.removeItem('admin_user');
    window.location.href = '/admin/login';
  };

  const toggleSection = (title: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const SidebarContent = () => (
    <>
      {/* Logo Container */}
      <div style={{ padding: '20px 18px 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <img src={`${sidebarLogo}?v=10`} alt="Logo" style={{ width: '100%', maxWidth: 234, height: 'auto', maxHeight: 68, display: 'block', objectFit: 'contain', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }} />
        </Link>
      </div>

      {/* Categorized Collapsable Menu Sections */}
      <div style={{ padding: '16px 14px', flex: 1, overflowY: 'auto' }}>
        {adminSidebarSections.map((section, sIdx) => {
          const isCollapsed = !!collapsedSections[section.title];
          const hasActiveChild = section.items.some(i => i.href === pathname);

          return (
            <div key={sIdx} style={{ marginBottom: 14 }}>
              {/* Accordion / Dropdown Section Header */}
              <button
                type="button"
                onClick={() => toggleSection(section.title)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 10px', background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, color: hasActiveChild ? '#6C22F9' : 'var(--text-muted)', fontWeight: 800,
                  marginBottom: 6, fontFamily: 'Tajawal, sans-serif', borderRadius: 8,
                  transition: 'background 0.2s', outline: 'none'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(108,34,249,0.05)'}
                onMouseOut={e => e.currentTarget.style.background = 'none'}
              >
                <span style={{ letterSpacing: '0.2px' }}>{section.title}</span>
                <motion.div animate={{ rotate: isCollapsed ? -90 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={14} color={hasActiveChild ? '#6C22F9' : 'var(--text-muted)'} />
                </motion.div>
              </button>

              {/* Collapsable Items */}
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 4 }}
                  >
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
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Admin User Info Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16 }}>
            {adminUser?.name ? adminUser.name.charAt(0) : 'ع'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text-main)' }}>{adminUser?.name || 'المهندس عبدالرحمن حامد'}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>👑 مالك المنصة (Super Admin)</span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          title="تسجيل الخروج"
          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 6, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          onMouseOut={e => e.currentTarget.style.background = 'none'}
        >
          <LogOut size={18} />
        </button>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar" style={{ width: 280, background: 'var(--surface)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', zIndex: 90 }}>
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} style={{ width: 280, background: 'var(--surface)', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', zIndex: 101 }}>
              <SidebarContent />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Top Navbar */}
        <header style={{ height: 72, background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 80 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'none' }}>
              <Menu size={24} />
            </button>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>لوحة التحكم الإدارية الاحترافية</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <ThemeToggle />
            <NotificationCenter />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main style={{ flex: 1, padding: 32 }}>
          {children}
        </main>
      </div>

      <style jsx global>{`
        @media (max-width: 991px) {
          .desktop-sidebar { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
}
