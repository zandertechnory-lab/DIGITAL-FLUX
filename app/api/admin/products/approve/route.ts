import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const { productId, status } = await request.json()

        if (!productId || !['APPROVED', 'REJECTED'].includes(status)) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
        }

        const product = await prisma.product.update({
            where: { id: productId },
            data: { status },
        })

        return NextResponse.json(product)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to approve product' }, { status: 500 })
    }
}
