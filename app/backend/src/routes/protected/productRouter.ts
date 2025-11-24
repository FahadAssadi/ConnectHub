import { Hono } from 'hono'
import { auth } from '@/lib/auth';
import { ProductController } from '@/controllers/product/ProductController';

const productController = new ProductController();

export const productRouter = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null
  }
}>()

// ==================== PRODUCT ROUTES ====================

// Create a new product
productRouter.post('/:companyId', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { companyId } = c.req.param();
    const body = await c.req.json();
    const result = await productController.createProduct({companyId: companyId, ...body});
    
    if ('error' in result) {
      return c.json(result, 400);
    }
    
    return c.json(result, 201);
  } catch (error) {
    console.error('Error creating product:', error);
    return c.json({ error: 'Failed to create product' }, 500);
  }
});

// Get product by ID with complete details
productRouter.get('/:productId', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { productId } = c.req.param();
    const result = await productController.getCompleteProduct({ productId });
    
    if ('error' in result) {
      return c.json(result, 404);
    }
    
    return c.json(result);
  } catch (error) {
    console.error('Error fetching product:', error);
    return c.json({ error: 'Failed to fetch product' }, 500);
  }
});

// Update product
productRouter.put('/:productId', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { productId } = c.req.param();
    const updates = await c.req.json();
    const result = await productController.updateProduct({ productId, updates });
    
    if ('error' in result) {
      return c.json(result, 400);
    }
    
    return c.json(result);
  } catch (error) {
    console.error('Error updating product:', error);
    return c.json({ error: 'Failed to update product' }, 500);
  }
});

// Delete product
productRouter.delete('/:productId', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { productId } = c.req.param();
    const result = await productController.deleteProduct({ productId });
    
    if ('error' in result) {
      return c.json(result, 404);
    }
    
    return c.json(result);
  } catch (error) {
    console.error('Error deleting product:', error);
    return c.json({ error: 'Failed to delete product' }, 500);
  }
});

// Get products by company
productRouter.get('/company/:companyId', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { companyId } = c.req.param();
    const activeOnly = c.req.query('activeOnly') === 'true';
    const result = await productController.getProductsByCompany({ companyId, activeOnly });
    
    if ('error' in result) {
      return c.json(result, 400);
    }
    
    return c.json(result);
  } catch (error) {
    console.error('Error fetching company products:', error);
    return c.json({ error: 'Failed to fetch company products' }, 500);
  }
});

// Search products
productRouter.get('/search/:searchTerm', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { searchTerm } = c.req.param();
    const companyId = c.req.query('companyId');
    const publishedOnly = c.req.query('publishedOnly') === 'true';
    const limit = parseInt(c.req.query('limit') || '20');
    
    const result = await productController.searchProducts({ 
      searchTerm, 
      companyId, 
      publishedOnly, 
      limit 
    });
    
    if (result.error) {
      return c.json(result, 400);
    }
    
    return c.json(result);
  } catch (error) {
    console.error('Error searching products:', error);
    return c.json({ error: 'Failed to search products' }, 500);
  }
});

// Get products by industry
productRouter.get('/industry/:industryId', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const industrySpecializationId = parseInt(c.req.param('industryId'));
    const publishedOnly = c.req.query('publishedOnly') !== 'false'; // default true
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = parseInt(c.req.query('offset') || '0');
    
    const result = await productController.getProductsByIndustry({ 
      industrySpecializationId, 
      publishedOnly, 
      limit, 
      offset 
    });
    
    if (result.error) {
      return c.json(result, 400);
    }
    
    return c.json(result);
  } catch (error) {
    console.error('Error fetching products by industry:', error);
    return c.json({ error: 'Failed to fetch products by industry' }, 500);
  }
});

// Toggle product active status
productRouter.patch('/:productId/status', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { productId } = c.req.param();
    const { isActive } = await c.req.json();
    const result = await productController.toggleProductStatus({ productId, isActive });
    
    if (result.error) {
      return c.json(result, 400);
    }
    
    return c.json(result);
  } catch (error) {
    console.error('Error toggling product status:', error);
    return c.json({ error: 'Failed to toggle product status' }, 500);
  }
});

// Publish/unpublish product
productRouter.patch('/:productId/publish', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { productId } = c.req.param();
    const { isPublished } = await c.req.json();
    const result = await productController.publishProduct({ productId, isPublished });
    
    if (result.error) {
      return c.json(result, 400);
    }
    
    return c.json(result);
  } catch (error) {
    console.error('Error publishing product:', error);
    return c.json({ error: 'Failed to publish product' }, 500);
  }
});

// ==================== PRODUCT PRIMARY REGIONS ROUTES ====================

// Add primary region to product
productRouter.post('/:productId/regions', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { productId } = c.req.param();
    const regionData = await c.req.json();
    const result = await productController.addProductPrimaryRegion({ productId, ...regionData });
    
    if (result.error) {
      return c.json(result, 400);
    }
    
    return c.json(result, 201);
  } catch (error) {
    console.error('Error adding product primary region:', error);
    return c.json({ error: 'Failed to add product primary region' }, 500);
  }
});

// Get product primary regions
productRouter.get('/:productId/regions', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { productId } = c.req.param();
    const result = await productController.getProductPrimaryRegions({ productId });
    
    if (result.error) {
      return c.json(result, 400);
    }
    
    return c.json(result);
  } catch (error) {
    console.error('Error fetching product primary regions:', error);
    return c.json({ error: 'Failed to fetch product primary regions' }, 500);
  }
});

