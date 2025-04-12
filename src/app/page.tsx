"use client";

import { useState } from "react";
import { folderContents, getFolderPath } from "~/data/mockData";
import { AppLayout } from "~/components/layout/AppLayout";
import { Breadcrumbs } from "~/components/ui/Breadcrumbs";
import { FilesContainer } from "~/components/FilesContainer";
import { type FileProps } from "~/types/file";

export default function HomePage() {
  const [currentFolderId, setCurrentFolderId] = useState<string>("root");
  const currentFolderContents = folderContents[currentFolderId] ?? [];
  const breadcrumbItems = getFolderPath(currentFolderId).map((folder) => ({
    label: folder.name,
    href: `#${folder.id}`,
  }));

  // Handle folder click
  const handleFolderClick = (file: FileProps) => {
    if (file.type === "folder") {
      setCurrentFolderId(file.id);
    }
  };

  // Handle breadcrumb click
  const handleBreadcrumbClick = (href: string) => {
    const id = href.startsWith("#") ? href.substring(1) : "root";
    setCurrentFolderId(id);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <Breadcrumbs
          items={breadcrumbItems}
          className="mb-6"
          onItemClick={handleBreadcrumbClick}
        />

        <section>
          <h1 className="mb-6 text-2xl font-bold">
            {currentFolderId === "root"
              ? "My Drive"
              : (getFolderPath(currentFolderId).pop()?.name ?? "My Drive")}
          </h1>
          <FilesContainer
            files={currentFolderContents}
            onFolderClick={handleFolderClick}
          />
        </section>
      </div>
    </AppLayout>
  );
}
