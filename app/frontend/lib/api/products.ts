/**
 * Product API Client
 * Handles all product-related API calls
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const USER_API_BASE = 'http://localhost:3000';

export interface ProductResponse {
  id: string;
  name: string;
  type: string;
  status: string;
  shortDescription: string;
  detailedDescription: string;
  imageURL?: string;
  paymentModel: string;
  indicativeIncentive?: string;
  salesTrainingAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  companyProfile: {
    id: string;
    commonDetails: {
      companyName: string;
    };
  };
  preferredYearsOfExperience?: {
    id: string;
    yearsRange: string;
  };
  engagementMethod?: {
    id: string;
    name: string;
  };
  productTargetCustomerIndustries?: any[];
  productTargetRegions?: any[];
  productPreferredBDProfiles?: any[];
  productSalesSupportMaterials?: any[];
  productPreferredCertifications?: any[];
}

export interface CreateProductDto {
  companyProfileId: string;
  name: string;
  type: string;
  shortDescription: string;
  detailedDescription: string;
  imageURL?: string;
  paymentModel: string;
  indicativeIncentive?: string;
  preferredYearsOfExperienceId?: string;
  engagementMethodId?: string;
  salesTrainingAvailable?: boolean;
  status?: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface CompanyProfileResponse {
  id: string;
  userProfileId: string;
  commonDetailsId: string;
  ndaAgreed: boolean;
  headOfficeLocation?: string;
  createdAt: string;
  updatedAt: string;
  commonDetails: {
    id: string;
    companyName: string;
    contactPersonName?: string;
    contactPersonEmail?: string;
    websiteURL?: string;
    logoURL?: string;
    createdAt: string;
    updatedAt: string;
  };
  profileIndustries?: any[];
  profileEngagements?: any[];
  profileTools?: any[];
  profileCertifications?: any[];
  products?: ProductResponse[];
}

export interface CommonDetails {
  id: string;
  companyName: string;
  businessRegNumber?: string;
  registeredBuisnessName?: string;
  countryOfRegistration?: string;
  registeredAddress?: string;
  contactPersonName?: string;
  contactPersonDesignation?: string;
  contactPersonEmail?: string;
  contactPersonPhone?: string;
  websiteURL?: string;
  linkedInURL?: string;
  logoURL?: string;
  profileDeckURL?: string;
  yearOfEstablishment?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BDPartnerOrganizationProfile {
  id: string;
  userProfileId: string;
  commonDetailsId: string;
  businessStructureId: string;
  employeeCount: string;
  yearsOfExperienceId: string;
  availabilityHoursPerWeek?: string;
  referralNetworkDescription?: string;
  existingClientBase?: string;
  ndaAgreed: boolean;
  createdAt: string;
  updatedAt: string;
  commonDetails: CommonDetails;
  businessStructure: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  yearsOfExperience: {
    id: string;
    range: string;
    createdAt: string;
    updatedAt: string;
  };
  profileIndustries?: any[];
  profileEngagements?: any[];
  profileTools?: any[];
  profileCertifications?: any[];
}

export interface UserProfileResponse {
  id: string;
  userId: string;
  type: 'COMPANY' | 'BD_PARTNER_INDIVIDUAL' | 'BD_PARTNER_ORGANIZATION' | 'PENDING' | 'ADMIN';
  status: string;
  createdAt: string;
  updatedAt: string;
  companyProfile?: CompanyProfileResponse | null;
  bdpartnerIndividualProfile?: any;
  bdpartnerOrganizationProfile?: BDPartnerOrganizationProfile | null;
}

// ============================================
// PRODUCT API CALLS
// ============================================

/**
 * Fetch all products for a company
 */
export async function getCompanyProducts(companyProfileId: string): Promise<ProductResponse[]> {
  const response = await fetch(
    `${API_BASE}/products/company/${companyProfileId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch company products: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a single product by ID
 */
export async function getProduct(id: string): Promise<ProductResponse> {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Create a new product
 */
export async function createProduct(dto: CreateProductDto): Promise<ProductResponse> {
  const response = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create product');
  }

  return response.json();
}

/**
 * Updateuser profile with nested company/BD partner data
 */
export async function getUserProfile(): Promise<UserProfileResponse> {
  const response = await fetch(
    `${USER_API_BASE}/user-profile`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch company profile by user profile ID (legacy)
 */
export async function updateProduct(
  id: string,
  dto: UpdateProductDto
): Promise<ProductResponse> {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update product');
  }

  return response.json();
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete product');
  }
}

/**
 * Get products by status
 */
export async function getProductsByStatus(status: string): Promise<ProductResponse[]> {
  const response = await fetch(`${API_BASE}/products/status/${status}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products by status: ${response.statusText}`);
  }

  return response.json();
}

// ============================================
// COMPANY PROFILE API CALLS
// ============================================

/**
 * Fetch company profile by user profile ID
 */
export async function getCompanyProfile(
  userProfileId: string
): Promise<CompanyProfileResponse> {
  const response = await fetch(
    `${API_BASE}/auth/company-profile/${userProfileId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch company profile: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update company profile information
 */
export async function updateCompanyProfile(
  companyProfileId: string,
  data: {
    headOfficeLocation?: string;
    ndaAgreed?: boolean;
    commonDetails?: {
      companyName?: string;
      contactPersonName?: string;
      contactPersonEmail?: string;
      websiteURL?: string;
      logoURL?: string;
    };
  }
): Promise<CompanyProfileResponse> {
  const response = await fetch(
    `${API_BASE}/auth/company-profile/${companyProfileId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update company profile');
  }

  return response.json();
}
