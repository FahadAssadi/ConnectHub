"use client"

import { useEffect, useState } from "react"

export function SocialProofSection() {
  const [stats, setStats] = useState({
    deals: 0,
    partners: 0,
    satisfaction: 0,
  })

  useEffect(() => {
    const animateStats = () => {
      const duration = 2000
      const steps = 60
      const increment = duration / steps

      let currentStep = 0
      const timer = setInterval(() => {
        currentStep++
        const progress = currentStep / steps

        setStats({
          deals: Math.floor(2.5 * progress * 1000000) / 1000000,
          partners: Math.floor(300 * progress),
          satisfaction: Math.floor(95 * progress),
        })

        if (currentStep >= steps) {
          clearInterval(timer)
          setStats({ deals: 2.5, partners: 300, satisfaction: 95 })
        }
      }, increment)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateStats()
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )

    const element = document.getElementById("stats-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const companies = [
    "TechCorp",
    "GlobalSoft",
    "InnovateLtd",
    "DataFlow",
    "CloudTech",
    "SmartSolutions",
    "NextGen",
    "ProBusiness",
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Company Logos */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-gray-500 mb-8">Trusted by leading companies</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center opacity-60">
            {companies.map((company, index) => (
              <div key={index} className="flex items-center justify-center">
                <div className="h-8 w-20 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">{company}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div id="stats-section" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">${stats.deals.toFixed(1)}M+</div>
            <p className="text-gray-600">in deals facilitated</p>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">{stats.partners}+</div>
            <p className="text-gray-600">active BD partners</p>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">{stats.satisfaction}%</div>
            <p className="text-gray-600">seller satisfaction rate</p>
          </div>
        </div>
      </div>
    </section>
  )
}
