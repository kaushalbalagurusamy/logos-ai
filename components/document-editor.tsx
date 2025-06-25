"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Badge } from "@/components/ui/badge"
import { 
  Save, 
  Edit3, 
  Trash2, 
  FileText,
  Clock
} from "lucide-react"
import type { Document } from "@/lib/types"

/**
 * Debounce utility function
 */
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

interface DocumentEditorProps {
  documentId: string
  onDocumentDeleted?: () => void
}

export function DocumentEditor({ documentId, onDocumentDeleted }: DocumentEditorProps) {
  const [document, setDocument] = useState<Document | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved")
  const [loading, setLoading] = useState(true)

  const loadDocument = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/documents/${documentId}`)
      const result = await response.json()
      
      if (result.success) {
        setDocument(result.data)
        setTitle(result.data.title)
        setContent(result.data.content)
      } else {
        console.error("Failed to load document:", result.error)
      }
    } catch (error) {
      console.error("Failed to load document:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveDocument = useCallback(async (newTitle: string, newContent: string) => {
    if (!document) return

    setSaving(true)
    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim() || "Untitled Document",
          content: newContent
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setDocument(result.data)
        return result.data
      }
    } catch (error) {
      console.error("Failed to save document:", error)
      throw error
    } finally {
      setSaving(false)
    }
  }, [document])

  // Load document
  useEffect(() => {
    if (documentId) {
      loadDocument()
    }
  }, [documentId])

  // Track changes for auto-save
  useEffect(() => {
    if (!document || (title === document.title && content === document.content)) {
      return
    }

    setSaveStatus("unsaved")
    
    const autoSave = debounce(async (newTitle: string, newContent: string) => {
      if (!document || (!newTitle.trim() && !newContent.trim())) return
      
      setSaveStatus("saving")
      try {
        await saveDocument(newTitle, newContent)
        setSaveStatus("saved")
      } catch (error) {
        console.error("Auto-save failed:", error)
        setSaveStatus("unsaved")
      }
    }, 2000)

    autoSave(title, content)
  }, [title, content, document, saveDocument])

  const handleDelete = async () => {
    if (!document || !confirm("Are you sure you want to delete this document?")) return
    
    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: "DELETE"
      })
      
      const result = await response.json()
      
      if (result.success) {
        onDocumentDeleted?.()
      }
    } catch (error) {
      console.error("Failed to delete document:", error)
    }
  }

  const formatLastUpdated = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-[#a1a1a1] mx-auto mb-4 opacity-60" />
          <p className="text-sm text-[#a1a1a1]">Loading document...</p>
        </div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-[#a1a1a1] mx-auto mb-4 opacity-60" />
          <p className="text-sm text-[#cccccc] mb-2">Document not found</p>
          <p className="text-xs text-[#a1a1a1]">The document may have been deleted or moved.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      {/* Header */}
      <div className="border-b border-[#37373d] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <FileText className="h-4 w-4 text-[#569cd6] flex-shrink-0" />
          
          {isEditing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsEditing(false)
                }
              }}
              className="bg-[#2d2d30] border-[#37373d] text-[#cccccc] text-sm h-7"
              autoFocus
            />
          ) : (
            <h1 
              className="text-sm font-medium text-[#cccccc] truncate cursor-pointer hover:text-[#ffffff]"
              onClick={() => setIsEditing(true)}
              title={document.title}
            >
              {document.title}
            </h1>
          )}
          
          {/* Status indicators */}
          <div className="flex items-center gap-2">
            {saveStatus === "saving" && (
              <Badge variant="secondary" className="bg-[#37373d] text-[#569cd6] text-xs">
                Saving...
              </Badge>
            )}
            {saveStatus === "unsaved" && (
              <Badge variant="secondary" className="bg-[#37373d] text-[#dcdcaa] text-xs">
                Unsaved
              </Badge>
            )}
            <div className="flex items-center gap-1 text-xs text-[#a1a1a1]">
              <Clock className="h-3 w-3" />
              {formatLastUpdated(document.updatedAt)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="border-[#37373d] bg-[#2d2d30] text-[#cccccc] hover:bg-[#37373d] text-xs h-7"
          >
            <Edit3 className="h-3 w-3 mr-1" />
            Rename
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="border-[#d16969] bg-[#2d2d30] text-[#d16969] hover:bg-[#d16969] hover:text-white text-xs h-7"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-4 overflow-hidden">
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Start writing your document... Type / to insert cards or analytics."
          minHeight="h-full"
          className="h-full"
          enableFormatting={true}
          enableHighlighting={true}
          enableAutoSave={true}
          autoSaveInterval={2000}
          showCharacterCount={true}
          enableSlashCommands={true}
        />
      </div>
    </div>
  )
}