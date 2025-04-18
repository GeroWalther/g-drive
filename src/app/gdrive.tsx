"use client";

import { useState, useEffect } from "react";
import { Breadcrumbs } from "~/components/ui/Breadcrumbs";
import { FilesContainer } from "~/components/FilesContainer";
import { type FileProps } from "~/types/file";
import { buildFolderPath } from "~/lib/utils";

interface GDriveProps {
  documents: FileProps[];
  currentFolder?: FileProps;
  allItems?: FileProps[]; // All items for breadcrumb path generation
}

export default function GDrive({
  documents,
  currentFolder,
  allItems = [],
}: GDriveProps) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(
    currentFolder?.id ?? null,
  );
  const [folderStructure, setFolderStructure] = useState<
    Record<string, FileProps[]>
  >({});

  // Organize documents into folder structure on component mount
  useEffect(() => {
    const structure: Record<string, FileProps[]> = {};

    // Group files by parent ID
    documents.forEach((doc) => {
      const parentId = doc.parentId ?? "root";
      structure[parentId] ??= [];
      structure[parentId].push(doc);
    });

    setFolderStructure(structure);
  }, [documents]);

  // Get current folder contents
  const currentFolderContents = currentFolderId
    ? (folderStructure[currentFolderId] ?? [])
    : (folderStructure.root ?? []);

  // Use all items if provided, otherwise use documents + current folder
  const itemsForBreadcrumbs =
    allItems.length > 0
      ? allItems
      : [...documents, ...(currentFolder ? [currentFolder] : [])];

  // Generate breadcrumb path for current folder
  const breadcrumbPath = buildFolderPath(itemsForBreadcrumbs, currentFolderId);

  // Handle folder click
  const handleFolderClick = (file: FileProps) => {
    if (file.type === "folder") {
      // If in client-side navigation mode
      setCurrentFolderId(file.id);

      // For folder navigation to separate pages
      if (typeof window !== "undefined") {
        window.location.href = `/drive/${file.id}`;
      }
    }
  };

  // Handle breadcrumb click
  const handleBreadcrumbClick = (href: string) => {
    const id = href.startsWith("#") ? href.substring(1) : "root";

    // If clicking on the root, go to home page
    if (id === "root") {
      if (typeof window !== "undefined") {
        window.location.href = "/drive";
      }
      return;
    }

    // Navigate to folder
    if (typeof window !== "undefined") {
      window.location.href = `/drive/${id}`;
    }
  };

  // Create breadcrumb items
  const breadcrumbItems = breadcrumbPath.map((folder) => ({
    label: folder.name,
    href: `#${folder.id}`,
  }));

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={breadcrumbItems}
        className="mb-6"
        onItemClick={handleBreadcrumbClick}
      />

      <section>
        <h1 className="mb-6 text-2xl font-bold">
          {currentFolder?.name ??
            (currentFolderId === null
              ? "My Drive"
              : (breadcrumbPath[breadcrumbPath.length - 1]?.name ??
                "My Drive"))}
        </h1>
        <FilesContainer files={documents} onFolderClick={handleFolderClick} />
      </section>
    </div>
  );
}
