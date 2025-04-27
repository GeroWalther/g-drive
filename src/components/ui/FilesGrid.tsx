"use client";

import Link from "next/link";
import { type FileProps } from "~/types/file";
import { FileCard } from "./FileCard";
import { FileActions, useFileActions } from "./FileActions";

interface FilesGridProps {
  files: FileProps[];
  onFolderClick?: (file: FileProps) => void;
  onFileClick?: (file: FileProps) => void;
  getFolderUrl?: (file: FileProps) => string;
  getLinkUrl?: (file: FileProps) => string | undefined;
}

export function FilesGrid({
  files,
  onFolderClick,
  onFileClick,
  getFolderUrl,
  getLinkUrl,
}: FilesGridProps) {
  // Use a single shared instance of fileActions
  const fileActions = useFileActions();

  const handleClick = (file: FileProps) => {
    if (file.type === "folder" && onFolderClick) {
      // If getFolderUrl is provided, let the Link component handle navigation
      if (!getFolderUrl) {
        onFolderClick(file);
      }
    } else if (file.type !== "folder" && onFileClick) {
      onFileClick(file);
    }
  };

  return (
    <>
      {/* Render the FileActions component once, outside the file loop */}
      {fileActions.selectedFile && (
        <FileActions
          file={fileActions.selectedFile}
          fileActions={fileActions}
        />
      )}

      <div>
        {files.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {files.map((file) => (
              <div key={file.id}>
                {getLinkUrl?.(file) ? (
                  <Link
                    href={getLinkUrl(file) ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      // Let the link open in a new tab but prevent other handlers
                      e.stopPropagation();
                    }}
                  >
                    <FileCard
                      id={file.id}
                      name={file.name}
                      type={file.type}
                      size={file.size}
                      lastModified={file.lastModified}
                      itemCount={file.itemCount}
                      url={file.url}
                      fileActions={fileActions}
                    />
                  </Link>
                ) : file.type === "folder" && getFolderUrl ? (
                  <Link href={getFolderUrl(file)}>
                    <FileCard
                      id={file.id}
                      name={file.name}
                      type={file.type}
                      size={file.size}
                      lastModified={file.lastModified}
                      itemCount={file.itemCount}
                      onClick={() => handleClick(file)}
                      fileActions={fileActions}
                    />
                  </Link>
                ) : (
                  <FileCard
                    id={file.id}
                    name={file.name}
                    type={file.type}
                    size={file.size}
                    lastModified={file.lastModified}
                    itemCount={file.itemCount}
                    url={file.url}
                    onClick={() => handleClick(file)}
                    fileActions={fileActions}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground rounded-lg border p-8 text-center">
            No files found
          </div>
        )}
      </div>
    </>
  );
}
