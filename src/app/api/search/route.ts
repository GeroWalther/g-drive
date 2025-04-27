import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { QUERIES } from "~/server/db/queries";

//No Direct Usage: You're right that in the current implementation, your app searches directly from the page component, not by calling this API endpoint. The API route exists as an alternative access method, but isn't currently being used by your frontend.

export async function GET(request: Request) {
  // Authenticate the user
  const user = await auth();
  if (!user || !user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the search query from URL parameter
    const url = new URL(request.url);
    const query = url.searchParams.get("q");

    // Validate search query
    if (!query || query.trim() === "") {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 },
      );
    }

    // Search for items matching the query
    const results = await QUERIES.searchItems(query.trim(), user.userId);

    // Redirect to search results page with the query parameter
    // This approach keeps the API clean but still handles the search
    const searchUrl = `/search?q=${encodeURIComponent(query.trim())}`;

    // Return search results
    return NextResponse.json({
      success: true,
      results,
      count: results.length,
      query,
      redirectUrl: searchUrl,
    });
  } catch (error) {
    console.error("Error performing search:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 },
    );
  }
}
