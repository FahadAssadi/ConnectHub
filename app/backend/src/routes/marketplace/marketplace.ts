import { Hono } from 'hono';
import { db } from '../../db';
import { 
  bdPartners, 
  bdPartnerExpertise, 
  bdPartnerMarketAccess,
  bdPartnerCategories 
} from '../../db/schema/bd-partners';
import { 
  companies,
  companyLocations 
} from '../../db/schema/companies';
import { 
  products, 
  productMaterials 
} from '../../db/schema/products';
import { 
  bdpProductPartnerships 
} from '../../db/schema/partnerships';
import { eq, and, or, like, desc, asc, count } from 'drizzle-orm';
import { z } from 'zod';

const marketplaceRouter = new Hono();

// Search schema
const searchSchema = z.object({
  q: z.string().optional(),
  type: z.enum(['bd_partners', 'companies', 'products']).optional(),
  industry: z.string().optional(),
  region: z.string().optional(),
  availability: z.string().optional(),
  expertise: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// GET /api/marketplace/search
marketplaceRouter.get('/search', async (c) => {
  try {
    const query = c.req.query();
    const searchParams = searchSchema.parse({
      ...query,
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 20,
    });

    const { q, type, industry, region, availability, expertise, page, limit, sortBy, sortOrder } = searchParams;
    const offset = (page - 1) * limit;

    let results: any[] = [];
    let totalCount = 0;

    if (!type || type === 'bd_partners') {
      const bdPartnerResults = await searchBdPartners({
        q, industry, region, availability, expertise, offset, limit, sortBy, sortOrder
      });
      
      if (!type) {
        results.push(...bdPartnerResults.data.map(item => ({ ...item, type: 'bd_partner' })));
        totalCount += bdPartnerResults.total;
      } else {
        results = bdPartnerResults.data;
        totalCount = bdPartnerResults.total;
      }
    }

    if (!type || type === 'companies') {
      const companyResults = await searchCompanies({
        q, industry, region, offset, limit, sortBy, sortOrder
      });
      
      if (!type) {
        results.push(...companyResults.data.map(item => ({ ...item, type: 'company' })));
        totalCount += companyResults.total;
      } else {
        results = companyResults.data;
        totalCount = companyResults.total;
      }
    }

    if (!type || type === 'products') {
      const productResults = await searchProducts({
        q, industry, region, offset, limit, sortBy, sortOrder
      });
      
      if (!type) {
        results.push(...productResults.data.map(item => ({ ...item, type: 'product' })));
        totalCount += productResults.total;
      } else {
        results = productResults.data;
        totalCount = productResults.total;
      }
    }

    // If searching across all types, sort the combined results
    if (!type) {
      results.sort((a, b) => {
        if (sortOrder === 'desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      
      // Limit the combined results
      results = results.slice(offset, offset + limit);
    }

    return c.json({
      success: true,
      data: {
        results,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit),
        },
        filters: {
          type,
          industry,
          region,
          availability,
          expertise,
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

    console.error('Search error:', error);
    return c.json({ error: 'Failed to search marketplace' }, 500);
  }
});

// GET /api/marketplace/bd-partners/:id
marketplaceRouter.get('/bd-partners/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const bdPartner = await db.query.bdPartners.findFirst({
      where: and(
        eq(bdPartners.id, id),
        eq(bdPartners.isActive, true),
        eq(bdPartners.isPublicProfile, true)
      ),
    });

    if (!bdPartner) {
      return c.json({ error: 'BD Partner not found' }, 404);
    }

    // Get additional data
    const [expertiseData, marketAccess, categories] = await Promise.all([
      db.query.bdPartnerExpertise.findMany({
        where: eq(bdPartnerExpertise.bdPartnerId, id),
      }),
      db.query.bdPartnerMarketAccess.findMany({
        where: eq(bdPartnerMarketAccess.bdPartnerId, id),
      }),
      db.query.bdPartnerCategories.findMany({
        where: eq(bdPartnerCategories.bdPartnerId, id),
      }),
    ]);

    return c.json({
      success: true,
      data: {
        ...bdPartner,
        expertise: expertiseData,
        marketAccess,
        categories,
      },
    });
  } catch (error) {
    console.error('Error getting BD Partner:', error);
    return c.json({ error: 'Failed to get BD Partner' }, 500);
  }
});

// GET /api/marketplace/companies/:id
marketplaceRouter.get('/companies/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const company = await db.query.companies.findFirst({
      where: and(
        eq(companies.id, id),
        eq(companies.isActive, true)
      ),
    });

    if (!company) {
      return c.json({ error: 'Company not found' }, 404);
    }

    // Get additional data
    const [locations, companyProducts] = await Promise.all([
      db.query.companyLocations.findMany({
        where: eq(companyLocations.companyId, id),
      }),
      db.query.products.findMany({
        where: and(
          eq(products.companyId, id),
          eq(products.status, 'active'),
          eq(products.isVisibleToBdps, true)
        ),
      }),
    ]);

    return c.json({
      success: true,
      data: {
        ...company,
        locations,
        products: companyProducts,
      },
    });
  } catch (error) {
    console.error('Error getting company:', error);
    return c.json({ error: 'Failed to get company' }, 500);
  }
});

