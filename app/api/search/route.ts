import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type')
    const categoryId = searchParams.get('categoryId')

    const where: any = {
      status: 'APPROVED',
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ]
    }

    if (type) {
      where.type = type
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    // Fetch products with boost scores
    const products = await prisma.product.findMany({
      where,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
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
        // Owner products first (highest boost score)
        {
          boostScore: {
            score: 'desc',
          },
        },
        // Then by creation date
        {
          createdAt: 'desc',
        },
      ],
      take: 100,
    })

    // Sort products: owner products first, then by boost score, then by relevance
    const sortedProducts = products.sort((a, b) => {
      const aBoost = a.boostScore?.score || 0
      const bBoost = b.boostScore?.score || 0

      // Owner products always first
      if (aBoost >= 1000 && bBoost < 1000) return -1
      if (aBoost < 1000 && bBoost >= 1000) return 1

      // Then by boost score
      if (aBoost !== bBoost) return bBoost - aBoost

      // Then by number of sales
      return (
        (b._count.transactions || 0) - (a._count.transactions || 0)
      )
    })

    return NextResponse.json(sortedProducts)
  } catch (error) {
    console.error('Error searching products:', error)
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    )
  }
}

