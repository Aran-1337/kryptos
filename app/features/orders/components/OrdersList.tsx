'use client';
import { useOrders } from '../hooks/useOrders';
import OrderCard from './OrderCard';
import OrderDetailsModal from './OrderDetailsModal';
import { ShoppingBag, RefreshCw, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function OrdersList() {
  const {
    orders,
    rawOrders,
    pagination,
    loading,
    error,
    currentPage,
    setCurrentPage,
    statusFilter,
    setStatusFilter,
    selectedOrder,
    modalLoading,
    viewOrderDetails,
    closeModal,
    refresh,
  } = useOrders(1, 10);

  const filterTabs = [
    { id: 'all', label: 'الكل' },
    { id: 'completed', label: 'المكتملة' },
    { id: 'pending', label: 'قيد الانتظار' },
    { id: 'other', label: 'أخرى' },
  ];

  return (
    <div style={{ width: '100%' }}>
      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 20,
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: 12,
          overflowX: 'auto',
        }}
      >
        {filterTabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: isActive ? 800 : 600,
                backgroundColor: isActive ? '#4f46e5' : '#f8fafc',
                color: isActive ? '#ffffff' : '#64748b',
                border: isActive ? '1px solid #4f46e5' : '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            gap: 16,
            color: '#64748b',
          }}
        >
          <RefreshCw size={32} color="#4f46e5" className="animate-spin" />
          <p style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>جارِ تحميل سجل الطلبات...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div
          style={{
            padding: 24,
            borderRadius: 16,
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            margin: '20px 0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertCircle size={24} />
            <div>
              <p style={{ fontWeight: 800, margin: 0, fontSize: 15 }}>تعذر تحميل الطلبات</p>
              <p style={{ fontSize: 13, margin: '4px 0 0 0' }}>{error}</p>
            </div>
          </div>
          <button
            onClick={refresh}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              backgroundColor: '#ffffff',
              border: '1px solid #dc2626',
              color: '#dc2626',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && orders.length === 0 && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            border: '1px dashed #cbd5e1',
            padding: '60px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              backgroundColor: '#f1f5f9',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShoppingBag size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
              لم تقم بأي عمليات شراء حتى الآن
            </h3>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0, maxWidth: 400 }}>
              استكشف أحدث الكورسات والكتب المتاحة في المنصة وابدأ رحلتك التعليمية الآن.
            </p>
          </div>
          <Link
            href="/dashboard/store"
            style={{
              marginTop: 8,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 22px',
              borderRadius: 12,
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <span>تصفح متجر الكورسات</span>
            <ChevronLeft size={16} />
          </Link>
        </div>
      )}

      {/* Orders Grid */}
      {!loading && !error && orders.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} onViewDetails={viewOrderDetails} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && pagination.pages > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            marginTop: 28,
            paddingTop: 16,
            borderTop: '1px solid #f1f5f9',
          }}
        >
          <button
            disabled={!pagination.hasPrev}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              backgroundColor: pagination.hasPrev ? '#ffffff' : '#f8fafc',
              color: pagination.hasPrev ? '#0f172a' : '#94a3b8',
              cursor: pagination.hasPrev ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <ChevronRight size={16} />
            <span>السابق</span>
          </button>

          <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b' }}>
            صفحة {pagination.page} من {pagination.pages}
          </span>

          <button
            disabled={!pagination.hasNext}
            onClick={() => setCurrentPage((p) => p + 1)}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              backgroundColor: pagination.hasNext ? '#ffffff' : '#f8fafc',
              color: pagination.hasNext ? '#0f172a' : '#94a3b8',
              cursor: pagination.hasNext ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <span>التالي</span>
            <ChevronLeft size={16} />
          </button>
        </div>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={closeModal}
        loading={modalLoading}
      />
    </div>
  );
}
