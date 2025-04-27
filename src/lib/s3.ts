import { S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

// Initialize the S3 client
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION ?? "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_USER_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_USER_SECRET_ACCESS_KEY ?? "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME ?? "";

/**
 * Generates a presigned URL for uploading a file directly to S3 from the client
 */
export async function generateUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 2592000,
) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
  return signedUrl;
}

/**
 * Generates a presigned URL for downloading/viewing a file from S3
 */
export async function generateDownloadUrl(key: string, expiresIn = 2592000) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
  return signedUrl;
}

/**
 * Deletes an object from S3
 */
export async function deleteFile(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return s3Client.send(command);
}

/**
 * Lists objects in a directory/prefix in S3
 */
export async function listFiles(prefix = "") {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: prefix,
  });

  const response = await s3Client.send(command);
  return response.Contents ?? [];
}

// Export the S3 client for direct use
export { s3Client };
