import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import localFont from "next/font/local"

import { Geist as V0_Font_Geist, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _geist = V0_Font_Geist({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

const frutiger = localFont({
  src: [
    {
      path: "../public/fonts/Frutiger-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Frutiger-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-frutiger",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Black Forest",
  description: "Квест-пространство Black Forest",
  generator: "v0.app",
  openGraph: {
    title: "Black Forest",
    description: "Квест-пространство Black Forest",
    type: "website",
    locale: "ru_RU",
    siteName: "Black Forest",
  },
  icons: {
    icon: [
      { url: "/favicon-light.png", type: "image/png", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-dark.png", type: "image/png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${frutiger.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
