'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Search, ShoppingCart, Heart, User, Menu, X, LogOut,
  Package, LayoutDashboard, Truck,
} from 'lucide-react';
import { useAuthStore, useCartStore } from '@/store/auth';
import api from '@/lib/api';

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { itemCount, setItemCount } = useCartStore();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      api.get('/cart').then((res) => {
        setItemCount(res.data.data.itemCount);
      }).catch(() => {});
    }
  }, [user, setItemCount]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push('/');
  };

  const dashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return 'http://localhost:3002';
      case 'seller': return '/seller';
      case 'courier': return '/courier';
      default: return '/profile';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-900 text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Package className="h-8 w-8 text-primary-400" />
            <span className="text-xl font-bold hidden sm:block">MarketPlace</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex">
            <div className="relative w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-lg bg-gray-800 border border-gray-700 py-2 pl-4 pr-12 text-sm text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-primary-400">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2 sm:gap-4">
            {user && (
              <Link href="/wishlist" className="p-2 hover:text-primary-400 transition-colors hidden sm:block">
                <Heart className="h-6 w-6" />
              </Link>
            )}

            <Link href="/cart" className="relative p-2 hover:text-primary-400 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-xs font-bold">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:text-primary-400 transition-colors"
                >
                  <User className="h-6 w-6" />
                  <span className="hidden lg:block text-sm">{user.name}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white py-2 shadow-xl border border-gray-100 text-gray-700 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <span className="badge bg-primary-100 text-primary-700 mt-1 capitalize">{user.role}</span>
                    </div>
                    <Link href={dashboardLink()} onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link href="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50">
                      <Package className="h-4 w-4" /> My Orders
                    </Link>
                    {user.role === 'courier' && (
                      <Link href="/courier" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50">
                        <Truck className="h-4 w-4" /> Deliveries
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn-primary text-sm px-3 py-2">
                Sign In
              </Link>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-800 pt-4">
            <form onSubmit={handleSearch} className="mb-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-lg bg-gray-800 border border-gray-700 py-2 px-4 text-sm text-white"
              />
            </form>
            <nav className="flex flex-col gap-2">
              <Link href="/products" onClick={() => setMenuOpen(false)} className="px-2 py-2 hover:text-primary-400">All Products</Link>
              <Link href="/categories" onClick={() => setMenuOpen(false)} className="px-2 py-2 hover:text-primary-400">Categories</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
