"use client";

import { useState, useEffect } from "react";
import { FileList } from "~/components/ui/FileList";
import { FilesGrid } from "~/components/ui/FilesGrid";
import { ViewSwitcher } from "~/components/ui/ViewSwitcher";
import { type FileProps } from "~/types/file";
import { UploadButton, NewFolderButton } from "~/components/ui/UploadButton";
import { extractFolderIdFromPath } from "~/lib/utils";

// Function to safely access localStorage (avoids SSR issues)
const getStoredViewMode = (): "grid" | "list" => {
  if (typeof window !== "undefined") {
    const storedMode = localStorage.getItem("gdrive-view-mode");
    return storedMode === "grid" ? "grid" : "list";
  }
  return "list"; // Default for SSR
};

// Extract folder ID from a URL path
const extractFolderIdFromUrl = (path: string): string | null => {
  // Match only digits after /drive/
  const drivePattern = /^\/drive\/(\d+)(?:\/.*)?$/;
  const match = drivePattern.exec(path);

  if (match?.[1]) {
    return match[1];
  }

  return null;
};

interface FilesContainerProps {
  files: FileProps[];
  onFolderClick?: (file: FileProps) => void;
  onFileClick?: (file: FileProps) => void;
  getFolderUrl?: (file: FileProps) => string;
  getLinkUrl?: (file: FileProps) => string | undefined;
  readOnly?: boolean; // Added to support shared view (no upload/create buttons)
}

export function FilesContainer({
  files,
  onFolderClick,
  onFileClick,
  getFolderUrl,
  getLinkUrl,
  readOnly,
}: FilesContainerProps) {
  // Initialize with a default value, will be updated in useEffect
  const [view, setView] = useState<"grid" | "list">("list");
  // Store current folder ID in state to ensure stability
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  // Load the view mode from localStorage on component mount
  // and determine the current folder ID
  useEffect(() => {
    setView(getStoredViewMode());

    // Determine and set current folder ID
    if (typeof window !== "undefined") {
      try {
        const path = window.location.pathname;
        console.log("Current path on component mount:", path);

        // Try to extract folder ID from URL
        const folderId = extractFolderIdFromUrl(path);
        console.log("Folder ID from URL (useEffect):", folderId);

        // Set the folder ID in state
        setCurrentFolderId(folderId);
      } catch (error) {
        console.error("Error extracting folder ID:", error);
      }
    }
  }, []);

  // Update view mode in state and localStorage when changed
  const handleViewChange = (newView: "grid" | "list") => {
    setView(newView);
    if (typeof window !== "undefined") {
      localStorage.setItem("gdrive-view-mode", newView);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ViewSwitcher view={view} onChange={handleViewChange} />
        </div>

        {!readOnly && (
          <div className="flex items-center gap-2">
            <NewFolderButton folderId={currentFolderId} />
            <UploadButton folderId={currentFolderId} />
          </div>
        )}
      </div>

      {view === "list" ? (
        <FileList
          files={files}
          onFolderClick={onFolderClick}
          onFileClick={onFileClick}
          getFolderUrl={getFolderUrl}
          getLinkUrl={getLinkUrl}
        />
      ) : (
        <FilesGrid
          files={files}
          onFolderClick={onFolderClick}
          onFileClick={onFileClick}
          getFolderUrl={getFolderUrl}
          getLinkUrl={getLinkUrl}
        />
      )}
    </div>
  );
}
