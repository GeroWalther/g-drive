import { db } from "~/server/db";
import GDrive from "~/app/gdrive";
import { AppLayout } from "~/components/layout/AppLayout";
import { fileItems } from "~/server/db/schema";
import { dbItemsToFileProps } from "~/lib/utils";
import { eq, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function GDrivePage({
  params,
}: {
  params: { folderId?: string[] };
}) {
  // Determine if we're at root or in a folder
  const isRoot = !params.folderId || params.folderId.length === 0;
  const folderId = isRoot ? null : params.folderId![0];

  let folderContents;
  let currentFolder = undefined;

  if (isRoot) {
    // Fetch root level items (those with null parent_id)
    folderContents = await db
      .select()
      .from(fileItems)
      .where(isNull(fileItems.parent_id));
  } else {
    // Convert the folderId to BigInt for database query
    let folderBigInt: bigint;
    try {
      folderBigInt = BigInt(folderId!);
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
    folderContents = await db
      .select()
      .from(fileItems)
      .where(eq(fileItems.parent_id, folderBigInt));

    // Set current folder
    currentFolder = folderItem;
  }

  // Fetch all folders for breadcrumb navigation
  const allFolders = await db
    .select()
    .from(fileItems)
    .where(eq(fileItems.type, "folder"));

  // Transform database items to FileProps format
  const documents = dbItemsToFileProps(folderContents);
  const allItems = dbItemsToFileProps([
    ...folderContents,
    ...allFolders,
    ...(currentFolder ? [currentFolder] : []),
  ]);
  const currentFolderProps = currentFolder
    ? dbItemsToFileProps([currentFolder])[0]
    : undefined;

  return (
    <AppLayout>
      <GDrive
        documents={documents}
        currentFolder={currentFolderProps}
        allItems={allItems}
      />
    </AppLayout>
  );
}
