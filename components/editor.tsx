"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Copy, ExternalLink, FileText, Quote, BarChart3, BookOpen, Tag, Calendar, User } from "lucide-react"

interface EditorProps {
  selectedEntry: string | null
  activeCategory: "evidence" | "cases" | "analytics" | "speeches"
}

interface PrepBankEntry {
  id: string
  title: string
  summary: string
  entry_type: string
  tags: string[]
  created_at: string
  author: string
  // Evidence-specific fields
  quote_text?: string
  source_url?: string
  mla_citation?: string
  author_qualifications?: string
  warrant_text?: string
  // Analytics-specific fields
  content?: string
  // Definition-specific fields
  definition_text?: string
}

export function Editor({ selectedEntry, activeCategory }: EditorProps) {
  const [entry, setEntry] = useState<PrepBankEntry | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Mock data - in real app, this would come from API
  useEffect(() => {
    if (selectedEntry) {
      const mockEntry: PrepBankEntry = {
        id: selectedEntry,
        title: "Climate Change Economic Impact Study",
        summary: "Comprehensive analysis of economic costs of climate change",
        entry_type: "Evidence",
        tags: ["Climate Change", "Economics"],
        created_at: "2024-01-15T10:30:00Z",
        author: "Alice Johnson",
        quote_text:
          "Climate change will cost the global economy $43 trillion by 2100 if current trends continue, with developing nations bearing disproportionate burden.",
        source_url: "https://example.com/climate-study",
        mla_citation:
          'Smith, John. "Economic Impacts of Climate Change." Nature Climate Change, vol. 15, no. 3, 2023, pp. 45-62.',
        author_qualifications:
          "Dr. John Smith is a professor of Environmental Economics at MIT with 20 years of research experience.",
        warrant_text:
          "This evidence demonstrates the urgent need for climate action from an economic perspective, showing that inaction costs more than prevention.",
      }
      setEntry(mockEntry)
    }
  }, [selectedEntry])

  const handleSave = () => {
    // In real app, this would save to API
    setIsEditing(false)
    console.log("Saving entry:", entry)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (!selectedEntry || !entry) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/5">
        <div className="text-center space-y-4">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-medium">No Entry Selected</h3>
            <p className="text-sm text-muted-foreground">Select an entry from the sidebar to start editing</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            {isEditing ? (
              <Input
                value={entry.title}
                onChange={(e) => setEntry({ ...entry, title: e.target.value })}
                className="text-lg font-semibold"
              />
            ) : (
              <h1 className="text-lg font-semibold line-clamp-2">{entry.title}</h1>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {entry.author}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(entry.created_at).toLocaleDateString()}
              </div>
              <Badge variant="outline" className="text-xs">
                {entry.entry_type}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit"}
            </Button>
            {isEditing && (
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {entry.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              <Tag className="h-2 w-2 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {entry.entry_type === "Evidence" && (
            <Tabs defaultValue="quote" className="space-y-4">
              <TabsList>
                <TabsTrigger value="quote">Quote</TabsTrigger>
                <TabsTrigger value="citation">Citation</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="quote" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Quote className="h-3 w-3" />
                      Quote Text
                    </label>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(entry.quote_text || "")}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  {isEditing ? (
                    <Textarea
                      value={entry.quote_text || ""}
                      onChange={(e) => setEntry({ ...entry, quote_text: e.target.value })}
                      className="min-h-[120px]"
                      placeholder="Enter the quote text..."
                    />
                  ) : (
                    <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                      <p className="text-sm leading-relaxed">{entry.quote_text}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Summary</label>
                  {isEditing ? (
                    <Textarea
                      value={entry.summary}
                      onChange={(e) => setEntry({ ...entry, summary: e.target.value })}
                      placeholder="Enter summary..."
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{entry.summary}</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="citation" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">MLA Citation</label>
                  {isEditing ? (
                    <Textarea
                      value={entry.mla_citation || ""}
                      onChange={(e) => setEntry({ ...entry, mla_citation: e.target.value })}
                      placeholder="Enter MLA citation..."
                    />
                  ) : (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm font-mono">{entry.mla_citation}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Source URL</label>
                    {entry.source_url && (
                      <Button variant="ghost" size="sm" onClick={() => window.open(entry.source_url, "_blank")}>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  {isEditing ? (
                    <Input
                      value={entry.source_url || ""}
                      onChange={(e) => setEntry({ ...entry, source_url: e.target.value })}
                      placeholder="Enter source URL..."
                    />
                  ) : (
                    <p className="text-sm text-blue-600 hover:underline cursor-pointer">{entry.source_url}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Author Qualifications</label>
                  {isEditing ? (
                    <Textarea
                      value={entry.author_qualifications || ""}
                      onChange={(e) => setEntry({ ...entry, author_qualifications: e.target.value })}
                      placeholder="Enter author qualifications..."
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{entry.author_qualifications}</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Warrant Analysis</label>
                  {isEditing ? (
                    <Textarea
                      value={entry.warrant_text || ""}
                      onChange={(e) => setEntry({ ...entry, warrant_text: e.target.value })}
                      className="min-h-[120px]"
                      placeholder="Enter warrant analysis..."
                    />
                  ) : (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm leading-relaxed">{entry.warrant_text}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}

          {entry.entry_type === "Analytics" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-4 w-4" />
                <h2 className="font-medium">Analytics Content</h2>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Summary</label>
                {isEditing ? (
                  <Textarea
                    value={entry.summary}
                    onChange={(e) => setEntry({ ...entry, summary: e.target.value })}
                    placeholder="Enter summary..."
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{entry.summary}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                {isEditing ? (
                  <Textarea
                    value={entry.content || ""}
                    onChange={(e) => setEntry({ ...entry, content: e.target.value })}
                    className="min-h-[200px]"
                    placeholder="Enter analytics content..."
                  />
                ) : (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {entry.entry_type === "Definition" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-4 w-4" />
                <h2 className="font-medium">Definition</h2>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Summary</label>
                {isEditing ? (
                  <Textarea
                    value={entry.summary}
                    onChange={(e) => setEntry({ ...entry, summary: e.target.value })}
                    placeholder="Enter summary..."
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{entry.summary}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Definition Text</label>
                {isEditing ? (
                  <Textarea
                    value={entry.definition_text || ""}
                    onChange={(e) => setEntry({ ...entry, definition_text: e.target.value })}
                    className="min-h-[120px]"
                    placeholder="Enter definition..."
                  />
                ) : (
                  <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm leading-relaxed">{entry.definition_text}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
