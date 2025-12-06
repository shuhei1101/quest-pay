import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core'
import '@mantine/core/styles.css'
import 'mantine-datatable/styles.layer.css'
import '@mantine/dates/styles.css'
import React from "react"
import { Providers } from "./providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Sample-Next-App",
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
