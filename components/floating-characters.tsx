'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'

// Asset types to float: images we generated + some vector icons for variety
const FLOATERS = [
    { type: 'image', src: '/assets/coin-character.png', size: 60 },
    { type: 'image', src: '/assets/handshake-character.png', size: 80 },
    { type: 'image', src: '/assets/hero-character.png', size: 50 }, // Reuse hero mini
    { type: 'icon', Icon: Heart, color: '#ec4899', size: 40 }, // Fallback for heart
]

export function FloatingCharacters() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    // Create a reliable set of floating items with fixed positions to start
    // In a real app, we might randomize this more, but for "everywhere" we want coverage.
    const items = Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        ...FLOATERS[i % FLOATERS.length],
        initialX: Math.random() * 100, // vw
        initialY: Math.random() * 100, // vh
        duration: 15 + Math.random() * 20, // Slow float
        delay: Math.random() * 5,
    }))

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {items.map((item) => (
                <motion.div
                    key={item.id}
                    initial={{
                        x: `${item.initialX}vw`,
                        y: `${item.initialY}vh`,
                        opacity: 0
                    }}
                    animate={{
                        y: [
                            `${item.initialY}vh`,
                            `${(item.initialY + 50) % 100}vh`,
                            `${(item.initialY - 20 + 100) % 100}vh`
                        ],
                        x: [
                            `${item.initialX}vw`,
                            `${(item.initialX + 10) % 100}vw`,
                            `${(item.initialX - 10 + 100) % 100}vw`
                        ],
                        opacity: [0, 0.4, 0.2, 0] // Fade in and out to be subtle
                    }}
                    transition={{
                        duration: item.duration,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear",
                        delay: item.delay
                    }}
                    className="absolute"
                >
                    {item.type === 'image' && item.src ? (
                        <Image
                            src={item.src}
                            alt="floating"
                            width={item.size}
                            height={item.size}
                            className="opacity-60 drop-shadow-lg"
                        />
                    ) : item.Icon ? (
                        <item.Icon
                            size={item.size}
                            color={item.color}
                            className="opacity-60 drop-shadow-md"
                        />
                    ) : null}
                </motion.div>
            ))}
        </div>
    )
}
