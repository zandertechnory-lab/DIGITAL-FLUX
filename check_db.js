const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    console.log('Starting checks...')
    try {
        // Check DB connection
        console.log('Connecting to Prisma...')
        await prisma.$connect()
        console.log('Connected to DB successfully.')

        // Check basic query
        const count = await prisma.user.count()
        console.log('User count:', count)

        // Check bcrypt
        console.log('Testing bcrypt...')
        const hash = await bcrypt.hash('testpassword', 10)
        console.log('Bcrypt hash generated successfully.')

    } catch (e) {
        console.error('Check failed:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
