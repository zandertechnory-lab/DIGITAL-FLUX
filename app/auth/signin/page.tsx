import { cookies } from 'next/headers'
import { getDictionary } from '@/lib/i18n'
import SignInForm from './signin-form'

export default function SignInPage() {
  const lang = cookies().get('lang')?.value === 'fr' ? 'fr' : 'en'
  const dict = getDictionary(lang)

  return <SignInForm dict={dict} />
}
