'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Sparkles, ArrowRight, LayoutGrid } from 'lucide-react';
import api from '@/lib/api';
import { Category } from '@/types';
import { CategoryChipRow } from '@/components/categories/CategoryChip';
import { AppIcon } from '@/components/icons';
import { getCategoryMeta, QUICK_LINKS } from '@/lib/category-meta';

type CategoryWithCount = Category & { productCount: number };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    api.get('/categories')
      .then(async (res) => {
        const cats: Category[] = res.data.data;
        const withCounts = await Promise.all(
          cats.map(async (cat) => {
            try {
              const pRes = await api.get(`/products?categoryId=${cat.id}&limit=1`);
              return { ...cat, productCount: pRes.data.data.total as number };
            } catch {
              return { ...cat, productCount: 0 };
            }
          }),
        );
        setCategories(withCounts);
        setTotalProducts(withCounts.reduce((s, c) => s + c.productCount, 0));
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter((cat) => {
      const meta = getCategoryMeta(cat.slug, cat.name);
      return (
        meta.nameTj.toLowerCase().includes(q)
        || meta.descTj.toLowerCase().includes(q)
        || cat.name.toLowerCase().includes(q)
      );
    });
  }, [categories, search]);

  return (
    <div className="pb-8">
      <div className="relative overflow-hidden bg-gradient-hero text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_55%)]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        <div className="app-container relative py-6 lg:py-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <LayoutGrid className="h-5 w-5" />
              <span className="badge bg-white/15 text-white text-[10px]">PREMIUM MARKET</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black leading-tight">
              Категорияҳои маҳсулот
            </h1>
            <p className="text-white/80 text-sm mt-2 leading-relaxed">
              Ҳазорон маҳсулот аз мағозаҳои онлайн — интихоби васеъ барои ҳар завқ
            </p>
            {!loading && (
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="badge bg-white/20 text-white backdrop-blur-sm text-[10px]">
                  {categories.length} категория
                </span>
                <span className="badge bg-white/20 text-white backdrop-blur-sm text-[10px]">
                  {totalProducts}+ маҳсулот
                </span>
              </div>
            )}
          </div>

          <div className="relative mt-5 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ҷустуҷӯи категория..."
              className="input pl-11 h-11 bg-white/95 border-0 text-text shadow-float placeholder:text-text-muted w-full"
            />
          </div>
        </div>
      </div>

      <div className="app-container -mt-4 relative z-10 space-y-3">
        {loading ? (
          <div className="card px-3 py-4 bg-white shadow-card">
            <div className="flex gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 w-16 rounded-2xl shimmer-bg shrink-0" />
              ))}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-8 text-center bg-white shadow-card">
            <Sparkles className="h-10 w-10 text-text-muted mx-auto" />
            <p className="text-text-secondary mt-3 font-semibold">Категория ёфт нашуд</p>
            <button type="button" onClick={() => setSearch('')} className="btn-ghost mt-3 text-sm">
              Пок кардан
            </button>
          </div>
        ) : (
          <div className="card px-3 py-2.5 bg-white shadow-card">
            <CategoryChipRow categories={filtered} />
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {QUICK_LINKS.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="card p-3 flex items-center gap-2.5 card-hover bg-white dark:bg-surface-dark-secondary shadow-card"
            >
              <div className="icon-box h-9 w-9 icon-box-brand shrink-0">
                <AppIcon name={icon} size="default" variant="primary" aria-hidden />
              </div>
              <span className="text-xs font-bold text-text dark:text-gray-200 truncate">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="app-container py-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-500 p-6 lg:p-8 text-white shadow-float">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-black">Ҳама маҳсулотро бинед</h3>
              <p className="text-sm text-white/80 mt-1">Аз ҳамаи мағозаҳо дар як ҷо харид кунед</p>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 bg-white text-primary rounded-xl px-5 h-11 text-sm font-bold hover:scale-[1.02] transition-transform shrink-0">
              Ба каталог <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
