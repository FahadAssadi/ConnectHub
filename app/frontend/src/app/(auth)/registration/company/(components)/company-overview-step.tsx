"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FileText, Upload, X, Camera, Cloud } from "lucide-react"

interface CompanyOverviewStepProps {
  onNext: (data: any) => void
  onPrevious: () => void
  formData: any
  isFirstStep: boolean
  isLastStep: boolean
}

export function CompanyOverviewStep({ onNext, onPrevious, formData }: CompanyOverviewStepProps) {
  const [data, setData] = useState({
    companyDescription: formData.companyDescription || "",
    companyProfile: formData.companyProfile || null,
    companyLogo: formData.companyLogo || null,
  })

  const [dragActive, setDragActive] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const handleDescriptionChange = (value: string) => {
    if (value.length <= 500) {
      setData((prev) => ({ ...prev, companyDescription: value }))
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.size <= 10 * 1024 * 1024) {
        // 10MB limit
        setData((prev) => ({ ...prev, companyProfile: file }))
      }
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size <= 10 * 1024 * 1024) {
        // 10MB limit
        setData((prev) => ({ ...prev, companyProfile: file }))
      }
    }
  }

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setData((prev) => ({ ...prev, companyLogo: file }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeFile = (type: "profile" | "logo") => {
    if (type === "profile") {
      setData((prev) => ({ ...prev, companyProfile: null }))
    } else {
      setData((prev) => ({ ...prev, companyLogo: null }))
      setLogoPreview(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSubmit = () => {
    onNext(data)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Tell us more about your company</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Company Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Brief Company Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your company, products/services, target market, and key differentiators..."
              value={data.companyDescription}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Help potential partners understand your business</span>
              <span>{data.companyDescription.length}/500 characters</span>
            </div>
          </div>

          {/* Company Profile Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Upload Company Profile/Deck <span className="text-gray-500">(Optional)</span>
            </Label>

            {!data.companyProfile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Cloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">Drag files here or click to browse</p>
                <p className="text-sm text-gray-500 mb-4">PDF, PPT, DOC (Max 10MB)</p>
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="profile-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("profile-upload")?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{data.companyProfile.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(data.companyProfile.size)}</p>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeFile("profile")}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Company Logo <span className="text-gray-500">(Optional)</span>
            </Label>

            <div className="flex items-start space-x-4">
              <div
                className={`w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  logoPreview ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-blue-400"
                }`}
                onClick={() => document.getElementById("logo-upload")?.click()}
              >
                {logoPreview ? (
                  <img
                    src={logoPreview || "/placeholder.svg"}
                    alt="Logo preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <>
                    <Camera className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600 text-center">Upload Logo</span>
                  </>
                )}
              </div>

              <div className="flex-1">
                <input type="file" accept="image/*" onChange={handleLogoSelect} className="hidden" id="logo-upload" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload your company logo for a professional appearance on partner materials.
                </p>
                <p className="text-xs text-gray-500">Recommended: Square format, minimum 150x150px, PNG or JPG</p>
                {data.companyLogo && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile("logo")}
                    className="mt-2 text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove Logo
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t">
            <Button variant="ghost" onClick={onPrevious}>
              Previous
            </Button>
            <div className="flex space-x-3">
              <Button variant="ghost" className="text-blue-600">
                Save & Continue Later
              </Button>
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                Continue
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
