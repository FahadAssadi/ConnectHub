import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Linkedin, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  const footerLinks = {
    company: [
      { name: "About ConnectHub", href: "/about" },
      { name: "How It Works", href: "/how-it-works" },
      { name: "Success Stories", href: "/success-stories" },
      { name: "Careers", href: "/careers" },
      { name: "Contact Us", href: "/contact" },
    ],
    businesses: [
      { name: "List Your Products", href: "/list-products" },
      { name: "Pricing", href: "/pricing" },
      { name: "Case Studies", href: "/case-studies" },
      { name: "Resource Center", href: "/resources" },
      { name: "Business Login", href: "/login/business" },
    ],
    partners: [
      { name: "Become a Partner", href: "/become-partner" },
      { name: "Partner Resources", href: "/partner-resources" },
      { name: "Training Materials", href: "/training" },
      { name: "Earnings Calculator", href: "/calculator" },
      { name: "Partner Login", href: "/login/partner" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Live Chat", href: "/chat" },
      { name: "Phone Support", href: "/support" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
    ],
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">CH</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg">ConnectHub</span>
                <span className="text-xs text-gray-400">Connecting Business. Empowering Growth.</span>
              </div>
            </Link>

            <p className="text-gray-400 text-sm mb-6">
              The global platform connecting businesses with qualified BD partners for performance-based growth.
            </p>

            
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Businesses */}
          <div>
            <h4 className="font-semibold mb-4">For Businesses</h4>
            <ul className="space-y-3">
              {footerLinks.businesses.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For BD Partners */}
          <div>
            <h4 className="font-semibold mb-4">For BD Partners</h4>
            <ul className="space-y-3">
              {footerLinks.partners.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3 mb-6">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                +61 2 8123 4567
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                hello@connecthub.com.au
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                Sydney, Australia
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-800 mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
            <p className="text-sm text-gray-400">© 2024 ConnectHub Pty Ltd. All rights reserved.</p>
            <p className="text-xs text-gray-500">ABN: 12 345 678 901 | Australian Business Registration</p>
          </div>

          <div className="flex items-center space-x-6">
            {/* Language/Region Selector */}
            <select className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-gray-400">
              <option>🇦🇺 Australia</option>
              <option>🇺🇸 United States</option>
              <option>🌍 Global</option>
            </select>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}