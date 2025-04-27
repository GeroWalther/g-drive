"use client";

import { Button } from "~/components/ui/button";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useRouter } from "next/navigation";
import { type FileProps } from "~/types/file";

interface UploadButtonProps {
  folderId?: string | null;
}

interface PresignedResponse {
  uploadUrl: string;
  fileKey: string;
  contentType: string;
  fileName: string;
  folderId?: string | null;
}

interface ErrorResponse {
  error?: string;
}

export function UploadButton({ folderId }: UploadButtonProps) {
  const router = useRouter();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = () => {
    // Simple file input click handler
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;

    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || files.length === 0) return;

      setIsUploading(true);
      setUploadProgress(0);
      setIsComplete(false);
      setUploadDialogOpen(true);

      try {
        // Process each file with client-side upload
        for (const file of Array.from(files)) {
          // Step 1: Get a presigned URL for S3 upload
          const presignedUrlResponse = await fetch("/api/s3/presigned", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fileName: file.name,
              contentType: file.type,
              folderId: folderId,
            }),
          });

          if (!presignedUrlResponse.ok) {
            const errorData =
              (await presignedUrlResponse.json()) as ErrorResponse;
            throw new Error(errorData.error ?? "Failed to get upload URL");
          }

          const { uploadUrl, fileKey } =
            (await presignedUrlResponse.json()) as PresignedResponse;

          // Step 2: Upload the file directly to S3
          setUploadProgress(10); // Starting the upload

          const uploadResponse = await fetch(uploadUrl, {
            method: "PUT",
            body: file,
            headers: {
              "Content-Type": file.type,
            },
          });

          if (!uploadResponse.ok) {
            throw new Error(
              `Failed to upload file to S3: ${uploadResponse.statusText}`,
            );
          }

          setUploadProgress(70); // Upload to S3 complete

          // Step 3: Complete the upload by recording in the database
          const completeResponse = await fetch("/api/s3/complete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fileKey,
              fileName: file.name,
              contentType: file.type,
              size: file.size,
              folderId,
            }),
          });

          if (!completeResponse.ok) {
            const errorData = (await completeResponse.json()) as ErrorResponse;
            throw new Error(errorData.error ?? "Failed to complete upload");
          }

          // Update progress for each file
          setUploadProgress(100);
        }

        // Handle successful upload
        setIsUploading(false);
        setIsComplete(true);

        // Refresh the page after a delay
        setTimeout(() => {
          router.refresh();
          setUploadDialogOpen(false);
          setIsComplete(false);
        }, 500);
      } catch (error) {
        console.error("Upload error:", error);
        setIsUploading(false);
        alert(
          `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        setUploadDialogOpen(false);
      }
    };

    input.click();
  };

  return (
    <>
      <Button
        variant="default"
        className="flex cursor-pointer items-center gap-2 bg-gray-100 text-gray-900 hover:bg-gray-300"
        onClick={handleFileUpload}
      >
        <UploadIcon className="h-5 w-5" />
        Upload
      </Button>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4 p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
              <CloudIcon className="h-8 w-8 text-blue-500" />
            </div>
            {isUploading ? (
              <div className="w-full space-y-2">
                <div className="mb-2 text-center">Uploading...</div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="text-center font-medium text-green-500">
                Upload complete!
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Export a new component for creating folders
export function NewFolderButton({ folderId }: { folderId?: string | null }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  // Store the folder ID in state when component mounts to ensure it's stable
  const [stableFolderId, setStableFolderId] = useState<string | null>(null);

  // Update stableFolderId when folderId prop changes
  useEffect(() => {
    const isValidId =
      typeof folderId === "string" &&
      folderId.trim() !== "" &&
      folderId !== "null";
    console.log(
      "NewFolderButton - received folderId:",
      folderId,
      "isValid:",
      isValidId,
    );

    if (isValidId) {
      setStableFolderId(folderId);
    } else {
      setStableFolderId(null);
    }
  }, [folderId]);

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;

    setIsCreating(true);

    try {
      console.log("Creating folder with parentId:", stableFolderId);

      // Call the folder creation API
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: folderName.trim(),
          parentId: stableFolderId,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error ?? "Failed to create folder");
      }

      // Log the response for debugging
      const folderData = (await response.json()) as FileProps;
      console.log("Folder created:", folderData);

      // Refresh the page to show the new folder
      router.refresh();
      setDialogOpen(false);
      setFolderName("");
    } catch (error) {
      console.error("Error creating folder:", error);
      alert(error instanceof Error ? error.message : "Failed to create folder");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="flex cursor-pointer items-center gap-2"
        onClick={() => setDialogOpen(true)}
      >
        <FolderIcon className="h-5 w-5" />
        New Folder
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="folder-name" className="text-sm font-medium">
                Folder Name
              </label>
              <input
                id="folder-name"
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="Enter folder name"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateFolder}
                disabled={!folderName.trim() || isCreating}
              >
                {isCreating ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloudIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  );
}
