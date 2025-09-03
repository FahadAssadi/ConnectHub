"use client";

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, ArrowRight, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const registrationTypes = [
    {
      type: 'bd_partner',
      title: 'Business Development Partner',
      description: 'Individual professionals helping companies expand their business networks and partnerships',
      icon: Users,
      href: '/register/bd-partner',
      features: [
        'Connect companies with potential partners',
        'Earn commission from successful partnerships',
        'Access to global business network',
        'Flexible working arrangements',
      ],
      badge: 'Individual',
      color: 'blue',
    },
    {
      type: 'company',
      title: 'Company',
      description: 'Businesses looking to expand through strategic partnerships and collaborations',
      icon: Building2,
      href: '/register/company',
      features: [
        'Find qualified business partners',
        'Access vetted BD professionals',
        'Streamlined partnership process',
        'Global market expansion',
      ],
      badge: 'Business',
      color: 'green',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join ConnectHub
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your registration type to start building meaningful business partnerships and expand your network globally.
          </p>
        </div>

        {/* Registration Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {registrationTypes.map((option) => {
            const Icon = option.icon;
            
            return (
              <Card 
                key={option.type} 
                className="relative overflow-hidden border-2 hover:border-blue-300 transition-all duration-200 hover:shadow-lg"
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  
                  <div className="space-y-2">
                    <Badge 
                      variant="secondary" 
                      className={`${option.color === 'blue' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
                    >
                      {option.badge}
                    </Badge>
                    <CardTitle className="text-xl">{option.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {option.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 text-sm">What you get:</h4>
                    <ul className="space-y-2">
                      {option.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* CTA Button */}
                  <Link href={option.href} className="block">
                    <Button 
                      className="w-full flex items-center justify-center group hover:bg-blue-700" 
                      size="lg"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12 space-y-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign in here
            </Link>
          </p>
          
          <div className="flex items-center justify-center space-x-8 text-xs text-gray-500">
            <span>🔒 Secure Registration</span>
            <span>✅ Verified Partners</span>
            <span>🌍 Global Network</span>
          </div>
        </div>
      </div>
    </div>
  );
}
