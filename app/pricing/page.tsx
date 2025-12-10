import { AnimationWrapper, FadeIn } from '@/components/animation-wrapper'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PricingPage() {
    const tiers = [
        {
            name: 'Starter',
            price: '$0',
            description: 'Perfect for beginners starting their journey.',
            features: ['Up to 3 products', 'Basic analytics', 'Standard support', '5% transaction fee'],
            cta: 'Get Started',
            popular: false,
        },
        {
            name: 'Pro',
            price: '$29',
            description: 'For growing creators who need more power.',
            features: [
                'Unlimited products',
                'Advanced analytics',
                'Priority support',
                '2% transaction fee',
                'Custom domain',
                'Email marketing',
            ],
            cta: 'Start Free Trial',
            popular: true,
        },
        {
            name: 'Business',
            price: '$99',
            description: 'For established brands and teams.',
            features: [
                'Everything in Pro',
                '0% transaction fee',
                'Dedicated account manager',
                'API access',
                'White labeling',
                'Team members',
            ],
            cta: 'Contact Sales',
            popular: false,
        },
    ]

    return (
        <div className="bg-background min-h-screen">
            <div className="container px-4 py-24 mx-auto">
                <AnimationWrapper className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Choose the plan that fits your needs. No hidden fees. Cancel anytime.
                    </p>
                </AnimationWrapper>

                <div className="grid gap-8 lg:grid-cols-3">
                    {tiers.map((tier, index) => (
                        <FadeIn
                            key={tier.name}
                            delay={index * 0.1}
                            className={`relative flex flex-col p-8 bg-card rounded-2xl border ${tier.popular ? 'border-primary shadow-2xl scale-105 z-10' : 'border-border shadow-sm'
                                }`}
                        >
                            {tier.popular && (
                                <div className="absolute top-0 right-1/2 transform translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                                    Most Popular
                                </div>
                            )}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold">{tier.name}</h3>
                                <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
                                <div className="mt-6 flex items-baseline gap-1">
                                    <span className="text-4xl font-extrabold">{tier.price}</span>
                                    <span className="text-sm text-muted-foreground">/month</span>
                                </div>
                            </div>
                            <ul className="flex-1 space-y-4 mb-8">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-sm">
                                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Button
                                className={`w-full ${tier.popular ? 'bg-primary hover:bg-primary/90' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                    }`}
                                size="lg"
                            >
                                {tier.cta}
                            </Button>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </div>
    )
}
