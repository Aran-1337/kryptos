import { BookOrder, GiftOrder, Book } from '../types/book.types';

export const initialBookOrders: BookOrder[] = [
  {
    id: 'ORD-9841',
    studentName: 'أحمد محمود العبد',
    phone: '01012345678',
    governorate: 'القاهرة',
    address: 'مدينة نصر - الشارع التاني - عمارة 14',
    bookTitle: 'مذكرة الشامل في البرمجة والذكاء الاصطناعي (أولى ثانوي)',
    copyType: 'مطبوع (ورقي)',
    price: 150,
    shippingFee: 40,
    total: 190,
    trackingNumber: 'TRK-Cairo-4812',
    status: 'shipped',
    date: '06 أغسطس 2026',
  },
  {
    id: 'ORD-9842',
    studentName: 'سارة خالد السيد',
    phone: '01298765432',
    governorate: 'الإسكندرية',
    address: 'سموحة - ش 15 مايو - برج السلام',
    bookTitle: 'كتاب الخوارزميات وتطبيقات بايثون (ثانية ثانوي)',
    copyType: 'مطبوع (ورقي)',
    price: 180,
    shippingFee: 50,
    total: 230,
    trackingNumber: 'TRK-Alex-1092',
    status: 'pending',
    date: '06 أغسطس 2026',
  },
];

export const initialGiftOrders: GiftOrder[] = [
  {
    id: 'GIFT-1002',
    questTitle: 'وسام المتفوق البرمجي',
    giftName: 'مجموعة المذكرات الورقية المطبوعة + ميدالية التفوق البرمجي 🏅',
    studentName: 'أحمد محمود السيد',
    phone: '01012345678',
    governorate: 'القاهرة',
    address: 'مدينة نصر - الشارع المصطفى - عمارة 18',
    date: '08 أغسطس 2026',
    status: 'قيد الشحن',
  },
];

export const initialBooks: Book[] = [
  {
    id: 'b-1',
    title: 'مذكرة الشامل في البرمجة والذكاء الاصطناعي (أولى ثانوي)',
    type: 'مطبوع ورقي + PDF',
    price: 150,
    originalPrice: 200,
    stock: 45,
    pdfUrl: '/memento1.pdf',
    salesCount: 128,
  },
  {
    id: 'b-2',
    title: 'كتاب الخوارزميات وتطبيقات بايثون (ثانية ثانوي)',
    type: 'مطبوع ورقي',
    price: 180,
    originalPrice: 240,
    stock: 30,
    pdfUrl: '',
    salesCount: 94,
  },
];
