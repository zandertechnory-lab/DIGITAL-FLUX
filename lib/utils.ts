import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'XAF'): string {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function calculateCommission(
  amount: number,
  isOwner: boolean,
  isPro: boolean,
  ownerCommissionRate: number = parseFloat(process.env.PLATFORM_OWNER_COMMISSION_RATE || '0'),
  defaultCommissionRate: number = parseFloat(process.env.PLATFORM_COMMISSION_RATE || '0.10'),
  proCommissionRate: number = parseFloat(process.env.PLATFORM_PRO_COMMISSION_RATE || '0.05')
): { commission: number; sellerAmount: number } {
  let rate = defaultCommissionRate

  if (isOwner) {
    rate = ownerCommissionRate
  } else if (isPro) {
    rate = proCommissionRate
  }

  const commission = amount * rate
  const sellerAmount = amount - commission

  return { commission, sellerAmount }
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateTxRef(): string {
  return `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

