import type { Metadata } from 'next'
import { EB_Garamond, Inter, JetBrains_Mono } from 'next/font/google'
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
  description: 'AI-powered executive assistant for high-net-worth professionals',
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
      </body>
    </html>
  )
}
