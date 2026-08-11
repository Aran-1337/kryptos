'use client';
import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Save, Tag, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([
    { 
      id: 1, 
      title: 'كورس أولى ثانوي - الترم الأول', 
      grade: 'أولى ثانوي', 
      type: 'شرح المنهج', 
      originalPrice: '500 ج.م',
      price: '350 ج.م', 
      discountBadge: 'خصم 30%',
      image: '/th1.webp',
      students: 1250, 
      status: 'مفعل' 
    },
    { 
      id: 2, 
      title: 'الكورس التأسيسي في البرمجة', 
      grade: 'تأسيس', 
      type: 'كورس تأسيسي', 
      originalPrice: 'مجاني',
      price: 'مجاني', 
      discountBadge: '',
      image: '/hero1.webp',
      students: 3420, 
      status: 'مفعل' 
    },
    { 
      id: 3, 
      title: 'مراجعة ليلة الامتحان - أولى ثانوي', 
      grade: 'أولى ثانوي', 
      type: 'المراجعة النهائية', 
      originalPrice: '250 ج.م',
      price: '150 ج.م', 
      discountBadge: 'خصم 40%',
      image: '/th2.webp',
      students: 890, 
      status: 'مسودة' 
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState('أولى ثانوي');
  const [type, setType] = useState('شرح المنهج');
  const [originalPrice, setOriginalPrice] = useState('500');
  const [price, setPrice] = useState('350');
  const [hasDiscount, setHasDiscount] = useState(true);
  const [imageUrl, setImageUrl] = useState('/th1.webp');
  const [status, setStatus] = useState('مفعل');

  const handleOpenNewModal = () => {
    setEditingCourse(null);
    setTitle('');
    setGrade('أولى ثانوي');
    setType('شرح المنهج');
    setOriginalPrice('500');
    setPrice('350');
    setHasDiscount(true);
    setImageUrl('/th1.webp');
    setStatus('مفعل');
    setShowModal(true);
  };

  const handleOpenEditModal = (course: any) => {
    setEditingCourse(course);
    setTitle(course.title);
    setGrade(course.grade);
    setType(course.type);
    setOriginalPrice(course.originalPrice ? course.originalPrice.replace(' ج.م', '') : '');
    setPrice(course.price.replace(' ج.م', ''));
    setHasDiscount(!!course.discountBadge);
    setImageUrl(course.image || '/th1.webp');
    setStatus(course.status);
    setShowModal(true);
  };

  const handleSaveCourse = () => {
    if (!title.trim()) return;

    const calcDiscountBadge = hasDiscount && originalPrice && price && Number(originalPrice) > Number(price)
      ? `خصم ${Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)}%`
      : '';

    if (editingCourse) {
      setCourses(courses.map(c => c.id === editingCourse.id ? {
        ...c, title, grade, type,
        originalPrice: hasDiscount ? `${originalPrice} ج.م` : `${price} ج.م`,
        price: `${price} ج.م`,
        discountBadge: calcDiscountBadge,
        image: imageUrl,
        status
      } : c));
    } else {
      const newCourse = {
        id: Date.now(),
        title,
        grade,
        type,
        originalPrice: hasDiscount ? `${originalPrice} ج.م` : `${price} ج.م`,
        price: `${price} ج.م`,
        discountBadge: calcDiscountBadge,
        image: imageUrl || '/th1.webp',
        students: 0,
        status
      };
      setCourses([newCourse, ...courses]);
    }
    setShowModal(false);
  };

  const handleDeleteCourse = (id: number) => {
    if (confirm('هل أنت تأكد من حذف هذا الكورس؟')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'Tajawal, sans-serif' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 8 }}>إدارة الكورسات والمناهج الدراسية</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>تحكم في الكورسات المتاحة على المنصة، رفع المحتوى المشفر ضد السرقة، وضبط الأسعار والخصومات.</p>
        </div>
        <button 
          onClick={handleOpenNewModal}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#6C22F9', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 14px rgba(108, 34, 249, 0.35)' }}
        >
          <Plus size={18} /> إضافة كورس جديد
        </button>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        
        {/* Search Toolbar */}
        <div style={{ padding: 20, borderBottom: '1px solid var(--border)', display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="ابحث عن كورس..." 
              style={{ width: '100%', padding: '10px 42px 10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} 
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', color: 'var(--text-muted)', fontSize: 13, borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px', fontWeight: 700 }}>غلاف الكورس واسمه</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>المرحلة</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>النوع</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>السعر والخصم</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>إدارة الدرجات والمحتوى</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>الحالة</th>
                <th style={{ padding: '16px', fontWeight: 700, textAlign: 'left' }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px', fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ position: 'relative', width: 48, height: 48, borderRadius: 10, overflow: 'hidden', background: '#16133a', flexShrink: 0 }}>
                        <Image src={course.image} alt={course.title} fill style={{ objectFit: 'cover' }} />
                      </div>
                      <span>{course.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-muted)' }}>{course.grade}</td>
                  <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-muted)' }}>{course.type}</td>
                  
                  {/* Price & Discount Display */}
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--text-main)' }}>{course.price}</span>
                        {course.discountBadge && (
                          <span style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 800 }}>
                            {course.discountBadge}
                          </span>
                        )}
                      </div>
                      {course.discountBadge && (
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'line-through' }}>{course.originalPrice}</span>
                      )}
                    </div>
                  </td>

                  {/* Manage Content Button */}
                  <td style={{ padding: '16px' }}>
                    <Link href={`/admin/courses/${course.id}/content`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(108,34,249,0.12)', border: '1px solid rgba(108,34,249,0.25)', color: '#6C22F9', padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>
                      <Video size={14} /> دروس الفيديوهات والمحتوى
                    </Link>
                  </td>

                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      background: course.status === 'مفعل' ? 'rgba(34,197,94,0.15)' : 'rgba(148,163,184,0.15)',
                      color: course.status === 'مفعل' ? '#22c55e' : 'var(--text-muted)',
                      padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800
                    }}>
                      {course.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                      <button onClick={() => handleOpenEditModal(course)} style={{ background: 'rgba(108,34,249,0.1)', color: '#6C22F9', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer' }} title="تعديل"><Edit2 size={16} /></button>
                      <button onClick={() => handleDeleteCourse(course.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer' }} title="حذف"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      </div>

      {/* Add / Edit Course Modal Perfectly Centered */}
      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
            
            {/* Backdrop */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(5,2,20,0.75)', backdropFilter: 'blur(4px)', zIndex: 1001 }} onClick={() => setShowModal(false)} />
            
            {/* Modal Box */}
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} style={{ position: 'relative', zIndex: 1002, width: '100%', maxWidth: 640, background: 'var(--surface)', borderRadius: 24, padding: 32, boxShadow: '0 20px 50px rgba(0,0,0,0.4)', border: '1px solid var(--border)', maxHeight: '90vh', overflowY: 'auto' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>{editingCourse ? 'تعديل بيانات الكورس والخصم' : 'إضافة كورس جديد مع خصم'}</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-main)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                
                {/* Course Cover Image Selection */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>رابط صورة غلاف الكورس (Cover Image)</label>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: 64, height: 64, borderRadius: 12, overflow: 'hidden', background: '#16133a', flexShrink: 0, border: '1px solid var(--border)' }}>
                      <Image src={imageUrl || '/th1.webp'} alt="Preview" fill style={{ objectFit: 'cover' }} />
                    </div>
                    <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="مثال: /th1.webp أو رابط صورة" style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>عنوان الكورس</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="مثال: كورس البرمجة والذكاء الاصطناعي" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>المرحلة الدراسية</label>
                    <select value={grade} onChange={e => setGrade(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}>
                      <option value="أولى ثانوي">أولى ثانوي</option>
                      <option value="ثانية ثانوي">ثانية ثانوي</option>
                      <option value="تأسيس">كورس تأسيسي</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>نوع الكورس</label>
                    <select value={type} onChange={e => setType(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}>
                      <option value="شرح المنهج">شرح المنهج</option>
                      <option value="كورس تأسيسي">كورس تأسيسي</option>
                      <option value="بنك الأسئلة">بنك الأسئلة</option>
                      <option value="حل الامتحانات">حل الامتحانات</option>
                      <option value="المراجعة النهائية">المراجعة النهائية</option>
                    </select>
                  </div>
                </div>

                {/* Price & Discount Settings */}
                <div style={{ background: 'var(--bg)', padding: 18, borderRadius: 16, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Tag size={16} color="#6C22F9" /> إعدادات السعر والخصم
                    </h4>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 800, cursor: 'pointer', color: '#6C22F9' }}>
                      <input type="checkbox" checked={hasDiscount} onChange={e => setHasDiscount(e.target.checked)} style={{ accentColor: '#6C22F9' }} />
                      تفعيل خصم السعر
                    </label>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                        {hasDiscount ? 'السعر الأصلي (قبل الخصم)' : 'سعر الكورس الحالي'}
                      </label>
                      <input type="number" value={hasDiscount ? originalPrice : price} onChange={e => hasDiscount ? setOriginalPrice(e.target.value) : setPrice(e.target.value)} placeholder="مثال: 500" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                    </div>

                    {hasDiscount && (
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#ef4444', marginBottom: 6 }}>السعر النهائي (بعد الخصم)</label>
                        <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="مثال: 350" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                      </div>
                    )}
                  </div>

                  {hasDiscount && originalPrice && price && Number(originalPrice) > Number(price) && (
                    <div style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', padding: '8px 12px', borderRadius: 10, fontSize: 13, fontWeight: 800, textAlign: 'center' }}>
                      🎉 سيظهر للطلاب خصم بمقدار: {Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)}%
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>حالة ظهور الكورس</label>
                  <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}>
                    <option value="مفعل">مفعل (ظاهر للطلاب)</option>
                    <option value="مسودة">مسودة (مخفي)</option>
                  </select>
                </div>

              </div>

              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button onClick={() => setShowModal(false)} style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>إلغاء</button>
                <button onClick={handleSaveCourse} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#6C22F9', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}><Save size={16} /> حفظ الكورس والخصم</button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
