import { Hono } from 'hono'
import { db } from '../../db/index.js';
import { industryCategories, industrySubCategories, countries, states, cities, incentiveMethods, companyTypes, engagementModels, industrySpecializations } from '../../db/schema/LOV-schema.js';
import { eq } from "drizzle-orm";

export const metaRoute = new Hono();

// ------------------ INDUSTRY CATEGORIES ------------------
metaRoute.get("/categories", async (c) => {
  const result = await db.select().from(industryCategories);
  return c.json(result);
});

metaRoute.post("/categories", async (c) => {
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

metaRoute.get("/categories/:id", async (c) => {
  const { id } = c.req.param();
  const result = await db
    .select()
    .from(industryCategories)
    .where(eq(industryCategories.id, id));
  return result.length ? c.json(result[0]) : c.notFound();
});

// ------------------ SUBCATEGORIES ------------------
metaRoute.get("/subcategories", async (c) => {
  const result = await db.select().from(industrySubCategories);
  return c.json(result);
});

metaRoute.post("/subcategories", async (c) => {
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
metaRoute.get("/specializations", async (c) => {
  const result = await db.select().from(industrySpecializations);
  return c.json(result);
});

metaRoute.post("/specializations", async (c) => {
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
metaRoute.get("/engagement-models", async (c) => {
  const result = await db.select().from(engagementModels);
  return c.json(result);
});

metaRoute.post("/engagement-models", async (c) => {
  const body = await c.req.json();
  const inserted = await db
    .insert(engagementModels)
    .values(body)
    .returning();
  return c.json(inserted[0]);
});

// ------------------ INCENTIVE METHODS ------------------
metaRoute.get("/incentive-methods", async (c) => {
  const result = await db.select().from(incentiveMethods);
  return c.json(result);
});

metaRoute.post("/incentive-methods", async (c) => {
  const body = await c.req.json();
  const inserted = await db.insert(incentiveMethods).values(body).returning();
  return c.json(inserted[0]);
});

// ------------------ COMPANY TYPES ------------------
metaRoute.get("/company-types", async (c) => {
  const result = await db.select().from(companyTypes);
  return c.json(result);
});

metaRoute.post("/company-types", async (c) => {
  const body = await c.req.json();
  const inserted = await db.insert(companyTypes).values(body).returning();
  return c.json(inserted[0]);
});

// ------------------ COUNTRIES ------------------
metaRoute.get("/countries", async (c) => {
  const result = await db.select().from(countries);
  return c.json(result);
});

metaRoute.post("/countries", async (c) => {
  const body = await c.req.json();
  const inserted = await db.insert(countries).values(body).returning();
  return c.json(inserted[0]);
});

// ------------------ STATES ------------------
metaRoute.get("/states", async (c) => {
  const result = await db.select().from(states);
  return c.json(result);
});

metaRoute.post("/states", async (c) => {
  const body = await c.req.json();
  const inserted = await db.insert(states).values(body).returning();
  return c.json(inserted[0]);
});

// ------------------ CITIES ------------------
metaRoute.get("/cities", async (c) => {
  const result = await db.select().from(cities);
  return c.json(result);
});

metaRoute.post("/cities", async (c) => {
  const body = await c.req.json();
  const inserted = await db.insert(cities).values(body).returning();
  return c.json(inserted[0]);
});