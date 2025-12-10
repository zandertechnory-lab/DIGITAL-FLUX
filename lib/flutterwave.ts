import Flutterwave from 'flutterwave-node-v3'
import crypto from 'crypto'

const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY || 'FLW_PUBLIC_KEY_PLACEHOLDER',
  process.env.FLW_SECRET_KEY || 'FLW_SECRET_KEY_PLACEHOLDER'
)

export interface PaymentData {
  tx_ref: string
  amount: number
  currency: string
  payment_options: string
  redirect_url: string
  customer: {
    email: string
    name: string
    phone_number?: string
  }
  customizations?: {
    title?: string
    description?: string
    logo?: string
  }
  meta?: Record<string, any>
}

export interface MobileMoneyPaymentData {
  tx_ref: string
  amount: number
  currency: string
  network: 'MTN' | 'ORANGE'
  email: string
  phone_number: string
  fullname: string
  client_ip?: string
  device_fingerprint?: string
}

export interface PayoutData {
  account_bank: string
  account_number: string
  amount: number
  currency: string
  narration: string
  reference: string
  beneficiary_name?: string
}

export async function initializePayment(data: PaymentData) {
  try {
    const response = await flw.Payment.initiate(data)
    return response
  } catch (error) {
    console.error('Flutterwave payment initialization error:', error)
    throw error
  }
}

export async function initializeMobileMoneyPayment(data: MobileMoneyPaymentData) {
  try {
    const response = await flw.MobileMoney.mobile_money(data)
    return response
  } catch (error) {
    console.error('Flutterwave mobile money payment error:', error)
    throw error
  }
}

export async function verifyTransaction(transactionId: string) {
  try {
    const response = await flw.Transaction.verify({ id: transactionId })
    return response
  } catch (error) {
    console.error('Flutterwave transaction verification error:', error)
    throw error
  }
}

export async function createPayout(data: PayoutData) {
  try {
    const response = await flw.Transfer.initiate(data)
    return response
  } catch (error) {
    console.error('Flutterwave payout error:', error)
    throw error
  }
}

export async function verifyPayout(transferId: string) {
  try {
    const response = await flw.Transfer.get_a_transfer({ id: transferId })
    return response
  } catch (error) {
    console.error('Flutterwave payout verification error:', error)
    throw error
  }
}

export function verifyWebhookHash(payload: string, hash: string): boolean {
  const secretHash = process.env.FLW_WEBHOOK_HASH!
  const computedHash = crypto
    .createHash('sha256')
    .update(payload + secretHash)
    .digest('hex')
  return computedHash === hash
}

