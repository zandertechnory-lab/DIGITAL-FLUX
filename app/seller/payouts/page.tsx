import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'

export default async function SellerPayoutsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const payouts = await prisma.payout.findMany({
    where: { sellerId: session.user.id },
    include: {
      transaction: {
        include: {
          product: {
            select: {
              title: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const pendingAmount = payouts
    .filter((p) => p.status === 'PENDING' || p.status === 'PROCESSING')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Payouts</h1>

      <div className="mb-8 p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Pending Payouts</h2>
        <p className="text-3xl font-bold">{formatCurrency(pendingAmount)}</p>
      </div>

      <div className="space-y-4">
        {payouts.map((payout) => (
          <div key={payout.id} className="p-6 border rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {payout.transaction?.product.title || 'N/A'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {payout.mobileMoneyProvider} - {payout.mobileMoneyNumber}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded text-sm ${
                  payout.status === 'COMPLETED'
                    ? 'bg-green-100 text-green-800'
                    : payout.status === 'PROCESSING'
                    ? 'bg-blue-100 text-blue-800'
                    : payout.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {payout.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-xl font-bold">{formatCurrency(payout.amount)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="text-sm">
                  {new Date(payout.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {payout.failureReason && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-700">
                  <strong>Error:</strong> {payout.failureReason}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {payouts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No payouts yet</p>
        </div>
      )}
    </div>
  )
}

