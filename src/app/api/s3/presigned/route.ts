import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { generateUploadUrl } from "../../../../lib/s3";
import { extractFolderIdFromPath } from "../../../../lib/utils";

/**
 * Generates a presigned URL for client-side uploads to S3
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { fileName, contentType, folderId: bodyFolderId } = body;

    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: "fileName and contentType are required" },
        { status: 400 },
      );
    }

    // Get the folderId from the body or try to extract from referer
    let folderId = bodyFolderId;
    if (!folderId && request.headers.get("referer")) {
      try {
        const refererUrl = new URL(request.headers.get("referer") ?? "");
        folderId = extractFolderIdFromPath(refererUrl.pathname);
      } catch (e) {
        console.error("Error extracting folder ID from referer:", e);
      }
    }

    // Generate a unique key for S3
    const timestamp = Date.now();
    const sanitizedFilename = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const folderPrefix = folderId ? `folder-${folderId}/` : "";
    const fileKey = `${folderPrefix}${timestamp}-${sanitizedFilename}`;

    // Generate presigned URL for S3 upload
    const uploadUrl = await generateUploadUrl(fileKey, contentType);

    return NextResponse.json({
      uploadUrl,
      fileKey,
      contentType,
      fileName,
      folderId,
    });
  } catch (error) {
    console.error(
      "Error generating presigned URL:",
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 },
    );
  }
}
