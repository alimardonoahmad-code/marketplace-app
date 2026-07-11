'use client';

import { Sparkles } from 'lucide-react';
import ProductForm from '@/components/seller/ProductForm';

export default function NewProductPage() {
  return (
    <div className="app-container py-4">
      <div className="mb-6 animate-fade-up">
        <div className="icon-box h-14 w-14 bg-gradient-gold text-white shadow-float mb-4">
          <Sparkles className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-black">Маҳсулоти нав</h1>
        <p className="text-sm text-gray-500 mt-1">Пас аз тасдиқи admin намоиш дода мешавад</p>
      </div>
      <ProductForm />
    </div>
  );
}
