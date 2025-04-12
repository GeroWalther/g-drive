/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
