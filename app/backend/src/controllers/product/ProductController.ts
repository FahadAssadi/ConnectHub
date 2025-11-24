import { db } from '@/db';
import { eq, and, desc, asc, like, inArray } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { 
  products, 
  productPrimaryRegions, 
  productEngagementMethods, 
  productPreferredBdPartners, 
  productDocuments 
} from '@/db/schema/product-schema';

export class ProductController {
  // ==================== PRODUCT METHODS ====================

  async createProduct(data: {
    companyId: string;
    name: string;
    productType: string;
    shortDescription?: string;
    detailedDescription?: string;
    productImageUrl?: string;
    industrySpecializationId?: number;
    targetCustomerCategoryId?: string;
    targetCustomerSubCategoryId?: number;
    paymentModel?: string;
    indicativeIncentive?: string;
    salesTrainingAvailable?: boolean;
    internalNotes?: string;
  }) {
    const { companyId, name, productType, ...productData } = data;

    try {
      const result = await db
        .insert(products)
        .values({
          id: nanoid(),
          companyId,
          name,
          productType,
          ...productData,
        })
        .returning();

      return { success: true, product: result[0] };
    } catch (error) {
      console.error('Error creating product:', error);
      return { error: 'Failed to create product' };
    }
  }

  async getProductById(data: { productId: string }) {
    const { productId } = data;

    try {
      const result = await db
        .select()
        .from(products)
        .where(eq(products.id, productId));

      if (result.length === 0) {
        return { error: 'Product not found' };
      }

      return { success: true, product: result[0] };
    } catch (error) {
      console.error('Error fetching product:', error);
      return { error: 'Failed to fetch product' };
    }
  }

  async getProductsByCompany(data: { companyId: string; activeOnly?: boolean }) {
    const { companyId, activeOnly = false } = data;

    try {
      const conditions = [eq(products.companyId, companyId)];
      
      if (activeOnly) {
        conditions.push(eq(products.isActive, true));
      }

      const result = await db
        .select()
        .from(products)
        .where(and(...conditions))
        .orderBy(desc(products.createdAt));

      return { success: true, products: result };
    } catch (error) {
      console.error('Error fetching company products:', error);
      return { error: 'Failed to fetch company products' };
    }
  }

  async getPublishedProducts(data?: { 
    industrySpecializationId?: number;
    targetCustomerCategoryId?: string;
    productType?: string;
    limit?: number;
    offset?: number;
  }) {
    const { 
      industrySpecializationId, 
      targetCustomerCategoryId, 
      productType,
      limit = 50,
      offset = 0
    } = data || {};

    try {
      let query = db
        .select()
        .from(products)
        .where(and(
          eq(products.isActive, true),
          eq(products.isPublished, true)
        ));

      // Apply filters
      const conditions = [
        eq(products.isActive, true),
        eq(products.isPublished, true)
      ];

      if (industrySpecializationId) {
        conditions.push(eq(products.industrySpecializationId, industrySpecializationId));
      }

      if (targetCustomerCategoryId) {
        conditions.push(eq(products.targetCustomerCategoryId, targetCustomerCategoryId));
      }

      if (productType) {
        conditions.push(eq(products.productType, productType));
      }

      const result = await db
        .select()
        .from(products)
        .where(and(...conditions))
        .orderBy(desc(products.createdAt))
        .limit(limit)
        .offset(offset);

      return { success: true, products: result };
    } catch (error) {
      console.error('Error fetching published products:', error);
      return { error: 'Failed to fetch published products' };
    }
  }

  async searchProducts(data: { 
    searchTerm: string; 
    companyId?: string;
    publishedOnly?: boolean;
    limit?: number;
  }) {
    const { searchTerm, companyId, publishedOnly = false, limit = 20 } = data;

    try {
      const conditions = [
        like(products.name, `%${searchTerm}%`)
      ];

      if (companyId) {
        conditions.push(eq(products.companyId, companyId));
      }

      if (publishedOnly) {
        conditions.push(eq(products.isPublished, true));
        conditions.push(eq(products.isActive, true));
      }

      const result = await db
        .select()
        .from(products)
        .where(and(...conditions))
        .orderBy(desc(products.createdAt))
        .limit(limit);

      return { success: true, products: result };
    } catch (error) {
      console.error('Error searching products:', error);
      return { error: 'Failed to search products' };
    }
  }

