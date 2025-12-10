import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const fileSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  s3Key: z.string(),
  type: z.enum(['VIDEO', 'PDF', 'ZIP', 'DOCX', 'IMAGE', 'OTHER']),
  size: z.number(),
  order: z.number().default(0),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    if (
      product.sellerId !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validated = fileSchema.parse(body)

    const file = await prisma.file.create({
      data: {
        ...validated,
        productId: params.id,
      },
    })

    return NextResponse.json(file, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating file:', error)
    return NextResponse.json(
      { error: 'Failed to create file' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if user has purchased this product
    let hasAccess = false

    if (session) {
      const purchase = await prisma.transaction.findFirst({
        where: {
          buyerId: session.user.id,
          productId: params.id,
          status: 'COMPLETED',
        },
      })
      hasAccess = !!purchase

      // Seller and admin always have access
      if (
        product.sellerId === session.user.id ||
        session.user.role === 'ADMIN'
      ) {
        hasAccess = true
      }
    }

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied. Please purchase this product first.' },
        { status: 403 }
      )
    }

    const files = await prisma.file.findMany({
      where: { productId: params.id },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(files)
  } catch (error) {
    console.error('Error fetching files:', error)
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    )
  }
}

