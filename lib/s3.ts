import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl as awsGetSignedUrl } from "@aws-sdk/s3-request-presigner"

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// Upload a file to S3
export async function uploadToS3(file: Buffer, key: string, contentType: string): Promise<void> {
  const bucketName = process.env.AWS_BUCKET_NAME

  if (!bucketName) {
    throw new Error("AWS_BUCKET_NAME environment variable is not set")
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: file,
    ContentType: contentType,
  })

  await s3Client.send(command)

  // Return the key (not the full URL)
  return 
}

// Generate a signed URL for a file in S3
export async function getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
  const bucketName = process.env.AWS_BUCKET_NAME

  if (!bucketName) {
    throw new Error("AWS_BUCKET_NAME environment variable is not set")
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  })

  // Generate a signed URL that expires after the specified time
  const signedUrl = await awsGetSignedUrl(s3Client, command, { expiresIn })

  return signedUrl
}
