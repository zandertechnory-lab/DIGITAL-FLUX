'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function PurchaseButton({ productId }: { productId: string }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<
    'card' | 'mobile_money_mtn' | 'mobile_money_orange'
  >('card')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [error, setError] = useState('')

  const handlePurchase = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          paymentMethod,
          phoneNumber: paymentMethod.includes('mobile_money') ? phoneNumber : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to initialize payment')
        return
      }

      if (paymentMethod === 'card' && data.paymentLink) {
        window.location.href = data.paymentLink
      } else {
        // Mobile money - show instructions
        alert(
          `Payment initiated. Please complete the payment on your phone. Transaction ID: ${data.txRef}`
        )
        router.push(`/payment/status?txRef=${data.txRef}`)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) =>
            setPaymentMethod(
              e.target.value as 'card' | 'mobile_money_mtn' | 'mobile_money_orange'
            )
          }
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="card">Card Payment</option>
          <option value="mobile_money_mtn">MTN Mobile Money</option>
          <option value="mobile_money_orange">Orange Money</option>
        </select>
      </div>

      {paymentMethod.includes('mobile_money') && (
        <div>
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="6XX XXX XXX"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
      )}

      <button
        onClick={handlePurchase}
        disabled={loading}
        className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Purchase Now'}
      </button>
    </div>
  )
}

