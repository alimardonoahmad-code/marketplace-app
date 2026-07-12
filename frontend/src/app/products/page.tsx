'use client';

import { useEffect, useState, Suspense, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import api from '@/lib/api';
import { Product, Category, PaginatedResponse } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { getCategoryMeta } from '@/lib/category-meta';
import toast from 'react-hot-toast';
import { useAuthStore, useCartStore } from '@/store/auth';
import { getLoginUrl } from '@/lib/auth-utils';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const { setItemCount } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    hasDiscount: false,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.data));
  }, []);

  useEffect(() => {
    const slug = searchParams.get('category') || '';
    const idFromUrl = searchParams.get('categoryId') || '';
    let categoryId = idFromUrl;

    if (slug && categories.length > 0) {
      const match = categories.find((c) => c.slug === slug);
      if (match) categoryId = match.id;
    }

    const search = searchParams.get('search') || '';
    setFilters({
      search,
      categoryId,
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      minRating: searchParams.get('minRating') || '',
      hasDiscount: searchParams.get('hasDiscount') === 'true',
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'DESC',
    });
    setPage(Number(searchParams.get('page') || '1'));
  }, [searchParams, categories]);

  const syncUrl = useCallback((next: typeof filters, nextPage = 1) => {
    const params = new URLSearchParams();
    if (next.search) params.set('search', next.search);
    if (next.categoryId) {
      const cat = categories.find((c) => c.id === next.categoryId);
      if (cat) params.set('category', cat.slug);
    }
    if (next.minPrice) params.set('minPrice', next.minPrice);
    if (next.maxPrice) params.set('maxPrice', next.maxPrice);
    if (next.minRating) params.set('minRating', next.minRating);
    if (next.hasDiscount) params.set('hasDiscount', 'true');
    if (next.sortBy !== 'createdAt') params.set('sortBy', next.sortBy);
    if (next.sortOrder !== 'DESC') params.set('sortOrder', next.sortOrder);
    if (nextPage > 1) params.set('page', String(nextPage));
    router.replace(`/products?${params.toString()}`, { scroll: false });
  }, [categories, router]);

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === filters.categoryId),
    [categories, filters.categoryId],
  );

  const activeMeta = activeCategory
    ? getCategoryMeta(activeCategory.slug, activeCategory.name)
    : null;

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (k === 'hasDiscount') {
        if (v) params.set('hasDiscount', 'true');
      } else if (v) params.set(k, String(v));
    });
    params.set('page', String(page));
    params.set('limit', '24');

    api.get(`/products?${params}`)
      .then((res) => {
        const data: PaginatedResponse<Product> = res.data.data;
        setProducts(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      })
      .catch(() => toast.error('Маҳсулот бор нашуд'))
      .finally(() => setLoading(false));
  }, [filters, page]);

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

  const selectCategory = (cat: Category | null) => {
    const next = { ...filters, categoryId: cat?.id || '' };
    syncUrl(next, 1);
  };

  return (
    <div className="bg-[#F5F7FA] dark:bg-surface-dark min-h-screen">
      <div className="app-container py-3 lg:py-4">
        {activeMeta && (
          <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white dark:bg-surface-dark-secondary border border-[#E8ECF2] dark:border-border-dark p-3 shadow-[0_2px_8px_rgba(0,26,52,0.04)]">
            <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0 border border-[#E8ECF2]">
              <img src={activeMeta.coverImage} alt="" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-base font-black text-text">{activeMeta.nameTj}</h1>
              <p className="text-xs text-text-muted">{activeMeta.descTj}</p>
            </div>
          </div>
        )}

        {categories.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-1.5 overflow-x-auto hide-scrollbar flex-1 pb-0.5">
            <button
              type="button"
              onClick={() => selectCategory(null)}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                !filters.categoryId
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-text-secondary border-[#E8ECF2] hover:border-primary/40 dark:bg-surface-dark-secondary dark:border-border-dark'
              }`}
            >
              Ҳама
            </button>
            {categories.map((cat) => {
              const meta = getCategoryMeta(cat.slug, cat.name);
              const active = filters.categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => selectCategory(cat)}
                  className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    active
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-white text-text-secondary border-[#E8ECF2] hover:border-primary/40 dark:bg-surface-dark-secondary dark:border-border-dark'
                  }`}
                >
                  {meta.nameTj}
                </button>
              );
            })}
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`icon-box h-10 w-10 shrink-0 rounded-xl border transition-colors ${
                showFilters
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white border-[#E8ECF2] text-text-secondary hover:border-primary/40 dark:bg-surface-dark-secondary dark:border-border-dark'
              }`}
              aria-label="Филтрҳо"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        )}

        {!categories.length && (
          <div className="flex justify-end mb-3">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="icon-box h-10 w-10 bg-white border border-[#E8ECF2] text-text-secondary shrink-0 rounded-xl hover:border-primary/40"
              aria-label="Филтрҳо"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        )}

        {showFilters && (
          <div className="rounded-2xl bg-white dark:bg-surface-dark-secondary border border-[#E8ECF2] dark:border-border-dark p-4 mb-3 animate-slide-up space-y-3 shadow-[0_2px_12px_rgba(0,26,52,0.06)]">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-text">Филтрҳо</span>
              <button type="button" onClick={() => setShowFilters(false)} className="icon-box h-8 w-8 text-text-muted"><X className="h-4 w-4" /></button>
            </div>
            <select
              value={filters.categoryId}
              onChange={(e) => {
                const cat = categories.find((c) => c.id === e.target.value);
                if (cat) selectCategory(cat);
                else selectCategory(null);
              }}
              className="input"
            >
              <option value="">Ҳама категория</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{getCategoryMeta(c.slug, c.name).nameTj}</option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Min смн" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} className="input" />
              <input type="number" placeholder="Max смн" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} className="input" />
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-text cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasDiscount}
                onChange={(e) => syncUrl({ ...filters, hasDiscount: e.target.checked }, 1)}
                className="h-4 w-4 rounded border-[#E8ECF2] text-primary focus:ring-primary"
              />
              Танҳо бо тахфиф
            </label>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                syncUrl({ ...filters, sortBy, sortOrder }, 1);
              }}
              className="input"
            >
              <option value="createdAt-DESC">Навтарин</option>
              <option value="price-ASC">Арзонтарин</option>
              <option value="price-DESC">Грантарин</option>
              <option value="rating-DESC">Беҳтарин</option>
            </select>
            <button
              type="button"
              onClick={() => syncUrl(filters, 1)}
              className="btn-primary w-full py-2.5 text-sm"
            >
              Татбиқ кардан
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-3 px-0.5">
          <p className="text-xs text-text-muted font-semibold">
            {filters.hasDiscount ? 'Тахфифҳо · ' : ''}
            {filters.search ? `«${filters.search}» · ` : ''}
            {activeMeta ? `${activeMeta.nameTj} · ` : ''}
            <span className="text-text">{total}</span> маҳсулот
          </p>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              syncUrl({ ...filters, sortBy, sortOrder }, 1);
            }}
            className="text-xs font-bold text-primary bg-transparent border-none outline-none cursor-pointer"
          >
            <option value="createdAt-DESC">Навтарин</option>
            <option value="price-ASC">Арзонтарин</option>
            <option value="price-DESC">Грантарин</option>
            <option value="rating-DESC">Беҳтарин</option>
          </select>
        </div>

        {loading ? (
          <ProductGridSkeleton count={12} />
        ) : products.length === 0 ? (
          <div className="rounded-2xl bg-white dark:bg-surface-dark-secondary border border-[#E8ECF2] dark:border-border-dark p-12 text-center shadow-[0_2px_8px_rgba(0,26,52,0.04)]">
            <Search className="h-12 w-12 text-[#C5CDD8] mx-auto" />
            <p className="text-text-muted mt-4 font-medium">Маҳсулот ёфт нашуд</p>
            <button type="button" onClick={() => selectCategory(null)} className="btn-primary mt-4 text-sm px-6">
              Ҳама маҳсулот
            </button>
          </div>
        ) : (
          <>
            <div className="ozon-product-grid">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} variant="ozon" onAddToCart={handleAddToCart} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.max(1, page - 1);
                    setPage(next);
                    syncUrl(filters, next);
                  }}
                  disabled={page === 1}
                  className="h-10 w-10 rounded-xl bg-white border border-[#E8ECF2] text-text-secondary font-bold disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
                >←</button>
                <span className="flex items-center px-4 h-10 rounded-xl bg-white border border-[#E8ECF2] text-sm font-bold text-text">{page} / {totalPages}</span>
                <button
                  type="button"
                  onClick={() => {
                    const next = page + 1;
                    setPage(next);
                    syncUrl(filters, next);
                  }}
                  disabled={page === totalPages}
                  className="h-10 w-10 rounded-xl bg-white border border-[#E8ECF2] text-text-secondary font-bold disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
                >→</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
