import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { product, bdPartnerApplication } from "../db/schema";
import { withAuth, requireBdPartnerApplicationAccess } from "../lib/registration/middleware";

const app = new Hono();

/**
 * Get all products (marketplace)
 * GET /api/products
 */
app.get("/", async (c) => {
  const authCheck = await withAuth(c.req.raw);
  if (authCheck) return authCheck;

  try {
    const products = await db.select({
      id: product.id,
      name: product.name,
      productType: product.productType,
      shortDescription: product.shortDescription,
      industrySpecialization: product.industrySpecialization,
      engagementMethods: product.engagementMethods,
      indicativeIncentive: product.indicativeIncentive,
      createdAt: product.createdAt
    })
    .from(product)
    .where(eq(product.isActive, true));

    return c.json({ products });
  } catch (error) {
    console.error("Products fetch error:", error);
    return c.json({ error: "Failed to fetch products" }, 500);
  }
});

/**
 * Get single product details
 * GET /api/products/:id
 */
app.get("/:id", async (c) => {
  const authCheck = await withAuth(c.req.raw);
  if (authCheck) return authCheck;

  const productId = c.req.param("id");

  try {
    const [productData] = await db.select()
      .from(product)
      .where(and(
        eq(product.id, productId),
        eq(product.isActive, true)
      ))
      .limit(1);

    if (!productData) {
      return c.json({ error: "Product not found" }, 404);
    }

    return c.json({ product: productData });
  } catch (error) {
    console.error("Product fetch error:", error);
    return c.json({ error: "Failed to fetch product" }, 500);
  }
});

/**
 * Apply to a product (BD Partners only)
 * POST /api/products/:id/apply
 */
app.post("/:id/apply", async (c) => {
  const authCheck = await withAuth(c.req.raw);
  if (authCheck) return authCheck;

  const applicationCheck = await requireBdPartnerApplicationAccess(c.req.raw);
  if (applicationCheck) return applicationCheck;

  const productId = c.req.param("id");
  const { applicationMessage } = await c.req.json();
  const userProfile = (c.req.raw as any).userProfile;

  try {
    // Check if product exists
    const [productData] = await db.select()
      .from(product)
      .where(and(
        eq(product.id, productId),
        eq(product.isActive, true)
      ))
      .limit(1);

    if (!productData) {
      return c.json({ error: "Product not found" }, 404);
    }

    // Check if already applied
    const [existingApplication] = await db.select()
      .from(bdPartnerApplication)
      .where(and(
        eq(bdPartnerApplication.productId, productId),
        eq(bdPartnerApplication.bdPartnerProfileId, userProfile.id)
      ))
      .limit(1);

    if (existingApplication) {
      return c.json({ 
        error: "Already applied to this product",
        applicationStatus: existingApplication.applicationStatus 
      }, 400);
    }

    // Create application
    const [application] = await db.insert(bdPartnerApplication).values({
      productId,
      bdPartnerProfileId: userProfile.id,
      applicationMessage,
      applicationStatus: "pending"
    }).returning();

    return c.json({ 
      success: true,
      application,
      message: "Application submitted successfully" 
    });
  } catch (error) {
    console.error("Product application error:", error);
    return c.json({ error: "Failed to submit application" }, 500);
  }
});

/**
 * Get BD Partner's applications
 * GET /api/products/my-applications
 */
app.get("/my-applications", async (c) => {
  const authCheck = await withAuth(c.req.raw);
  if (authCheck) return authCheck;

  const userProfile = (c.req.raw as any).userProfile;

  if (!userProfile?.userType.startsWith('bd_partner')) {
    return c.json({ error: "Only BD Partners can view applications" }, 403);
  }

  try {
    const applications = await db.select({
      id: bdPartnerApplication.id,
      applicationStatus: bdPartnerApplication.applicationStatus,
      applicationMessage: bdPartnerApplication.applicationMessage,
      companyResponse: bdPartnerApplication.companyResponse,
      createdAt: bdPartnerApplication.createdAt,
      productName: product.name,
      productType: product.productType,
      shortDescription: product.shortDescription
    })
    .from(bdPartnerApplication)
    .innerJoin(product, eq(bdPartnerApplication.productId, product.id))
    .where(eq(bdPartnerApplication.bdPartnerProfileId, userProfile.id));

    return c.json({ applications });
  } catch (error) {
    console.error("Applications fetch error:", error);
    return c.json({ error: "Failed to fetch applications" }, 500);
  }
});

export default app;
