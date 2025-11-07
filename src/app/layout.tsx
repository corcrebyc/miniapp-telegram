import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Inicializar bot do Telegram
import '@/lib/bot-init'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Miríade',
  description: 'Conecte-se com modelos virtuais únicos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}