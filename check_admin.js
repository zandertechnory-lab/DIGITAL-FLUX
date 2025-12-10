const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('Checking for admin users...')
    try {
        const adminCount = await prisma.user.count({
            where: {
                role: 'ADMIN'
            }
        })

        console.log(`Found ${adminCount} admin user(s).`)

        if (adminCount > 0) {
            const admins = await prisma.user.findMany({
                where: { role: 'ADMIN' },
                select: { email: true, name: true }
            })
            console.log('Admin users:', JSON.stringify(admins, null, 2))
        }

    } catch (e) {
        console.error('Check failed:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
