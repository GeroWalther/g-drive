export type FileType = "folder" | "doc" | "sheet" | "image" | "pdf" | "other";

export interface FileProps {
  id: string;
  name: string;
  type: FileType;
  size?: string;
  lastModified?: string;
  itemCount?: number;
}
