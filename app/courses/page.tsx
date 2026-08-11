'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaGraduationCap, FaBrain, FaCode, FaLaptopCode, FaCheckDouble, FaArrowLeft, FaFilter, FaTimes } from 'react-icons/fa';

const filterOptions = {
  grades: ['الكل', 'أولى ثانوي', 'ثانية ثانوي'],
  types: ['الكل', 'كورس تأسيسي', 'شرح المنهج', 'بنك الأسئلة', 'حل الامتحانات', 'المراجعة النهائية']
};

const mockCourses = [
  { id: 1, title: 'كورس أولى ثانوي - الترم الأول', desc: 'شرح مبسط ومفصل لمنهج البرمجة والذكاء الاصطناعي للصف الأول الثانوي مع تطبيقات عملية وتدريبات شاملة.', grade: 'أولى ثانوي', type: 'شرح المنهج', img: '/hero1.webp', icon: <FaLaptopCode size={16}/> },
  { id: 2, title: 'كورس ثانية ثانوي - الترم الأول', desc: 'استكمال رحلة البرمجة وتعمق في خوارزميات الذكاء الاصطناعي للصف الثاني الثانوي لتأسيس قوي للمستقبل.', grade: 'ثانية ثانوي', type: 'شرح المنهج', img: '/th2.webp', icon: <FaBrain size={16}/> },
  { id: 3, title: 'الكورس التأسيسي في البرمجة', desc: 'كورس مصمم خصيصاً من الصفر لتبسيط مفاهيم البرمجة والـ Problem Solving لتكون جاهز لأي منهج.', grade: 'الكل', type: 'كورس تأسيسي', img: '/th1.webp', icon: <FaCode size={16}/> },
  { id: 4, title: 'كورس أولى ثانوي - الترم الثاني', desc: 'الجزء الثاني من منهج أولى ثانوي، يركز على المشاريع العملية وتطبيق ما تم دراسته في الترم الأول.', grade: 'أولى ثانوي', type: 'شرح المنهج', img: '/hero2.webp', icon: <FaLaptopCode size={16}/> },
];

