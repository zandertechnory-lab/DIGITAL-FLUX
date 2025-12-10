'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const CURRENCIES = [
    { code: 'USD', symbol: '$', label: 'USD' },
    { code: 'NGN', symbol: '₦', label: 'NGN' },
    { code: 'GBP', symbol: '£', label: 'GBP' },
    { code: 'XAF', symbol: 'FCFA', label: 'XAF (Cameroon)' },
]

export function CurrencySwitcher() {
    const router = useRouter()
    // Allow null initially to avoid hydration mismatch
    const [currency, setCurrency] = useState<string | null>(null)

    useEffect(() => {
        // Check local storage or cookie
        const saved = localStorage.getItem('currency') || 'USD'
        setCurrency(saved)
    }, [])

    const updateCurrency = (code: string) => {
        setCurrency(code)
        localStorage.setItem('currency', code)
        // We trigger a refresh so other components (like ProductGrid) can pick up the change if they listen to storage event or just re-render
        // For a deeper integration, we'd use a Context, but this works for the switcher UI.
        window.dispatchEvent(new Event('currency-change'))
        router.refresh()
    }

    if (!currency) return null

    return (
        <div className="flex items-center gap-1 text-sm bg-secondary px-2 py-1 rounded-md">
            <span className="text-muted-foreground text-xs mr-1">Curr:</span>
            <select
                value={currency}
                onChange={(e) => updateCurrency(e.target.value)}
                className="bg-transparent font-medium focus:outline-none cursor-pointer"
            >
                {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                ))}
            </select>
        </div>
    )
}

// Helper to use currency in other components
export function useCurrency() {
    const [currency, setCurrency] = useState('USD')

    useEffect(() => {
        const update = () => setCurrency(localStorage.getItem('currency') || 'USD')
        update()
        window.addEventListener('currency-change', update)
        return () => window.removeEventListener('currency-change', update)
    }, [])

    return currency
}

export function formatPrice(amount: number, currencyCode: string) {
    const rates: Record<string, number> = {
        'USD': 1,
        'NGN': 1500, // Example rate
        'GBP': 0.79,
        'XAF': 600 // Central African CFA franc (approximate rate)
    }

    const rate = rates[currencyCode] || 1
    const symbol = CURRENCIES.find(c => c.code === currencyCode)?.symbol || '$'

    return `${symbol}${(amount * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
