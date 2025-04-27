import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { MUTATIONS } from "../../../../server/db/queries";
import { generateDownloadUrl } from "../../../../lib/s3";
import { db } from "../../../../server/db";
import { fileItems } from "../../../../server/db/schema";
import { eq } from "drizzle-orm";
import { type FileType } from "../../../../types/file";

// Helper to convert MIME type to our FileType
const getFileType = (mime = ""): FileType => {
  if (mime.startsWith("image/")) return "image";
  if (mime.includes("pdf")) return "pdf";
  if (
    mime.includes("spreadsheet") ||
    mime.includes("excel") ||
    mime.includes("csv")
  )
    return "sheet";
  if (mime.includes("document") || mime.includes("word")) return "doc";
  return "other"; // Default type
};

/**
 * Completes the upload process by recording the file in the database
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = (await request.json()) as {
      fileKey: string;
      fileName: string;
      contentType: string;
      size: number;
      folderId?: string | null;
    };

    const { fileKey, fileName, contentType, size, folderId } = body;

    if (!fileKey || !fileName || !contentType || !size) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get file type for our database
    const fileType = getFileType(contentType);

    // Generate URL for accessing the file
    const fileUrl = await generateDownloadUrl(fileKey);

    // Create the file record in the database
    const dbFile = await MUTATIONS.createFile(
      fileName,
      fileType,
      size,
      folderId ?? null,
      userId,
    );

    // Update the file with the S3 URL
    if (dbFile) {
      await db
        .update(fileItems)
        .set({
          url: fileUrl,
          metadata: JSON.stringify({ s3Key: fileKey }),
        })
        .where(eq(fileItems.id, BigInt(dbFile.id)));

      return NextResponse.json({
        success: true,
        file: {
          id: dbFile.id,
          name: fileName,
          type: fileType,
          size: size,
          url: fileUrl,
        },
      });
    } else {
      return NextResponse.json(
        { error: "Failed to create file record" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error(
      "Error completing upload:",
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json(
      { error: "Failed to complete upload" },
      { status: 500 },
    );
  }
}