  async updateProduct(data: {
    productId: string;
    updates: Partial<{
      name: string;
      productType: string;
      shortDescription: string;
      detailedDescription: string;
      productImageUrl: string;
      industrySpecializationId: number;
      targetCustomerCategoryId: string;
      targetCustomerSubCategoryId: number;
      paymentModel: string;
      indicativeIncentive: string;
      salesTrainingAvailable: boolean;
      isActive: boolean;
      isPublished: boolean;
      internalNotes: string;
    }>
  }) {
    const { productId, updates } = data;

    try {
      const result = await db
        .update(products)
        .set(updates)
        .where(eq(products.id, productId))
        .returning();

      if (result.length === 0) {
        return { error: 'Product not found' };
      }

      return { success: true, product: result[0] };
    } catch (error) {
      console.error('Error updating product:', error);
      return { error: 'Failed to update product' };
    }
  }

  async deleteProduct(data: { productId: string }) {
    const { productId } = data;

    try {
      const result = await db
        .delete(products)
        .where(eq(products.id, productId))
        .returning();

      if (result.length === 0) {
        return { error: 'Product not found' };
      }

      return { success: true, deletedProduct: result[0] };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { error: 'Failed to delete product' };
    }
  }

  async getAllProducts() {
    try {
      const result = await db
        .select()
        .from(products)
        .orderBy(asc(products.name));
      return { success: true, products: result };
    } catch (error) {
      console.error('Error fetching all products:', error);
      return { error: 'Failed to fetch all products' };
    } 
  }

  // ==================== PRODUCT PRIMARY REGIONS METHODS ====================

  async addProductPrimaryRegion(data: {
    productId: string;
    countryId: number;
    stateId?: number;
    cityId?: number;
  }) {
    const { productId, countryId, stateId, cityId } = data;

    try {
      const result = await db
        .insert(productPrimaryRegions)
        .values({
          id: nanoid(),
          productId,
          countryId,
          stateId,
          cityId,
        })
        .returning();

      return { success: true, primaryRegion: result[0] };
    } catch (error) {
      console.error('Error adding product primary region:', error);
      return { error: 'Failed to add product primary region' };
    }
  }

  async getProductPrimaryRegions(data: { productId: string }) {
    const { productId } = data;

    try {
      const result = await db
        .select()
        .from(productPrimaryRegions)
        .where(eq(productPrimaryRegions.productId, productId));

      return { success: true, primaryRegions: result };
    } catch (error) {
      console.error('Error fetching product primary regions:', error);
      return { error: 'Failed to fetch product primary regions' };
    }
  }

  async removeProductPrimaryRegion(data: { primaryRegionId: string }) {
    const { primaryRegionId } = data;

    try {
      const result = await db
        .delete(productPrimaryRegions)
        .where(eq(productPrimaryRegions.id, primaryRegionId))
        .returning();

      if (result.length === 0) {
        return { error: 'Product primary region not found' };
      }

      return { success: true, deletedPrimaryRegion: result[0] };
    } catch (error) {
      console.error('Error removing product primary region:', error);
      return { error: 'Failed to remove product primary region' };
    }
  }

  // ==================== PRODUCT ENGAGEMENT METHODS ====================

  async addProductEngagementMethod(data: {
    productId: string;
    engagementModelId: number;
  }) {
    const { productId, engagementModelId } = data;

    try {
      const result = await db
        .insert(productEngagementMethods)
        .values({
          id: nanoid(),
          productId,
          engagementModelId,
        })
        .returning();

      return { success: true, engagementMethod: result[0] };
    } catch (error) {
      console.error('Error adding product engagement method:', error);
      return { error: 'Failed to add product engagement method' };
    }
  }

  async getProductEngagementMethods(data: { productId: string }) {
    const { productId } = data;

    try {
      const result = await db
        .select()
        .from(productEngagementMethods)
        .where(eq(productEngagementMethods.productId, productId));

      return { success: true, engagementMethods: result };
    } catch (error) {
      console.error('Error fetching product engagement methods:', error);
      return { error: 'Failed to fetch product engagement methods' };
    }
  }

