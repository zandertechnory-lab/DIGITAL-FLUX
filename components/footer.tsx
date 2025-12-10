import Link from 'next/link'
import { BrandLogo } from './brand-logo'
import { cookies } from 'next/headers'
import { getDictionary } from '@/lib/i18n'

const footerLinks = [
  {
    title: 'How to Use',
    href: '/how-to-use',
  },
  {
    title: 'About Us',
    href: '/about',
  },
  {
    title: 'Products',
    href: '/info/products',
  },
  {
    title: 'How it Works',
    href: '/info/how-it-works',
  },
  {
    title: 'Features',
    href: '/info/features',
  },
  {
    title: 'Pricing',
    href: '/pricing',
  },
  {
    title: 'Affiliates',
    href: '/info/affiliates',
  },
  {
    title: 'Sell Courses',
    href: '/info/sell-courses',
  },
  {
    title: 'Show Love',
    href: '/tips',
  },
  {
    title: 'Tickets',
    href: '/info/tickets',
  },
  {
    title: 'Integrations',
    href: '/info/integrations',
  },
  {
    title: 'Affiliate Network',
    href: '/affiliate',
  },
  {
    title: 'Support & Resources',
    href: '/info/support-resources',
  },
  {
    title: 'Blog',
    href: '/info/blog',
  },
  {
    title: 'Helpdesk & Guides',
    href: '/info/helpdesk-guides',
  },
  {
    title: 'Creator Academy',
    href: '/info/creator-academy',
  },
  {
    title: 'Free Product Promotional Canva Templates',
    href: '/info/free-product-promotional-canva-templates',
  },
  {
    title: 'Press & Media Kits',
    href: '/info/press-media-kits',
  },
  {
    title: 'FAQs',
    href: '/info/faqs',
  },
  {
    title: 'Contact Us',
    href: '/info/contact-us',
  },
  {
    title: 'Legal',
    href: '/info/legal',
  },
  {
    title: 'Terms & Conditions',
    href: '/info/terms-and-conditions',
  },
  {
    title: 'Privacy Policy',
    href: '/info/privacy-policy',
  },
  {
    title: 'Copyright Policy',
    href: '/info/copyright-policy',
  },
  {
    title: 'Admin',
    href: '/panel-admin',
  },
]

export function Footer() {
  const lang = cookies().get('lang')?.value === 'fr' ? 'fr' : 'en'
  const dict = getDictionary(lang)

  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-10 space-y-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <BrandLogo size={140} />
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Digital Flux. {dict.footer.rightsReserved}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 text-sm text-gray-700">
          {footerLinks.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-primary">
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
