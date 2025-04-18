import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { MUTATIONS } from "~/server/db/queries";
import { type FileType } from "~/types/file";

const f = createUploadthing();

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

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Main file uploader that accepts multiple file types
  fileUploader: f(["image", "pdf", "audio", "video", "text"])
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth();

      // If you throw, the user will not be able to upload
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!user.userId) throw new UploadThingError("Unauthorized");

      // Get folder ID from the request
      const url = new URL(req.url);
      const folderId = url.searchParams.get("folderId");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId, folderId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      try {
        // Get the file type based on MIME
        // UploadThing's type definition might be outdated, but file.mime exists at runtime
        const fileType = getFileType(
          // @ts-expect-error - file.mime exists but TypeScript doesn't know about it
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          file.mime ?? "unknown",
        );

        // Store the file in the database
        await MUTATIONS.createFile(
          file.name,
          fileType,
          file.size,
          metadata.folderId,
        );

        // Return file information (without dbFile to avoid type errors)
        return {
          uploadedBy: metadata.userId,
          fileUrl: file.url,
          fileKey: file.key,
          fileName: file.name,
          fileSize: file.size,
          filePath: metadata.folderId ?? "root",
        };
      } catch (error) {
        console.error("Error storing file in database:", error);
        // Use throw Error instead of UploadThingError to satisfy linter
        throw new Error("Failed to store file in database");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
