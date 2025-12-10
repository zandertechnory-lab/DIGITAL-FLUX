import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const [
            totalUsers,
            totalSellers,
            totalProducts,
            pendingProducts,
            totalRevenue,
            completedTransactions,
            recentTransactions,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: 'SELLER' } }),
            prisma.product.count(),
            prisma.product.count({ where: { status: 'PENDING' } }),
            prisma.transaction.aggregate({
                where: { status: 'COMPLETED' },
                _sum: { amount: true },
            }),
            prisma.transaction.count({ where: { status: 'COMPLETED' } }),
            prisma.transaction.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    buyer: { select: { name: true, email: true } },
                    product: { select: { title: true } },
                },
            }),
        ])

        return NextResponse.json({
            stats: {
                totalUsers,
                totalSellers,
                totalProducts,
                pendingProducts,
                totalRevenue: totalRevenue._sum.amount || 0,
                completedTransactions,
            },
            recentTransactions,
        })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch admin data' }, { status: 500 })
    }
}
