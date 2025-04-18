import { db } from "~/server/db";
import GDrive from "./gdrive";
import { AppLayout } from "~/components/layout/AppLayout";
import { fileItems } from "~/server/db/schema";
import { dbItemsToFileProps } from "~/lib/utils";
import { isNull, eq } from "drizzle-orm";

export default async function GDriveRoot() {
  // Fetch root level items (those with null parent_id)
  const rootItems = await db
    .select()
    .from(fileItems)
    .where(isNull(fileItems.parent_id));

  // Also fetch all folders for breadcrumb navigation
  const allFolders = await db
    .select()
    .from(fileItems)
    .where(eq(fileItems.type, "folder"));

  // Transform database items to FileProps format
  const documents = dbItemsToFileProps(rootItems);
  const allItems = dbItemsToFileProps([...rootItems, ...allFolders]);

  return (
    <AppLayout>
      <GDrive documents={documents} allItems={allItems} />
    </AppLayout>
  );
}
