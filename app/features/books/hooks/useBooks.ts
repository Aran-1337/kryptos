'use client';
import { useState, useEffect } from 'react';
import { Book, BookOrder, GiftOrder, BookOrderStatus, BooksTabType, BookFormData } from '../types/book.types';
import { booksService } from '../services/books.service';

export function useBooks() {
  const [activeTab, setActiveTab] = useState<BooksTabType>('orders');
  const [orders, setOrders] = useState<BookOrder[]>([]);
  const [giftOrders, setGiftOrders] = useState<GiftOrder[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  // Modals state
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<BookOrder | null>(null);

  // New Book Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('مطبوع ورقي + PDF');
  const [newPrice, setNewPrice] = useState('150');
  const [newOriginalPrice, setNewOriginalPrice] = useState('200');
  const [newStock, setNewStock] = useState('50');
  const [toastMsg, setToastMsg] = useState('');

  // Load on mount
  useEffect(() => {
    setOrders(booksService.getBookOrders());
    setGiftOrders(booksService.getGiftOrders());
    setBooks(booksService.getBooks());
  }, []);

  const handleUpdateGiftStatus = (id: string, status: string) => {
    const updated = booksService.updateGiftStatus(giftOrders, id, status);
    setGiftOrders(updated);
  };

  const handleUpdateOrderStatus = (status: BookOrderStatus) => {
    if (!selectedOrder) return;
    const updated = booksService.updateOrderStatus(orders, selectedOrder.id, status);
    setOrders(updated);
    setShowTrackModal(false);
  };

  const handleAddBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const formData: BookFormData = {
      title: newTitle,
      type: newType,
      price: newPrice,
      originalPrice: newOriginalPrice,
      stock: newStock,
    };

    const { updatedBooks } = booksService.createBook(books, formData);
    setBooks(updatedBooks);
    setShowAddBookModal(false);
    setNewTitle('');
    setActiveTab('books');
    setToastMsg('✅ تم إضافة الكتاب/المذكرة بنجاح إلى القائمة والمكتبة!');
    setTimeout(() => setToastMsg(''), 3500);
  };

  const openTrackModal = (ord: BookOrder) => {
    setSelectedOrder(ord);
    setShowTrackModal(true);
  };

  const openAddBookModal = () => {
    setShowAddBookModal(true);
  };

  return {
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
    setSelectedOrder,
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
  };
}
