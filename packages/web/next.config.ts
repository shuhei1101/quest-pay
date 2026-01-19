import type { NextConfig } from 'next'

// Capacitorビルド用の静的エクスポート設定
const isCapacitor = process.env.NEXT_PUBLIC_PLATFORM === 'capacitor'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // Capacitor用に静的エクスポートを有効化
  ...(isCapacitor && { output: 'export' }),
  images: {
    unoptimized: true,
  },
  // セキュリティヘッダーの設定
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ]
  },
}

export default nextConfig
