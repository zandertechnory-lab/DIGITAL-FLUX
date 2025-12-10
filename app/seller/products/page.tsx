import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export default async function SellerProductsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const products = await prisma.product.findMany({
    where: { sellerId: session.user.id },
    include: {
      category: true,
      _count: {
        select: {
          transactions: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Products</h1>
        <Link
          href="/seller/upload"
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Upload New Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg overflow-hidden">
            {product.thumbnail && (
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">{formatCurrency(product.price)}</span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    product.status === 'APPROVED'
                      ? 'bg-green-100 text-green-800'
                      : product.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {product._count.transactions} sales
              </p>
              <Link
                href={`/seller/products/${product.id}`}
                className="block text-center px-4 py-2 border rounded hover:bg-muted"
              >
                Manage
              </Link>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No products yet</p>
          <Link
            href="/seller/upload"
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Upload Your First Product
          </Link>
        </div>
      )}
    </div>
  )
}

