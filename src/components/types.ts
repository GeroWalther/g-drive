// Type definitions for UploadIt React components
import type { ReactNode } from "react";
import type {
  FileMetadata,
  ProviderType,
  S3Config,
  FilesystemConfig,
  ServerConfig,
} from "../core/types";

/**
 * Props for the UploadButton component
 */
export interface UploadButtonProps {
  provider: ProviderType;
  s3?: S3Config;
  filesystem?: FilesystemConfig;
  server?: ServerConfig;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  className?: string;
  buttonText?: string;
  multiple?: boolean;
  accept?: string;
  folder?: string;
  showProgressDialog?: boolean;
  dialogTitle?: string;
  children?: ReactNode;
  onSuccess?: (files: FileMetadata[]) => void;
  onError?: (error: Error) => void;
  renderButton?: (props: {
    onClick: () => void;
    isUploading: boolean;
  }) => ReactNode;
  renderDialog?: (props: {
    isOpen: boolean;
    onClose: () => void;
    progress: number;
    isComplete: boolean;
    hasErrors: boolean;
  }) => ReactNode;
}

/**
 * Props for the UploadDialog component
 */
export interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  progress: Record<string, { percentage: number }>;
  isComplete: boolean;
  hasErrors: boolean;
  error?: string;
}
