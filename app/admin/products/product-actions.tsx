'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProductActions({
  productId,
  status,
}: {
  productId: string
  status: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const updateStatus = async (newStatus: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error updating product:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      {status === 'PENDING' && (
        <>
          <button
            onClick={() => updateStatus('APPROVED')}
            disabled={loading}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => updateStatus('REJECTED')}
            disabled={loading}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
          >
            Reject
          </button>
        </>
      )}
      {status === 'APPROVED' && (
        <button
          onClick={() => updateStatus('REJECTED')}
          disabled={loading}
          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
        >
          Reject
        </button>
      )}
      {status === 'REJECTED' && (
        <button
          onClick={() => updateStatus('APPROVED')}
          disabled={loading}
          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
        >
          Approve
        </button>
      )}
    </div>
  )
}

