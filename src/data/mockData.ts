import { type FileProps } from "~/types/file";

// Folder structure map - Each key is a folder ID and the value is its contents
export const folderContents: Record<string, FileProps[]> = {
  root: [
    {
      id: "folder1",
      name: "Documents",
      type: "folder",
      lastModified: "Modified 3 days ago",
      itemCount: 12,
      parentId: "root",
    },
    {
      id: "folder2",
      name: "Images",
      type: "folder",
      lastModified: "Modified 1 week ago",
      itemCount: 24,
      parentId: "root",
    },
    {
      id: "folder3",
      name: "Projects",
      type: "folder",
      lastModified: "Modified 2 weeks ago",
      itemCount: 8,
      parentId: "root",
    },
  ],

  // Documents folder content
  folder1: [
    {
      id: "doc1",
      name: "Business Plan.docx",
      type: "doc",
      size: "3.2 MB",
      lastModified: "Modified 1 day ago",
      parentId: "folder1",
    },
    {
      id: "doc2",
      name: "Resume Template.docx",
      type: "doc",
      size: "1.8 MB",
      lastModified: "Modified 3 days ago",
      parentId: "folder1",
    },
    {
      id: "pdf1",
      name: "Tax Statement 2023.pdf",
      type: "pdf",
      size: "5.4 MB",
      lastModified: "Modified 5 days ago",
      parentId: "folder1",
    },
    {
      id: "folder1_1",
      name: "Reports",
      type: "folder",
      lastModified: "Modified 2 days ago",
      itemCount: 5,
      parentId: "folder1",
    },
    {
      id: "folder1_2",
      name: "Contracts",
      type: "folder",
      lastModified: "Modified 1 week ago",
      itemCount: 4,
      parentId: "folder1",
    },
  ],

  // Reports folder (inside Documents)
  folder1_1: [
    {
      id: "doc3",
      name: "Annual Report 2023.docx",
      type: "doc",
      size: "4.5 MB",
      lastModified: "Modified 2 days ago",
      parentId: "folder1_1",
    },
    {
      id: "sheet1",
      name: "Q4 Sales Analysis.xlsx",
      type: "sheet",
      size: "3.7 MB",
      lastModified: "Modified 3 days ago",
      parentId: "folder1_1",
    },
    {
      id: "pdf2",
      name: "Marketing Performance.pdf",
      type: "pdf",
      size: "6.2 MB",
      lastModified: "Modified 5 days ago",
      parentId: "folder1_1",
    },
  ],

  // Contracts folder (inside Documents)
  folder1_2: [
    {
      id: "doc4",
      name: "Client Agreement.docx",
      type: "doc",
      size: "2.1 MB",
      lastModified: "Modified 3 days ago",
      parentId: "folder1_2",
    },
    {
      id: "pdf3",
      name: "NDA Template.pdf",
      type: "pdf",
      size: "1.5 MB",
      lastModified: "Modified 1 week ago",
      parentId: "folder1_2",
    },
  ],

  // Images folder content
  folder2: [
    {
      id: "img1",
      name: "Product Photos",
      type: "folder",
      lastModified: "Modified 5 days ago",
      itemCount: 12,
      parentId: "folder2",
    },
    {
      id: "img2",
      name: "Team Photos",
      type: "folder",
      lastModified: "Modified 2 weeks ago",
      itemCount: 8,
      parentId: "folder2",
    },
    {
      id: "img3",
      name: "Logo Designs.png",
      type: "image",
      size: "4.2 MB",
      lastModified: "Modified 3 days ago",
      parentId: "folder2",
    },
  ],

  // Projects folder content
  folder3: [
    {
      id: "proj1",
      name: "Website Redesign",
      type: "folder",
      lastModified: "Modified 1 week ago",
      itemCount: 15,
      parentId: "folder3",
    },
    {
      id: "proj2",
      name: "Mobile App",
      type: "folder",
      lastModified: "Modified 2 weeks ago",
      itemCount: 9,
      parentId: "folder3",
    },
    {
      id: "doc5",
      name: "Project Timeline.docx",
      type: "doc",
      size: "1.8 MB",
      lastModified: "Modified 4 days ago",
      parentId: "folder3",
    },
  ],
};

// Helper functions to get folder path information
export function getFolderPath(
  folderId: string,
): { id: string; name: string }[] {
  const path: { id: string; name: string }[] = [];
  let currentId = folderId;

  while (currentId && currentId !== "root") {
    // Find the folder in all folder contents
    let folder: FileProps | undefined;

    for (const contents of Object.values(folderContents)) {
      folder = contents.find((item) => item.id === currentId);
      if (folder) break;
    }

    if (!folder) break;

    // Add to path
    path.unshift({ id: folder.id, name: folder.name });
    currentId = folder.parentId || "";
  }

  // Add root
  path.unshift({ id: "root", name: "My Drive" });

  return path;
}

// Legacy exports for backward compatibility
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

export const folders = folderContents.root;

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
