"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Copy, ExternalLink, FileText, Quote, BarChart3, BookOpen, Tag, Calendar, User } from "lucide-react"
import type { FormattingData, Document, EvidenceCard } from "@/lib/types"

interface EditorProps {
  selectedEntry: string | null
  activeCategory: "evidence" | "cases" | "analytics" | "speeches" | "documents"
  mode?: "prep-bank" | "document-writer"
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
  // Formatting data for rich text fields
  formattingData?: FormattingData
}

export function Editor({ selectedEntry, activeCategory, mode = "prep-bank" }: EditorProps) {
  const [entry, setEntry] = useState<PrepBankEntry | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  
  // Document writer state
  const [document, setDocument] = useState<Document | null>(null)
  const [documentContent, setDocumentContent] = useState("")
  const [documentTitle, setDocumentTitle] = useState("")
  const [showCardDropdown, setShowCardDropdown] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const [searchTerm, setSearchTerm] = useState("")
  const [availableCards, setAvailableCards] = useState<EvidenceCard[]>([])
  const [filteredCards, setFilteredCards] = useState<EvidenceCard[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  // Document writer functions
  const loadAvailableCards = async () => {
    // Mock data - in real app, this would fetch from API
    const mockCards: EvidenceCard[] = [
      {
        id: "card-1",
        sourceId: "source-1",
        tagLine: "Climate change causes economic damage",
        evidence: "Climate change will cost the global economy $43 trillion by 2100 if current trends continue, with developing nations bearing disproportionate burden.",
        shorthand: "Econ Impact",
        userId: "user-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "card-2", 
        sourceId: "source-1",
        tagLine: "Renewable energy creates jobs",
        evidence: "The renewable energy sector employed 13.7 million people worldwide in 2022, representing a 1 million increase from the previous year.",
        shorthand: "Jobs",
        userId: "user-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    setAvailableCards(mockCards)
  }

  useEffect(() => {
    if (mode === "document-writer") {
      loadAvailableCards()
    }
  }, [mode])

  // Filter cards based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = availableCards.filter(card => 
        card.tagLine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.shorthand?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCards(filtered)
    } else {
      setFilteredCards(availableCards)
    }
  }, [searchTerm, availableCards])

  const handleDocumentContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    const cursorPosition = e.target.selectionStart
    
    setDocumentContent(value)
    
    // Check for slash command
    if (value[cursorPosition - 1] === '/') {
      const textarea = e.target
      const rect = textarea.getBoundingClientRect()
      const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight)
      const textBeforeCursor = value.substring(0, cursorPosition)
      const lineNumber = textBeforeCursor.split('\n').length - 1
      
      setDropdownPosition({
        top: rect.top + (lineNumber * lineHeight) + lineHeight + 5,
        left: rect.left + 10
      })
      setShowCardDropdown(true)
      setSearchTerm("")
    } else if (showCardDropdown) {
      // Update search term if dropdown is showing
      const lastSlashIndex = value.lastIndexOf('/', cursorPosition)
      if (lastSlashIndex !== -1 && lastSlashIndex < cursorPosition) {
        const term = value.substring(lastSlashIndex + 1, cursorPosition)
        if (term.includes(' ') || term.includes('\n')) {
          setShowCardDropdown(false)
        } else {
          setSearchTerm(term)
        }
      } else {
        setShowCardDropdown(false)
      }
    }
  }

  const insertCard = (card: EvidenceCard) => {
    if (!textareaRef.current) return
    
    const textarea = textareaRef.current
    const cursorPosition = textarea.selectionStart
    const content = documentContent
    
    // Find the slash position
    const lastSlashIndex = content.lastIndexOf('/', cursorPosition)
    
    // Format the card content
    const cardContent = `TAG: ${card.tagLine}
${card.shorthand ? `SHORTHAND: ${card.shorthand}` : ''}
${card.evidence}

`
    
    // Replace from slash to cursor with card content
    const newContent = content.substring(0, lastSlashIndex) + cardContent + content.substring(cursorPosition)
    
    setDocumentContent(newContent)
    setShowCardDropdown(false)
    setSearchTerm("")
    
    // Focus back to textarea and position cursor after inserted content
    setTimeout(() => {
      textarea.focus()
      const newCursorPosition = lastSlashIndex + cardContent.length
      textarea.setSelectionRange(newCursorPosition, newCursorPosition)
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCardDropdown) {
      if (e.key === 'Escape') {
        setShowCardDropdown(false)
        setSearchTerm("")
      } else if (e.key === 'Enter' && filteredCards.length > 0) {
        e.preventDefault()
        insertCard(filteredCards[0])
      }
    }
  }

  const saveDocument = async () => {
    // Mock save - in real app, this would call API
    console.log("Saving document:", { title: documentTitle, content: documentContent })
    // Auto-save functionality would go here
  }

  // Auto-save effect
  useEffect(() => {
    if (documentContent && mode === "document-writer") {
      const timer = setTimeout(saveDocument, 2000)
      return () => clearTimeout(timer)
    }
  }, [documentContent, documentTitle])

  // Document writer mode
  if (mode === "document-writer") {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b p-4 space-y-3">
          <div className="flex items-center gap-4">
            <Input
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="Document title..."
              className="text-lg font-semibold"
            />
            <Button onClick={saveDocument}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>

        {/* Document Editor */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={documentContent}
            onChange={handleDocumentContentChange}
            onKeyDown={handleKeyDown}
            placeholder="Start typing your document... Type '/' to insert evidence cards"
            className="w-full h-full border-none resize-none focus:outline-none"
            style={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.5' }}
          />
          
          {/* Evidence Card Dropdown */}
          {showCardDropdown && (
            <div
              className="absolute bg-[#252526] border border-[#37373d] rounded shadow-lg z-10 max-h-60 overflow-y-auto min-w-80"
              style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
            >
              {filteredCards.length > 0 ? (
                filteredCards.map((card) => (
                  <div
                    key={card.id}
                    className="p-3 hover:bg-[#37373d] cursor-pointer border-b border-[#37373d] last:border-b-0"
                    onClick={() => insertCard(card)}
                  >
                    <div className="font-medium text-[#cccccc] text-sm">{card.tagLine}</div>
                    {card.shorthand && (
                      <div className="text-[#a1a1a1] text-xs mt-1">{card.shorthand}</div>
                    )}
                    <div className="text-[#858585] text-xs mt-1 truncate">
                      {card.evidence.substring(0, 100)}...
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-[#a1a1a1] text-sm">
                  No cards found matching "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
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
                    <RichTextEditor
                      value={entry.quote_text || ""}
                      onChange={(value) => setEntry({ ...entry, quote_text: value })}
                      formattingData={entry.formattingData}
                      onFormattingChange={(formatting) => setEntry({ ...entry, formattingData: formatting })}
                      minHeight="min-h-[120px]"
                      placeholder="Enter the quote text..."
                      enableFormatting={true}
                      enableHighlighting={true}
                      enableMinimize={true}
                      showCharacterCount={true}
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
                    <RichTextEditor
                      value={entry.summary}
                      onChange={(value) => setEntry({ ...entry, summary: value })}
                      placeholder="Enter summary..."
                      enableFormatting={false}
                      showCharacterCount={true}
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
                    <RichTextEditor
                      value={entry.mla_citation || ""}
                      onChange={(value) => setEntry({ ...entry, mla_citation: value })}
                      placeholder="Enter MLA citation..."
                      enableFormatting={false}
                      showCharacterCount={true}
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
                    <RichTextEditor
                      value={entry.author_qualifications || ""}
                      onChange={(value) => setEntry({ ...entry, author_qualifications: value })}
                      placeholder="Enter author qualifications..."
                      enableFormatting={false}
                      showCharacterCount={true}
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
                    <RichTextEditor
                      value={entry.warrant_text || ""}
                      onChange={(value) => setEntry({ ...entry, warrant_text: value })}
                      minHeight="min-h-[120px]"
                      placeholder="Enter warrant analysis..."
                      enableFormatting={true}
                      enableHighlighting={true}
                      enableMinimize={true}
                      showCharacterCount={true}
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
                  <RichTextEditor
                    value={entry.summary}
                    onChange={(value) => setEntry({ ...entry, summary: value })}
                    placeholder="Enter summary..."
                    enableFormatting={false}
                    showCharacterCount={true}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{entry.summary}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                {isEditing ? (
                  <RichTextEditor
                    value={entry.content || ""}
                    onChange={(value) => setEntry({ ...entry, content: value })}
                    minHeight="min-h-[200px]"
                    placeholder="Enter analytics content..."
                    enableFormatting={true}
                    enableHighlighting={true}
                    enableMinimize={true}
                    showCharacterCount={true}
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
                  <RichTextEditor
                    value={entry.summary}
                    onChange={(value) => setEntry({ ...entry, summary: value })}
                    placeholder="Enter summary..."
                    enableFormatting={false}
                    showCharacterCount={true}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{entry.summary}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Definition Text</label>
                {isEditing ? (
                  <RichTextEditor
                    value={entry.definition_text || ""}
                    onChange={(value) => setEntry({ ...entry, definition_text: value })}
                    minHeight="min-h-[120px]"
                    placeholder="Enter definition..."
                    enableFormatting={true}
                    enableHighlighting={true}
                    enableMinimize={true}
                    showCharacterCount={true}
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
