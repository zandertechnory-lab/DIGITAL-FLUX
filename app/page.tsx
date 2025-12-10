import SplineViewer from '@/components/spline-viewer'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { cookies } from 'next/headers'
import { getDictionary } from '@/lib/i18n'
import { AnimationWrapper, FadeIn } from '@/components/animation-wrapper'
import Image from 'next/image'
import { CheckCircle2, Users, Zap, TrendingUp, Heart, Globe, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  const lang = cookies().get('lang')?.value === 'fr' ? 'fr' : 'en'
  const dict = getDictionary(lang)

  const productTypes = [
    {
      title: 'Digital Products',
      description: 'Sell any and every kind of digital product, from content packs to designs to bundles and more without stress.',
      icon: '💎'
    },
    {
      title: 'Ebooks',
      description: 'Selar is the best platform to sell your ebooks both downloadable and non-downloadable in any format.',
      icon: '📚'
    },
    {
      title: 'Courses & Memberships',
      description: 'Host your courses & membership sites with unlimited videos & files, unlimited storage, and have unlimited students.',
      icon: '🎓'
    },
    {
      title: 'Event Tickets & Training',
      description: 'Sell tickets for all kinds of events, masterclasses, workshops, training, webinars, and even more.',
      icon: '🎫'
    },
    {
      title: 'Services',
      description: 'Sell any kind of service, from coaching to consultations to counseling sessions to design services and more.',
      icon: '⚡'
    },
    {
      title: 'Physical Goods',
      description: 'Use Selar to sell your physical product from clothing to books to electronics and appliances and more.',
      icon: '📦'
    }
  ]

  const setupSteps = [
    { step: '1', title: 'Sign up and set up your bank details', icon: '👤' },
    { step: '2', title: 'Set up your store and upload your products', icon: '🏪' },
    { step: '3', title: 'Share your store link and start getting paid!', icon: '💰' }
  ]

  const salesTools = [
    {
      title: 'Affiliates',
      description: 'Set up your own affiliate marketing system, and give a commission for anyone that facilitates a sale.',
      link: '/affiliate'
    },
    {
      title: 'Sales Page',
      description: 'Create custom sales/landing pages for your products. Descriptive sales pages drive more conversions.',
      link: '/browse'
    },
    {
      title: 'Automated Follow-ups',
      description: "Never miss a prospective buyer with automated follow ups. Proven to drive conversions by at least 30%.",
      link: '#'
    }
  ]

  const testimonials = [
    {
      quote: "I've used quite a number of e-commerce platforms, but Digital Flux is amazing! They're truly interested in your growth and constantly listening to customers.",
      author: 'Steve Harris',
      title: 'Business Accelerator & Coach'
    },
    {
      quote: 'Digital Flux has an Affiliate System that works! Easy to host your courses and digital products, and you can quickly receive payments.',
      author: 'Tricia Biz',
      title: 'Marketing & Launch Expert'
    },
    {
      quote: 'The platform makes it incredibly simple to sell globally. Payment integration is seamless and customer support is top-notch!',
      author: 'David Chen',
      title: 'Online Course Creator'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">

      {/* Hero Section with 3D Animation */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 py-20 md:py-32 min-h-[600px] md:min-h-[700px]">
        {/* 3D Spline Animation Background */}
        <div className="absolute inset-0 z-0">
          <SplineViewer
            className="w-full h-full opacity-60"
            url="https://prod.spline.design/G1dxqWYN1gjKVw1Z/scene.splinecode"
          />
        </div>

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/50 via-purple-500/40 to-pink-500/50 z-[1]"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 z-[2]"></div>

        <AnimationWrapper className="container relative z-10 mx-auto px-4 text-center text-white">
          <div className="mb-4 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-md border border-white/30 shadow-lg">
            MAKE MORE SALES
          </div>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-6xl lg:text-7xl drop-shadow-2xl">
            The best way to sell<br />
            your digital products online
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg md:text-xl text-white/95 backdrop-blur-sm bg-black/10 p-4 rounded-2xl">
            Digital Flux is your all-in-one e-commerce store builder to sell any kind of digital product or service to anyone anywhere in the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 hover:scale-105 transition-all text-lg px-8 py-6 rounded-full shadow-2xl backdrop-blur-sm">
                Start Selling with Digital Flux
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex items-center justify-center gap-2 text-sm text-white/90 backdrop-blur-sm bg-white/10 inline-flex px-6 py-3 rounded-full">
            <Users className="h-5 w-5" />
            <span>Trusted by over 1,500,000 users all over the world</span>
          </div>
        </AnimationWrapper>

        {/* Decorative floating elements */}
        <div className="absolute top-20 left-10 h-20 w-20 rounded-full bg-white/10 blur-xl animate-pulse z-[3]"></div>
        <div className="absolute bottom-20 right-10 h-32 w-32 rounded-full bg-pink-300/20 blur-2xl animate-pulse delay-1000 z-[3]"></div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-24">



        {/* Product Types Section */}
        <section>
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Sell any kind of product, service or subscription</h2>
          </FadeIn>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {productTypes.map((product, i) => (
              <FadeIn key={product.title} delay={i * 0.1} className="group">
                <div className="h-full p-8 rounded-2xl border bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="text-5xl mb-4">{product.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{product.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* 3D Experience Showcase */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-0 min-h-[400px] md:min-h-[600px]">
          <div className="grid md:grid-cols-2 gap-0 items-center min-h-[400px] md:min-h-[600px]">
            {/* Text Content */}
            <FadeIn className="p-8 md:p-16 relative z-10">
              <div className="inline-block rounded-full bg-purple-500/20 px-4 py-2 text-sm font-medium text-purple-300 backdrop-blur-sm border border-purple-400/30 mb-6">
                ✨ INTERACTIVE EXPERIENCE
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Experience the Future of Digital Commerce
              </h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Built with cutting-edge technology to deliver a premium, interactive experience for your customers. Every detail matters.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Immersive Design</h3>
                    <p className="text-sm text-gray-400">Captivate your audience with 3D visuals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Lightning Fast</h3>
                    <p className="text-sm text-gray-400">Optimized performance on every device</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Premium Quality</h3>
                    <p className="text-sm text-gray-400">Stand out from the competition</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* 3D Animation */}
            <FadeIn delay={0.2} className="relative h-[350px] md:h-[600px]">
              <SplineViewer
                className="w-full h-full"
                url="https://prod.spline.design/Fygu8CYnUC3tc1j9/scene.splinecode"
              />
            </FadeIn>
          </div>
        </section>

        {/* Strategic Partner - Middle Placement */}
        <section className="relative overflow-hidden rounded-3xl bg-white border shadow-sm p-6 md:p-12">
          <FadeIn className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="relative w-40 h-40 md:w-56 md:h-56 flex-shrink-0 transition-transform hover:scale-105 duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full animate-pulse opacity-50"></div>
              <Image
                src="/assets/emma-technocom-logo.jpg"
                alt="Emma Technocom"
                fill
                className="object-contain rounded-full shadow-lg bg-white p-2 relative z-10"
              />
            </div>
            <div className="text-center md:text-left max-w-2xl">
              <div className="inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-700 mb-4">
                🤝 STRATEGIC PARTNER
              </div>
              <h2 className="text-3xl font-bold mb-3 text-gray-900">Emma Technocom</h2>
              <h3 className="text-xl text-purple-600 font-medium mb-4">Expert Web Developer & Graphic Designer</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Collaborating with Digital Flux to deliver world-class digital experiences. Bringing visionary designs and robust technical solutions to life.
              </p>
            </div>
          </FadeIn>
        </section>

        {/* Setup Steps */}
        <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-6 md:p-16">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">It's simple and easy to set up</h2>
          </FadeIn>
          <div className="grid gap-8 md:grid-cols-3">
            {setupSteps.map((step, i) => (
              <FadeIn key={step.step} delay={i * 0.15} className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-4xl shadow-lg">
                  {step.icon}
                </div>
                <div className="mb-2 inline-block rounded-full bg-purple-100 px-4 py-1 text-sm font-bold text-purple-700">
                  Step {step.step}
                </div>
                <p className="text-lg font-medium">{step.title}</p>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.5} className="mt-12 text-center">
            <Link href="/browse">
              <Button size="lg" variant="outline" className="border-purple-300 hover:bg-purple-50">
                Find out More
              </Button>
            </Link>
          </FadeIn>
        </section>

        {/* Show Love Feature */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 to-rose-500 p-6 md:p-16 text-white">
          <div className="relative z-10 grid gap-8 md:grid-cols-2 items-center">
            <FadeIn>
              <Heart className="h-16 w-16 mb-6 fill-white" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Give your followers an easy way to show love!
              </h2>
              <p className="text-lg text-white/90 mb-6">
                Show Love enables you to easily accept tips and donations from your supporters and fans from all over the world.
              </p>
              <Link href="/tips">
                <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
                  Learn more
                </Button>
              </Link>
            </FadeIn>
            <FadeIn delay={0.2} direction="left">
              <div className="relative h-64 md:h-80">
                <Image
                  src="/assets/community.png"
                  alt="Show Love"
                  fill
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </FadeIn>
          </div>
          <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-white/10 to-transparent"></div>
        </section>

        {/* Payment Gateways */}
        <section>
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Never lose an international customer again!</h2>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              We've integrated multiple payment gateways to ensure you can receive payments from anywhere in the world, including PayPal and Stripe.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              {['PayPal', 'Stripe', 'M-Pesa', 'MTN', 'Visa', 'Mastercard', 'AmEx', 'Verve'].map((gateway, i) => (
                <div key={gateway} className="flex h-16 w-32 items-center justify-center rounded-xl border bg-white px-4 font-bold text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  {gateway}
                </div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* Sales Tools */}
        <section>
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Make more sales with the right tools</h2>
          </FadeIn>
          <div className="grid gap-8 md:grid-cols-3">
            {salesTools.map((tool, i) => (
              <FadeIn key={tool.title} delay={i * 0.1}>
                <div className="h-full p-8 rounded-2xl border bg-white hover:shadow-xl transition-all">
                  <Zap className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-3">{tool.title}</h3>
                  <p className="text-muted-foreground mb-6">{tool.description}</p>
                  <Link href={tool.link} className="text-purple-600 font-semibold hover:underline inline-flex items-center">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Integrations */}
        <section className="text-center">
          <FadeIn className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Seamlessly integrate with your favourite tools</h2>
            <p className="text-lg text-muted-foreground">Double your conversion by integrating your favorite tools.</p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="flex flex-wrap justify-center gap-6">
              {['Facebook', 'Mailchimp', 'ConvertKit', 'Kartra', 'Zapier'].map((tool) => (
                <div key={tool} className="flex h-20 w-40 items-center justify-center rounded-xl border bg-white px-6 font-semibold shadow-sm hover:shadow-md transition-shadow">
                  {tool}
                </div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* Testimonials */}
        <section>
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Don't take our word for it!</h2>
            <p className="text-lg text-muted-foreground">See what some of our customers have to say.</p>
          </FadeIn>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <FadeIn key={testimonial.author} delay={i * 0.1}>
                <div className="h-full p-8 rounded-2xl bg-white border shadow-sm hover:shadow-lg transition-shadow">
                  <div className="mb-6 text-4xl text-purple-400">"</div>
                  <p className="mb-6 italic text-muted-foreground leading-relaxed">{testimonial.quote}</p>
                  <div>
                    <p className="font-bold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Free Ebook CTA */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 p-6 md:p-16 text-white">
          <FadeIn className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get started creating & selling digital products!
            </h2>
            <p className="text-lg text-white/90 mb-8">
              We created THE ULTIMATE DIGITAL PRODUCT MANUAL. This free ebook will help you turn your knowledge into income via selling digital products.
            </p>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Get free ebook
            </Button>
          </FadeIn>
          <div className="absolute top-0 right-0 h-64 w-64 bg-purple-400 rounded-full blur-3xl opacity-20"></div>
        </section>

        {/* Press Mentions */}
        <section>
          <FadeIn className="text-center mb-8">
            <h3 className="text-xl font-semibold text-muted-foreground">Digital Flux in the press</h3>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
              {['TechCrunch', 'Forbes', 'Bloomberg', 'Reuters', 'WSJ'].map((press) => (
                <div key={press} className="font-bold text-lg text-gray-600">
                  {press}
                </div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* Final CTA */}
        <section className="text-center py-16">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Start Selling with Digital Flux</h2>
            <p className="text-lg text-muted-foreground mb-8">Create a free account in less than 5 minutes and start selling!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6">
                  Get started for free
                </Button>
              </Link>
              <Link href="/browse">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  See a live demo
                </Button>
              </Link>
            </div>
          </FadeIn>
        </section>

      </div>
    </div>
  )
}
