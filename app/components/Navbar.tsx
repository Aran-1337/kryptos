'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown, Trophy, ShoppingBag, BookMarked, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Dynamic Brand Logos
  const [desktopLogo, setDesktopLogo] = useState('/Logo-cropped.png');
  const [mobileLogo, setMobileLogo] = useState('/mobile-logo.png');

  // Student/User Login State
  const [loggedInUser, setLoggedInUser] = useState<{ name: string; grade: string; avatarChar: string } | null>(null);

  const pathname = usePathname();

  const loadAuthUser = () => {
    try {
      const studentAuth = localStorage.getItem('student_auth') || document.cookie.includes('student_token=');
      const adminAuth = localStorage.getItem('admin_user') || document.cookie.includes('admin_token=');

      if (studentAuth) {
        const savedProfile = localStorage.getItem('student_profile_info');
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          setLoggedInUser({
            name: parsed.name || 'طالب متميز',
            grade: parsed.grade || 'الصف الأول الثانوي',
            avatarChar: (parsed.name || 'ط').charAt(0)
          });
        } else {
          setLoggedInUser({
            name: 'طالب متميز',
            grade: 'الصف الأول الثانوي',
            avatarChar: 'ط'
          });
        }
      } else if (adminAuth) {
        setLoggedInUser({
          name: 'المهندس عبدالرحمن حامد',
          grade: 'مالك المنصة الرئيسي 👑',
          avatarChar: 'ع'
        });
      } else {
        setLoggedInUser(null);
      }
    } catch {
      setLoggedInUser(null);
    }
  };

  const loadBrandLogos = () => {
    try {
      const saved = localStorage.getItem('brand_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.desktopLogo) setDesktopLogo(parsed.desktopLogo);
        if (parsed.mobileLogo) setMobileLogo(parsed.mobileLogo);
        if (parsed.tabTitle) document.title = parsed.tabTitle;
        if (parsed.tabIcon) {
          const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
          if (favicon) favicon.href = parsed.tabIcon;
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadBrandLogos();
    loadAuthUser();

    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('brand_settings_updated', loadBrandLogos);
    window.addEventListener('storage', loadAuthUser);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('brand_settings_updated', loadBrandLogos);
      window.removeEventListener('storage', loadAuthUser);
    };
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleLogout = () => {
    document.cookie = 'student_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    localStorage.removeItem('student_auth');
    localStorage.removeItem('accessToken');
    setLoggedInUser(null);
    setUserMenu(false);
    window.location.href = '/login';
  };

  // Public Links
  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/courses', label: 'الكورسات' },
    { href: '/books', label: 'الكتب والمذكرات' },
    { href: '/live', label: 'البث المباشر' },
  ];

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.includes('/watch') || pathname.startsWith('/certificates')) {
    return null;
  }

  const dropItemStyle = {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 18px', color: 'var(--text-main)',
    textDecoration: 'none', fontSize: 13.5, fontWeight: 700,
    transition: 'background 0.2s', borderBottom: '1px solid var(--border)'
  };

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, width: '100%', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      <div style={{
        paddingTop: isScrolled ? 8 : 0,
        paddingLeft: isScrolled ? 12 : 0,
        paddingRight: isScrolled ? 12 : 0,
        width: '100%',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div style={{
          margin: '0 auto',
          width: '100%',
          maxWidth: isScrolled ? '1200px' : '100%',
          background: isScrolled ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(16px)',
          border: isScrolled ? '1px solid #ebebf5' : '1px solid transparent',
          borderRadius: isScrolled ? '100px' : '0px',
          boxShadow: isScrolled ? '0 10px 36px rgba(108,34,249,0.12)' : '0 2px 12px rgba(0,0,0,0.03)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          height: isScrolled ? 68 : 84,
          padding: isScrolled ? '0 20px' : '0 24px',
          gap: 12,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }} className="nav-inner-container">

        {/* Logo Anchored Right (Desktop vs Mobile Responsive Logos) */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
          <img src={desktopLogo} alt="Logo Desktop" className="desktop-logo" style={{ height: isScrolled ? 42 : 50, width: 'auto', maxHeight: 52, objectFit: 'contain', transition: 'height 0.3s' }} />
          <img src={`${mobileLogo}?v=2`} alt="Logo Mobile" className="mobile-logo" style={{ height: isScrolled ? 38 : 46, width: 'auto', maxHeight: 48, objectFit: 'contain', transition: 'height 0.3s' }} />
        </Link>

        {/* Desktop Public Links */}
        <div style={{ display: 'flex', gap: 28, alignItems: 'center', justifyContent: 'center', flex: 1 }} className="hidden-mobile">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} style={{
              padding: '8px 14px', borderRadius: 10, fontWeight: 800, fontSize: isScrolled ? 14 : 15,
              color: 'var(--text-main)', textDecoration: 'none', transition: 'all .2s',
              whiteSpace: 'nowrap'
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(108,34,249,0.08)'; e.currentTarget.style.color = '#6C22F9'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-main)'; }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons OR Logged In Student Profile Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {loggedInUser ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenu(!userMenu)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'rgba(108,34,249,0.06)', border: '1px solid rgba(108,34,249,0.18)', borderRadius: 40,
                  padding: '5px 14px 5px 10px', cursor: 'pointer', fontFamily: 'Tajawal, sans-serif',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                  <span style={{ fontWeight: 900, fontSize: 13.5, color: 'var(--text-main)', lineHeight: 1.2 }}>{loggedInUser.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>{loggedInUser.grade}</span>
                </div>

                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #6C22F9, #3b82f6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16 }}>
                  {loggedInUser.avatarChar}
                </div>

                <ChevronDown size={14} color="#6C22F9" />
              </button>

              {/* Dropdown Menu */}
              {userMenu && (
                <div style={{
                  position: 'absolute', top: '115%', left: 0, width: 230,
                  background: 'var(--surface)', borderRadius: 16, boxShadow: '0 10px 35px rgba(0,0,0,0.15)',
                  border: '1px solid var(--border)', overflow: 'hidden', zIndex: 200, fontFamily: 'Tajawal, sans-serif'
                }}>
                  <Link href="/dashboard" style={dropItemStyle} onClick={() => setUserMenu(false)}>
                    <LayoutDashboard size={16} color="#6C22F9" /> لوحة التحكم (Dashboard)
                  </Link>
                  <Link href="/dashboard/profile" style={dropItemStyle} onClick={() => setUserMenu(false)}>
                    <Settings size={16} color="#3b82f6" /> الملف الشخصي والإعدادات
                  </Link>
                  <button onClick={handleLogout} style={{ ...dropItemStyle, color: '#ef4444', width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'right' }}>
                    <LogOut size={16} /> تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Link href="/login" style={{
                border: '1.5px solid #6C22F9', color: '#6C22F9',
                padding: '7px 16px', borderRadius: 10, textDecoration: 'none', fontWeight: 800, fontSize: 13,
                transition: 'all 0.2s', whiteSpace: 'nowrap'
              }} className="login-btn-nav">
                دخول
              </Link>
              <Link href="/register" style={{
                background: '#6C22F9', color: '#fff',
                padding: '8px 18px', borderRadius: 10, textDecoration: 'none', fontWeight: 800, fontSize: 13,
                boxShadow: '0 4px 14px rgba(108,34,249,0.3)', transition: 'all 0.2s', whiteSpace: 'nowrap'
              }} className="register-btn-nav">
                إنشاء حساب
              </Link>
            </div>
          )}

          {/* Mobile menu icon */}
          <button
            className="mobile-btn"
            onClick={() => setOpen(!open)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)',
              padding: 6, display: 'none', borderRadius: 10,
            }}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div style={{
          position: 'fixed', inset: 0, top: 76, background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(16px)', zIndex: 99, display: 'flex', flexDirection: 'column',
          padding: 24, gap: 16, fontFamily: 'Tajawal, sans-serif', direction: 'rtl',
        }}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
              fontSize: 18, fontWeight: 800, color: 'var(--text-main)', textDecoration: 'none', padding: '12px 0',
              borderBottom: '1px solid var(--border)',
            }}>
              {l.label}
            </Link>
          ))}
          {loggedInUser ? (
            <button onClick={handleLogout} style={{ fontSize: 16, fontWeight: 800, color: '#ef4444', background: 'none', border: 'none', padding: '12px 0', textAlign: 'right', cursor: 'pointer' }}>
              تسجيل الخروج
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
              <Link href="/login" onClick={() => setOpen(false)} style={{ textAlign: 'center', border: '1.5px solid #6C22F9', color: '#6C22F9', padding: '12px', borderRadius: 12, fontWeight: 800, textDecoration: 'none' }}>
                دخول
              </Link>
              <Link href="/register" onClick={() => setOpen(false)} style={{ textAlign: 'center', background: '#6C22F9', color: '#fff', padding: '12px', borderRadius: 12, fontWeight: 800, textDecoration: 'none' }}>
                إنشاء حساب
              </Link>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 991px) {
          .hidden-mobile {
            display: none !important;
          }
          .desktop-logo {
            display: none !important;
          }
          .mobile-logo {
            display: block !important;
          }
          .mobile-btn {
            display: flex !important;
          }
        }
        @media (min-width: 992px) {
          .desktop-logo {
            display: block !important;
          }
          .mobile-logo {
            display: none !important;
          }
          .mobile-btn {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
