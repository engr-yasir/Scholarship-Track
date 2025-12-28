import { db } from "./db";
import {
  scholarships,
  type InsertScholarship,
  type Scholarship,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getScholarships(): Promise<Scholarship[]>;
  getScholarship(id: number): Promise<Scholarship | undefined>;
  createScholarship(scholarship: InsertScholarship): Promise<Scholarship>;
  updateScholarship(id: number, updates: Partial<InsertScholarship>): Promise<Scholarship>;
  deleteScholarship(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getScholarships(): Promise<Scholarship[]> {
    return await db.select().from(scholarships).orderBy(scholarships.deadline);
  }

  async getScholarship(id: number): Promise<Scholarship | undefined> {
    const [scholarship] = await db.select().from(scholarships).where(eq(scholarships.id, id));
    return scholarship;
  }

  async createScholarship(insertScholarship: InsertScholarship): Promise<Scholarship> {
    const [scholarship] = await db
      .insert(scholarships)
      .values(insertScholarship)
      .returning();
    return scholarship;
  }

  async updateScholarship(id: number, updates: Partial<InsertScholarship>): Promise<Scholarship> {
    const [updated] = await db
      .update(scholarships)
      .set(updates)
      .where(eq(scholarships.id, id))
      .returning();
    return updated;
  }

  async deleteScholarship(id: number): Promise<void> {
    await db.delete(scholarships).where(eq(scholarships.id, id));
  }
}

export const storage = new DatabaseStorage();
