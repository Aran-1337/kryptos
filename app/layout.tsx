import type { Metadata } from 'next';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LiveChatAgent from './components/LiveChatAgent';

export const metadata: Metadata = {
  title: 'منصة المهندس عبدالرحمن حامد | البرمجة والذكاء الاصطناعى',
  description: 'منصة تعليمية احترافية للكورسات والكتب والجلسات المباشرة',
  icons: {
    icon: '/logo-only.png?v=3',
    shortcut: '/logo-only.png?v=3',
    apple: '/logo-only.png?v=3',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico?v=3" sizes="any" />
        <link rel="icon" href="/logo-only.png?v=3" type="image/png" />
        <link rel="shortcut icon" href="/logo-only.png?v=3" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-only.png?v=3" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
        <LiveChatAgent />
      </body>
    </html>
  );
}
