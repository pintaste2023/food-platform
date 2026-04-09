// Cart Button Component - Shows in header with item count badge
'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export default function CartButton() {
  const { totalItems } = useCart();

  return (
    <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
      <span className="text-xl">🛒</span>
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </Link>
  );
}
