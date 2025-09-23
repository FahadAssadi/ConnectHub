import { db } from '@/db';
import { countries, states, cities } from '@/db/schema/LOV-schema.js';

export class LocationController {
  // Countries
  async getCountries() {
    return await db.select().from(countries);
  }

  async createCountry(data: any) {
    const inserted = await db.insert(countries).values(data).returning();
    return inserted[0];
  }

  // States
  async getStates() {
    return await db.select().from(states);
  }

  async createState(data: any) {
    const inserted = await db.insert(states).values(data).returning();
    return inserted[0];
  }

  // Cities
  async getCities() {
    return await db.select().from(cities);
  }

  async createCity(data: any) {
    const inserted = await db.insert(cities).values(data).returning();
    return inserted[0];
  }
}