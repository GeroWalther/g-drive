"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "~/components/layout/AppLayout";
import { Breadcrumbs } from "~/components/ui/Breadcrumbs";
import { FilesContainer } from "~/components/FilesContainer";
import { type FileProps } from "~/types/file";
import { buildFolderPath } from "~/lib/utils";

interface GDriveProps {
  documents: FileProps[];
}

export default function GDrive({ documents }: GDriveProps) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
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

  // Generate breadcrumb path for current folder
  const breadcrumbPath = buildFolderPath(documents, currentFolderId);

  // Handle folder click
  const handleFolderClick = (file: FileProps) => {
    if (file.type === "folder") {
      setCurrentFolderId(file.id);
    }
  };

  // Handle breadcrumb click
  const handleBreadcrumbClick = (href: string) => {
    const id = href.startsWith("#") ? href.substring(1) : "root";

    // If clicking on the root, set current folder to null
    if (id === "root") {
      setCurrentFolderId(null);
      return;
    }

    // Set current folder to the clicked breadcrumb
    setCurrentFolderId(id);
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
          {currentFolderId === null
            ? "My Drive"
            : breadcrumbPath[breadcrumbPath.length - 1]?.name}
        </h1>
        <FilesContainer
          files={currentFolderContents}
          onFolderClick={handleFolderClick}
        />
      </section>
    </div>
  );
}
