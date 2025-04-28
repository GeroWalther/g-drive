/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { generateUploadUrl } from "../../../../lib/s3";
import { extractFolderIdFromPath } from "../../../../lib/utils";

interface UploadRequestBody {
  fileName: string;
  contentType: string;
  folderId?: string | null;
}

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
    const body = (await request.json()) as UploadRequestBody;
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
      "\nStack trace:",
      error instanceof Error ? error.stack : "No stack trace available",
    );

    // Log environment info (without sensitive details)
    console.error("Environment context:", {
      region: process.env.AWS_S3_REGION,
      hasBucketName: !!process.env.AWS_S3_BUCKET_NAME,
      hasAccessKey: !!process.env.AWS_USER_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_USER_SECRET_ACCESS_KEY,
      nodeEnv: process.env.NODE_ENV,
    });

    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 },
    );
  }
}
