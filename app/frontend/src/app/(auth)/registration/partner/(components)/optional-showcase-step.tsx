"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, Upload, X, FileText, Cloud, ToggleLeft, ToggleRight } from "lucide-react"

interface OptionalShowcaseStepProps {
  onNext: (data: any) => void
  onPrevious: () => void
  formData: any
  isFirstStep: boolean
  isLastStep: boolean
}

export function OptionalShowcaseStep({ onNext, onPrevious, formData }: OptionalShowcaseStepProps) {
  const [data, setData] = useState({
    cvFile: formData.cvFile || null,
    notableProjects: formData.notableProjects || "",
    testimonialsType: formData.testimonialsType || "text", // "text" or "file"
    testimonialsText: formData.testimonialsText || "",
    testimonialsFile: formData.testimonialsFile || null,
  })

  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, fileType: "cv" | "testimonials") => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.size <= 10 * 1024 * 1024) {
        // 10MB limit
        if (fileType === "cv") {
          setData((prev) => ({ ...prev, cvFile: file }))
        } else {
          setData((prev) => ({ ...prev, testimonialsFile: file }))
        }
      }
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, fileType: "cv" | "testimonials") => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size <= 10 * 1024 * 1024) {
        // 10MB limit
        if (fileType === "cv") {
          setData((prev) => ({ ...prev, cvFile: file }))
        } else {
          setData((prev) => ({ ...prev, testimonialsFile: file }))
        }
      }
    }
  }

  const removeFile = (fileType: "cv" | "testimonials") => {
    if (fileType === "cv") {
      setData((prev) => ({ ...prev, cvFile: null }))
    } else {
      setData((prev) => ({ ...prev, testimonialsFile: null }))
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
              <Star className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Showcase your experience</CardTitle>
          <p className="text-gray-600 mt-2">Optional - Help businesses understand your capabilities</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* CV/Profile Upload */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Upload CV/Profile/Portfolio <span className="text-gray-500">(Optional)</span>
            </Label>

            {!data.cvFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={(e) => handleDrop(e, "cv")}
              >
                <Cloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">Drag your CV/portfolio here or click to browse</p>
                <p className="text-sm text-gray-500 mb-4">PDF, DOC, PPT (Max 10MB)</p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={(e) => handleFileSelect(e, "cv")}
                  className="hidden"
                  id="cv-upload"
                />
                <Button type="button" variant="outline" onClick={() => document.getElementById("cv-upload")?.click()}>
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
                      <p className="font-medium text-gray-900">{data.cvFile.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(data.cvFile.size)}</p>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeFile("cv")}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Notable Projects */}
          <div className="space-y-2">
            <Label htmlFor="projects" className="text-sm font-medium">
              Notable Projects or Clients <span className="text-gray-500">(Optional)</span>
            </Label>
            <Textarea
              id="projects"
              placeholder="Describe significant projects or notable clients you've worked with. Include outcomes, deal sizes, or other achievements that demonstrate your capabilities. You can mention company names or keep them anonymous."
              value={data.notableProjects}
              onChange={(e) => setData((prev) => ({ ...prev, notableProjects: e.target.value }))}
              rows={5}
              className="resize-none"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Help businesses understand your track record</span>
              <span>{data.notableProjects.length}/1000 characters</span>
            </div>
          </div>

          {/* Testimonials */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">
              Referrals or Testimonials <span className="text-gray-500">(Optional)</span>
            </Label>

            {/* Toggle between text and file */}
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setData((prev) => ({ ...prev, testimonialsType: "text" }))}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  data.testimonialsType === "text"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-600 hover:border-blue-300"
                }`}
              >
                {data.testimonialsType === "text" ? (
                  <ToggleRight className="h-5 w-5" />
                ) : (
                  <ToggleLeft className="h-5 w-5" />
                )}
                <span>Write testimonials</span>
              </button>

              <button
                type="button"
                onClick={() => setData((prev) => ({ ...prev, testimonialsType: "file" }))}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  data.testimonialsType === "file"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-600 hover:border-blue-300"
                }`}
              >
                {data.testimonialsType === "file" ? (
                  <ToggleRight className="h-5 w-5" />
                ) : (
                  <ToggleLeft className="h-5 w-5" />
                )}
                <span>Upload file</span>
              </button>
            </div>

            {data.testimonialsType === "text" ? (
              <Textarea
                placeholder="Share testimonials from previous clients or colleagues. Include their name, company, and what they said about working with you. You can also provide contact information for references."
                value={data.testimonialsText}
                onChange={(e) => setData((prev) => ({ ...prev, testimonialsText: e.target.value }))}
                rows={4}
                className="resize-none"
              />
            ) : (
              <>
                {!data.testimonialsFile ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={(e) => handleDrop(e, "testimonials")}
                  >
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <p className="font-medium text-gray-700 mb-1">Upload testimonials or references</p>
                    <p className="text-sm text-gray-500 mb-3">PDF, DOC, or image files (Max 10MB)</p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileSelect(e, "testimonials")}
                      className="hidden"
                      id="testimonials-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("testimonials-upload")?.click()}
                    >
                      Choose File
                    </Button>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">{data.testimonialsFile.name}</p>
                          <p className="text-sm text-gray-500">{formatFileSize(data.testimonialsFile.size)}</p>
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile("testimonials")}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Showcase Tips:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Strong profiles get 3x more opportunities</li>
              <li>• Include specific achievements and outcomes</li>
              <li>• Testimonials from previous clients build trust</li>
              <li>• You can always update this information later</li>
            </ul>
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
