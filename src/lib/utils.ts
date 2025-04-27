/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type FileProps, type FileType } from "~/types/file";
import type { fileItems } from "~/server/db/schema";
import type { InferSelectModel } from "drizzle-orm";

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

/**
 * Transforms database file items to FileProps format for UI components
 * @param dbItems Array of database file items
 * @returns Array of FileProps objects
 */
export function dbItemsToFileProps(
  dbItems: InferSelectModel<typeof fileItems>[],
): FileProps[] {
  return dbItems.map((item) => ({
    id: String(item.id),
    name: item.name,
    type: mapDbTypeToFileType(item.type),
    size: item.size ? `${item.size} KB` : undefined,
    parentId: item.parent_id ? String(item.parent_id) : undefined,
    itemCount: item.item_count ?? undefined,
    url: item.url ?? undefined,
  }));
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

  // For the current folder view, we need to fetch ancestors
  // First, get the current folder by ID
  const currentFolder = allItems.find((item) => item.id === folderId);
  if (!currentFolder) {
    return [{ id: "root", name: "My Drive" }];
  }

  const path: { id: string; name: string }[] = [];
  path.push({ id: currentFolder.id, name: currentFolder.name });

  // Add parent folders by following parentId references
  let parentId = currentFolder.parentId;

  // Prevent infinite loops
  const maxDepth = 20;
  let depth = 0;

  // Build folder structure for quick lookup
  const itemsById = new Map<string, FileProps>();
  allItems.forEach((item) => {
    itemsById.set(item.id, item);
  });

  // Walk up the tree until we reach root or max depth
  while (parentId && depth < maxDepth) {
    const parent = itemsById.get(parentId);
    if (!parent) break;

    // Add this parent to the beginning of the path
    path.unshift({ id: parent.id, name: parent.name });

    // Move up to the next parent
    parentId = parent.parentId;
    depth++;
  }

  // Add root as the first item
  path.unshift({ id: "root", name: "My Drive" });

  return path;
}

/**
 * Extracts the folder ID from a URL path for the G-Drive application
 * @param path The URL path from which to extract the folder ID
 * @returns The folder ID or null if not found
 */
export function extractFolderIdFromPath(path: string): string | null {
  // Use a regex to extract the folder ID from drive URLs
  // This handles both /drive/{id} and /drive/{id}/{name} patterns
  const driveIdPattern = /^\/drive\/(\d+)(?:\/.*)?$/;
  const match = driveIdPattern.exec(path);

  if (match?.[1]) {
    return match[1];
  }

  return null;
}
