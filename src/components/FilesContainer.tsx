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

  // Separate effect for logging files to avoid dependency array size issues
  useEffect(() => {
    // Debug - log all folders in the current files list
    console.log(
      "Files in current view:",
      files.map((file) => ({
        id: file.id,
        name: file.name,
        type: file.type,
        parentId: file.parentId,
      })),
    );
  }, [files]);

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
    console.log("Current path:", path);

    // Basic extraction - gets parent ID for nested paths
    const basicFolderId = extractFolderIdFromPath(path);
    console.log("Basic folder ID:", basicFolderId);

    if (!basicFolderId) return null;

    // For nested paths like /drive/{parentId}/{folderName}
    const parts = path.split("/").filter((part) => part);
    if (parts.length > 2 && parts[0] === "drive") {
      // Last part is the folder name, not the ID
      const folderName = parts[parts.length - 1];
      console.log("Looking for folder by name:", folderName);

      // Try to find the folder ID by name in the current files list
      const foundFolder = files.find(
        (file) => file.type === "folder" && file.name === folderName,
      );

      if (foundFolder) {
        console.log(
          "Found folder by name:",
          foundFolder.name,
          "ID:",
          foundFolder.id,
        );
        return foundFolder.id;
      }
    }

    // Fall back to basic folder ID (parent ID)
    return basicFolderId;
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
