import { Hono } from 'hono';
import { db } from '../../db';
import { 
  expressionsOfInterest,
  companyBdpRequirements,
  bdpOpportunityPreferences,
  eoiMatchingScores,
  eoiCommunications
} from '../../db/schema/eoi-system';
import { bdPartners } from '../../db/schema/bd-partners';
import { companies } from '../../db/schema/companies';
import { products } from '../../db/schema/products';
import { eq, and, or, desc, gte, lte, isNull } from 'drizzle-orm';
import { z } from 'zod';
import EOIMatchingService from '../../services/eoi-matching';

const eoiRouter = new Hono();

// Validation schemas
const createEOISchema = z.object({
  initiatorType: z.enum(['bd_partner', 'company']),
  eoiType: z.enum(['general_partnership', 'specific_product', 'industry_expertise', 'regional_expansion']),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  objectives: z.string().optional(),
  proposedCommissionRate: z.number().min(0).max(100).optional(),
  expectedDealSize: z.enum(['under_10k', '10k_50k', '50k_100k', '100k_500k', '500k_1m', 'over_1m']).optional(),
  timeline: z.string().optional(),
  exclusivity: z.boolean().default(false),
  targetRegions: z.array(z.string()).optional(),
  targetIndustries: z.array(z.string()).optional(),
  targetCustomerTypes: z.array(z.string()).optional(),
  additionalRequirements: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
  productId: z.string().uuid().optional(),
});

const updateEOISchema = createEOISchema.partial();

const respondToEOISchema = z.object({
  status: z.enum(['accepted', 'rejected']),
  responseMessage: z.string().min(10, 'Response message must be at least 10 characters'),
});

const searchEOISchema = z.object({
  initiatorType: z.enum(['bd_partner', 'company']).optional(),
  eoiType: z.enum(['general_partnership', 'specific_product', 'industry_expertise', 'regional_expansion']).optional(),
  status: z.string().optional(),
  industry: z.string().optional(),
  region: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// POST /api/eoi/create
eoiRouter.post('/create', async (c) => {
  try {
    const body = await c.req.json();
    const userId = c.req.header('X-User-ID'); // Assuming user ID is passed in header
    
    if (!userId) {
      return c.json({ error: 'User authentication required' }, 401);
    }

    const eoiData = createEOISchema.parse(body);

    // Determine the creator based on initiator type
    let bdPartnerId: string | null = null;
    let companyId: string | null = null;

    if (eoiData.initiatorType === 'bd_partner') {
      const bdPartner = await db.query.bdPartners.findFirst({
        where: eq(bdPartners.userId, userId),
      });
      if (!bdPartner) {
        return c.json({ error: 'BD Partner profile not found' }, 404);
      }
      bdPartnerId = bdPartner.id;
    } else {
      const company = await db.query.companies.findFirst({
        where: eq(companies.userId, userId),
      });
      if (!company) {
        return c.json({ error: 'Company profile not found' }, 404);
      }
      companyId = company.id;
    }

    // Validate product if specified
    if (eoiData.productId) {
      const product = await db.query.products.findFirst({
        where: eq(products.id, eoiData.productId),
      });
      if (!product) {
        return c.json({ error: 'Product not found' }, 404);
      }
      if (eoiData.initiatorType === 'company' && product.companyId !== companyId) {
        return c.json({ error: 'You can only create EOIs for your own products' }, 403);
      }
    }

    // Create the EOI
    const newEOI = await db.insert(expressionsOfInterest).values({
      bdPartnerId,
      companyId,
      productId: eoiData.productId || null,
      initiatorType: eoiData.initiatorType,
      eoiType: eoiData.eoiType,
      title: eoiData.title,
      description: eoiData.description,
      priority: eoiData.priority,
      objectives: eoiData.objectives,
      proposedCommissionRate: eoiData.proposedCommissionRate?.toString(),
      expectedDealSize: eoiData.expectedDealSize,
      timeline: eoiData.timeline,
      exclusivity: eoiData.exclusivity,
      targetRegions: eoiData.targetRegions ? JSON.stringify(eoiData.targetRegions) : null,
      targetIndustries: eoiData.targetIndustries ? JSON.stringify(eoiData.targetIndustries) : null,
      targetCustomerTypes: eoiData.targetCustomerTypes ? JSON.stringify(eoiData.targetCustomerTypes) : null,
      additionalRequirements: eoiData.additionalRequirements,
      expiresAt: eoiData.expiresAt ? new Date(eoiData.expiresAt) : null,
      status: 'draft',
    }).returning();

    // Find potential matches using the matching service
    if (eoiData.initiatorType === 'company') {
      // Company is looking for BD Partners
      setTimeout(async () => {
        try {
          const matches = await EOIMatchingService.findPotentialBdPartners(newEOI[0].id);
          console.log(`Found ${matches.length} potential BD Partner matches for EOI ${newEOI[0].id}`);
        } catch (error) {
          console.error('Error finding BD Partner matches:', error);
        }
      }, 1000); // Run matching asynchronously
    }

    return c.json({
      success: true,
      data: newEOI[0],
      message: 'EOI created successfully',
    }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        error: 'Validation failed',
        details: error.issues,
      }, 400);
    }

    console.error('Error creating EOI:', error);
    return c.json({ error: 'Failed to create EOI' }, 500);
  }
});

