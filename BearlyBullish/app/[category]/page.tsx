import { notFound } from 'next/navigation';
import { ArticleCard, CategoryLabel } from '@/components/article-card';
import { MarketsOverview } from '@/components/markets-overview';
import { MarketStrip } from '@/components/market-strip';
import { articles, Category } from '@/content/articles';

const categories: Record<string, Category> = {
  markets: 'Markets',
  learn: 'Learn',
  research: 'Research',
  businesses: 'Businesses',
  'fin-tech': 'Fin × Tech',
};

export function generateStaticParams() {
  return Object.keys(categories).map(category => ({ category }));
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = categories[params.category];
  if (!category) notFound();

  const articlesInCategory = articles.filter(article => article.category === category);
  const description = category === 'Learn'
    ? 'Reference material and explainers for building financial confidence.'
    : `Reporting and analysis from the Bearly Bullish ${category} desk.`;

  return <>
    <MarketStrip />
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-7">
      <CategoryLabel category={category} />
      <h1 className="mt-3 font-editorial text-4xl font-bold tracking-tight sm:text-5xl">{category}</h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-stone-600">{description}</p>
      {category === 'Markets' && <MarketsOverview />}
      <div className="mt-10 border-b paper-rule">
        {articlesInCategory.map((article, index) => <ArticleCard key={article.slug} article={article} large={index === 0} />)}
      </div>
    </main>
  </>;
}
