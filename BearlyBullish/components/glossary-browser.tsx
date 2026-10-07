'use client';

import { useMemo, useState } from 'react';
import { glossary } from '@/content/glossary';

const groups = ['All', 'Foundations', 'Markets', 'Returns', 'Funds', 'Trading', 'Companies', 'Macro', 'Other'] as const;

export function GlossaryBrowser() {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<typeof groups[number]>('All');
  const terms = useMemo(() => glossary.filter(entry =>
    (group === 'All' || entry.group === group) &&
    `${entry.term} ${entry.definition}`.toLowerCase().includes(query.toLowerCase())
  ), [group, query]);

  return <div className="mt-10">
    <input aria-label="Search vocabulary" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search vocabulary…" className="focus-ring w-full rounded-md border border-stone-300 bg-transparent px-4 py-3 text-base outline-none" />
    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
      {groups.map(item => <button key={item} onClick={() => setGroup(item)} className={`focus-ring rounded px-1 py-1 text-[11px] font-semibold uppercase tracking-wider ${item === group ? 'text-stone-950 underline underline-offset-4' : 'text-stone-500 hover:text-stone-950'}`}>{item}</button>)}
    </div>
    <p className="mt-7 text-[11px] font-semibold uppercase tracking-wider text-stone-500">{terms.length} {terms.length === 1 ? 'term' : 'terms'}</p>
    <div className="mt-3 border-b paper-rule">
      {terms.map(entry => <article key={entry.term} className="border-t paper-rule py-5">
        <p className="editorial-label learn">{entry.group}</p>
        <h2 className="mt-2 font-editorial text-xl font-bold">{entry.term}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">{entry.definition}</p>
      </article>)}
    </div>
    {!terms.length && <p className="border-t paper-rule py-8 text-stone-600">No vocabulary terms match that search.</p>}
  </div>;
}
