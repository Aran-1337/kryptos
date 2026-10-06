import { useState, useEffect, useCallback } from 'react';
import { ordersService } from '../services/orders.service';
import { Order, OrdersPagination } from '../types/order.types';

export function useOrders(initialPage = 1, limit = 10) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<OrdersPagination>({
    total: 0,
    page: initialPage,
    limit,
    pages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordersService.getMyOrders({ page, limit });
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'تعذر تحميل سجل الطلبات';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, fetchOrders]);

  const viewOrderDetails = async (orderId: string) => {
    setModalLoading(true);
    setModalError(null);
    const cached = orders.find(o => o._id === orderId);
    if (cached) setSelectedOrder(cached);

    try {
      const fresh = await ordersService.getOrderById(orderId);
      setSelectedOrder(fresh);
    } catch (err: any) {
      if (!cached) {
        const msg = err.response?.data?.message || 'تعذر استرجاع تفاصيل هذا الطلب';
        setModalError(msg);
      }
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setModalError(null);
  };

  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'completed') return order.status === 'completed';
    if (statusFilter === 'pending') return order.status === 'pending';
    if (statusFilter === 'other') return ['cancelled', 'failed', 'refunded'].includes(order.status);
    return true;
  });

  return {
    orders: filteredOrders,
    rawOrders: orders,
    pagination,
    loading,
    error,
    currentPage,
    setCurrentPage,
    statusFilter,
    setStatusFilter,
    selectedOrder,
    modalLoading,
    modalError,
    viewOrderDetails,
    closeModal,
    refresh: () => fetchOrders(currentPage),
  };
}
