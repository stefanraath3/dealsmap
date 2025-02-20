import {
  boolean,
  index,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export type OperatingHours = {
  monday: { open: string; close: string };
  tuesday: { open: string; close: string };
  wednesday: { open: string; close: string };
  thursday: { open: string; close: string };
  friday: { open: string; close: string };
  saturday: { open: string; close: string };
  sunday: { open: string; close: string };
};

export type DealDays =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday"
  | "Every day";

export const deals = pgTable(
  "deals",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    location: text("location").notNull(),
    latitude: numeric("latitude").notNull(),
    longitude: numeric("longitude").notNull(),
    category: text("category"),
    price: text("price"),
    originalPrice: text("original_price"),
    day: text("day").$type<DealDays>().notNull(),
    isRecurring: boolean("is_recurring").default(true).notNull(),
    timeWindow: text("time_window"),
    startTime: text("start_time"),
    endTime: text("end_time"),
    images: text("images").array(),
    operatingHours: jsonb("operating_hours").$type<OperatingHours>(),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at"),
  },
  (table) => {
    return {
      dayIdx: index("day_idx").on(table.day),
      locationIdx: index("location_idx").on(table.location),
      categoryIdx: index("category_idx").on(table.category),
      activeIdx: index("active_idx").on(table.isActive),
      geoIdx: index("geo_idx").on(table.latitude, table.longitude),
    };
  }
);
