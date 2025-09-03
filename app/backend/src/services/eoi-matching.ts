import { db } from '../db';
import { 
  bdPartners, 
  companies, 
  companyBdpRequirements, 
  bdpOpportunityPreferences,
  eoiMatchingScores,
  bdPartnerExpertise,
  bdPartnerMarketAccess
} from '../db/schema';
import { eq, and, inArray } from 'drizzle-orm';

export interface MatchingScore {
  bdPartnerId: string;
  companyId: string;
  requirementId?: string;
  preferenceId?: string;
  overallScore: number;
  industryScore: number;
  regionScore: number;
  experienceScore: number;
  availabilityScore: number;
  commissionScore: number;
  matchType: 'auto' | 'manual' | 'partial';
  isRecommended: boolean;
}

export class EOIMatchingService {
  
  /**
   * Calculate matching score between a BD Partner and Company requirement
   */
  static async calculateBdpCompanyMatch(
    bdPartnerId: string, 
    requirementId: string
  ): Promise<MatchingScore | null> {
    try {
      // Get BD Partner details with related data
      const bdPartner = await db.query.bdPartners.findFirst({
        where: eq(bdPartners.id, bdPartnerId),
        with: {
          expertise: true,
          marketAccess: true,
          categories: true
        }
      });

      // Get company requirement
      const requirement = await db.query.companyBdpRequirements.findFirst({
        where: eq(companyBdpRequirements.id, requirementId)
      });

      if (!bdPartner || !requirement) {
        return null;
      }

      // Calculate individual scores
      const industryScore = this.calculateIndustryMatch(bdPartner, requirement);
      const regionScore = this.calculateRegionMatch(bdPartner, requirement);
      const experienceScore = this.calculateExperienceMatch(bdPartner, requirement);
      const availabilityScore = this.calculateAvailabilityMatch(bdPartner, requirement);
      const commissionScore = this.calculateCommissionMatch(bdPartner, requirement);

      // Calculate overall score (weighted average)
      const overallScore = Math.round(
        (industryScore * 0.3) +
        (regionScore * 0.25) +
        (experienceScore * 0.2) +
        (availabilityScore * 0.15) +
        (commissionScore * 0.1)
      );

      const matchType = overallScore >= 90 ? 'auto' : overallScore >= 70 ? 'partial' : 'manual';
      const isRecommended = overallScore >= (requirement.autoMatchingScore || 75);

      return {
        bdPartnerId,
        companyId: requirement.companyId,
        requirementId,
        overallScore,
        industryScore,
        regionScore,
        experienceScore,
        availabilityScore,
        commissionScore,
        matchType,
        isRecommended
      };

    } catch (error) {
      console.error('Error calculating BD Partner-Company match:', error);
      return null;
    }
  }

  /**
   * Calculate matching score between a Company and BD Partner preference
   */
  static async calculateCompanyBdpMatch(
    companyId: string,
    preferenceId: string
  ): Promise<MatchingScore | null> {
    try {
      // Get company details
      const company = await db.query.companies.findFirst({
        where: eq(companies.id, companyId)
      });

      // Get BD Partner preference
      const preference = await db.query.bdpOpportunityPreferences.findFirst({
        where: eq(bdpOpportunityPreferences.id, preferenceId)
      });

      if (!company || !preference) {
        return null;
      }

      // Calculate individual scores (reverse logic from above)
      const industryScore = this.calculateCompanyIndustryMatch(company, preference);
      const regionScore = this.calculateCompanyRegionMatch(company, preference);
      const businessTypeScore = this.calculateBusinessTypeMatch(company, preference);
      const commissionScore = this.calculateCompanyCommissionMatch(company, preference);

      // Calculate overall score
      const overallScore = Math.round(
        (industryScore * 0.35) +
        (regionScore * 0.25) +
        (businessTypeScore * 0.25) +
        (commissionScore * 0.15)
      );

      const matchType = overallScore >= 90 ? 'auto' : overallScore >= 70 ? 'partial' : 'manual';
      const isRecommended = overallScore >= (preference.minMatchingScore || 70);

      return {
        bdPartnerId: preference.bdPartnerId,
        companyId,
        preferenceId,
        overallScore,
        industryScore,
        regionScore,
        experienceScore: businessTypeScore,
        availabilityScore: 0,
        commissionScore,
        matchType,
        isRecommended
      };

    } catch (error) {
      console.error('Error calculating Company-BD Partner match:', error);
      return null;
    }
  }

  /**
   * Store matching score in database
   */
  static async storeMatchingScore(score: MatchingScore): Promise<void> {
    try {
      await db.insert(eoiMatchingScores).values({
        bdPartnerId: score.bdPartnerId,
        companyId: score.companyId,
        requirementId: score.requirementId,
        preferenceId: score.preferenceId,
        overallScore: score.overallScore,
        industryScore: score.industryScore,
        regionScore: score.regionScore,
        experienceScore: score.experienceScore,
        availabilityScore: score.availabilityScore,
        commissionScore: score.commissionScore,
        matchType: score.matchType,
        isRecommended: score.isRecommended,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      });
    } catch (error) {
      console.error('Error storing matching score:', error);
    }
  }

