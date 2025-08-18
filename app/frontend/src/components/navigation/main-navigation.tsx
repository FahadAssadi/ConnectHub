"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Home, Search, Users, Building2, User, Bell, Settings } from "lucide-react"

export default function MainNavigation() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CH</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ConnectHub</span>
          </Link>

          {/* Main Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex space-x-1">
              <NavigationMenuItem>
                <Link href="/home" legacyBehavior passHref>
                  <NavigationMenuLink className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/home') 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}>
                    <Home className="w-4 h-4 inline mr-2" />
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/marketplace" legacyBehavior passHref>
                  <NavigationMenuLink className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/marketplace') 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}>
                    <Search className="w-4 h-4 inline mr-2" />
                    Marketplace
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-600 hover:text-gray-900">
                  <Building2 className="w-4 h-4 inline mr-2" />
                  Companies
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-48 p-2">
                    <Link href="/companies" className="block px-3 py-2 text-sm rounded hover:bg-gray-100">
                      Browse Companies
                    </Link>
                    <Link href="/companies/featured" className="block px-3 py-2 text-sm rounded hover:bg-gray-100">
                      Featured Companies
                    </Link>
                    <Link href="/companies/new" className="block px-3 py-2 text-sm rounded hover:bg-gray-100">
                      Recently Joined
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-600 hover:text-gray-900">
                  <Users className="w-4 h-4 inline mr-2" />
                  Network
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-48 p-2">
                    <Link href="/network/connections" className="block px-3 py-2 text-sm rounded hover:bg-gray-100">
                      My Connections
                    </Link>
                    <Link href="/network/discover" className="block px-3 py-2 text-sm rounded hover:bg-gray-100">
                      Discover People
                    </Link>
                    <Link href="/network/invitations" className="block px-3 py-2 text-sm rounded hover:bg-gray-100">
                      Invitations
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">3</span>
              </span>
            </Button>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-48 p-2">
                      <div className="px-3 py-2 border-b border-gray-200 mb-2">
                        <p className="text-sm font-medium">John Doe</p>
                        <p className="text-xs text-gray-500">john@example.com</p>
                      </div>
                      <Link href="/profile" className="block px-3 py-2 text-sm rounded hover:bg-gray-100">
                        View Profile
                      </Link>
                      <Link href="/dashboard" className="block px-3 py-2 text-sm rounded hover:bg-gray-100">
                        Dashboard
                      </Link>
                      <Link href="/settings" className="block px-3 py-2 text-sm rounded hover:bg-gray-100">
                        <Settings className="w-4 h-4 inline mr-2" />
                        Settings
                      </Link>
                      <hr className="my-2" />
                      <button className="block w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 text-red-600">
                        Sign Out
                      </button>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t bg-white px-4 py-2">
        <div className="flex justify-around">
          <Link href="/home" className={`flex flex-col items-center py-2 px-3 rounded ${
            isActive('/home') ? 'text-blue-600' : 'text-gray-600'
          }`}>
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/marketplace" className={`flex flex-col items-center py-2 px-3 rounded ${
            isActive('/marketplace') ? 'text-blue-600' : 'text-gray-600'
          }`}>
            <Search className="w-5 h-5" />
            <span className="text-xs mt-1">Market</span>
          </Link>
          <Link href="/network" className={`flex flex-col items-center py-2 px-3 rounded ${
            isActive('/network') ? 'text-blue-600' : 'text-gray-600'
          }`}>
            <Users className="w-5 h-5" />
            <span className="text-xs mt-1">Network</span>
          </Link>
          <Link href="/profile" className={`flex flex-col items-center py-2 px-3 rounded ${
            isActive('/profile') ? 'text-blue-600' : 'text-gray-600'
          }`}>
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
