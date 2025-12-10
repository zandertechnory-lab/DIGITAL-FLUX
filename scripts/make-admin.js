const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function createAdmin() {
    const ADMIN_EMAIL = 'digitalflux237@gmail.com'
    const ADMIN_PASSWORD = 'digitalflux123'

    try {
        // Check if user already exists
        let user = await prisma.user.findUnique({
            where: { email: ADMIN_EMAIL }
        })

        if (user) {
            // User exists, just update to ADMIN
            user = await prisma.user.update({
                where: { email: ADMIN_EMAIL },
                data: { role: 'ADMIN' }
            })
            console.log('✅ Existing user upgraded to ADMIN!')
        } else {
            // Create new admin user
            const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)
            user = await prisma.user.create({
                data: {
                    email: ADMIN_EMAIL,
                    password: hashedPassword,
                    name: 'Digital Flux Admin',
                    role: 'ADMIN',
                    emailVerified: new Date()
                }
            })
            console.log('✅ New ADMIN account created!')
        }

        console.log('\n📧 Email:', user.email)
        console.log('🔑 Password: digitalflux123')
        console.log('👑 Role:', user.role)
        console.log('\n🎉 You can now access the admin panel at /admin')

    } catch (error) {
        console.error('❌ Error:', error.message)
    } finally {
        await prisma.$disconnect()
    }
}

createAdmin()
