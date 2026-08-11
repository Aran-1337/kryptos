'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, Users, MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.includes('/watch')) {
    return null;
  }

  return (
    <footer style={{ background: '#16133a', color: '#b8b5d8', marginTop: 80, fontFamily: 'Tajawal, sans-serif' }}>
      <div className="container" style={{ padding: '64px 28px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 52 }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Image src="/Logo-cropped.png" alt="المهندس عبدالرحمن حامد" width={220} height={33} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.9, color: '#9896c0', marginBottom: 22, fontWeight: 400 }}>
              منصة تعليمية احترافية في مجالات البرمجة والذكاء الاصطناعي، خطوتك الأولى لاحتراف التكنولوجيا.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, color: '#9896c0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Mail size={16} color="#6C22F9" /> info@abdelrahmanhamed.com
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Phone size={16} color="#6C22F9" /> +20 100 000 0000
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 800, marginBottom: 18, fontSize: 16 }}>روابط سريعة</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {[
                { href: '/courses', label: 'الكورسات' },
                { href: '/books', label: 'الكتب' },
                { href: '/live', label: 'البث المباشر' },
                { href: '/about', label: 'من نحن' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ color: '#9896c0', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#9896c0')}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Follow Us (تابعنا) */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 800, marginBottom: 18, fontSize: 16 }}>تابعنا</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* YouTube */}
              <a href="#" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#9896c0', textDecoration: 'none', fontSize: 14, fontWeight: 600, transition: 'color 0.2s' }}
                 onMouseEnter={e => e.currentTarget.style.color = '#ef4444'} onMouseLeave={e => e.currentTarget.style.color = '#9896c0'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#ef4444"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                يوتيوب
              </a>

              {/* TikTok */}
              <a href="#" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#9896c0', textDecoration: 'none', fontSize: 14, fontWeight: 600, transition: 'color 0.2s' }}
                 onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#9896c0'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.29-2.61.73-5.25 2.68-6.97 1.48-1.33 3.48-2.02 5.48-1.89v4.11c-.91-.12-1.84.14-2.58.68-.96.7-1.49 1.87-1.37 3.05.08.98.63 1.88 1.47 2.37.89.52 1.99.58 2.92.17.92-.39 1.62-1.21 1.83-2.18.09-.53.07-1.07.07-1.61V.02z"/></svg>
                تيك توك
              </a>

              {/* Facebook */}
              <a href="#" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#9896c0', textDecoration: 'none', fontSize: 14, fontWeight: 600, transition: 'color 0.2s' }}
                 onMouseEnter={e => e.currentTarget.style.color = '#1877f2'} onMouseLeave={e => e.currentTarget.style.color = '#9896c0'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877f2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                فيسبوك
              </a>

              {/* WhatsApp Channel */}
              <a href="#" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#9896c0', textDecoration: 'none', fontSize: 14, fontWeight: 600, transition: 'color 0.2s' }}
                 onMouseEnter={e => e.currentTarget.style.color = '#25d366'} onMouseLeave={e => e.currentTarget.style.color = '#9896c0'}>
                <MessageCircle size={20} color="#25d366" /> قناة واتساب
              </a>
            </div>
          </div>

          {/* Student Community (مجتمع الطلاب) */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 800, marginBottom: 18, fontSize: 16 }}>مجتمع الطلاب</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Facebook Group */}
              <a href="#" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#9896c0', textDecoration: 'none', fontSize: 14, fontWeight: 600, transition: 'color 0.2s' }}
                 onMouseEnter={e => e.currentTarget.style.color = '#1877f2'} onMouseLeave={e => e.currentTarget.style.color = '#9896c0'}>
                <Users size={20} color="#1877f2" /> جروب فيسبوك
              </a>

              {/* Telegram Group */}
              <a href="#" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#9896c0', textDecoration: 'none', fontSize: 14, fontWeight: 600, transition: 'color 0.2s' }}
                 onMouseEnter={e => e.currentTarget.style.color = '#229ed9'} onMouseLeave={e => e.currentTarget.style.color = '#9896c0'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#229ed9"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.562 8.161c-.18.717-.962 4.084-1.362 5.411-.169.562-.489.75-.799.764-.675.031-1.188-.439-1.843-.869-1.026-.673-1.606-1.091-2.601-1.747-1.15-.758-.404-1.175.251-1.856.171-.178 3.143-2.88 3.201-3.129.007-.032.014-.15-.056-.212s-.175-.041-.25-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.324-.437.892-.663 3.498-1.524 5.831-2.529 7.001-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.119.098.152.228.166.324.015.097.032.317.017.495z"/></svg>
                جروب التليجرام
              </a>
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, textAlign: 'center', fontSize: 13, color: '#5e5c80', fontWeight: 400 }}>
          © {new Date().getFullYear()} منصة المهندس عبدالرحمن حامد. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
