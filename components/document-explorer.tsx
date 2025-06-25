"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen, 
  FileText, 
  Plus,
  Edit,
  Trash2
} from "lucide-react"
import type { Document, DocumentFolder } from "@/lib/types"

interface DocumentExplorerProps {
  onDocumentSelect: (documentId: string) => void
  selectedDocumentId?: string | null
  triggerCreate?: boolean
  onCreateHandled?: () => void
}

export function DocumentExplorer({ 
  onDocumentSelect, 
  selectedDocumentId,
  triggerCreate,
  onCreateHandled 
}: DocumentExplorerProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [folders, setFolders] = useState<DocumentFolder[]>([])
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Load documents and folders
  useEffect(() => {
    loadDocuments()
  }, [])

  // Handle create trigger
  useEffect(() => {
    if (triggerCreate) {
      handleCreateDocument()
      onCreateHandled?.()
    }
  }, [triggerCreate])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/documents")
      const result = await response.json()
      
      if (result.success) {
        setDocuments(result.data.documents || [])
        setFolders(result.data.folders || [])
      }
    } catch (error) {
      console.error("Failed to load documents:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDocument = async () => {
    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled Document",
          content: ""
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        await loadDocuments()
        onDocumentSelect(result.data.id)
      }
    } catch (error) {
      console.error("Failed to create document:", error)
    }
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    )
  }

  const renderFolder = (folder: DocumentFolder) => {
    const isExpanded = expandedFolders.includes(folder.id)
    const folderDocuments = documents.filter(doc => doc.folderId === folder.id)
    
    return (
      <div key={folder.id}>
        {/* Folder Header */}
        <div className="flex items-center hover:bg-[#2a2d2e] rounded-sm">
          <button
            onClick={() => toggleFolder(folder.id)}
            className="p-0.5 hover:bg-[#37373d] rounded-sm"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 text-[#a1a1a1]" />
            ) : (
              <ChevronRight className="h-3 w-3 text-[#a1a1a1]" />
            )}
          </button>
          <div className="flex items-center gap-1 px-1 py-1 flex-1">
            {isExpanded ? (
              <FolderOpen className="h-3 w-3 text-[#dcdcaa] flex-shrink-0" />
            ) : (
              <Folder className="h-3 w-3 text-[#dcdcaa] flex-shrink-0" />
            )}
            <span className="text-xs text-[#cccccc] truncate">{folder.name}</span>
          </div>
        </div>
        
        {/* Folder Contents */}
        {isExpanded && (
          <div className="ml-4 space-y-0.5">
            {folderDocuments.map(doc => renderDocument(doc))}
          </div>
        )}
      </div>
    )
  }

  const renderDocument = (document: Document) => {
    const isSelected = selectedDocumentId === document.id
    
    return (
      <div
        key={document.id}
        className={`flex items-center gap-2 px-2 py-1 text-xs cursor-pointer rounded-sm transition-colors ${
          isSelected 
            ? "bg-[#37373d] text-[#cccccc]" 
            : "text-[#cccccc] hover:bg-[#2a2d2e]"
        }`}
        onClick={() => onDocumentSelect(document.id)}
      >
        <FileText className="h-3 w-3 text-[#569cd6] flex-shrink-0" />
        <span className="truncate">{document.title}</span>
      </div>
    )
  }

  // Get root documents (not in any folder)
  const rootDocuments = documents.filter(doc => !doc.folderId)
  
  if (loading) {
    return (
      <div className="p-2 text-xs text-[#a1a1a1]">
        Loading documents...
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {/* Root folders */}
      {folders.map(folder => renderFolder(folder))}
      
      {/* Root documents */}
      {rootDocuments.map(doc => renderDocument(doc))}
      
      {/* Empty state */}
      {documents.length === 0 && folders.length === 0 && (
        <div className="px-2 py-4 text-center">
          <FileText className="h-8 w-8 text-[#a1a1a1] mx-auto mb-2 opacity-50" />
          <p className="text-xs text-[#a1a1a1] mb-2">No documents yet</p>
          <Button
            onClick={handleCreateDocument}
            size="sm"
            className="h-6 text-xs bg-[#007acc] hover:bg-[#005a9e] text-white border-0"
          >
            <Plus className="h-3 w-3 mr-1" />
            Create Document
          </Button>
        </div>
      )}
    </div>
  )
}