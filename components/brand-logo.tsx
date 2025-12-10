import Image from 'next/image'
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
      <Image
        src="/logo.png"
        alt="Digital Flux logo"
        width={size}
        height={size}
        style={{ height: size, width: 'auto' }}
        className="object-contain"
        priority
      />
    </Link>
  )
}

