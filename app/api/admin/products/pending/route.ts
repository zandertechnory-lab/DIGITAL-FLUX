import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const pendingProducts = await prisma.product.findMany({
            where: { status: 'PENDING' },
            include: {
                seller: { select: { name: true, email: true } },
                category: true,
            },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(pendingProducts)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch pending products' }, { status: 500 })
    }
}
