'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function FileList({ productId }: { productId: string }) {
  const { data: session } = useSession()
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetch(`/api/products/${productId}/files`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error(data.error)
          } else {
            setFiles(data)
          }
        })
        .finally(() => setLoading(false))
    }
  }, [productId, session])

  if (loading) {
    return <div>Loading files...</div>
  }

  if (files.length === 0) {
    return <p className="text-muted-foreground">No files available</p>
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold mb-2">Download Files</h3>
      {files.map((file) => (
        <a
          key={file.id}
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3 border rounded hover:bg-muted"
        >
          <div className="flex justify-between items-center">
            <span>{file.name}</span>
            <span className="text-sm text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        </a>
      ))}
    </div>
  )
}

