import type { S3Config } from "../core/types";

/**
 * S3 Server configuration with environment variable support
 */
export interface S3ServerConfig extends Omit<S3Config, "credentials"> {
  /**
   * Environment variable prefix for S3 config
   * Default: "UPLOAD_IT_S3_"
   */
  envPrefix?: string;
}

/**
 * Response for the presigned URL generation
 */
export interface PresignedUrlResponse {
  /**
   * URL to upload the file to
   */
  uploadUrl: string;

  /**
   * Unique key for the file in the storage
   */
  fileKey: string;

  /**
   * Additional fields to include with the upload (for S3 multipart)
   */
  fields?: Record<string, string>;

  /**
   * Expiration time for the URL in seconds
   */
  expiresIn?: number;
}

/**
 * Response after completing an upload
 */
export interface CompleteUploadResponse {
  /**
   * Success status
   */
  success: boolean;

  /**
   * Public URL to access the file
   */
  url: string;

  /**
   * Unique key to reference the file
   */
  key: string;

  /**
   * Original filename
   */
  name: string;

  /**
   * MIME type of the file
   */
  type: string;

  /**
   * Size of the file in bytes
   */
  size: number;
}

/**
 * Response for a file URL request
 */
export interface FileUrlResponse {
  /**
   * Public URL to access the file
   */
  url: string;

  /**
   * Expiration time for the URL in seconds
   */
  expiresIn?: number;
}

/**
 * Request parameters for presigned URL
 */
export interface PresignedUrlRequest {
  /**
   * Name of the file
   */
  name: string;

  /**
   * MIME type of the file
   */
  type: string;

  /**
   * Size of the file in bytes
   */
  size: number;

  /**
   * Folder to store the file in
   */
  folder?: string;
}

/**
 * Request parameters for completing an upload
 */
export interface CompleteUploadRequest {
  /**
   * Name of the file
   */
  name: string;

  /**
   * Unique key for the file in storage
   */
  fileKey: string;

  /**
   * MIME type of the file
   */
  type: string;

  /**
   * Size of the file in bytes
   */
  size: number;
}

/**
 * Request parameters for getting a file URL
 */
export interface FileUrlRequest {
  /**
   * Unique key for the file in storage
   */
  fileKey: string;
}
