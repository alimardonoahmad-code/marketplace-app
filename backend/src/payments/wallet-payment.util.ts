import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type WalletProvider = 'alif' | 'eskhata';

export function normalizeWalletPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 9) return `+992${digits}`;
  if (digits.startsWith('992') && digits.length >= 12) return `+${digits.slice(0, 12)}`;
  throw new BadRequestException('Рақами телефон нодуруст');
}

export function processWalletPayment(
  provider: WalletProvider,
  phone: string,
  amount: number,
) {
  const normalized = normalizeWalletPhone(phone);
  if (amount <= 0) {
    throw new BadRequestException('Маблағи пардохт нодуруст');
  }

  const prefix = provider === 'alif' ? 'ALF' : 'ESK';
  return {
    provider,
    phone: normalized,
    amount,
    currency: 'TJS',
    reference: `${prefix}_${uuidv4().slice(0, 12).toUpperCase()}`,
    status: 'paid' as const,
  };
}
