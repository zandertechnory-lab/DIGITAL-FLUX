'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const LANG_COOKIE = 'lang'

export function LanguageSwitcher() {
  const router = useRouter()
  const [lang, setLang] = useState<'en' | 'fr'>('en')

  useEffect(() => {
    const cookieLang = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${LANG_COOKIE}=`))
      ?.split('=')[1] as 'en' | 'fr' | undefined

    if (cookieLang === 'fr' || cookieLang === 'en') {
      setLang(cookieLang)
      document.documentElement.lang = cookieLang
    }
  }, [])

  const updateLang = (next: 'en' | 'fr') => {
    setLang(next)
    document.documentElement.lang = next
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}`
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        onClick={() => updateLang('en')}
        className={`px-3 py-1 rounded border ${lang === 'en' ? 'bg-primary text-primary-foreground border-primary' : 'border-muted-foreground/40'}`}
      >
        EN
      </button>
      <button
        onClick={() => updateLang('fr')}
        className={`px-3 py-1 rounded border ${lang === 'fr' ? 'bg-primary text-primary-foreground border-primary' : 'border-muted-foreground/40'}`}
      >
        FR
      </button>
    </div>
  )
}

