export type PartnerType = "individual" | "company"

export type ConnectionStatus = "connect" | "pending" | "connected"

export interface Product {
  id: number
  name: string
  company: string
  companyLogo: string
  productImage: string
  shortDescription: string
  industrySpecialization: string
  productType: "Product" | "Service"
  targetCustomers: string
  primaryRegions: string[]
  engagementMethod: string[]
  indicativeIncentive: string
  isBookmarked: boolean
  connectionStatus: ConnectionStatus
}

export interface FilterState {
  searchQuery: string
  selectedIndustry: string
  selectedProductType: string
  selectedRegion: string
  sortBy: string
}
