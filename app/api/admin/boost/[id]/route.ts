import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const boostSchema = z.object({
  score: z.number().min(0),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validated = boostSchema.parse(body)

    // Check if boost score exists
    const existingBoost = await prisma.boostScore.findUnique({
      where: { productId: params.id },
    })

    if (existingBoost) {
      await prisma.boostScore.update({
        where: { productId: params.id },
        data: { score: validated.score },
      })
    } else {
      await prisma.boostScore.create({
        data: {
          productId: params.id,
          score: validated.score,
        },
      })
    }

    return NextResponse.json({ message: 'Boost score updated' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error updating boost score:', error)
    return NextResponse.json(
      { error: 'Failed to update boost score' },
      { status: 500 }
    )
  }
}

