import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { BrandLogo } from '@/components/brand-logo'
import { SiteHeader } from '@/components/site-header'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { cookies } from 'next/headers'
import { LanguageSwitcher } from '@/components/language-switcher'
import { CurrencySwitcher } from '@/components/currency-switcher'
import { Footer } from '@/components/footer'
import { getDictionary } from '@/lib/i18n'
import { FloatingCharacters } from '@/components/floating-characters'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Digital Flux - Digital Marketplace',
  description: 'Buy and sell digital products, courses, events, and services',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  const lang = cookies().get('lang')?.value === 'fr' ? 'fr' : 'en'
  const dict = getDictionary(lang)

  const isSeller = session?.user?.role === 'SELLER' || session?.user?.role === 'ADMIN'
  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <html lang={lang}>
      <body className={`${inter.className} overflow-x-hidden`}>
        <div className="flex min-h-screen flex-col">
          {/* Upgrade Banner - Only for signed-in users */}
          {session && (
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 text-center">
              <div className="container mx-auto flex items-center justify-center gap-4">
                <span className="text-sm md:text-base font-medium">
                  ✨ Upgrade to <strong>Digital Flux Pro</strong> and unlock premium features!
                </span>
                <a
                  href="/pricing"
                  className="bg-white text-purple-600 px-4 py-1.5 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors"
                >
                  Upgrade Now
                </a>
              </div>
            </div>
          )}



          <SiteHeader
            session={session}
            isSeller={isSeller}
            isAdmin={isAdmin}
            dict={dict}
          />
          <div className="flex-1 relative z-10">
            <Providers>{children}</Providers>
          </div>
          <FloatingCharacters />
          <Footer />
        </div>
      </body>
    </html>
  )
}

