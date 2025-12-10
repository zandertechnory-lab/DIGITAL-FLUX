import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import BoostProduct from './boost-product'

export default async function AdminBoostPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const products = await prisma.product.findMany({
    where: {
      status: 'APPROVED',
    },
    include: {
      seller: {
        select: {
          name: true,
          email: true,
        },
      },
      boostScore: true,
    },
    orderBy: [
      {
        boostScore: {
          score: 'desc',
        },
      },
      {
        createdAt: 'desc',
      },
    ],
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Boost Products</h1>
      <p className="text-muted-foreground mb-6">
        Adjust boost scores to control product ranking in search results. Higher
        scores appear first. Owner products automatically get a boost score of 1000.
      </p>

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="p-6 border rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{product.title}</h3>
                <p className="text-sm text-muted-foreground">
                  by {product.seller.name || product.seller.email}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Current Boost Score</p>
                <p className="text-2xl font-bold">
                  {product.boostScore?.score || 0}
                </p>
              </div>
            </div>
            <BoostProduct
              productId={product.id}
              currentScore={product.boostScore?.score || 0}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

