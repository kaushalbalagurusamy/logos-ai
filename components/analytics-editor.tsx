"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, X, Clock, Type, Bold, Italic, Plus } from "lucide-react"
import type { Analytics, Source, EvidenceCard } from "@/lib/types"

interface AnalyticsEditorProps {
  analytics?: Analytics
  onSave: (analytics: Analytics) => Promise<void>
  onCancel: () => void
  linkedSource?: Source
  linkedCard?: EvidenceCard
}

export default function AnalyticsEditor({
  analytics,
  onSave,
  onCancel,
  linkedSource,
  linkedCard,
}: AnalyticsEditorProps) {
  const [title, setTitle] = useState(analytics?.title || "")
  const [content, setContent] = useState(analytics?.content || "")
  const [summary, setSummary] = useState(analytics?.summary || "")
  const [tags, setTags] = useState<string[]>(analytics?.tags || [])
  const [newTag, setNewTag] = useState("")
  const [formatting, setFormatting] = useState(
    analytics?.formattingPreferences || {
      font: "Times New Roman" as const,
      size: 12,
      bold: true,
      italic: false,
    },
  )
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const autoSaveRef = useRef<NodeJS.Timeout>()
  const contentRef = useRef<HTMLTextAreaElement>(null)

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      autoSaveRef.current = setTimeout(() => {
        handleAutoSave()
      }, 30000) // 30 seconds
    }

    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current)
      }
    }
  }, [hasUnsavedChanges, title, content, summary, tags, formatting])

  // Track changes
  useEffect(() => {
    if (analytics) {
      const hasChanges =
        title !== analytics.title ||
        content !== analytics.content ||
        summary !== analytics.summary ||
        JSON.stringify(tags) !== JSON.stringify(analytics.tags) ||
        JSON.stringify(formatting) !== JSON.stringify(analytics.formattingPreferences)

      setHasUnsavedChanges(hasChanges)
    } else {
      setHasUnsavedChanges(title.length > 0 || content.length > 0)
    }
  }, [title, content, summary, tags, formatting, analytics])

  const handleAutoSave = async () => {
    if (!hasUnsavedChanges) return

    setIsSaving(true)
    try {
      const analyticsData: Analytics = {
        id: analytics?.id || `analytics-${Date.now()}`,
        title,
        content,
        summary: summary || undefined,
        authorId: analytics?.authorId || "current-user",
        folderId: analytics?.folderId,
        linkedSourceId: linkedSource?.id || analytics?.linkedSourceId,
        linkedCardId: linkedCard?.id || analytics?.linkedCardId,
        linkType: analytics?.linkType || null,
        formattingPreferences: formatting,
        tags,
        version: (analytics?.version || 0) + 1,
        userId: analytics?.userId || "current-user",
        createdAt: analytics?.createdAt || new Date(),
        updatedAt: new Date(),
      }

      await onSave(analyticsData)
      setLastSaved(new Date())
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error("Auto-save failed:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleManualSave = async () => {
    await handleAutoSave()
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const applyFormatting = (style: "bold" | "italic") => {
    setFormatting((prev) => ({
      ...prev,
      [style]: !prev[style],
    }))
  }

  const getCharacterCount = () => content.length
  const getSummaryCharacterCount = () => summary.length

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-[#d4d4d4]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#3e3e42]">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">{analytics ? "Edit Analytics" : "New Analytics"}</h2>
          {(isSaving || hasUnsavedChanges) && (
            <div className="flex items-center gap-2 text-sm text-[#cccccc]">
              <Clock className="w-4 h-4" />
              {isSaving ? "Saving..." : hasUnsavedChanges ? "Unsaved changes" : "Saved"}
              {lastSaved && !hasUnsavedChanges && (
                <span className="text-[#858585]">{lastSaved.toLocaleTimeString()}</span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleManualSave}
            disabled={!hasUnsavedChanges || isSaving}
            className="bg-[#0e639c] hover:bg-[#1177bb] text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button onClick={onCancel} variant="outline" className="border-[#3e3e42] text-[#cccccc] hover:bg-[#2d2d30]">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter analytics title..."
            className="bg-[#3c3c3c] border-[#3e3e42] text-[#cccccc] placeholder-[#858585]"
          />
        </div>

        {/* Formatting Controls */}
        <Card className="bg-[#252526] border-[#3e3e42]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Type className="w-4 h-4" />
              Formatting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm">Font:</label>
                <Select
                  value={formatting.font}
                  onValueChange={(value: any) => setFormatting((prev) => ({ ...prev, font: value }))}
                >
                  <SelectTrigger className="w-40 bg-[#3c3c3c] border-[#3e3e42]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#3c3c3c] border-[#3e3e42]">
                    <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm">Size:</label>
                <Input
                  type="number"
                  value={formatting.size}
                  onChange={(e) => setFormatting((prev) => ({ ...prev, size: Number.parseInt(e.target.value) || 12 }))}
                  className="w-20 bg-[#3c3c3c] border-[#3e3e42]"
                  min="8"
                  max="72"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => applyFormatting("bold")}
                  variant={formatting.bold ? "default" : "outline"}
                  size="sm"
                  className={formatting.bold ? "bg-[#0e639c]" : "border-[#3e3e42]"}
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => applyFormatting("italic")}
                  variant={formatting.italic ? "default" : "outline"}
                  size="sm"
                  className={formatting.italic ? "bg-[#0e639c]" : "border-[#3e3e42]"}
                >
                  <Italic className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Editor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Content</label>
            <span className="text-xs text-[#858585]">{getCharacterCount().toLocaleString()} characters</span>
          </div>
          <Textarea
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your analytical content..."
            className="min-h-[400px] bg-[#3c3c3c] border-[#3e3e42] text-[#cccccc] placeholder-[#858585] resize-none"
            style={{
              fontFamily: formatting.font,
              fontSize: `${formatting.size}px`,
              fontWeight: formatting.bold ? "bold" : "normal",
              fontStyle: formatting.italic ? "italic" : "normal",
            }}
          />
        </div>

        {/* Summary */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Summary (Optional)</label>
            <span className="text-xs text-[#858585]">{getSummaryCharacterCount()}/200 characters</span>
          </div>
          <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value.slice(0, 200))}
            placeholder="Brief summary of the analytics..."
            className="h-20 bg-[#3c3c3c] border-[#3e3e42] text-[#cccccc] placeholder-[#858585]"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-[#0e639c] text-white hover:bg-[#1177bb]">
                {tag}
                <button onClick={() => removeTag(tag)} className="ml-2 hover:text-red-300">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTag()}
              placeholder="Add tag..."
              className="bg-[#3c3c3c] border-[#3e3e42] text-[#cccccc] placeholder-[#858585]"
            />
            <Button onClick={addTag} size="sm" className="bg-[#0e639c] hover:bg-[#1177bb]">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Linked Content Info */}
        {(linkedSource || linkedCard) && (
          <Card className="bg-[#252526] border-[#3e3e42]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Linked Content</CardTitle>
            </CardHeader>
            <CardContent>
              {linkedSource && (
                <div className="text-sm">
                  <span className="text-[#858585]">Source:</span> {linkedSource.title}
                </div>
              )}
              {linkedCard && (
                <div className="text-sm">
                  <span className="text-[#858585]">Card:</span> {linkedCard.tagLine}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
