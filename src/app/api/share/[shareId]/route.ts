import { NextResponse } from "next/server";
import { QUERIES } from "~/server/db/queries";
import type { FileProps } from "~/types/file";

// GET /api/share/[shareId] - Get shared item details
export async function GET(
  request: Request,
  { params }: { params: { shareId: string } },
) {
  try {
    const { shareId } = params;

    if (!shareId) {
      return NextResponse.json(
        { error: "Share ID is required" },
        { status: 400 },
      );
    }

    // Get item by share ID
    const item = await QUERIES.getItemByShareId(shareId);

    if (!item) {
      return NextResponse.json(
        { error: "Shared item not found" },
        { status: 404 },
      );
    }

    // If it's a folder, get its contents
    let contents: FileProps[] = [];
    if (item.type === "folder") {
      contents = await QUERIES.getSharedFolderContents(BigInt(item.id));
    }

    return NextResponse.json({
      success: true,
      item,
      contents,
    });
  } catch (error) {
    console.error("Error retrieving shared item:", error);
    return NextResponse.json(
      { error: "An error occurred while retrieving the shared item" },
      { status: 500 },
    );
  }
}
