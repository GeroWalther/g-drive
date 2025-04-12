import { type FileProps } from "~/types/file";

export const recentFiles: FileProps[] = [
  {
    id: "1",
    name: "Project Proposal",
    type: "doc",
    size: "2.3 MB",
    lastModified: "Modified 2 days ago",
  },
  {
    id: "2",
    name: "Financial Report 2023",
    type: "sheet",
    size: "4.1 MB",
    lastModified: "Modified 5 days ago",
  },
  {
    id: "3",
    name: "Product Screenshots",
    type: "folder",
    lastModified: "Modified 1 week ago",
  },
  {
    id: "4",
    name: "Meeting Notes",
    type: "doc",
    size: "1.2 MB",
    lastModified: "Modified 2 weeks ago",
  },
  {
    id: "5",
    name: "Brand Guidelines.pdf",
    type: "pdf",
    size: "8.1 MB",
    lastModified: "Modified 3 weeks ago",
  },
];

export const folders: FileProps[] = [
  {
    id: "folder1",
    name: "Documents",
    type: "folder",
    lastModified: "Modified 3 days ago",
    itemCount: 12,
  },
  {
    id: "folder2",
    name: "Images",
    type: "folder",
    lastModified: "Modified 1 week ago",
    itemCount: 24,
  },
  {
    id: "folder3",
    name: "Projects",
    type: "folder",
    lastModified: "Modified 2 weeks ago",
    itemCount: 8,
  },
];

export const recentlyOpenedFiles: FileProps[] = [
  {
    id: "r1",
    name: "Project Proposal v2",
    type: "doc",
    size: "2.5 MB",
    lastModified: "Opened 1 hour ago",
  },
  {
    id: "r2",
    name: "Client Presentation",
    type: "pdf",
    size: "6.8 MB",
    lastModified: "Opened yesterday",
  },
  {
    id: "r3",
    name: "Financial Analysis",
    type: "sheet",
    size: "4.3 MB",
    lastModified: "Opened 2 days ago",
  },
  {
    id: "r4",
    name: "Marketing Campaign",
    type: "folder",
    lastModified: "Opened 3 days ago",
    itemCount: 5,
  },
  {
    id: "r5",
    name: "Product Roadmap",
    type: "doc",
    size: "1.9 MB",
    lastModified: "Opened 5 days ago",
  },
  {
    id: "r6",
    name: "Team Photos",
    type: "image",
    size: "8.2 MB",
    lastModified: "Opened 1 week ago",
  },
];

export const sharedFiles: FileProps[] = [
  {
    id: "s1",
    name: "Team Project",
    type: "folder",
    lastModified: "Shared by John Doe • 2 days ago",
    itemCount: 15,
  },
  {
    id: "s2",
    name: "Meeting Minutes.doc",
    type: "doc",
    size: "1.8 MB",
    lastModified: "Shared by Jane Smith • 1 week ago",
  },
  {
    id: "s3",
    name: "Budget 2023.xlsx",
    type: "sheet",
    size: "3.2 MB",
    lastModified: "Shared by Finance Team • 2 weeks ago",
  },
];

export const starredFiles: FileProps[] = [
  {
    id: "star1",
    name: "Important Documents",
    type: "folder",
    lastModified: "Modified 1 day ago",
    itemCount: 7,
  },
  {
    id: "star2",
    name: "Contract_Final.pdf",
    type: "pdf",
    size: "5.2 MB",
    lastModified: "Modified 3 days ago",
  },
  {
    id: "star3",
    name: "Project Timeline",
    type: "sheet",
    size: "3.7 MB",
    lastModified: "Modified 1 week ago",
  },
];
