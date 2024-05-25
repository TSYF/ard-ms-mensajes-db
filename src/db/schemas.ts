import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const messageModel = pgTable("message", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(),
    email: varchar("email").notNull(),
    message: varchar("message").notNull(),
});