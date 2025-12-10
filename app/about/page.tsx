import Link from 'next/link'
import Image from 'next/image'
import { AnimationWrapper, FadeIn } from '@/components/animation-wrapper'
import { Button } from '@/components/ui/button'
import {
    Video, Palette, Code, Share2, Shield, Lock,
    CheckCircle, Users, Zap, TrendingUp, BookOpen, Bell, ArrowRight
} from 'lucide-react'

export default function AboutPage() {
    const services = [
        {
            icon: Video,
            title: 'Video Editing',
            description: 'Professional video production and editing services for YouTube, social media, commercials, and more. Transform your raw footage into stunning visual stories.',
            color: 'from-red-500 to-pink-500',
            features: ['Color Grading', 'Motion Graphics', 'Sound Design', 'Post-Production']
        },
        {
            icon: Palette,
            title: 'Graphic Designing',
            description: 'Creative visual solutions for branding, marketing materials, social media graphics, and digital illustrations that capture attention and drive engagement.',
            color: 'from-purple-500 to-pink-500',
            features: ['Logo Design', 'Brand Identity', 'Social Media Graphics', 'Print Design']
        },
        {
            icon: Code,
            title: 'Web Development',
            description: 'Custom websites and web applications built with cutting-edge technologies. Responsive, fast, and optimized for conversions and user experience.',
            color: 'from-blue-500 to-cyan-500',
            features: ['React/Next.js', 'E-commerce', 'Custom CMS', 'Progressive Web Apps']
        },
        {
            icon: Share2,
            title: 'Social Media Management',
            description: 'Strategic social media planning, content creation, community management, and analytics to grow your brand presence and engagement across all platforms.',
            color: 'from-green-500 to-emerald-500',
            features: ['Content Strategy', 'Community Management', 'Analytics', 'Growth Campaigns']
        },
        {
            icon: Shield,
            title: 'Ethical Hacking',
            description: 'Professional penetration testing and security assessments to identify vulnerabilities before malicious hackers do. Protect your digital assets proactively.',
            color: 'from-orange-500 to-red-500',
            features: ['Penetration Testing', 'Vulnerability Assessment', 'Security Audits', 'Compliance Testing']
        },
        {
            icon: Lock,
            title: 'Cyber Security',
            description: 'Comprehensive cybersecurity solutions including threat detection, incident response, security architecture, and compliance to keep your business secure.',
            color: 'from-indigo-500 to-purple-500',
            features: ['Security Architecture', 'Incident Response', 'Compliance', 'Security Training']
        }
    ]

    const whyChooseUs = [
        {
            icon: Users,
            title: '10,000+ Satisfied Clients',
            description: 'Trusted by businesses and individuals worldwide for quality digital services.'
        },
        {
            icon: Zap,
            title: 'Fast Turnaround',
            description: 'Quick delivery without compromising on quality. We value your time.'
        },
        {
            icon: TrendingUp,
            title: 'Proven Results',
            description: 'Track record of successful projects and happy clients across all services.'
        },
        {
            icon: CheckCircle,
            title: 'Quality Guaranteed',
            description: 'We stand behind our work with revisions and satisfaction guarantees.'
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 py-20 md:py-24 text-white">
                <AnimationWrapper className="container mx-auto px-4 text-center">
                    <div className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm border border-white/30 mb-6">
                        🚀 ABOUT US
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 drop-shadow-lg">
                        Welcome to Digital Flux
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                        Your premier destination for digital excellence. From cutting-edge web solutions to comprehensive cybersecurity, we're here to elevate your digital presence.
                    </p>
                </AnimationWrapper>
            </section>

            <div className="container mx-auto px-4 py-16 space-y-24">
                {/* About Digital Flux */}
                <section>
                    <FadeIn className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Who We Are</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                            <strong className="text-gray-900">Digital Flux</strong> is a dynamic digital services marketplace connecting talented professionals with clients seeking world-class solutions. We specialize in six core areas: video editing, graphic design, web development, social media management, ethical hacking, and cybersecurity.
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Our mission is simple: empower creators to monetize their skills while providing businesses and individuals access to premium digital services. Whether you're looking to build a website, secure your digital infrastructure, or create engaging content, Digital Flux is your one-stop solution.
                        </p>
                    </FadeIn>
                </section>

                {/* In Collaboration With */}
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 border p-6 md:p-12">
                    <FadeIn className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                        <div className="relative w-40 h-40 md:w-56 md:h-56 flex-shrink-0 transition-transform hover:scale-105 duration-500">
                            <div className="absolute inset-0 bg-white rounded-full shadow-xl"></div>
                            <Image
                                src="/assets/emma-technocom-logo.jpg"
                                alt="Emma Technocom"
                                fill
                                className="object-contain rounded-full p-2 relative z-10"
                            />
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">In Collaboration With</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">Emma Technocom</p>
                                    <p className="text-xl text-purple-600 font-medium">Web Developer & Graphic Designer</p>
                                </div>
                                <p className="text-lg text-muted-foreground max-w-xl">
                                    A key partner in our mission to provide meaningful digital solutions. Specializing in high-end web development and creative graphic design strategies that elevate brands.
                                </p>
                            </div>
                        </div>
                    </FadeIn>
                </section>

                {/* Why Choose Us */}
                <section className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-6 md:p-12">
                    <FadeIn className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Digital Flux?</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Trusted by thousands for exceptional service and results
                        </p>
                    </FadeIn>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
                        {whyChooseUs.map((item, i) => (
                            <FadeIn key={item.title} delay={i * 0.1}>
                                <div className="p-6 rounded-2xl bg-white hover:shadow-lg transition-shadow text-center">
                                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-4">
                                        <item.icon size={28} />
                                    </div>
                                    <h3 className="font-bold mb-2">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </section>

                {/* Our Services */}
                <section>
                    <FadeIn className="text-center mb-12">
                        <div className="inline-block rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700 mb-4">
                            OUR SERVICES
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Offer</h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Comprehensive digital services tailored to meet your unique needs and drive your success
                        </p>
                    </FadeIn>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {services.map((service, i) => (
                            <FadeIn key={service.title} delay={i * 0.1}>
                                <div className="h-full p-8 rounded-2xl border bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden group">
                                    {/* Gradient Background Effect */}
                                    <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${service.color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`}></div>

                                    <div className="relative">
                                        {/* Icon */}
                                        <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${service.color} text-white mb-6 group-hover:scale-110 transition-transform`}>
                                            <service.icon size={32} />
                                        </div>

                                        {/* Title & Description */}
                                        <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>

                                        {/* Features */}
                                        <div className="space-y-2">
                                            <p className="text-sm font-semibold text-gray-700 mb-2">Key Features:</p>
                                            {service.features.map((feature) => (
                                                <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>

                    <FadeIn delay={0.7} className="text-center mt-12">
                        <Link href="/browse">
                            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6">
                                Explore Our Services
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </FadeIn>
                </section>

                {/* Courses Section - Coming Soon */}
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8 md:p-16 text-white">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500 rounded-full blur-3xl opacity-20"></div>

                    <FadeIn className="relative text-center max-w-3xl mx-auto">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-6">
                            <BookOpen size={40} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Learning Courses Coming Soon!</h2>
                        <p className="text-lg text-gray-300 leading-relaxed mb-8">
                            We're developing comprehensive courses to help you master video editing, graphic design, web development, cybersecurity, and more. Get expert training from industry professionals at your own pace.
                        </p>

                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8">
                            <h3 className="text-xl font-bold mb-4">🎓 Upcoming Course Categories</h3>
                            <div className="grid md:grid-cols-2 gap-4 text-left">
                                {services.map((service) => (
                                    <div key={service.title} className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                                            <service.icon size={20} />
                                        </div>
                                        <span className="font-medium">{service.title} Masterclass</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
                                <Bell size={20} className="text-purple-300" />
                                <span className="font-medium">Get notified when courses launch</span>
                            </div>
                        </div>

                        <p className="text-sm text-gray-400 mt-6">
                            Sign up to be among the first to access our courses at special launch pricing
                        </p>
                    </FadeIn>
                </section>

                {/* CTA Section */}
                <section className="text-center py-16">
                    <FadeIn>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Digital Presence?</h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Join Digital Flux today and connect with expert professionals ready to bring your vision to life
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/browse">
                                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                                    Browse Services
                                </Button>
                            </Link>
                            <Link href="/auth/signup">
                                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6">
                                    Get Started Free
                                </Button>
                            </Link>
                        </div>
                    </FadeIn>
                </section>
            </div>
        </div>
    )
}
