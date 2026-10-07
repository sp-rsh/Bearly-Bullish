import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArticleCard, CategoryLabel } from '@/components/article-card';
import { Discussion } from '@/components/discussion';
import { articles, getArticle } from '@/content/articles';

export function generateStaticParams() {
  return articles.map(article => ({ slug: article.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  return { title: article?.title || 'Article', description: article?.excerpt };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) notFound();
  if (article.slug === 'basic-vocabulary') redirect('/learn/basic-vocabulary');

  const related = articles
    .filter(item => item.slug !== article.slug && (item.category === article.category || item.tag === article.tag))
    .slice(0, 3);
  const categoryUrl = article.category === 'Fin × Tech' ? '/fin-tech' : `/${article.category.toLowerCase()}`;

  return <main className="mx-auto max-w-5xl px-5 py-10 sm:px-7">
    <Link href={categoryUrl} className="focus-ring text-[11px] font-semibold uppercase tracking-wider text-stone-600 hover:text-stone-950">← {article.category}</Link>
    <article className="mt-7 max-w-3xl">
      <CategoryLabel category={article.category} />
      <h1 className="mt-3 font-editorial text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl">{article.title}</h1>
      <p className="mt-5 text-lg leading-8 text-stone-600">{article.excerpt}</p>
      <p className="mt-7 border-y paper-rule py-3 text-[11px] font-medium uppercase tracking-wider text-stone-500">Bearly Bullish Editorial Desk · {article.readingTime}</p>
      <div className="prose-copy mt-9">{article.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
    </article>
    <Discussion articleSlug={article.slug} />
    <section className="mt-16 border-t paper-rule pt-6">
      <h2 className="font-editorial text-2xl font-bold">Related reading</h2>
      <div className="mt-3 grid gap-x-8 md:grid-cols-3">{related.map(item => <ArticleCard article={item} key={item.slug} />)}</div>
    </section>
  </main>;
}
