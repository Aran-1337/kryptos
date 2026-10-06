'use client';
import { Order } from '../types/order.types';
import OrderStatusBadge from './OrderStatusBadge';
import { Calendar, CreditCard, ChevronLeft, BookOpen, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface OrderCardProps {
  order: Order;
  onViewDetails: (orderId: string) => void;
}

export default function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const primaryItem = order.items[0];
  const itemsCount = order.items.length;
  const courseId = primaryItem ? (typeof primaryItem.item === 'object' ? primaryItem.item?._id : primaryItem.item) : null;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        padding: 20,
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          paddingBottom: 14,
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
            طلب #{order._id.slice(-6).toUpperCase()}
          </span>
          <span style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Calendar size={13} />
            {formatDate(order.createdAt)}
          </span>
        </div>
        <OrderStatusBadge status={order.status} size="sm" />
      </div>

      {/* Middle Item Preview */}
      <div style={{ padding: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6366f1',
              flexShrink: 0,
            }}
          >
            <BookOpen size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: '0 0 4px 0' }}>
              {primaryItem?.title || 'عنصر الطلب'}
            </h4>
            {itemsCount > 1 && (
              <span style={{ fontSize: 12, color: '#64748b' }}>
                و {itemsCount - 1} عناصر أخرى
              </span>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'left', flexShrink: 0 }}>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 2px 0' }}>الإجمالي</p>
          <p style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {order.totalAmount} ج.م
          </p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 14,
          borderTop: '1px solid #f1f5f9',
          gap: 10,
        }}
      >
        <button
          onClick={() => onViewDetails(order._id)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            fontSize: 13,
            fontWeight: 700,
            color: '#4f46e5',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span>عرض التفاصيل</span>
          <ChevronLeft size={16} />
        </button>

        <div style={{ display: 'flex', gap: 8 }}>
          {order.status === 'completed' && courseId && (
            <Link
              href={`/courses/${courseId}/watch`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                borderRadius: 8,
                backgroundColor: '#ecfdf5',
                color: '#059669',
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
                border: '1px solid #a7f3d0',
              }}
            >
              <CheckCircle size={14} />
              <span>مشاهدة الكورس</span>
            </Link>
          )}

          {order.status === 'pending' && courseId && (
            <Link
              href={`/courses/${courseId}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                borderRadius: 8,
                backgroundColor: '#fffbeb',
                color: '#d97706',
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
                border: '1px solid #fde68a',
              }}
            >
              <span>متابعة الكورس</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
