/**
 * Dashboard Types and Interfaces
 * Centralized type definitions for the company dashboard
 */

export enum ProductStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum ProductType {
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE',
  SOLUTION = 'SOLUTION',
}

export enum PaymentModel {
  ONE_TIME = 'ONE_TIME',
  RECURRING = 'RECURRING',
  COMMISSION = 'COMMISSION',
  HYBRID = 'HYBRID',
}

export interface YearsOfExperience {
  id: string;
  yearsRange: string;
  createdAt: string;
  updatedAt: string;
}

export interface EngagementModel {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface IndustryCategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface IndustrySubCategory {
  id: string;
  name: string;
  industryCategoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductTargetCustomerIndustry {
  id: string;
  productId: string;
  industryCategoryId?: string;
  industrySubCategoryId?: string;
  industryCategory?: IndustryCategory;
  industrySubCategory?: IndustrySubCategory;
  createdAt: string;
  updatedAt: string;
}

export interface ProductTargetRegion {
  id: string;
  productId: string;
  region: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSalesSupportMaterial {
  id: string;
  productId: string;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPreferredBDProfile {
  id: string;
  productId: string;
  industrySpecialisationId?: string;
  yearsOfExperienceId?: string;
  certificationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPreferredCertification {
  id: string;
  productId: string;
  certificationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommonCompanyDetails {
  id: string;
  companyName: string;
  contactPersonName?: string;
  contactPersonEmail?: string;
  websiteURL?: string;
  logoURL?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyProfile {
  id: string;
  userProfileId: string;
  commonDetailsId: string;
  commonDetails: CommonCompanyDetails;
  ndaAgreed: boolean;
  headOfficeLocation?: string;
  createdAt: string;
  updatedAt: string;
  profileIndustries?: any[];
  profileEngagements?: any[];
  profileTools?: any[];
  profileCertifications?: any[];
  products?: Product[];
}

export interface Product {
  id: string;
  companyProfileId: string;
  name: string;
  type: ProductType;
  status: ProductStatus;
  shortDescription: string;
  detailedDescription: string;
  imageURL?: string;
  paymentModel: PaymentModel;
  indicativeIncentive?: string;
  preferredYearsOfExperienceId?: string;
  preferredYearsOfExperience?: YearsOfExperience;
  engagementMethodId?: string;
  engagementMethod?: EngagementModel;
  salesTrainingAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  companyProfile: {
    id: string;
    commonDetails: {
      companyName: string;
      contactPersonName?: string;
      contactPersonEmail?: string;
      websiteURL?: string;
      logoURL?: string;
    };
  };
  productTargetCustomerIndustries?: ProductTargetCustomerIndustry[];
  productTargetRegions?: ProductTargetRegion[];
  productSalesSupportMaterials?: ProductSalesSupportMaterial[];
  productPreferredBDProfiles?: ProductPreferredBDProfile[];
  productPreferredCertifications?: ProductPreferredCertification[];
}

export interface CreateProductRequest {
  companyProfileId: string;
  name: string;
  type: ProductType | string;
  shortDescription: string;
  detailedDescription: string;
  imageURL?: string;
  paymentModel: PaymentModel | string;
  indicativeIncentive?: string;
  preferredYearsOfExperienceId?: string;
  engagementMethodId?: string;
  salesTrainingAvailable?: boolean;
  status?: ProductStatus | string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface UpdateCompanyProfileRequest {
  headOfficeLocation?: string;
  ndaAgreed?: boolean;
  commonDetails?: Partial<CommonCompanyDetails>;
}

// Dashboard Statistics
export interface ProductStats {
  total: number;
  draft: number;
  approved: number;
  avgIncentive: number;
}

// Product Card Props
export interface ProductCardProps {
  product: Product;
  onDelete?: (id: string) => void;
  onEdit?: (product: Product) => void;
}

// Product Form Props
export interface ProductFormProps {
  product?: Product;
  companyProfileId: string;
  onSubmit: (data: CreateProductRequest | UpdateProductRequest) => Promise<void>;
  isLoading?: boolean;
}

// Company Info Card Props
export interface CompanyInfoCardProps {
  company: CompanyProfile;
  onEdit?: () => void;
}

// Products List Props
export interface ProductsListProps {
  companyProfileId: string;
}

// Dashboard Props
export interface DashboardContextType {
  user: any;
  company: CompanyProfile | null;
  loading: boolean;
  error: string | null;
}

// Pagination
export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// API Error Response
export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

// Filter Options
export interface ProductFilters {
  searchTerm?: string;
  status?: ProductStatus;
  type?: ProductType;
  paymentModel?: PaymentModel;
}

// Sort Options
export type SortField = 'name' | 'createdAt' | 'updatedAt' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  field: SortField;
  order: SortOrder;
}
