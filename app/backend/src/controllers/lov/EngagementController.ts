import { db } from '@/db';
import { 
  engagementModels, 
  incentiveMethods, 
  companyTypes 
} from '@/db/schema/LOV-schema.js';

export class EngagementController {
  // Engagement Models
  async getEngagementModels() {
    return await db.select().from(engagementModels);
  }

  async createEngagementModel(data: any) {
    const inserted = await db
      .insert(engagementModels)
      .values(data)
      .returning();
    return inserted[0];
  }

  // Incentive Methods
  async getIncentiveMethods() {
    return await db.select().from(incentiveMethods);
  }

  async createIncentiveMethod(data: any) {
    const inserted = await db.insert(incentiveMethods).values(data).returning();
    return inserted[0];
  }

  // Company Types
  async getCompanyTypes() {
    return await db.select().from(companyTypes);
  }

  async createCompanyType(data: any) {
    const inserted = await db.insert(companyTypes).values(data).returning();
    return inserted[0];
  }
}