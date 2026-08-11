'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Truck, PackageCheck, MapPin, Search, Edit2, Trash2, CheckCircle2, Clock, X, Save, ExternalLink, Download, PhoneCall, MessageCircle, Gift } from 'lucide-react';

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

  useEffect(() => {
    try {
      const saved = localStorage.getItem('physical_gift_orders');
      if (saved) {
        setGiftOrders(JSON.parse(saved));
      } else {
        // Sample default gift order for admin testing
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
    } catch {}
  }, []);

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

  // Modals state
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // New Book Form
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('مطبوع ورقي + PDF');
  const [newPrice, setNewPrice] = useState('150');
  const [newStock, setNewStock] = useState('50');

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
      price: Number(newPrice),
      originalPrice: Number(newPrice) + 40,
      stock: Number(newStock),
      pdfUrl: '/demo.pdf',
      salesCount: 0
    };

    setBooks([...books, newB]);
    setShowAddBookModal(false);
    setNewTitle('');
  };

  const getWhatsAppMessageUrl = (ord: any) => {
    const statusText = ord.status === 'delivered' ? 'تم التوصيل للعميل بنجاح ✅' : ord.status === 'shipped' ? 'تم التسليم لشركة الشحن 🚚' : 'قيد التحضير 📦';
    const text = `أهلاً يا ${ord.studentName} 👋، تم تحديث حالة شحن طلبك [${ord.bookTitle || ord.giftName}] إلى: ${statusText}.\nيمكنك متابعة الشحنة دائماً عبر حسابك في منصة م. عبدالرحمن حامد.`;
    return `https://wa.me/20${ord.phone.replace(/^0/, '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div style={{ width: '100%', fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
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
          <Gift size={18} color="#f59e0b" /> طلبات شحن جوائز التحديات ({giftOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('books')}
          style={{
            padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'books' ? '3px solid #6C22F9' : '3px solid transparent',
            color: activeTab === 'books' ? '#6C22F9' : 'var(--text-muted)', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif'
          }}
        >
          📚 قائمة الكتب والمخزون ({books.length})
        </button>
      </div>

      {/* Tab 1: Book Orders */}
      {activeTab === 'orders' && (
        <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 13 }}>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>رقم الطلب والتاريخ</th>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>بيانات الطالب والتواصل</th>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>عنوان الشحن التفصيلي</th>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>الكتاب المطلوبة</th>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>المبلغ الكلي</th>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>حالة الشحن</th>
                <th style={{ padding: '16px 20px', fontWeight: 800, textAlign: 'left' }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(ord => (
                <tr key={ord.id} style={{ borderBottom: '1px solid var(--border)', fontSize: 13.5, fontWeight: 600, color: 'var(--text-main)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 800, color: '#6C22F9' }}>
                    <div>{ord.id}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{ord.date}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 800 }}>{ord.studentName}</div>
                    <a href={getWhatsAppMessageUrl(ord)} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#25d366', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <MessageCircle size={13} /> {ord.phone}
                    </a>
                  </td>
                  <td style={{ padding: '16px 20px', maxWidth: 220 }}>
                    <div style={{ fontWeight: 800, color: '#3b82f6' }}>📍 {ord.governorate}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{ord.address}</div>
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: 700 }}>{ord.bookTitle}</td>
                  <td style={{ padding: '16px 20px', fontWeight: 900, color: '#10b981' }}>{ord.total} ج.م</td>
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
                    <button
                      onClick={() => { setSelectedOrder(ord); setShowTrackModal(true); }}
                      style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}
                    >
                      تحديث الحالة
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Physical Gifts Shipping Requests */}
      {activeTab === 'gifts' && (
        <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 13 }}>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>رقم الطلب وتاريخ الاستحقاق</th>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>بيانات الطالب والتواصل</th>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>عنوان الشحن المطلوب</th>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>اسم الجائزة والهدية</th>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>حالة الشحن والتسليم</th>
                <th style={{ padding: '16px 20px', fontWeight: 800, textAlign: 'left' }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {giftOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>لا توجد طلبات شحن جوائز هدايا ملموسة حالياً.</td>
                </tr>
              ) : (
                giftOrders.map(g => (
                  <tr key={g.id} style={{ borderBottom: '1px solid var(--border)', fontSize: 13.5, fontWeight: 600, color: 'var(--text-main)' }}>
                    <td style={{ padding: '16px 20px', fontWeight: 800, color: '#f59e0b' }}>
                      <div>{g.id}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{g.date}</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 800 }}>{g.studentName}</div>
                      <a href={getWhatsAppMessageUrl(g)} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#25d366', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <MessageCircle size={13} /> {g.phone}
                      </a>
                    </td>
                    <td style={{ padding: '16px 20px', maxWidth: 220 }}>
                      <div style={{ fontWeight: 800, color: '#3b82f6' }}>📍 {g.governorate}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{g.address}</div>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 800, color: '#6C22F9' }}>
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

      {/* Status Modal */}
      <AnimatePresence>
        {showTrackModal && selectedOrder && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTrackModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} style={{ position: 'relative', background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: 28, width: '100%', maxWidth: 440, zIndex: 1000, fontFamily: 'Tajawal, sans-serif' }}>
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
