import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { QUERIES } from "~/server/db/queries";

// POST /api/share - Generate a share link for a file
export async function POST(req: Request) {
  try {
    // Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Get file ID from request body
    const body = (await req.json()) as { fileId?: string };
    const { fileId } = body;

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 },
      );
    }

    // Create share link in the database
    const shareId = await QUERIES.createShareLink(fileId, userId);
    if (!shareId) {
      return NextResponse.json(
        { error: "Failed to create share link" },
        { status: 500 },
      );
    }

    // Generate share URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const shareUrl = `${baseUrl}/shared/${shareId}`;

    return NextResponse.json({
      success: true,
      shareId,
      shareUrl,
    });
  } catch (error) {
    console.error("Share API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
