import { db } from '@/db';
import { eq, and, desc, asc } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { userProfiles } from '@/db/schema/userProfile-schema';
import { companies, companyContacts, companyDocuments } from '@/db/schema/company-schema';
import { 
  bdPartners, 
  individualBdPartners, 
  companyBdPartners,
  bdPartnerIndustries,
  bdPartnerEngagements,
  bdPartnerToolsPlatforms,
  bdPartnerTargetRegions,
  bdPartnerDocuments
} from '@/db/schema/bd-partner-schema';

export class UserController {
  // User Profiles
  async getUserType(data: { userId: string }) {
    const { userId } = data;

    const result = await db
        .select({
            userType: userProfiles.userType,
            registrationStage: userProfiles.registrationStage
        })
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId));

    if (result.length === 0) {
        return { error: 'User profile not found' };
    }

    return result[0];
  }

  async createUserProfile(data: { userId: string; userRole: string; userData: Record<string, any>;}) {
    const { userId, userRole, userData } = data;

    try {
        const [newProfile] = await db.insert(userProfiles).values({
            id: userId,
            userId: userId,
            userType: userRole,
            registrationStage: 'initial',
        }).returning({ id: userProfiles.id });

        const profileId = newProfile.id;

        if (userRole === 'company') {
            const { companyName } = userData;

            await db.insert(companies).values({
                id: userId,
                profileId: profileId,
                companyName: companyName,
            });
        } else if (userRole === 'bd-partner') {
            const { profileType } = userData;

            const [bdPartner] = await db.insert(bdPartners).values({
                id: userId,
                profileId: profileId,
                profileType: profileType,
            }).returning({ id: bdPartners.id });

            const bdPartnerId = bdPartner.id;

            if (profileType === 'individual') {
                const { fullName } = userData;

                await db.insert(individualBdPartners).values({
                    id: userId,
                    bdPartnerId: bdPartnerId,
                    fullName: fullName
                });
            } else if (profileType === 'company') {
                const { companyName } = userData;

                await db.insert(companyBdPartners).values({
                    id: userId,
                    bdPartnerId: bdPartnerId,
                    companyName: companyName
                });
            }
        } else {
            throw new Error('Invalid user role');
        }

        return { success: true, profileId };
    } catch (error) {
        console.error('Error creating user profile:', error);
        return { error: 'Failed to create user profile' };
    }
  }

  // ==================== USER PROFILE METHODS ====================
  
  async getUserProfile(data: { userId: string }) {
    const { userId } = data;

    try {
      const result = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId));

      if (result.length === 0) {
        return { error: 'User profile not found' };
      }

      return { success: true, profile: result[0] };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { error: 'Failed to fetch user profile' };
    }
  }

  async updateUserProfile(data: { 
    userId: string; 
    updates: Partial<{
      userType: string;
      registrationStage: string;
      isActive: boolean;
    }>
  }) {
    const { userId, updates } = data;

    try {
      const result = await db
        .update(userProfiles)
        .set(updates)
        .where(eq(userProfiles.userId, userId))
        .returning();

      if (result.length === 0) {
        return { error: 'User profile not found' };
      }

      return { success: true, profile: result[0] };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { error: 'Failed to update user profile' };
    }
  }

  async deleteUserProfile(data: { userId: string }) {
    const { userId } = data;

    try {
      const result = await db
        .delete(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .returning();

      if (result.length === 0) {
        return { error: 'User profile not found' };
      }

      return { success: true, deletedProfile: result[0] };
    } catch (error) {
      console.error('Error deleting user profile:', error);
      return { error: 'Failed to delete user profile' };
    }
  }

  // ==================== COMPANY METHODS ====================

  async getCompanyByProfileId(data: { profileId: string }) {
    const { profileId } = data;

    try {
      const result = await db
        .select()
        .from(companies)
        .where(eq(companies.profileId, profileId));

      if (result.length === 0) {
        return { error: 'Company not found' };
      }

      return { success: true, company: result[0] };
    } catch (error) {
      console.error('Error fetching company:', error);
      return { error: 'Failed to fetch company' };
    }
  }

  async updateCompany(data: { 
    companyId: string; 
    updates: Partial<{
      companyName: string;
      registeredCompanyName: string;
      abn: string;
      registrationNumber: string;
      companyTypeId: number;
      industryCategoryId: string;
      industrySubCategoryId: number;
      industrySpecializationId: number;
      countryOfRegistrationId: number;
      registeredAddress: string;
      headOfficeLocation: string;
      yearEstablished: number;
      websiteUrl: string;
      linkedinUrl: string;
      companyDescription: string;
      logoUrl: string;
      isVerified: boolean;
    }>
  }) {
    const { companyId, updates } = data;

    try {
      const result = await db
        .update(companies)
        .set(updates)
        .where(eq(companies.id, companyId))
        .returning();

      if (result.length === 0) {
        return { error: 'Company not found' };
      }

      return { success: true, company: result[0] };
    } catch (error) {
      console.error('Error updating company:', error);
      return { error: 'Failed to update company' };
    }
  }

  async deleteCompany(data: { companyId: string }) {
    const { companyId } = data;

    try {
      const result = await db
        .delete(companies)
        .where(eq(companies.id, companyId))
        .returning();

      if (result.length === 0) {
        return { error: 'Company not found' };
      }

      return { success: true, deletedCompany: result[0] };
    } catch (error) {
      console.error('Error deleting company:', error);
      return { error: 'Failed to delete company' };
    }
  }

  // ==================== COMPANY CONTACTS METHODS ====================

  async createCompanyContact(data: {
    companyId: string;
    fullName: string;
    designation?: string;
    email: string;
    phoneNumber?: string;
    linkedinProfile?: string;
    isPrimary?: boolean;
  }) {
    const { companyId, ...contactData } = data;

    try {
      const result = await db
        .insert(companyContacts)
        .values({
          id: nanoid(),
          companyId,
          ...contactData,
        })
        .returning();

      return { success: true, contact: result[0] };
    } catch (error) {
      console.error('Error creating company contact:', error);
      return { error: 'Failed to create company contact' };
    }
  }

  async getCompanyContacts(data: { companyId: string }) {
    const { companyId } = data;

    try {
      const result = await db
        .select()
        .from(companyContacts)
        .where(eq(companyContacts.companyId, companyId))
        .orderBy(desc(companyContacts.isPrimary), asc(companyContacts.fullName));

      return { success: true, contacts: result };
    } catch (error) {
      console.error('Error fetching company contacts:', error);
      return { error: 'Failed to fetch company contacts' };
    }
  }

  async updateCompanyContact(data: {
    contactId: string;
    updates: Partial<{
      fullName: string;
      designation: string;
      email: string;
      phoneNumber: string;
      linkedinProfile: string;
      isPrimary: boolean;
      isActive: boolean;
    }>
  }) {
    const { contactId, updates } = data;

    try {
      const result = await db
        .update(companyContacts)
        .set(updates)
        .where(eq(companyContacts.id, contactId))
        .returning();

      if (result.length === 0) {
        return { error: 'Company contact not found' };
      }

      return { success: true, contact: result[0] };
    } catch (error) {
      console.error('Error updating company contact:', error);
      return { error: 'Failed to update company contact' };
    }
  }

  async deleteCompanyContact(data: { contactId: string }) {
    const { contactId } = data;

    try {
      const result = await db
        .delete(companyContacts)
        .where(eq(companyContacts.id, contactId))
        .returning();

      if (result.length === 0) {
        return { error: 'Company contact not found' };
      }

      return { success: true, deletedContact: result[0] };
    } catch (error) {
      console.error('Error deleting company contact:', error);
      return { error: 'Failed to delete company contact' };
    }
  }

  // ==================== COMPANY DOCUMENTS METHODS ====================

  async createCompanyDocument(data: {
    companyId: string;
    documentType: string;
    fileName: string;
    fileUrl: string;
    fileSize?: number;
    mimeType?: string;
  }) {
    const { companyId, ...documentData } = data;

    try {
      const result = await db
        .insert(companyDocuments)
        .values({
          id: nanoid(),
          companyId,
          ...documentData,
        })
        .returning();

      return { success: true, document: result[0] };
    } catch (error) {
      console.error('Error creating company document:', error);
      return { error: 'Failed to create company document' };
    }
  }

  async getCompanyDocuments(data: { companyId: string }) {
    const { companyId } = data;

    try {
      const result = await db
        .select()
        .from(companyDocuments)
        .where(eq(companyDocuments.companyId, companyId))
        .orderBy(desc(companyDocuments.uploadedAt));

      return { success: true, documents: result };
    } catch (error) {
      console.error('Error fetching company documents:', error);
      return { error: 'Failed to fetch company documents' };
    }
  }

  async updateCompanyDocument(data: {
    documentId: string;
    updates: Partial<{
      documentType: string;
      fileName: string;
      fileUrl: string;
      fileSize: number;
      mimeType: string;
      isVerified: boolean;
    }>
  }) {
    const { documentId, updates } = data;

    try {
      const result = await db
        .update(companyDocuments)
        .set(updates)
        .where(eq(companyDocuments.id, documentId))
        .returning();

      if (result.length === 0) {
        return { error: 'Company document not found' };
      }

      return { success: true, document: result[0] };
    } catch (error) {
      console.error('Error updating company document:', error);
      return { error: 'Failed to update company document' };
    }
  }

  async deleteCompanyDocument(data: { documentId: string }) {
    const { documentId } = data;

    try {
      const result = await db
        .delete(companyDocuments)
        .where(eq(companyDocuments.id, documentId))
        .returning();

      if (result.length === 0) {
        return { error: 'Company document not found' };
      }

      return { success: true, deletedDocument: result[0] };
    } catch (error) {
      console.error('Error deleting company document:', error);
      return { error: 'Failed to delete company document' };
    }
  }

  // ==================== BD PARTNER METHODS ====================

  async getBdPartnerByProfileId(data: { profileId: string }) {
    const { profileId } = data;

    try {
      const result = await db
        .select()
        .from(bdPartners)
        .where(eq(bdPartners.profileId, profileId));

      if (result.length === 0) {
        return { error: 'BD Partner not found' };
      }

      return { success: true, bdPartner: result[0] };
    } catch (error) {
      console.error('Error fetching BD partner:', error);
      return { error: 'Failed to fetch BD partner' };
    }
  }

  async updateBdPartner(data: {
    bdPartnerId: string;
    updates: Partial<{
      profileType: string;
      countryId: number;
      stateId: number;
      cityId: number;
      yearsOfExperience: number;
      englishFluency: string;
      referralNetworkDescription: string;
      existingClientBase: string;
      weeklyCommitmentHours: number;
      isVerified: boolean;
      isActive: boolean;
    }>
  }) {
    const { bdPartnerId, updates } = data;

    try {
      const result = await db
        .update(bdPartners)
        .set(updates)
        .where(eq(bdPartners.id, bdPartnerId))
        .returning();

      if (result.length === 0) {
        return { error: 'BD Partner not found' };
      }

      return { success: true, bdPartner: result[0] };
    } catch (error) {
      console.error('Error updating BD partner:', error);
      return { error: 'Failed to update BD partner' };
    }
  }

  async deleteBdPartner(data: { bdPartnerId: string }) {
    const { bdPartnerId } = data;

    try {
      const result = await db
        .delete(bdPartners)
        .where(eq(bdPartners.id, bdPartnerId))
        .returning();

      if (result.length === 0) {
        return { error: 'BD Partner not found' };
      }

      return { success: true, deletedBdPartner: result[0] };
    } catch (error) {
      console.error('Error deleting BD partner:', error);
      return { error: 'Failed to delete BD partner' };
    }
  }

  // ==================== INDIVIDUAL BD PARTNER METHODS ====================

  async getIndividualBdPartner(data: { bdPartnerId: string }) {
    const { bdPartnerId } = data;

    try {
      const result = await db
        .select()
        .from(individualBdPartners)
        .where(eq(individualBdPartners.bdPartnerId, bdPartnerId));

      if (result.length === 0) {
        return { error: 'Individual BD Partner not found' };
      }

      return { success: true, individualBdPartner: result[0] };
    } catch (error) {
      console.error('Error fetching individual BD partner:', error);
      return { error: 'Failed to fetch individual BD partner' };
    }
  }

  async updateIndividualBdPartner(data: {
    individualId: string;
    updates: Partial<{
      fullName: string;
      mobileNumber: string;
      linkedinProfile: string;
    }>
  }) {
    const { individualId, updates } = data;

    try {
      const result = await db
        .update(individualBdPartners)
        .set(updates)
        .where(eq(individualBdPartners.id, individualId))
        .returning();

      if (result.length === 0) {
        return { error: 'Individual BD Partner not found' };
      }

      return { success: true, individualBdPartner: result[0] };
    } catch (error) {
      console.error('Error updating individual BD partner:', error);
      return { error: 'Failed to update individual BD partner' };
    }
  }

  // ==================== COMPANY BD PARTNER METHODS ====================

  async getCompanyBdPartner(data: { bdPartnerId: string }) {
    const { bdPartnerId } = data;

    try {
      const result = await db
        .select()
        .from(companyBdPartners)
        .where(eq(companyBdPartners.bdPartnerId, bdPartnerId));

      if (result.length === 0) {
        return { error: 'Company BD Partner not found' };
      }

      return { success: true, companyBdPartner: result[0] };
    } catch (error) {
      console.error('Error fetching company BD partner:', error);
      return { error: 'Failed to fetch company BD partner' };
    }
  }

  async updateCompanyBdPartner(data: {
    companyBdPartnerId: string;
    updates: Partial<{
      companyName: string;
      registrationNumber: string;
      websiteUrl: string;
      numberOfEmployees: number;
    }>
  }) {
    const { companyBdPartnerId, updates } = data;

    try {
      const result = await db
        .update(companyBdPartners)
        .set(updates)
        .where(eq(companyBdPartners.id, companyBdPartnerId))
        .returning();

      if (result.length === 0) {
        return { error: 'Company BD Partner not found' };
      }

      return { success: true, companyBdPartner: result[0] };
    } catch (error) {
      console.error('Error updating company BD partner:', error);
      return { error: 'Failed to update company BD partner' };
    }
  }

  // ==================== BD PARTNER INDUSTRIES METHODS ====================

  async addBdPartnerIndustry(data: {
    bdPartnerId: string;
    industrySpecializationId: number;
  }) {
    const { bdPartnerId, industrySpecializationId } = data;

    try {
      const result = await db
        .insert(bdPartnerIndustries)
        .values({
          id: nanoid(),
          bdPartnerId,
          industrySpecializationId,
        })
        .returning();

      return { success: true, bdPartnerIndustry: result[0] };
    } catch (error) {
      console.error('Error adding BD partner industry:', error);
      return { error: 'Failed to add BD partner industry' };
    }
  }

  async getBdPartnerIndustries(data: { bdPartnerId: string }) {
    const { bdPartnerId } = data;

    try {
      const result = await db
        .select()
        .from(bdPartnerIndustries)
        .where(eq(bdPartnerIndustries.bdPartnerId, bdPartnerId));

      return { success: true, industries: result };
    } catch (error) {
      console.error('Error fetching BD partner industries:', error);
      return { error: 'Failed to fetch BD partner industries' };
    }
  }

  async removeBdPartnerIndustry(data: { bdPartnerIndustryId: string }) {
    const { bdPartnerIndustryId } = data;

    try {
      const result = await db
        .delete(bdPartnerIndustries)
        .where(eq(bdPartnerIndustries.id, bdPartnerIndustryId))
        .returning();

      if (result.length === 0) {
        return { error: 'BD Partner industry not found' };
      }

      return { success: true, deletedIndustry: result[0] };
    } catch (error) {
      console.error('Error removing BD partner industry:', error);
      return { error: 'Failed to remove BD partner industry' };
    }
  }

  // ==================== BD PARTNER ENGAGEMENTS METHODS ====================

  async addBdPartnerEngagement(data: {
    bdPartnerId: string;
    engagementModelId: number;
  }) {
    const { bdPartnerId, engagementModelId } = data;

    try {
      const result = await db
        .insert(bdPartnerEngagements)
        .values({
          id: nanoid(),
          bdPartnerId,
          engagementModelId,
        })
        .returning();

      return { success: true, bdPartnerEngagement: result[0] };
    } catch (error) {
      console.error('Error adding BD partner engagement:', error);
      return { error: 'Failed to add BD partner engagement' };
    }
  }

  async getBdPartnerEngagements(data: { bdPartnerId: string }) {
    const { bdPartnerId } = data;

    try {
      const result = await db
        .select()
        .from(bdPartnerEngagements)
        .where(eq(bdPartnerEngagements.bdPartnerId, bdPartnerId));

      return { success: true, engagements: result };
    } catch (error) {
      console.error('Error fetching BD partner engagements:', error);
      return { error: 'Failed to fetch BD partner engagements' };
    }
  }

  async removeBdPartnerEngagement(data: { bdPartnerEngagementId: string }) {
    const { bdPartnerEngagementId } = data;

    try {
      const result = await db
        .delete(bdPartnerEngagements)
        .where(eq(bdPartnerEngagements.id, bdPartnerEngagementId))
        .returning();

      if (result.length === 0) {
        return { error: 'BD Partner engagement not found' };
      }

      return { success: true, deletedEngagement: result[0] };
    } catch (error) {
      console.error('Error removing BD partner engagement:', error);
      return { error: 'Failed to remove BD partner engagement' };
    }
  }

  // ==================== BD PARTNER TOOLS/PLATFORMS METHODS ====================

  async addBdPartnerTool(data: {
    bdPartnerId: string;
    toolName: string;
    proficiencyLevel?: string;
  }) {
    const { bdPartnerId, toolName, proficiencyLevel } = data;

    try {
      const result = await db
        .insert(bdPartnerToolsPlatforms)
        .values({
          id: nanoid(),
          bdPartnerId,
          toolName,
          proficiencyLevel,
        })
        .returning();

      return { success: true, bdPartnerTool: result[0] };
    } catch (error) {
      console.error('Error adding BD partner tool:', error);
      return { error: 'Failed to add BD partner tool' };
    }
  }

  async getBdPartnerTools(data: { bdPartnerId: string }) {
    const { bdPartnerId } = data;

    try {
      const result = await db
        .select()
        .from(bdPartnerToolsPlatforms)
        .where(eq(bdPartnerToolsPlatforms.bdPartnerId, bdPartnerId));

      return { success: true, tools: result };
    } catch (error) {
      console.error('Error fetching BD partner tools:', error);
      return { error: 'Failed to fetch BD partner tools' };
    }
  }

  async updateBdPartnerTool(data: {
    toolId: string;
    updates: Partial<{
      toolName: string;
      proficiencyLevel: string;
    }>
  }) {
    const { toolId, updates } = data;

    try {
      const result = await db
        .update(bdPartnerToolsPlatforms)
        .set(updates)
        .where(eq(bdPartnerToolsPlatforms.id, toolId))
        .returning();

      if (result.length === 0) {
        return { error: 'BD Partner tool not found' };
      }

      return { success: true, tool: result[0] };
    } catch (error) {
      console.error('Error updating BD partner tool:', error);
      return { error: 'Failed to update BD partner tool' };
    }
  }

  async removeBdPartnerTool(data: { toolId: string }) {
    const { toolId } = data;

    try {
      const result = await db
        .delete(bdPartnerToolsPlatforms)
        .where(eq(bdPartnerToolsPlatforms.id, toolId))
        .returning();

      if (result.length === 0) {
        return { error: 'BD Partner tool not found' };
      }

      return { success: true, deletedTool: result[0] };
    } catch (error) {
      console.error('Error removing BD partner tool:', error);
      return { error: 'Failed to remove BD partner tool' };
    }
  }

  // ==================== BD PARTNER TARGET REGIONS METHODS ====================

  async addBdPartnerTargetRegion(data: {
    bdPartnerId: string;
    countryId: number;
    stateId?: number;
    cityId?: number;
  }) {
    const { bdPartnerId, countryId, stateId, cityId } = data;

    try {
      const result = await db
        .insert(bdPartnerTargetRegions)
        .values({
          id: nanoid(),
          bdPartnerId,
          countryId,
          stateId,
          cityId,
        })
        .returning();

      return { success: true, targetRegion: result[0] };
    } catch (error) {
      console.error('Error adding BD partner target region:', error);
      return { error: 'Failed to add BD partner target region' };
    }
  }

  async getBdPartnerTargetRegions(data: { bdPartnerId: string }) {
    const { bdPartnerId } = data;

    try {
      const result = await db
        .select()
        .from(bdPartnerTargetRegions)
        .where(eq(bdPartnerTargetRegions.bdPartnerId, bdPartnerId));

      return { success: true, targetRegions: result };
    } catch (error) {
      console.error('Error fetching BD partner target regions:', error);
      return { error: 'Failed to fetch BD partner target regions' };
    }
  }

  async removeBdPartnerTargetRegion(data: { targetRegionId: string }) {
    const { targetRegionId } = data;

    try {
      const result = await db
        .delete(bdPartnerTargetRegions)
        .where(eq(bdPartnerTargetRegions.id, targetRegionId))
        .returning();

      if (result.length === 0) {
        return { error: 'BD Partner target region not found' };
      }

      return { success: true, deletedTargetRegion: result[0] };
    } catch (error) {
      console.error('Error removing BD partner target region:', error);
      return { error: 'Failed to remove BD partner target region' };
    }
  }

  // ==================== BD PARTNER DOCUMENTS METHODS ====================

  async createBdPartnerDocument(data: {
    bdPartnerId: string;
    documentType: string;
    fileName: string;
    fileUrl: string;
    fileSize?: number;
    mimeType?: string;
  }) {
    const { bdPartnerId, ...documentData } = data;

    try {
      const result = await db
        .insert(bdPartnerDocuments)
        .values({
          id: nanoid(),
          bdPartnerId,
          ...documentData,
        })
        .returning();

      return { success: true, document: result[0] };
    } catch (error) {
      console.error('Error creating BD partner document:', error);
      return { error: 'Failed to create BD partner document' };
    }
  }

  async getBdPartnerDocuments(data: { bdPartnerId: string }) {
    const { bdPartnerId } = data;

    try {
      const result = await db
        .select()
        .from(bdPartnerDocuments)
        .where(eq(bdPartnerDocuments.bdPartnerId, bdPartnerId))
        .orderBy(desc(bdPartnerDocuments.uploadedAt));

      return { success: true, documents: result };
    } catch (error) {
      console.error('Error fetching BD partner documents:', error);
      return { error: 'Failed to fetch BD partner documents' };
    }
  }

  async updateBdPartnerDocument(data: {
    documentId: string;
    updates: Partial<{
      documentType: string;
      fileName: string;
      fileUrl: string;
      fileSize: number;
      mimeType: string;
      isVerified: boolean;
    }>
  }) {
    const { documentId, updates } = data;

    try {
      const result = await db
        .update(bdPartnerDocuments)
        .set(updates)
        .where(eq(bdPartnerDocuments.id, documentId))
        .returning();

      if (result.length === 0) {
        return { error: 'BD Partner document not found' };
      }

      return { success: true, document: result[0] };
    } catch (error) {
      console.error('Error updating BD partner document:', error);
      return { error: 'Failed to update BD partner document' };
    }
  }

  async deleteBdPartnerDocument(data: { documentId: string }) {
    const { documentId } = data;

    try {
      const result = await db
        .delete(bdPartnerDocuments)
        .where(eq(bdPartnerDocuments.id, documentId))
        .returning();

      if (result.length === 0) {
        return { error: 'BD Partner document not found' };
      }

      return { success: true, deletedDocument: result[0] };
    } catch (error) {
      console.error('Error deleting BD partner document:', error);
      return { error: 'Failed to delete BD partner document' };
    }
  }

  // ==================== UTILITY METHODS ====================

  async getCompleteUserProfile(data: { userId: string }) {
    const { userId } = data;

    try {
      // Get base user profile
      const userProfile = await this.getUserProfile({ userId });
      if (!userProfile.success) {
        return userProfile;
      }

      const profile = userProfile.profile;
      let additionalData = {};

      if (profile.userType === 'company') {
        // Get company data with contacts and documents
        const company = await this.getCompanyByProfileId({ profileId: profile.id });
        if (company.success) {
          const contacts = await this.getCompanyContacts({ companyId: company.company.id });
          const documents = await this.getCompanyDocuments({ companyId: company.company.id });
          
          additionalData = {
            company: company.company,
            contacts: contacts.success ? contacts.contacts : [],
            documents: documents.success ? documents.documents : []
          };
        }
      } else if (profile.userType === 'bd-partner') {
        // Get BD partner data with all related information
        const bdPartner = await this.getBdPartnerByProfileId({ profileId: profile.id });
        if (bdPartner.success) {
          const bdPartnerId = bdPartner.bdPartner.id;
          
          // Get type-specific data
          let specificData = {};
          if (bdPartner.bdPartner.profileType === 'individual') {
            const individual = await this.getIndividualBdPartner({ bdPartnerId });
            if (individual.success) {
              specificData = { individual: individual.individualBdPartner };
            }
          } else if (bdPartner.bdPartner.profileType === 'company') {
            const company = await this.getCompanyBdPartner({ bdPartnerId });
            if (company.success) {
              specificData = { company: company.companyBdPartner };
            }
          }

          // Get related data
          const industries = await this.getBdPartnerIndustries({ bdPartnerId });
          const engagements = await this.getBdPartnerEngagements({ bdPartnerId });
          const tools = await this.getBdPartnerTools({ bdPartnerId });
          const targetRegions = await this.getBdPartnerTargetRegions({ bdPartnerId });
          const documents = await this.getBdPartnerDocuments({ bdPartnerId });

          additionalData = {
            bdPartner: bdPartner.bdPartner,
            ...specificData,
            industries: industries.success ? industries.industries : [],
            engagements: engagements.success ? engagements.engagements : [],
            tools: tools.success ? tools.tools : [],
            targetRegions: targetRegions.success ? targetRegions.targetRegions : [],
            documents: documents.success ? documents.documents : []
          };
        }
      }

      return {
        success: true,
        profile: {
          ...profile,
          ...additionalData
        }
      };
    } catch (error) {
      console.error('Error fetching complete user profile:', error);
      return { error: 'Failed to fetch complete user profile' };
    }
  }

}