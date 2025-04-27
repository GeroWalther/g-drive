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

    try {
      // Get current path from URL
      const path = window.location.pathname;
      console.log("Current path:", path);

      // Extract folder ID directly from URL - use pattern matching
      // This matches patterns like /drive/123 or /drive/123/some-folder-name
      const drivePattern = /^\/drive\/(\d+)(?:\/.*)?$/;
      const match = drivePattern.exec(path);

      if (match?.[1]) {
        const folderId = match[1];
        console.log("Found folder ID from URL pattern:", folderId);
        return folderId;
      }

      // If we're at the root drive path with no ID
      if (path === "/drive") {
        console.log("At root drive path");
        return null;
      }

      // Final fallback to the utility function
      const extractedId = extractFolderIdFromPath(path);
      console.log("Extracted folder ID from utility:", extractedId);
      return extractedId;
    } catch (error) {
      console.error("Error getting current folder ID:", error);
      return null;
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