// GET /api/eoi/search
eoiRouter.get('/search', async (c) => {
  try {
    const query = c.req.query();
    const searchParams = searchEOISchema.parse({
      ...query,
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 20,
    });

    const { initiatorType, eoiType, status, industry, region, page, limit } = searchParams;
    const offset = (page - 1) * limit;

    let whereConditions = [
      or(
        eq(expressionsOfInterest.status, 'sent'),
        eq(expressionsOfInterest.status, 'under_review')
      )!,
      or(
        isNull(expressionsOfInterest.expiresAt),
        gte(expressionsOfInterest.expiresAt, new Date())
      )!,
    ];

    if (initiatorType) {
      whereConditions.push(eq(expressionsOfInterest.initiatorType, initiatorType));
    }

    if (eoiType) {
      whereConditions.push(eq(expressionsOfInterest.eoiType, eoiType));
    }

    if (status) {
      whereConditions.push(eq(expressionsOfInterest.status, status as any));
    }

    const eois = await db.query.expressionsOfInterest.findMany({
      where: and(...whereConditions),
      limit,
      offset,
      orderBy: desc(expressionsOfInterest.createdAt),
      with: {
        bdPartner: {
          columns: {
            id: true,
            fullName: true,
            displayName: true,
            country: true,
            averageRating: true,
          },
        },
        company: {
          columns: {
            id: true,
            companyName: true,
            industry: true,
            country: true,
          },
        },
        product: {
          columns: {
            id: true,
            name: true,
            type: true,
            shortDescription: true,
          },
        },
      },
    });

    return c.json({
      success: true,
      data: {
        eois,
        pagination: {
          page,
          limit,
          total: eois.length, // TODO: Add proper count query
          pages: Math.ceil(eois.length / limit),
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        error: 'Invalid search parameters',
        details: error.issues,
      }, 400);
    }

    console.error('Error searching EOIs:', error);
    return c.json({ error: 'Failed to search EOIs' }, 500);
  }
});

// GET /api/eoi/:id
eoiRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const eoi = await db.query.expressionsOfInterest.findFirst({
      where: eq(expressionsOfInterest.id, id),
      with: {
        bdPartner: true,
        company: true,
        product: true,
      },
    });

    if (!eoi) {
      return c.json({ error: 'EOI not found' }, 404);
    }

    // Get matching scores if available
    const matchingScores = await db.query.eoiMatchingScores.findMany({
      where: eq(eoiMatchingScores.eoiId, id),
      orderBy: desc(eoiMatchingScores.overallScore),
    });

    // Get communications
    const communications = await db.query.eoiCommunications.findMany({
      where: eq(eoiCommunications.eoiId, id),
      orderBy: desc(eoiCommunications.createdAt),
    });

    return c.json({
      success: true,
      data: {
        ...eoi,
        matchingScores,
        communications,
      },
    });
  } catch (error) {
    console.error('Error getting EOI:', error);
    return c.json({ error: 'Failed to get EOI' }, 500);
  }
});

