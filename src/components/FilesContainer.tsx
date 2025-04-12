"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { FileList } from "~/components/ui/FileList";
import { FilesGrid } from "~/components/ui/FilesGrid";
import { ViewSwitcher } from "~/components/ui/ViewSwitcher";
import { type FileProps } from "~/types/file";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

interface FilesContainerProps {
  files: FileProps[];
  onFolderClick?: (file: FileProps) => void;
}

export function FilesContainer({ files, onFolderClick }: FilesContainerProps) {
  const [view, setView] = useState<"grid" | "list">("list");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    setUploadDialogOpen(true);

    // Simulate upload progress
    setTimeout(() => {
      setIsUploading(false);
    }, 3000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ViewSwitcher view={view} onChange={setView} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              className="flex cursor-pointer items-center gap-2 bg-gray-100 text-gray-900 hover:bg-gray-300"
            >
              <UploadIcon className="h-5 w-5" />
              Upload
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleUpload}>
              <FileIcon className="mr-2 h-4 w-4" />
              <span>File upload</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleUpload}>
              <FolderIcon className="mr-2 h-4 w-4" />
              <span>Folder upload</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleUpload}>
              <CloudIcon className="mr-2 h-4 w-4" />
              <span>From cloud storage</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {view === "list" ? (
        <FileList files={files} onFolderClick={onFolderClick} />
      ) : (
        <FilesGrid files={files} />
      )}

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
                    className="animate-progress h-full rounded-full bg-blue-500"
                    style={{ width: "60%" }}
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
    </div>
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
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  );
}