export default function CoursesPage() {
  const [selectedGrade, setSelectedGrade] = useState('الكل');
  const [selectedType, setSelectedType] = useState('الكل');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const filteredCourses = useMemo(() => {
    return mockCourses.filter(course => {
      const gradeMatch = selectedGrade === 'الكل' || course.grade === 'الكل' || course.grade === selectedGrade;
      const typeMatch = selectedType === 'الكل' || course.type === selectedType;
      return gradeMatch && typeMatch;
    });
  }, [selectedGrade, selectedType]);

  const FilterSection = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Grades Filter */}
      <div>
        <h4 style={{ fontSize: 16, fontWeight: 800, color: '#16133a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FaGraduationCap color="#6C22F9" /> المرحلة الدراسية
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filterOptions.grades.map(grade => (
            <label key={grade} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 15, color: selectedGrade === grade ? '#6C22F9' : '#4b5563', fontWeight: selectedGrade === grade ? 700 : 500, transition: 'all 0.2s' }}>
              <input 
                type="radio" 
                name="grade" 
                value={grade}
                checked={selectedGrade === grade}
                onChange={() => setSelectedGrade(grade)}
                style={{ accentColor: '#6C22F9', width: 16, height: 16 }}
              />
              {grade}
            </label>
          ))}
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb' }} />

      {/* Type Filter */}
      <div>
        <h4 style={{ fontSize: 16, fontWeight: 800, color: '#16133a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FaBrain color="#6C22F9" /> نوع الكورس
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filterOptions.types.map(type => (
            <label key={type} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 15, color: selectedType === type ? '#6C22F9' : '#4b5563', fontWeight: selectedType === type ? 700 : 500, transition: 'all 0.2s' }}>
              <input 
                type="radio" 
                name="type" 
                value={type}
                checked={selectedType === type}
                onChange={() => setSelectedType(type)}
                style={{ accentColor: '#6C22F9', width: 16, height: 16 }}
              />
              {type}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      
      {/* Page Header */}
      <div style={{ background: 'linear-gradient(135deg, rgba(15,10,50,0.95) 0%, rgba(108,34,249,0.85) 100%)', padding: '100px 0 60px', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#fff' }}>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, marginBottom: 16 }}>
            استكشف الكورسات المتاحة
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', maxWidth: 600, margin: '0 auto' }}>
            تصفح مكتبتنا المتنامية من الكورسات في مجالات البرمجة والذكاء الاصطناعي والمشاريع العملية المصممة خصيصاً لك.
          </motion.p>
        </div>
        
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', blur: '50px' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -50, width: 300, height: 300, background: 'rgba(108,34,249,0.2)', borderRadius: '50%', filter: 'blur(80px)' }} />
      </div>

      <div className="container" style={{ padding: '40px 16px', display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        
        {/* Desktop Sidebar */}
        <div className="desktop-filters" style={{ width: 280, flexShrink: 0, background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 10px 40px rgba(0,0,0,0.04)', position: 'sticky', top: 100 }}>
          <FilterSection />
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1 }}>
          
          {/* Mobile Filter Button & Active Filters Overview */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <button 
              className="mobile-filter-btn"
              onClick={() => setIsMobileFiltersOpen(true)}
              style={{ display: 'none', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e5e7eb', padding: '10px 20px', borderRadius: 12, fontWeight: 700, color: '#16133a', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
            >
              <FaFilter color="#6C22F9" /> تصفية النتائج
            </button>
            <div style={{ fontSize: 15, color: '#6b7280', fontWeight: 600 }}>
              تم العثور على <span style={{ color: '#6C22F9', fontWeight: 800 }}>{filteredCourses.length}</span> كورس
            </div>
          </div>

          {/* Courses Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            <AnimatePresence mode="popLayout">
              {filteredCourses.length > 0 ? filteredCourses.map((course, i) => (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  style={{
                    position: 'relative',
                    height: 420,
                    borderRadius: 24,
                    overflow: 'hidden',
                    background: '#fff',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(108,34,249,0.12)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.04)';
                  }}
                >
                  <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
                    <Image src={course.img} alt={course.title} fill style={{ objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,10,50,0.9) 0%, transparent 100%)' }} />
                    
                    {/* Top Right Tags */}
                    <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ background: 'rgba(108,34,249,0.9)', backdropFilter: 'blur(4px)', color: '#fff', padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {course.icon} {course.type}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', zIndex: 2, borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      {course.grade !== 'الكل' && (
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '4px 10px', borderRadius: 8 }}>{course.grade}</span>
                      )}
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#d97706', background: '#fef3c7', padding: '4px 10px', borderRadius: 8 }}>{course.type}</span>
                    </div>
                    
                    <h3 style={{ fontSize: 20, fontWeight: 900, color: '#16133a', marginBottom: 8, lineHeight: 1.4 }}>{course.title}</h3>
                    <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, flex: 1 }}>{course.desc}</p>
                    
                    <Link href={`/courses/${course.id}`} style={{
                      marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      width: '100%', padding: '12px', background: '#f3e8ff', color: '#6C22F9', borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none', transition: 'background 0.3s'
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = '#6C22F9'; e.currentTarget.style.color = '#fff'; }}
                    onMouseOut={e => { e.currentTarget.style.background = '#f3e8ff'; e.currentTarget.style.color = '#6C22F9'; }}
                    >
                      التفاصيل والاشتراك <FaArrowLeft size={12} />
                    </Link>
                  </div>
                </motion.div>
              )) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 24 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: '#16133a', marginBottom: 8 }}>عفواً، لا توجد كورسات مطابقة</h3>
                  <p style={{ color: '#6b7280', fontSize: 15 }}>جرب تغيير خيارات الفلترة للبحث عن كورسات أخرى.</p>
                  <button onClick={() => { setSelectedGrade('الكل'); setSelectedType('الكل'); }} style={{ marginTop: 24, background: '#6C22F9', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>
                    مسح الفلاتر
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Filters Bottom Sheet */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, backdropFilter: 'blur(4px)' }}
              onClick={() => setIsMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', zIndex: 1000, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '24px 24px 40px', maxHeight: '85vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: '#16133a' }}>تصفية النتائج</h3>
                <button onClick={() => setIsMobileFiltersOpen(false)} style={{ background: '#f3f4f6', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4b5563' }}>
                  <FaTimes />
                </button>
              </div>
              <FilterSection />
              <button 
                onClick={() => setIsMobileFiltersOpen(false)}
                style={{ width: '100%', marginTop: 32, padding: 16, background: '#6C22F9', color: '#fff', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 8px 24px rgba(108,34,249,0.25)' }}
              >
                عرض النتائج ({filteredCourses.length})
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 991px) {
          .desktop-filters { display: none !important; }
          .mobile-filter-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