// Remove primary region from product
productRouter.delete('/regions/:primaryRegionId', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { primaryRegionId } = c.req.param();
    const result = await productController.removeProductPrimaryRegion({ primaryRegionId });
    
    if (result.error) {
      return c.json(result, 404);
    }
    
    return c.json(result);
  } catch (error) {
    console.error('Error removing product primary region:', error);
    return c.json({ error: 'Failed to remove product primary region' }, 500);
  }
});

// ==================== PRODUCT ENGAGEMENT METHODS ROUTES ====================

// Add engagement method to product
productRouter.post('/:productId/engagement-methods', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { productId } = c.req.param();
    const { engagementModelId } = await c.req.json();
    const result = await productController.addProductEngagementMethod({ productId, engagementModelId });
    
    if (result.error) {
      return c.json(result, 400);
    }
    
    return c.json(result, 201);
  } catch (error) {
    console.error('Error adding product engagement method:', error);
    return c.json({ error: 'Failed to add product engagement method' }, 500);
  }
});

// Get product engagement methods
productRouter.get('/:productId/engagement-methods', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { productId } = c.req.param();
    const result = await productController.getProductEngagementMethods({ productId });
    
    if (result.error) {
      return c.json(result, 400);
    }
    
    return c.json(result);
  } catch (error) {
    console.error('Error fetching product engagement methods:', error);
    return c.json({ error: 'Failed to fetch product engagement methods' }, 500);
  }
});

// Remove engagement method from product
productRouter.delete('/engagement-methods/:engagementMethodId', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { engagementMethodId } = c.req.param();
    const result = await productController.removeProductEngagementMethod({ engagementMethodId });
    
    if (result.error) {
      return c.json(result, 404);
    }
    
    return c.json(result);
  } catch (error) {
    console.error('Error removing product engagement method:', error);
    return c.json({ error: 'Failed to remove product engagement method' }, 500);
  }
});

// ==================== PRODUCT PREFERRED BD PARTNERS ROUTES ====================

// Add preferred BD partner to product
productRouter.post('/:productId/preferred-partners', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { productId } = c.req.param();
    const { industrySpecializationId } = await c.req.json();
    const result = await productController.addProductPreferredBdPartner({ productId, industrySpecializationId });
    
    if (result.error) {
      return c.json(result, 400);
    }
    
    return c.json(result, 201);
  } catch (error) {
    console.error('Error adding product preferred BD partner:', error);
    return c.json({ error: 'Failed to add product preferred BD partner' }, 500);
  }
});

// Get product preferred BD partners
productRouter.get('/:productId/preferred-partners', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { productId } = c.req.param();
    const result = await productController.getProductPreferredBdPartners({ productId });
    
    if (result.error) {
      return c.json(result, 400);
    }
    
    return c.json(result);
  } catch (error) {
    console.error('Error fetching product preferred BD partners:', error);
    return c.json({ error: 'Failed to fetch product preferred BD partners' }, 500);
  }
});

// Remove preferred BD partner from product
productRouter.delete('/preferred-partners/:preferredBdPartnerId', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { preferredBdPartnerId } = c.req.param();
    const result = await productController.removeProductPreferredBdPartner({ preferredBdPartnerId });
    
    if (result.error) {
      return c.json(result, 404);
    }
    
    return c.json(result);
  } catch (error) {
    console.error('Error removing product preferred BD partner:', error);
    return c.json({ error: 'Failed to remove product preferred BD partner' }, 500);
  }
});

// ==================== PRODUCT DOCUMENTS ROUTES ====================

// Create product document
productRouter.post('/:productId/documents', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { productId } = c.req.param();
    const documentData = await c.req.json();
    const result = await productController.createProductDocument({ productId, ...documentData });
    
    if (result.error) {
      return c.json(result, 400);
    }
    
    return c.json(result, 201);
  } catch (error) {
    console.error('Error creating product document:', error);
    return c.json({ error: 'Failed to create product document' }, 500);
  }
});

// Get product documents
productRouter.get('/:productId/documents', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { productId } = c.req.param();
    const activeOnly = c.req.query('activeOnly') === 'true';
    const result = await productController.getProductDocuments({ productId, activeOnly });
    
    if (result.error) {
      return c.json(result, 400);
    }
    
    return c.json(result);
  } catch (error) {
    console.error('Error fetching product documents:', error);
    return c.json({ error: 'Failed to fetch product documents' }, 500);
  }
});

// Get product documents by type
productRouter.get('/:productId/documents/:documentType', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { productId, documentType } = c.req.param();
    const activeOnly = c.req.query('activeOnly') === 'true';
    const result = await productController.getProductDocumentsByType({ productId, documentType, activeOnly });
    
    if (result.error) {
      return c.json(result, 400);
    }
    
    return c.json(result);
  } catch (error) {
    console.error('Error fetching product documents by type:', error);
    return c.json({ error: 'Failed to fetch product documents by type' }, 500);
  }
});

// Update product document
productRouter.put('/documents/:documentId', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { documentId } = c.req.param();
    const updates = await c.req.json();
    const result = await productController.updateProductDocument({ documentId, updates });
    
    if (result.error) {
      return c.json(result, 400);
    }
    
    return c.json(result);
  } catch (error) {
    console.error('Error updating product document:', error);
    return c.json({ error: 'Failed to update product document' }, 500);
  }
});

// Delete product document
productRouter.delete('/documents/:documentId', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { documentId } = c.req.param();
    const result = await productController.deleteProductDocument({ documentId });
    
    if (result.error) {
      return c.json(result, 404);
    }
    
    return c.json(result);
  } catch (error) {
    console.error('Error deleting product document:', error);
    return c.json({ error: 'Failed to delete product document' }, 500);
  }
});
