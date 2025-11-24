import { Hono } from 'hono'
import { IndustryController } from '@/controllers/lov/IndustryController';
import { LocationController } from '@/controllers/lov/LocationController';
import { EngagementController } from '@/controllers/lov/EngagementController';

export const lovRouter = new Hono();

// Initialize controllers
const industryController = new IndustryController();
const locationController = new LocationController();
const engagementController = new EngagementController();

// ------------------ INDUSTRY CATEGORIES ------------------
lovRouter.get("/categories", async (c) => {
  try {
    const result = await industryController.getCategories();
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Failed to fetch categories' }, 500);
  }
});

lovRouter.post("/categories", async (c) => {
  try {
    const body = await c.req.json();
    const result = await industryController.createCategory(body);
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Failed to create category' }, 500);
  }
});

lovRouter.get("/categories/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const result = await industryController.getCategoryById(id);
    return result ? c.json(result) : c.notFound();
  } catch (error) {
    return c.json({ error: 'Failed to fetch category' }, 500);
  }
});

// ------------------ SUBCATEGORIES ------------------
lovRouter.get("/subcategories", async (c) => {
  try {
    const result = await industryController.getSubCategories();
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Failed to fetch subcategories' }, 500);
  }
});

lovRouter.post("/subcategories", async (c) => {
  try {
    const body = await c.req.json();
    const result = await industryController.createSubCategory(body);
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Failed to create subcategory' }, 500);
  }
});

// ------------------ SPECIALIZATIONS ------------------
lovRouter.get("/specializations", async (c) => {
  try {
    const result = await industryController.getSpecializations();
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Failed to fetch specializations' }, 500);
  }
});

lovRouter.post("/specializations", async (c) => {
  try {
    const body = await c.req.json();
    const result = await industryController.createSpecialization(body);
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Failed to create specialization' }, 500);
  }
});

// ------------------ ENGAGEMENT MODELS ------------------
lovRouter.get("/engagement-models", async (c) => {
  try {
    const result = await engagementController.getEngagementModels();
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Failed to fetch engagement models' }, 500);
  }
});

lovRouter.post("/engagement-models", async (c) => {
  try {
    const body = await c.req.json();
    const result = await engagementController.createEngagementModel(body);
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Failed to create engagement model' }, 500);
  }
});

// ------------------ INCENTIVE METHODS ------------------
lovRouter.get("/incentive-methods", async (c) => {
  try {
    const result = await engagementController.getIncentiveMethods();
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Failed to fetch incentive methods' }, 500);
  }
});

lovRouter.post("/incentive-methods", async (c) => {
  try {
    const body = await c.req.json();
    const result = await engagementController.createIncentiveMethod(body);
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Failed to create incentive method' }, 500);
  }
});

// ------------------ COMPANY TYPES ------------------
lovRouter.get("/company-types", async (c) => {
  try {
    const result = await engagementController.getCompanyTypes();
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Failed to fetch company types' }, 500);
  }
});

lovRouter.post("/company-types", async (c) => {
  try {
    const body = await c.req.json();
    const result = await engagementController.createCompanyType(body);
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Failed to create company type' }, 500);
  }
});

// ------------------ COUNTRIES ------------------
lovRouter.get("/countries", async (c) => {
  try {
    const result = await locationController.getCountries();
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Failed to fetch countries' }, 500);
  }
});

lovRouter.post("/countries", async (c) => {
  try {
    const body = await c.req.json();
    const result = await locationController.createCountry(body);
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Failed to create country' }, 500);
  }
});

// ------------------ STATES ------------------
lovRouter.get("/states", async (c) => {
  try {
    const result = await locationController.getStates();
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Failed to fetch states' }, 500);
  }
});

lovRouter.post("/states", async (c) => {
  try {
    const body = await c.req.json();
    const result = await locationController.createState(body);
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Failed to create state' }, 500);
  }
});

// ------------------ CITIES ------------------
lovRouter.get("/cities", async (c) => {
  try {
    const result = await locationController.getCities();
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Failed to fetch cities' }, 500);
  }
});

lovRouter.post("/cities", async (c) => {
  try {
    const body = await c.req.json();
    const result = await locationController.createCity(body);
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Failed to create city' }, 500);
  }
});