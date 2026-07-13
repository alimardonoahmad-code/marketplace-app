'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ScanLine, Camera } from 'lucide-react';
import clsx from 'clsx';
import api, { formatPrice, getImageUrl } from '@/lib/api';

export interface SearchSuggestion {
  id: string;
  name: string;
  price: number;
  discountPrice: number | null;
  image: string | null;
  category: string | null;
}

interface OzonSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md';
  autocomplete?: boolean;
  showExtras?: boolean;
}

export default function OzonSearch({
  value,
  onChange,
  onSubmit,
  placeholder = 'Искать на Market',
  className,
  size = 'md',
  autocomplete = true,
  showExtras = false,
}: OzonSearchProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autocomplete || value.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      setLoading(true);
      api.get(`/products/suggestions?q=${encodeURIComponent(value.trim())}&limit=8`)
        .then((res) => setSuggestions(res.data.data || []))
        .catch(() => setSuggestions([]))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [value, autocomplete]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    if (onSubmit) {
      onSubmit();
    } else if (value.trim()) {
      router.push(`/products?search=${encodeURIComponent(value.trim())}`);
    }
  };

  const goToProduct = (id: string) => {
    setOpen(false);
    router.push(`/products/${id}`);
  };

  return (
    <div ref={wrapRef} className={clsx('relative w-full', className)}>
      <form
        onSubmit={handleSubmit}
        className={clsx(
          'ozon-search',
          showExtras ? 'ozon-search--mobile' : size === 'sm' ? 'h-10' : 'h-11 sm:h-12',
        )}
      >
        {showExtras && (
          <span className="flex h-12 w-10 shrink-0 items-center justify-center text-[#9CA3AF]">
            <Search className="h-5 w-5" strokeWidth={2} />
          </span>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className={clsx(
            'ozon-search-input',
            showExtras ? 'ozon-search-input--with-icon' : 'ozon-search-input--default',
          )}
          aria-label={placeholder}
          autoComplete="off"
        />
        {showExtras && (
          <div className="flex shrink-0 items-center">
            <button
              type="button"
              className="flex h-10 w-9 items-center justify-center text-[#9CA3AF]"
              aria-label="Сканер"
            >
              <ScanLine className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              className="flex h-10 w-9 items-center justify-center text-[#9CA3AF]"
              aria-label="Камера"
            >
              <Camera className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
        )}
        <button type="submit" className="ozon-search-btn" aria-label="Ҷустуҷӯ">
          <Search className="h-5 w-5" strokeWidth={2.25} />
        </button>
      </form>

      {autocomplete && open && value.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-1 z-[60] card shadow-float border border-border/60 overflow-hidden animate-fade-up">
          {loading && (
            <p className="px-4 py-3 text-xs text-text-muted">Ҷустуҷӯ...</p>
          )}
          {!loading && suggestions.length === 0 && (
            <p className="px-4 py-3 text-xs text-text-muted">Чизе ёфт нашуд</p>
          )}
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goToProduct(s.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-primary/5 text-left transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-surface-secondary overflow-hidden shrink-0">
                {s.image && (
                  <img src={getImageUrl(s.image)} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{s.name}</p>
                <p className="text-[10px] text-text-muted">{s.category || 'Маҳсулот'}</p>
              </div>
              <span className="text-xs font-bold text-primary shrink-0">
                {formatPrice(s.discountPrice || s.price)}
              </span>
            </button>
          ))}
          {suggestions.length > 0 && (
            <Link
              href={`/products?search=${encodeURIComponent(value.trim())}`}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-xs font-bold text-primary border-t border-border/50 hover:bg-primary/5"
            >
              Ҳамаи натиҷаҳо →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
