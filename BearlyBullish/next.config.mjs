/** @type {import('next').NextConfig} */
// A dedicated output folder avoids OneDrive's invalid junction metadata in the pre-existing .next cache.
const nextConfig = { reactStrictMode: true, distDir: process.env.NODE_ENV === 'development' ? '.next-bearly-bullish-dev' : '.next-bearly-bullish' };
export default nextConfig;