// PUT /api/eoi/:id
eoiRouter.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const userId = c.req.header('X-User-ID');

    if (!userId) {
      return c.json({ error: 'User authentication required' }, 401);
    }

    const updateData = updateEOISchema.parse(body);

    // Check if user owns this EOI
    const existingEOI = await db.query.expressionsOfInterest.findFirst({
      where: eq(expressionsOfInterest.id, id),
    });

    if (!existingEOI) {
      return c.json({ error: 'EOI not found' }, 404);
    }

    // Verify ownership
    let isOwner = false;
    if (existingEOI.initiatorType === 'bd_partner' && existingEOI.bdPartnerId) {
      const bdPartner = await db.query.bdPartners.findFirst({
        where: and(eq(bdPartners.id, existingEOI.bdPartnerId), eq(bdPartners.userId, userId)),
      });
      isOwner = !!bdPartner;
    } else if (existingEOI.initiatorType === 'company' && existingEOI.companyId) {
      const company = await db.query.companies.findFirst({
        where: and(eq(companies.id, existingEOI.companyId), eq(companies.userId, userId)),
      });
      isOwner = !!company;
    }

    if (!isOwner) {
      return c.json({ error: 'You can only update your own EOIs' }, 403);
    }

    // Update the EOI
    const updatedEOI = await db
      .update(expressionsOfInterest)
      .set({
        ...updateData,
        targetRegions: updateData.targetRegions ? JSON.stringify(updateData.targetRegions) : undefined,
        targetIndustries: updateData.targetIndustries ? JSON.stringify(updateData.targetIndustries) : undefined,
        targetCustomerTypes: updateData.targetCustomerTypes ? JSON.stringify(updateData.targetCustomerTypes) : undefined,
        proposedCommissionRate: updateData.proposedCommissionRate?.toString(),
        expiresAt: updateData.expiresAt ? new Date(updateData.expiresAt) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(expressionsOfInterest.id, id))
      .returning();

    return c.json({
      success: true,
      data: updatedEOI[0],
      message: 'EOI updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        error: 'Validation failed',
        details: error.issues,
      }, 400);
    }

    console.error('Error updating EOI:', error);
    return c.json({ error: 'Failed to update EOI' }, 500);
  }
});

// POST /api/eoi/:id/respond
eoiRouter.post('/:id/respond', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const userId = c.req.header('X-User-ID');

    if (!userId) {
      return c.json({ error: 'User authentication required' }, 401);
    }

    const responseData = respondToEOISchema.parse(body);

    // Get the EOI
    const eoi = await db.query.expressionsOfInterest.findFirst({
      where: eq(expressionsOfInterest.id, id),
    });

    if (!eoi) {
      return c.json({ error: 'EOI not found' }, 404);
    }

    if (!['sent', 'under_review'].includes(eoi.status)) {
      return c.json({ error: 'EOI is not available for response' }, 400);
    }

    // Verify user can respond to this EOI (not the initiator)
    let canRespond = false;
    if (eoi.initiatorType === 'bd_partner') {
      // Company can respond to BD Partner EOI
      const company = await db.query.companies.findFirst({
        where: eq(companies.userId, userId),
      });
      canRespond = !!company;
    } else {
      // BD Partner can respond to Company EOI
      const bdPartner = await db.query.bdPartners.findFirst({
        where: eq(bdPartners.userId, userId),
      });
      canRespond = !!bdPartner;
    }

    if (!canRespond) {
      return c.json({ error: 'You cannot respond to this EOI' }, 403);
    }

    // Update the EOI with response
    const updatedEOI = await db
      .update(expressionsOfInterest)
      .set({
        status: responseData.status,
        responseMessage: responseData.responseMessage,
        responseDate: new Date(),
        reviewedBy: userId,
        updatedAt: new Date(),
      })
      .where(eq(expressionsOfInterest.id, id))
      .returning();

    // Create communication record
    await db.insert(eoiCommunications).values({
      eoiId: id,
      fromUserId: userId,
      toUserId: eoi.initiatorType === 'bd_partner' ? 
        (await db.query.bdPartners.findFirst({ where: eq(bdPartners.id, eoi.bdPartnerId!) }))?.userId || '' :
        (await db.query.companies.findFirst({ where: eq(companies.id, eoi.companyId!) }))?.userId || '',
      subject: `EOI ${responseData.status}: ${eoi.title}`,
      message: responseData.responseMessage,
      messageType: responseData.status === 'accepted' ? 'acceptance' : 'rejection',
    });

    return c.json({
      success: true,
      data: updatedEOI[0],
      message: `EOI ${responseData.status} successfully`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        error: 'Validation failed',
        details: error.issues,
      }, 400);
    }

    console.error('Error responding to EOI:', error);
    return c.json({ error: 'Failed to respond to EOI' }, 500);
  }
});

