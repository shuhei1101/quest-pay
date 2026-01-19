import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core'
import '@mantine/core/styles.css'
import 'mantine-datatable/styles.layer.css'
import '@mantine/dates/styles.css'
import React from "react"
import { Providers } from "./(core)/_components/providers"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "お小遣いクエストボード",
  description: "I made a mistake in the app name and called it React.",
  icons: {
    icon: '/public/favicon.ico'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <React.StrictMode>
      <html lang="ja" {...mantineHtmlProps}>
        <head>
          {/* PWAマニフェスト */}
          <link rel="manifest" href="/manifest.webmanifest" />
          {/* Apple Touch Icon */}
          <link rel="apple-touch-icon" href="/icon512_rounded.png" />
          {/* テーマカラー */}
          <meta name="theme-color" content="#8936FF" />
          {/* Apple PWA設定 */}
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="クエストペイ" />
          {/* iOSのSafe Area対応 */}
          <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
          <title>お小遣いクエストボード</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
          <ColorSchemeScript />
        </head>
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <Providers>{children}</Providers>
          </body>
      </html>
    </React.StrictMode>
  )
}
