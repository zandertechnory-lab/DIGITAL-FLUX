import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

import { cookies } from 'next/headers'
import { getDictionary } from '@/lib/i18n'

export default async function SellerDashboard() {
  const session = await getServerSession(authOptions)
  const lang = cookies().get('lang')?.value === 'fr' ? 'fr' : 'en'
  const dict = getDictionary(lang)

  if (!session) {
    redirect('/auth/signin')
  }

  const stats = await prisma.transaction.groupBy({
    by: ['status'],
    where: {
      sellerId: session.user.id,
    },
    _sum: {
      sellerAmount: true,
      amount: true,
    },
    _count: true,
  })

  const totalRevenue = stats
    .filter((s) => s.status === 'COMPLETED')
    .reduce((sum, s) => sum + (s._sum.sellerAmount || 0), 0)

  const totalSales = stats
    .filter((s) => s.status === 'COMPLETED')
    .reduce((sum, s) => sum + (s._count || 0), 0)

  const products = await prisma.product.count({
    where: { sellerId: session.user.id },
  })

  const pendingPayouts = await prisma.payout.aggregate({
    where: {
      sellerId: session.user.id,
      status: { in: ['PENDING', 'PROCESSING'] },
    },
    _sum: {
      amount: true,
    },
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{dict.seller.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 border rounded-lg">
          <h3 className="text-sm text-muted-foreground mb-2">{dict.seller.totalRevenue}</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-sm text-muted-foreground mb-2">{dict.seller.totalSales}</h3>
          <p className="text-2xl font-bold">{totalSales}</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-sm text-muted-foreground mb-2">{dict.seller.products}</h3>
          <p className="text-2xl font-bold">{products}</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-sm text-muted-foreground mb-2">{dict.seller.pendingPayouts}</h3>
          <p className="text-2xl font-bold">
            {formatCurrency(pendingPayouts._sum.amount || 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{dict.seller.quickActions}</h2>
          <div className="space-y-2">
            <Link
              href="/seller/upload"
              className="block px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              {dict.seller.uploadProduct}
            </Link>
            <Link
              href="/seller/products"
              className="block px-4 py-2 border rounded hover:bg-muted"
            >
              {dict.seller.manageProducts}
            </Link>
            <Link
              href="/seller/sales"
              className="block px-4 py-2 border rounded hover:bg-muted"
            >
              {dict.seller.viewSales}
            </Link>
          </div>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{dict.seller.recentSales}</h2>
          <RecentSales sellerId={session.user.id} dict={dict} />
        </div>
      </div>
    </div>
  )
}

async function RecentSales({ sellerId, dict }: { sellerId: string; dict: any }) {
  const sales = await prisma.transaction.findMany({
    where: {
      sellerId,
      status: 'COMPLETED',
    },
    include: {
      product: {
        select: {
          title: true,
        },
      },
      buyer: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  })

  if (sales.length === 0) {
    return <p className="text-muted-foreground">{dict.seller.noSales}</p>
  }

  return (
    <div className="space-y-2">
      {sales.map((sale) => (
        <div key={sale.id} className="flex justify-between items-center py-2 border-b">
          <div>
            <p className="font-medium">{sale.product.title}</p>
            <p className="text-sm text-muted-foreground">
              {sale.buyer.name || sale.buyer.email}
            </p>
          </div>
          <p className="font-semibold">{formatCurrency(sale.sellerAmount)}</p>
        </div>
      ))}
    </div>
  )
}

