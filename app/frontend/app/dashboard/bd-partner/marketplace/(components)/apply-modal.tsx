"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

interface Product {
  id: string
  name?: string
  shortDescription?: string
  detailedDescription?: string
  type?: string
  imageURL?: string
  paymentModel?: string
  companyProfileId?: string
  companyProfile?: {
    id?: string
    commonDetails?: {
      companyName?: string
    }
  }
  createdAt?: string
}

interface Props {
  product: Product
  profileId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApplyModal({ product, profileId, open, onOpenChange }: Props) {
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"

      const response = await fetch(`${API_BASE}/eoi`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          bdPartnerProfileId: profileId,
          message: notes || undefined,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          onOpenChange(false)
          setNotes("")
          setSuccess(false)
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.message || "Failed to submit application")
      }
    } catch (err) {
      console.error("Error submitting application:", err)
      setError("An error occurred while submitting your application")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading && !success) {
      onOpenChange(false)
      setNotes("")
      setError(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apply to Product</DialogTitle>
          <DialogDescription>
            Apply to <strong>{product.name || "Unnamed Product"}</strong> from{" "}
            <strong>{product.companyProfile?.commonDetails?.companyName || "Unknown Company"}</strong>
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
            <div>
              <h3 className="font-semibold text-lg">Application Submitted!</h3>
              <p className="text-sm text-gray-600 mt-1">
                Your application has been sent to the company
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Tell us why you're interested in this product and any relevant details about your organization..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                disabled={loading}
              />
              <p className="text-xs text-gray-500">
                Max 500 characters • {notes.length}/500
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-sm">Product Details</h4>
              <div className="text-sm space-y-1">
                {product.type && (
                  <p>
                    <span className="text-gray-600">Type:</span> {product.type}
                  </p>
                )}
                {product.paymentModel && (
                  <p>
                    <span className="text-gray-600">Payment Model:</span>{" "}
                    {product.paymentModel}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {!success && (
          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Application
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
