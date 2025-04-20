import "server-only";

import { db } from "~/server/db";
import { fileItems } from "~/server/db/schema";
import { eq, isNull, and, sql } from "drizzle-orm";
import { type FileProps, type FileType } from "~/types/file";
import { dbItemsToFileProps } from "~/lib/utils";

export const QUERIES = {
  /**
   * Get all items in a folder by parent_id for a specific user
   */
  getFolderContents: async function (
    folderId: bigint,
    userId: string,
  ): Promise<FileProps[]> {
    const folderContents = await db
      .select()
      .from(fileItems)
      .where(
        and(eq(fileItems.parent_id, folderId), eq(fileItems.user_id, userId)),
      )
      .orderBy(fileItems.name);

    return dbItemsToFileProps(folderContents);
  },

  /**
   * Get all root items (with null parent_id) for a specific user
   */
  getRootItems: async function (userId: string): Promise<FileProps[]> {
    const rootItems = await db
      .select()
      .from(fileItems)
      .where(and(isNull(fileItems.parent_id), eq(fileItems.user_id, userId)))
      .orderBy(fileItems.name);

    return dbItemsToFileProps(rootItems);
  },

  /**
   * Get folder details by ID
   */
  getFolderById: async function (
    folderId: bigint,
    userId: string,
  ): Promise<FileProps | null> {
    const folder = await db
      .select()
      .from(fileItems)
      .where(
        and(
          eq(fileItems.id, folderId),
          eq(fileItems.type, "folder"),
          eq(fileItems.user_id, userId),
        ),
      )
      .limit(1);

    if (folder.length === 0 || !folder[0]) {
      return null;
    }

    const folderProps = dbItemsToFileProps([folder[0]]);
    return folderProps[0] ?? null;
  },

  /**
   * Get any item (file or folder) by ID
   */
  getItemById: async function (id: string): Promise<FileProps | null> {
    try {
      const item = await db
        .select()
        .from(fileItems)
        .where(eq(fileItems.id, BigInt(id)))
        .limit(1);

      if (item.length === 0 || !item[0]) {
        return null;
      }

      const itemProps = dbItemsToFileProps([item[0]]);
      return itemProps[0] ?? null;
    } catch (error) {
      console.error("Error getting item by ID:", error);
      return null;
    }
  },

  /**
   * Get all folders (for breadcrumb navigation)
   */
  getAllFolders: async function (): Promise<FileProps[]> {
    const folders = await db
      .select()
      .from(fileItems)
      .where(eq(fileItems.type, "folder"))
      .orderBy(fileItems.name);

    return dbItemsToFileProps(folders);
  },

  /**
   * Get all parent folders for a given folder ID
   * Returns array from root to immediate parent
   */
  getBreadcrumbPath: async function (
    folderId: bigint,
    userId: string,
  ): Promise<FileProps[]> {
    // Start with the current folder
    const folder = await QUERIES.getFolderById(folderId, userId);
    if (!folder) return [];

    const path: FileProps[] = [folder];
    let currentParentId = folder.parentId;

    // Prevent infinite loops
    const maxIterations = 10;
    let iterations = 0;

    // Traverse up the parent chain
    while (currentParentId && iterations < maxIterations) {
      // Find parent folder
      const parentBigInt = BigInt(currentParentId);
      const parent = await QUERIES.getFolderById(parentBigInt, userId);
      if (!parent) break;

      // Add to start of array (so most distant parent comes first)
      path.unshift(parent);
      currentParentId = parent.parentId;
      iterations++;
    }

    // Add root as first item
    path.unshift({
      id: "root",
      name: "My Drive",
      type: "folder",
      parentId: undefined,
    });

    return path;
  },

  /**
   * Search for files and folders by name
   */
  searchItems: async function (
    query: string,
    userId: string,
  ): Promise<FileProps[]> {
    const items = await db
      .select()
      .from(fileItems)
      .where(
        and(
          sql`${fileItems.name} LIKE ${`%${query}%`}`,
          eq(fileItems.user_id, userId),
        ),
      )
      .orderBy(fileItems.name);

    return dbItemsToFileProps(items);
  },

  /**
   * Get items by type
   */
  getItemsByType: async function (type: FileType): Promise<FileProps[]> {
    const items = await db
      .select()
      .from(fileItems)
      .where(eq(fileItems.type, type))
      .orderBy(fileItems.name);

    return dbItemsToFileProps(items);
  },

  /**
   * Create a share link for a file or folder
   */
  createShareLink: async function (
    fileId: string,
    userId: string,
  ): Promise<string | null> {
    try {
      // Convert ID to BigInt
      const itemId = BigInt(fileId);

      // Check if the item exists and belongs to the user
      const item = await db
        .select()
        .from(fileItems)
        .where(and(eq(fileItems.id, itemId), eq(fileItems.user_id, userId)))
        .limit(1);

      if (!item.length) return null;

      // Generate a unique share ID if one doesn't exist
      let shareId = item[0]?.share_id;

      if (!shareId) {
        // Create a unique ID for sharing
        shareId = `share_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

        // Update the item with the share ID and mark it as public
        await db
          .update(fileItems)
          .set({
            share_id: shareId,
            is_public: 1,
          })
          .where(eq(fileItems.id, itemId));
      } else {
        // If already shared, just ensure it's public
        if (item[0]?.is_public !== 1) {
          await db
            .update(fileItems)
            .set({ is_public: 1 })
            .where(eq(fileItems.id, itemId));
        }
      }

      return shareId;
    } catch (error) {
      console.error("Error creating share link:", error);
      return null;
    }
  },

  /**
   * Get item by share ID (accessible without authentication)
   */
  getItemByShareId: async function (
    shareId: string,
  ): Promise<FileProps | null> {
    try {
      const item = await db
        .select()
        .from(fileItems)
        .where(and(eq(fileItems.share_id, shareId), eq(fileItems.is_public, 1)))
        .limit(1);

      if (item.length === 0 || !item[0]) return null;

      const itemProps = dbItemsToFileProps([item[0]]);
      return itemProps[0] ?? null;
    } catch (error) {
      console.error("Error getting shared item:", error);
      return null;
    }
  },

  /**
   * Get folder contents for a shared folder (accessible without authentication)
   */
  getSharedFolderContents: async function (
    folderId: bigint,
  ): Promise<FileProps[]> {
    try {
      // First get the folder to make sure it's public
      const folder = await db
        .select()
        .from(fileItems)
        .where(
          and(
            eq(fileItems.id, folderId),
            eq(fileItems.type, "folder"),
            eq(fileItems.is_public, 1),
          ),
        )
        .limit(1);

      if (folder.length === 0) return [];

      // Get folder contents
      const folderContents = await db
        .select()
        .from(fileItems)
        .where(eq(fileItems.parent_id, folderId))
        .orderBy(fileItems.name);

      return dbItemsToFileProps(folderContents);
    } catch (error) {
      console.error("Error getting shared folder contents:", error);
      return [];
    }
  },
};

export const MUTATIONS = {
  /**
   * Create a new folder
   */
  createFolder: async function (
    name: string,
    parentId: string | null,
    userId: string,
  ): Promise<FileProps | null> {
    const parentBigInt = parentId ? BigInt(parentId) : null;

    try {
      // Insert the folder
      await db.insert(fileItems).values({
        name,
        type: "folder",
        parent_id: parentBigInt,
        size: null,
        item_count: 0,
        user_id: userId,
      });

      // Find the newly created folder
      const folders = await db
        .select()
        .from(fileItems)
        .where(
          sql`${fileItems.name} = ${name} AND 
              ${parentBigInt ? sql`${fileItems.parent_id} = ${parentBigInt}` : sql`${fileItems.parent_id} IS NULL`} AND 
              ${fileItems.type} = 'folder' AND
              ${fileItems.user_id} = ${userId}`,
        )
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        .orderBy(fileItems.id, "desc")
        .limit(1);

      if (folders.length > 0) {
        return dbItemsToFileProps(folders)[0] ?? null;
      }

      return null;
    } catch (error) {
      console.error("Error creating folder:", error);
      return null;
    }
  },

  /**
   * Create a new file
   */
  createFile: async function (
    name: string,
    type: FileType,
    size: number,
    parentId: string | null,
    userId: string,
  ): Promise<FileProps | null> {
    const parentBigInt = parentId ? BigInt(parentId) : null;

    try {
      // Insert the file
      await db.insert(fileItems).values({
        name,
        type,
        size,
        parent_id: parentBigInt,
        user_id: userId,
      });

      // Update parent folder's item count
      if (parentBigInt) {
        await MUTATIONS.updateFolderItemCount(parentBigInt);
      }

      // Find the newly created file
      const files = await db
        .select()
        .from(fileItems)
        .where(
          sql`${fileItems.name} = ${name} AND 
              ${parentBigInt ? sql`${fileItems.parent_id} = ${parentBigInt}` : sql`${fileItems.parent_id} IS NULL`} AND 
              ${fileItems.type} = ${type} AND
              ${fileItems.user_id} = ${userId}`,
        )
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        .orderBy(fileItems.id, "desc")
        .limit(1);

      if (files.length > 0) {
        return dbItemsToFileProps(files)[0] ?? null;
      }

      return null;
    } catch (error) {
      console.error("Error creating file:", error);
      return null;
    }
  },

  /**
   * Rename a file or folder
   */
  renameItem: async function (
    id: string,
    newName: string,
  ): Promise<FileProps | null> {
    try {
      await db
        .update(fileItems)
        .set({ name: newName })
        .where(eq(fileItems.id, BigInt(id)));

      // Fetch the updated item
      const updatedItem = await db
        .select()
        .from(fileItems)
        .where(eq(fileItems.id, BigInt(id)))
        .limit(1);

      if (updatedItem.length > 0) {
        const itemProps = dbItemsToFileProps(updatedItem);
        return itemProps[0] ?? null;
      }

      return null;
    } catch (error) {
      console.error("Error renaming item:", error);
      return null;
    }
  },

  /**
   * Move an item to a different folder
   */
  moveItem: async function (
    id: string,
    newParentId: string | null,
  ): Promise<FileProps | null> {
    try {
      const oldItem = await db
        .select()
        .from(fileItems)
        .where(eq(fileItems.id, BigInt(id)))
        .limit(1);

      if (oldItem.length === 0) {
        return null;
      }

      const oldParentId = oldItem[0]?.parent_id;
      const newParentBigInt = newParentId ? BigInt(newParentId) : null;

      // Update the item
      await db
        .update(fileItems)
        .set({ parent_id: newParentBigInt })
        .where(eq(fileItems.id, BigInt(id)));

      // Update old parent's item count
      if (oldParentId) {
        await MUTATIONS.updateFolderItemCount(oldParentId);
      }

      // Update new parent's item count
      if (newParentBigInt) {
        await MUTATIONS.updateFolderItemCount(newParentBigInt);
      }

      // Fetch the updated item
      const updatedItem = await db
        .select()
        .from(fileItems)
        .where(eq(fileItems.id, BigInt(id)))
        .limit(1);

      if (updatedItem.length > 0) {
        const itemProps = dbItemsToFileProps(updatedItem);
        return itemProps[0] ?? null;
      }

      return null;
    } catch (error) {
      console.error("Error moving item:", error);
      return null;
    }
  },

  /**
   * Delete a file or folder
   */
  deleteItem: async function (id: string): Promise<boolean> {
    try {
      const item = await db
        .select()
        .from(fileItems)
        .where(eq(fileItems.id, BigInt(id)))
        .limit(1);

      if (item.length === 0) {
        return false;
      }

      const parentId = item[0]?.parent_id;

      // Delete the item
      await db.delete(fileItems).where(eq(fileItems.id, BigInt(id)));

      // If it's a folder, delete all children recursively
      if (item[0]?.type === "folder") {
        const children = await db
          .select()
          .from(fileItems)
          .where(eq(fileItems.parent_id, BigInt(id)));

        for (const child of children) {
          await MUTATIONS.deleteItem(child.id.toString());
        }
      }

      // Update parent folder's item count
      if (parentId) {
        await MUTATIONS.updateFolderItemCount(parentId);
      }

      return true;
    } catch (error) {
      console.error("Error deleting item:", error);
      return false;
    }
  },

  /**
   * Update item_count for a folder
   * @private Internal helper method
   */
  updateFolderItemCount: async function (folderId: bigint): Promise<void> {
    try {
      // Count items in the folder
      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(fileItems)
        .where(eq(fileItems.parent_id, folderId));

      const count = countResult[0]?.count ?? 0;

      // Update the folder's item_count
      await db
        .update(fileItems)
        .set({ item_count: count })
        .where(and(eq(fileItems.id, folderId), eq(fileItems.type, "folder")));
    } catch (error) {
      console.error("Error updating folder item count:", error);
    }
  },
};
