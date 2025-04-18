import { FileCard } from "./FileCard";
import { type FileProps } from "~/types/file";
import Link from "next/link";

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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {files.map((file) => {
        const url = getLinkUrl
          ? getLinkUrl(file)
          : file.type === "folder" && getFolderUrl
            ? getFolderUrl(file)
            : undefined;

        return (
          <div key={file.id}>
            {url ? (
              <Link href={url} className="block">
                <FileCard
                  name={file.name}
                  type={file.type}
                  size={file.size}
                  lastModified={file.lastModified}
                  itemCount={
                    file.type === "folder" ? (file.itemCount ?? 0) : undefined
                  }
                  onClick={() => handleClick(file)}
                  url={file.url}
                />
              </Link>
            ) : (
              <FileCard
                name={file.name}
                type={file.type}
                size={file.size}
                lastModified={file.lastModified}
                itemCount={
                  file.type === "folder" ? (file.itemCount ?? 0) : undefined
                }
                onClick={() => handleClick(file)}
                url={file.url}
              />
            )}
          </div>
        );
      })}
      {files.length === 0 && (
        <div className="text-muted-foreground col-span-full py-12 text-center">
          No files found
        </div>
      )}
    </div>
  );
}
