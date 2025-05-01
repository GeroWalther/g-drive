import { NextRequest, NextResponse } from "next/server";
import { generateFileUrl } from "../utils/urlGenerator";
import type { FileUrlResponse } from "../types";

/**
 * API route handler for generating access URLs for files
 *
 * @param req Next.js request object
 * @param params Object containing route params, including fileKey
 * @returns Next.js response with file URL data
 */
export async function getFileUrlRoute(
  req: NextRequest,
  { params }: { params: { fileKey: string } },
) {
  try {
    if (req.method !== "GET") {
      return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 },
      );
    }

    // Get file key from URL params
    const { fileKey } = params;

    if (!fileKey) {
      return NextResponse.json(
        { error: "Missing required parameter: fileKey" },
        { status: 400 },
      );
    }

    // Generate file access URL
    const result = await generateFileUrl({}, fileKey);

    // Return URL data
    const response: FileUrlResponse = {
      url: result.url,
      expiresIn: result.expiresIn,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("Error generating file URL:", error);

    // Handle different error types
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Failed to generate file URL" },
      { status: 500 },
    );
  }
}