// GET /api/marketplace/products/:id
marketplaceRouter.get('/products/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const product = await db.query.products.findFirst({
      where: and(
        eq(products.id, id),
        eq(products.status, 'active'),
        eq(products.isVisibleToBdps, true)
      ),
    });

    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    // Get additional data
    const [company, materials, partnerships] = await Promise.all([
      db.query.companies.findFirst({
        where: eq(companies.id, product.companyId),
      }),
      db.query.productMaterials.findMany({
        where: and(
          eq(productMaterials.productId, id),
          eq(productMaterials.isActive, true)
        ),
      }),
      db.select({ count: count() })
        .from(bdpProductPartnerships)
        .where(and(
          eq(bdpProductPartnerships.productId, id),
          eq(bdpProductPartnerships.partnershipStatus, 'active')
        )),
    ]);

    return c.json({
      success: true,
      data: {
        ...product,
        company,
        materials,
        partnerCount: partnerships[0]?.count || 0,
      },
    });
  } catch (error) {
    console.error('Error getting product:', error);
    return c.json({ error: 'Failed to get product' }, 500);
  }
});

// GET /api/marketplace/filters
marketplaceRouter.get('/filters', async (c) => {
  try {
    // Get available filter options from the database
    const [industries, regions, availabilities] = await Promise.all([
      // Get unique industries from BD partners and companies
      db.selectDistinct({ industry: bdPartners.metadata }).from(bdPartners),
      db.selectDistinct({ region: bdPartners.country }).from(bdPartners),
      db.selectDistinct({ availability: bdPartners.availability }).from(bdPartners),
    ]);

    // Extract unique values and clean up
    const uniqueIndustries = new Set<string>();
    const uniqueRegions = new Set<string>();
    const uniqueAvailabilities = new Set<string>();

    // Process industries from metadata
    industries.forEach(item => {
      if (item.industry) {
        try {
          const metadata = JSON.parse(item.industry);
          if (metadata.expertise) {
            metadata.expertise.forEach((exp: any) => {
              if (exp.industry) uniqueIndustries.add(exp.industry);
            });
          }
        } catch (e) {
          // Ignore JSON parsing errors
        }
      }
    });

    regions.forEach(item => {
      if (item.region) uniqueRegions.add(item.region);
    });

    availabilities.forEach(item => {
      if (item.availability) uniqueAvailabilities.add(item.availability);
    });

    return c.json({
      success: true,
      data: {
        industries: Array.from(uniqueIndustries).sort(),
        regions: Array.from(uniqueRegions).sort(),
        availabilities: Array.from(uniqueAvailabilities).sort(),
        expertise: [
          'Sales & Business Development',
          'Marketing & Lead Generation',
          'Channel Partnerships',
          'Strategic Alliances',
          'Regional Expansion',
          'Industry Expertise',
          'Technical Sales',
          'Enterprise Sales',
        ],
      },
    });
  } catch (error) {
    console.error('Error getting filters:', error);
    return c.json({ error: 'Failed to get filters' }, 500);
  }
});

