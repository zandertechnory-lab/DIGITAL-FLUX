'use client'

import { useEffect, useRef, useState } from 'react'

interface SplineViewerProps {
    url?: string
    className?: string
    style?: React.CSSProperties
}

// Declare the custom element for TypeScript
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'spline-viewer': React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement> & { url?: string },
                HTMLElement
            >
        }
    }
}

export default function SplineViewer({
    url = 'https://prod.spline.design/G1dxqWYN1gjKVw1Z/scene.splinecode',
    className = '',
    style = {}
}: SplineViewerProps) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [error, setError] = useState(false)
    const scriptLoadedRef = useRef(false)

    useEffect(() => {
        // Only load the script once
        if (scriptLoadedRef.current) {
            setIsLoaded(true)
            return
        }

        const script = document.createElement('script')
        script.type = 'module'
        script.src = 'https://unpkg.com/@splinetool/viewer@1.12.6/build/spline-viewer.js'

        script.onload = () => {
            scriptLoadedRef.current = true
            setIsLoaded(true)
        }

        script.onerror = () => {
            setError(true)
            console.error('Failed to load Spline viewer script')
        }

        document.head.appendChild(script)

        return () => {
            // Cleanup: remove script only if component is unmounted and script exists
            if (script.parentNode) {
                script.parentNode.removeChild(script)
            }
        }
    }, [])

    if (error) {
        return (
            <div className={`flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 ${className}`} style={style}>
                <div className="text-center p-8">
                    <div className="text-4xl mb-4">✨</div>
                    <p className="text-gray-600">3D Scene Loading...</p>
                </div>
            </div>
        )
    }

    if (!isLoaded) {
        return (
            <div className={`flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 ${className}`} style={style}>
                <div className="text-center p-8 animate-pulse">
                    <div className="text-4xl mb-4">🎨</div>
                    <p className="text-gray-600">Loading 3D Experience...</p>
                </div>
            </div>
        )
    }

    return (
        <div className={`relative ${className}`} style={style}>
            <spline-viewer
                url={url}
                className="w-full h-full"
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    )
}
