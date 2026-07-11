export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

export function formatCardExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 9);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  if (digits.length <= 7) return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
}

export function phoneToApi(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 9) return `+992${digits}`;
  if (digits.startsWith('992') && digits.length >= 12) return `+${digits.slice(0, 12)}`;
  return phone;
}

export type PaymentMethodType = 'online' | 'cod' | 'alif' | 'eskhata';

export function validateCheckoutForm(
  paymentMethod: PaymentMethodType,
  data: {
    shippingAddress: string;
    paymentPhone: string;
    cardNumber?: string;
    cardExpiry?: string;
    cardCvv?: string;
    cardHolder?: string;
  },
): string | null {
  if (!data.shippingAddress.trim()) return 'Суроғаи доставкаро ворид кунед';
  const phoneDigits = data.paymentPhone.replace(/\D/g, '');
  if (phoneDigits.length < 9) return 'Рақами телефонро пурра ворид кунед';

  if (paymentMethod === 'online') {
    if (!data.cardHolder?.trim()) return 'Номи соҳиби корт';
    if ((data.cardNumber?.replace(/\D/g, '').length || 0) < 16) return 'Рақами корт 16 рақам';
    if (!/^\d{2}\/\d{2}$/.test(data.cardExpiry || '')) return 'Мӯҳлат MM/YY';
    if ((data.cardCvv?.length || 0) < 3) return 'CVV-ро ворид кунед';
  }

  return null;
}

export const PAYMENT_LABELS: Record<PaymentMethodType, string> = {
  online: 'Корти бонкӣ',
  cod: 'Нақд (offline)',
  alif: 'Alif Mobi',
  eskhata: 'Эсхата Онлайн',
};
