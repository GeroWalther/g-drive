import { FileCard } from "./FileCard";
import { type FileProps } from "~/types/file";

interface FilesGridProps {
  files: FileProps[];
  onFolderClick?: (file: FileProps) => void;
}

export function FilesGrid({ files, onFolderClick }: FilesGridProps) {
  const handleFolderClick = (file: FileProps) => {
    if (file.type === "folder" && onFolderClick) {
      onFolderClick(file);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {files.map((file) => (
        <FileCard
          key={file.id}
          name={file.name}
          type={file.type}
          size={file.size}
          lastModified={file.lastModified}
          itemCount={file.type === "folder" ? (file.itemCount ?? 0) : undefined}
          onClick={() => file.type === "folder" && handleFolderClick(file)}
        />
      ))}
      {files.length === 0 && (
        <div className="text-muted-foreground col-span-full py-12 text-center">
          No files found
        </div>
      )}
    </div>
  );
}
