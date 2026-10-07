import { CategoryLabel } from '@/components/article-card';
import { Discussion } from '@/components/discussion';
import { GlossaryBrowser } from '@/components/glossary-browser';

export default function BasicVocabularyPage() {
  return <main className="mx-auto max-w-5xl px-5 py-10 sm:px-7">
    <CategoryLabel category="Learn" />
    <h1 className="mt-3 font-editorial text-4xl font-bold tracking-tight sm:text-5xl">BASIC VOCABULARY</h1>
    <p className="mt-3 text-lg text-stone-600">The very basic terms you need to know to get started!</p>
    <p className="mt-6 text-sm text-stone-600">
      Head to <a className="focus-ring font-semibold text-stone-900 underline underline-offset-4" href="https://www.investopedia.com/dictionary/" target="_blank" rel="noreferrer">Investopedia</a> for more advanced terminology.
    </p>
    <GlossaryBrowser />
    <Discussion articleSlug="basic-vocabulary" />
  </main>;
}
