import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { MUTATIONS } from "~/server/db/queries";
import { type FileType } from "~/types/file";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";
import { db } from "~/server/db";
import { fileItems } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { extractFolderIdFromPath } from "~/lib/utils";

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

// In a real app, you'd use a proper storage service like AWS S3 or similar
// For this demo, we'll store files in the public directory
const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

export async function POST(request: Request) {
  try {
    // Authenticate the user
    const user = await auth();
    if (!user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the folderId from the query parameters
    const url = new URL(request.url);
    const queryfolderId = url.searchParams.get("folderId");

    console.log("Upload request received for folder:", {
      url: request.url,
      queryfolderId,
      headers: Object.fromEntries(request.headers.entries()),
      referer: request.headers.get("referer"),
    });

    // Try to extract folder ID from referer if not provided in query params
    let folderId: string | null = queryfolderId;

    if (!folderId && request.headers.get("referer")) {
      try {
        const refererUrl = new URL(request.headers.get("referer") ?? "");
        folderId = extractFolderIdFromPath(refererUrl.pathname);
      } catch (e) {
        console.error("Error extracting folder ID from referer:", e);
      }
    }

    console.log("Final folder ID for upload:", folderId);

    // Get form data with files
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Ensure upload directory exists
    try {
      await mkdir(UPLOAD_DIR, { recursive: true });
    } catch (err) {
      console.log("Upload directory already exists or couldn't be created");
    }

    // Process and save each file
    const savedFiles = [];
    for (const file of files) {
      // Generate a unique filename to avoid collisions
      const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filePath = join(UPLOAD_DIR, uniqueFilename);
      const fileUrl = `/uploads/${uniqueFilename}`;

      // Get file type
      const fileType = getFileType(file.type);

      try {
        // Save the file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filePath, buffer);

        // Store file metadata in database with URL
        const dbFile = await MUTATIONS.createFile(
          file.name,
          fileType,
          file.size,
          folderId,
          user.userId,
        );

        // Update the file with the URL (since createFile doesn't accept url)
        if (dbFile) {
          await db
            .update(fileItems)
            .set({ url: fileUrl })
            .where(eq(fileItems.id, BigInt(dbFile.id)));

          savedFiles.push({
            name: file.name,
            type: fileType,
            size: file.size,
            id: dbFile.id,
            url: fileUrl,
          });

          console.log("File saved with URL:", {
            id: dbFile.id,
            name: file.name,
            url: fileUrl,
            folderId: folderId,
          });
        }
      } catch (fileError) {
        console.error(`Error saving file ${file.name}:`, fileError);
      }
    }

    // Return information about the saved files
    return NextResponse.json({
      success: true,
      files: savedFiles,
    });
  } catch (error) {
    console.error("Error processing file upload:", error);
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 },
    );
  }
}
