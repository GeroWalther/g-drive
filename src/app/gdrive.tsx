"use client";

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
  // Use all items if provided, otherwise use documents + current folder
  const itemsForBreadcrumbs =
    allItems.length > 0
      ? allItems
      : [...documents, ...(currentFolder ? [currentFolder] : [])];

  // Generate breadcrumb path for current folder
  const breadcrumbPath = buildFolderPath(
    itemsForBreadcrumbs,
    currentFolder?.id ?? null,
  );

  // Generate URLs for folders
  const getFolderUrl = (file: FileProps): string => {
    if (file.type === "folder") {
      return `/drive/${file.id}`;
    }
    // For non-folders, you might want to implement file preview
    return "#";
  };

  // Helper function to get link URL for files
  const getLinkUrl = (file: FileProps) => {
    return file.type !== "folder" && file.url ? file.url : undefined;
  };

  // Handle file clicks - open in new tab
  const handleFileClick = (file: FileProps) => {
    if (file.type !== "folder" && file.url) {
      // Let the FileCard handle URL refreshing and opening
      // The actual URL opening happens in the FileCard component
    }
  };

  // Create breadcrumb items with proper hrefs
  const breadcrumbItems = breadcrumbPath.map((folder) => ({
    label: folder.name,
    href: folder.id === "root" ? "/drive" : `/drive/${folder.id}`,
  }));

  return (
    <div className="space-y-8">
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />

      <section>
        <h1 className="mb-6 text-2xl font-bold">
          {currentFolder?.name ?? "My Drive"}
        </h1>
        <FilesContainer
          files={documents}
          getFolderUrl={getFolderUrl}
          getLinkUrl={getLinkUrl}
          onFileClick={handleFileClick}
          onFolderClick={(file) => {
            // This is now mainly used for analytics or other side effects,
            // since navigation is handled by Link components
          }}
        />
      </section>
    </div>
  );
}
