'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CreditCard, Smartphone, MapPin, ShoppingBag, ShieldCheck, Banknote, Lock, Tag, Wallet,
} from 'lucide-react';
import api, { formatPrice } from '@/lib/api';
import {
  formatCardExpiry, formatCardNumber, formatPhone, phoneToApi, validateCheckoutForm,
  type PaymentMethodType, PAYMENT_LABELS,
} from '@/lib/payment';
import { Cart } from '@/types';
import { useAuthStore } from '@/store/auth';
import AuthPrompt from '@/components/auth/AuthPrompt';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    shippingAddress: '',
    paymentMethod: 'online' as PaymentMethodType,
    paymentPhone: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardHolder: '',
    couponCode: '',
  });
  const [couponApplied, setCouponApplied] = useState<{ code: string; discount: number } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    setForm((f) => ({
      ...f,
      shippingAddress: user.address || f.shippingAddress,
      paymentPhone: user.phone ? formatPhone(user.phone.replace(/^\+992/, '')) : f.paymentPhone,
    }));
    api.get('/cart').then((res) => {
      if (!res.data.data.items.length) { router.push('/cart'); return; }
      setCart(res.data.data);
    }).finally(() => setLoading(false));
  }, [user, router]);

  const applyCoupon = async () => {
    if (!form.couponCode.trim() || !cart) return;
    setCouponLoading(true);
    try {
      const res = await api.post('/coupons/validate', {
        code: form.couponCode.trim(),
        cartTotal: cart.total,
      });
      setCouponApplied({ code: res.data.data.code, discount: res.data.data.discount });
      toast.success(`Промокод қабул шуд: -${formatPrice(res.data.data.discount)}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Промокод нодуруст');
      setCouponApplied(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const finalTotal = cart ? Math.max(0, cart.total - (couponApplied?.discount || 0)) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateCheckoutForm(form.paymentMethod, form);
    if (err) { toast.error(err); return; }

    setSubmitting(true);
    try {
      const payload = {
        shippingAddress: form.shippingAddress.trim(),
        paymentMethod: form.paymentMethod,
        paymentPhone: phoneToApi(form.paymentPhone),
        ...(couponApplied ? { couponCode: couponApplied.code } : {}),
        ...(form.paymentMethod === 'online' ? {
          cardNumber: form.cardNumber.replace(/\s/g, ''),
          cardExpiry: form.cardExpiry,
          cardCvv: form.cardCvv,
          cardHolder: form.cardHolder.trim(),
        } : {}),
      };

      const res = await api.post('/orders', payload);
      toast.success(
        form.paymentMethod === 'cod'
          ? 'Фармоиш сабт шуд — пардохт offline'
          : `Пардохт бо ${PAYMENT_LABELS[form.paymentMethod]} қабул шуд!`,
      );
      router.push(`/orders/${res.data.data.id}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string | string[] } } };
      const msg = error.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : msg || 'Хатогӣ');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <AuthPrompt
        title="Барои харид ворид шавед"
        description="Барои анҷом додани фармоиш, лутфан ворид шавед ё бақайд гиред."
        nextPath="/checkout"
        icon="buy"
      />
    );
  }

  if (loading || !cart) {
    return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="app-container py-4 max-w-lg mx-auto">
      <h1 className="text-xl font-black mb-2 flex items-center gap-2">
        <ShoppingBag className="h-5 w-5 text-primary" /> Харид
      </h1>
      <p className="text-xs text-text-muted mb-5">Пардохт бо сомонӣ (TJS) — онлайн ё offline</p>

      <div className="flex gap-2 mb-5">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={clsx(
              'h-1 flex-1 rounded-full transition-colors',
              step >= s ? 'bg-primary' : 'bg-border',
            )}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <>
            <div className="card p-4">
              <label className="text-xs font-bold text-text-muted uppercase flex items-center gap-1.5 mb-2">
                <MapPin className="h-3.5 w-3.5" /> Суроғаи доставка
              </label>
              <textarea
                value={form.shippingAddress}
                onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                className="input"
                rows={3}
                placeholder="Шаҳр, кӯча, хона..."
                required
              />
            </div>

            <div className="card p-4">
              <label className="text-xs font-bold text-text-muted uppercase mb-3 block">Усули пардохт</label>
              <div className="grid grid-cols-2 gap-2.5">
                {([
                  { id: 'online' as const, icon: CreditCard, title: 'Корт', sub: 'Visa / Mastercard' },
                  { id: 'alif' as const, icon: Wallet, title: 'Alif Mobi', sub: 'Ҳамёни мобилӣ' },
                  { id: 'eskhata' as const, icon: Smartphone, title: 'Эсхата', sub: 'Эсхата Онлайн' },
                  { id: 'cod' as const, icon: Banknote, title: 'Offline', sub: 'Нақд ҳангоми гирифтан' },
                ]).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setForm({ ...form, paymentMethod: m.id })}
                    className={clsx(
                      'p-3 rounded-xl border-2 text-left transition-all',
                      form.paymentMethod === m.id
                        ? 'border-primary bg-primary/5 shadow-soft'
                        : 'border-border hover:border-primary/30',
                    )}
                  >
                    <m.icon className={clsx('h-5 w-5 mb-1.5', form.paymentMethod === m.id ? 'text-primary' : 'text-text-muted')} />
                    <p className="font-bold text-xs">{m.title}</p>
                    <p className="text-[10px] text-text-muted">{m.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!form.shippingAddress.trim()) { toast.error('Суроға ворид кунед'); return; }
                setStep(2);
              }}
              className="btn-primary w-full py-3.5"
            >
              Идома — пардохт
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="card p-4 space-y-3">
              <label className="text-xs font-bold text-text-muted uppercase flex items-center gap-1.5">
                <Smartphone className="h-3.5 w-3.5" /> Рақами телефон
              </label>
              <div className="flex gap-2">
                <span className="input flex items-center px-3 bg-surface-secondary text-sm font-semibold shrink-0 w-16">+992</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={form.paymentPhone}
                  onChange={(e) => setForm({ ...form, paymentPhone: formatPhone(e.target.value) })}
                  className="input flex-1"
                  placeholder="90 123 45 67"
                  required
                />
              </div>
              <p className="text-[10px] text-text-muted">Барои тасдиқи фармоиш ва пардохт</p>
            </div>

            {form.paymentMethod === 'online' && (
              <div className="card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-text-muted uppercase flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5" /> Корти бонкӣ
                  </label>
                  <span className="text-[10px] font-bold text-primary">TJS · сомонӣ</span>
                </div>

                <input
                  type="text"
                  value={form.cardHolder}
                  onChange={(e) => setForm({ ...form, cardHolder: e.target.value.toUpperCase() })}
                  className="input"
                  placeholder="Номи соҳиби корт"
                  autoComplete="cc-name"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.cardNumber}
                  onChange={(e) => setForm({ ...form, cardNumber: formatCardNumber(e.target.value) })}
                  className="input font-mono tracking-wider"
                  placeholder="0000 0000 0000 0000"
                  autoComplete="cc-number"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.cardExpiry}
                    onChange={(e) => setForm({ ...form, cardExpiry: formatCardExpiry(e.target.value) })}
                    className="input font-mono"
                    placeholder="MM/YY"
                    autoComplete="cc-exp"
                  />
                  <input
                    type="password"
                    inputMode="numeric"
                    value={form.cardCvv}
                    onChange={(e) => setForm({ ...form, cardCvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    className="input font-mono"
                    placeholder="CVV"
                    autoComplete="cc-csc"
                  />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                  <Lock className="h-3 w-3 text-emerald-600" />
                  Маълумоти корт бехатар — танҳо 4 рақами охирин нигоҳ дошта мешавад
                </div>
              </div>
            )}

            {form.paymentMethod === 'cod' && (
              <div className="card p-4 bg-amber-50 border-amber-100">
                <p className="text-xs text-amber-900 leading-relaxed">
                  <strong>Offline пардохт:</strong> Шумо ҳангоми гирифтани мол бо нақд (сомонӣ) пардохт мекунед.
                </p>
              </div>
            )}

            {(form.paymentMethod === 'alif' || form.paymentMethod === 'eskhata') && (
              <div className="card p-4 bg-emerald-50 border-emerald-100">
                <p className="text-xs text-emerald-900 leading-relaxed">
                  <strong>{PAYMENT_LABELS[form.paymentMethod]}:</strong> Пас аз тасдиқ, дархост ба ҳамёни мобилии шумо мефиристем.
                  Рақами телефон бояд ба ҳамёни {form.paymentMethod === 'alif' ? 'Alif Mobi' : 'Эсхата'} вобаста бошад.
                </p>
              </div>
            )}

            <div className="card p-4">
              <label className="text-xs font-bold text-text-muted uppercase flex items-center gap-1.5 mb-2">
                <Tag className="h-3.5 w-3.5" /> Промокод
              </label>
              <div className="flex gap-2">
                <input
                  value={form.couponCode}
                  onChange={(e) => setForm({ ...form, couponCode: e.target.value.toUpperCase() })}
                  className="input flex-1 font-mono"
                  placeholder="SALE10, WELCOME50..."
                />
                <button type="button" onClick={applyCoupon} disabled={couponLoading} className="btn-outline-brand px-4 shrink-0">
                  {couponLoading ? '...' : 'Қабул'}
                </button>
              </div>
              {couponApplied && (
                <p className="text-xs text-success font-semibold mt-2">
                  {couponApplied.code} — тахфиф {formatPrice(couponApplied.discount)}
                </p>
              )}
            </div>

            <div className="card p-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between py-2 text-sm border-b border-border/50 last:border-0">
                  <span className="text-text-secondary line-clamp-1 flex-1 mr-2">{item.product.name} ×{item.quantity}</span>
                  <span className="font-bold shrink-0">{formatPrice(Number(item.product.discountPrice || item.product.price) * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between font-black text-lg pt-3 mt-2 border-t border-border">
                <span>Умумӣ</span>
                <span className="text-primary">{formatPrice(finalTotal)}</span>
              </div>
              {couponApplied && (
                <p className="text-[10px] text-success text-right mt-1">
                  Тахфиф: -{formatPrice(couponApplied.discount)}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-text-muted justify-center">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Пардохти бехатар · стандартҳои байналмилалӣ
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3.5">
                Бозгашт
              </button>
              <button type="submit" disabled={submitting} className="btn-primary flex-[2] py-3.5">
                {submitting ? 'Кор карда истодааст...' : `Пардохт — ${formatPrice(finalTotal)}`}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
