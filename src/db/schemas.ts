import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { $schema } from ".";

export const messageModel = $schema.table("message", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(),
    email: varchar("email").notNull(),
    message: varchar("message").notNull(),
});