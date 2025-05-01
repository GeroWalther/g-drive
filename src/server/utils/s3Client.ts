import { S3Client } from "@aws-sdk/client-s3";
import type { S3ServerConfig } from "../types";
import { getS3ConfigFromEnv } from "./configHelpers";

/**
 * Create an S3 client instance with the provided configuration
 *
 * @param config S3 configuration
 * @returns Configured S3 client
 */
export function createS3Client(config?: Partial<S3ServerConfig>): S3Client {
  // Get config from environment if not provided
  const s3Config = config ? getS3ConfigFromEnv(config) : getS3ConfigFromEnv();

  // Create S3 client configuration object
  const clientConfig: {
    region: string;
    credentials: { accessKeyId: string; secretAccessKey: string };
    endpoint?: string;
  } = {
    region: s3Config.region,
    credentials: s3Config.credentials,
  };

  // Add optional endpoint if defined
  if (s3Config.endpoint) {
    clientConfig.endpoint = s3Config.endpoint;
  }

  // Create and return the S3 client
  return new S3Client(clientConfig);
}
