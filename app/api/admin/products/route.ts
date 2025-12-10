import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const search = searchParams.get('search')

        const where: any = {}
        if (status && status !== 'ALL') {
            where.status = status
        }
        if (search) {
            where.title = { contains: search, mode: 'insensitive' }
        }

        const products = await prisma.product.findMany({
            where,
            include: {
                seller: { select: { name: true, email: true } },
                category: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        })

        return NextResponse.json(products)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { productId } = await request.json()

        await prisma.product.delete({
            where: { id: productId },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
    }
}
