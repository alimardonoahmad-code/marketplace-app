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
    <div className="bg-[#F5F7FA] dark:bg-surface-dark min-h-screen pb-8">
      <div className="ozon-promo-bar">
        <div className="app-container py-6 lg:py-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <LayoutGrid className="h-5 w-5 text-white" />
              <span className="badge bg-white/20 text-white text-[10px] font-bold">MARKET</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black leading-tight text-white">
              Категорияҳои маҳсулот
            </h1>
            <p className="text-white/85 text-sm mt-2 leading-relaxed">
              Ҳазорон маҳсулот аз мағозаҳои онлайн
            </p>
            {!loading && (
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="badge bg-white/20 text-white text-[10px] font-bold">
                  {categories.length} категория
                </span>
                <span className="badge bg-white/20 text-white text-[10px] font-bold">
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
              className="input pl-11 h-11 bg-white border-0 text-text shadow-[0_2px_12px_rgba(0,26,52,0.1)] placeholder:text-text-muted w-full rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="app-container -mt-3 relative z-10 space-y-3 pt-1">
        {loading ? (
          <div className="rounded-2xl px-3 py-4 bg-white border border-[#E8ECF2] shadow-[0_2px_8px_rgba(0,26,52,0.04)]">
            <div className="flex gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 w-16 rounded-2xl shimmer-bg shrink-0" />
              ))}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl p-8 text-center bg-white border border-[#E8ECF2] shadow-[0_2px_8px_rgba(0,26,52,0.04)]">
            <Sparkles className="h-10 w-10 text-text-muted mx-auto" />
            <p className="text-text-secondary mt-3 font-semibold">Категория ёфт нашуд</p>
            <button type="button" onClick={() => setSearch('')} className="btn-primary mt-3 text-sm px-6">
              Пок кардан
            </button>
          </div>
        ) : (
          <div className="rounded-2xl px-3 py-2.5 bg-white border border-[#E8ECF2] shadow-[0_2px_8px_rgba(0,26,52,0.04)]">
            <CategoryChipRow categories={filtered} />
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          {QUICK_LINKS.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="rounded-2xl p-3 flex items-center gap-2.5 bg-white dark:bg-surface-dark-secondary border border-[#E8ECF2] dark:border-border-dark shadow-[0_2px_8px_rgba(0,26,52,0.04)] hover:border-primary/30 transition-colors"
            >
              <div className="icon-box h-9 w-9 bg-primary-50 text-primary shrink-0 rounded-xl">
                <AppIcon name={icon} size="default" variant="primary" aria-hidden />
              </div>
              <span className="text-xs font-bold text-text dark:text-gray-200 truncate">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="app-container py-6">
        <div className="relative overflow-hidden rounded-2xl bg-primary p-6 lg:p-8 text-white shadow-[0_4px_20px_rgba(0,91,255,0.25)]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-black">Ҳама маҳсулотро бинед</h3>
              <p className="text-sm text-white/85 mt-1">Аз ҳамаи мағозаҳо дар як ҷо харид кунед</p>
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
