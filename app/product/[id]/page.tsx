import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { notFound } from 'next/navigation'
import PurchaseButton from './purchase-button'
import FileList from './file-list'
import { cookies } from 'next/headers'
import { getDictionary } from '@/lib/i18n'
import { PriceDisplay } from '@/components/price-display'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Star, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import { AnimationWrapper, FadeIn } from '@/components/animation-wrapper'

export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  const lang = cookies().get('lang')?.value === 'fr' ? 'fr' : 'en'
  const dict = getDictionary(lang)

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      category: true,
      courseMetadata: true,
      eventMetadata: true,
      serviceMetadata: true,
      files: {
        orderBy: { order: 'asc' },
      },
      _count: {
        select: {
          transactions: true,
        },
      },
    },
  })

  if (!product || product.status !== 'APPROVED') {
    notFound()
  }

  // Check if user has purchased
  let hasPurchased = false
  if (session) {
    const purchase = await prisma.transaction.findFirst({
      where: {
        buyerId: session.user.id,
        productId: params.id,
        status: 'COMPLETED',
      },
    })
    hasPurchased = !!purchase

    if (product.sellerId === session.user.id) {
      hasPurchased = true
    }
  }

  // Mock Upsells (fetch 3 random products ideally, but for now just mock logic)
  // In a real app we'd query: prisma.product.findMany({ where: { id: { not: product.id } }, take: 3 })

  return (
    <div className="min-h-screen bg-secondary/5">
      <AnimationWrapper className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
              {product.thumbnail && (
                <div className="relative h-64 md:h-96 w-full bg-secondary/20">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1 text-yellow-500 font-medium">
                    <Star className="h-4 w-4 fill-yellow-500" />
                    4.9 (128 reviews)
                  </span>
                  <span>•</span>
                  <span>{product._count.transactions} {dict.product.sales}</span>
                </div>

                <div className="prose max-w-none text-muted-foreground">
                  <h3 className="text-foreground font-semibold text-lg mb-2">{dict.product.description}</h3>
                  <p className="whitespace-pre-wrap leading-relaxed">{product.description}</p>
                </div>
              </div>
            </div>

            {/* Product Details Cards */}
            {product.type === 'COURSE' && product.courseMetadata && (
              <Card>
                <CardHeader><CardTitle>{dict.product.courseDetails}</CardTitle></CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-2 gap-4 text-sm">
                    {product.courseMetadata.duration && <li><span className="font-semibold">{dict.product.duration}:</span> {product.courseMetadata.duration} {dict.product.minutes}</li>}
                    {product.courseMetadata.level && <li><span className="font-semibold">{dict.product.level}:</span> {product.courseMetadata.level}</li>}
                    {product.courseMetadata.language && <li><span className="font-semibold">{dict.product.language}:</span> {product.courseMetadata.language}</li>}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Creator Profile */}
            <Card>
              <CardContent className="p-6 flex items-center gap-6">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                  {product.seller.image ? (
                    <img src={product.seller.image} alt={product.seller.name || ''} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    (product.seller.name?.[0] || product.seller.email?.[0] || 'S').toUpperCase()
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Creator</p>
                  <h3 className="text-xl font-bold">{product.seller.name || product.seller.email}</h3>
                  <Link href="#" className="text-primary text-sm hover:underline">View Profile</Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="sticky top-24 space-y-6">
              <Card className="border-2 border-primary/10 shadow-lg">
                <CardContent className="p-6 space-y-6">
                  {hasPurchased ? (
                    <div className="space-y-4">
                      <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2 font-medium">
                        <ShieldCheck className="h-5 w-5" />
                        {dict.product.youOwn}
                      </div>
                      <FileList productId={params.id} />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Price</p>
                        <PriceDisplay amount={product.price} className="text-4xl font-extrabold text-primary" />
                      </div>
                      {session ? (
                        <PurchaseButton productId={params.id} />
                      ) : (
                        <Link
                          href="/auth/signin"
                          className="flex w-full items-center justify-center px-6 py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
                        >
                          {dict.product.signInToPurchase}
                        </Link>
                      )}
                      <p className="text-xs text-center text-muted-foreground">Secure checkout powered by Digital Flux</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Upsells Mock */}
              {!hasPurchased && (
                <FadeIn delay={0.2} className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white text-center space-y-4">
                  <div className="flex justify-center">
                    <Image
                      src="/assets/coin-character.png"
                      alt="Offer"
                      width={60}
                      height={60}
                      className="animate-bounce"
                    />
                  </div>
                  <h3 className="font-bold text-lg">Limited Time Offer!</h3>
                  <p className="text-sm text-white/90">Get this product + 2 others for a 50% discount bundle.</p>
                  <Button variant="secondary" className="w-full text-purple-600 font-bold">
                    View Bundle
                  </Button>
                </FadeIn>
              )}
            </div>
          </div>

        </div>
      </AnimationWrapper>
    </div>
  )
}