  async removeProductEngagementMethod(data: { engagementMethodId: string }) {
    const { engagementMethodId } = data;

    try {
      const result = await db
        .delete(productEngagementMethods)
        .where(eq(productEngagementMethods.id, engagementMethodId))
        .returning();

      if (result.length === 0) {
        return { error: 'Product engagement method not found' };
      }

      return { success: true, deletedEngagementMethod: result[0] };
    } catch (error) {
      console.error('Error removing product engagement method:', error);
      return { error: 'Failed to remove product engagement method' };
    }
  }

  // ==================== PRODUCT PREFERRED BD PARTNERS METHODS ====================

  async addProductPreferredBdPartner(data: {
    productId: string;
    industrySpecializationId?: number;
  }) {
    const { productId, industrySpecializationId } = data;

    try {
      const result = await db
        .insert(productPreferredBdPartners)
        .values({
          id: nanoid(),
          productId,
          industrySpecializationId,
        })
        .returning();

      return { success: true, preferredBdPartner: result[0] };
    } catch (error) {
      console.error('Error adding product preferred BD partner:', error);
      return { error: 'Failed to add product preferred BD partner' };
    }
  }

  async getProductPreferredBdPartners(data: { productId: string }) {
    const { productId } = data;

    try {
      const result = await db
        .select()
        .from(productPreferredBdPartners)
        .where(eq(productPreferredBdPartners.productId, productId));

      return { success: true, preferredBdPartners: result };
    } catch (error) {
      console.error('Error fetching product preferred BD partners:', error);
      return { error: 'Failed to fetch product preferred BD partners' };
    }
  }

  async removeProductPreferredBdPartner(data: { preferredBdPartnerId: string }) {
    const { preferredBdPartnerId } = data;

    try {
      const result = await db
        .delete(productPreferredBdPartners)
        .where(eq(productPreferredBdPartners.id, preferredBdPartnerId))
        .returning();

      if (result.length === 0) {
        return { error: 'Product preferred BD partner not found' };
      }

      return { success: true, deletedPreferredBdPartner: result[0] };
    } catch (error) {
      console.error('Error removing product preferred BD partner:', error);
      return { error: 'Failed to remove product preferred BD partner' };
    }
  }

  // ==================== PRODUCT DOCUMENTS METHODS ====================

  async createProductDocument(data: {
    productId: string;
    documentType: string;
    fileName: string;
    fileUrl: string;
    fileSize?: number;
    mimeType?: string;
  }) {
    const { productId, ...documentData } = data;

    try {
      const result = await db
        .insert(productDocuments)
        .values({
          id: nanoid(),
          productId,
          ...documentData,
        })
        .returning();

      return { success: true, document: result[0] };
    } catch (error) {
      console.error('Error creating product document:', error);
      return { error: 'Failed to create product document' };
    }
  }

  async getProductDocuments(data: { productId: string; activeOnly?: boolean }) {
    const { productId, activeOnly = false } = data;

    try {
      const conditions = [eq(productDocuments.productId, productId)];
      
      if (activeOnly) {
        conditions.push(eq(productDocuments.isActive, true));
      }

      const result = await db
        .select()
        .from(productDocuments)
        .where(and(...conditions))
        .orderBy(desc(productDocuments.uploadedAt));

      return { success: true, documents: result };
    } catch (error) {
      console.error('Error fetching product documents:', error);
      return { error: 'Failed to fetch product documents' };
    }
  }

  async getProductDocumentsByType(data: { 
    productId: string; 
    documentType: string;
    activeOnly?: boolean;
  }) {
    const { productId, documentType, activeOnly = false } = data;

    try {
      const conditions = [
        eq(productDocuments.productId, productId),
        eq(productDocuments.documentType, documentType)
      ];

      if (activeOnly) {
        conditions.push(eq(productDocuments.isActive, true));
      }

      const result = await db
        .select()
        .from(productDocuments)
        .where(and(...conditions))
        .orderBy(desc(productDocuments.uploadedAt));

      return { success: true, documents: result };
    } catch (error) {
      console.error('Error fetching product documents by type:', error);
      return { error: 'Failed to fetch product documents by type' };
    }
  }

