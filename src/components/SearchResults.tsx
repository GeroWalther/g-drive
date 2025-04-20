"use client";

import { FilesContainer } from "~/components/FilesContainer";
import type { FileProps } from "~/types/file";
import { useRouter } from "next/navigation";

interface SearchResultsProps {
  query: string;
  results: FileProps[];
}

export function SearchResults({ query, results }: SearchResultsProps) {
  const router = useRouter();

  // Handle click on a folder - navigate to folder view
  const handleFolderClick = (file: FileProps) => {
    if (file.type === "folder") {
      router.push(`/drive/${file.id}`);
    }
  };

  // Handle click on a file - for now just open the file URL if available
  const handleFileClick = (file: FileProps) => {
    if (file.type !== "folder" && file.url) {
      window.open(file.url, "_blank");
    }
  };

  // Helper function to generate folder URLs
  const getFolderUrl = (file: FileProps) => {
    return file.type === "folder" ? `/drive/${file.id}` : "";
  };

  // Helper function to get link URL for files
  const getLinkUrl = (file: FileProps) => {
    return file.type !== "folder" && file.url ? file.url : undefined;
  };

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Search Results</h1>
        <p className="text-muted-foreground">
          {results.length === 0
            ? `No results found for "${query}"`
            : `Found ${results.length} results for "${query}"`}
        </p>
      </div>

      {results.length > 0 && (
        <FilesContainer
          files={results}
          onFolderClick={handleFolderClick}
          onFileClick={handleFileClick}
          getFolderUrl={getFolderUrl}
          getLinkUrl={getLinkUrl}
        />
      )}

      {results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-muted mb-4 rounded-full p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <h2 className="text-xl font-medium">No matching files or folders</h2>
          <p className="text-muted-foreground mt-2 text-center">
            Try searching for something else or check for typos
          </p>
        </div>
      )}
    </div>
  );
}
