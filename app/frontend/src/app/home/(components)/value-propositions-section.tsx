import { Card, CardContent } from "@/components/ui/card"
import {
  DollarSign,
  Globe,
  Shield,
  BarChart3,
  Megaphone,
  TrendingUp,
  Clock,
  Layers,
  Headphones,
  Mail,
  Target,
  Award,
} from "lucide-react"

export function ValuePropositionsSection() {
  const businessBenefits = [
    {
      icon: DollarSign,
      title: "No Upfront Costs",
      description: "Pay only when deals close",
    },
    {
      icon: Globe,
      title: "Global Market Access",
      description: "Reach customers in new regions",
    },
    {
      icon: Shield,
      title: "Qualified Partners",
      description: "Pre-vetted BD professionals",
    },
    {
      icon: BarChart3,
      title: "Full Transparency",
      description: "Real-time deal tracking and reporting",
    },
    {
      icon: Megaphone,
      title: "Marketing Support",
      description: "Partners get your sales materials",
    },
    {
      icon: TrendingUp,
      title: "Risk-Free Growth",
      description: "No employment contracts or benefits",
    },
  ]

  const partnerBenefits = [
    {
      icon: Clock,
      title: "Flexible Earning",
      description: "Work around your schedule",
    },
    {
      icon: Layers,
      title: "Multiple Products",
      description: "Represent various businesses simultaneously",
    },
    {
      icon: Headphones,
      title: "CRM Tools Included",
      description: "Professional sales management platform",
    },
    {
      icon: Mail,
      title: "Official Representation",
      description: "Business email and marketing materials",
    },
    {
      icon: Target,
      title: "High Commissions",
      description: "30-40% higher than employee rates",
    },
    {
      icon: Award,
      title: "Global Opportunities",
      description: "Access products from worldwide businesses",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* For Businesses */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Scale Without the Sales Team Overhead</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Expand your business globally without the traditional costs and complexities of hiring
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessBenefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <benefit.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* For BD Partners */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Turn Your Network Into Income</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Leverage your professional relationships and expertise to generate substantial income
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerBenefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                    <benefit.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
