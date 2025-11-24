import { Hono } from "hono";
import { db } from "@/db";
import { bdPartnerProductInterests, partnerships } from "@/db/schema/relationships-schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";

export const relationshipRouter = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null
  }
}>()

// -----------------------------
// 1. Apply to a product
// -----------------------------
relationshipRouter.post("/apply", async (c) => {
  const { bdPartnerId, productId } = await c.req.json();

  const interestId = nanoid();

  await db.insert(bdPartnerProductInterests).values({
    id: interestId,
    bdPartnerId,
    productId,
    interestLevel: "applied",
    applicationStatus: "pending",
    appliedAt: new Date(),
  });

  return c.json({ success: true, interestId });
});

// -----------------------------
// 2. Update application status (review, approve, reject)
// -----------------------------
relationshipRouter.post("/applications/:id/status", async (c) => {
  const interestId = c.req.param("id");
  const { applicationStatus, reviewedBy, notes } = await c.req.json();

  await db
    .update(bdPartnerProductInterests)
    .set({
      applicationStatus, // ✅ correct field
      reviewedBy,
      reviewedAt: new Date(),
      notes,
    })
    .where(eq(bdPartnerProductInterests.id, interestId));

  return c.json({ success: true });
});

// -----------------------------
// 3. Approve → create partnership
// -----------------------------
relationshipRouter.post("/applications/:id/approve", async (c) => {
  const interestId = c.req.param("id");
  const { engagementModelId, incentiveMethodId, commissionRate, fixedFeeAmount, minimumCommitment } = await c.req.json();

  // Get interest + product/company info
  const [interest] = await db
    .select()
    .from(bdPartnerProductInterests)
    .where(eq(bdPartnerProductInterests.id, interestId));

  if (!interest) {
    return c.json({ success: false, error: "Interest not found" }, 404);
  }

  // Update application status → approved
  await db
    .update(bdPartnerProductInterests)
    .set({
      applicationStatus: "approved",
      reviewedAt: new Date(),
    })
    .where(eq(bdPartnerProductInterests.id, interestId));

  // Create partnership
  const partnershipId = nanoid();
  await db.insert(partnerships).values({
    id: partnershipId,
    companyId: interest.productId, // ⚠️ adjust if you store companyId differently
    bdPartnerId: interest.bdPartnerId,
    productId: interest.productId,
    partnershipType: "product_specific",
    status: "active", // ✅ field belongs to partnerships
    engagementModelId,
    incentiveMethodId,
    commissionRate,
    fixedFeeAmount,
    minimumCommitment,
  });

  return c.json({ success: true, partnershipId });
});

// -----------------------------
// 4. View all applications for a BD Partner
// -----------------------------
relationshipRouter.get("/applications", async (c) => {
  const bdPartner = c.get('user');

  if (!bdPartner?.id) {
    return c.json({ success: false, error: "bdPartnerId is required" }, 400);
  }

  const applications = await db
    .select()
    .from(bdPartnerProductInterests)
    .where(eq(bdPartnerProductInterests.bdPartnerId, bdPartner.id));

  

  return c.json({ applications });
});

relationshipRouter.get("/product/:productId/applications", async (c) => {
  const productId = c.req.param("productId");

  if (!productId) {
    return c.json({ success: false, error: "productId is required" }, 400);
  }

  const applications = await db
    .select()
    .from(bdPartnerProductInterests)
    .where(eq(bdPartnerProductInterests.productId, productId));

  return c.json({ success: true, applications });
});