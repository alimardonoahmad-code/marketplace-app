'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import api from '@/lib/api';
import ProductForm from '@/components/seller/ProductForm';
import { Product } from '@/types';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data.data))
      .catch(() => router.push('/seller/products'));
  }, [id, router]);

  if (!product) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="app-container py-4">
      <div className="mb-6">
        <div className="icon-box h-14 w-14 bg-gradient-brand text-white shadow-float mb-4">
          <Sparkles className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-black">Таҳрири маҳсулот</h1>
        <p className="text-sm text-gray-500 mt-1">{product.name}</p>
      </div>
      <ProductForm
        productId={id}
        initial={{
          name: product.name,
          description: product.description,
          price: String(product.price),
          discountPrice: product.discountPrice ? String(product.discountPrice) : '',
          stock: String(product.stock),
          categoryId: product.categoryId || '',
          video: (product as Product & { video?: string }).video || '',
        }}
      />
    </div>
  );
}
