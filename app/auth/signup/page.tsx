import { cookies } from 'next/headers'
import { getDictionary } from '@/lib/i18n'
import SignUpForm from './signup-form'

export default function SignUpPage() {
  const lang = cookies().get('lang')?.value === 'fr' ? 'fr' : 'en'
  const dict = getDictionary(lang)

  return <SignUpForm dict={dict} />
}
