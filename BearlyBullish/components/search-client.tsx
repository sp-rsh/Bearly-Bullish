'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { CategoryLabel } from '@/components/article-card';
import { articles } from '@/content/articles';
import { glossary } from '@/content/glossary';

export function SearchClient() {
  const [query, setQuery] = useState('');
  const search = query.trim().toLowerCase();
  const articleResults = useMemo(() => search ? articles.filter(article =>
    `${article.title} ${article.excerpt} ${article.category} ${article.tag} ${article.body.join(' ')}`.toLowerCase().includes(search)
  ) : [], [search]);
  const terms = useMemo(() => search ? glossary.filter(term =>
    `${term.term} ${term.definition}`.toLowerCase().includes(search)
  ) : [], [search]);

  return <>
    <input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Search articles and vocabulary…" className="focus-ring mt-8 w-full rounded-md border border-stone-300 bg-transparent px-4 py-3 text-base outline-none" />
    {!search && <p className="mt-5 text-sm text-stone-600">Search titles, subjects, article text or glossary terms.</p>}
    {search && <div className="mt-8 grid gap-10 md:grid-cols-[1.5fr_1fr]">
      <section>
        <p className="editorial-label">Articles · {articleResults.length}</p>
        {articleResults.map(article => <article key={article.slug} className="border-b paper-rule py-5">
          <CategoryLabel category={article.category} />
          <Link href={article.slug === 'basic-vocabulary' ? '/learn/basic-vocabulary' : `/article/${article.slug}`} className="focus-ring group mt-2 block">
            <h2 className="font-editorial text-2xl font-bold group-hover:underline group-hover:underline-offset-4">{article.title}</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">{article.excerpt}</p>
            <p className="mt-3 text-[11px] uppercase tracking-wider text-stone-500">{article.readingTime}</p>
          </Link>
        </article>)}
        {!articleResults.length && <p className="mt-5 text-stone-600">No articles match this search.</p>}
      </section>
      <section>
        <p className="editorial-label">Vocabulary · {terms.length}</p>
        {terms.map(term => <Link key={term.term} href="/learn/basic-vocabulary" className="focus-ring block border-b paper-rule py-5">
          <h2 className="font-editorial text-xl font-bold">{term.term}</h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">{term.definition}</p>
        </Link>)}
      </section>
    </div>}
  </>;
}
