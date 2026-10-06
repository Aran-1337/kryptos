export type OrderStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';

export interface OrderItem {
  _id?: string;
  itemType: 'course' | 'book';
  item: string | { _id: string; title?: string; thumbnail?: { url?: string }; slug?: string };
  price: number;
  title: string;
}

export interface Order {
  _id: string;
  id?: string;
  user: string | { _id: string; name?: string; email?: string };
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  paymentMethod?: string;
  paymentGateway?: string;
  transactionId?: string;
  paymentDetails?: Record<string, any>;
  couponCode?: string;
  discountAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: OrdersPagination;
}
