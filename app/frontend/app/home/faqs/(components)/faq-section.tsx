"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

export function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqs = [
    {
      question: "How do you verify BD partner qualifications?",
      answer:
        "We conduct comprehensive background checks including identity verification, reference checks from previous employers or clients, industry expertise assessment, and criminal background screening. All partners must also complete our certification program before accessing opportunities.",
    },
    {
      question: "What happens if a deal falls through?",
      answer:
        "If a deal falls through due to circumstances beyond the BD partner's control, no commission is owed. However, if it's due to partner negligence or misrepresentation, we have dispute resolution processes in place. Our escrow system ensures payments are only released when deals are successfully completed.",
    },
    {
      question: "How quickly can I start seeing results?",
      answer:
        "Most businesses see their first qualified leads within 2-4 weeks of listing their products. The timeline depends on your industry, target market, and commission structure. Our matching algorithm prioritizes active partners in your target regions.",
    },
    {
      question: "What support do you provide during negotiations?",
      answer:
        "We offer 24/7 support during active negotiations, including mediation services, contract template assistance, legal guidance referrals, and technical support for our platform tools. Our success team also provides strategic advice to help close deals.",
    },
    {
      question: "How are commission disputes resolved?",
      answer:
        "We have a structured dispute resolution process involving documentation review, mediation sessions with our team, and if necessary, binding arbitration. Our escrow system holds funds until all parties agree the deal terms have been met.",
    },
    {
      question: "Can I set my own commission rates?",
      answer:
        "Yes, businesses have full control over their commission structures. You can set different rates for different products, regions, or deal sizes. Our platform provides market insights to help you set competitive rates that attract quality partners.",
    },
  ]

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Get answers to common questions about our platform</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4 mb-8">
            {faqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                    {openFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>

                  {openFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg">
              View All FAQs
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}