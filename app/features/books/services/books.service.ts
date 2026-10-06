import { BookOrder, GiftOrder, Book, BookFormData, BookOrderStatus } from '../types/book.types';
import { initialBookOrders, initialGiftOrders, initialBooks } from '../mocks/book.mock';

const PHYSICAL_GIFTS_KEY = 'physical_gift_orders';
const CREATED_BOOKS_KEY = 'admin_created_books';
const BOOK_ORDERS_KEY = 'admin_book_orders';

export const booksService = {
  getBookOrders(): BookOrder[] {
    if (typeof window === 'undefined') return [...initialBookOrders];
    try {
      const saved = localStorage.getItem(BOOK_ORDERS_KEY);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(BOOK_ORDERS_KEY, JSON.stringify(initialBookOrders));
    } catch (e) {
      console.error('Failed to load book orders:', e);
    }
    return [...initialBookOrders];
  },

  saveBookOrders(orders: BookOrder[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(BOOK_ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save book orders:', e);
    }
  },

  updateOrderStatus(orders: BookOrder[], orderId: string, status: BookOrderStatus): BookOrder[] {
    const updated = orders.map(o => (o.id === orderId ? { ...o, status } : o));
    this.saveBookOrders(updated);
    return updated;
  },

  getGiftOrders(): GiftOrder[] {
    if (typeof window === 'undefined') return [...initialGiftOrders];
    try {
      const saved = localStorage.getItem(PHYSICAL_GIFTS_KEY);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(PHYSICAL_GIFTS_KEY, JSON.stringify(initialGiftOrders));
    } catch (e) {
      console.error('Failed to load gift orders:', e);
    }
    return [...initialGiftOrders];
  },

  saveGiftOrders(gifts: GiftOrder[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PHYSICAL_GIFTS_KEY, JSON.stringify(gifts));
    } catch (e) {
      console.error('Failed to save gift orders:', e);
    }
  },

  updateGiftStatus(gifts: GiftOrder[], giftId: string, status: string): GiftOrder[] {
    const updated = gifts.map(g => (g.id === giftId ? { ...g, status } : g));
    this.saveGiftOrders(updated);
    return updated;
  },

  getBooks(): Book[] {
    if (typeof window === 'undefined') return [...initialBooks];
    try {
      const saved = localStorage.getItem(CREATED_BOOKS_KEY);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(CREATED_BOOKS_KEY, JSON.stringify(initialBooks));
    } catch (e) {
      console.error('Failed to load books:', e);
    }
    return [...initialBooks];
  },

  saveBooks(books: Book[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(CREATED_BOOKS_KEY, JSON.stringify(books));
    } catch (e) {
      console.error('Failed to save books:', e);
    }
  },

  createBook(books: Book[], formData: BookFormData): { updatedBooks: Book[]; newBook: Book } {
    const newBook: Book = {
      id: 'b-' + (books.length + 1),
      title: formData.title,
      type: formData.type,
      price: Number(formData.price) || 150,
      originalPrice: Number(formData.originalPrice) || 200,
      stock: Number(formData.stock) || 50,
      pdfUrl: '/memento1.pdf',
      salesCount: 0,
    };
    const updatedBooks = [...books, newBook];
    this.saveBooks(updatedBooks);
    return { updatedBooks, newBook };
  },
};
