import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { MUTATIONS, QUERIES } from "~/server/db/queries";
import fs from "fs";
import path from "path";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const user = await auth();
  if (!user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 },
      );
    }

    // Get the file URL first (to delete the physical file if necessary)
    const item = await QUERIES.getItemById(id);

    // Delete the item from the database
    const deleted = await MUTATIONS.deleteItem(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Failed to delete item" },
        { status: 500 },
      );
    }

    // If it was a file with a URL, delete the physical file
    if (item?.url && item.type !== "folder") {
      try {
        const filePath = path.join(process.cwd(), "public", item.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (fileError) {
        console.error("Error deleting physical file:", fileError);
        // We still return success since the DB entry was deleted
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the item" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const user = await auth();
  if (!user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 },
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { name } = data;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const renamed = await MUTATIONS.renameItem(id, name.trim());

    if (!renamed) {
      return NextResponse.json(
        { error: "Failed to rename item" },
        { status: 500 },
      );
    }

    return NextResponse.json(renamed);
  } catch (error) {
    console.error("Error renaming item:", error);
    return NextResponse.json(
      { error: "An error occurred while renaming the item" },
      { status: 500 },
    );
  }
}
