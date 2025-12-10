import Link from 'next/link'
import { AnimationWrapper, FadeIn } from '@/components/animation-wrapper'
import { Button } from '@/components/ui/button'
import {
    ShoppingCart, Package, DollarSign, Download, UserPlus,
    Upload, CheckCircle, TrendingUp, Search, CreditCard, FileText, Share2
} from 'lucide-react'

export default function HowToUsePage() {
    const buyerSteps = [
        {
            icon: UserPlus,
            title: 'Create Your Account',
            description: 'Sign up for free in seconds using your email or social media accounts.',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: Search,
            title: 'Browse Products',
            description: 'Explore thousands of digital products, ebooks, courses, and services from talented creators.',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: ShoppingCart,
            title: 'Add to Cart',
            description: 'Found something you love? Add it to your cart and continue shopping or proceed to checkout.',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: CreditCard,
            title: 'Secure Payment',
            description: 'Complete your purchase using our secure payment gateway. We accept all major payment methods.',
            color: 'from-orange-500 to-red-500'
        },
        {
            icon: Download,
            title: 'Instant Access',
            description: 'Download your purchased products immediately or access them anytime from your dashboard.',
            color: 'from-purple-500 to-indigo-500'
        }
    ]

    const sellerSteps = [
        {
            icon: UserPlus,
            title: 'Sign Up as Seller',
            description: 'Create your seller account and verify your email to start selling on Digital Flux.',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: FileText,
            title: 'Set Up Your Profile',
            description: 'Complete your profile with payment details and tax information for seamless transactions.',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Upload,
            title: 'Upload Products',
            description: 'Create product listings with descriptions, pricing, and upload your digital files securely.',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: CheckCircle,
            title: 'Get Approved',
            description: 'Our team reviews your product to ensure quality. Approval typically takes 24-48 hours.',
            color: 'from-orange-500 to-red-500'
        },
        {
            icon: Share2,
            title: 'Promote & Sell',
            description: 'Share your store link on social media and start making sales from customers worldwide.',
            color: 'from-pink-500 to-rose-500'
        },
        {
            icon: DollarSign,
            title: 'Earn Money',
            description: 'Receive payments directly to your account. Track earnings and sales in real-time from your dashboard.',
            color: 'from-purple-500 to-indigo-500'
        }
    ]

    const tips = [
        {
            icon: TrendingUp,
            title: 'Optimize Your Listings',
            description: 'Use clear titles, detailed descriptions, and quality preview images to attract more buyers.'
        },
        {
            icon: Package,
            title: 'Price Competitively',
            description: 'Research similar products to set competitive prices while ensuring fair value for your work.'
        },
        {
            icon: Share2,
            title: 'Promote Your Store',
            description: 'Share your products on social media and with your network to drive more traffic and sales.'
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 py-20 md:py-24 text-white">
                <AnimationWrapper className="container mx-auto px-4 text-center">
                    <div className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm border border-white/30 mb-6">
                        📚 USER GUIDE
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 drop-shadow-lg">
                        How to Use Digital Flux
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                        Everything you need to know to buy and sell digital products on our platform
                    </p>
                </AnimationWrapper>
            </section>

            <div className="container mx-auto px-4 py-16 space-y-24">
                {/* For Buyers Section */}
                <section>
                    <FadeIn className="text-center mb-12">
                        <div className="inline-block rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700 mb-4">
                            FOR BUYERS
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Shopping in 5 Easy Steps</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Discover and purchase amazing digital products from creators around the world
                        </p>
                    </FadeIn>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                        {buyerSteps.map((step, i) => (
                            <FadeIn key={step.title} delay={i * 0.1}>
                                <div className="h-full p-6 rounded-2xl border bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${step.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>
                                    <div className="relative">
                                        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} text-white mb-4`}>
                                            <step.icon size={24} />
                                        </div>
                                        <div className="absolute -top-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-700 font-bold text-sm">
                                            {i + 1}
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>

                    <FadeIn delay={0.6} className="text-center mt-12">
                        <Link href="/browse">
                            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6">
                                Start Shopping Now
                            </Button>
                        </Link>
                    </FadeIn>
                </section>

                {/* For Sellers Section */}
                <section className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl -z-10"></div>
                    <div className="p-8 md:p-12">
                        <FadeIn className="text-center mb-12">
                            <div className="inline-block rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white mb-4">
                                FOR SELLERS
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Selling in 6 Simple Steps</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Turn your digital products into a thriving online business
                            </p>
                        </FadeIn>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                            {sellerSteps.map((step, i) => (
                                <FadeIn key={step.title} delay={i * 0.1}>
                                    <div className="h-full p-6 rounded-2xl border bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${step.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>
                                        <div className="relative">
                                            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} text-white mb-4`}>
                                                <step.icon size={24} />
                                            </div>
                                            <div className="absolute -top-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-pink-700 font-bold text-sm">
                                                {i + 1}
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                            <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                                        </div>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>

                        <FadeIn delay={0.7} className="text-center mt-12">
                            <Link href="/auth/signup">
                                <Button size="lg" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg px-8 py-6">
                                    Start Selling Today
                                </Button>
                            </Link>
                        </FadeIn>
                    </div>
                </section>

                {/* Pro Tips Section */}
                <section>
                    <FadeIn className="text-center mb-12">
                        <div className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 mb-4">
                            💡 PRO TIPS
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Maximize Your Success</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Expert tips to help you get the most out of Digital Flux
                        </p>
                    </FadeIn>

                    <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
                        {tips.map((tip, i) => (
                            <FadeIn key={tip.title} delay={i * 0.15}>
                                <div className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:shadow-lg transition-shadow">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white mb-4">
                                        <tip.icon size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{tip.title}</h3>
                                    <p className="text-muted-foreground text-sm">{tip.description}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="text-center py-16">
                    <FadeIn>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Join thousands of buyers and sellers on Digital Flux today
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/browse">
                                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                                    Browse Products
                                </Button>
                            </Link>
                            <Link href="/auth/signup">
                                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6">
                                    Create Account
                                </Button>
                            </Link>
                        </div>
                    </FadeIn>
                </section>
            </div>
        </div>
    )
}
