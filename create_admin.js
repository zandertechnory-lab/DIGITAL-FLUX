const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    console.log('Creating admin user...')
    try {
        const email = 'admin@digitalflux.com'
        const password = 'admin123'
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                name: 'Admin User',
                password: hashedPassword,
                role: 'ADMIN',
                emailVerified: new Date(),
            },
        })

        console.log(`Admin user created/verified: ${user.email}`)

    } catch (e) {
        console.error('Creation failed:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
