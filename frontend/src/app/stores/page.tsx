'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Store, MapPin, Sparkles, ArrowRight, ChevronRight,
  Package, BadgeCheck,
} from 'lucide-react';
import clsx from 'clsx';
import api from '@/lib/api';
import { Store as StoreType } from '@/types';
import StoreCard from '@/components/stores/StoreCard';
import SellerStepPromos from '@/components/stores/SellerStepPromos';
import { getStoreCitiesFromData } from '@/lib/store-search';

function StoresPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const cityFilter = searchParams.get('city') || '';

  const [stores, setStores] = useState<StoreType[]>([]);
  const [allCities, setAllCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/stores')
      .then((res) => setAllCities(getStoreCitiesFromData(Array.isArray(res.data.data) ? res.data.data : [])))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (cityFilter.trim()) params.set('city', cityFilter.trim());
    const qs = params.toString();

    setLoading(true);
    api.get(`/users/stores${qs ? `?${qs}` : ''}`)
      .then((res) => setStores(Array.isArray(res.data.data) ? res.data.data : []))
      .catch(() => setStores([]))
      .finally(() => setLoading(false));
  }, [search, cityFilter]);

  const totalProducts = useMemo(
    () => stores.reduce((s, st) => s + (st.productCount ?? 0), 0),
    [stores],
  );

  const citiesInData = allCities;

  const syncParams = (next: { search?: string; city?: string }) => {
    const params = new URLSearchParams();
    const q = next.search ?? search;
    const city = next.city ?? cityFilter;
    if (q.trim()) params.set('search', q.trim());
    if (city.trim()) params.set('city', city.trim());
    const qs = params.toString();
    router.replace(qs ? `/stores?${qs}` : '/stores');
  };

  return (
    <div className="pb-8 bg-[#F5F7FA] dark:bg-surface-dark min-h-screen">
      <section className="ozon-promo-bar">
        <div className="app-container relative py-6 lg:py-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge bg-white/20 text-white text-[10px] font-bold tracking-wider">
                MARKET STORES
              </span>
            </div>
            <h1 className="text-2xl lg:text-4xl font-black leading-tight">
              Мағозаҳои онлайн
            </h1>
            <p className="text-white/80 text-sm lg:text-base mt-3 max-w-lg leading-relaxed">
              Ҳар мағоза — интернет-магозини алоҳида дар кӯчаи шумо.
              Ҷустуҷӯро дар боло истифода баред — ном, шаҳр ё суроға.
            </p>

            {!loading && stores.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                <span className="badge bg-white/20 text-white backdrop-blur-sm flex items-center gap-1">
                  <Store className="h-3 w-3" /> {stores.length} мағоза
                </span>
                <span className="badge bg-white/20 text-white backdrop-blur-sm flex items-center gap-1">
                  <Package className="h-3 w-3" /> {totalProducts}+ маҳсулот
                </span>
                <span className="badge bg-white/20 text-white backdrop-blur-sm flex items-center gap-1">
                  <BadgeCheck className="h-3 w-3" /> Верификатсияшуда
                </span>
              </div>
            )}

            {citiesInData.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => syncParams({ city: '' })}
                  className={clsx(
                    'px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                    !cityFilter ? 'bg-white text-primary' : 'bg-white/15 text-white hover:bg-white/25',
                  )}
                >
                  Ҳама
                </button>
                {citiesInData.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => syncParams({ city: cityFilter === city ? '' : city })}
                    className={clsx(
                      'px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1',
                      cityFilter === city ? 'bg-white text-primary' : 'bg-white/15 text-white hover:bg-white/25',
                    )}
                  >
                    <MapPin className="h-3 w-3" /> {city}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="app-container py-6 space-y-8">
        {(search || cityFilter) && !loading && (
          <div className="flex items-center justify-between gap-3 text-sm">
            <p className="text-text-secondary">
              {search && <>Ҷустуҷӯ: <strong className="text-text">{search}</strong></>}
              {search && cityFilter && ' · '}
              {cityFilter && <>Шаҳр: <strong className="text-text">{cityFilter}</strong></>}
            </p>
            <button
              type="button"
              onClick={() => router.replace('/stores')}
              className="btn-ghost text-xs shrink-0"
            >
              Филтрро пок кунед
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 rounded-xl shimmer-bg" />
            ))}
          </div>
        ) : stores.length === 0 ? (
          <div className="card p-12 text-center">
            <Sparkles className="h-10 w-10 text-text-muted mx-auto" />
            <p className="text-text-secondary font-semibold mt-3">
              {search || cityFilter ? 'Мағоза ёфт нашуд' : 'Ҳанӯз мағоза нест'}
            </p>
            {search || cityFilter ? (
              <button
                type="button"
                onClick={() => router.replace('/stores')}
                className="btn-ghost mt-3 text-sm"
              >
                Филтрро пок кунед
              </button>
            ) : (
              <Link href="/sell" className="btn-primary mt-4 inline-flex">
                Мағоза кушоед <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        ) : (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">
                {cityFilter ? `Мағозаҳо — ${cityFilter}` : 'Ҳамаи мағозаҳо'}
              </h2>
              <span className="text-xs text-text-muted font-semibold">{stores.length} мағоза</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {stores.map((store, i) => (
                <StoreCard key={store.id} store={store} index={i} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="section-title mb-3">Чӣ тавр кор мекунад?</h2>
          <SellerStepPromos />
        </section>

        <Link
          href="/sell"
          className="card p-3 flex items-center gap-3 card-hover group overflow-hidden"
        >
          <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0 bg-primary/10">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=128&q=80&auto=format&fit=crop"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-text group-hover:text-primary transition-colors">Фурӯшанда ҳастед?</h3>
            <p className="text-[10px] text-text-muted mt-0.5">Мағоза кушоед — харид ва фурӯш дар як ҷо</p>
          </div>
          <span className="text-xs font-bold text-primary shrink-0 flex items-center gap-0.5">
            Кушодан <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}

export default function StoresPage() {
  return (
    <Suspense fallback={<div className="app-container py-8"><div className="h-40 rounded-xl shimmer-bg" /></div>}>
      <StoresPageInner />
    </Suspense>
  );
}
