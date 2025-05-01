import { NextRequest, NextResponse } from "next/server";
import { generatePresignedUrl } from "../utils/urlGenerator";
import type { PresignedUrlRequest, PresignedUrlResponse } from "../types";

/**
 * API route handler for generating presigned URLs
 *
 * @param req Next.js request object
 * @returns Next.js response with presigned URL data
 */
export async function presignedUrlRoute(req: NextRequest) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 },
      );
    }

    // Parse request body
    const body = (await req.json()) as PresignedUrlRequest;

    // Validate required fields
    if (!body.name || !body.type || !body.size) {
      return NextResponse.json(
        { error: "Missing required fields: name, type, size" },
        { status: 400 },
      );
    }

    // Generate presigned URL
    const result = await generatePresignedUrl(
      {},
      body.name,
      body.type,
      body.folder,
    );

    // Return presigned URL data
    const response: PresignedUrlResponse = {
      uploadUrl: result.uploadUrl,
      fileKey: result.fileKey,
      expiresIn: result.expiresIn,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("Error generating presigned URL:", error);

    // Handle different error types
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 },
    );
  }
}
