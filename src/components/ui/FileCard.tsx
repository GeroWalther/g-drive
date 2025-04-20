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
import { useFileActions } from "./FileActions";

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
}: FileCardProps) {
  // Always create a default fileActions hook to satisfy React's rules
  const defaultFileActions = useFileActions();

  // Use provided fileActions or the default one
  const { openRenameDialog, openDeleteDialog, handleDownload } =
    fileActions ?? defaultFileActions;

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

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-md"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative">
          <div
            className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={handleMenuClick}
          >
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50">
                <DotsIcon className="h-4 w-4 text-gray-600" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => file.id && handleDownload(file)}
                >
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => file.id && openRenameDialog(file)}
                >
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem>Share</DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => file.id && openDeleteDialog(file)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
  );
}