// Helper function to search BD Partners
async function searchBdPartners(params: any) {
  const { q, industry, region, availability, expertise, offset, limit, sortBy, sortOrder } = params;
  
  let whereConditions = [
    eq(bdPartners.isActive, true),
    eq(bdPartners.isPublicProfile, true),
    eq(bdPartners.acceptingNewPartnerships, true),
  ];

  if (q) {
    whereConditions.push(
      or(
        like(bdPartners.fullName, `%${q}%`),
        like(bdPartners.bio, `%${q}%`),
        like(bdPartners.professionalBackground, `%${q}%`)
      )!
    );
  }

  if (region) {
    whereConditions.push(eq(bdPartners.country, region));
  }

  if (availability) {
    whereConditions.push(eq(bdPartners.availability, availability as any));
  }

  const orderBy = sortOrder === 'desc' ? desc : asc;
  const sortColumn = sortBy === 'rating' ? bdPartners.averageRating :
                    sortBy === 'experience' ? bdPartners.totalDeals :
                    bdPartners.createdAt;

  const [data, totalResult] = await Promise.all([
    db.query.bdPartners.findMany({
      where: and(...whereConditions),
      limit,
      offset,
      orderBy: orderBy(sortColumn),
    }),
    db.select({ count: count() })
      .from(bdPartners)
      .where(and(...whereConditions)),
  ]);

  return {
    data,
    total: totalResult[0]?.count || 0,
  };
}

// Helper function to search Companies
async function searchCompanies(params: any) {
  const { q, industry, region, offset, limit, sortBy, sortOrder } = params;
  
  let whereConditions = [
    eq(companies.isActive, true),
  ];

  if (q) {
    whereConditions.push(
      or(
        like(companies.companyName, `%${q}%`),
        like(companies.description, `%${q}%`)
      )!
    );
  }

  if (industry) {
    whereConditions.push(eq(companies.industry, industry as any));
  }

  if (region) {
    whereConditions.push(eq(companies.country, region));
  }

  const orderBy = sortOrder === 'desc' ? desc : asc;
  const sortColumn = sortBy === 'name' ? companies.companyName :
                    sortBy === 'size' ? companies.companySize :
                    companies.createdAt;

  const [data, totalResult] = await Promise.all([
    db.query.companies.findMany({
      where: and(...whereConditions),
      limit,
      offset,
      orderBy: orderBy(sortColumn),
    }),
    db.select({ count: count() })
      .from(companies)
      .where(and(...whereConditions)),
  ]);

  return {
    data,
    total: totalResult[0]?.count || 0,
  };
}

// Helper function to search Products
async function searchProducts(params: any) {
  const { q, industry, region, offset, limit, sortBy, sortOrder } = params;
  
  let whereConditions = [
    eq(products.status, 'active'),
    eq(products.isVisibleToBdps, true),
  ];

  if (q) {
    whereConditions.push(
      or(
        like(products.name, `%${q}%`),
        like(products.shortDescription, `%${q}%`),
        like(products.detailedDescription, `%${q}%`)
      )!
    );
  }

  const orderBy = sortOrder === 'desc' ? desc : asc;
  const sortColumn = sortBy === 'name' ? products.name :
                    sortBy === 'type' ? products.type :
                    products.createdAt;

  const [data, totalResult] = await Promise.all([
    db.query.products.findMany({
      where: and(...whereConditions),
      limit,
      offset,
      orderBy: orderBy(sortColumn),
      with: {
        company: {
          columns: {
            id: true,
            companyName: true,
            industry: true,
            country: true,
          },
        },
      },
    }),
    db.select({ count: count() })
      .from(products)
      .where(and(...whereConditions)),
  ]);

  return {
    data,
    total: totalResult[0]?.count || 0,
  };
}

export default marketplaceRouter;