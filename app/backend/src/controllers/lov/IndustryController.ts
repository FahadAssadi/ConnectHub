import { db } from '@/db';
import { 
  industryCategories, 
  industrySubCategories, 
  industrySpecializations 
} from '@/db/schema/LOV-schema.js';
import { eq } from "drizzle-orm";

export class IndustryController {
  // Categories
  async getCategories() {
    return await db.select().from(industryCategories);
  }

  async createCategory(data: any) {
    const inserted = await db
      .insert(industryCategories)
      .values({
        id: data.id,
        name: data.name,
        description: data.description,
      })
      .returning();
    return inserted[0];
  }

  async getCategoryById(id: string) {
    const result = await db
      .select()
      .from(industryCategories)
      .where(eq(industryCategories.id, id));
    return result.length ? result[0] : null;
  }

  // Subcategories
  async getSubCategories() {
    return await db.select().from(industrySubCategories);
  }

  async createSubCategory(data: any) {
    const inserted = await db
      .insert(industrySubCategories)
      .values({
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
      })
      .returning();
    return inserted[0];
  }

  // Specializations
  async getSpecializations() {
    return await db.select().from(industrySpecializations);
  }

  async createSpecialization(data: any) {
    const inserted = await db
      .insert(industrySpecializations)
      .values({
        subCategoryId: data.subCategoryId,
        name: data.name,
        description: data.description,
      })
      .returning();
    return inserted[0];
  }
}