import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Quote } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      type: "Business Owner",
      name: "Sarah Chen",
      company: "TechFlow Solutions",
      image: "/placeholder.svg?height=60&width=60",
      rating: 5,
      quote:
        "ConnectHub helped us expand to 3 new countries without hiring a single salesperson. Our revenue increased by 300% in just 8 months, and we only pay when deals close.",
      metrics: "300% revenue growth, 3 new markets",
    },
    {
      type: "BD Partner",
      name: "Michael Rodriguez",
      company: "Independent BD Consultant",
      image: "/placeholder.svg?height=60&width=60",
      rating: 5,
      quote:
        "I've earned more in 6 months with ConnectHub than I did in my previous sales job for the entire year. The flexibility and commission rates are unmatched.",
      metrics: "$85K earned in 6 months",
    },
    {
      type: "Customer",
      name: "David Kim",
      company: "GrowthCorp",
      image: "/placeholder.svg?height=60&width=60",
      rating: 5,
      quote:
        "The BD partner who reached out knew exactly what we needed. It felt like having a trusted advisor rather than being sold to. Found the perfect solution for our business.",
      metrics: "Perfect solution match",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Success Stories & Testimonials</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real results from businesses, partners, and customers
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="absolute top-4 right-4">
                  <Quote className="h-6 w-6 text-gray-300" />
                </div>

                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-blue-600">{testimonial.type}</span>
                </div>

                <blockquote className="text-gray-700 mb-6">"{testimonial.quote}"</blockquote>

                <div className="flex items-center">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.company}</div>
                    <div className="text-xs text-green-600 font-medium">{testimonial.metrics}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Case Study Spotlight */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <CardContent className="p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-sm font-medium text-blue-600 mb-2 block">CASE STUDY SPOTLIGHT</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  From Local to Global: How TechFlow Expanded to 5 Countries in 12 Months
                </h3>
                <p className="text-gray-600 mb-6">
                  Discover how a small Australian software company leveraged our BD partner network to achieve
                  international expansion without traditional hiring costs.
                </p>
                <Button variant="outline">Read Full Case Study</Button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">500%</div>
                  <p className="text-sm text-gray-600">Revenue Growth</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
                  <p className="text-sm text-gray-600">New Markets</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">12</div>
                  <p className="text-sm text-gray-600">BD Partners</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">$0</div>
                  <p className="text-sm text-gray-600">Hiring Costs</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}