  async updateProductDocument(data: {
    documentId: string;
    updates: Partial<{
      documentType: string;
      fileName: string;
      fileUrl: string;
      fileSize: number;
      mimeType: string;
      isActive: boolean;
    }>
  }) {
    const { documentId, updates } = data;

    try {
      const result = await db
        .update(productDocuments)
        .set(updates)
        .where(eq(productDocuments.id, documentId))
        .returning();

      if (result.length === 0) {
        return { error: 'Product document not found' };
      }

      return { success: true, document: result[0] };
    } catch (error) {
      console.error('Error updating product document:', error);
      return { error: 'Failed to update product document' };
    }
  }

  async deleteProductDocument(data: { documentId: string }) {
    const { documentId } = data;

    try {
      const result = await db
        .delete(productDocuments)
        .where(eq(productDocuments.id, documentId))
        .returning();

      if (result.length === 0) {
        return { error: 'Product document not found' };
      }

      return { success: true, deletedDocument: result[0] };
    } catch (error) {
      console.error('Error deleting product document:', error);
      return { error: 'Failed to delete product document' };
    }
  }

  // ==================== UTILITY METHODS ====================

  async getCompleteProduct(data: { productId: string }) {
    const { productId } = data;

    try {
      // Get base product
      const productResult = await this.getProductById({ productId });
      if (!productResult.success) {
        return productResult;
      }

      // Get related data
      const [
        primaryRegionsResult,
        engagementMethodsResult,
        preferredBdPartnersResult,
        documentsResult
      ] = await Promise.all([
        this.getProductPrimaryRegions({ productId }),
        this.getProductEngagementMethods({ productId }),
        this.getProductPreferredBdPartners({ productId }),
        this.getProductDocuments({ productId, activeOnly: true })
      ]);

      return {
        success: true,
        product: {
          ...productResult.product,
          primaryRegions: primaryRegionsResult.success ? primaryRegionsResult.primaryRegions : [],
          engagementMethods: engagementMethodsResult.success ? engagementMethodsResult.engagementMethods : [],
          preferredBdPartners: preferredBdPartnersResult.success ? preferredBdPartnersResult.preferredBdPartners : [],
          documents: documentsResult.success ? documentsResult.documents : []
        }
      };
    } catch (error) {
      console.error('Error fetching complete product:', error);
      return { error: 'Failed to fetch complete product' };
    }
  }

  async getProductsByIndustry(data: {
    industrySpecializationId: number;
    publishedOnly?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const { industrySpecializationId, publishedOnly = true, limit = 20, offset = 0 } = data;

    try {
      const conditions = [
        eq(products.industrySpecializationId, industrySpecializationId)
      ];

      if (publishedOnly) {
        conditions.push(eq(products.isPublished, true));
        conditions.push(eq(products.isActive, true));
      }

      const result = await db
        .select()
        .from(products)
        .where(and(...conditions))
        .orderBy(desc(products.createdAt))
        .limit(limit)
        .offset(offset);

      return { success: true, products: result };
    } catch (error) {
      console.error('Error fetching products by industry:', error);
      return { error: 'Failed to fetch products by industry' };
    }
  }

  async toggleProductStatus(data: { productId: string; isActive: boolean }) {
    const { productId, isActive } = data;

    try {
      const result = await db
        .update(products)
        .set({ isActive })
        .where(eq(products.id, productId))
        .returning();

      if (result.length === 0) {
        return { error: 'Product not found' };
      }

      return { success: true, product: result[0] };
    } catch (error) {
      console.error('Error toggling product status:', error);
      return { error: 'Failed to toggle product status' };
    }
  }

  async publishProduct(data: { productId: string; isPublished: boolean }) {
    const { productId, isPublished } = data;

    try {
      const result = await db
        .update(products)
        .set({ isPublished })
        .where(eq(products.id, productId))
        .returning();

      if (result.length === 0) {
        return { error: 'Product not found' };
      }

      return { success: true, product: result[0] };
    } catch (error) {
      console.error('Error publishing product:', error);
      return { error: 'Failed to publish product' };
    }
  }
}