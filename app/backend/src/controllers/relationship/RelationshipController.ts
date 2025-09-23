import { db } from '@/db';
import { eq, and, desc, asc, inArray, gte, lte, isNull } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { 
  bdPartnerProductInterests, 
  partnerships 
} from '@/db/schema/relationships-schema';

export class RelationshipController {
  // ==================== BD PARTNER PRODUCT INTERESTS METHODS ====================

  async expressProductInterest(data: {
    bdPartnerId: string;
    productId: string;
    interestLevel?: string;
    notes?: string;
  }) {
    const { bdPartnerId, productId, interestLevel = 'interested', notes } = data;

    try {
      // Check if interest already exists
      const existing = await db
        .select()
        .from(bdPartnerProductInterests)
        .where(and(
          eq(bdPartnerProductInterests.bdPartnerId, bdPartnerId),
          eq(bdPartnerProductInterests.productId, productId)
        ));

      if (existing.length > 0) {
        return { error: 'Interest already expressed for this product' };
      }

      const result = await db
        .insert(bdPartnerProductInterests)
        .values({
          id: nanoid(),
          bdPartnerId,
          productId,
          interestLevel,
          notes,
        })
        .returning();

      return { success: true, interest: result[0] };
    } catch (error) {
      console.error('Error expressing product interest:', error);
      return { error: 'Failed to express product interest' };
    }
  }

  async applyForProduct(data: {
    bdPartnerId: string;
    productId: string;
    notes?: string;
  }) {
    const { bdPartnerId, productId, notes } = data;

    try {
      // Check if interest exists
      const existing = await db
        .select()
        .from(bdPartnerProductInterests)
        .where(and(
          eq(bdPartnerProductInterests.bdPartnerId, bdPartnerId),
          eq(bdPartnerProductInterests.productId, productId)
        ));

      if (existing.length === 0) {
        return { error: 'Must express interest first before applying' };
      }

      // Update to application status
      const result = await db
        .update(bdPartnerProductInterests)
        .set({
          interestLevel: 'applied',
          applicationStatus: 'pending',
          appliedAt: new Date(),
          notes,
        })
        .where(eq(bdPartnerProductInterests.id, existing[0].id))
        .returning();

      return { success: true, application: result[0] };
    } catch (error) {
      console.error('Error applying for product:', error);
      return { error: 'Failed to apply for product' };
    }
  }

  async getBdPartnerProductInterests(data: { 
    bdPartnerId: string; 
    interestLevel?: string;
    applicationStatus?: string;
  }) {
    const { bdPartnerId, interestLevel, applicationStatus } = data;

    try {
      const conditions = [eq(bdPartnerProductInterests.bdPartnerId, bdPartnerId)];

      if (interestLevel) {
        conditions.push(eq(bdPartnerProductInterests.interestLevel, interestLevel));
      }

      if (applicationStatus) {
        conditions.push(eq(bdPartnerProductInterests.applicationStatus, applicationStatus));
      }

      const result = await db
        .select()
        .from(bdPartnerProductInterests)
        .where(and(...conditions))
        .orderBy(desc(bdPartnerProductInterests.createdAt));

      return { success: true, interests: result };
    } catch (error) {
      console.error('Error fetching BD partner product interests:', error);
      return { error: 'Failed to fetch BD partner product interests' };
    }
  }

  async getProductInterests(data: { 
    productId: string; 
    interestLevel?: string;
    applicationStatus?: string;
  }) {
    const { productId, interestLevel, applicationStatus } = data;

    try {
      const conditions = [eq(bdPartnerProductInterests.productId, productId)];

      if (interestLevel) {
        conditions.push(eq(bdPartnerProductInterests.interestLevel, interestLevel));
      }

      if (applicationStatus) {
        conditions.push(eq(bdPartnerProductInterests.applicationStatus, applicationStatus));
      }

      const result = await db
        .select()
        .from(bdPartnerProductInterests)
        .where(and(...conditions))
        .orderBy(desc(bdPartnerProductInterests.createdAt));

      return { success: true, interests: result };
    } catch (error) {
      console.error('Error fetching product interests:', error);
      return { error: 'Failed to fetch product interests' };
    }
  }

