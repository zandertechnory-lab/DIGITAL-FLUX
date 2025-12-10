import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTransaction, verifyWebhookHash } from '@/lib/flutterwave'
import { createPayout } from '@/lib/flutterwave'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('verif-hash')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      )
    }

    // Verify webhook hash
    if (!verifyWebhookHash(body, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const data = JSON.parse(body)
    const { event, data: eventData } = data

    if (event === 'charge.completed') {
      const txRef = eventData.tx_ref
      const status = eventData.status

      // Find transaction
      const transaction = await prisma.transaction.findFirst({
        where: { flutterwaveRef: txRef },
        include: {
          seller: {
            include: {
              sellerProfile: true,
            },
          },
          product: true,
        },
      })

      if (!transaction) {
        return NextResponse.json({ message: 'Transaction not found' })
      }

      if (status === 'successful') {
        // Verify transaction with Flutterwave
        const verification = await verifyTransaction(eventData.id.toString())

        if (verification.data.status === 'successful') {
          // Update transaction status
          await prisma.transaction.update({
            where: { id: transaction.id },
            data: {
              status: 'COMPLETED',
              flutterwaveTxId: eventData.id.toString(),
            },
          })

          // Create payout record
          const sellerProfile = transaction.seller.sellerProfile

          if (sellerProfile?.mobileMoneyNumber && sellerProfile?.mobileMoneyProvider) {
            const payout = await prisma.payout.create({
              data: {
                sellerId: transaction.sellerId,
                transactionId: transaction.id,
                amount: transaction.sellerAmount,
                status: 'PENDING',
                mobileMoneyNumber: sellerProfile.mobileMoneyNumber,
                mobileMoneyProvider: sellerProfile.mobileMoneyProvider,
              },
            })

            // Initiate payout
            try {
              const payoutData = {
                account_bank: sellerProfile.mobileMoneyProvider === 'MTN' ? 'MTN' : 'ORANGE',
                account_number: sellerProfile.mobileMoneyNumber,
                amount: transaction.sellerAmount,
                currency: 'XAF',
                narration: `Payout for ${transaction.product.title}`,
                reference: `PAYOUT-${payout.id}`,
                beneficiary_name: transaction.seller.name || transaction.seller.email,
              }

              const payoutResponse = await createPayout(payoutData)

              await prisma.payout.update({
                where: { id: payout.id },
                data: {
                  flutterwavePayoutId: payoutResponse.data.id.toString(),
                  flutterwaveRef: payoutResponse.data.reference,
                  status: 'PROCESSING',
                },
              })
            } catch (payoutError) {
              console.error('Payout error:', payoutError)
              // Payout will be retried manually
            }
          }
        }
      } else if (status === 'failed') {
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'FAILED',
            flutterwaveTxId: eventData.id.toString(),
          },
        })
      }
    }

    return NextResponse.json({ message: 'Webhook processed' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

