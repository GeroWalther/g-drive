import { notFound } from "next/navigation";
import { QUERIES } from "~/server/db/queries";
import { AppLayout } from "~/components/layout/AppLayout";
import { FilesContainer } from "~/components/FilesContainer";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { FileProps } from "~/types/file";

interface PageProps {
  params: {
    shareId: string;
  };
}

export default async function SharedFilePage(props: {
  params: Promise<PageProps["params"]> | PageProps["params"];
}) {
  try {
    // Get the shareId from params using the same pattern as in drive/page.tsx
    const params = await props.params;
    const shareId = params?.shareId;

    if (!shareId) {
      return notFound();
    }

    // Fetch the shared item
    const item = await QUERIES.getItemByShareId(shareId);

    // Return 404 if item not found or not public
    if (!item) {
      return notFound();
    }

    // For folders, fetch contents
    let folderContents: FileProps[] = [];
    if (item.type === "folder") {
      folderContents = await QUERIES.getSharedFolderContents(BigInt(item.id));
    }

    // Simple view for direct file link
    if (item.type !== "folder" && item.url) {
      // Redirect to the actual file
      return (
        <AppLayout>
          <div className="container mx-auto p-6">
            <div className="mb-6">
              <Button variant="outline" asChild>
                <Link href="/drive">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Drive
                </Link>
              </Button>
            </div>
            <div className="bg-card text-card-foreground rounded-lg border p-8 shadow">
              <h1 className="mb-6 text-2xl font-bold">{item.name}</h1>
              <p className="text-muted-foreground mb-4">
                You&apos;re viewing a shared file.
              </p>

              {item.url && (
                <div className="mt-6 flex gap-3">
                  <Button variant="default" asChild>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View File
                    </a>
                  </Button>
                  <Button
                    className="bg-green-500 text-white hover:bg-green-600"
                    asChild
                  >
                    <a
                      href={item.url}
                      download={item.name}
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </AppLayout>
      );
    }

    // View for folders
    return (
      <AppLayout>
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link href="/drive">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Drive
              </Link>
            </Button>
          </div>

          <h1 className="mb-6 text-2xl font-bold">
            Shared Folder: {item.name}
          </h1>

          <FilesContainer
            files={folderContents}
            // Disable actions since this is a shared view
            readOnly
          />
        </div>
      </AppLayout>
    );
  } catch (error) {
    console.error("Error in shared file page:", error);
    return (
      <AppLayout>
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link href="/drive">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Drive
              </Link>
            </Button>
          </div>
          <div className="bg-card text-card-foreground rounded-lg border p-8 shadow">
            <h1 className="mb-6 text-2xl font-bold text-red-600">
              Error Loading Shared Item
            </h1>
            <p className="text-muted-foreground mb-4">
              Sorry, we couldn&apos;t load the shared item. It may have been
              deleted or the share link is invalid.
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }
}
