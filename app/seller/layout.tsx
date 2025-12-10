import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user.role !== 'SELLER' && session.user.role !== 'ADMIN')) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Link href="/seller/products">Products</Link>
              <Link href="/seller/upload">Upload</Link>
              <Link href="/seller/sales">Sales</Link>
              <Link href="/seller/payouts">Payouts</Link>
              <Link href="/seller/subscription">Subscription</Link>
              <Link href="/">Home</Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}

