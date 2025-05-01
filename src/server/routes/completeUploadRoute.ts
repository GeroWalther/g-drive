import { NextRequest, NextResponse } from "next/server";
import { generateFileUrl } from "../utils/urlGenerator";
import type { CompleteUploadRequest, CompleteUploadResponse } from "../types";

/**
 * API route handler for completing uploads
 *
 * @param req Next.js request object
 * @returns Next.js response with uploaded file metadata
 */
export async function completeUploadRoute(req: NextRequest) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 },
      );
    }

    // Parse request body
    const body = (await req.json()) as CompleteUploadRequest;

    // Validate required fields
    if (!body.fileKey || !body.name || !body.type) {
      return NextResponse.json(
        { error: "Missing required fields: fileKey, name, type" },
        { status: 400 },
      );
    }

    // Generate file access URL
    const urlResult = await generateFileUrl({}, body.fileKey);

    // Return file metadata including URL
    const response: CompleteUploadResponse = {
      success: true,
      url: urlResult.url,
      key: body.fileKey,
      name: body.name,
      type: body.type,
      size: body.size,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("Error completing upload:", error);

    // Handle different error types
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Failed to complete upload" },
      { status: 500 },
    );
  }
}
