import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

async function getProducts(searchQuery: string | null) {
  const where: any = {
    status: 'APPROVED',
  }

  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery, mode: 'insensitive' } },
      { description: { contains: searchQuery, mode: 'insensitive' } },
    ]
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      seller: {
        select: {
          name: true,
        },
      },
      category: true,
      boostScore: true,
      _count: {
        select: {
          transactions: true,
        },
      },
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
    take: 50,
  })

  // Sort: owner products first
  return products.sort((a, b) => {
    const aBoost = a.boostScore?.score || 0
    const bBoost = b.boostScore?.score || 0
    if (aBoost >= 1000 && bBoost < 1000) return -1
    if (aBoost < 1000 && bBoost >= 1000) return 1
    return bBoost - aBoost
  })
}

export default async function ProductGrid({
  searchParams,
  dict,
}: {
  searchParams: { q?: string }
  dict: any
}) {
  const query = searchParams?.q || null
  const products = await getProducts(query)

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{dict.browse.noProducts}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/product/${product.id}`}
          className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          {product.thumbnail && (
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {product.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {product.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">
                {formatCurrency(product.price)}
              </span>
              {product.boostScore && product.boostScore.score >= 1000 && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                  {dict.browse.featured}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {product._count.transactions} {dict.browse.sales}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}

