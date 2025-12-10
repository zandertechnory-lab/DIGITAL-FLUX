import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { generateSlug } from '@/lib/utils'

const productSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  type: z.enum(['COURSE', 'DIGITAL_PRODUCT', 'EVENT', 'SERVICE', 'MASTERCLASS']),
  categoryId: z.string().optional(),
  thumbnail: z.string().url().optional(),
  courseMetadata: z.object({
    duration: z.number().optional(),
    level: z.string().optional(),
    language: z.string().optional(),
    instructor: z.string().optional(),
  }).optional(),
  eventMetadata: z.object({
    eventDate: z.string().datetime(),
    location: z.string().optional(),
    isOnline: z.boolean().optional(),
    maxAttendees: z.number().optional(),
  }).optional(),
  serviceMetadata: z.object({
    duration: z.number().optional(),
    deliveryTime: z.string().optional(),
    isRecurring: z.boolean().optional(),
  }).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const categoryId = searchParams.get('categoryId')
    const status = searchParams.get('status') || 'APPROVED'
    const sellerId = searchParams.get('sellerId')

    const where: any = {
      status: status as any,
    }

    if (type) {
      where.type = type
    }
    if (categoryId) {
      where.categoryId = categoryId
    }
    if (sellerId) {
      where.sellerId = sellerId
    }

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
        courseMetadata: true,
        eventMetadata: true,
        serviceMetadata: true,
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

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'SELLER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validated = productSchema.parse(body)

    const slug = generateSlug(validated.title)
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this title already exists' },
        { status: 400 }
      )
    }

    const productData: any = {
      title: validated.title,
      slug,
      description: validated.description,
      price: validated.price,
      type: validated.type,
      sellerId: session.user.id,
      status: session.user.role === 'ADMIN' ? 'APPROVED' : 'PENDING',
      categoryId: validated.categoryId,
      thumbnail: validated.thumbnail,
    }

    if (validated.type === 'COURSE' && validated.courseMetadata) {
      productData.courseMetadata = {
        create: validated.courseMetadata,
      }
    }

    if (validated.type === 'EVENT' && validated.eventMetadata) {
      productData.eventMetadata = {
        create: {
          ...validated.eventMetadata,
          eventDate: new Date(validated.eventMetadata.eventDate),
        },
      }
    }

    if (validated.type === 'SERVICE' && validated.serviceMetadata) {
      productData.serviceMetadata = {
        create: validated.serviceMetadata,
      }
    }

    const product = await prisma.product.create({
      data: productData,
      include: {
        courseMetadata: true,
        eventMetadata: true,
        serviceMetadata: true,
      },
    })

    // Create boost score entry
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    })

    await prisma.boostScore.create({
      data: {
        productId: product.id,
        score: sellerProfile?.isOwner ? 1000 : 0, // Owner products get high boost
        ...(sellerProfile?.isOwner && { ownerId: session.user.id }),
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

