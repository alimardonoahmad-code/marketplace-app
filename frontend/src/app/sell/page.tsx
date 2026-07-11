'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Store, Package, DollarSign, Eye, Clock, Sparkles,
  CheckCircle, ArrowRight, MapPin, TrendingUp, PlusCircle, ShoppingBag,
} from 'lucide-react';
import api, { formatPrice } from '@/lib/api';
import { useAuthStore, useAppStore } from '@/store/auth';
import { Product, Order } from '@/types';
import SellQuickActions, { type QuickAction } from '@/components/seller/SellQuickActions';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { isSeller, getApiErrorMessage, getLoginUrl, getRegisterUrl } from '@/lib/auth-utils';
import { getStoreLocation, getStoreName } from '@/lib/store-utils';
import { BRAND } from '@/lib/brand-theme';

const ACTION_GRADIENT = BRAND.gradient;

export default function SellHubPage() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const { setMode } = useAppStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [becomingSeller, setBecomingSeller] = useState(false);

  const handleBecomeSeller = async () => {
    setBecomingSeller(true);
    try {
      const res = await api.post('/users/become-seller');
      updateUser(res.data.data);
      toast.success('Шумо фурӯшанда шудед!');
      router.refresh();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Хатогӣ'));
    } finally {
      setBecomingSeller(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    if (user.role !== 'seller' && user.role !== 'admin') {
      setLoading(false);
      return;
    }
    Promise.all([
      api.get(`/products?sellerId=${user.id}&limit=50`),
      api.get('/orders/seller'),
    ]).then(([pRes, oRes]) => {
      setProducts(pRes.data.data.items);
      setOrders(oRes.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const totalRevenue = orders.reduce((s, o) => s + Number(o.totalPrice), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const approvedProducts = products.filter((p) => p.status === 'approved').length;

  const goShop = useCallback(() => { setMode('shop'); router.replace('/'); }, [setMode, router]);

  const quickActions: QuickAction[] = useMemo(() => [
    {
      id: 'add',
      href: '/seller/products/new',
      icon: PlusCircle,
      label: 'Илова',
      sub: 'Маҳсулоти нав',
      gradient: ACTION_GRADIENT,
      highlight: true,
    },
    {
      id: 'orders',
      href: '/seller/orders',
      icon: Package,
      label: 'Фармоиш',
      sub: `${pendingOrders} нав`,
      badge: pendingOrders,
      gradient: ACTION_GRADIENT,
    },
    {
      id: 'products',
      href: '/seller/products',
      icon: Eye,
      label: 'Маҳсулот',
      sub: `${products.length} адад`,
      gradient: ACTION_GRADIENT,
    },
    {
      id: 'store',
      href: '/seller/store',
      icon: Store,
      label: 'Мағоза',
      sub: 'Маълумот',
      gradient: ACTION_GRADIENT,
    },
    {
      id: 'analytics',
      href: '/seller/analytics',
      icon: TrendingUp,
      label: 'Analytics',
      sub: 'Статистика',
      gradient: ACTION_GRADIENT,
    },
    {
      id: 'shop',
      onClick: goShop,
      icon: ShoppingBag,
      label: 'Харид',
      sub: 'Режими харид',
      gradient: ACTION_GRADIENT,
    },
  ], [pendingOrders, products.length, goShop]);

  if (!user || !isSeller(user)) {
    return (
      <div className="app-container py-8">
        <div className="card p-8 text-center animate-scale-in">
          <div className="icon-box h-20 w-20 bg-gradient-gold text-white mx-auto shadow-float rounded-3xl">
            <Store className="h-10 w-10" />
          </div>
          <h1 className="text-xl font-black mt-6">{user ? 'Фурӯшанда шавед!' : 'Мағоза кушоед!'}</h1>
          <p className="text-text-secondary mt-2 text-sm">
            {user
              ? 'Ҳисоби шумо харидор аст. Барои фурӯш, ҳисоби фурӯшандаро фаъол созед — як клик!'
              : 'Барои фурӯш ва идоракунии мағоза, аввал ворид шавед ё бақайд гиред.'}
          </p>
          {user ? (
            <button type="button" onClick={handleBecomeSeller} disabled={becomingSeller} className="btn-accent mt-6 inline-flex">
              <Sparkles className="h-4 w-4" />
              {becomingSeller ? 'Фаъол мешавад...' : 'Фурӯшанда шавед'}
            </button>
          ) : (
            <>
              <Link href={getLoginUrl('/sell')} className="btn-primary mt-6 inline-flex">Ворид шавед</Link>
              <Link href={getRegisterUrl('/sell')} className="btn-outline-brand mt-3 inline-flex mx-auto">Бақайд гиред</Link>
            </>
          )}
          <button type="button" onClick={goShop} className="btn-ghost mt-4 text-sm block mx-auto">
            ← Ба режими харид
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: DollarSign, label: 'Даромад', value: formatPrice(totalRevenue), gradient: ACTION_GRADIENT },
    { icon: Package, label: 'Фармоиш', value: String(orders.length), gradient: ACTION_GRADIENT },
    { icon: Eye, label: 'Маҳсулот', value: String(approvedProducts), gradient: ACTION_GRADIENT },
    { icon: Clock, label: 'Интизор', value: String(pendingOrders), gradient: ACTION_GRADIENT },
  ];

  return (
    <div className="pb-6">
      {/* Hero */}
      <section className={clsx('relative overflow-hidden bg-gradient-to-br text-white', BRAND.heroLight)}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="app-container relative py-5 lg:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Store className="h-4 w-4" />
                <span className="text-xs font-bold text-white/80 tracking-wide">SELLER DASHBOARD</span>
              </div>
              <h1 className="text-xl lg:text-2xl font-black">{getStoreName(user)}</h1>
              {getStoreLocation(user) && (
                <p className="text-white/85 text-xs lg:text-sm mt-1 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0" /> {getStoreLocation(user)}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                <Link href="/seller/store" className="badge bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors">
                  Маълумоти мағоза
                </Link>
                <Link href={`/stores/${user.id}`} className="badge bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors">
                  Мағозаи ман →
                </Link>
              </div>
            </div>

            {/* Stats inline on desktop hero */}
            <div className="hidden lg:grid grid-cols-4 gap-2 shrink-0">
              {stats.map(({ icon: Icon, label, value, gradient }) => (
                <div key={label} className="bg-white/15 backdrop-blur-md rounded-xl px-4 py-3 text-center min-w-[5.5rem]">
                  <div className={clsx('icon-box h-8 w-8 bg-gradient-to-br mx-auto mb-1.5', gradient)}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm font-black">{value}</p>
                  <p className="text-[10px] text-white/70">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions — TOP, right after hero */}
      <div className="app-container -mt-3 lg:-mt-4 relative z-10 py-3 lg:py-4">
        <div className="lg:hidden mb-2">
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-wide">Амалҳои зуд</h2>
        </div>
        <SellQuickActions actions={quickActions} />
      </div>

      {/* Stats — mobile only (desktop stats in hero) */}
      <div className="app-container py-2 lg:hidden">
        <div className="grid grid-cols-2 gap-2">
          {stats.map(({ icon: Icon, label, value, gradient }) => (
            <div key={label} className="card p-3 flex items-center gap-3">
              <div className={clsx('icon-box h-10 w-10 bg-gradient-to-br shrink-0', gradient)}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-base font-black text-text dark:text-white">{value}</p>
                <p className="text-[10px] font-semibold text-text-muted">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content grid on desktop */}
      <div className="app-container py-4 grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">Фармоишҳои нав</h2>
            <Link href="/seller/orders" className="text-primary text-xs font-bold flex items-center gap-0.5">
              Ҳама <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="card h-16 shimmer-bg" />)}</div>
          ) : orders.length === 0 ? (
            <div className="card p-8 text-center">
              <Package className="h-10 w-10 text-text-muted mx-auto" />
              <p className="text-text-secondary mt-2 text-sm">Ҳоло фармоише нест</p>
              <Link href="/seller/products/new" className="btn-primary mt-4 inline-flex text-xs h-9">
                Маҳсулот илова кунед
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 5).map((order) => (
                <Link key={order.id} href={`/seller/orders`} className="card p-3 flex items-center justify-between card-hover">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={clsx('icon-box h-9 w-9 shrink-0',
                      order.status === 'pending' ? 'bg-warning-50 text-warning' :
                      order.status === 'delivered' ? 'bg-success-50 text-success' :
                      'bg-primary-50 text-primary',
                    )}>
                      {order.status === 'pending' ? <Clock className="h-4 w-4" /> :
                       order.status === 'delivered' ? <CheckCircle className="h-4 w-4" /> :
                       <Package className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">#{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-text-muted truncate">{order.user?.name}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="font-bold text-sm">{formatPrice(order.totalPrice)}</p>
                    <span className="badge-brand text-[9px] capitalize">{order.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Recent products */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">Маҳсулоти ман</h2>
            <Link href="/seller/products" className="text-primary text-xs font-bold flex items-center gap-0.5">
              Ҳама <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="card h-16 shimmer-bg" />)}</div>
          ) : products.length === 0 ? (
            <div className="card p-8 text-center">
              <Package className="h-10 w-10 text-text-muted mx-auto" />
              <p className="text-text-secondary mt-2 text-sm">Ҳанӯз маҳсулот нест</p>
              <Link href="/seller/products/new" className="btn-primary mt-4 inline-flex text-xs h-9">
                Аввалин маҳсулот илова кунед
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {products.slice(0, 5).map((product) => (
                <Link key={product.id} href={`/seller/products/${product.id}/edit`} className="card p-3 flex items-center gap-3 card-hover">
                  <div className="h-12 w-12 rounded-lg bg-surface-secondary shrink-0 overflow-hidden">
                    {product.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-text-muted">
                        <Package className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{product.name}</p>
                    <p className="text-xs text-text-muted">{formatPrice(product.price)} · {product.stock} дона</p>
                  </div>
                  <span className={clsx(
                    'badge text-[9px] shrink-0',
                    product.status === 'approved' ? 'bg-success-50 text-success' : 'bg-warning-50 text-warning',
                  )}>
                    {product.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
