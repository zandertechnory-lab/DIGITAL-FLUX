'use client'

import { AnimationWrapper } from '@/components/animation-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Coffee, Pizza, Gift } from 'lucide-react'
import { useState } from 'react'

export default function TipsPage() {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null)

    const amounts = [
        { value: 5, label: 'Coffee', icon: Coffee },
        { value: 15, label: 'Lunch', icon: Pizza },
        { value: 50, label: 'Gift', icon: Gift },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
            <AnimationWrapper className="max-w-md w-full space-y-8">
                <div className="text-center space-y-2">
                    <div className="mx-auto bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 ring-4 ring-white shadow-lg">
                        <Heart className="h-8 w-8 text-pink-500 fill-pink-500 animate-pulse" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Show Some Love</h1>
                    <p className="text-gray-500">Support Digital Flux creators with a one-time tip.</p>
                </div>

                <Card className="border-pink-100 shadow-xl bg-white/80 backdrop-blur">
                    <CardHeader>
                        <CardTitle>Select Amount</CardTitle>
                        <CardDescription>How much would you like to give?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            {amounts.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setSelectedAmount(opt.value)}
                                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${selectedAmount === opt.value
                                        ? 'border-pink-500 bg-pink-50 text-pink-700 ring-2 ring-pink-500 ring-offset-2'
                                        : 'border-gray-100 hover:border-pink-200 hover:bg-pink-50/50'
                                        }`}
                                >
                                    <opt.icon className={`h-6 w-6 ${selectedAmount === opt.value ? 'text-pink-600' : 'text-gray-400'}`} />
                                    <span className="font-bold">${opt.value}</span>
                                    <span className="text-xs text-muted-foreground">{opt.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-muted-foreground">Or custom amount</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <span className="flex items-center px-4 bg-secondary rounded-lg font-bold text-muted-foreground">$</span>
                            <input
                                type="number"
                                placeholder="Enter amount"
                                className="flex-1 h-12 rounded-lg border px-4 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                            />
                        </div>

                        <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white h-12 text-lg rounded-xl shadow-lg shadow-pink-200">
                            Send Support
                        </Button>
                    </CardContent>
                </Card>
            </AnimationWrapper>
        </div>
    )
}
