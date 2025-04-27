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

  // Load the view mode from localStorage on component mount
  useEffect(() => {
    setView(getStoredViewMode());
  }, []);

  // Update view mode in state and localStorage when changed
  const handleViewChange = (newView: "grid" | "list") => {
    setView(newView);
    if (typeof window !== "undefined") {
      localStorage.setItem("gdrive-view-mode", newView);
    }
  };

  // Get current folder ID if applicable
  const getCurrentFolderId = (): string | null => {
    // If we don't have access to window, we're in SSR
    if (typeof window === "undefined") return null;

    // Get current path from URL
    const path = window.location.pathname;

    // Extract folder ID directly from URL
    const pathSegments = path.split("/").filter(Boolean);

    // Check if we're in a drive path
    if (pathSegments[0] === "drive") {
      // Second segment should be the folder ID
      if (pathSegments.length > 1) {
        const secondSegment = pathSegments[1];

        // Check if it's numeric
        if (secondSegment && /^\d+$/.test(secondSegment)) {
          return secondSegment;
        }
      }
    }

    // Fallback to utility function
    return extractFolderIdFromPath(path);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ViewSwitcher view={view} onChange={handleViewChange} />
        </div>

        {!readOnly && (
          <div className="flex items-center gap-2">
            <NewFolderButton folderId={getCurrentFolderId()} />
            <UploadButton folderId={getCurrentFolderId()} />
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
