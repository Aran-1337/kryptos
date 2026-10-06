export type BookOrderStatus = 'pending' | 'shipped' | 'delivered';

export type BooksTabType = 'orders' | 'gifts' | 'books';

export interface BookOrder {
  id: string;
  studentName: string;
  phone: string;
  governorate: string;
  address: string;
  bookTitle: string;
  copyType: string;
  price: number;
  shippingFee: number;
  total: number;
  trackingNumber?: string;
  status: BookOrderStatus;
  date: string;
}

export interface GiftOrder {
  id: string;
  questTitle: string;
  giftName: string;
  studentName: string;
  phone: string;
  governorate: string;
  address: string;
  date: string;
  status: string;
}

export interface Book {
  id: string;
  title: string;
  type: string;
  price: number;
  originalPrice: number;
  stock: number;
  pdfUrl?: string;
  salesCount: number;
}

export interface BookFormData {
  title: string;
  type: string;
  price: string;
  originalPrice: string;
  stock: string;
}
