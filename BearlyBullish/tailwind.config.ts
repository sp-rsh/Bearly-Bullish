import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { colors: { ink: '#0F172A', brand: '#15803D', paper: '#F8FAFC', marketup: '#047857', marketdown: '#B91C1C' }, fontFamily: { sans: ['Arial', 'Helvetica', 'sans-serif'], editorial: ['Georgia', 'Times New Roman', 'serif'] } } }, plugins: [] };
export default config;
