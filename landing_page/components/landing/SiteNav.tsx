/**
 * Site Nav - Company Bar
 *
 * Same bar as leetvibecode.authentyc.ai: company mark on the left, products on
 * the right. Keep the two in step when either changes.
 */

import Link from 'next/link';
import { COMPANY_INFO, PRODUCTS } from '@/lib/constants';

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0A0A0F]/80 backdrop-blur-xl">
      <nav
        aria-label="Main"
        className="max-w-6xl mx-auto h-16 px-4 flex items-center justify-between gap-4"
      >
        <Link href="/" className="font-display text-base sm:text-lg font-bold text-white">
          {COMPANY_INFO.NAME}
        </Link>
        <a
          href={PRODUCTS.LEETVIBECODE.URL}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors duration-300"
        >
          {PRODUCTS.LEETVIBECODE.NAME}
          <span className="rounded-md border border-[#10B981]/40 px-2 py-0.5 text-xs font-semibold text-brand-primary">
            New
          </span>
        </a>
      </nav>
    </header>
  );
}
