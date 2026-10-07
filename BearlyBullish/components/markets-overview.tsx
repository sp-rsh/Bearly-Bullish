'use client';
import { useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { MarketDataResponse } from '@/app/api/markets/route';

export function MarketsOverview() {
  const [data, setData] = useState<MarketDataResponse | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => { fetch('/api/markets').then((response) => response.ok ? response.json() : Promise.reject()).then(setData).catch(() => setUnavailable(true)); }, []);
  if (unavailable) return <section className="my-10 border-y paper-rule py-6"><p className="editorial-label">Market overview</p><p className="mt-3 text-sm text-stone-600">Market data is temporarily unavailable.</p></section>;
  if (!data) return <section className="my-10 border-y paper-rule py-6"><div className="h-3 w-28 animate-pulse rounded bg-stone-200"/><div className="mt-5 h-32 animate-pulse rounded bg-stone-100"/></section>;
  const benchmark = data.quotes.find((quote) => quote.symbol === '^GSPC');
  return <section className="my-10 border-y paper-rule py-6"><div className="flex flex-wrap items-baseline justify-between gap-3"><div><p className="editorial-label">Market overview</p><h2 className="mt-2 font-editorial text-2xl font-bold">S&P 500, one month</h2></div>{benchmark && <p className="text-sm text-stone-600"><span className="font-semibold text-stone-900">{benchmark.price.toLocaleString(undefined, {maximumFractionDigits: 2})}</span> <span className={benchmark.change >= 0 ? 'text-emerald-800' : 'text-red-800'}>{benchmark.change >= 0 ? '▲' : '▼'} {Math.abs(benchmark.changePercent).toFixed(2)}%</span></p>}</div>{data.history.length > 1 && <div className="mt-5 h-44"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data.history}><defs><linearGradient id="marketArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#27714d" stopOpacity={0.16}/><stop offset="100%" stopColor="#27714d" stopOpacity={0}/></linearGradient></defs><Tooltip contentStyle={{border:'1px solid #d5d0c7', borderRadius:6, background:'#f5f3ee', fontSize:12}} labelStyle={{color:'#68655f'}} formatter={(value) => [Number(value).toLocaleString(undefined,{maximumFractionDigits:2}), 'Close']}/><Area type="monotone" dataKey="price" stroke="#27714d" strokeWidth={1.5} fill="url(#marketArea)"/></AreaChart></ResponsiveContainer></div>}<p className="mt-3 text-[11px] text-stone-500">Latest available daily closes. Market data supplied by Yahoo Finance.</p></section>;
}
