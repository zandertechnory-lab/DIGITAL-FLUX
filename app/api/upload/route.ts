import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUploadSignedUrl, generateS3Key } from '@/lib/s3'
import { z } from 'zod'

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'video/mp4',
]

const uploadSchema = z.object({
  fileName: z.string().min(1),
  contentType: z
    .string()
    .min(1)
    .refine((val) => ALLOWED_MIME_TYPES.some((type) => val === type || val.startsWith(type.split('/')[0])), {
      message: 'Unsupported file type',
    }),
  productId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validated = uploadSchema.parse(body)

    const userId = session.user.id
    const productId = validated.productId || 'temp'
    const s3Key = generateS3Key(userId, productId, validated.fileName)

    const signedUrl = await getUploadSignedUrl(
      s3Key,
      validated.contentType,
      3600 // 1 hour expiry
    )

    return NextResponse.json({
      signedUrl,
      s3Key,
      url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error generating upload URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
}

