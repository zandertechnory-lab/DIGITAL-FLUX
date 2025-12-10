'use client'

import { AnimationWrapper, FadeIn } from '@/components/animation-wrapper'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link2, DollarSign, Users, BarChart3 } from 'lucide-react'
import Image from 'next/image'

export default function AffiliatePage() {
    return (
        <div className="min-h-screen bg-secondary/10 p-8">
            <AnimationWrapper className="container mx-auto max-w-6xl space-y-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>
                        <p className="text-muted-foreground">Manage your links and earnings</p>
                    </div>
                    <Button className="bg-primary text-primary-foreground">
                        Join Affiliate Network
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$0.00</div>
                            <p className="text-xs text-muted-foreground">+0% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Referrals</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">+0 new users</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0%</div>
                            <p className="text-xs text-muted-foreground">No active links</p>
                        </CardContent>
                    </Card>
                </div>

                <FadeIn delay={0.2} className="grid gap-6 md:grid-cols-2">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Your Affiliate Links</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-12 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center gap-4 text-muted-foreground bg-white/50">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    <Link2 className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">No links yet</h3>
                                    <p>Generate a link to a product to start earning commissions.</p>
                                </div>
                                <Button variant="outline">Browse Marketplace</Button>
                            </div>
                        </CardContent>
                    </Card>
                </FadeIn>

                <FadeIn delay={0.4} className="flex flex-col md:flex-row items-center gap-8 p-8 bg-gradient-to-r from-primary/10 to-purple-100 rounded-2xl border">
                    <div className="flex-1 space-y-4">
                        <h2 className="text-2xl font-bold text-primary">Grow with Partners</h2>
                        <p className="text-muted-foreground">Collaborate with other creators and earn money by promoting their products. The sky is the limit!</p>
                        <Button>Explore Opportunities</Button>
                    </div>
                    <div className="relative h-48 w-48">
                        <Image
                            src="/assets/handshake-character.png"
                            alt="Partners"
                            fill
                            className="object-contain drop-shadow-lg animate-bounce duration-[3000ms]"
                        />
                    </div>
                </FadeIn>

            </AnimationWrapper>
        </div>
    )
}
