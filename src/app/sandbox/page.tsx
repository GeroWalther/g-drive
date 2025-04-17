import React from "react";
import { db } from "~/server/db";
import { fileItems } from "~/server/db/schema";
import { folderContents } from "~/data/mockData";

// Define a server action outside the component
async function seedDatabase(formData: FormData): Promise<void> {
  "use server";

  try {
    // First, clear existing data
    console.log("Clearing existing data...");
    try {
      // We explicitly want to delete all rows
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      await db.delete(fileItems);
      console.log("Existing data cleared successfully");
    } catch (clearError) {
      console.error("Error clearing existing data:", clearError);
      // Continue with the insertion even if clearing fails
    }

    // Get all files and folders from all directories
    const allItems = Object.values(folderContents).flat();
    console.log(`Found ${allItems.length} items to insert`);

    // Map items to match the database schema
    const dbItems = allItems.map((item) => {
      // Safe conversion for parentId to BigInt
      let parentIdBigInt = null;
      if (item.parentId && /^\d+$/.test(String(item.parentId))) {
        try {
          parentIdBigInt = BigInt(String(item.parentId));
        } catch (e) {
          console.log(`Couldn't convert parentId "${item.parentId}" to BigInt`);
        }
      }

      return {
        name: item.name,
        type: item.type,
        size: item.size
          ? parseInt(String(item.size).replace(/[^0-9]/g, ""))
          : null,
        url: `#${item.id}`, // Placeholder URL
        parent_id: parentIdBigInt,
        item_count: item.itemCount ?? null,
      };
    });

    // Insert the items into the database
    await db.insert(fileItems).values(dbItems);
    console.log(`Successfully added ${dbItems.length} items to the database.`);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

export default function SandboxPage() {
  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="mb-4 text-2xl font-bold">Database Sandbox</h1>

      <div className="rounded-md border border-gray-700 p-6">
        <h2 className="mb-4 text-xl font-semibold">Seed Database</h2>
        <p className="mb-6 text-gray-400">
          This will clear existing data and add all mock data files and folders
          to your database.
        </p>
        <form action={seedDatabase}>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Seed Database
          </button>
        </form>
      </div>
    </div>
  );
}
