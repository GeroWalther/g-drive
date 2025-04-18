import { db } from "~/server/db";
import GDrive from "~/app/gdrive";
import { AppLayout } from "~/components/layout/AppLayout";
import { fileItems } from "~/server/db/schema";
import { dbItemsToFileProps } from "~/lib/utils";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function GDriveFolder({
  params,
}: {
  params: { folderId: string };
}) {
  const folderId = params.folderId;

  // Convert the folderId to BigInt for database query
  let folderBigInt: bigint;
  try {
    folderBigInt = BigInt(folderId);
  } catch (e) {
    console.error("Invalid folder ID:", folderId);
    return notFound();
  }

  // First, check if the folder exists and it's actually a folder
  const folderCheck = await db
    .select()
    .from(fileItems)
    .where(eq(fileItems.id, folderBigInt))
    .limit(1);

  if (folderCheck.length === 0 || folderCheck[0]?.type !== "folder") {
    console.error("Folder not found or not a folder type:", folderId);
    return notFound();
  }

  // Get the folder item
  const folderItem = folderCheck[0];

  // Fetch the folder contents - only items with this folder as parent
  const folderContents = await db
    .select()
    .from(fileItems)
    .where(eq(fileItems.parent_id, folderBigInt));

  // Fetch all items needed for breadcrumb navigation
  // This includes all folders that might be in the path
  const allFolders = await db
    .select()
    .from(fileItems)
    .where(eq(fileItems.type, "folder"));

  // Combine everything we need for the UI
  const allItems = [...folderContents, folderItem, ...allFolders];

  // Transform database items to FileProps format
  const documents = dbItemsToFileProps(folderContents);
  const currentFolder = dbItemsToFileProps([folderItem])[0];
  const allItemsProps = dbItemsToFileProps(allItems);

  return (
    <AppLayout>
      <GDrive
        documents={documents}
        currentFolder={currentFolder}
        allItems={allItemsProps}
      />
    </AppLayout>
  );
}
