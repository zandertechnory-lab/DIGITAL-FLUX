import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'
import ProductActions from './product-actions'

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const products = await prisma.product.findMany({
    include: {
      seller: {
        select: {
          name: true,
          email: true,
        },
      },
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const pendingProducts = products.filter((p) => p.status === 'PENDING')

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Products</h1>

      {pendingProducts.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="font-semibold">
            {pendingProducts.length} product(s) pending approval
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">Seller</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="p-4">
                  <div>
                    <p className="font-medium">{product.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.type}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  {product.seller.name || product.seller.email}
                </td>
                <td className="p-4">{formatCurrency(product.price)}</td>
                <td className="p-4">
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
                </td>
                <td className="p-4">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <ProductActions productId={product.id} status={product.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

