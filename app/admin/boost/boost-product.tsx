'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BoostProduct({
  productId,
  currentScore,
}: {
  productId: string
  currentScore: number
}) {
  const router = useRouter()
  const [score, setScore] = useState(currentScore.toString())
  const [loading, setLoading] = useState(false)

  const updateBoostScore = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/boost/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: parseFloat(score) }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error updating boost score:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-4 items-center">
      <input
        type="number"
        value={score}
        onChange={(e) => setScore(e.target.value)}
        className="px-3 py-2 border rounded-md w-32"
        min="0"
      />
      <button
        onClick={updateBoostScore}
        disabled={loading}
        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Update Boost Score'}
      </button>
    </div>
  )
}

