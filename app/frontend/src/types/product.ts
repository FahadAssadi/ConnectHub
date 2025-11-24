export interface Product {
  id: string
  companyId: string
  name: string
  productType: string
  shortDescription: string
  detailedDescription: string
  productImageUrl: string
  industrySpecializationId: string | null
  targetCustomerCategoryId: string | null
  targetCustomerSubCategoryId: string | null
  paymentModel: string
  indicativeIncentive: string
  salesTrainingAvailable: boolean
  isActive: boolean
  isPublished: boolean
  internalNotes: string | null
}
