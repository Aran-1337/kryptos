'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Eye, Users, MapPin, Share2, Smartphone, Laptop, TrendingUp, Calendar, Download } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [isExporting, setIsExporting] = useState(false);

  const stats = [
    { title: 'إجمالي الزيارات هذا الشهر', value: '48,250', trend: '+24%', icon: <Eye size={22} color="#6C22F9" />, bg: 'rgba(108,34,249,0.12)' },
    { title: 'الزوار الفريدون (Unique)', value: '12,400', trend: '+15%', icon: <Users size={22} color="#3b82f6" />, bg: 'rgba(59,130,246,0.12)' },
    { title: 'متوسط وقت التصفح', value: '14 دقيقة', trend: '+3%', icon: <TrendingUp size={22} color="#10b981" />, bg: 'rgba(16,185,129,0.12)' },
    { title: 'نسبة التفاعل (Bounce Rate)', value: '28%', trend: '-5%', icon: <LineChart size={22} color="#8b5cf6" />, bg: 'rgba(139,92,246,0.12)' },
  ];

  const governorates = [
    { name: 'القاهرة والجيزة', count: '18,400 زيارة', percentage: 42, color: '#6C22F9' },
    { name: 'الإسكندرية', count: '9,200 زيارة', percentage: 22, color: '#3b82f6' },
    { name: 'المنصورة والدقهلية', count: '6,100 زيارة', percentage: 14, color: '#10b981' },
    { name: 'أسيوط وسوهاج', count: '4,800 زيارة', percentage: 11, color: '#f59e0b' },
    { name: 'باقي المحافظات', count: '4,550 زيارة', percentage: 11, color: 'var(--text-muted)' },
  ];

  const sources = [
    { name: 'فيسبوك (Facebook)', count: '16,200', icon: '🔵' },
    { name: 'يوتيوب (YouTube)', count: '14,100', icon: '🔴' },
    { name: 'تصفح مباشر (Direct)', count: '11,400', icon: '⚡' },
    { name: 'تيك توك (TikTok)', count: '4,300', icon: '⬛' },
    { name: 'محرك بحث جوجل', count: '2,250', icon: '🌐' },
  ];

  const handleDownloadAnalytics = () => {
    setIsExporting(true);
    setTimeout(() => {
      const dateStr = new Date().toISOString().split('T')[0];
      const bom = '\uFEFF';

      const csvRows = [
        ['تقرير تحليلات الزيارات وحركة المرور المنصة'],
        ['تاريخ التقديم', dateStr],
        [''],
        ['المؤشر الحركي', 'القيمة', 'النسبة المئوية والتغير'],
        ...stats.map(s => [s.title, s.value, s.trend]),
        [''],
        ['المحافظة', 'عدد الزيارات', 'النسبة من الإجمالي'],
        ...governorates.map(g => [g.name, g.count, `${g.percentage}%`]),
        [''],
        ['مصدر الزيارات', 'عدد الزيارات'],
        ...sources.map(src => [src.name, src.count]),
      ];

      const csvString = bom + csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `تقرير_تحليلات_الزيارات_${dateStr}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
    }, 500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 8 }}>تحليلات الزيارات وحركة المرور</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>دليل تفصيلي لأعداد الزوار، أماكن تصفحهم في مصر، ومصادر الزيارات.</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <select style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid var(--border)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', color: 'var(--text-main)', background: 'var(--surface)' }}>
            <option value="30">آخر 30 يوم</option>
            <option value="7">آخر 7 أيام</option>
            <option value="90">آخر 3 أشهر</option>
          </select>
          <button
            onClick={handleDownloadAnalytics}
            disabled={isExporting}
            style={{
              background: '#6C22F9', color: '#fff', border: 'none',
              padding: '10px 20px', borderRadius: 8, fontWeight: 800,
              fontSize: 13, cursor: isExporting ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Tajawal, sans-serif',
              boxShadow: '0 4px 14px rgba(108,34,249,0.3)', opacity: isExporting ? 0.7 : 1
            }}
          >
            <Download size={16} /> {isExporting ? 'جاري التحميل...' : 'تصدير التقرير'}
          </button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ background: 'var(--surface)', padding: 24, borderRadius: 16, border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#10b981', background: 'rgba(16,185,129,0.15)', padding: '4px 8px', borderRadius: 20 }}>{stat.trend}</span>
            </div>
            <p style={{ margin: '0 0 4px', fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{stat.title}</p>
            <h3 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: 'var(--text-main)' }}>{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Analysis Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        
        {/* Governorates Breakdown */}
        <div style={{ background: 'var(--surface)', borderRadius: 16, padding: 28, border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={20} color="#6C22F9" /> أماكن الزيارات (المحافظات في مصر)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {governorates.map((gov, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, marginBottom: 8, color: 'var(--text-muted)' }}>
                  <span>{gov.name}</span>
                  <span style={{ color: 'var(--text-main)' }}>{gov.count} ({gov.percentage}%)</span>
                </div>
                
                <div style={{ width: '100%', height: 10, background: 'var(--bg)', borderRadius: 5, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ width: `${gov.percentage}%`, height: '100%', background: gov.color, borderRadius: 5, position: 'absolute', right: 0, top: 0, bottom: 0 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources & Devices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Traffic Sources */}
          <div style={{ background: 'var(--surface)', borderRadius: 16, padding: 24, border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Share2 size={20} color="#6C22F9" /> مصادر الزيارات (Traffic Sources)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {sources.map((src, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span>{src.icon}</span>
                    <span>{src.name}</span>
                  </div>
                  <span style={{ color: '#6C22F9', fontWeight: 800 }}>{src.count} زيارة</span>
                </div>
              ))}
            </div>
          </div>

          {/* Devices Breakdown */}
          <div style={{ background: 'var(--surface)', borderRadius: 16, padding: 24, border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(108,34,249,0.12)', color: '#6C22F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Smartphone size={24} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 800, color: 'var(--text-main)' }}>أجهزة الموبايل</h4>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>74% من إجمالي الزوار</p>
              </div>
            </div>

            <div style={{ borderRight: '1px solid var(--border)', paddingRight: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(59,130,246,0.12)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Laptop size={24} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 800, color: 'var(--text-main)' }}>الكمبيوتر واللابتوب</h4>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>26% من إجمالي الزوار</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
