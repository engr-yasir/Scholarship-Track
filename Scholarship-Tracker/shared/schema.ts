import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const scholarships = pgTable("scholarships", {
  id: serial("id").primaryKey(),
  scholarshipName: text("scholarship_name").notNull(),
  universityName: text("university_name").notNull(),
  country: text("country").notNull(),
  fundingType: text("funding_type").notNull(),
  professorEmail: text("professor_email"),
  requiredDocuments: text("required_documents").array(),
  deadline: text("deadline"),
  status: text("status").notNull().default("Not Started"),
  applyLink: text("apply_link"),
  notes: text("notes"),
  portalSignup: boolean("portal_signup").notNull().default(false),
  applyStarted: boolean("apply_started").notNull().default(false),
  documentsDone: text("documents_done").array().notNull().default([]),
});

export const insertScholarshipSchema = createInsertSchema(scholarships).omit({ id: true });

export type Scholarship = typeof scholarships.$inferSelect;
export type InsertScholarship = z.infer<typeof insertScholarshipSchema>;
