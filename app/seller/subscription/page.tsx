import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function SellerSubscriptionPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  })

  const isPro = subscription?.plan === 'PRO' && subscription?.isActive

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Subscription Plan</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <div className={`p-8 border-2 rounded-lg ${!isPro ? 'border-primary' : ''}`}>
          <h2 className="text-2xl font-bold mb-4">Free Plan</h2>
          <p className="text-3xl font-bold mb-2">0 XAF</p>
          <p className="text-muted-foreground mb-6">per month</p>
          <ul className="space-y-2 mb-6">
            <li>✓ 10% platform commission</li>
            <li>✓ Basic seller features</li>
            <li>✓ Product management</li>
          </ul>
          {!isPro && (
            <div className="px-4 py-2 bg-primary text-primary-foreground rounded text-center">
              Current Plan
            </div>
          )}
        </div>

        <div className={`p-8 border-2 rounded-lg ${isPro ? 'border-primary' : ''}`}>
          <h2 className="text-2xl font-bold mb-4">Pro Plan</h2>
          <p className="text-3xl font-bold mb-2">10,000 XAF</p>
          <p className="text-muted-foreground mb-6">per month</p>
          <ul className="space-y-2 mb-6">
            <li>✓ 5% platform commission (50% savings!)</li>
            <li>✓ All Free plan features</li>
            <li>✓ Priority support</li>
            <li>✓ Featured listings</li>
            <li>✓ Advanced analytics</li>
          </ul>
          {isPro ? (
            <div className="px-4 py-2 bg-primary text-primary-foreground rounded text-center">
              Current Plan
            </div>
          ) : (
            <Link
              href="/seller/subscription/upgrade"
              className="block px-4 py-2 bg-primary text-primary-foreground rounded text-center hover:bg-primary/90"
            >
              Upgrade to Pro
            </Link>
          )}
        </div>
      </div>

      {subscription && (
        <div className="mt-8 p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Subscription Details</h3>
          <div className="space-y-2">
            <p>
              <strong>Plan:</strong> {subscription.plan}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              {subscription.isActive ? 'Active' : 'Inactive'}
            </p>
            <p>
              <strong>Start Date:</strong>{' '}
              {new Date(subscription.startDate).toLocaleDateString()}
            </p>
            {subscription.endDate && (
              <p>
                <strong>End Date:</strong>{' '}
                {new Date(subscription.endDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

