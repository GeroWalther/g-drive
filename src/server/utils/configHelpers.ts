import type { S3ServerConfig } from "../types";

/**
 * Extracts S3 configuration from environment variables
 *
 * @param config Optional configuration overrides
 * @returns S3 configuration with credentials from environment variables
 */
export function getS3ConfigFromEnv(
  config: Partial<S3ServerConfig> = {},
): S3ServerConfig {
  const envPrefix = config.envPrefix ?? "UPLOAD_IT_S3_";

  // Required environment variables
  const region = process.env[`${envPrefix}REGION`];
  const bucket = process.env[`${envPrefix}BUCKET`];
  const accessKeyId = process.env[`${envPrefix}ACCESS_KEY`];
  const secretAccessKey = process.env[`${envPrefix}SECRET_KEY`];

  // Optional environment variables
  const folder = process.env[`${envPrefix}FOLDER`];
  const endpoint = process.env[`${envPrefix}ENDPOINT`];

  // Validate required config
  if (!region) {
    throw new Error(`Missing environment variable: ${envPrefix}REGION`);
  }

  if (!bucket) {
    throw new Error(`Missing environment variable: ${envPrefix}BUCKET`);
  }

  if (!accessKeyId) {
    throw new Error(`Missing environment variable: ${envPrefix}ACCESS_KEY`);
  }

  if (!secretAccessKey) {
    throw new Error(`Missing environment variable: ${envPrefix}SECRET_KEY`);
  }

  // Combine environment variables with provided config
  return {
    ...config,
    region,
    bucket,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    uploadFolder: folder,
    endpoint,
  };
}
