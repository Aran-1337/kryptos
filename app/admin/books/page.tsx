'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Truck, PackageCheck, MapPin, Search, Edit2, Trash2, CheckCircle2, Clock, X, Save, ExternalLink, Download, PhoneCall, MessageCircle, Gift, Upload } from 'lucide-react';

export default function AdminBooksPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'gifts' | 'books'>('orders');

  // Book Orders & Tracking State
  const [orders, setOrders] = useState([
    {
      id: 'ORD-9841',
      studentName: 'أحمد محمود العبد',
      phone: '01012345678',
      governorate: 'القاهرة',
      address: 'مدينة نصر - الشارع التاني - عمارة 14',
      bookTitle: 'مذكرة الشامل في البرمجة والذكاء الاصطناعي (أولى ثانوي)',
      copyType: 'مطبوع (ورقي)',
      price: 150,
      shippingFee: 40,
      total: 190,
      trackingNumber: 'TRK-Cairo-4812',
      status: 'shipped', // pending, shipped, delivered
      date: '06 أغسطس 2026'
    },
    {
      id: 'ORD-9842',
      studentName: 'سارة خالد السيد',
      phone: '01298765432',
      governorate: 'الإسكندرية',
      address: 'سموحة - ش 15 مايو - برج السلام',
      bookTitle: 'كتاب الخوارزميات وتطبيقات بايثون (ثانية ثانوي)',
      copyType: 'مطبوع (ورقي)',
      price: 180,
      shippingFee: 50,
      total: 230,
      trackingNumber: 'TRK-Alex-1092',
      status: 'pending',
      date: '06 أغسطس 2026'
    }
  ]);

  // Physical Gift Orders State (Submitted by students from Quests)
  const [giftOrders, setGiftOrders] = useState<any[]>([]);

  // Books Inventory State
  const [books, setBooks] = useState([
    {
      id: 'b-1',
      title: 'مذكرة الشامل في البرمجة والذكاء الاصطناعي (أولى ثانوي)',
      type: 'مطبوع ورقي + PDF',
      price: 150,
      originalPrice: 200,
      stock: 45,
      pdfUrl: '/memento1.pdf',
      salesCount: 128
    },
    {
      id: 'b-2',
      title: 'كتاب الخوارزميات وتطبيقات بايثون (ثانية ثانوي)',
      type: 'مطبوع ورقي',
      price: 180,
      originalPrice: 240,
      stock: 30,
      pdfUrl: '',
      salesCount: 94
    }
  ]);

  useEffect(() => {
    try {
      const savedGifts = localStorage.getItem('physical_gift_orders');
      if (savedGifts) {
        setGiftOrders(JSON.parse(savedGifts));
      } else {
        setGiftOrders([
          {
            id: 'GIFT-1002',
            questTitle: 'وسام المتفوق البرمجي',
            giftName: 'مجموعة المذكرات الورقية المطبوعة + ميدالية التفوق البرمجي 🏅',
            studentName: 'أحمد محمود السيد',
            phone: '01012345678',
            governorate: 'القاهرة',
            address: 'مدينة نصر - الشارع المصطفى - عمارة 18',
            date: '08 أغسطس 2026',
            status: 'قيد الشحن'
          }
        ]);
      }

      const savedBooks = localStorage.getItem('admin_created_books');
      if (savedBooks) {
        setBooks(JSON.parse(savedBooks));
      }
    } catch {}
  }, []);

  // Modals state
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // New Book Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('مطبوع ورقي + PDF');
  const [newPrice, setNewPrice] = useState('150');
  const [newOriginalPrice, setNewOriginalPrice] = useState('200');
  const [newStock, setNewStock] = useState('50');
  const [toastMsg, setToastMsg] = useState('');

  const handleUpdateGiftStatus = (id: string, status: string) => {
    const updated = giftOrders.map(g => g.id === id ? { ...g, status } : g);
    setGiftOrders(updated);
    localStorage.setItem('physical_gift_orders', JSON.stringify(updated));
  };

  const handleUpdateOrderStatus = (status: string) => {
    if (!selectedOrder) return;
    setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status } : o));
    setShowTrackModal(false);
  };

  const handleAddBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newB = {
      id: 'b-' + (books.length + 1),
      title: newTitle,
      type: newType,
      price: Number(newPrice) || 150,
      originalPrice: Number(newOriginalPrice) || 200,
      stock: Number(newStock) || 50,
      pdfUrl: '/memento1.pdf',
      salesCount: 0
    };

    const updatedBooks = [...books, newB];
    setBooks(updatedBooks);
    localStorage.setItem('admin_created_books', JSON.stringify(updatedBooks));
    setShowAddBookModal(false);
    setNewTitle('');
    setActiveTab('books');
    setToastMsg('✅ تم إضافة الكتاب/المذكرة بنجاح إلى القائمة والمكتبة!');
    setTimeout(() => setToastMsg(''), 3500);
  };

  const getWhatsAppMessageUrl = (ord: any) => {
    const statusText = ord.status === 'delivered' ? 'تم التوصيل للعميل بنجاح ✅' : ord.status === 'shipped' ? 'تم التسليم لشركة الشحن 🚚' : 'قيد التحضير 📦';
    const text = `أهلاً يا ${ord.studentName} 👋، تم تحديث حالة شحن طلبك [${ord.bookTitle || ord.giftName}] إلى: ${statusText}.\nيمكنك متابعة الشحنة دائماً عبر حسابك في منصة م. عبدالرحمن حامد.`;
    return `https://wa.me/20${ord.phone.replace(/^0/, '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div style={{ width: '100%', fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* Toast Notification */}
      {toastMsg && (
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--surface)', color: '#10b981', padding: '14px 28px', borderRadius: 14,
            fontWeight: 800, zIndex: 99999, boxShadow: '0 10px 30px rgba(16,185,129,0.2)', border: '1.5px solid #10b981', fontSize: 14.5
          }}
        >
          {toastMsg}
        </motion.div>
      )}

      {/* Title Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 6px' }}>إدارة الشحنات والكتب وجوائز التحديات 📚🎁</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>متابعة شحن المذكرات وجوائز الهدايا الملموسة للطلاب، إضافة كتب جديدة، وتحديث حالة التسليم.</p>
        </div>

        <button 
          onClick={() => setShowAddBookModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#6C22F9', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(108,34,249,0.35)', fontFamily: 'Tajawal, sans-serif' }}
        >
          <Plus size={18} /> إضافة كتاب / مذكرة جديدة
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'orders' ? '3px solid #6C22F9' : '3px solid transparent',
            color: activeTab === 'orders' ? '#6C22F9' : 'var(--text-muted)', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif'
          }}
        >
          📦 طلبات شحن المذكرات ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('gifts')}
          style={{
            padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'gifts' ? '3px solid #f59e0b' : '3px solid transparent',
            color: activeTab === 'gifts' ? '#f59e0b' : 'var(--text-muted)', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif',
            display: 'flex', alignItems: 'center', gap: 8
          }}
        >
          <Gift size={16} /> طلبات شحن جوائز التحديات ({giftOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('books')}
          style={{
            padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'books' ? '3px solid #10b981' : '3px solid transparent',
            color: activeTab === 'books' ? '#10b981' : 'var(--text-muted)', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif'
          }}
        >
          📚 قائمة الكتب والمخزون ({books.length})
        </button>
      </div>

      {/* Tab 1: Book Orders */}
      {activeTab === 'orders' && (
        <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', color: 'var(--text-muted)', fontSize: 13, borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>رقم الطلب / الطالب</th>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>العنوان والمحافظة</th>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>المذكرة المطلوبة</th>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>الإجمالي</th>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>الحالة</th>
                <th style={{ padding: '16px 20px', fontWeight: 800, textAlign: 'left' }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(ord => (
                <tr key={ord.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: 14 }}>{ord.studentName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{ord.id} • {ord.phone}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#6C22F9' }}>{ord.governorate}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ord.address}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text-main)' }}>{ord.bookTitle}</div>
                    <span style={{ fontSize: 11, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>{ord.copyType}</span>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: 15, fontWeight: 900, color: '#10b981' }}>
                    {ord.total} ج.م
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800,
                      background: ord.status === 'delivered' ? 'rgba(16,185,129,0.15)' : ord.status === 'shipped' ? 'rgba(59,130,246,0.15)' : 'rgba(245,158,11,0.15)',
                      color: ord.status === 'delivered' ? '#10b981' : ord.status === 'shipped' ? '#3b82f6' : '#d97706'
                    }}>
                      {ord.status === 'delivered' ? 'تم التوصيل ✅' : ord.status === 'shipped' ? 'تم الشحن 🚚' : 'قيد التحضير 📦'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button onClick={() => { setSelectedOrder(ord); setShowTrackModal(true); }} style={{ background: 'rgba(108,34,249,0.1)', color: '#6C22F9', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>تحديث الحالة</button>
                      <a href={getWhatsAppMessageUrl(ord)} target="_blank" rel="noreferrer" style={{ background: '#25D366', color: '#fff', padding: '6px 10px', borderRadius: 8, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 800 }}>
                        <MessageCircle size={14} /> واتساب
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Gift Orders */}
      {activeTab === 'gifts' && (
        <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', color: 'var(--text-muted)', fontSize: 13, borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>الطالب والعنوان</th>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>هدية التحدي المستحقة</th>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>حالة الشحن</th>
                <th style={{ padding: '16px 20px', fontWeight: 800, textAlign: 'left' }}>إجراءات الأدمن</th>
              </tr>
            </thead>
            <tbody>
              {giftOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>لا توجد طلبات جوائز ملموسة حالياً.</td>
                </tr>
              ) : (
                giftOrders.map(g => (
                  <tr key={g.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: 14 }}>{g.studentName}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{g.governorate} - {g.address} ({g.phone})</div>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: 13.5, fontWeight: 800, color: '#6C22F9' }}>
                      <div>{g.giftName}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>التحدي: {g.questTitle}</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800,
                        background: g.status === 'تم التسليم' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                        color: g.status === 'تم التسليم' ? '#10b981' : '#d97706'
                      }}>
                        {g.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'left' }}>
                      <select
                        value={g.status}
                        onChange={e => handleUpdateGiftStatus(g.id, e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 12, fontWeight: 800, fontFamily: 'Tajawal, sans-serif' }}
                      >
                        <option value="قيد الشحن">قيد الشحن 🚚</option>
                        <option value="تم التسليم">تم التسليم ✅</option>
                        <option value="ملغي">ملغي ❌</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Books Inventory */}
      {activeTab === 'books' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {books.map(b => (
            <div key={b.id} style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ background: 'rgba(108,34,249,0.12)', color: '#6C22F9', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800 }}>
                  {b.type}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>المبيعات: {b.salesCount} نسخة</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 12px', lineHeight: 1.5 }}>{b.title}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <div>
                  <span style={{ fontSize: 18, fontWeight: 900, color: '#10b981' }}>{b.price} ج.م</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'line-through', marginRight: 6 }}>{b.originalPrice} ج.م</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: b.stock > 10 ? '#10b981' : '#ef4444' }}>
                  المخزون: {b.stock} قطعة
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Book Modal */}
      <AnimatePresence>
        {showAddBookModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddBookModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', zIndex: 1001 }} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} style={{ position: 'relative', zIndex: 1002, background: 'var(--surface)', borderRadius: 24, border: '1px solid var(--border)', padding: 28, width: '100%', maxWidth: 500, fontFamily: 'Tajawal, sans-serif', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: 'var(--text-main)' }}>إضافة كتاب / مذكرة جديدة 📚</h3>
                <button onClick={() => setShowAddBookModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <form onSubmit={handleAddBookSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>عنوان الكتاب / المذكرة <span style={{ color: '#ef4444' }}>*</span>:</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="مثال: مذكرة بنك الأسئلة والامتحانات (أولى ثانوي)"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>نوع المذكرة والنسخة:</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}
                  >
                    <option value="مطبوع ورقي + PDF">مطبوع ورقي + PDF</option>
                    <option value="نسخة رقمية PDF فقط">نسخة رقمية PDF فقط (تحميل مباشر)</option>
                    <option value="مطبوع ورقي شحن للمنزل">مطبوع ورقي (شحن للمنزل)</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>سعر البيع (ج.م):</label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={e => setNewPrice(e.target.value)}
                      placeholder="150"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>السعر قبل الخصم (ج.م):</label>
                    <input
                      type="number"
                      value={newOriginalPrice}
                      onChange={e => setNewOriginalPrice(e.target.value)}
                      placeholder="200"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>الكمية المتاحة في المخزون:</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={e => setNewStock(e.target.value)}
                    placeholder="50"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button type="button" onClick={() => setShowAddBookModal(false)} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer' }}>إلغاء</button>
                  <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#6C22F9', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>
                    <Save size={16} /> حفظ وإضافة للمكتبة 🚀
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Status Modal */}
      <AnimatePresence>
        {showTrackModal && selectedOrder && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTrackModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1001 }} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} style={{ position: 'relative', zIndex: 1002, background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: 28, width: '100%', maxWidth: 440, fontFamily: 'Tajawal, sans-serif', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: 'var(--text-main)' }}>تحديث حالة الطلب ({selectedOrder.id})</h3>
                <button onClick={() => setShowTrackModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                <button onClick={() => handleUpdateOrderStatus('pending')} style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', textAlign: 'right', fontWeight: 800, cursor: 'pointer' }}>📦 قيد التحضير والتجهيز</button>
                <button onClick={() => handleUpdateOrderStatus('shipped')} style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: '#3b82f6', textAlign: 'right', fontWeight: 800, cursor: 'pointer' }}>🚚 تم التسليم لشركة الشحن</button>
                <button onClick={() => handleUpdateOrderStatus('delivered')} style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: '#10b981', textAlign: 'right', fontWeight: 800, cursor: 'pointer' }}>✅ تم التوصيل والإنهاء</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
