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
    <div className="bg-surface-secondary dark:bg-surface-dark min-h-screen">
      <div className="app-container py-4">
        {activeMeta && (
          <div className="mb-4 flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0 border border-border/60">
              <img src={activeMeta.coverImage} alt="" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-black text-text">{activeMeta.nameTj}</h1>
              <p className="text-xs text-text-muted">{activeMeta.descTj}</p>
            </div>
          </div>
        )}

        {categories.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar flex-1 pb-1">
            <button
              type="button"
              onClick={() => selectCategory(null)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                !filters.categoryId
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-text-secondary border-border hover:border-primary/40'
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
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    active
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-text-secondary border-border hover:border-primary/40'
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
              className="icon-box h-9 w-9 bg-white border border-border text-text-secondary shrink-0 rounded-full hover:bg-surface-secondary"
              aria-label="Филтрҳо"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        )}

        {!categories.length && (
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="icon-box h-9 w-9 bg-white border border-border text-text-secondary shrink-0 rounded-full hover:bg-surface-secondary"
              aria-label="Филтрҳо"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        )}

        {showFilters && (
          <div className="card p-4 mb-4 animate-slide-up space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm">Филтрҳо</span>
              <button type="button" onClick={() => setShowFilters(false)}><X className="h-4 w-4 text-gray-400" /></button>
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
          </div>
        )}

        <p className="text-xs text-gray-500 mb-4 font-semibold">
          {filters.hasDiscount ? 'Тахфифҳо: ' : ''}
          {filters.search ? `«${filters.search}»: ` : ''}
          {activeMeta ? `${activeMeta.nameTj}: ` : ''}{total} маҳсулот ёфт шуд
        </p>

        {loading ? (
          <ProductGridSkeleton count={12} />
        ) : products.length === 0 ? (
          <div className="card p-12 text-center">
            <Search className="h-12 w-12 text-gray-300 mx-auto" />
            <p className="text-gray-500 mt-4">Маҳсулот ёфт нашуд</p>
          </div>
        ) : (
          <>
            <div className="ozon-product-grid">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} variant="ozon" onAddToCart={handleAddToCart} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.max(1, page - 1);
                    setPage(next);
                    syncUrl(filters, next);
                  }}
                  disabled={page === 1}
                  className="btn-secondary"
                >←</button>
                <span className="flex items-center text-sm font-bold text-gray-600">{page}/{totalPages}</span>
                <button
                  type="button"
                  onClick={() => {
                    const next = page + 1;
                    setPage(next);
                    syncUrl(filters, next);
                  }}
                  disabled={page === totalPages}
                  className="btn-secondary"
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
