import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const books = sqliteTable("books", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  author: text("author").notNull(),
  rating: integer("rating"),
  coverImage: text("cover_image"),
  dateCompleted: text("date_completed"),
  currentlyReading: integer("currently_reading", { mode: "boolean" }).default(
    false
  ),
  genre: text("genre"),
  topic: text("topic"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
export type User = typeof users.$inferSelect;
