import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const [
    totalRevenue,
    totalCommission,
    totalPayouts,
    topProducts,
    topSellers,
  ] = await Promise.all([
    prisma.transaction.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { commission: true },
    }),
    prisma.payout.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    }),
    prisma.product.findMany({
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
      orderBy: {
        transactions: {
          _count: 'desc',
        },
      },
      take: 10,
    }),
    prisma.user.findMany({
      where: { role: 'SELLER' },
      include: {
        _count: {
          select: {
            sales: true,
          },
        },
        sales: {
          where: { status: 'COMPLETED' },
          select: {
            sellerAmount: true,
          },
        },
      },
      take: 10,
    }),
  ])

  const topSellersWithRevenue = topSellers.map((seller) => ({
    ...seller,
    revenue: seller.sales.reduce((sum, s) => sum + s.sellerAmount, 0),
  })).sort((a, b) => b.revenue - a.revenue)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Platform Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 border rounded-lg">
          <h3 className="text-sm text-muted-foreground mb-2">Total Revenue</h3>
          <p className="text-2xl font-bold">
            {formatCurrency(totalRevenue._sum.amount || 0)}
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-sm text-muted-foreground mb-2">
            Total Commission
          </h3>
          <p className="text-2xl font-bold">
            {formatCurrency(totalCommission._sum.commission || 0)}
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-sm text-muted-foreground mb-2">Total Payouts</h3>
          <p className="text-2xl font-bold">
            {formatCurrency(totalPayouts._sum.amount || 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Top Products</h2>
          <div className="space-y-2">
            {topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex justify-between items-center py-2 border-b"
              >
                <div>
                  <p className="font-medium">
                    {index + 1}. {product.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {product._count.transactions} sales
                  </p>
                </div>
                <p className="font-semibold">{formatCurrency(product.price)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Top Sellers</h2>
          <div className="space-y-2">
            {topSellersWithRevenue.map((seller, index) => (
              <div
                key={seller.id}
                className="flex justify-between items-center py-2 border-b"
              >
                <div>
                  <p className="font-medium">
                    {index + 1}. {seller.name || seller.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {seller._count.sales} sales
                  </p>
                </div>
                <p className="font-semibold">{formatCurrency(seller.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

