import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Business Network</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with companies and business development partners to grow your business opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Company Registration</CardTitle>
              <CardDescription className="text-base">
                Register your company to showcase products and services, connect with BD partners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <ArrowRight className="w-4 h-4 mr-2 text-green-500" />
                  Quick initial setup with basic company info
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ArrowRight className="w-4 h-4 mr-2 text-green-500" />
                  Complete profile with products and services
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ArrowRight className="w-4 h-4 mr-2 text-green-500" />
                  Get matched with qualified BD partners
                </div>
              </div>
              <Link href="/register/company/stage1">
                <Button className="w-full" size="lg">
                  Register as Company
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">BD Partner Registration</CardTitle>
              <CardDescription className="text-base">
                Join as a business development partner to connect companies with opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <ArrowRight className="w-4 h-4 mr-2 text-green-500" />
                  Individual or company partner options
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ArrowRight className="w-4 h-4 mr-2 text-green-500" />
                  Showcase your expertise and experience
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ArrowRight className="w-4 h-4 mr-2 text-green-500" />
                  Access to qualified business opportunities
                </div>
              </div>
              <Link href="/register/bd-partner">
                <Button className="w-full bg-transparent" size="lg" variant="outline">
                  Register as BD Partner
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
