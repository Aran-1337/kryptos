import { BookOrder, BookOrderStatus } from '../types/book.types';

export function getWhatsAppMessageUrl(ord: BookOrder): string {
  const statusText =
    ord.status === 'delivered'
      ? 'تم التوصيل للعميل بنجاح ✅'
      : ord.status === 'shipped'
      ? 'تم التسليم لشركة الشحن 🚚'
      : 'قيد التحضير 📦';

  const text = `أهلاً يا ${ord.studentName} 👋، تم تحديث حالة شحن طلبك [${ord.bookTitle}] إلى: ${statusText}.\nيمكنك متابعة الشحنة دائماً عبر حسابك في منصة م. عبدالرحمن حامد.`;
  return `https://wa.me/20${ord.phone.replace(/^0/, '')}?text=${encodeURIComponent(text)}`;
}

export function getOrderStatusBadgeInfo(status: BookOrderStatus): { text: string; bg: string; color: string } {
  switch (status) {
    case 'delivered':
      return { text: 'تم التوصيل ✅', bg: 'rgba(16,185,129,0.15)', color: '#10b981' };
    case 'shipped':
      return { text: 'تم الشحن 🚚', bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' };
    case 'pending':
    default:
      return { text: 'قيد التحضير 📦', bg: 'rgba(245,158,11,0.15)', color: '#d97706' };
  }
}
