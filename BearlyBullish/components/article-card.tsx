import Link from 'next/link';
import { Article, categorySlug } from '@/content/articles';

const categoryClass: Record<Article['category'], string> = {
  Markets: 'market',
  Learn: 'learn',
  Research: 'research',
  Businesses: 'businesses',
  'Fin × Tech': 'fintech',
};

export function CategoryLabel({ category }: { category: Article['category'] }) {
  return <Link href={`/${categorySlug(category)}`} className={`category-label focus-ring ${categoryClass[category]}`}>{category}</Link>;
}

export function ArticleCard({ article, large = false }: { article: Article; large?: boolean }) {
  const articleUrl = article.slug === 'basic-vocabulary' ? '/learn/basic-vocabulary' : `/article/${article.slug}`;

  return <article className={`border-t paper-rule py-5 ${large ? 'sm:py-7' : ''}`}>
    <CategoryLabel category={article.category} />
    <Link href={articleUrl} className="focus-ring group mt-2 block">
      <h3 className={`font-editorial font-bold leading-[1.18] tracking-tight group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 ${large ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-[1.4rem]'}`}>
        {article.title}
      </h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">{article.excerpt}</p>
      <p className="mt-3 text-[11px] font-medium uppercase tracking-[.08em] text-stone-500">{article.readingTime}</p>
    </Link>
  </article>;
}
