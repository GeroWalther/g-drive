import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { generateDownloadUrl } from "../../../../lib/s3";
import { db } from "../../../../server/db";
import { fileItems } from "../../../../server/db/schema";
import { eq } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

// Define a proper type for the file based on the schema
type FileItem = InferSelectModel<typeof fileItems>;

// This interface defines how our database query response should be typed
interface FileRecord {
  id: bigint;
  name: string;
  type: string;
  size: number | null;
  url: string | null;
  parent_id: bigint | null;
  item_count: number | null;
  user_id: string;
  share_id: string | null;
  is_public: number;
  metadata: string | null;
  created_at: Date;
  modified_at: Date;
}

/**
 * Refreshes a presigned download URL for a file
 * This endpoint allows client-side URL refreshing when a URL expires
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = (await request.json()) as { fileId: string };
    const { fileId } = body;

    if (!fileId) {
      return NextResponse.json(
        { error: "fileId is required" },
        { status: 400 },
      );
    }

    try {
      // Get the file from the database
      // We need to use a more explicit type assertion since TypeScript doesn't know the structure
      // of our database query result
      const dbQuery = db.query;
      // This assertion is safe because we know the structure of our database
      const queryWithMethods = dbQuery as {
        fileItems: {
          findFirst: (options: {
            where: unknown;
          }) => Promise<FileRecord | undefined>;
        };
      };

      const file = await queryWithMethods.fileItems.findFirst({
        where: eq(fileItems.id, BigInt(fileId)),
      });

      // Validate file exists and belongs to the user
      if (!file) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }

      if (file.user_id !== userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      // Extract S3 key from metadata
      let s3Key: string | null = null;
      try {
        if (file.metadata) {
          const metadata = JSON.parse(String(file.metadata)) as Record<
            string,
            unknown
          >;
          s3Key = metadata.s3Key as string;
        }
      } catch (error) {
        console.error("Error parsing file metadata:", error);
      }

      if (!s3Key) {
        return NextResponse.json(
          { error: "File has no associated S3 key" },
          { status: 400 },
        );
      }

      // Generate a fresh URL
      const freshUrl = await generateDownloadUrl(s3Key);

      // Update the file record with the new URL
      await db
        .update(fileItems)
        .set({ url: freshUrl })
        .where(eq(fileItems.id, file.id));

      return NextResponse.json({
        success: true,
        url: freshUrl,
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Database error occurred" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error(
      "Error refreshing URL:",
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json(
      { error: "Failed to refresh URL" },
      { status: 500 },
    );
  }
}
