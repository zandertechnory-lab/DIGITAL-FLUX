'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users, Package, DollarSign, ShoppingCart, Eye, EyeOff, CheckCircle, XCircle,
  Clock, BarChart3, Settings, TrendingUp, Home, Search, Filter, Trash2, Edit, Menu, X, Crown, Shield, User
} from 'lucide-react'
import { AnimationWrapper, FadeIn } from '@/components/animation-wrapper'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const NAVIGATION = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'transactions', label: 'Transactions', icon: ShoppingCart },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444']

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [activeView, setActiveView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [stats, setStats] = useState<any>(null)
  const [pendingProducts, setPendingProducts] = useState<any[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Filters
  const [productFilter, setProductFilter] = useState('ALL')
  const [userRoleFilter, setUserRoleFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  // Settings
  const [commissionRate, setCommissionRate] = useState(10)

  useEffect(() => {
    if (isLoggedIn) {
      fetchAdminData()
    }
  }, [isLoggedIn])

  const fetchAdminData = async () => {
    try {
      const [statsRes, pendingRes, analyticsRes, productsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/products/pending'),
        fetch('/api/admin/analytics'),
        fetch('/api/admin/products'),
        fetch('/api/admin/users'),
      ])

      const statsData = await statsRes.json()
      const pendingData = await pendingRes.json()
      const analyticsData = await analyticsRes.json()
      const productsData = await productsRes.json()
      const usersData = await usersRes.json()

      setStats(statsData.stats || statsData)
      setRecentTransactions(statsData.recentTransactions || [])
      setPendingProducts(Array.isArray(pendingData) ? pendingData : [])
      setAnalytics(analyticsData)
      setAllProducts(Array.isArray(productsData) ? productsData : [])
      setAllUsers(Array.isArray(usersData) ? usersData : [])
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch admin data:', err)
      setLoading(false)
    }
  }

  const handleApprove = async (productId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await fetch('/api/admin/products/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, status }),
      })
      fetchAdminData()
    } catch (err) {
      console.error('Failed to approve product:', err)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      fetchAdminData()
    } catch (err) {
      console.error('Failed to delete product:', err)
    }
  }

  const handleChangeUserRole = async (userId: string, role: string) => {
    try {
      await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role }),
      })
      fetchAdminData()
    } catch (err) {
      console.error('Failed to update user role:', err)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const enteredEmail = email.trim().toLowerCase()
    const enteredPassword = password.trim()

    if (enteredEmail === 'digitalflux237@gmail.com' && enteredPassword === 'digitalflux123') {
      setIsLoggedIn(true)
    } else {
      setError('Invalid email or password')
      setPassword('')
    }
  }

  const filteredProducts = (Array.isArray(allProducts) ? allProducts : []).filter(p => {
    const matchesStatus = productFilter === 'ALL' || p.status === productFilter
    const matchesSearch = searchTerm === '' || p.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const filteredUsers = (Array.isArray(allUsers) ? allUsers : []).filter(u => {
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter
    const matchesSearch = searchTerm === '' ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesRole && matchesSearch
  })

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <Card className="w-full max-w-md shadow-2xl border-purple-100">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 animate-pulse">
              <span className="text-3xl">👑</span>
            </div>
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Admin Access
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your credentials to access the admin panel
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Access Admin Panel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-purple-600 to-pink-600 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          {sidebarOpen && <h2 className="font-bold text-lg">Admin Panel</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {NAVIGATION.map((item, index) => (
            <AnimationWrapper key={item.id} delay={index * 0.05}>
              <button
                onClick={() => {
                  setActiveView(item.id)
                  setSearchTerm('')
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeView === item.id
                  ? 'bg-white text-purple-600 shadow-lg font-semibold'
                  : 'hover:bg-white/10'
                  }`}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            </AnimationWrapper>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button
            onClick={() => setIsLoggedIn(false)}
            variant="outline"
            className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            {sidebarOpen ? 'Logout' : <X size={16} />}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{NAVIGATION.find(n => n.id === activeView)?.label || 'Dashboard'}</h1>
          <p className="text-gray-500 mt-1">Welcome back, Administrator 👑</p>
        </header>

        <div className="p-8">
          {/* Dashboard View */}
          {activeView === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <AnimationWrapper>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('users')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      <Users className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{loading ? '...' : stats?.totalUsers || 0}</div>
                      <p className="text-xs text-muted-foreground">{stats?.totalSellers || 0} sellers</p>
                    </CardContent>
                  </Card>
                </AnimationWrapper>

                <AnimationWrapper delay={0.1}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('products')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                      <Package className="h-4 w-4 text-pink-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{loading ? '...' : stats?.totalProducts || 0}</div>
                      <p className="text-xs text-muted-foreground">{stats?.pendingProducts || 0} pending</p>
                    </CardContent>
                  </Card>
                </AnimationWrapper>

                <AnimationWrapper delay={0.2}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('analytics')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${loading ? '...' : (stats?.totalRevenue || 0).toFixed(2)}</div>
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <TrendingUp size={12} /> Platform earnings
                      </p>
                    </CardContent>
                  </Card>
                </AnimationWrapper>

                <AnimationWrapper delay={0.3}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('transactions')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                      <ShoppingCart className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{loading ? '...' : stats?.completedTransactions || 0}</div>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </CardContent>
                  </Card>
                </AnimationWrapper>
              </div>

              {pendingProducts.length > 0 && (
                <FadeIn delay={0.4}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Pending Product Approvals ({pendingProducts.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {pendingProducts.map((product, idx) => (
                          <AnimationWrapper key={product.id} delay={idx * 0.05}>
                            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                              <div className="flex-1">
                                <h4 className="font-semibold">{product.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  by {product.seller.name || product.seller.email} • ${product.price}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(product.id, 'APPROVED')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleApprove(product.id, 'REJECTED')}
                                  className="border-red-300 text-red-600 hover:bg-red-50"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </AnimationWrapper>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              )}
            </div>
          )}

          {/* Analytics View */}
          {activeView === 'analytics' && (
            <div className="space-y-8">
              <FadeIn>
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analytics?.revenueByDay || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </FadeIn>

              <div className="grid md:grid-cols-2 gap-8">
                <FadeIn delay={0.2}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Products by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={analytics?.productsByCategory || []}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => entry.name}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                          >
                            {(analytics?.productsByCategory || []).map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </FadeIn>

                <FadeIn delay={0.3}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Category Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics?.productsByCategory || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#ec4899" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </FadeIn>
              </div>
            </div>
          )}

          {/* Products View */}
          {activeView === 'products' && (
            <div className="space-y-6">
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <select
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <FadeIn>
                <Card>
                  <CardHeader>
                    <CardTitle>All Products ({filteredProducts.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredProducts.map((product, idx) => (
                        <AnimationWrapper key={product.id} delay={idx * 0.02}>
                          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h4 className="font-semibold">{product.title}</h4>
                                <span className={`text-xs px-2 py-1 rounded-full ${product.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                  product.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                  {product.status}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {product.seller.name || product.seller.email} • ${product.price} • {product.type}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {product.status === 'PENDING' && (
                                <>
                                  <Button size="sm" onClick={() => handleApprove(product.id, 'APPROVED')} className="bg-green-600">
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleApprove(product.id, 'REJECTED')}>
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              <Button size="sm" variant="outline" onClick={() => handleDeleteProduct(product.id)}>
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        </AnimationWrapper>
                      ))}
                      {filteredProducts.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No products found</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          )}

          {/* Users View */}
          {activeView === 'users' && (
            <div className="space-y-6">
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="ALL">All Roles</option>
                  <option value="BUYER">Buyers</option>
                  <option value="SELLER">Sellers</option>
                  <option value="ADMIN">Admins</option>
                </select>
              </div>

              <FadeIn>
                <Card>
                  <CardHeader>
                    <CardTitle>All Users ({filteredUsers.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredUsers.map((user, idx) => (
                        <AnimationWrapper key={user.id} delay={idx * 0.02}>
                          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h4 className="font-semibold">{user.name || 'No name'}</h4>
                                {user.role === 'ADMIN' && <Crown className="h-4 w-4 text-yellow-600" />}
                                {user.role === 'SELLER' && <Shield className="h-4 w-4 text-purple-600" />}
                                {user.role === 'BUYER' && <User className="h-4 w-4 text-gray-400" />}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {user.email} • {user._count.products} products • {user._count.purchases} purchases
                              </p>
                            </div>
                            <div className="flex gap-2 items-center">
                              <select
                                value={user.role}
                                onChange={(e) => handleChangeUserRole(user.id, e.target.value)}
                                className="px-3 py-1 border rounded text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                              >
                                <option value="BUYER">Buyer</option>
                                <option value="SELLER">Seller</option>
                                <option value="ADMIN">Admin</option>
                              </select>
                            </div>
                          </div>
                        </AnimationWrapper>
                      ))}
                      {filteredUsers.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No users found</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          )}

          {/* Transactions View */}
          {activeView === 'transactions' && (
            <FadeIn>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentTransactions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No transactions yet</p>
                  ) : (
                    <div className="space-y-2">
                      {recentTransactions.map((txn, idx) => (
                        <AnimationWrapper key={txn.id} delay={idx * 0.05}>
                          <div className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                            <div>
                              <p className="font-medium">{txn.product.title}</p>
                              <p className="text-sm text-muted-foreground">{txn.buyer.name || txn.buyer.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-600">${txn.amount.toFixed(2)}</p>
                              <p className="text-xs text-muted-foreground">{new Date(txn.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </AnimationWrapper>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeIn>
          )}

          {/* Settings View */}
          {activeView === 'settings' && (
            <div className="space-y-6">
              <FadeIn>
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Commission Rate (%)</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="number"
                          value={commissionRate}
                          onChange={(e) => setCommissionRate(Number(e.target.value))}
                          className="px-4 py-2 border rounded-lg w-32 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          min="0"
                          max="100"
                        />
                        <p className="text-sm text-muted-foreground">
                          Platform takes {commissionRate}% from each sale
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">Platform Statistics</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Total Commission Earned</p>
                          <p className="text-2xl font-bold text-purple-600">
                            ${((stats?.totalRevenue || 0) * commissionRate / 100).toFixed(2)}
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Seller Earnings</p>
                          <p className="text-2xl font-bold text-green-600">
                            ${((stats?.totalRevenue || 0) * (100 - commissionRate) / 100).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        Save Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.2}>
                <Card>
                  <CardHeader>
                    <CardTitle>Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                      <div>
                        <h4 className="font-semibold text-red-900">Clear All Data</h4>
                        <p className="text-sm text-red-700">This action cannot be undone</p>
                      </div>
                      <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100">
                        Clear Database
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
