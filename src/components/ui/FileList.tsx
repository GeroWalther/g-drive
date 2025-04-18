"use client";

import Link from "next/link";
import { type FileProps } from "~/types/file";
import {
  DocumentIcon,
  FolderIcon,
  PDFIcon,
  SpreadsheetIcon,
  GenericFileIcon,
  DotsIcon,
} from "./Icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface FileListProps {
  files: FileProps[];
  onFolderClick?: (file: FileProps) => void;
  onFileClick?: (file: FileProps) => void;
  getFolderUrl?: (file: FileProps) => string;
  getLinkUrl?: (file: FileProps) => string | undefined;
}

export function FileList({
  files,
  onFolderClick,
  onFileClick,
  getFolderUrl,
  getLinkUrl,
}: FileListProps) {
  const handleClick = (file: FileProps, e: React.MouseEvent) => {
    if (file.type === "folder" && onFolderClick) {
      // If getFolderUrl is provided, let the Link component handle navigation
      // This prevents duplicate navigation
      if (!getFolderUrl) {
        onFolderClick(file);
      }
    } else if (file.type !== "folder" && onFileClick) {
      onFileClick(file);
    }
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case "folder":
        return <FolderIcon className="h-5 w-5 text-blue-500" />;
      case "doc":
        return <DocumentIcon className="h-5 w-5 text-blue-600" />;
      case "sheet":
        return <SpreadsheetIcon className="h-5 w-5 text-green-600" />;
      case "pdf":
        return <PDFIcon className="h-5 w-5 text-red-600" />;
      default:
        return <GenericFileIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="border-border bg-card overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-secondary/50 text-foreground">
          <tr>
            <th className="w-[40%] px-4 py-3 text-left font-medium">Name</th>
            <th className="hidden px-4 py-3 text-left font-medium md:table-cell">
              Modified
            </th>
            <th className="hidden px-4 py-3 text-left font-medium md:table-cell">
              Size
            </th>
            <th className="hidden px-4 py-3 text-left font-medium md:table-cell">
              Type
            </th>
            <th className="w-10 px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr
              key={file.id}
              className={`hover:bg-secondary/30 border-border border-t ${file.type === "folder" || onFileClick ? "cursor-pointer" : ""}`}
              onClick={(e) => handleClick(file, e)}
            >
              <td className="flex items-center gap-3 px-4 py-3">
                {renderIcon(file.type)}
                {getLinkUrl?.(file) ? (
                  <Link href={getLinkUrl(file) ?? "#"} className="font-medium">
                    {file.name}
                  </Link>
                ) : file.type === "folder" && getFolderUrl ? (
                  <Link href={getFolderUrl(file)} className="font-medium">
                    {file.name}
                  </Link>
                ) : (
                  <span className="font-medium">{file.name}</span>
                )}
              </td>
              <td className="text-muted-foreground hidden px-4 py-3 md:table-cell">
                {file.lastModified ?? "—"}
              </td>
              <td className="text-muted-foreground hidden px-4 py-3 md:table-cell">
                {file.size ?? (file.type === "folder" ? "—" : "0 B")}
              </td>
              <td className="text-muted-foreground hidden px-4 py-3 md:table-cell">
                {file.type === "folder"
                  ? "Folder"
                  : file.type.charAt(0).toUpperCase() + file.type.slice(1)}
              </td>
              <td className="px-4 py-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger className="hover:bg-secondary flex h-8 w-8 items-center justify-center rounded-full">
                    <DotsIcon className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {file.type !== "folder" && (
                      <DropdownMenuItem>Download</DropdownMenuItem>
                    )}
                    <DropdownMenuItem>Rename</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
          {files.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="text-muted-foreground px-4 py-8 text-center"
              >
                No files found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
