import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

import { cookies } from 'next/headers'
import { getDictionary } from '@/lib/i18n'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const lang = cookies().get('lang')?.value === 'fr' ? 'fr' : 'en'
  const dict = getDictionary(lang)

  if (!session) {
    redirect('/auth/signin')
  }

  const purchases = await prisma.transaction.findMany({
    where: {
      buyerId: session.user.id,
      status: 'COMPLETED',
    },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          thumbnail: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  })

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{dict.dashboard.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/browse"
            className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{dict.dashboard.browseCardTitle}</h2>
            <p className="text-muted-foreground">
              {dict.dashboard.browseCardDesc}
            </p>
          </Link>

          {session.user.role === 'SELLER' && (
            <Link
              href="/seller"
              className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{dict.dashboard.sellerCardTitle}</h2>
              <p className="text-muted-foreground">
                {dict.dashboard.sellerCardDesc}
              </p>
            </Link>
          )}

          {session.user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{dict.dashboard.adminCardTitle}</h2>
              <p className="text-muted-foreground">
                {dict.dashboard.adminCardDesc}
              </p>
            </Link>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">{dict.dashboard.purchasesTitle}</h2>
          {purchases.length === 0 ? (
            <p className="text-muted-foreground">{dict.dashboard.noPurchases}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchases.map((purchase) => (
                <Link
                  key={purchase.id}
                  href={`/product/${purchase.productId}`}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {purchase.product.thumbnail && (
                    <img
                      src={purchase.product.thumbnail}
                      alt={purchase.product.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">
                      {purchase.product.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {dict.dashboard.purchasedOn}{' '}
                      {new Date(purchase.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

