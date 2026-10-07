import Link from 'next/link';
import { ArticleCard, CategoryLabel } from '@/components/article-card';
import { MarketStrip } from '@/components/market-strip';
import { articles } from '@/content/articles';
import { glossary } from '@/content/glossary';

export default function Home() {
  const priority = articles.slice(0, 8);
  const rest = articles.slice(8);
  const vocabulary = glossary.slice(0, 3);

  return <>
    <MarketStrip />
    <main className="mx-auto max-w-7xl px-5 sm:px-7">
      <section className="border-b paper-rule py-8">
        <p className="editorial-label">Independent financial journal</p>
        <div className="mt-5 grid items-start gap-0 lg:grid-cols-[1.55fr_.8fr] lg:divide-x lg:divide-stone-300">
          <section className="self-start lg:pr-10">
            <div className="border-t paper-rule py-5 sm:py-7">
              <CategoryLabel category="Learn" />
              <Link href="/learn/basic-vocabulary" className="focus-ring group mt-2 block">
                <h1 className="font-editorial text-3xl font-bold leading-[1.18] tracking-tight group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 sm:text-4xl">
                  BASIC VOCABULARY
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">{priority[0].excerpt}</p>
                <p className="mt-3 text-[11px] font-medium uppercase tracking-[.08em] text-stone-500">Reference</p>
              </Link>
            </div>

            <div className="border-b paper-rule">
              {vocabulary.map((entry) => <article key={entry.term} className="border-t paper-rule py-4">
                <h2 className="font-editorial text-base font-bold">{entry.term}</h2>
                <p className="mt-1 text-sm leading-6 text-stone-600">{entry.definition}</p>
              </article>)}
            </div>
            <Link href="/learn/basic-vocabulary" className="focus-ring mt-5 inline-block text-[11px] font-semibold uppercase tracking-wider text-stone-700 underline decoration-stone-400 underline-offset-4 hover:text-stone-950">
              View all vocabulary →
            </Link>
          </section>

          <div className="self-start lg:pl-8">
            <ArticleCard article={priority[1]} />
            <ArticleCard article={priority[2]} />
          </div>
        </div>
      </section>

      <section className="grid border-b paper-rule py-8 md:grid-cols-3 md:divide-x md:divide-stone-300">
        <div className="md:pr-7"><ArticleCard article={priority[3]} /></div>
        <div className="md:px-7"><ArticleCard article={priority[4]} /></div>
        <div className="md:pl-7"><ArticleCard article={priority[5]} /></div>
      </section>

      <section className="py-10">
        <div className="flex items-baseline justify-between border-b paper-rule pb-3">
          <h2 className="font-editorial text-2xl font-bold tracking-tight">Latest analysis</h2>
          <Link href="/search" className="focus-ring text-[11px] font-semibold uppercase tracking-wider text-stone-600 hover:text-ink">Browse the archive</Link>
        </div>
        <div className="grid gap-x-10 md:grid-cols-2">{priority.slice(6).map(article => <ArticleCard article={article} key={article.slug} />)}</div>
      </section>

      <section className="border-y paper-rule py-8">
        <p className="editorial-label">Sections</p>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {['Markets', 'Learn', 'Research', 'Businesses', 'Fin × Tech'].map(category => <div key={category}>
            <CategoryLabel category={category as typeof articles[number]['category']} />
            <p className="mt-2 text-xs text-stone-500">{articles.filter(article => article.category === category).length} pieces in the archive</p>
          </div>)}
        </div>
      </section>

      <section className="py-10">
        <h2 className="border-b paper-rule pb-3 font-editorial text-2xl font-bold tracking-tight">The archive</h2>
        <div className="grid gap-x-10 md:grid-cols-3">{rest.map(article => <ArticleCard article={article} key={article.slug} />)}</div>
      </section>
    </main>
  </>;
}
