import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, CheckCircle, Clock, Phone, Scale } from "lucide-react"

export function SecurityTrustSection() {
  const trustElements = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SSL encryption and data protection certifications",
      badge: "SOC 2 Compliant",
    },
    {
      icon: CheckCircle,
      title: "Verified Partners",
      description: "All BD partners undergo comprehensive verification",
      badge: "Background Checked",
    },
    {
      icon: Lock,
      title: "Secure Payments",
      description: "Secure escrow system protects all transactions",
      badge: "PCI DSS Certified",
    },
    {
      icon: Scale,
      title: "Legal Compliance",
      description: "Fully compliant with Australian business regulations",
      badge: "ACCC Compliant",
    },
  ]

  const riskMitigation = [
    {
      icon: Clock,
      title: "30-day money-back guarantee for businesses",
      description: "Full refund if not satisfied with results",
    },
    {
      icon: CheckCircle,
      title: "Dispute resolution system",
      description: "Fair and transparent conflict resolution process",
    },
    {
      icon: Phone,
      title: "24/7 support during deal negotiations",
      description: "Expert assistance when you need it most",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Security & Trust</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your business and data are protected by enterprise-grade security
          </p>
        </div>

        {/* Trust Building Elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustElements.map((element, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
                  <element.icon className="h-6 w-6 text-green-600" />
                </div>
                <Badge variant="secondary" className="mb-3">
                  {element.badge}
                </Badge>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{element.title}</h3>
                <p className="text-sm text-gray-600">{element.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Risk Mitigation */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">Risk Mitigation</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {riskMitigation.map((item, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Security Badges */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 mb-6">Trusted by industry leaders</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="h-12 w-20 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">SSL</span>
            </div>
            <div className="h-12 w-20 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">SOC 2</span>
            </div>
            <div className="h-12 w-20 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">PCI DSS</span>
            </div>
            <div className="h-12 w-20 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">ISO 27001</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
