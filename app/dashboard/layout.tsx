'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Clock, Award, User, LogOut, Menu, X, Wallet, Trophy, BarChart3, MessageSquare, Flame, ShoppingBag, BookMarked } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationCenter from '../components/NotificationCenter';
import ThemeToggle from '../components/ThemeToggle';

const sidebarLinks = [
  { href: '/dashboard', label: 'الرئيسية', icon: <LayoutDashboard size={20} /> },
  { href: '/dashboard/courses', label: 'كورساتي', icon: <BookOpen size={20} /> },
  { href: '/courses', label: 'متجر الكورسات 🛒', icon: <ShoppingBag size={20} /> },
  { href: '/books', label: 'الكتب والمذكرات 📦', icon: <BookMarked size={20} /> },
  { href: '/dashboard/quests', label: 'التحديات والمكافآت 🎯', icon: <Flame size={20} /> },
  { href: '/dashboard/support', label: 'اسأل المدرس 💬', icon: <MessageSquare size={20} /> },
  { href: '/dashboard/report', label: 'التقرير الأسبوعي 📊', icon: <BarChart3 size={20} /> },
  { href: '/dashboard/leaderboard', label: 'لوحة الأوائل 🏆', icon: <Trophy size={20} /> },
  { href: '/dashboard/wallet', label: 'المحفظة والرصيد', icon: <Wallet size={20} /> },
  { href: '/dashboard/schedule', label: 'الجدول', icon: <Clock size={20} /> },
  { href: '/dashboard/certificates', label: 'شهاداتي', icon: <Award size={20} /> },
  { href: '/dashboard/profile', label: 'الملف الشخصي', icon: <User size={20} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sidebarLogo, setSidebarLogo] = useState('/Logo-cropped.png');
  const [walletBalance, setWalletBalance] = useState(450);

  const loadSidebarLogo = () => {
    try {
      const saved = localStorage.getItem('brand_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.desktopLogo) setSidebarLogo(parsed.desktopLogo);
      }
    } catch {}
  };

  const loadWallet = () => {
    try {
      const saved = localStorage.getItem('student_wallet_balance');
      if (saved) setWalletBalance(Number(saved));
    } catch {}
  };

  useEffect(() => {
    setMounted(true);
    loadSidebarLogo();
    loadWallet();
    window.addEventListener('brand_settings_updated', loadSidebarLogo);
    return () => window.removeEventListener('brand_settings_updated', loadSidebarLogo);
  }, []);

  const SidebarContent = () => (
    <>
      {/* Logo Container matching Admin Layout */}
      <div style={{ padding: '10px 5px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <img src={`${sidebarLogo}?v=10`} alt="Logo" style={{ width: '100%', maxWidth: 270, height: 'auto', maxHeight: 75, display: 'block', objectFit: 'contain', transition: 'all 0.2s' }} />
        </Link>
      </div>

      <div style={{ padding: '16px 20px', flex: 1, overflowY: 'auto' }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 16, padding: '0 12px' }}>القائمة الرئيسية</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {sidebarLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                  borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 15,
                  transition: 'all 0.3s',
                  background: isActive ? 'rgba(108,34,249,0.15)' : 'transparent',
                  color: isActive ? '#6C22F9' : 'var(--text-main)'
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(108,34,249,0.08)';
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

      <div style={{ padding: '24px 20px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={() => {
            document.cookie = 'student_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            localStorage.removeItem('student_auth');
            window.location.href = '/login';
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', width: '100%',
            background: 'none', border: 'none', color: '#ef4444', fontWeight: 700, fontSize: 15,
            cursor: 'pointer', transition: 'all 0.3s', borderRadius: 12
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          onMouseOut={e => e.currentTarget.style.background = 'none'}
        >
          <LogOut size={20} /> تسجيل الخروج
        </button>
      </div>
    </>
  );

  if (!mounted) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-main)', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      
      {/* Desktop Sidebar */}
      <div className="desktop-sidebar" style={{ width: 280, background: 'var(--surface)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, right: 0, zIndex: 50 }}>
        <SidebarContent />
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginRight: 280, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Top Navbar */}
        <header style={{
          height: 70, background: 'var(--surface)', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px',
          position: 'sticky', top: 0, zIndex: 40
        }}>
          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'none' }}
          >
            <Menu size={24} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              أهلاً بك، طالب متميز 👋
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Wallet Balance Badge */}
            <Link href="/dashboard/wallet" style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(16,185,129,0.12)', color: '#10b981',
                padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(16,185,129,0.25)',
                fontSize: 13, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s ease'
              }}>
                <Wallet size={16} color="#10b981" />
                <span>رصيد المحفظة: {walletBalance} ج.م</span>
              </div>
            </Link>

            <NotificationCenter />
            <ThemeToggle />

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingRight: 16, borderRight: '1px solid var(--border)' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#6C22F9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                ط
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>طالب متميز</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>الصف الأول الثانوي</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main style={{ flex: 1, padding: 32 }}>
          {children}
        </main>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex' }}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ width: 280, background: 'var(--surface)', height: '100%', position: 'relative', zIndex: 101, display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ padding: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>
              <SidebarContent />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @media (max-width: 900px) {
          .desktop-sidebar { display: none !important; }
          div[style*="margin-right: 280px"] { margin-right: 0 !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>

    </div>
  );
}
