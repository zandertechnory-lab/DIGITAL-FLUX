'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { CurrencySwitcher } from '@/components/currency-switcher'
import { Button } from '@/components/ui/button'

interface NavDict {
    home: string
    browse: string
    dashboard: string
    seller: string
    admin: string
    signIn: string
    signUp: string
    signOut: string
}

interface SiteHeaderProps {
    session: any
    isSeller: boolean
    isAdmin: boolean
    dict: { nav: NavDict }
}

export function SiteHeader({ session, isSeller, isAdmin, dict }: SiteHeaderProps) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => setIsOpen(!isOpen)

    // Smart Navbar Logic
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY

            // Show navbar at the top or when scrolling up
            // Hide when scrolling down and past 100px
            if (currentScrollY < 10) {
                setIsVisible(true)
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false)
            } else if (currentScrollY < lastScrollY) {
                setIsVisible(true)
            }

            setLastScrollY(currentScrollY)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])

    return (
        <header className={`sticky top-0 z-30 border-b bg-white/80 backdrop-blur transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-2 lg:py-3">
                {/* Mobile Logo */}
                <div className="lg:hidden">
                    <BrandLogo size={80} />
                </div>
                {/* Desktop Logo */}
                <div className="hidden lg:block">
                    <BrandLogo size={140} />
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex flex-1 items-center justify-end gap-6">
                    <nav className="flex items-center gap-6 text-base font-semibold">
                        <Link href="/" className="hover:text-purple-600 transition-colors">{dict.nav.home}</Link>
                        <Link href="/browse" className="hover:text-purple-600 transition-colors">{dict.nav.browse}</Link>
                        <Link href="/how-to-use" className="hover:text-purple-600 transition-colors">How to Use</Link>
                        <Link href="/about" className="hover:text-purple-600 transition-colors">About Us</Link>
                        {session && <Link href="/dashboard" className="hover:text-purple-600 transition-colors">{dict.nav.dashboard}</Link>}
                        {isSeller && <Link href="/seller" className="hover:text-purple-600 transition-colors">{dict.nav.seller}</Link>}
                        {isAdmin && <Link href="/admin" className="hover:text-purple-600 transition-colors">{dict.nav.admin}</Link>}
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 border-r pr-4">
                            <CurrencySwitcher />
                            <LanguageSwitcher />
                        </div>

                        {!session ? (
                            <div className="flex items-center gap-2">
                                <Link href="/auth/signin">
                                    <Button variant="ghost">{dict.nav.signIn}</Button>
                                </Link>
                                <Link href="/auth/signup">
                                    <Button>{dict.nav.signUp}</Button>
                                </Link>
                            </div>
                        ) : (
                            <Link href="/api/auth/signout">
                                <Button variant="ghost">{dict.nav.signOut}</Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-2 lg:hidden">
                    <CurrencySwitcher />
                    <LanguageSwitcher />
                    <button
                        onClick={toggleMenu}
                        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg animate-in slide-in-from-top-2">
                    <nav className="flex flex-col p-4 gap-2">
                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-3 rounded-md hover:bg-purple-50 hover:text-purple-600 font-medium transition-colors"
                        >
                            {dict.nav.home}
                        </Link>
                        <Link
                            href="/browse"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-3 rounded-md hover:bg-purple-50 hover:text-purple-600 font-medium transition-colors"
                        >
                            {dict.nav.browse}
                        </Link>
                        <Link
                            href="/how-to-use"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-3 rounded-md hover:bg-purple-50 hover:text-purple-600 font-medium transition-colors"
                        >
                            How to Use
                        </Link>
                        <Link
                            href="/about"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-3 rounded-md hover:bg-purple-50 hover:text-purple-600 font-medium transition-colors"
                        >
                            About Us
                        </Link>

                        {(session || isSeller || isAdmin) && <div className="border-t my-2" />}

                        {session && (
                            <Link
                                href="/dashboard"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-3 rounded-md hover:bg-purple-50 hover:text-purple-600 font-medium transition-colors"
                            >
                                {dict.nav.dashboard}
                            </Link>
                        )}
                        {isSeller && (
                            <Link
                                href="/seller"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-3 rounded-md hover:bg-purple-50 hover:text-purple-600 font-medium transition-colors"
                            >
                                {dict.nav.seller}
                            </Link>
                        )}
                        {isAdmin && (
                            <Link
                                href="/admin"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-3 rounded-md hover:bg-purple-50 hover:text-purple-600 font-medium transition-colors"
                            >
                                {dict.nav.admin}
                            </Link>
                        )}

                        <div className="border-t my-2" />

                        {!session ? (
                            <div className="flex flex-col gap-2 p-2">
                                <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                                    <Button variant="outline" className="w-full justify-center">{dict.nav.signIn}</Button>
                                </Link>
                                <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full justify-center">{dict.nav.signUp}</Button>
                                </Link>
                            </div>
                        ) : (
                            <Link href="/api/auth/signout" onClick={() => setIsOpen(false)} className="p-2">
                                <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                                    {dict.nav.signOut}
                                </Button>
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </header>
    )
}
