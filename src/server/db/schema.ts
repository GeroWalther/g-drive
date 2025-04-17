import {
  int,
  bigint,
  text,
  singlestoreTable,
  timestamp,
} from "drizzle-orm/singlestore-core";

export const users = singlestoreTable("users_table", {
  id: bigint("id", { mode: "bigint" }).primaryKey().autoincrement(),

  name: text("name"),

  age: int("age"),
});

export const fileItems = singlestoreTable("file_items", {
  id: bigint("id", { mode: "bigint" }).primaryKey().autoincrement(),
  name: text("name").notNull(),
  type: text("type").notNull(), // "folder", "doc", "pdf", etc.
  size: int("size"), // null for folders
  url: text("url"), // null for folders
  parent_id: bigint("parent_id", { mode: "bigint" }), // null for root items
  item_count: int("item_count"), // for folder stats
  created_at: timestamp("created_at").defaultNow(),
  modified_at: timestamp("modified_at").defaultNow(),
});
