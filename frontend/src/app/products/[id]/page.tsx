'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star, ShoppingCart, Heart, Minus, Plus, Truck, ShieldCheck,
  ArrowLeft, Zap, Share2, MessageCircle, MapPin, Package, Camera, X,
} from 'lucide-react';
import api, { formatPrice, getImageUrl, getDiscountPercent } from '@/lib/api';
import { Product, Review } from '@/types';
import toast from 'react-hot-toast';
import { useAuthStore, useCartStore } from '@/store/auth';
import { useWishlist } from '@/hooks/useWishlist';
import ProductCard from '@/components/products/ProductCard';
import SectionHeader from '@/components/home/SectionHeader';
import PriceDisplay from '@/components/ui/PriceDisplay';
import { getStoreLocation, getStoreName } from '@/lib/store-utils';
import { getCategoryMeta } from '@/lib/category-meta';
import { getLoginUrl } from '@/lib/auth-utils';
import clsx from 'clsx';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { setItemCount } = useCartStore();
  const { isWishlisted, toggle } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', images: [] as string[] });
  const [reviewFiles, setReviewFiles] = useState<File[]>([]);
  const [reviewPreviews, setReviewPreviews] = useState<string[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    Promise.all([api.get(`/products/${id}`), api.get(`/reviews/product/${id}`)])
      .then(([p, r]) => {
        const prod = p.data.data as Product;
        setProduct(prod);
        setReviews(r.data.data);
        if (prod.categoryId) {
          api.get(`/products?categoryId=${prod.categoryId}&limit=9`)
            .then((res) => {
              const items = (res.data.data?.items || []) as Product[];
              setSimilar(items.filter((item) => item.id !== prod.id).slice(0, 8));
            })
            .catch(() => {});
        }
      })
      .catch(() => router.push('/products'))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="app-container py-8">
        <div className="grid lg:grid-cols-[380px_1fr] gap-8">
          <div className="aspect-square max-h-[380px] rounded-2xl shimmer-bg" />
          <div className="space-y-4">
            <div className="h-6 w-24 shimmer-bg rounded" />
            <div className="h-8 w-3/4 shimmer-bg rounded" />
            <div className="h-10 w-32 shimmer-bg rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const images = product.images?.length ? product.images : [''];
  const inStock = product.stock > 0;
  const catMeta = product.category
    ? getCategoryMeta(product.category.slug, product.category.name)
    : null;

  const startChat = async () => {
    if (!user) {
      toast.error('Барои чат ворид шавед');
      router.push(getLoginUrl(`/chat?product=${id}`));
      return;
    }
    try {
      const res = await api.post('/chat/conversations', {
        sellerId: product.sellerId,
        productId: product.id,
        message: `Салом! Дар бораи "${product.name}"`,
      });
      router.push(`/chat?c=${res.data.data.id}`);
    } catch {
      toast.error('Хатогӣ');
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Барои харид ворид шавед');
      router.push(getLoginUrl('/cart'));
      return;
    }
    try {
      const res = await api.post('/cart', { productId: id, quantity });
      setItemCount(res.data.data.itemCount);
      toast.success('Ба сабад илова шуд!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Хатогӣ');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product!.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Пайванд нусхабардорӣ шуд');
      }
    } catch {
      /* cancelled */
    }
  };

  const CartActions = ({ className }: { className?: string }) => (
    inStock ? (
      <div className={clsx('flex items-center gap-3', className)}>
        <div className="flex items-center bg-surface-secondary dark:bg-surface-dark-secondary rounded-xl shrink-0">
          <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2.5 hover:bg-gray-200/50 rounded-l-xl">
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-3 font-bold text-sm min-w-[2rem] text-center">{quantity}</span>
          <button type="button" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2.5 hover:bg-gray-200/50 rounded-r-xl">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button type="button" onClick={handleAddToCart} className="btn-primary flex-1 py-3.5 text-sm font-bold rounded-xl">
          <ShoppingCart className="h-4 w-4" />
          Ба сабад — {formatPrice(Number(displayPrice) * quantity)}
        </button>
        <button
          type="button"
          onClick={() => toggle(product.id)}
          className={clsx(
            'icon-box h-11 w-11 shrink-0',
            isWishlisted(product.id) ? 'bg-pink-100 text-pink-500' : 'bg-pink-50 text-pink-500 dark:bg-pink-900/20',
          )}
        >
          <Heart className={clsx('h-5 w-5', isWishlisted(product.id) && 'fill-pink-500')} />
        </button>
      </div>
    ) : (
      <div className={clsx('badge-danger py-2 px-4 text-sm', className)}>Маҳсулот тамом шуд</div>
    )
  );

  return (
    <div className="bg-[#F5F7FA] dark:bg-surface-dark min-h-screen pb-24 lg:pb-8">
      <div className="app-container pt-3 pb-6">
        <button type="button" onClick={() => router.back()} className="icon-box h-9 w-9 bg-white border border-[#E8ECF2] shadow-[0_2px_8px_rgba(0,26,52,0.04)] mb-3 dark:bg-surface-dark-secondary dark:border-border-dark">
          <ArrowLeft className="h-4 w-4" />
        </button>

        {/* Main: image left + info right on desktop */}
        <div className="grid lg:grid-cols-[minmax(280px,380px)_1fr] xl:grid-cols-[400px_1fr] gap-6 lg:gap-10 items-start">
          {/* ── Image column ── */}
          <div className="lg:sticky lg:top-20">
            <div className="relative aspect-square max-h-[320px] sm:max-h-[360px] lg:max-h-[380px] mx-auto w-full bg-white rounded-2xl overflow-hidden border border-[#E8ECF2] dark:border-border-dark shadow-[0_2px_12px_rgba(0,26,52,0.06)]">
              <Image
                src={getImageUrl(images[selectedImage])}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 320px, 400px"
              />
              {hasDiscount && (
                <span className="absolute top-3 left-3 badge bg-accent text-white text-[10px] font-bold shadow-md flex items-center gap-1">
                  <Zap className="h-3 w-3" /> -{getDiscountPercent(product.price, product.discountPrice!)}%
                </span>
              )}
              <button type="button" onClick={handleShare} className="absolute top-3 right-3 icon-box h-9 w-9 bg-white/90 shadow-md text-gray-600">
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar justify-center lg:justify-start">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    className={clsx(
                      'relative h-14 w-14 shrink-0 rounded-lg overflow-hidden border-2 transition-colors',
                      selectedImage === i ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100',
                    )}
                  >
                    <Image src={getImageUrl(img)} alt="" fill className="object-cover" sizes="56px" />
                  </button>
                ))}
              </div>
            )}

            {product.video && (
              <div className="mt-3 card p-1.5 aspect-video max-h-[200px]">
                <iframe
                  src={product.video.replace('watch?v=', 'embed/')}
                  className="w-full h-full rounded-xl"
                  allowFullScreen
                  title="video"
                />
              </div>
            )}
          </div>

          {/* ── Info column ── */}
          <div className="space-y-4 animate-fade-up min-w-0 rounded-2xl bg-white dark:bg-surface-dark-secondary border border-[#E8ECF2] dark:border-border-dark p-4 lg:p-5 shadow-[0_2px_12px_rgba(0,26,52,0.06)]">
            <div>
              {product.category && (
                <span className="badge-brand text-[10px]">{catMeta?.nameTj || product.category.name}</span>
              )}
              <h1 className="text-lg sm:text-xl lg:text-2xl font-black mt-2 leading-snug text-text dark:text-white">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-2 py-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-sm">{product.rating}</span>
                </div>
                <span className="text-xs text-text-muted">({product.reviewCount} шарҳ)</span>
                <span className={clsx('text-xs font-semibold', inStock ? 'text-success' : 'text-danger')}>
                  {inStock ? `${product.stock} дона дар stock` : 'Тамом шуд'}
                </span>
              </div>
            </div>

            <PriceDisplay price={product.price} discountPrice={product.discountPrice} size="lg" />

            {/* Store card */}
            {product.seller && (
              <Link href={`/stores/${product.seller.id}`} className="card p-3 flex items-center gap-3 card-hover">
                <div className="icon-box h-11 w-11 bg-primary-50 text-primary shrink-0 rounded-xl">
                  <span className="text-base font-black">{getStoreName(product.seller).charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-text-muted uppercase tracking-wide">Интернет-магоза</p>
                  <p className="font-bold text-sm truncate">{getStoreName(product.seller)}</p>
                  {getStoreLocation(product.seller) && (
                    <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {getStoreLocation(product.seller)}
                    </p>
                  )}
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-text-muted shrink-0" />
              </Link>
            )}

            {/* Desktop cart — inline, not fixed */}
            <CartActions className="hidden lg:flex" />

            {product.seller && (
              <button type="button" onClick={startChat} className="btn-outline-brand w-full text-sm py-2.5 hidden lg:inline-flex">
                <MessageCircle className="h-4 w-4" />
                Чат бо фурӯшанда
              </button>
            )}

            {/* Specs — компакт */}
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/5 border border-primary/10">
                <Truck className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="text-[11px] font-semibold text-text">Интиқоли ройгон · Душанбе</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 dark:bg-emerald-900/20">
                <ShieldCheck className="h-3.5 w-3.5 text-success shrink-0" />
                <span className="text-[11px] font-semibold text-text">Гарантия 14 рӯз</span>
              </div>
              {product.category && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-secondary border border-border/50">
                  <Package className="h-3.5 w-3.5 text-secondary shrink-0" />
                  <span className="text-[11px] font-semibold text-text">{catMeta?.nameTj || product.category.name}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="rounded-2xl bg-[#F5F7FA] dark:bg-surface-dark border border-[#E8ECF2] dark:border-border-dark p-4">
              <h2 className="text-sm font-bold mb-2 text-text">Тавсиф</h2>
              <p className="text-sm text-text-secondary leading-relaxed">{product.description}</p>
            </div>

            {product.seller && (
              <button type="button" onClick={startChat} className="btn-outline-brand w-full text-sm py-2.5 lg:hidden">
                <MessageCircle className="h-4 w-4" />
                Чат бо фурӯшанда
              </button>
            )}
          </div>
        </div>

        {/* Reviews — full width below */}
        <div className="mt-8 pt-6 border-t border-border dark:border-border-dark">
          <h2 className="section-title flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-primary fill-amber-400 text-amber-400" />
            Шарҳҳо ({reviews.length})
          </h2>

          {user && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSubmittingReview(true);
                try {
                  let imagePaths: string[] = [];
                  if (reviewFiles.length > 0) {
                    const fd = new FormData();
                    reviewFiles.forEach((f) => fd.append('images', f));
                    const up = await api.post('/reviews/upload', fd, {
                      headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    imagePaths = up.data.data.images || [];
                  }
                  await api.post('/reviews', { productId: id, ...reviewForm, images: imagePaths });
                  toast.success('Шарҳ сабт шуд!');
                  const r = await api.get(`/reviews/product/${id}`);
                  setReviews(r.data.data);
                  setReviewForm({ rating: 5, comment: '', images: [] });
                  setReviewFiles([]);
                  setReviewPreviews([]);
                } catch {
                  toast.error('Хатогӣ');
                } finally {
                  setSubmittingReview(false);
                }
              }}
              className="card p-4 mb-4 max-w-xl"
            >
              <div className="flex gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: i + 1 })}>
                    <Star className={clsx('h-5 w-5', i < reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300')} />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                className="input mb-2 text-sm"
                rows={2}
                placeholder="Шарҳи шумо..."
              />
              <div className="flex flex-wrap gap-2 mb-3">
                {reviewPreviews.map((src, i) => (
                  <div key={src} className="relative h-16 w-16 rounded-lg overflow-hidden">
                    <Image src={src} alt="" fill className="object-cover" sizes="64px" />
                    <button
                      type="button"
                      onClick={() => {
                        setReviewFiles((f) => f.filter((_, idx) => idx !== i));
                        setReviewPreviews((p) => p.filter((_, idx) => idx !== i));
                      }}
                      className="absolute top-0.5 right-0.5 h-5 w-5 bg-black/60 rounded-full flex items-center justify-center"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
                {reviewFiles.length < 4 && (
                  <label className="h-16 w-16 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <Camera className="h-5 w-5 text-text-muted" />
                    <span className="text-[9px] text-text-muted mt-0.5">Сурат</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setReviewFiles((f) => [...f, file]);
                        setReviewPreviews((p) => [...p, URL.createObjectURL(file)]);
                        e.target.value = '';
                      }}
                    />
                  </label>
                )}
              </div>
              <button type="submit" disabled={submittingReview} className="btn-primary text-sm py-2 h-9">
                {submittingReview ? 'Сабт...' : 'Ирсол'}
              </button>
            </form>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {reviews.map((r) => (
              <div key={r.id} className="card p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="icon-box h-8 w-8 icon-box-brand text-xs font-black">{r.user.name.charAt(0)}</div>
                  <span className="font-bold text-sm truncate">{r.user.name}</span>
                  <div className="flex ml-auto shrink-0">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                {r.comment && <p className="text-sm text-text-secondary">{r.comment}</p>}
                {r.images?.length > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {r.images.map((img, idx) => (
                      <div key={idx} className="relative h-14 w-14 rounded-lg overflow-hidden">
                        <Image src={getImageUrl(img)} alt="" fill className="object-cover" sizes="56px" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {reviews.length === 0 && (
              <p className="text-sm text-text-muted col-span-full">Ҳанӯз шарҳ нест</p>
            )}
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-10 pt-8 border-t border-border dark:border-border-dark">
            <SectionHeader
              title="Шабеҳ ба ин"
              subtitle="Маҳсулоти дигар аз ҳамин категория"
              href={product.categoryId ? `/products?categoryId=${product.categoryId}` : '/products'}
            />
            <div className="ozon-product-grid">
              {similar.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  index={i}
                  variant="ozon"
                  onAddToCart={async (item) => {
                    if (!user) {
                      router.push(getLoginUrl('/cart'));
                      return;
                    }
                    const res = await api.post('/cart', { productId: item.id, quantity: 1 });
                    setItemCount(res.data.data.itemCount);
                    toast.success('Ба сабад!');
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile fixed bottom bar */}
      {inStock && (
        <div className="fixed bottom-[4.25rem] left-0 right-0 z-40 bg-white border-t border-[#E8ECF2] px-4 py-3 shadow-[0_-4px_20px_rgba(0,26,52,0.08)] lg:hidden dark:bg-surface-dark-secondary dark:border-border-dark">
          <CartActions />
        </div>
      )}
    </div>
  );
}
