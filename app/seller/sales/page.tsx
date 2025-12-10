import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'

export default async function SellerSalesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const sales = await prisma.transaction.findMany({
    where: { sellerId: session.user.id },
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
  })

  const totalRevenue = sales
    .filter((s) => s.status === 'COMPLETED')
    .reduce((sum, s) => sum + s.sellerAmount, 0)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Sales</h1>

      <div className="mb-8 p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Total Revenue</h2>
        <p className="text-3xl font-bold">{formatCurrency(totalRevenue)}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">Buyer</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">Commission</th>
              <th className="text-left p-4">Your Earnings</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b">
                <td className="p-4">{sale.product.title}</td>
                <td className="p-4">{sale.buyer.name || sale.buyer.email}</td>
                <td className="p-4">{formatCurrency(sale.amount)}</td>
                <td className="p-4">{formatCurrency(sale.commission)}</td>
                <td className="p-4 font-semibold">
                  {formatCurrency(sale.sellerAmount)}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      sale.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : sale.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {sale.status}
                  </span>
                </td>
                <td className="p-4">
                  {new Date(sale.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sales.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No sales yet</p>
        </div>
      )}
    </div>
  )
}

