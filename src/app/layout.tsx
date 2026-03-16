import type { Metadata } from 'next'
import { EB_Garamond, Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/providers/theme-provider'
import { ToastProvider } from '@/providers/toast-provider'
import { ToastRenderer } from '@/providers/toast-renderer'
import './globals.css'

const garamond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Regent — AI Executive Assistant',
  description: 'The AI secretary that never sleeps. Regent processes your email 24/7, drafts intelligent replies, manages calendars, extracts tasks, and delivers briefings — replacing your $78K/year executive assistant.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Regent — AI Executive Assistant',
    description: 'The AI secretary that never sleeps. Email processing, smart drafts, behavior intelligence, and multi-channel briefings for executives.',
    siteName: 'Regent',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Regent — AI Executive Assistant',
    description: 'The AI secretary that never sleeps. Replace your $78K/year EA with AI that works 24/7.',
  },
  applicationName: 'Regent',
  keywords: ['AI assistant', 'executive assistant', 'email AI', 'email automation', 'AI secretary', 'email management'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${garamond.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="dark">
          <ToastProvider>
            {children}
            <ToastRenderer />
          </ToastProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
