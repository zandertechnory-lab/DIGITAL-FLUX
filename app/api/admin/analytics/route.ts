import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        // Get data for the last 7 days
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const transactions = await prisma.transaction.findMany({
            where: {
                createdAt: { gte: sevenDaysAgo },
                status: 'COMPLETED',
            },
            select: {
                amount: true,
                createdAt: true,
            },
        })

        // Group by day
        const revenueByDay = transactions.reduce((acc: any, txn) => {
            const day = txn.createdAt.toISOString().split('T')[0]
            if (!acc[day]) acc[day] = 0
            acc[day] += txn.amount
            return acc
        }, {})

        const chartData = Object.entries(revenueByDay).map(([date, revenue]) => ({
            date,
            revenue,
        }))

        // Product distribution by category
        const productsByCategory = await prisma.product.groupBy({
            by: ['categoryId'],
            _count: true,
            where: { status: 'APPROVED' },
        })

        const categoryData = await Promise.all(
            productsByCategory.map(async (item) => {
                const category = item.categoryId
                    ? await prisma.category.findUnique({ where: { id: item.categoryId } })
                    : null
                return {
                    name: category?.name || 'Uncategorized',
                    count: item._count,
                }
            })
        )

        return NextResponse.json({
            revenueByDay: chartData,
            productsByCategory: categoryData,
        })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
    }
}
