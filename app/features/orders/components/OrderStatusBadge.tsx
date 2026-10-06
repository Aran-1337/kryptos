'use client';
import { OrderStatus } from '../types/order.types';
import { CheckCircle2, Clock, XCircle, RotateCcw, AlertCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export default function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
  const configs: Record<OrderStatus, { label: string; bg: string; text: string; border: string; icon: any }> = {
    completed: {
      label: 'مكتمل',
      bg: '#ecfdf5',
      text: '#059669',
      border: '#a7f3d0',
      icon: CheckCircle2,
    },
    pending: {
      label: 'بانتظار الدفع',
      bg: '#fffbeb',
      text: '#d97706',
      border: '#fde68a',
      icon: Clock,
    },
    failed: {
      label: 'فشل العملية',
      bg: '#fef2f2',
      text: '#dc2626',
      border: '#fecaca',
      icon: AlertCircle,
    },
    refunded: {
      label: 'مسترجع',
      bg: '#f1f5f9',
      text: '#475569',
      border: '#cbd5e1',
      icon: RotateCcw,
    },
    cancelled: {
      label: 'ملغي',
      bg: '#f8fafc',
      text: '#64748b',
      border: '#e2e8f0',
      icon: XCircle,
    },
  };

  const config = configs[status] || configs.pending;
  const Icon = config.icon;
  const isSm = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSm ? 4 : 6,
        padding: isSm ? '3px 8px' : '5px 12px',
        borderRadius: 9999,
        fontSize: isSm ? 12 : 13,
        fontWeight: 700,
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon size={isSm ? 13 : 15} />
      <span>{config.label}</span>
    </span>
  );
}
