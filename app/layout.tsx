import type { Metadata } from 'next'
import { Inter, Nunito } from 'next/font/google'
import './globals.css'
import { ConvexClientProvider } from '@/components/providers/convex-provider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'FinanKids - Aprende Finanzas Jugando',
  description: 'Herramienta de educación financiera para niños con simulación de vida adulta',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${nunito.variable} font-body`}>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  )
}
