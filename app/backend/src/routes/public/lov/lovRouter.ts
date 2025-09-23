import { Hono } from 'hono'
import { db } from '@/db';
import { 
  industryCategories, 
  industrySubCategories, 
  countries, 
  states, 
  cities, 
  incentiveMethods, 
  companyTypes, 
  engagementModels, 
  industrySpecializations 
} from '@/db/schema/LOV-schema.js';
import { eq } from "drizzle-orm";

export const lovRouter = new Hono();

// ------------------ INDUSTRY CATEGORIES ------------------
lovRouter.get("/categories", async (c) => {
  const result = await db.select().from(industryCategories);
  return c.json(result);
});

lovRouter.post("/categories", async (c) => {
  const body = await c.req.json();
  const inserted = await db
    .insert(industryCategories)
    .values({
      id: body.id,
      name: body.name,
      description: body.description,
    })
    .returning();
  return c.json(inserted[0]);
});

lovRouter.get("/categories/:id", async (c) => {
  const { id } = c.req.param();
  const result = await db
    .select()
    .from(industryCategories)
    .where(eq(industryCategories.id, id));
  return result.length ? c.json(result[0]) : c.notFound();
});

// ------------------ SUBCATEGORIES ------------------
lovRouter.get("/subcategories", async (c) => {
  const result = await db.select().from(industrySubCategories);
  return c.json(result);
});

lovRouter.post("/subcategories", async (c) => {
  const body = await c.req.json();
  const inserted = await db
    .insert(industrySubCategories)
    .values({
      categoryId: body.categoryId,
      name: body.name,
      description: body.description,
    })
    .returning();
  return c.json(inserted[0]);
});

// ------------------ SPECIALIZATIONS ------------------
lovRouter.get("/specializations", async (c) => {
  const result = await db.select().from(industrySpecializations);
  return c.json(result);
});

lovRouter.post("/specializations", async (c) => {
  const body = await c.req.json();
  const inserted = await db
    .insert(industrySpecializations)
    .values({
      subCategoryId: body.subCategoryId,
      name: body.name,
      description: body.description,
    })
    .returning();
  return c.json(inserted[0]);
});

// ------------------ ENGAGEMENT MODELS ------------------
lovRouter.get("/engagement-models", async (c) => {
  const result = await db.select().from(engagementModels);
  return c.json(result);
});

lovRouter.post("/engagement-models", async (c) => {
  const body = await c.req.json();
  const inserted = await db
    .insert(engagementModels)
    .values(body)
    .returning();
  return c.json(inserted[0]);
});

// ------------------ INCENTIVE METHODS ------------------
lovRouter.get("/incentive-methods", async (c) => {
  const result = await db.select().from(incentiveMethods);
  return c.json(result);
});

lovRouter.post("/incentive-methods", async (c) => {
  const body = await c.req.json();
  const inserted = await db.insert(incentiveMethods).values(body).returning();
  return c.json(inserted[0]);
});

// ------------------ COMPANY TYPES ------------------
lovRouter.get("/company-types", async (c) => {
  const result = await db.select().from(companyTypes);
  return c.json(result);
});

lovRouter.post("/company-types", async (c) => {
  const body = await c.req.json();
  const inserted = await db.insert(companyTypes).values(body).returning();
  return c.json(inserted[0]);
});

// ------------------ COUNTRIES ------------------
lovRouter.get("/countries", async (c) => {
  const result = await db.select().from(countries);
  return c.json(result);
});

lovRouter.post("/countries", async (c) => {
  const body = await c.req.json();
  const inserted = await db.insert(countries).values(body).returning();
  return c.json(inserted[0]);
});

// ------------------ STATES ------------------
lovRouter.get("/states", async (c) => {
  const result = await db.select().from(states);
  return c.json(result);
});

lovRouter.post("/states", async (c) => {
  const body = await c.req.json();
  const inserted = await db.insert(states).values(body).returning();
  return c.json(inserted[0]);
});

// ------------------ CITIES ------------------
lovRouter.get("/cities", async (c) => {
  const result = await db.select().from(cities);
  return c.json(result);
});

lovRouter.post("/cities", async (c) => {
  const body = await c.req.json();
  const inserted = await db.insert(cities).values(body).returning();
  return c.json(inserted[0]);
});