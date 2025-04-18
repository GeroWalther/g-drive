import { db } from "~/server/db";
import GDrive from "./gdrive";
import { AppLayout } from "~/components/layout/AppLayout";
import { fileItems } from "~/server/db/schema";
import { type FileProps } from "~/types/file";
import { mapDbTypeToFileType } from "~/lib/utils";

export default async function HomePage() {
  // Fetch data from the database
  const dbItems = await db.select().from(fileItems);

  // Transform database items to FileProps format
  const documents: FileProps[] = dbItems.map((item) => ({
    id: String(item.id),
    name: item.name,
    type: mapDbTypeToFileType(item.type),
    size: item.size ? `${item.size} KB` : undefined,
    parentId: item.parent_id ? String(item.parent_id) : undefined,
    itemCount: item.item_count ?? undefined,
  }));

  return (
    <AppLayout>
      <GDrive documents={documents} />
    </AppLayout>
  );
}
