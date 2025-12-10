import { notFound } from 'next/navigation'
import { AnimationWrapper } from '@/components/animation-wrapper'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// Map known slugs to titles for better UX, though we can also capitalize the slug.
const PAGE_TITLES: Record<string, string> = {
  'how-it-works': 'How It Works',
  'sell-courses': 'Sell Courses',
  'show-love': 'Show Love',
  'affiliate-network': 'Affiliate Network',
  'support-resources': 'Support & Resources',
  'helpdesk-guides': 'Helpdesk & Guides',
  'creator-academy': 'Creator Academy',
  'free-product-promotional-canva-templates': 'Canva Templates',
  'press-media-kits': 'Press & Media Kits',
  'contact-us': 'Contact Us',
  'terms-and-conditions': 'Terms & Conditions',
  'privacy-policy': 'Privacy Policy',
  'copyright-policy': 'Copyright Policy',
}

interface PageProps {
  params: {
    slug: string
  }
}

export default function InfoPage({ params }: PageProps) {
  const { slug } = params

  // Clean up the slug to generate a title if it's not in our map
  const title = PAGE_TITLES[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <AnimationWrapper className="container mx-auto max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6 capitalize">
              {title}
            </h1>

            <div className="p-8 border rounded-2xl bg-card shadow-sm space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Welcome to the <strong>{title}</strong> page. This section is currently being updated with the latest information and resources for our community.
              </p>
              <p className="text-muted-foreground">
                At Digital Flux, we are committed to providing the best tools for creators. Please check back soon or contact our support team if you have specific questions about {title.toLowerCase()}.
              </p>

              <div className="pt-8 flex flex-col sm:flex-row gap-4">
                <img
                  src="/assets/community.png"
                  alt="Digital Flux Community"
                  className="rounded-xl object-cover h-48 w-full sm:w-1/2 bg-secondary/20"
                />
                <div className="p-6 bg-secondary/30 rounded-xl flex items-center justify-center text-center">
                  <p className="font-medium text-primary">Content for "{title}" coming soon!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimationWrapper>
    </div>
  )
}
