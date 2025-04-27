import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { MUTATIONS } from "~/server/db/queries";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  const user = await auth();
  if (!user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Handle both Promise<params> and direct params scenarios
    const resolvedParams = "then" in params ? await params : params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 },
      );
    }

    // Delete the item from the database and S3 if applicable
    // The MUTATIONS.deleteItem function now handles S3 deletion internally
    const deleted = await MUTATIONS.deleteItem(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Failed to delete item" },
        { status: 500 },
      );
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
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  const user = await auth();
  if (!user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Handle both Promise<params> and direct params scenarios
    const resolvedParams = "then" in params ? await params : params;
    const { id } = resolvedParams;

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