  /**
   * Find potential BD Partners for a company requirement
   */
  static async findPotentialBdPartners(requirementId: string): Promise<MatchingScore[]> {
    try {
      // Get all verified BD Partners
      const verifiedBdPartners = await db.select().from(bdPartners)
        .where(eq(bdPartners.isVerified, true));

      const matchingScores: MatchingScore[] = [];

      for (const bdPartner of verifiedBdPartners) {
        const score = await this.calculateBdpCompanyMatch(bdPartner.id, requirementId);
        if (score && score.overallScore >= 50) { // Minimum threshold
          matchingScores.push(score);
          await this.storeMatchingScore(score);
        }
      }

      return matchingScores.sort((a, b) => b.overallScore - a.overallScore);

    } catch (error) {
      console.error('Error finding potential BD Partners:', error);
      return [];
    }
  }

  // Private helper methods for score calculations
  private static calculateIndustryMatch(bdPartner: any, requirement: any): number {
    // Implementation for industry matching logic
    const bdIndustries = bdPartner.expertise?.map((exp: any) => exp.primaryIndustry) || [];
    const reqIndustries = requirement.requiredIndustries || [];
    const prefIndustries = requirement.preferredIndustries || [];
    
    // Check for exact matches in required industries
    const requiredMatches = reqIndustries.filter((industry: string) => 
      bdIndustries.includes(industry)
    ).length;
    
    if (reqIndustries.length > 0 && requiredMatches === 0) {
      return 0; // No required industry match
    }
    
    // Check for preferred industry matches
    const preferredMatches = prefIndustries.filter((industry: string) => 
      bdIndustries.includes(industry)
    ).length;
    
    const requiredScore = reqIndustries.length > 0 ? (requiredMatches / reqIndustries.length) * 70 : 70;
    const preferredScore = prefIndustries.length > 0 ? (preferredMatches / prefIndustries.length) * 30 : 30;
    
    return Math.round(requiredScore + preferredScore);
  }

  private static calculateRegionMatch(bdPartner: any, requirement: any): number {
    // Implementation for region matching logic
    const bdRegions = bdPartner.marketAccess?.map((access: any) => access.region) || [];
    const reqRegions = requirement.requiredRegions || [];
    const prefRegions = requirement.preferredRegions || [];
    
    const requiredMatches = reqRegions.filter((region: string) => 
      bdRegions.includes(region)
    ).length;
    
    if (reqRegions.length > 0 && requiredMatches === 0) {
      return 0;
    }
    
    const preferredMatches = prefRegions.filter((region: string) => 
      bdRegions.includes(region)
    ).length;
    
    const requiredScore = reqRegions.length > 0 ? (requiredMatches / reqRegions.length) * 70 : 70;
    const preferredScore = prefRegions.length > 0 ? (preferredMatches / prefRegions.length) * 30 : 30;
    
    return Math.round(requiredScore + preferredScore);
  }

  private static calculateExperienceMatch(bdPartner: any, requirement: any): number {
    // Implementation for experience matching logic
    const maxExperience = Math.max(...(bdPartner.expertise?.map((exp: any) => exp.experienceYears || 0) || [0]));
    const minRequired = requirement.minExperienceYears || 0;
    
    if (maxExperience >= minRequired) {
      return Math.min(100, Math.round((maxExperience / Math.max(minRequired, 1)) * 50 + 50));
    }
    
    return Math.round((maxExperience / minRequired) * 100);
  }

  private static calculateAvailabilityMatch(bdPartner: any, requirement: any): number {
    // Implementation for availability matching logic
    if (!requirement.requiredAvailability) return 100;
    
    return bdPartner.availability === requirement.requiredAvailability ? 100 : 50;
  }

  private static calculateCommissionMatch(bdPartner: any, requirement: any): number {
    // Implementation for commission matching logic
    const minCommission = requirement.commissionRateMin || 0;
    const maxCommission = requirement.commissionRateMax || 100;
    
    // For now, assume all BD Partners are flexible on commission
    // In a real implementation, you might have BD Partner commission preferences
    return 85; // Default good match
  }

  private static calculateCompanyIndustryMatch(company: any, preference: any): number {
    const companyIndustry = company.industry;
    const preferredIndustries = preference.preferredIndustries || [];
    const excludedIndustries = preference.excludedIndustries || [];
    
    if (excludedIndustries.includes(companyIndustry)) {
      return 0;
    }
    
    if (preferredIndustries.includes(companyIndustry)) {
      return 100;
    }
    
    return 50; // Neutral match
  }

  private static calculateCompanyRegionMatch(company: any, preference: any): number {
    const companyRegion = company.registrationCountry;
    const preferredRegions = preference.preferredRegions || [];
    
    if (preferredRegions.includes(companyRegion)) {
      return 100;
    }
    
    if (preference.canWorkRemotely) {
      return 75;
    }
    
    return 25;
  }

  private static calculateBusinessTypeMatch(company: any, preference: any): number {
    const companyType = company.businessType;
    const preferredTypes = preference.preferredCompanyTypes || [];
    
    if (preferredTypes.includes(companyType)) {
      return 100;
    }
    
    return 50; // Neutral match
  }

  private static calculateCompanyCommissionMatch(company: any, preference: any): number {
    // In a real implementation, you might have company-specific commission data
    // For now, return a default score
    return 80;
  }
}

export default EOIMatchingService;
