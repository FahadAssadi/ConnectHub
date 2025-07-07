"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, Send, FileText, X } from "lucide-react" // Added X for close icon
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog" // Dialog components
import { Label } from "@/components/ui/label" // Label component
import { Textarea } from "@/components/ui/textarea" // Textarea component
import { Checkbox } from "@/components/ui/checkbox" // Checkbox component
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group" // Radio Group for Yes/No options


// Define a type for a Product
interface Product {
  id: number;
  name: string;
  type: string;
  industry: string;
  status: "Approved" | "Pending Review" | "Draft" | "Rejected";
  activeBDPartners: number;
  dateAdded: string;
  statusColor: string; // Tailwind CSS classes
  shortDescription?: string;
  detailedDescription?: string;
  targetCustomers?: string; // Comma-separated
  primaryRegions?: string; // Comma-separated
  brochureUrl?: string; // Placeholder for file upload
  demoVideoLink?: string;
  pricingInfo?: string;
  preferredBdPartnerProfile?: string; // Comma-separated
  natureOfEngagementDesired?: string; // Comma-separated
  hasSalesCollateral?: "yes" | "no";
  salesCollateralDetails?: string;
  isVisibleToBdPartners?: "yes" | "no";
  internalNotes?: string;
}

export function MyProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [showAddProductDialog, setShowAddProductDialog] = useState(false)
  const [showProductDetailsDialog, setShowProductDetailsDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Cloud Analytics Platform",
      type: "SaaS",
      industry: "Software",
      status: "Approved",
      activeBDPartners: 3,
      dateAdded: "2024-01-15",
      statusColor: "bg-green-100 text-green-800",
      shortDescription: "A powerful platform for real-time data analytics.",
      detailedDescription: "Offers advanced dashboards, custom reports, and predictive analytics capabilities. Integrates with various data sources.",
      targetCustomers: "Enterprises, SMEs",
      primaryRegions: "North America, Europe",
      brochureUrl: "/docs/cloud-analytics-brochure.pdf",
      demoVideoLink: "https://youtube.com/watch?v=cloud-analytics-demo",
      pricingInfo: "Starts at $500/month for basic plan.",
      preferredBdPartnerProfile: "SaaS Sales, Data Analytics, Enterprise Software",
      natureOfEngagementDesired: "Lead Generation, Reseller",
      hasSalesCollateral: "yes",
      salesCollateralDetails: "Full marketing deck and training videos available.",
      isVisibleToBdPartners: "yes",
      internalNotes: "High commission potential."
    },
    {
      id: 2,
      name: "Smart Home Security System",
      type: "Hardware",
      industry: "Technology",
      status: "Approved",
      activeBDPartners: 2,
      dateAdded: "2024-01-10",
      statusColor: "bg-green-100 text-green-800",
      shortDescription: "Integrated smart home security with AI detection.",
      detailedDescription: "Features include motion sensors, smart cameras, remote monitoring via app, and seamless integration with other smart devices.",
      targetCustomers: "Consumers",
      primaryRegions: "Australia, New Zealand",
      brochureUrl: "/docs/smart-home-brochure.pdf",
      demoVideoLink: "",
      pricingInfo: "$299 for basic kit, subscription for monitoring services.",
      preferredBdPartnerProfile: "Consumer Electronics, Retail Network",
      natureOfEngagementDesired: "Referrals, Reseller",
      hasSalesCollateral: "yes",
      salesCollateralDetails: "Product brochures and demo units can be provided.",
      isVisibleToBdPartners: "yes",
      internalNotes: ""
    },
    {
      id: 3,
      name: "AI-Powered CRM Platform",
      type: "SaaS",
      industry: "Software",
      status: "Pending Review",
      activeBDPartners: 0,
      dateAdded: "2024-01-20",
      statusColor: "bg-yellow-100 text-yellow-800",
      shortDescription: "CRM with integrated AI for sales forecasting and customer insights.",
      detailedDescription: "Automates lead nurturing, provides predictive sales analytics, and streamlines customer service operations. Customizable workflows.",
      targetCustomers: "SMEs, Enterprises",
      primaryRegions: "Global",
      brochureUrl: "",
      demoVideoLink: "",
      pricingInfo: "Tiered pricing based on user count.",
      preferredBdPartnerProfile: "Software Sales, CRM Implementation",
      natureOfEngagementDesired: "Lead Generation",
      hasSalesCollateral: "no",
      salesCollateralDetails: "",
      isVisibleToBdPartners: "yes",
      internalNotes: "Waiting for marketing team to finalize brochures."
    },
    {
      id: 4,
      name: "Manufacturing Optimization Software",
      type: "Software",
      industry: "Manufacturing",
      status: "Draft",
      activeBDPartners: 0,
      dateAdded: "2024-01-22",
      statusColor: "bg-gray-100 text-gray-800",
      shortDescription: "Software to optimize manufacturing processes and reduce waste.",
      detailedDescription: "Monitors production lines, identifies bottlenecks, optimizes resource allocation, and provides real-time performance dashboards.",
      targetCustomers: "Manufacturing Plants",
      primaryRegions: "Europe, Asia",
      brochureUrl: "",
      demoVideoLink: "",
      pricingInfo: "Custom quotes based on factory size.",
      preferredBdPartnerProfile: "Industrial Automation, Process Optimization",
      natureOfEngagementDesired: "Referrals",
      hasSalesCollateral: "no",
      salesCollateralDetails: "",
      isVisibleToBdPartners: "no",
      internalNotes: "Needs more detailed product features to be added."
    },
    {
      id: 5,
      name: "Healthcare Data Analytics",
      type: "SaaS",
      industry: "Healthcare",
      status: "Rejected",
      activeBDPartners: 0,
      dateAdded: "2024-01-05",
      statusColor: "bg-red-100 text-red-800",
      shortDescription: "Platform for secure and compliant healthcare data analysis.",
      detailedDescription: "Assists healthcare providers with patient outcome analysis, operational efficiency, and regulatory compliance reporting.",
      targetCustomers: "Hospitals, Clinics",
      primaryRegions: "North America",
      brochureUrl: "/docs/healthcare-data-rejected.pdf",
      demoVideoLink: "",
      pricingInfo: "Subscription based on data volume.",
      preferredBdPartnerProfile: "Healthcare IT, Data Science",
      natureOfEngagementDesired: "Lead Generation",
      hasSalesCollateral: "yes",
      salesCollateralDetails: "Full documentation available.",
      isVisibleToBdPartners: "yes",
      internalNotes: "Rejected due to missing regulatory compliance documentation."
    },
  ]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.detailedDescription?.toLowerCase().includes(searchTerm.toLowerCase())


    const matchesStatus = statusFilter === "all" || product.status.toLowerCase().replace(" ", "-") === statusFilter
    const matchesIndustry = industryFilter === "all" || product.industry.toLowerCase() === industryFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesIndustry
  })

  type ActionButton = {
    label: string
    icon: React.ElementType
    action: () => void
    destructive?: boolean
  }

  const getActionButtons = (product: Product): ActionButton[] => {
    const baseActions: ActionButton[] = [
      { label: "View Details", icon: Eye, action: () => { setSelectedProduct(product); setShowProductDetailsDialog(true); } },
      { label: "Edit", icon: Edit, action: () => console.log("Edit", product.id) }, // In a real app, this would open the AddProductDialog with pre-filled data
    ]

    if (product.status === "Draft") {
      baseActions.push({
        label: "Submit for Review",
        icon: FileText,
        action: () => {
          console.log("Submit", product.id);
          // In a real app, this would update product status to "Pending Review"
          setProducts(products.map(p => p.id === product.id ? { ...p, status: "Pending Review", statusColor: "bg-yellow-100 text-yellow-800" } : p));
        },
      })
    }

    if (product.status === "Approved") {
      baseActions.push({
        label: "View EOIs",
        icon: Send,
        action: () => console.log("View EOIs", product.id), // Navigate to EOIs specific to this product
      })
    }

    baseActions.push({
      label: "Delete",
      icon: Trash2,
      action: () => {
        if (confirm(`Are you sure you want to delete ${product.name}?`)) {
          setProducts(products.filter(p => p.id !== product.id));
          console.log("Delete", product.id);
        }
      },
      destructive: true,
    })

    return baseActions
  }

  const handleAddProduct = (newProductData: Omit<Product, 'id' | 'status' | 'statusColor' | 'activeBDPartners' | 'dateAdded'>) => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct: Product = {
      id: newId,
      ...newProductData,
      status: "Draft", // New products start as Draft
      statusColor: "bg-gray-100 text-gray-800",
      activeBDPartners: 0,
      dateAdded: new Date().toISOString().split('T')[0], // Current date
    };
    setProducts([...products, newProduct]);
    setShowAddProductDialog(false);
    console.log("Added new product:", newProduct);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-600">Manage and view all your listed products</p>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={() => setShowAddProductDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Product
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending-review">Pending Review</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                {/* Add more industries as needed */}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Active BD Partners</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.type}</TableCell>
                    <TableCell>{product.industry}</TableCell>
                    <TableCell>
                      <Badge className={product.statusColor}>{product.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span>{product.activeBDPartners}</span>
                        {product.activeBDPartners > 0 && (
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            View
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(product.dateAdded).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {getActionButtons(product).map((action, index) => {
                            const IconComponent = action.icon
                            return (
                              <DropdownMenuItem
                                key={index}
                                onClick={action.action}
                                className={action.destructive ? "text-red-600" : ""}
                              >
                                <IconComponent className="h-4 w-4 mr-2" />
                                {action.label}
                              </DropdownMenuItem>
                            )
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No products found matching your criteria.</p>
              <Button variant="outline" className="mt-4" onClick={() => setShowAddProductDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <AddProductDialog
        isOpen={showAddProductDialog}
        onClose={() => setShowAddProductDialog(false)}
        onSave={handleAddProduct}
      />

      {/* Product Details Dialog */}
      {selectedProduct && (
        <ProductDetailsDialog
          isOpen={showProductDetailsDialog}
          onClose={() => { setSelectedProduct(null); setShowProductDetailsDialog(false); }}
          product={selectedProduct}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------
// Add Product Dialog Component
// ---------------------------------------------------
interface AddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'status' | 'statusColor' | 'activeBDPartners' | 'dateAdded'>) => void;
}

function AddProductDialog({ isOpen, onClose, onSave }: AddProductDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [targetCustomers, setTargetCustomers] = useState("");
  const [primaryRegions, setPrimaryRegions] = useState("");
  const [brochureUrl, setBrochureUrl] = useState(""); // Simplified for URL, would be file upload handling
  const [demoVideoLink, setDemoVideoLink] = useState("");
  const [pricingInfo, setPricingInfo] = useState("");
  const [preferredBdPartnerProfile, setPreferredBdPartnerProfile] = useState("");
  const [natureOfEngagementDesired, setNatureOfEngagementDesired] = useState("");
  const [hasSalesCollateral, setHasSalesCollateral] = useState<"yes" | "no">("no");
  const [salesCollateralDetails, setSalesCollateralDetails] = useState("");
  const [isVisibleToBdPartners, setIsVisibleToBdPartners] = useState<"yes" | "no">("yes");
  const [internalNotes, setInternalNotes] = useState("");

  const resetForm = () => {
    setName("");
    setType("");
    setShortDescription("");
    setDetailedDescription("");
    setIndustry("");
    setTargetCustomers("");
    setPrimaryRegions("");
    setBrochureUrl("");
    setDemoVideoLink("");
    setPricingInfo("");
    setPreferredBdPartnerProfile("");
    setNatureOfEngagementDesired("");
    setHasSalesCollateral("no");
    setSalesCollateralDetails("");
    setIsVisibleToBdPartners("yes");
    setInternalNotes("");
  };

  const handleSubmit = () => {
    if (!name || !type || !shortDescription || !detailedDescription || !industry) {
      alert("Please fill in all mandatory fields: Product Name, Product Type, Short Description, Detailed Description, and Industry.");
      return;
    }

    const newProduct = {
      name,
      type,
      shortDescription,
      detailedDescription,
      industry,
      targetCustomers,
      primaryRegions,
      brochureUrl: brochureUrl === '' ? undefined : brochureUrl,
      demoVideoLink: demoVideoLink === '' ? undefined : demoVideoLink,
      pricingInfo: pricingInfo === '' ? undefined : pricingInfo,
      preferredBdPartnerProfile: preferredBdPartnerProfile === '' ? undefined : preferredBdPartnerProfile,
      natureOfEngagementDesired: natureOfEngagementDesired === '' ? undefined : natureOfEngagementDesired,
      hasSalesCollateral,
      salesCollateralDetails: salesCollateralDetails === '' ? undefined : salesCollateralDetails,
      isVisibleToBdPartners,
      internalNotes: internalNotes === '' ? undefined : internalNotes,
    };
    onSave(newProduct);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); resetForm(); } }}>
      <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details for your new product or service.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Section 1: Product/Service Info */}
          <h3 className="text-lg font-semibold border-b pb-2 mb-2">1. Product/Service Info</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product or Service Name <span className="text-red-500">*</span></Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Product Type <span className="text-red-500">*</span></Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Service">Service</SelectItem>
                  <SelectItem value="SaaS">SaaS</SelectItem>
                  <SelectItem value="Hardware">Hardware</SelectItem>
                  <SelectItem value="Software">Software</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description <span className="text-red-500">*</span></Label>
            <Input id="shortDescription" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="detailedDescription">Detailed Description / Key Features <span className="text-red-500">*</span></Label>
            <Textarea id="detailedDescription" value={detailedDescription} onChange={(e) => setDetailedDescription(e.target.value)} className="min-h-[100px]" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry Category <span className="text-red-500">*</span></Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Software">Software</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Real Estate">Real Estate</SelectItem>
                <SelectItem value="FMCG">FMCG</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                {/* Add more industries here */}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetCustomers">Target Customers (e.g., SMEs, Enterprises, Consumers, Gov, etc. - comma-separated)</Label>
            <Input id="targetCustomers" value={targetCustomers} onChange={(e) => setTargetCustomers(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="primaryRegions">Primary Regions / Markets (e.g., North America, Europe - comma-separated)</Label>
            <Input id="primaryRegions" value={primaryRegions} onChange={(e) => setPrimaryRegions(e.target.value)} />
          </div>

          {/* Section 2: Sales Support Materials */}
          <h3 className="text-lg font-semibold border-b pb-2 mb-2 mt-6">2. Sales Support Materials</h3>
          <div className="space-y-2">
            <Label htmlFor="brochureUrl">Upload Brochure / Datasheet (URL or Placeholder)</Label>
            {/* In a real app, this would be an actual file upload component */}
            <Input id="brochureUrl" type="url" placeholder="Enter URL or indicate file upload" value={brochureUrl} onChange={(e) => setBrochureUrl(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demoVideoLink">Upload Demo Video / Link (URL)</Label>
            <Input id="demoVideoLink" type="url" placeholder="Enter YouTube or Vimeo link" value={demoVideoLink} onChange={(e) => setDemoVideoLink(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pricingInfo">Pricing Info (e.g., "Starts at $500/month", "Custom quotes")</Label>
            <Textarea id="pricingInfo" value={pricingInfo} onChange={(e) => setPricingInfo(e.target.value)} className="min-h-[60px]" />
          </div>

          {/* Section 3: BD Engagement Details */}
          <h3 className="text-lg font-semibold border-b pb-2 mb-2 mt-6">3. BD Engagement Details</h3>
          <div className="space-y-2">
            <Label htmlFor="preferredBdPartnerProfile">Preferred BD Partner Profile (e.g., SaaS Sales, Data Analytics - comma-separated)</Label>
            <Input id="preferredBdPartnerProfile" value={preferredBdPartnerProfile} onChange={(e) => setPreferredBdPartnerProfile(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="natureOfEngagementDesired">Nature of Engagement Desired (e.g., Lead Generation, Reseller, Referrals - comma-separated)</Label>
            <Input id="natureOfEngagementDesired" value={natureOfEngagementDesired} onChange={(e) => setNatureOfEngagementDesired(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Available Sales Collateral / Training to Support BD Partner</Label>
            <RadioGroup value={hasSalesCollateral} onValueChange={(value: "yes" | "no") => setHasSalesCollateral(value)} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="hasCollateralYes" />
                <Label htmlFor="hasCollateralYes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="hasCollateralNo" />
                <Label htmlFor="hasCollateralNo">No</Label>
              </div>
            </RadioGroup>
            {hasSalesCollateral === "yes" && (
              <Textarea placeholder="Provide details about available collateral/training..." value={salesCollateralDetails} onChange={(e) => setSalesCollateralDetails(e.target.value)} className="min-h-[60px]" />
            )}
          </div>

          {/* Section 4: Visibility Settings */}
          <h3 className="text-lg font-semibold border-b pb-2 mb-2 mt-6">4. Visibility Settings</h3>
          <div className="space-y-2">
            <Label>Make this product/service visible to BD Partners</Label>
            <RadioGroup value={isVisibleToBdPartners} onValueChange={(value: "yes" | "no") => setIsVisibleToBdPartners(value)} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="visibleYes" />
                <Label htmlFor="visibleYes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="visibleNo" />
                <Label htmlFor="visibleNo">No</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="internalNotes">Internal Notes (only visible to ConnectHub team)</Label>
            <Textarea id="internalNotes" value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} className="min-h-[80px]" />
          </div>

        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------
// Product Details Dialog Component
// ---------------------------------------------------
interface ProductDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

function ProductDetailsDialog({ isOpen, onClose, product }: ProductDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{product.name} Details</DialogTitle>
          <DialogDescription>
            Comprehensive information about your product.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="font-semibold">Product ID:</div>
            <div>{product.id}</div>

            <div className="font-semibold">Status:</div>
            <div><Badge className={product.statusColor}>{product.status}</Badge></div>

            <div className="font-semibold">Type:</div>
            <div>{product.type}</div>

            <div className="font-semibold">Industry:</div>
            <div>{product.industry}</div>

            <div className="font-semibold">Date Added:</div>
            <div>{new Date(product.dateAdded).toLocaleDateString()}</div>

            <div className="font-semibold">Active BD Partners:</div>
            <div>{product.activeBDPartners}</div>
          </div>

          <hr className="my-4" />

          <div className="space-y-2">
            <h4 className="font-semibold">Short Description:</h4>
            <p>{product.shortDescription || "N/A"}</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Detailed Description / Key Features:</h4>
            <p className="whitespace-pre-wrap">{product.detailedDescription || "N/A"}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="font-semibold">Target Customers:</div>
            <div>{product.targetCustomers || "N/A"}</div>

            <div className="font-semibold">Primary Regions / Markets:</div>
            <div>{product.primaryRegions || "N/A"}</div>
          </div>

          <hr className="my-4" />

          <h3 className="text-md font-semibold">Sales Support Materials</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="font-semibold">Brochure / Datasheet:</div>
            <div>
              {product.brochureUrl ? (
                <a href={product.brochureUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Brochure</a>
              ) : "N/A"}
            </div>

            <div className="font-semibold">Demo Video / Link:</div>
            <div>
              {product.demoVideoLink ? (
                <a href={product.demoVideoLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Watch Demo</a>
              ) : "N/A"}
            </div>

            <div className="font-semibold">Pricing Info:</div>
            <div className="col-span-2 whitespace-pre-wrap">{product.pricingInfo || "N/A"}</div>
          </div>

          <hr className="my-4" />

          <h3 className="text-md font-semibold">BD Engagement Details</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="font-semibold">Preferred BD Partner Profile:</div>
            <div>{product.preferredBdPartnerProfile || "N/A"}</div>

            <div className="font-semibold">Nature of Engagement Desired:</div>
            <div>{product.natureOfEngagementDesired || "N/A"}</div>

            <div className="font-semibold">Available Sales Collateral / Training:</div>
            <div>{product.hasSalesCollateral === "yes" ? "Yes" : "No"}</div>

            {product.hasSalesCollateral === "yes" && product.salesCollateralDetails && (
              <>
                <div className="font-semibold col-span-2">Details:</div>
                <div className="col-span-2 whitespace-pre-wrap">{product.salesCollateralDetails}</div>
              </>
            )}
          </div>

          <hr className="my-4" />

          <h3 className="text-md font-semibold">Visibility & Internal Notes</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="font-semibold">Visible to BD Partners:</div>
            <div>{product.isVisibleToBdPartners === "yes" ? "Yes" : "No"}</div>

            <div className="font-semibold">Internal Notes:</div>
            <div className="col-span-2 whitespace-pre-wrap">{product.internalNotes || "N/A"}</div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}