import Link from 'next/link'

type BrandLogoProps = {
  size?: number
}

export function BrandLogo({ size = 150 }: BrandLogoProps) {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 font-semibold text-primary hover:opacity-90 transition-opacity"
      aria-label="Digital Flux home"
    >
      <img
        src="/logo.png"
        alt="Digital Flux logo"
        style={{ height: `${size}px`, width: 'auto' }}
        className="object-contain"
      />
    </Link>
  )
}

