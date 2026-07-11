'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2, Package, PlusCircle, AlertCircle, Pencil } from 'lucide-react';
import api, { formatPrice } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { Product } from '@/types';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export default function SellerProductsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'seller' && user.role !== 'admin') { router.push('/sell'); return; }
    api.get(`/products?sellerId=${user.id}&limit=50`).then((res) => {
      setProducts(res.data.data.items);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user, router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Нест кардан?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((p) => p.filter((x) => x.id !== id));
      toast.success('Нест шуд');
    } catch { toast.error('Хатогӣ'); }
  };

  return (
    <div className="app-container py-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black">Маҳсулотам</h1>
          <p className="text-sm text-gray-500">{products.length} маҳсулот</p>
        </div>
        <Link href="/seller/products/new" className="btn-brand text-sm py-2.5">
          <PlusCircle className="h-4 w-4" /> Илова
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card h-24 shimmer-bg" />)}</div>
      ) : products.length === 0 ? (
        <div className="card p-10 text-center">
          <Package className="h-14 w-14 text-gray-300 mx-auto" />
          <p className="font-bold mt-4">Маҳсулот нест</p>
          <Link href="/seller/products/new" className="btn-accent mt-4 inline-flex">Аввалин маҳсулот</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="card p-4 card-hover">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-extrabold text-sm">{p.name}</p>
                  <p className="text-brand-600 font-black mt-1">{formatPrice(p.discountPrice || p.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={clsx('badge text-[10px]',
                      p.status === 'approved' ? 'badge-success' :
                      p.status === 'pending' ? 'badge-accent' : 'badge-danger'
                    )}>
                      {p.status === 'pending' && <AlertCircle className="h-3 w-3" />}
                      {p.status}
                    </span>
                    <span className="text-xs text-gray-400">Stock: {p.stock}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Link href={`/seller/products/${p.id}/edit`} className="icon-box h-9 w-9 text-brand-600 hover:bg-brand-50">
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button onClick={() => handleDelete(p.id)} className="icon-box h-9 w-9 text-red-500 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
