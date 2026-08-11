'use client';
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: isDark ? '#1e1b4b' : '#f8fafc',
        border: '1px solid',
        borderColor: isDark ? '#6366f1' : '#e2e8f0',
        width: 44,
        height: 44,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: isDark ? '#fbbf24' : '#4b5563',
        transition: 'all 0.3s',
        boxShadow: isDark ? '0 0 12px rgba(99,102,241,0.4)' : 'none'
      }}
      title={isDark ? 'تفعيل الوضع الفاتح ☀️' : 'تفعيل الوضع الليلي 🌙'}
    >
      <motion.div initial={false} animate={{ rotate: isDark ? 180 : 0 }} transition={{ duration: 0.3 }}>
        {isDark ? <Moon size={20} /> : <Sun size={20} />}
      </motion.div>
    </button>
  );
}
