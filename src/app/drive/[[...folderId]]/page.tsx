import GDrive from "~/app/gdrive";
import { AppLayout } from "~/components/layout/AppLayout";
import { notFound } from "next/navigation";
import { QUERIES } from "~/server/db/queries";

export default async function GDrivePage({
  params,
}: {
  params: { folderId?: string[] };
}) {
  // Determine if we're at root or in a folder
  const isRoot = !params.folderId || params.folderId.length === 0;

  let documents;
  let currentFolder;
  let breadcrumbPath;

  try {
    if (isRoot) {
      // Fetch root level items
      documents = await QUERIES.getRootItems();
      breadcrumbPath = [
        { id: "root", name: "My Drive", type: "folder" as const },
      ];
    } else {
      const folderId = params.folderId?.[0];

      // Safety check - this shouldn't happen given our isRoot check above
      if (!folderId) {
        return notFound();
      }

      // Convert the folderId to BigInt for database query
      let folderBigInt: bigint;
      try {
        folderBigInt = BigInt(folderId);
      } catch (e) {
        console.error("Invalid folder ID:", folderId);
        return notFound();
      }

      // Check if folder exists
      currentFolder = await QUERIES.getFolderById(folderBigInt);
      if (!currentFolder) {
        console.error("Folder not found:", folderId);
        return notFound();
      }

      // Get folder contents and breadcrumb path
      documents = await QUERIES.getFolderContents(folderBigInt);
      breadcrumbPath = await QUERIES.getBreadcrumbPath(folderBigInt);
    }

    return (
      <AppLayout>
        <GDrive
          documents={documents}
          currentFolder={currentFolder}
          allItems={breadcrumbPath}
        />
      </AppLayout>
    );
  } catch (error) {
    console.error("Error loading drive data:", error);
    return (
      <AppLayout>
        <div className="p-8 text-center">
          <h1 className="mb-4 text-2xl font-bold">Something went wrong</h1>
          <p>We couldn&apos;t load your files. Please try again later.</p>
        </div>
      </AppLayout>
    );
  }
}
