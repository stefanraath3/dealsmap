import { numeric, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  category: text("category"),
  price: numeric("price"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
