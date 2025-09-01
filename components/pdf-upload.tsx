"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface PDFUploadProps {
  onUploadComplete: () => void
}

export default function PDFUpload({ onUploadComplete }: PDFUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type !== "application/pdf") {
        setErrorMessage("Please select a PDF file only.")
        setSelectedFile(null)
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setErrorMessage("File size must be less than 10MB.")
        setSelectedFile(null)
        return
      }
      setSelectedFile(file)
      setErrorMessage("")
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploadStatus("uploading")
    setUploadProgress(0)

    try {
      const supabase = createClient()

      const candidateId = `candidate_${Date.now()}`
      const fileExtension = selectedFile.name.split(".").pop()
      const fileName = `${candidateId}_dossier.${fileExtension}`
      const filePath = `${candidateId}/${fileName}`

      setUploadProgress(25)

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("dossier-uploads")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      setUploadProgress(75)

      const { error: dbError } = await supabase.from("dossier_uploads").insert({
        candidate_id: candidateId,
        file_name: selectedFile.name,
        file_path: uploadData.path,
        file_size: selectedFile.size,
        test_completion_date: new Date().toISOString(),
      })

      if (dbError) {
        console.error("Database error:", dbError)
        // Continue even if DB insert fails, as file is uploaded
      }

      setUploadProgress(100)
      setUploadStatus("success")

      // Auto-complete after 2 seconds
      setTimeout(() => {
        onUploadComplete()
      }, 2000)
    } catch (error) {
      setUploadStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Upload failed. Please try again.")
      console.error("Upload error:", error)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type === "application/pdf") {
      setSelectedFile(file)
      setErrorMessage("")
    } else {
      setErrorMessage("Please drop a PDF file only.")
    }
  }

  if (uploadStatus === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Upload Successful!</h2>
          <p className="text-muted-foreground mb-6">
            Your dossier has been successfully uploaded and saved to secure cloud storage.
          </p>
          <p className="text-sm text-muted-foreground">Redirecting to completion screen...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Upload Your Dossier</h2>
          <p className="text-muted-foreground">
            Please upload your completed test dossier as a PDF file. This will be securely saved for evaluation.
          </p>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            selectedFile ? "border-green-500 bg-green-50" : "border-muted-foreground hover:border-primary"
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div className="space-y-4">
              <FileText className="w-12 h-12 text-green-500 mx-auto" />
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              <Button
                onClick={() => {
                  setSelectedFile(null)
                  if (fileInputRef.current) fileInputRef.current.value = ""
                }}
                variant="outline"
                size="sm"
              >
                Remove File
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
              <div>
                <p className="text-lg font-medium mb-2">Drop your PDF file here</p>
                <p className="text-muted-foreground mb-4">or click to browse</p>
                <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                  Select PDF File
                </Button>
              </div>
            </div>
          )}
        </div>

        <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" />

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
        )}

        {uploadStatus === "uploading" && (
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <p className="font-medium mb-2">Uploading to secure cloud storage...</p>
              <Progress value={uploadProgress} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">{uploadProgress}% complete</p>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploadStatus === "uploading"}
            className="flex-1"
            size="lg"
          >
            {uploadStatus === "uploading" ? "Uploading..." : "Upload Dossier"}
          </Button>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Requirements:</strong>
            <br />• File must be in PDF format
            <br />• Maximum file size: 10MB
            <br />• File will be securely saved to encrypted cloud storage
          </p>
        </div>
      </Card>
    </div>
  )
}
