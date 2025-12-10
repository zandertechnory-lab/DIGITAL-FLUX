'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function UploadProductPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'COURSE' as 'COURSE' | 'DIGITAL_PRODUCT' | 'EVENT' | 'SERVICE' | 'MASTERCLASS',
    categoryId: '',
    thumbnail: '',
    courseMetadata: {
      duration: '',
      level: '',
      language: '',
      instructor: '',
    },
    eventMetadata: {
      eventDate: '',
      location: '',
      isOnline: false,
      maxAttendees: '',
    },
    serviceMetadata: {
      duration: '',
      deliveryTime: '',
      isRecurring: false,
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload: any = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        type: formData.type,
        categoryId: formData.categoryId || undefined,
        thumbnail: formData.thumbnail || undefined,
      }

      if (formData.type === 'COURSE' && formData.courseMetadata.duration) {
        payload.courseMetadata = {
          duration: parseInt(formData.courseMetadata.duration),
          level: formData.courseMetadata.level || undefined,
          language: formData.courseMetadata.language || undefined,
          instructor: formData.courseMetadata.instructor || undefined,
        }
      }

      if (formData.type === 'EVENT' && formData.eventMetadata.eventDate) {
        payload.eventMetadata = {
          eventDate: formData.eventMetadata.eventDate,
          location: formData.eventMetadata.location || undefined,
          isOnline: formData.eventMetadata.isOnline,
          maxAttendees: formData.eventMetadata.maxAttendees
            ? parseInt(formData.eventMetadata.maxAttendees)
            : undefined,
        }
      }

      if (formData.type === 'SERVICE' && formData.serviceMetadata.duration) {
        payload.serviceMetadata = {
          duration: parseInt(formData.serviceMetadata.duration),
          deliveryTime: formData.serviceMetadata.deliveryTime || undefined,
          isRecurring: formData.serviceMetadata.isRecurring,
        }
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create product')
        return
      }

      router.push(`/seller/products/${data.id}`)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Upload Product</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Product Type</label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as any })
            }
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="COURSE">Course</option>
            <option value="DIGITAL_PRODUCT">Digital Product</option>
            <option value="EVENT">Event</option>
            <option value="SERVICE">Service</option>
            <option value="MASTERCLASS">Masterclass</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md"
            rows={6}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Price (XAF)</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Thumbnail URL
          </label>
          <input
            type="url"
            value={formData.thumbnail}
            onChange={(e) =>
              setFormData({ ...formData, thumbnail: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {formData.type === 'COURSE' && (
          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="font-semibold">Course Details</h3>
            <div>
              <label className="block text-sm font-medium mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.courseMetadata.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    courseMetadata: {
                      ...formData.courseMetadata,
                      duration: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Level</label>
              <input
                type="text"
                value={formData.courseMetadata.level}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    courseMetadata: {
                      ...formData.courseMetadata,
                      level: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Beginner, Intermediate, Advanced"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <input
                type="text"
                value={formData.courseMetadata.language}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    courseMetadata: {
                      ...formData.courseMetadata,
                      language: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Instructor
              </label>
              <input
                type="text"
                value={formData.courseMetadata.instructor}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    courseMetadata: {
                      ...formData.courseMetadata,
                      instructor: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        )}

        {formData.type === 'EVENT' && (
          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="font-semibold">Event Details</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Event Date</label>
              <input
                type="datetime-local"
                value={formData.eventMetadata.eventDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    eventMetadata: {
                      ...formData.eventMetadata,
                      eventDate: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={formData.eventMetadata.location}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    eventMetadata: {
                      ...formData.eventMetadata,
                      location: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.eventMetadata.isOnline}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      eventMetadata: {
                        ...formData.eventMetadata,
                        isOnline: e.target.checked,
                      },
                    })
                  }
                />
                Online Event
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Max Attendees
              </label>
              <input
                type="number"
                value={formData.eventMetadata.maxAttendees}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    eventMetadata: {
                      ...formData.eventMetadata,
                      maxAttendees: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        )}

        {formData.type === 'SERVICE' && (
          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="font-semibold">Service Details</h3>
            <div>
              <label className="block text-sm font-medium mb-2">
                Duration (hours)
              </label>
              <input
                type="number"
                value={formData.serviceMetadata.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    serviceMetadata: {
                      ...formData.serviceMetadata,
                      duration: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Delivery Time
              </label>
              <input
                type="text"
                value={formData.serviceMetadata.deliveryTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    serviceMetadata: {
                      ...formData.serviceMetadata,
                      deliveryTime: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., 3-5 business days"
              />
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.serviceMetadata.isRecurring}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      serviceMetadata: {
                        ...formData.serviceMetadata,
                        isRecurring: e.target.checked,
                      },
                    })
                  }
                />
                Recurring Service
              </label>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  )
}