  async reviewProductApplication(data: {
    interestId: string;
    applicationStatus: string;
    reviewedBy: string;
    notes?: string;
  }) {
    const { interestId, applicationStatus, reviewedBy, notes } = data;

    try {
      const result = await db
        .update(bdPartnerProductInterests)
        .set({
          applicationStatus,
          reviewedAt: new Date(),
          reviewedBy,
          notes,
        })
        .where(eq(bdPartnerProductInterests.id, interestId))
        .returning();

      if (result.length === 0) {
        return { error: 'Product interest not found' };
      }

      return { success: true, reviewedApplication: result[0] };
    } catch (error) {
      console.error('Error reviewing product application:', error);
      return { error: 'Failed to review product application' };
    }
  }

  async updateProductInterest(data: {
    interestId: string;
    updates: Partial<{
      interestLevel: string;
      applicationStatus: string;
      notes: string;
    }>
  }) {
    const { interestId, updates } = data;

    try {
      const result = await db
        .update(bdPartnerProductInterests)
        .set(updates)
        .where(eq(bdPartnerProductInterests.id, interestId))
        .returning();

      if (result.length === 0) {
        return { error: 'Product interest not found' };
      }

      return { success: true, interest: result[0] };
    } catch (error) {
      console.error('Error updating product interest:', error);
      return { error: 'Failed to update product interest' };
    }
  }

  async deleteProductInterest(data: { interestId: string }) {
    const { interestId } = data;

    try {
      const result = await db
        .delete(bdPartnerProductInterests)
        .where(eq(bdPartnerProductInterests.id, interestId))
        .returning();

      if (result.length === 0) {
        return { error: 'Product interest not found' };
      }

      return { success: true, deletedInterest: result[0] };
    } catch (error) {
      console.error('Error deleting product interest:', error);
      return { error: 'Failed to delete product interest' };
    }
  }

  // ==================== PARTNERSHIPS METHODS ====================

