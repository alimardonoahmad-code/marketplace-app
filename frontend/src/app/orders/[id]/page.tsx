'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Truck, CheckCircle, MapPin, CreditCard, Smartphone, Hourglass, PackageCheck } from 'lucide-react';
import api, { formatPrice, getImageUrl } from '@/lib/api';
import { PAYMENT_LABELS } from '@/lib/payment';
import { Order } from '@/types';
import { useAuthStore } from '@/store/auth';
import AuthPrompt from '@/components/auth/AuthPrompt';
import { AppIcon } from '@/components/icons';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const steps = [
  { key: 'pending', label: 'Интизор', icon: 'pending' as const },
  { key: 'confirmed', label: 'Тасдиқ', icon: 'confirmed' as const },
  { key: 'packed', label: 'Банд', icon: 'package' as const },
  { key: 'shipped', label: 'Дар роҳ', icon: 'truck' as const },
  { key: 'delivered', label: 'Доставка', icon: 'delivered' as const },
];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    api.get(`/orders/${id}`).then((res) => setOrder(res.data.data)).catch(() => router.push('/orders')).finally(() => setLoading(false));
  }, [id, user, router]);

  if (!user) {
    return (
      <AuthPrompt
        title="Барои дидани фармоиш ворид шавед"
        description="Тафсилоти фармоиш танҳо барои корбари бақайдшуда."
        nextPath={`/orders/${id}`}
        icon="buy"
      />
    );
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full" /></div>;
  if (!order) return null;

  const currentStep = steps.findIndex((s) => s.key === order.status);

  const cancelOrder = async () => {
    if (!confirm('Фармоишро бекор кунед?')) return;
    try {
      await api.put(`/orders/${id}/cancel`);
      toast.success('Бекор шуд');
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.data);
    } catch {
      toast.error('Хатогӣ');
    }
  };

  return (
    <div className="app-container py-4">
      <button onClick={() => router.back()} className="icon-box h-10 w-10 bg-white shadow-soft mb-4">
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="card p-5 mb-4 bg-gradient-to-br from-brand-500 to-purple-600 text-white shadow-float">
        <p className="text-white/70 text-xs font-bold uppercase">Фармоиш</p>
        <h1 className="text-2xl font-black mt-1">#{order.id.slice(0, 8)}</h1>
        <p className="text-white/80 text-sm mt-1">{new Date(order.createdAt).toLocaleString('tg-TJ')}</p>
        <p className="text-2xl font-black mt-3">{formatPrice(order.totalPrice)}</p>
      </div>

      {order.status !== 'cancelled' && (
        <div className="card p-5 mb-4 animate-fade-up">
          <h2 className="section-title flex items-center gap-2 mb-5"><Truck className="h-5 w-5 text-brand-600" /> Tracking</h2>
          <div className="flex justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-100 rounded-full mx-8" />
            <div
              className="absolute top-5 left-0 h-1 bg-gradient-brand rounded-full mx-8 transition-all duration-500"
              style={{ width: currentStep >= 0 ? `${(currentStep / (steps.length - 1)) * 100}%` : '0%' }}
            />
            {steps.map((step, i) => (
              <div key={step.key} className="flex flex-col items-center relative z-10 flex-1">
                <div className={clsx('icon-box h-10 w-10 rounded-full border-2',
                  i <= currentStep ? 'bg-gradient-brand text-white border-brand-400 shadow-glow' : 'bg-white border-gray-200 text-gray-400'
                )}>
                  {i < currentStep
                    ? <CheckCircle className="h-5 w-5" />
                    : <AppIcon name={step.icon} size="sm" variant="inherit" className={i <= currentStep ? 'text-white' : 'text-gray-400'} aria-hidden />}
                </div>
                <span className="text-[10px] font-bold mt-2 text-center">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {order.status === 'pending' && order.userId === user?.id && (
        <button type="button" onClick={cancelOrder} className="btn-danger w-full mb-4">
          Фармоишро бекор кардан
        </button>
      )}

      <div className="card p-4 mb-4 space-y-3">
        <h2 className="font-extrabold text-sm">Маҳсулот</h2>
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-3 items-center">
            <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-brand-50 shrink-0">
              <Image src={getImageUrl(item.product?.images?.[0])} alt="" fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{item.product?.name}</p>
              <p className="text-xs text-gray-500">×{item.quantity}</p>
            </div>
            <p className="font-black text-sm">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div className="card p-4 flex gap-3">
          <MapPin className="h-5 w-5 text-brand-600 shrink-0" />
          <div><p className="text-xs font-bold text-gray-500">Суроға</p><p className="text-sm mt-0.5">{order.shippingAddress}</p></div>
        </div>
        <div className="card p-4 flex gap-3">
          <CreditCard className="h-5 w-5 text-brand-600 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-500">Пардохт</p>
            <p className="text-sm mt-0.5 font-semibold">
              {PAYMENT_LABELS[order.paymentMethod as keyof typeof PAYMENT_LABELS]
                || (order.paymentMethod === 'cod' ? 'Offline — нақд ҳангоми гирифтан' : order.paymentMethod)}
            </p>
            {order.discountAmount && Number(order.discountAmount) > 0 && (
              <p className="text-xs text-success mt-1">Промокод {order.couponCode}: -{formatPrice(order.discountAmount)}</p>
            )}
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              {order.paymentStatus === 'paid'
                ? <><PackageCheck className="h-3 w-3 text-success" /> Пардохт шуд</>
                : <><Hourglass className="h-3 w-3" /> Интизори пардохт</>}
            </p>
            {order.paymentPhone && (
              <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                <Smartphone className="h-3 w-3" /> {order.paymentPhone}
              </p>
            )}
            {order.cardLast4 && (
              <p className="text-xs text-gray-600 mt-0.5">Корт •••• {order.cardLast4}</p>
            )}
            {order.paymentReference && (
              <p className="text-[10px] text-gray-400 mt-0.5">ID: {order.paymentReference}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
