import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface CardPaymentInput {
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardHolder: string;
  amount: number;
}

export interface CardPaymentResult {
  last4: string;
  reference: string;
  currency: 'TJS';
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 9) return `+992${digits}`;
  if (digits.length === 12 && digits.startsWith('992')) return `+${digits}`;
  if (digits.length === 11 && digits.startsWith('992')) return `+${digits}`;
  throw new BadRequestException('Рақами телефон нодуруст аст (+992 XX XXX XX XX)');
}

export function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let n = parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function processCardPayment(input: CardPaymentInput): CardPaymentResult {
  const cardNumber = input.cardNumber.replace(/\s/g, '');
  const expiry = input.cardExpiry.replace(/\s/g, '');
  const cvv = input.cardCvv.replace(/\D/g, '');

  if (!luhnCheck(cardNumber)) {
    throw new BadRequestException('Рақами корт нодуруст аст');
  }

  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    throw new BadRequestException('Мӯҳлати корт: MM/YY');
  }

  const [mm, yy] = expiry.split('/').map(Number);
  if (mm < 1 || mm > 12) {
    throw new BadRequestException('Моҳи корт нодуруст аст');
  }

  const now = new Date();
  const expYear = 2000 + yy;
  const expDate = new Date(expYear, mm);
  if (expDate <= now) {
    throw new BadRequestException('Мӯҳлати корт гузаштааст');
  }

  if (cvv.length < 3 || cvv.length > 4) {
    throw new BadRequestException('CVV нодуруст аст');
  }

  if (!input.cardHolder.trim() || input.cardHolder.trim().length < 3) {
    throw new BadRequestException('Номи соҳиби кортро ворид кунед');
  }

  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new BadRequestException('Маблағи пардохт нодуруст аст');
  }

  return {
    last4: cardNumber.slice(-4),
    reference: `TJS-${uuidv4().slice(0, 12).toUpperCase()}`,
    currency: 'TJS',
  };
}
