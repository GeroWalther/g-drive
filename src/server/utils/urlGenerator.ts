import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { S3ServerConfig } from "../types";
import { createS3Client } from "./s3Client";
import { getS3ConfigFromEnv } from "./configHelpers";

/**
 * Generate a unique file key for an upload
 *
 * @param fileName Original file name
 * @param folder Optional folder path
 * @returns Unique file key
 */
function generateFileKey(fileName: string, folder?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");

  const key = `${timestamp}-${random}-${sanitizedName}`;

  if (folder) {
    const sanitizedFolder = folder.replace(/^\/|\/$/g, ""); // Remove leading and trailing slashes
    return `${sanitizedFolder}/${key}`;
  }

  return key;
}

/**
 * Generate a presigned URL for direct upload to S3
 *
 * @param config S3 configuration (if not provided, uses environment variables)
 * @param fileName Original file name
 * @param contentType MIME type of the file
 * @param folder Optional folder path
 * @param expiresIn Expiration time in seconds (default: 15 minutes)
 * @returns Presigned URL, file key, and expiration
 */
export async function generatePresignedUrl(
  config: Partial<S3ServerConfig> = {},
  fileName: string,
  contentType: string,
  folder?: string,
  expiresIn = 900, // 15 minutes in seconds
) {
  // Get the S3 configuration
  const s3Config = getS3ConfigFromEnv(config);

  // Generate a unique file key
  const folderToUse = folder ?? s3Config.uploadFolder;
  const fileKey = generateFileKey(fileName, folderToUse);

  // Create S3 client
  const s3Client = createS3Client(s3Config);

  // Create command for PUT operation
  const putCommand = new PutObjectCommand({
    Bucket: s3Config.bucket,
    Key: fileKey,
    ContentType: contentType,
  });

  // Generate the presigned URL
  const uploadUrl = await getSignedUrl(s3Client, putCommand, { expiresIn });

  return {
    uploadUrl,
    fileKey,
    expiresIn,
  };
}

/**
 * Generate a presigned URL for accessing a file in S3
 *
 * @param config S3 configuration (if not provided, uses environment variables)
 * @param fileKey File key in S3
 * @param expiresIn Expiration time in seconds (default: 1 hour)
 * @returns Access URL and expiration
 */
export async function generateFileUrl(
  config: Partial<S3ServerConfig> = {},
  fileKey: string,
  expiresIn = 3600, // 1 hour in seconds
) {
  // Get the S3 configuration
  const s3Config = getS3ConfigFromEnv(config);

  // Create S3 client
  const s3Client = createS3Client(s3Config);

  // Create command for GET operation
  const getCommand = new GetObjectCommand({
    Bucket: s3Config.bucket,
    Key: fileKey,
  });

  // Generate the presigned URL
  const url = await getSignedUrl(s3Client, getCommand, { expiresIn });

  return {
    url,
    expiresIn,
  };
}