// POST /api/eoi/:id/send
eoiRouter.post('/:id/send', async (c) => {
  try {
    const id = c.req.param('id');
    const userId = c.req.header('X-User-ID');

    if (!userId) {
      return c.json({ error: 'User authentication required' }, 401);
    }

    // Get the EOI and verify ownership
    const eoi = await db.query.expressionsOfInterest.findFirst({
      where: eq(expressionsOfInterest.id, id),
    });

    if (!eoi) {
      return c.json({ error: 'EOI not found' }, 404);
    }

    if (eoi.status !== 'draft') {
      return c.json({ error: 'Only draft EOIs can be sent' }, 400);
    }

    // Verify ownership (same logic as update)
    let isOwner = false;
    if (eoi.initiatorType === 'bd_partner' && eoi.bdPartnerId) {
      const bdPartner = await db.query.bdPartners.findFirst({
        where: and(eq(bdPartners.id, eoi.bdPartnerId), eq(bdPartners.userId, userId)),
      });
      isOwner = !!bdPartner;
    } else if (eoi.initiatorType === 'company' && eoi.companyId) {
      const company = await db.query.companies.findFirst({
        where: and(eq(companies.id, eoi.companyId), eq(companies.userId, userId)),
      });
      isOwner = !!company;
    }

    if (!isOwner) {
      return c.json({ error: 'You can only send your own EOIs' }, 403);
    }

    // Update status to sent
    const updatedEOI = await db
      .update(expressionsOfInterest)
      .set({
        status: 'sent',
        updatedAt: new Date(),
      })
      .where(eq(expressionsOfInterest.id, id))
      .returning();

    return c.json({
      success: true,
      data: updatedEOI[0],
      message: 'EOI sent successfully',
    });
  } catch (error) {
    console.error('Error sending EOI:', error);
    return c.json({ error: 'Failed to send EOI' }, 500);
  }
});

// GET /api/eoi/my/sent
eoiRouter.get('/my/sent', async (c) => {
  try {
    const userId = c.req.header('X-User-ID');

    if (!userId) {
      return c.json({ error: 'User authentication required' }, 401);
    }

    // Get user's EOIs based on their type
    let eois: any[] = [];

    // Check if user is BD Partner
    const bdPartner = await db.query.bdPartners.findFirst({
      where: eq(bdPartners.userId, userId),
    });

    if (bdPartner) {
      eois = await db.query.expressionsOfInterest.findMany({
        where: eq(expressionsOfInterest.bdPartnerId, bdPartner.id),
        orderBy: desc(expressionsOfInterest.createdAt),
        with: {
          company: {
            columns: {
              id: true,
              companyName: true,
              industry: true,
            },
          },
          product: {
            columns: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      });
    } else {
      // Check if user is Company
      const company = await db.query.companies.findFirst({
        where: eq(companies.userId, userId),
      });

      if (company) {
        eois = await db.query.expressionsOfInterest.findMany({
          where: eq(expressionsOfInterest.companyId, company.id),
          orderBy: desc(expressionsOfInterest.createdAt),
          with: {
            bdPartner: {
              columns: {
                id: true,
                fullName: true,
                displayName: true,
                country: true,
              },
            },
            product: {
              columns: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        });
      }
    }

    return c.json({
      success: true,
      data: eois,
    });
  } catch (error) {
    console.error('Error getting user EOIs:', error);
    return c.json({ error: 'Failed to get your EOIs' }, 500);
  }
});

// GET /api/eoi/my/received
eoiRouter.get('/my/received', async (c) => {
  try {
    const userId = c.req.header('X-User-ID');

    if (!userId) {
      return c.json({ error: 'User authentication required' }, 401);
    }

    // Get EOIs where user can respond (opposite of initiator type)
    let eois: any[] = [];

    // Check if user is BD Partner (can respond to Company EOIs)
    const bdPartner = await db.query.bdPartners.findFirst({
      where: eq(bdPartners.userId, userId),
    });

    if (bdPartner) {
      eois = await db.query.expressionsOfInterest.findMany({
        where: and(
          eq(expressionsOfInterest.initiatorType, 'company'),
          or(
            eq(expressionsOfInterest.status, 'sent'),
            eq(expressionsOfInterest.status, 'under_review')
          )!
        ),
        orderBy: desc(expressionsOfInterest.createdAt),
        with: {
          company: {
            columns: {
              id: true,
              companyName: true,
              industry: true,
            },
          },
          product: {
            columns: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      });
    } else {
      // Check if user is Company (can respond to BD Partner EOIs)
      const company = await db.query.companies.findFirst({
        where: eq(companies.userId, userId),
      });

      if (company) {
        eois = await db.query.expressionsOfInterest.findMany({
          where: and(
            eq(expressionsOfInterest.initiatorType, 'bd_partner'),
            or(
              eq(expressionsOfInterest.status, 'sent'),
              eq(expressionsOfInterest.status, 'under_review')
            )!
          ),
          orderBy: desc(expressionsOfInterest.createdAt),
          with: {
            bdPartner: {
              columns: {
                id: true,
                fullName: true,
                displayName: true,
                country: true,
              },
            },
            product: {
              columns: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        });
      }
    }

    return c.json({
      success: true,
      data: eois,
    });
  } catch (error) {
    console.error('Error getting received EOIs:', error);
    return c.json({ error: 'Failed to get received EOIs' }, 500);
  }
});

export default eoiRouter;
