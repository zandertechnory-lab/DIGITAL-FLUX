import ProductGrid from './product-grid'
import SearchBar from './search-bar'

import { cookies } from 'next/headers'
import { getDictionary } from '@/lib/i18n'

export default function BrowsePage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const lang = cookies().get('lang')?.value === 'fr' ? 'fr' : 'en'
  const dict = getDictionary(lang)

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{dict.browse.title}</h1>
        <SearchBar
          placeholder={dict.browse.searchPlaceholder}
          buttonText={dict.browse.searchButton}
        />
        <ProductGrid searchParams={searchParams} dict={dict} />
      </div>
    </div>
  )
}

