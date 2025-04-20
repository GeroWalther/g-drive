/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { AppLayout } from "~/components/layout/AppLayout";
import { SearchResults } from "~/components/SearchResults";
import { redirect } from "next/navigation";
import { QUERIES } from "~/server/db/queries";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import type { FileProps } from "~/types/file";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { userId } = await auth();

  // Redirect to home if no query provided or not authenticated
  if (!query || query.trim() === "" || !userId) {
    redirect("/drive");
  }

  let searchResults: FileProps[] = [];

  try {
    // Perform search using the database query with user ID
    searchResults = await QUERIES.searchItems(query.trim(), userId);
  } catch (error) {
    console.error("Error performing search:", error);
    // We'll show an empty result set and an error message handled by the component
  }

  return (
    <>
      <SignedIn>
        <AppLayout>
          <SearchResults query={query} results={searchResults} />
        </AppLayout>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
