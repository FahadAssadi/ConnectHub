"use client"

import { useState, useEffect, useCallback } from "react"
import { useInView } from "react-intersection-observer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Star, 
  Clock, 
  Search,
  Filter,
  Bookmark,
  Share2,
  Eye,
  TrendingUp,
  Award,
  Globe,
  Briefcase
} from "lucide-react"

// Mock data - In real app, this would come from API
const generateMockProducts = (page: number, limit: number = 10) => {
  const companies = [
    { name: "TechFlow Solutions", logo: "🚀", rating: 4.8, employees: "500-1000", industry: "Technology" },
    { name: "GreenEnergy Corp", logo: "🌱", rating: 4.6, employees: "1000-5000", industry: "Energy" },
    { name: "FinanceFirst", logo: "💰", rating: 4.7, employees: "200-500", industry: "Finance" },
    { name: "HealthPlus Medical", logo: "⚕️", rating: 4.9, employees: "100-200", industry: "Healthcare" },
    { name: "EduTech Innovations", logo: "📚", rating: 4.5, employees: "50-100", industry: "Education" },
    { name: "RetailMax", logo: "🛍️", rating: 4.4, employees: "2000+", industry: "Retail" },
    { name: "CloudSync Systems", logo: "☁️", rating: 4.8, employees: "300-500", industry: "Technology" },
    { name: "AutoDrive Innovations", logo: "🚗", rating: 4.6, employees: "1000-2000", industry: "Automotive" }
  ]

  const productTypes = [
    "Software Development", "Marketing Campaign", "Data Analysis", "Consulting Services",
    "Mobile App Development", "Cloud Migration", "Digital Transformation", "Business Intelligence",
    "Cybersecurity Audit", "Web Development", "AI/ML Solutions", "E-commerce Platform"
  ]

  const locations = [
    "San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA", "Boston, MA",
    "Chicago, IL", "Los Angeles, CA", "Denver, CO", "Remote", "Hybrid"
  ]

  const urgencyLevels = ["High", "Medium", "Low"]
  const budgetRanges = ["$5K-$10K", "$10K-$25K", "$25K-$50K", "$50K-$100K", "$100K+"]

  return Array.from({ length: limit }, (_, i) => {
    const company = companies[Math.floor(Math.random() * companies.length)]
    const productType = productTypes[Math.floor(Math.random() * productTypes.length)]
    const id = page * limit + i + 1
    
    return {
      id,
      title: productType,
      company: company,
      description: `We are looking for an experienced partner to help us deliver a comprehensive ${productType.toLowerCase()} solution. This is a great opportunity to work with our innovative team and make a significant impact on our business growth.`,
      location: locations[Math.floor(Math.random() * locations.length)],
      budget: budgetRanges[Math.floor(Math.random() * budgetRanges.length)],
      duration: `${Math.floor(Math.random() * 6) + 1}-${Math.floor(Math.random() * 6) + 6} months`,
      urgency: urgencyLevels[Math.floor(Math.random() * urgencyLevels.length)],
      postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: Math.floor(Math.random() * 50) + 5,
      views: Math.floor(Math.random() * 500) + 50,
      isBookmarked: Math.random() > 0.8,
      isFeatured: Math.random() > 0.85,
      skills: Array.from({ length: Math.floor(Math.random() * 5) + 3 }, () => {
        const skills = ["React", "Node.js", "Python", "AWS", "Docker", "TypeScript", "MongoDB", "PostgreSQL", "GraphQL", "Kubernetes", "Machine Learning", "Data Science", "UI/UX Design", "Product Management", "Digital Marketing", "SEO", "Content Strategy"]
        return skills[Math.floor(Math.random() * skills.length)]
      }).filter((skill, index, arr) => arr.indexOf(skill) === index),
      matchScore: Math.floor(Math.random() * 40) + 60 // 60-100% match
    }
  })
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("")
  const [selectedBudget, setSelectedBudget] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px"
  })

  // Initial load
  useEffect(() => {
    loadProducts(0, true)
  }, [])

  // Load more when in view
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadProducts(page + 1)
    }
  }, [inView, hasMore, loading, page])

  const loadProducts = useCallback(async (pageToLoad: number, reset = false) => {
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const newProducts = generateMockProducts(pageToLoad, 10)
    
    if (reset) {
      setProducts(newProducts)
    } else {
      setProducts(prev => [...prev, ...newProducts])
    }
    
    setPage(pageToLoad)
    setHasMore(pageToLoad < 10) // Simulate finite data
    setLoading(false)
  }, [])

  const getTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ago`
    return `${hours}h ago`
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High": return "destructive"
      case "Medium": return "default"
      case "Low": return "secondary"
      default: return "default"
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600"
    if (score >= 70) return "text-blue-600"
    return "text-gray-600"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
                <p className="text-gray-600">Discover opportunities and grow your business</p>
              </div>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search for products, services, companies..."
                className="pl-10 pr-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedBudget} onValueChange={setSelectedBudget}>
                    <SelectTrigger>
                      <SelectValue placeholder="Budget Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5k-10k">$5K - $10K</SelectItem>
                      <SelectItem value="10k-25k">$10K - $25K</SelectItem>
                      <SelectItem value="25k-50k">$25K - $50K</SelectItem>
                      <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                      <SelectItem value="100k+">$100K+</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="onsite">On-site</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={() => {
                    setSelectedIndustry("")
                    setSelectedBudget("")
                    setSelectedLocation("")
                  }}>
                    Clear All
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Opportunities</span>
                  <span className="font-semibold">2,847</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New This Week</span>
                  <span className="font-semibold text-green-600">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg. Budget</span>
                  <span className="font-semibold">$45K</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border mt-6">
              <h3 className="font-semibold mb-4">Trending Skills</h3>
              <div className="flex flex-wrap gap-2">
                {["React", "AI/ML", "Cloud", "Mobile", "Blockchain", "Data Science"].map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Product Listings */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {products.map((product, index) => (
                <Card key={`${product.id}-${index}`} className={`transition-all hover:shadow-md ${product.isFeatured ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="text-3xl">{product.company.logo}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold hover:text-blue-600 cursor-pointer">
                              {product.title}
                            </h3>
                            {product.isFeatured && (
                              <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              <span className="font-medium">{product.company.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{product.company.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{product.company.employees}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="mb-3">
                            {product.company.industry}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`text-sm font-medium ${getMatchScoreColor(product.matchScore)}`}>
                          {product.matchScore}% match
                        </div>
                        <Button variant="ghost" size="sm">
                          <Bookmark className={`w-4 h-4 ${product.isBookmarked ? 'fill-current' : ''}`} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {product.skills.map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{product.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span>{product.budget}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{product.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <Badge variant={getUrgencyColor(product.urgency)} className="text-xs">
                          {product.urgency} Priority
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{product.views} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{product.applicants} applicants</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{getTimeAgo(product.postedDate)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Learn More
                        </Button>
                        <Button size="sm">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading more opportunities...</span>
                </div>
              )}

              {/* Infinite scroll trigger */}
              <div ref={ref} className="h-10" />

              {/* End of results */}
              {!hasMore && products.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">You've reached the end of the listings!</p>
                  <Button variant="outline" className="mt-4" onClick={() => {
                    setPage(0)
                    setHasMore(true)
                    loadProducts(0, true)
                  }}>
                    Load Fresh Content
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
