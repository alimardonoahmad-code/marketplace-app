'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Package, ArrowLeft, Phone, Clock, BadgeCheck, Mail } from 'lucide-react';
import api from '@/lib/api';
import { Product, Store } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import StoreMiniMap from '@/components/stores/StoreMiniMap';
import { getStoreCoords, getStoreLocation, getStoreName } from '@/lib/store-utils';
import toast from 'react-hot-toast';
import { useAuthStore, useCartStore } from '@/store/auth';
import { getLoginUrl } from '@/lib/auth-utils';

export default function StorePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { setItemCount } = useCartStore();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapExpanded, setMapExpanded] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get(`/users/stores/${id}`),
      api.get(`/products?sellerId=${id}&limit=48&sortBy=createdAt&sortOrder=DESC`),
    ]).then(([storeRes, productsRes]) => {
      setStore(storeRes.data.data);
      setProducts(productsRes.data.data.items);
    }).catch(() => {
      toast.error('Мағоза ёфт нашуд');
      router.push('/stores');
    }).finally(() => setLoading(false));
  }, [id, router]);

  const handleScroll = useCallback(() => {
    if (window.scrollY > 260) {
      setMapExpanded(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      toast.error('Барои харид ворид шавед');
      router.push(getLoginUrl('/cart'));
      return;
    }
    try {
      const res = await api.post('/cart', { productId: product.id, quantity: 1 });
      setItemCount(res.data.data.itemCount);
      toast.success('Ба сабад илова шуд!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Хатогӣ');
    }
  };

  if (loading) {
    return (
      <div className="app-container py-4">
        <div className="card h-32 shimmer-bg mb-4" />
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="card aspect-[3/4] shimmer-bg" />)}
        </div>
      </div>
    );
  }

  if (!store) return null;

  const name = getStoreName(store);
  const location = getStoreLocation(store);
  const coords = getStoreCoords(store);

  return (
    <div className="pb-4 bg-[#F5F7FA] dark:bg-surface-dark min-h-screen">
      <div className="app-container pt-3">
        <Link href="/stores" className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-primary mb-3">
          <ArrowLeft className="h-4 w-4" /> Ҳамаи мағозаҳо
        </Link>

        {coords && mapExpanded && (
          <div className="mb-3">
            <StoreMiniMap
              lat={coords.lat}
              lng={coords.lng}
              label={name}
              height={220}
              zoom={16}
              mode="hero"
              onMinimize={() => setMapExpanded(false)}
            />
          </div>
        )}

        {coords && !mapExpanded && (
          <StoreMiniMap
            lat={coords.lat}
            lng={coords.lng}
            label={name}
            zoom={16}
            mode="floating"
            onExpand={() => {
              setMapExpanded(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        <div className="rounded-2xl bg-white dark:bg-surface-dark-secondary border border-[#E8ECF2] dark:border-border-dark overflow-hidden shadow-[0_2px_12px_rgba(0,26,52,0.06)]">
          <div className="bg-gradient-to-r from-primary to-[#0047CC] p-5 text-white">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black shrink-0">
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge bg-white/20 text-white text-[10px]">Интернет-магоза</span>
                  <span className="badge bg-emerald-500/30 text-white text-[10px] inline-flex items-center gap-1">
                    <BadgeCheck className="h-3 w-3" /> Верификатсияшуда
                  </span>
                </div>
                <h1 className="text-xl font-black mt-1">{name}</h1>
                {location && (
                  <p className="flex items-center gap-1 text-sm text-white/85 mt-1">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>{location}</span>
                  </p>
                )}
                {store.storeDescription && (
                  <p className="text-sm text-white/75 mt-2 line-clamp-2">{store.storeDescription}</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-[#E8ECF2] dark:border-border-dark">
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-primary shrink-0" />
              <span className="font-semibold">{store.productCount ?? products.length} маҳсулот</span>
            </div>
            {store.phone && (
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href={`tel:${store.phone}`} className="hover:text-primary truncate">{store.phone}</a>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Clock className="h-4 w-4 text-primary shrink-0" />
              <span>09:00 – 21:00</span>
            </div>
            {store.email && (
              <div className="flex items-center gap-2 text-sm text-text-secondary min-w-0 col-span-2 sm:col-span-1">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate">{store.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="app-container py-4">
        <h2 className="section-title mb-3">Маҳсулоти мағоза</h2>
        {products.length === 0 ? (
          <div className="rounded-2xl bg-white dark:bg-surface-dark-secondary border border-[#E8ECF2] p-10 text-center text-text-secondary text-sm">
            Дар ин мағоза ҳанӯз маҳсулот нест
          </div>
        ) : (
          <div className="ozon-product-grid">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} variant="ozon" onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
