'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
  ['Markets', '/markets'],
  ['Learn', '/learn'],
  ['Research', '/research'],
  ['Businesses', '/businesses'],
  ['Fin × Tech', '/fin-tech'],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  return <header className="border-b paper-rule">
    <div className="mx-auto max-w-7xl px-5 sm:px-7">
      <div className="flex min-h-[88px] items-center justify-between">
        <Link href="/" className="focus-ring font-nav text-[1.7rem] tracking-[-.06em] sm:text-3xl">Bearly Bullish</Link>
        <nav className="hidden items-center gap-5 text-stone-600 lg:flex">
          <div className="font-nav flex items-center gap-5 text-base leading-none">
            {links.map(([name, href]) => <Link key={href} href={href} className={`focus-ring hover:text-stone-950 ${path === href ? 'text-stone-950 underline underline-offset-8' : ''}`}>{name}</Link>)}
            <Link href="/search" className="focus-ring border-l paper-rule pl-5 hover:text-stone-950">Search</Link>
          </div>
        </nav>
        <button aria-label="Open navigation" className="focus-ring rounded-md border border-stone-300 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider lg:hidden" onClick={() => setOpen(value => !value)}>
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      {open && <nav className="font-nav border-t paper-rule py-3 lg:hidden">
        {[...links, ['Search', '/search']].map(([name, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="focus-ring block py-2 text-base leading-none text-stone-700">{name}</Link>)}
      </nav>}
    </div>
  </header>;
}
