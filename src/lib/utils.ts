/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type FileProps, type FileType } from "~/types/file";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Maps database file type to UI file type
 * @param dbType Database type string
 * @returns FileType enum value
 */
export function mapDbTypeToFileType(dbType: string): FileType {
  const typeMap: Record<string, FileType> = {
    folder: "folder",
    doc: "doc",
    sheet: "sheet",
    pdf: "pdf",
    jpg: "image",
    jpeg: "image",
    png: "image",
    gif: "image",
  };

  return typeMap[dbType.toLowerCase()] ?? "other";
}

export function formatBytes(bytes: string | number | undefined): string {
  if (!bytes) return "0 B";

  // If bytes is a string with letters (like "1.5 MB"), return it as is
  if (typeof bytes === "string" && /[a-zA-Z]/.test(bytes)) {
    return bytes;
  }

  const bytesNum = typeof bytes === "string" ? parseInt(bytes, 10) : bytes;
  if (typeof bytesNum === "number" && isNaN(bytesNum)) return "0 B";

  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytesNum === 0) return "0 B";

  const i = Math.floor(Math.log(bytesNum as number) / Math.log(1024));
  if (i === 0) return `${bytesNum} ${sizes[i]}`;

  return `${((bytesNum as number) / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

export function formatDate(date: string | Date | undefined): string {
  if (!date) return "";

  // If it's already a formatted string like "Modified 2 days ago", return it
  if (typeof date === "string" && date.includes(" ")) {
    return date;
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Check if date is valid
  if (isNaN(dateObj.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(dateObj);
}

/**
 * Builds a folder path from an array of files/folders
 * @param allItems - Array of all files/folders
 * @param folderId - ID of the folder to build path for
 * @returns Array of path segments with id and name
 */
export function buildFolderPath(
  allItems: FileProps[],
  folderId: string | null,
): { id: string; name: string }[] {
  if (!folderId) {
    return [{ id: "root", name: "My Drive" }];
  }

  const path: { id: string; name: string }[] = [];
  let currentId = folderId;

  // Prevent infinite loops
  const maxDepth = 20;
  let depth = 0;

  // Build folder structure for quick lookup
  const itemsById = new Map<string, FileProps>();
  allItems.forEach((item) => {
    itemsById.set(item.id, item);
  });

  while (currentId && currentId !== "root" && depth < maxDepth) {
    const item = itemsById.get(currentId);
    if (!item) break;

    path.unshift({ id: item.id, name: item.name });
    currentId = item.parentId ?? "root";
    depth++;
  }

  // Add root as the first item
  path.unshift({ id: "root", name: "My Drive" });

  return path;
}
