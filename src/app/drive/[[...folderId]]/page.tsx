import GDrive from "~/app/gdrive";
import { AppLayout } from "~/components/layout/AppLayout";
import { notFound } from "next/navigation";
import { QUERIES } from "~/server/db/queries";
import { auth } from "@clerk/nextjs/server";

export default async function GDrivePage(props: {
  params: Promise<{ folderId?: string[] }>;
}) {
  const params = await props.params;
  // Get current user ID for database queries
  const { userId } = await auth();

  // Log user ID for debugging
  console.log("Drive page - User ID:", userId);

  // Redirect if not authenticated
  if (!userId) {
    return notFound();
  }

  // Determine if we're at root or in a folder
  const isRoot = !params.folderId || params.folderId.length === 0;

  let documents;
  let currentFolder;
  let breadcrumbPath;

  try {
    if (isRoot) {
      // Fetch root level items with user ID
      documents = await QUERIES.getRootItems(userId);
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

      // Check if folder exists - pass the user ID
      currentFolder = await QUERIES.getFolderById(folderBigInt, userId);
      if (!currentFolder) {
        console.error("Folder not found:", folderId);
        return notFound();
      }

      // Get folder contents and breadcrumb path - pass the user ID
      documents = await QUERIES.getFolderContents(folderBigInt, userId);
      breadcrumbPath = await QUERIES.getBreadcrumbPath(folderBigInt, userId);
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
          <p className="mt-4 text-sm text-gray-500">
            Error details: {String(error)}
          </p>
        </div>
      </AppLayout>
    );
  }
}
