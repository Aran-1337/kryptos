'use client';
import { Order } from '../types/order.types';
import OrderStatusBadge from './OrderStatusBadge';
import { X, Calendar, CreditCard, ShieldCheck, BookOpen, ExternalLink, Hash } from 'lucide-react';
import Link from 'next/link';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
}

export default function OrderDetailsModal({ order, isOpen, onClose, loading }: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const formatPaymentMethod = (method?: string) => {
    switch (method) {
      case 'vodafone_cash':
        return 'فودافون كاش';
      case 'fawry':
        return 'فوري';
      case 'card':
        return 'بطاقة بنكية';
      case 'cash':
        return 'دفع نقدي / يدوي';
      case 'manual':
        return 'تحويل بنكي / يدوي';
      default:
        return method || 'غير محدد';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        direction: 'rtl',
        fontFamily: 'Tajawal, sans-serif',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 20,
          maxWidth: 580,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                تفاصيل الطلب #{order._id.slice(-6).toUpperCase()}
              </h3>
              <OrderStatusBadge status={order.status} size="sm" />
            </div>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
              معرف الطلب الكامل: <span style={{ fontFamily: 'monospace' }}>{order._id}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: 8,
              borderRadius: 10,
              border: 'none',
              background: '#f8fafc',
              cursor: 'pointer',
              color: '#64748b',
              transition: 'background 0.2s',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Metadata bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 12,
              marginBottom: 24,
              backgroundColor: '#f8fafc',
              padding: 16,
              borderRadius: 14,
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Calendar size={18} color="#6366f1" />
              <div>
                <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>تاريخ الإنشاء</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', margin: 0 }}>
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CreditCard size={18} color="#10b981" />
              <div>
                <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>طريقة الدفع</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', margin: 0 }}>
                  {formatPaymentMethod(order.paymentMethod)}
                </p>
              </div>
            </div>

            {order.transactionId && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Hash size={18} color="#f59e0b" />
                <div>
                  <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>رقم المعاملة</p>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', margin: 0, fontFamily: 'monospace' }}>
                    {order.transactionId}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Items Section */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
              العناصر المشمولة في الطلب ({order.items.length})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {order.items.map((item, idx) => {
                const courseId = typeof item.item === 'object' ? item.item?._id : item.item;
                return (
                  <div
                    key={item._id || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 14,
                      borderRadius: 12,
                      border: '1px solid #f1f5f9',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          backgroundColor: '#eef2ff',
                          color: '#4f46e5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                          {item.title}
                        </p>
                        <span style={{ fontSize: 12, color: '#64748b' }}>
                          {item.itemType === 'course' ? 'كورس تدريبي' : 'كتاب ومذكرة'}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                        {item.price === 0 ? 'مجاني' : `${item.price} ج.م`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div
            style={{
              padding: 16,
              borderRadius: 14,
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              marginBottom: 20,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: '#64748b' }}>
              <span>المجموع الفرعي</span>
              <span>{order.totalAmount + (order.discountAmount || 0)} ج.م</span>
            </div>
            {Boolean(order.discountAmount && order.discountAmount > 0) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: '#10b981' }}>
                <span>خصم الكوبون ({order.couponCode || 'تخفيض'})</span>
                <span>-{order.discountAmount} ج.م</span>
              </div>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: 10,
                borderTop: '1px dashed #cbd5e1',
                fontSize: 16,
                fontWeight: 800,
                color: '#0f172a',
              }}
            >
              <span>الإجمالي النهائي</span>
              <span style={{ color: '#4f46e5' }}>{order.totalAmount} ج.م</span>
            </div>
          </div>

          {/* Status Notes */}
          {order.status === 'pending' && (
            <div
              style={{
                padding: 14,
                borderRadius: 12,
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                color: '#92400e',
                fontSize: 13,
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              <p style={{ fontWeight: 700, margin: '0 0 4px 0' }}>طلبك قيد المراجعة وتأكيد الدفع</p>
              بمجرد تأكيد سداد الرسوم أو موافقة الإدارة، سيتم تفعيل الكورس فوراً في حسابك وتتمكن من مشاهدة كافة المحتويات.
            </div>
          )}

          {order.status === 'completed' && (
            <div
              style={{
                padding: 14,
                borderRadius: 12,
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#065f46',
                fontSize: 13,
                lineHeight: 1.6,
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <ShieldCheck size={20} color="#059669" />
              <span>تم تأكيد الطلب بنجاح وتفعيل الاشتراك في حسابك بالكامل.</span>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              إغلاق
            </button>
            {order.status === 'completed' && order.items.length > 0 && (
              <Link
                href={`/courses/${typeof order.items[0].item === 'object' ? order.items[0].item._id : order.items[0].item}/watch`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  borderRadius: 10,
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <span>مشاهدة الكورس</span>
                <ExternalLink size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
