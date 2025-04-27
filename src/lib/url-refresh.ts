/**
 * URL refresh utility for handling expired S3 presigned URLs
 * This provides client-side handling for expired URLs
 */

interface RefreshUrlResponse {
  success: boolean;
  url: string;
}

interface ErrorResponse {
  error: string;
}

// In-memory cache for URL refresh tracking to minimize API calls
interface UrlCache {
  [fileId: string]: {
    url: string;
    timestamp: number; // When the URL was last refreshed
  };
}

// Store URLs that have been refreshed in the current session
const urlCache: UrlCache = {};

/**
 * Refreshes a file's URL when it has expired
 * @param fileId The ID of the file to refresh
 * @param forceRefresh Whether to force a refresh even if cached
 * @returns The fresh URL or null if failed
 */
export async function refreshFileUrl(
  fileId: string,
  forceRefresh = false,
): Promise<string | null> {
  try {
    // Check if we have a cached URL that's less than 12 hours old (to reduce API calls)
    const cachedUrl = urlCache[fileId];
    const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

    if (
      !forceRefresh &&
      cachedUrl &&
      Date.now() - cachedUrl.timestamp < CACHE_TTL
    ) {
      console.log("Using cached URL for file", fileId);
      return cachedUrl.url;
    }

    // Get a fresh URL from the API
    const response = await fetch("/api/s3/refresh-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileId }),
    });

    if (!response.ok) {
      const error = (await response.json()) as ErrorResponse;
      console.error("Error refreshing URL:", error);
      return null;
    }

    const data = (await response.json()) as RefreshUrlResponse;

    // Store the refreshed URL in cache
    urlCache[fileId] = {
      url: data.url,
      timestamp: Date.now(),
    };

    return data.url;
  } catch (error) {
    console.error("Failed to refresh URL:", error);
    return null;
  }
}

/**
 * Utility to handle fetching with automatic URL refresh if expired
 * @param url The URL to fetch
 * @param fileId The ID of the file (to refresh URL if needed)
 * @param options Fetch options
 * @returns Response or null if failed
 */
export async function fetchWithUrlRefresh(
  url: string,
  fileId: string,
  options?: RequestInit,
): Promise<Response | null> {
  try {
    // First attempt with existing URL
    const response = await fetch(url, options);

    // If access denied due to expiration, refresh the URL and try again
    if (response.status === 403) {
      const responseText = await response.text();

      // Check if it's the S3 expiration error
      if (
        responseText.includes("Request has expired") ||
        responseText.includes("AccessDenied")
      ) {
        console.log("URL expired, refreshing...");

        // Get a fresh URL with force refresh (bypassing cache)
        const freshUrl = await refreshFileUrl(fileId, true);

        if (freshUrl) {
          // Retry with the fresh URL
          return fetch(freshUrl, options);
        }
      }

      return null;
    }

    return response;
  } catch (error) {
    console.error("Error fetching with URL refresh:", error);
    return null;
  }
}
