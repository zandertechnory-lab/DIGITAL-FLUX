import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { initializePayment, initializeMobileMoneyPayment } from '@/lib/flutterwave'
import { generateTxRef, calculateCommission } from '@/lib/utils'
import { z } from 'zod'

const paymentSchema = z.object({
  productId: z.string(),
  paymentMethod: z.enum(['card', 'mobile_money_mtn', 'mobile_money_orange']),
  phoneNumber: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validated = paymentSchema.parse(body)

    // Get product
    const product = await prisma.product.findUnique({
      where: { id: validated.productId },
      include: {
        seller: {
          include: {
            sellerProfile: true,
            subscription: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    if (product.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Product is not available for purchase' },
        { status: 400 }
      )
    }

    // Check if already purchased
    const existingPurchase = await prisma.transaction.findFirst({
      where: {
        buyerId: session.user.id,
        productId: validated.productId,
        status: 'COMPLETED',
      },
    })

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'You already own this product' },
        { status: 400 }
      )
    }

    // Calculate commission
    const isOwner = product.seller.sellerProfile?.isOwner || false
    const isPro = product.seller.subscription?.plan === 'PRO' && product.seller.subscription?.isActive
    const { commission, sellerAmount } = calculateCommission(
      product.price,
      isOwner,
      isPro || false
    )

    // Create transaction record
    const txRef = generateTxRef()
    const transaction = await prisma.transaction.create({
      data: {
        buyerId: session.user.id,
        sellerId: product.sellerId,
        productId: validated.productId,
        amount: product.price,
        commission,
        sellerAmount,
        status: 'PENDING',
        flutterwaveRef: txRef,
        paymentMethod: validated.paymentMethod,
      },
    })

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Initialize payment based on method
    if (validated.paymentMethod === 'card') {
      const paymentData = {
        tx_ref: txRef,
        amount: product.price,
        currency: 'XAF',
        payment_options: 'card',
        redirect_url: `${process.env.NEXTAUTH_URL}/payment/callback`,
        customer: {
          email: user.email,
          name: user.name || user.email,
        },
        customizations: {
          title: 'Digital Flux Purchase',
          description: product.title,
        },
        meta: {
          transactionId: transaction.id,
          productId: product.id,
        },
      }

      const response = await initializePayment(paymentData)
      return NextResponse.json({
        transactionId: transaction.id,
        paymentLink: response.data.link,
        txRef,
      })
    } else {
      // Mobile Money
      if (!validated.phoneNumber) {
        return NextResponse.json(
          { error: 'Phone number is required for mobile money' },
          { status: 400 }
        )
      }

      const network = (validated.paymentMethod === 'mobile_money_mtn' ? 'MTN' : 'ORANGE') as 'MTN' | 'ORANGE'

      const mobileMoneyData = {
        tx_ref: txRef,
        amount: product.price,
        currency: 'XAF',
        network,
        email: user.email!,
        phone_number: validated.phoneNumber!,
        fullname: user.name || user.email || 'Customer',
      }

      const response = await initializeMobileMoneyPayment(mobileMoneyData)
      return NextResponse.json({
        transactionId: transaction.id,
        paymentData: response.data,
        txRef,
      })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error initializing payment:', error)
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    )
  }
}

