import api from '@/app/lib/api';
import { Order, OrdersResponse, OrdersPagination } from '../types/order.types';

export function normalizeBackendOrder(backendOrder: any): Order {
  if (!backendOrder) return {} as Order;
  const id = backendOrder._id || backendOrder.id || '';
  return {
    _id: id,
    id,
    user: backendOrder.user,
    items: Array.isArray(backendOrder.items)
      ? backendOrder.items.map((item: any) => ({
          _id: item._id,
          itemType: item.itemType || 'course',
          item: item.item,
          price: Number(item.price) || 0,
          title: item.title || (typeof item.item === 'object' && item.item?.title ? item.item.title : 'عنصر الطلب'),
        }))
      : [],
    totalAmount: Number(backendOrder.totalAmount) || 0,
    currency: backendOrder.currency || 'EGP',
    status: backendOrder.status || 'pending',
    paymentMethod: backendOrder.paymentMethod,
    paymentGateway: backendOrder.paymentGateway,
    transactionId: backendOrder.transactionId,
    paymentDetails: backendOrder.paymentDetails,
    couponCode: backendOrder.couponCode,
    discountAmount: backendOrder.discountAmount ? Number(backendOrder.discountAmount) : 0,
    createdAt: backendOrder.createdAt || new Date().toISOString(),
    updatedAt: backendOrder.updatedAt || new Date().toISOString(),
  };
}

export const ordersService = {
  /**
   * Get orders for the currently authenticated student
   */
  async getMyOrders(params?: { page?: number; limit?: number }): Promise<OrdersResponse> {
    const res = await api.get('/orders/my-orders', { params });
    const payload = res.data?.data;
    const rawOrders = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.orders)
      ? payload.orders
      : Array.isArray(payload)
      ? payload
      : [];

    const rawPagination = payload?.pagination || {};
    const total = rawPagination.total ?? rawOrders.length;
    const page = rawPagination.page ?? (params?.page || 1);
    const limit = rawPagination.limit ?? (params?.limit || 10);
    const pages = rawPagination.pages ?? (Math.ceil(total / limit) || 1);

    const pagination: OrdersPagination = {
      total,
      page,
      limit,
      pages,
      hasNext: rawPagination.hasNext ?? (page < pages),
      hasPrev: rawPagination.hasPrev ?? (page > 1),
    };

    return {
      orders: rawOrders.map(normalizeBackendOrder),
      pagination,
    };
  },

  /**
   * Get single order by ID with IDOR protection (returns 403 if unauthorized)
   */
  async getOrderById(orderId: string): Promise<Order> {
    const res = await api.get(`/orders/${orderId}`);
    const orderData = res.data?.data?.order || res.data?.data;
    return normalizeBackendOrder(orderData);
  },
};
