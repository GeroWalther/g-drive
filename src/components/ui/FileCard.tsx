import { Card, CardContent, CardFooter } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  DocumentIcon,
  DotsIcon,
  FolderIcon,
  GenericFileIcon,
  PDFIcon,
  SpreadsheetIcon,
} from "./Icons";
import { type FileType } from "~/types/file";
import { useFileActions, directShare } from "./FileActions";
import { useState } from "react";
import { toast } from "sonner";
import { ShareLinkDialog } from "~/components/ShareLinkDialog";
import { refreshFileUrl } from "~/lib/url-refresh";

interface FileCardProps {
  id?: string;
  name: string;
  type: FileType;
  size?: string;
  lastModified?: string;
  itemCount?: number;
  onClick?: () => void;
  url?: string;
  fileActions?: ReturnType<typeof useFileActions>;
  readOnly?: boolean;
}

export function FileCard({
  id,
  name,
  type,
  size,
  lastModified,
  itemCount,
  onClick,
  url,
  fileActions,
  readOnly,
}: FileCardProps) {
  // Always create a default fileActions hook to satisfy React's rules
  const defaultFileActions = useFileActions();

  // Use provided fileActions or the default one
  const { openRenameDialog, openDeleteDialog, handleDownload } =
    fileActions ?? defaultFileActions;

  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Create a file object to pass to actions
  const file = {
    id: id ?? "", // Use the id passed from parent
    name,
    type,
    size,
    lastModified,
    itemCount,
    url,
  };

  // Function to stop event propagation for menu clicks
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Handle share button click
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!file.id) {
      console.error("Cannot share file without ID");
      return;
    }

    // Create a share URL using the current origin
    const origin = window.location.origin;
    const generatedShareUrl = `${origin}/shared/${file.id}`;
    setShareUrl(generatedShareUrl);
    setShowShareDialog(true);
  };

  // Handle file click with URL refreshing if needed
  const handleFileClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (type === "folder" || !url || !id) {
      // For folders, use the default onClick behavior
      onClick?.();
      return;
    }

    try {
      // Check if the URL contains a signature date parameter (common in S3 presigned URLs)
      // Example: X-Amz-Date=20230427T123456Z or similar in the URL
      const urlObj = new URL(url);
      const amzDateParam = urlObj.searchParams.get("X-Amz-Date");
      const signatureParam = urlObj.searchParams.get("X-Amz-Signature");
      const expiresParam = urlObj.searchParams.get("X-Amz-Expires");

      // If this looks like a presigned URL and has date information
      if (signatureParam && (amzDateParam || expiresParam)) {
        let shouldRefresh = false;

        // Check if we have a date to parse
        if (amzDateParam) {
          // Parse date from format like "20230427T123456Z"
          try {
            const dateStr = amzDateParam;
            // Add separation characters for proper date parsing: "2023-04-27T12:34:56Z"
            const formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}T${dateStr.slice(9, 11)}:${dateStr.slice(11, 13)}:${dateStr.slice(13, 15)}Z`;

            const signatureDate = new Date(formattedDate);
            const now = new Date();

            // If URL is over 25 days old, proactively refresh it
            // This prevents users from encountering expired URLs
            const daysSinceGeneration =
              (now.getTime() - signatureDate.getTime()) / (1000 * 60 * 60 * 24);

            if (daysSinceGeneration > 25) {
              console.log(
                `URL is ${Math.floor(daysSinceGeneration)} days old, refreshing proactively`,
              );
              shouldRefresh = true;
            }
          } catch (error) {
            console.error("Error parsing date from URL:", error);
          }
        }

        // Refresh the URL if needed before opening
        if (shouldRefresh) {
          const refreshedUrl = await refreshFileUrl(id);
          if (refreshedUrl) {
            window.open(refreshedUrl, "_blank", "noopener,noreferrer");
            return;
          }
        }
      }

      // Open the file with the existing URL if no refresh was needed
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error processing file URL:", error);

      // If any error occurs, try to refresh the URL as a fallback
      try {
        const refreshedUrl = await refreshFileUrl(id);
        if (refreshedUrl) {
          window.open(refreshedUrl, "_blank", "noopener,noreferrer");
        } else {
          // If refresh fails, try with original URL as last resort
          window.open(url, "_blank", "noopener,noreferrer");
        }
      } catch (refreshError) {
        console.error("Failed to refresh URL:", refreshError);
        // Open with original URL as last resort
        window.open(url, "_blank", "noopener,noreferrer");
      }
    }
  };

  return (
    <>
      <Card
        className="group cursor-pointer overflow-hidden transition-all hover:shadow-md"
        onClick={type !== "folder" ? handleFileClick : onClick}
      >
        <CardContent className="p-0">
          <div className="relative">
            <div
              className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={handleMenuClick}
            >
              {/* Direct buttons instead of dropdown */}
              {!readOnly && (
                <>
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50"
                    onClick={(e) => {
                      // Stop propagation to prevent Link from capturing click
                      e.preventDefault();
                      e.stopPropagation();
                      if (file.id) handleDownload(file);
                    }}
                    title="Download"
                  >
                    <span className="text-xs">D</span>
                  </button>
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50"
                    onClick={(e) => {
                      // Stop propagation to prevent Link from capturing click
                      e.preventDefault();
                      e.stopPropagation();
                      if (file.id) openRenameDialog(file);
                    }}
                    title="Rename"
                  >
                    <span className="text-xs">R</span>
                  </button>
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50"
                    onClick={(e) => {
                      // Stop propagation to prevent Link from capturing click
                      e.preventDefault();
                      e.stopPropagation();
                      // Use direct share approach instead
                      directShare(file);
                    }}
                    title="Share"
                  >
                    <span className="text-xs">S</span>
                  </button>
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-600 shadow-sm hover:bg-gray-50"
                    onClick={(e) => {
                      // Stop propagation to prevent Link from capturing click
                      e.preventDefault();
                      e.stopPropagation();
                      if (file.id) openDeleteDialog(file);
                    }}
                    title="Delete"
                  >
                    <span className="text-xs">X</span>
                  </button>
                </>
              )}
              {readOnly && (
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50"
                  onClick={() => file.id && handleDownload(file)}
                  title="Download"
                >
                  <span className="text-xs">D</span>
                </button>
              )}
            </div>
            {/* Menu actions will be handled by the shared FileActions component */}

            {type === "folder" ? (
              <div className="bg-secondary/20 flex h-40 items-center justify-center">
                <FolderIcon className="h-20 w-20 text-blue-500" />
              </div>
            ) : type === "doc" ? (
              <div className="flex h-40 items-center justify-center bg-blue-50">
                <DocumentIcon className="h-20 w-20 text-blue-600" />
              </div>
            ) : type === "sheet" ? (
              <div className="flex h-40 items-center justify-center bg-green-50">
                <SpreadsheetIcon className="h-20 w-20 text-green-600" />
              </div>
            ) : type === "pdf" ? (
              <div className="flex h-40 items-center justify-center bg-red-50">
                <PDFIcon className="h-20 w-20 text-red-600" />
              </div>
            ) : type === "image" ? (
              <div
                className="h-40 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: url
                    ? `url(${url})`
                    : "url(/placeholder-image.jpg)",
                }}
              />
            ) : (
              <div className="flex h-40 items-center justify-center bg-gray-50">
                <GenericFileIcon className="h-20 w-20 text-gray-400" />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start p-3">
          <h3 className="truncate text-sm font-medium">{name}</h3>
          {type === "folder" && itemCount !== undefined && (
            <p className="text-muted-foreground text-xs">{itemCount} items</p>
          )}
          {lastModified && (
            <div className="text-muted-foreground mt-1 flex items-center text-xs">
              <span>{lastModified}</span>
              {size && (
                <>
                  <span className="mx-1">•</span>
                  <span>{size}</span>
                </>
              )}
            </div>
          )}
        </CardFooter>
      </Card>

      {/* ShareLinkDialog component */}
      <ShareLinkDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        shareUrl={shareUrl ?? ""}
        fileName={name}
      />
    </>
  );
}