  async createPartnership(data: {
    companyId: string;
    bdPartnerId: string;
    productId?: string;
    partnershipType: string;
    engagementModelId: number;
    incentiveMethodId: number;
    commissionRate?: string; // Changed to string for decimal handling
    fixedFeeAmount?: string; // Changed to string for decimal handling
    minimumCommitment?: number;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { companyId, bdPartnerId, ...partnershipData } = data;

    try {
      // Check if partnership already exists
      const conditions = [
        eq(partnerships.companyId, companyId),
        eq(partnerships.bdPartnerId, bdPartnerId)
      ];

      if (data.productId) {
        conditions.push(eq(partnerships.productId, data.productId));
      } else {
        conditions.push(isNull(partnerships.productId));
      }

      const existing = await db
        .select()
        .from(partnerships)
        .where(and(...conditions));

      if (existing.length > 0) {
        return { error: 'Partnership already exists' };
      }

      const result = await db
        .insert(partnerships)
        .values({
          id: nanoid(),
          companyId,
          bdPartnerId,
          ...partnershipData,
        })
        .returning();

      return { success: true, partnership: result[0] };
    } catch (error) {
      console.error('Error creating partnership:', error);
      return { error: 'Failed to create partnership' };
    }
  }

  async getPartnershipById(data: { partnershipId: string }) {
    const { partnershipId } = data;

    try {
      const result = await db
        .select()
        .from(partnerships)
        .where(eq(partnerships.id, partnershipId));

      if (result.length === 0) {
        return { error: 'Partnership not found' };
      }

      return { success: true, partnership: result[0] };
    } catch (error) {
      console.error('Error fetching partnership:', error);
      return { error: 'Failed to fetch partnership' };
    }
  }

  async getCompanyPartnerships(data: { 
    companyId: string; 
    status?: string;
    partnershipType?: string;
    activeOnly?: boolean;
  }) {
    const { companyId, status, partnershipType, activeOnly = false } = data;

    try {
      const conditions = [eq(partnerships.companyId, companyId)];

      if (status) {
        conditions.push(eq(partnerships.status, status));
      }

      if (partnershipType) {
        conditions.push(eq(partnerships.partnershipType, partnershipType));
      }

      if (activeOnly) {
        conditions.push(eq(partnerships.status, 'active'));
      }

      const result = await db
        .select()
        .from(partnerships)
        .where(and(...conditions))
        .orderBy(desc(partnerships.createdAt));

      return { success: true, partnerships: result };
    } catch (error) {
      console.error('Error fetching company partnerships:', error);
      return { error: 'Failed to fetch company partnerships' };
    }
  }

  async getBdPartnerPartnerships(data: { 
    bdPartnerId: string; 
    status?: string;
    partnershipType?: string;
    activeOnly?: boolean;
  }) {
    const { bdPartnerId, status, partnershipType, activeOnly = false } = data;

    try {
      const conditions = [eq(partnerships.bdPartnerId, bdPartnerId)];

      if (status) {
        conditions.push(eq(partnerships.status, status));
      }

      if (partnershipType) {
        conditions.push(eq(partnerships.partnershipType, partnershipType));
      }

      if (activeOnly) {
        conditions.push(eq(partnerships.status, 'active'));
      }

      const result = await db
        .select()
        .from(partnerships)
        .where(and(...conditions))
        .orderBy(desc(partnerships.createdAt));

      return { success: true, partnerships: result };
    } catch (error) {
      console.error('Error fetching BD partner partnerships:', error);
      return { error: 'Failed to fetch BD partner partnerships' };
    }
  }

  async getProductPartnerships(data: { 
    productId: string; 
    status?: string;
    activeOnly?: boolean;
  }) {
    const { productId, status, activeOnly = false } = data;

    try {
      const conditions = [eq(partnerships.productId, productId)];

      if (status) {
        conditions.push(eq(partnerships.status, status));
      }

      if (activeOnly) {
        conditions.push(eq(partnerships.status, 'active'));
      }

      const result = await db
        .select()
        .from(partnerships)
        .where(and(...conditions))
        .orderBy(desc(partnerships.createdAt));

      return { success: true, partnerships: result };
    } catch (error) {
      console.error('Error fetching product partnerships:', error);
      return { error: 'Failed to fetch product partnerships' };
    }
  }

  async updatePartnership(data: {
    partnershipId: string;
    updates: Partial<{
      partnershipType: string;
      status: string;
      engagementModelId: number;
      incentiveMethodId: number;
      commissionRate: string; // Changed to string for decimal handling
      fixedFeeAmount: string; // Changed to string for decimal handling
      minimumCommitment: number;
      endDate: Date;
      agreementSigned: boolean;
      agreementSignedDate: Date;
    }>
  }) {
    const { partnershipId, updates } = data;

    try {
      const result = await db
        .update(partnerships)
        .set(updates)
        .where(eq(partnerships.id, partnershipId))
        .returning();

      if (result.length === 0) {
        return { error: 'Partnership not found' };
      }

      return { success: true, partnership: result[0] };
    } catch (error) {
      console.error('Error updating partnership:', error);
      return { error: 'Failed to update partnership' };
    }
  }

  async signPartnershipAgreement(data: { partnershipId: string }) {
    const { partnershipId } = data;

    try {
      const result = await db
        .update(partnerships)
        .set({
          agreementSigned: true,
          agreementSignedDate: new Date(),
        })
        .where(eq(partnerships.id, partnershipId))
        .returning();

      if (result.length === 0) {
        return { error: 'Partnership not found' };
      }

      return { success: true, partnership: result[0] };
    } catch (error) {
      console.error('Error signing partnership agreement:', error);
      return { error: 'Failed to sign partnership agreement' };
    }
  }

  async suspendPartnership(data: { partnershipId: string }) {
    const { partnershipId } = data;

    try {
      const result = await db
        .update(partnerships)
        .set({ status: 'suspended' })
        .where(eq(partnerships.id, partnershipId))
        .returning();

      if (result.length === 0) {
        return { error: 'Partnership not found' };
      }

      return { success: true, partnership: result[0] };
    } catch (error) {
      console.error('Error suspending partnership:', error);
      return { error: 'Failed to suspend partnership' };
    }
  }

  async reactivatePartnership(data: { partnershipId: string }) {
    const { partnershipId } = data;

    try {
      const result = await db
        .update(partnerships)
        .set({ status: 'active' })
        .where(eq(partnerships.id, partnershipId))
        .returning();

      if (result.length === 0) {
        return { error: 'Partnership not found' };
      }

      return { success: true, partnership: result[0] };
    } catch (error) {
      console.error('Error reactivating partnership:', error);
      return { error: 'Failed to reactivate partnership' };
    }
  }

  async terminatePartnership(data: { partnershipId: string }) {
    const { partnershipId } = data;

    try {
      const result = await db
        .update(partnerships)
        .set({ 
          status: 'terminated',
          endDate: new Date()
        })
        .where(eq(partnerships.id, partnershipId))
        .returning();

      if (result.length === 0) {
        return { error: 'Partnership not found' };
      }

      return { success: true, partnership: result[0] };
    } catch (error) {
      console.error('Error terminating partnership:', error);
      return { error: 'Failed to terminate partnership' };
    }
  }

  async deletePartnership(data: { partnershipId: string }) {
    const { partnershipId } = data;

    try {
      const result = await db
        .delete(partnerships)
        .where(eq(partnerships.id, partnershipId))
        .returning();

      if (result.length === 0) {
        return { error: 'Partnership not found' };
      }

      return { success: true, deletedPartnership: result[0] };
    } catch (error) {
      console.error('Error deleting partnership:', error);
      return { error: 'Failed to delete partnership' };
    }
  }

  // ==================== UTILITY METHODS ====================

  async getPartnershipSummary(data: { 
    companyId?: string; 
    bdPartnerId?: string;
    productId?: string;
  }) {
    const { companyId, bdPartnerId, productId } = data;

    try {
      const conditions = [];

      if (companyId) {
        conditions.push(eq(partnerships.companyId, companyId));
      }

      if (bdPartnerId) {
        conditions.push(eq(partnerships.bdPartnerId, bdPartnerId));
      }

      if (productId) {
        conditions.push(eq(partnerships.productId, productId));
      }

      if (conditions.length === 0) {
        return { error: 'At least one filter parameter is required' };
      }

      const result = await db
        .select()
        .from(partnerships)
        .where(and(...conditions));

      // Calculate summary statistics
      const summary = {
        total: result.length,
        active: result.filter(p => p.status === 'active').length,
        suspended: result.filter(p => p.status === 'suspended').length,
        terminated: result.filter(p => p.status === 'terminated').length,
        signed: result.filter(p => p.agreementSigned).length,
        unsigned: result.filter(p => !p.agreementSigned).length,
        productSpecific: result.filter(p => p.partnershipType === 'product_specific').length,
        general: result.filter(p => p.partnershipType === 'general').length,
      };

      return { success: true, summary, partnerships: result };
    } catch (error) {
      console.error('Error fetching partnership summary:', error);
      return { error: 'Failed to fetch partnership summary' };
    }
  }

  async getExpiringPartnerships(data: { daysAhead?: number } = {}) {
    const { daysAhead = 30 } = data;

    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + daysAhead);

      const result = await db
        .select()
        .from(partnerships)
        .where(and(
          eq(partnerships.status, 'active'),
          lte(partnerships.endDate, futureDate),
          gte(partnerships.endDate, new Date())
        ))
        .orderBy(asc(partnerships.endDate));

      return { success: true, expiringPartnerships: result };
    } catch (error) {
      console.error('Error fetching expiring partnerships:', error);
      return { error: 'Failed to fetch expiring partnerships' };
    }
  }

  async getUnsignedPartnerships(data: { companyId?: string; bdPartnerId?: string }) {
    const { companyId, bdPartnerId } = data;

    try {
      const conditions = [eq(partnerships.agreementSigned, false)];

      if (companyId) {
        conditions.push(eq(partnerships.companyId, companyId));
      }

      if (bdPartnerId) {
        conditions.push(eq(partnerships.bdPartnerId, bdPartnerId));
      }

      const result = await db
        .select()
        .from(partnerships)
        .where(and(...conditions))
        .orderBy(desc(partnerships.createdAt));

      return { success: true, unsignedPartnerships: result };
    } catch (error) {
      console.error('Error fetching unsigned partnerships:', error);
      return { error: 'Failed to fetch unsigned partnerships' };
    }
  }

  async getPendingApplications(data: { companyId?: string; productId?: string }) {
    const { companyId, productId } = data;

    try {
      const conditions = [eq(bdPartnerProductInterests.applicationStatus, 'pending')];

      if (productId) {
        conditions.push(eq(bdPartnerProductInterests.productId, productId));
      }

      // If companyId is provided, we need to join with products table
      // For now, let's implement a simpler version
      const result = await db
        .select()
        .from(bdPartnerProductInterests)
        .where(and(...conditions))
        .orderBy(desc(bdPartnerProductInterests.appliedAt));

      return { success: true, pendingApplications: result };
    } catch (error) {
      console.error('Error fetching pending applications:', error);
      return { error: 'Failed to fetch pending applications' };
    }
  }
}