import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
export const metadata: Metadata = { title: { default: "Bearly Bullish: Sparsh's Financial HQ", template: '%s | Bearly Bullish' }, description: 'Independent reporting and explainers on markets, business, finance and technology.', metadataBase: new URL('https://bearlybullish.example'), icons: { icon: '/icon.svg' }, openGraph: { title: "Bearly Bullish: Sparsh's Financial HQ", description: 'Markets, business, finance and technology.' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><Header />{children}<Footer /></body></html>; }
