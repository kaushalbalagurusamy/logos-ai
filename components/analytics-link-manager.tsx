"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Plus, LinkIcon, FileText, StickyNote, Trash2 } from "lucide-react"
import type { AnalyticsLink, Source, EvidenceCard } from "@/lib/types"

interface AnalyticsLinkManagerProps {
  analyticsId: string
  currentLinks: AnalyticsLink[]
  onLinkCreate: (link: Omit<AnalyticsLink, "id" | "createdAt">) => void
  onLinkRemove: (linkId: string) => void
  onLinkUpdate: (linkId: string, updates: Partial<AnalyticsLink>) => void
}

interface LinkDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreateLink: (link: Omit<AnalyticsLink, "id" | "createdAt">) => void
  analyticsId: string
}

function LinkDialog({ isOpen, onClose, onCreateLink, analyticsId }: LinkDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<"source" | "card">("source")
  const [selectedTarget, setSelectedTarget] = useState<Source | EvidenceCard | null>(null)
  const [linkType, setLinkType] = useState<"paraphrase" | "comparison" | "extension" | "response">("extension")
  const [description, setDescription] = useState("")
  const [searchResults, setSearchResults] = useState<(Source | EvidenceCard)[]>([])

  // Mock search function - in real app, this would call API
  const searchTargets = async (query: string, type: "source" | "card") => {
    // Mock data for demonstration
    const mockSources: Source[] = [
      {
        id: "source-1",
        title: "Climate Change Economic Impact Study",
        author: "Dr. John Smith",
        publication: "Nature Climate Change",
        date: new Date("2023-03-15"),
        citationStyle: "MLA",
        version: 1,
        userId: "user-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        cards: [],
      },
    ]

    const mockCards: EvidenceCard[] = [
      {
        id: "card-1",
        sourceId: "source-1",
        tagLine: "Climate change causes economic damage",
        evidence: "The economic costs of climate change are projected to reach...",
        userId: "user-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        source: mockSources[0],
      },
    ]

    const results = type === "source" ? mockSources : mockCards
    return results.filter((item) =>
      "title" in item
        ? item.title.toLowerCase().includes(query.toLowerCase())
        : item.tagLine.toLowerCase().includes(query.toLowerCase()),
    )
  }

  useEffect(() => {
    if (searchQuery.length > 2) {
      searchTargets(searchQuery, selectedType).then(setSearchResults)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, selectedType])

  const handleCreateLink = () => {
    if (!selectedTarget) return

    onCreateLink({
      analyticsId,
      targetType: selectedType,
      targetId: selectedTarget.id,
      linkType,
      description: description || undefined,
    })

    // Reset form
    setSelectedTarget(null)
    setDescription("")
    setSearchQuery("")
    onClose()
  }

  const getLinkTypeDescription = (type: string) => {
    switch (type) {
      case "paraphrase":
        return "Rephrases or summarizes the linked content"
      case "comparison":
        return "Compares multiple sources or arguments"
      case "extension":
        return "Builds upon or extends the linked evidence"
      case "response":
        return "Responds to or refutes the linked content"
      default:
        return ""
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#2d2d30] border-[#3e3e42] text-[#cccccc] max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Create Link
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Target Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Link to:</label>
            <div className="flex gap-2">
              <Button
                onClick={() => setSelectedType("source")}
                variant={selectedType === "source" ? "default" : "outline"}
                className={selectedType === "source" ? "bg-[#0e639c]" : "border-[#3e3e42]"}
              >
                <FileText className="w-4 h-4 mr-2" />
                Source
              </Button>
              <Button
                onClick={() => setSelectedType("card")}
                variant={selectedType === "card" ? "default" : "outline"}
                className={selectedType === "card" ? "bg-[#0e639c]" : "border-[#3e3e42]"}
              >
                <StickyNote className="w-4 h-4 mr-2" />
                Evidence Card
              </Button>
            </div>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Search {selectedType === "source" ? "Sources" : "Evidence Cards"}:
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#858585]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${selectedType === "source" ? "sources" : "cards"}...`}
                className="pl-10 bg-[#3c3c3c] border-[#3e3e42]"
              />
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Results:</label>
              <ScrollArea className="h-32 border border-[#3e3e42] rounded">
                <div className="p-2 space-y-1">
                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedTarget(item)}
                      className={`p-2 rounded cursor-pointer hover:bg-[#3e3e42] ${
                        selectedTarget?.id === item.id ? "bg-[#094771]" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {selectedType === "source" ? (
                          <FileText className="w-4 h-4" />
                        ) : (
                          <StickyNote className="w-4 h-4" />
                        )}
                        <span className="text-sm">{"title" in item ? item.title : item.tagLine}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Selected Target */}
          {selectedTarget && (
            <Card className="bg-[#252526] border-[#3e3e42]">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  {selectedType === "source" ? <FileText className="w-4 h-4" /> : <StickyNote className="w-4 h-4" />}
                  <span className="font-medium">
                    {"title" in selectedTarget ? selectedTarget.title : selectedTarget.tagLine}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Link Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Link Type:</label>
            <Select value={linkType} onValueChange={(value: any) => setLinkType(value)}>
              <SelectTrigger className="bg-[#3c3c3c] border-[#3e3e42]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#3c3c3c] border-[#3e3e42]">
                <SelectItem value="paraphrase">
                  <div>
                    <div className="font-medium">Paraphrase</div>
                    <div className="text-xs text-[#858585]">{getLinkTypeDescription("paraphrase")}</div>
                  </div>
                </SelectItem>
                <SelectItem value="comparison">
                  <div>
                    <div className="font-medium">Comparison</div>
                    <div className="text-xs text-[#858585]">{getLinkTypeDescription("comparison")}</div>
                  </div>
                </SelectItem>
                <SelectItem value="extension">
                  <div>
                    <div className="font-medium">Extension</div>
                    <div className="text-xs text-[#858585]">{getLinkTypeDescription("extension")}</div>
                  </div>
                </SelectItem>
                <SelectItem value="response">
                  <div>
                    <div className="font-medium">Response</div>
                    <div className="text-xs text-[#858585]">{getLinkTypeDescription("response")}</div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description (Optional):</label>
            <RichTextEditor
              value={description}
              onChange={(value) => setDescription(value)}
              placeholder="Describe the relationship..."
              enableFormatting={false}
              showCharacterCount={true}
              minHeight="min-h-[60px]"
              className="bg-[#3c3c3c] border-[#3e3e42]"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button onClick={onClose} variant="outline" className="border-[#3e3e42]">
              Cancel
            </Button>
            <Button onClick={handleCreateLink} disabled={!selectedTarget} className="bg-[#0e639c] hover:bg-[#1177bb]">
              Create Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function AnalyticsLinkManager({
  analyticsId,
  currentLinks,
  onLinkCreate,
  onLinkRemove,
  onLinkUpdate,
}: AnalyticsLinkManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const getLinkTypeColor = (linkType: string) => {
    switch (linkType) {
      case "paraphrase":
        return "bg-blue-500"
      case "comparison":
        return "bg-green-500"
      case "extension":
        return "bg-purple-500"
      case "response":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getLinkTypeIcon = (linkType: string) => {
    switch (linkType) {
      case "paraphrase":
        return "📝"
      case "comparison":
        return "⚖️"
      case "extension":
        return "🔗"
      case "response":
        return "💬"
      default:
        return "🔗"
    }
  }

  return (
    <Card className="bg-[#252526] border-[#3e3e42]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            Linked Content ({currentLinks.length})
          </CardTitle>
          <Button onClick={() => setIsDialogOpen(true)} size="sm" className="bg-[#0e639c] hover:bg-[#1177bb]">
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {currentLinks.length === 0 ? (
          <div className="text-center py-6 text-[#858585]">
            <LinkIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No links yet</p>
            <p className="text-xs">Link to sources or evidence cards to show relationships</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentLinks.map((link) => (
              <div key={link.id} className="flex items-center gap-3 p-3 bg-[#2d2d30] rounded border border-[#3e3e42]">
                <div className="flex items-center gap-2 flex-1">
                  <div className={`w-2 h-2 rounded-full ${getLinkTypeColor(link.linkType)}`} />
                  <span className="text-lg">{getLinkTypeIcon(link.linkType)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {link.targetType === "source" ? (
                        <FileText className="w-4 h-4" />
                      ) : (
                        <StickyNote className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium capitalize">
                        {link.linkType} {link.targetType}
                      </span>
                    </div>
                    {link.description && <p className="text-xs text-[#858585] mt-1 truncate">{link.description}</p>}
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs bg-[#3e3e42] text-[#cccccc]">
                  {link.linkType}
                </Badge>
                <Button
                  onClick={() => onLinkRemove(link.id)}
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-red-900/20 hover:text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <LinkDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreateLink={onLinkCreate}
        analyticsId={analyticsId}
      />
    </Card>
  )
}
