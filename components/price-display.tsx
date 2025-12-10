'use client'

import { useCurrency, formatPrice } from './currency-switcher'
import { useEffect, useState } from 'react'

export function PriceDisplay({ amount, className = '' }: { amount: number, className?: string }) {
    const currency = useCurrency()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        // Default to USD server-side/initial render to match
        return <span className={className}>${amount.toFixed(2)}</span>
    }

    return (
        <span className={className}>
            {formatPrice(amount, currency)}
        </span>
    )
}
