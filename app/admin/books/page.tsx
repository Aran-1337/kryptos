'use client';
import { Plus, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import AdminPageHeader from '@/app/components/layout/AdminPageHeader';
import {
  useBooks,
  BookOrdersTab,
  GiftOrdersTab,
  InventoryTab,
  BookFormModal,
  TrackingModal,
} from '@/app/features/books';

export default function AdminBooksPage() {
  const {
    activeTab,
    setActiveTab,
    orders,
    giftOrders,
    books,
    showAddBookModal,
    setShowAddBookModal,
    showTrackModal,
    setShowTrackModal,
    selectedOrder,
    newTitle,
    setNewTitle,
    newType,
    setNewType,
    newPrice,
    setNewPrice,
    newOriginalPrice,
    setNewOriginalPrice,
    newStock,
    setNewStock,
    toastMsg,
    handleUpdateGiftStatus,
    handleUpdateOrderStatus,
    handleAddBookSubmit,
    openTrackModal,
    openAddBookModal,
  } = useBooks();

  return (
    <div style={{ width: '100%', fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* Toast Notification */}
      {toastMsg && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--surface)',
            color: '#10b981',
            padding: '14px 28px',
            borderRadius: 14,
            fontWeight: 800,
            zIndex: 99999,
            boxShadow: '0 10px 30px rgba(16,185,129,0.2)',
            border: '1.5px solid #10b981',
            fontSize: 14.5,
          }}
        >
          {toastMsg}
        </motion.div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <AdminPageHeader
          title="إدارة الشحنات والكتب وجوائز التحديات 📚🎁"
          subtitle="متابعة شحن المذكرات وجوائز الهدايا الملموسة للطلاب، إضافة كتب جديدة، وتحديث حالة التسليم."
          action={
            <button 
              type="button"
              onClick={openAddBookModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#6C22F9',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 12,
                fontWeight: 800,
                fontSize: 14,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(108,34,249,0.35)',
                fontFamily: 'Tajawal, sans-serif',
              }}
            >
              <Plus size={18} /> إضافة كتاب / مذكرة جديدة
            </button>
          }
        />
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '12px 24px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'orders' ? '3px solid #6C22F9' : '3px solid transparent',
            color: activeTab === 'orders' ? '#6C22F9' : 'var(--text-muted)',
            fontWeight: 800,
            fontSize: 15,
            cursor: 'pointer',
            fontFamily: 'Tajawal, sans-serif',
          }}
        >
          📦 طلبات شحن المذكرات ({orders.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gifts')}
          style={{
            padding: '12px 24px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'gifts' ? '3px solid #f59e0b' : '3px solid transparent',
            color: activeTab === 'gifts' ? '#f59e0b' : 'var(--text-muted)',
            fontWeight: 800,
            fontSize: 15,
            cursor: 'pointer',
            fontFamily: 'Tajawal, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Gift size={16} /> طلبات شحن جوائز التحديات ({giftOrders.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('books')}
          style={{
            padding: '12px 24px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'books' ? '3px solid #10b981' : '3px solid transparent',
            color: activeTab === 'books' ? '#10b981' : 'var(--text-muted)',
            fontWeight: 800,
            fontSize: 15,
            cursor: 'pointer',
            fontFamily: 'Tajawal, sans-serif',
          }}
        >
          📚 قائمة الكتب والمخزون ({books.length})
        </button>
      </div>

      {/* Tab 1: Book Orders */}
      {activeTab === 'orders' && (
        <BookOrdersTab
          orders={orders}
          onOpenTrackModal={openTrackModal}
        />
      )}

      {/* Tab 2: Gift Orders */}
      {activeTab === 'gifts' && (
        <GiftOrdersTab
          giftOrders={giftOrders}
          onUpdateStatus={handleUpdateGiftStatus}
        />
      )}

      {/* Tab 3: Books Inventory */}
      {activeTab === 'books' && (
        <InventoryTab
          books={books}
        />
      )}

      {/* Add New Book Modal */}
      <BookFormModal
        isOpen={showAddBookModal}
        onClose={() => setShowAddBookModal(false)}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newType={newType}
        setNewType={setNewType}
        newPrice={newPrice}
        setNewPrice={setNewPrice}
        newOriginalPrice={newOriginalPrice}
        setNewOriginalPrice={setNewOriginalPrice}
        newStock={newStock}
        setNewStock={setNewStock}
        onSubmit={handleAddBookSubmit}
      />

      {/* Status Modal */}
      <TrackingModal
        isOpen={showTrackModal}
        order={selectedOrder}
        onClose={() => setShowTrackModal(false)}
        onUpdateStatus={handleUpdateOrderStatus}
      />

    </div>
  );
}
