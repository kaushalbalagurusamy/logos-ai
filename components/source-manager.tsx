"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  Save,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  CalendarIcon,
  FileText,
  AlertTriangle,
  X,
  BookOpen,
} from "lucide-react"
import { EvidenceEditor } from "./evidence-editor"
import { ipccAR6Data } from "./test-data"

interface FormattingData {
  emphasis: Array<{
    start: number
    end: number
    style: "bold-underline"
    font: string
    size: number
  }>
  highlights: Array<{
    start: number
    end: number
    color: "pastel-blue" | "pastel-pink" | "pastel-green" | "pastel-yellow"
  }>
  minimized: Array<{
    start: number
    end: number
    size: number
  }>
}

interface EvidenceCard {
  id: string
  sourceId: string
  tagLine: string
  evidence: string
  shorthand: string
  positionInSource?: number
  userId: string
  createdAt: Date
  updatedAt: Date
  formattingData?: FormattingData
}

interface Source {
  id: string
  title: string
  author?: string
  publication?: string
  date?: Date
  url?: string
  citationStyle: "MLA" | "APA" | "Chicago"
  authorQualifications?: string
  studyMethodology?: string
  filePath?: string
  fileMetadata?: {
    size: number
    type: string
    uploadDate: Date
    originalName: string
  }
  version: number
  userId: string
  createdAt: Date
  updatedAt: Date
  cards: EvidenceCard[]
}

interface UserType {
  id: string
  email: string
  name?: string
  preferences?: {
    defaultCitationStyle: "MLA" | "APA" | "Chicago"
    emphasisFont?: string
    emphasisSize?: number
    minimizeSize?: number
  }
}

interface SourceManagerProps {
  user: UserType
  selectedSourceId?: string | null
  selectedCardId?: string | null
  expandedSources?: string[]
  onToggleSource?: (sourceId: string) => void
}

export function SourceManager({
  user,
  selectedSourceId,
  selectedCardId,
  expandedSources = [],
  onToggleSource,
}: SourceManagerProps) {
  const [sources, setSources] = useState<Source[]>([])
  const [selectedSource, setSelectedSource] = useState<Source | null>(null)
  const [selectedCard, setSelectedCard] = useState<EvidenceCard | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isCreatingCard, setIsCreatingCard] = useState(false)
  const [formData, setFormData] = useState<Partial<Source>>({})
  const [cardFormData, setCardFormData] = useState<Partial<EvidenceCard>>({})
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [duplicateWarning, setDuplicateWarning] = useState<string>("")
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "">("")

  // Load IPCC AR6 data
  useEffect(() => {
    setSources([ipccAR6Data.source])
  }, [user.id])

  // Handle selection from explorer
  useEffect(() => {
    if (selectedSourceId) {
      const source = sources.find((s) => s.id === selectedSourceId)
      if (source) {
        setSelectedSource(source)
        setIsCreating(false)
        setIsEditing(false)
        setIsCreatingCard(false)

        if (selectedCardId) {
          const card = source.cards.find((c) => c.id === selectedCardId)
          setSelectedCard(card || null)
        } else {
          // If no specific card is selected, select the first card or null
          setSelectedCard(source.cards[0] || null)
        }
      }
    } else {
      setSelectedSource(null)
      setSelectedCard(null)
    }
  }, [selectedSourceId, selectedCardId, sources])

  // Auto-save functionality
  const autoSaveCard = useCallback(
    async (cardData: Partial<EvidenceCard>) => {
      if (!selectedCard || !selectedSource) return

      setAutoSaveStatus("saving")

      // Simulate API call
      setTimeout(() => {
        const updatedCard = { ...selectedCard, ...cardData, updatedAt: new Date() }
        const updatedSource = {
          ...selectedSource,
          cards: selectedSource.cards.map((card) => (card.id === selectedCard.id ? updatedCard : card)),
        }

        setSources((prev) => prev.map((source) => (source.id === selectedSource.id ? updatedSource : source)))
        setSelectedSource(updatedSource)
        setSelectedCard(updatedCard)
        setAutoSaveStatus("saved")

        // Clear saved status after 2 seconds
        setTimeout(() => setAutoSaveStatus(""), 2000)
      }, 500)
    },
    [selectedCard, selectedSource],
  )

  const formatCitation = (source: Partial<Source>): string => {
    const { title, author, publication, date, url, citationStyle } = source

    if (!title) return ""

    const formatDate = (date: Date, style: string) => {
      switch (style) {
        case "MLA":
          return format(date, "d MMM yyyy")
        case "APA":
          return format(date, "yyyy, MMMM d")
        case "Chicago":
          return format(date, "MMMM d, yyyy")
        default:
          return format(date, "yyyy-MM-dd")
      }
    }

    switch (citationStyle) {
      case "MLA":
        let mla = ""
        if (author) {
          const names = author.split(" ")
          if (names.length >= 2) {
            mla += `${names[names.length - 1]}, ${names.slice(0, -1).join(" ")}. `
          } else {
            mla += `${author}. `
          }
        }
        mla += `"${title}."`
        if (publication) mla += ` ${publication},`
        if (date) mla += ` ${formatDate(date, "MLA")},`
        if (url) mla += ` ${url}.`
        return mla

      case "APA":
        let apa = ""
        if (author) {
          const names = author.split(" ")
          if (names.length >= 2) {
            apa += `${names[names.length - 1]}, ${names
              .slice(0, -1)
              .map((n) => n[0])
              .join(". ")}. `
          } else {
            apa += `${author}. `
          }
        }
        if (date) apa += `(${formatDate(date, "APA")}). `
        apa += `${title}.`
        if (publication) apa += ` ${publication}.`
        if (url) apa += ` ${url}`
        return apa

      case "Chicago":
        let chicago = ""
        if (author) chicago += `${author}. `
        chicago += `"${title}."`
        if (publication) chicago += ` ${publication}.`
        if (date) chicago += ` ${formatDate(date, "Chicago")}.`
        if (url) chicago += ` ${url}.`
        return chicago

      default:
        return `${author || "Unknown"}. ${title}. ${publication || ""}. ${date ? format(date, "yyyy") : ""}`
    }
  }

  const validateForm = (data: Partial<Source>): Record<string, string> => {
    const errors: Record<string, string> = {}

    if (!data.title?.trim()) {
      errors.title = "Title is required"
    }

    if (data.url && !isValidUrl(data.url)) {
      errors.url = "Please enter a valid URL"
    }

    return errors
  }

  const validateCardForm = (data: Partial<EvidenceCard>): Record<string, string> => {
    const errors: Record<string, string> = {}

    if (!data.tagLine?.trim()) {
      errors.tagLine = "Tag line is required"
    }

    if (!data.evidence?.trim()) {
      errors.evidence = "Evidence is required"
    }

    if (!data.shorthand?.trim()) {
      errors.shorthand = "Shorthand is required"
    }

    return errors
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const checkForDuplicates = (data: Partial<Source>): string => {
    if (!data.title || !data.author) return ""

    const duplicate = sources.find(
      (s) =>
        s.id !== data.id &&
        s.title.toLowerCase() === data.title.toLowerCase() &&
        s.author?.toLowerCase() === data.author.toLowerCase(),
    )

    return duplicate ? `A source with this title and author already exists: "${duplicate.title}"` : ""
  }

  const handleCreateNew = () => {
    setIsCreating(true)
    setIsEditing(true)
    setSelectedSource(null)
    setSelectedCard(null)
    setFormData({
      citationStyle: user.preferences?.defaultCitationStyle || "MLA",
      userId: user.id,
    })
    setValidationErrors({})
    setDuplicateWarning("")
  }

  const handleCreateNewCard = () => {
    if (!selectedSource) return

    setIsCreatingCard(true)
    setSelectedCard(null)
    setCardFormData({
      sourceId: selectedSource.id,
      userId: user.id,
      positionInSource: selectedSource.cards.length + 1,
    })
    setValidationErrors({})
  }

  const handleEdit = (source: Source) => {
    setIsEditing(true)
    setIsCreating(false)
    setSelectedSource(source)
    setFormData({ ...source })
    setValidationErrors({})
    setDuplicateWarning("")
  }

  const handleSelectCard = (card: EvidenceCard) => {
    if (isCreatingCard) return

    setSelectedCard(card)
    setIsCreatingCard(false)
  }

  const handleSave = () => {
    const errors = validateForm(formData)
    const duplicate = checkForDuplicates(formData)

    setValidationErrors(errors)
    setDuplicateWarning(duplicate)

    if (Object.keys(errors).length > 0) return

    const now = new Date()

    if (isCreating) {
      const newSource: Source = {
        id: `src-${Date.now()}`,
        title: formData.title!,
        author: formData.author,
        publication: formData.publication,
        date: formData.date,
        url: formData.url,
        citationStyle: formData.citationStyle!,
        authorQualifications: formData.authorQualifications,
        studyMethodology: formData.studyMethodology,
        version: 1,
        userId: user.id,
        createdAt: now,
        updatedAt: now,
        cards: [],
      }
      setSources((prev) => [...prev, newSource])
      setSelectedSource(newSource)
    } else if (selectedSource) {
      const updatedSource: Source = {
        ...selectedSource,
        ...formData,
        updatedAt: now,
        version: selectedSource.version + 1,
      }
      setSources((prev) => prev.map((source) => (source.id === selectedSource.id ? updatedSource : source)))
      setSelectedSource(updatedSource)
    }

    setIsEditing(false)
    setIsCreating(false)
  }

  const handleSaveCard = () => {
    const errors = validateCardForm(cardFormData)
    setValidationErrors(errors)

    if (Object.keys(errors).length > 0) return

    const now = new Date()

    if (isCreatingCard && selectedSource) {
      const newCard: EvidenceCard = {
        id: `card-${Date.now()}`,
        sourceId: selectedSource.id,
        tagLine: cardFormData.tagLine!,
        evidence: cardFormData.evidence!,
        shorthand: cardFormData.shorthand!,
        positionInSource: cardFormData.positionInSource || selectedSource.cards.length + 1,
        userId: user.id,
        createdAt: now,
        updatedAt: now,
      }

      const updatedSource = {
        ...selectedSource,
        cards: [...selectedSource.cards, newCard],
      }

      setSources((prev) => prev.map((source) => (source.id === selectedSource.id ? updatedSource : source)))
      setSelectedSource(updatedSource)
      setSelectedCard(newCard)
      setIsCreatingCard(false)
      setCardFormData({})
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsCreating(false)
    setIsCreatingCard(false)
    setFormData({})
    setCardFormData({})
    setValidationErrors({})
    setDuplicateWarning("")
    if (isCreating) {
      setSelectedSource(null)
      setSelectedCard(null)
    }
  }

  const handleDelete = (sourceId: string) => {
    setSources((prev) => prev.filter((s) => s.id !== sourceId))
    if (selectedSource?.id === sourceId) {
      setSelectedSource(null)
      setSelectedCard(null)
    }
  }

  const handleDeleteCard = (cardId: string) => {
    if (!selectedSource) return

    const updatedSource = {
      ...selectedSource,
      cards: selectedSource.cards.filter((card) => card.id !== cardId),
    }

    setSources((prev) => prev.map((source) => (source.id === selectedSource.id ? updatedSource : source)))
    setSelectedSource(updatedSource)

    if (selectedCard?.id === cardId) {
      setSelectedCard(updatedSource.cards[0] || null)
    }
  }

  const handleFormChange = (field: keyof Source, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }))
    }

    // Check for duplicates on title/author change
    if (field === "title" || field === "author") {
      const newData = { ...formData, [field]: value }
      setDuplicateWarning(checkForDuplicates(newData))
    }
  }

  const handleCardFormChange = (field: keyof EvidenceCard, value: any) => {
    if (isCreatingCard) {
      setCardFormData((prev) => ({ ...prev, [field]: value }))
    } else if (selectedCard) {
      const updatedData = { [field]: value }
      autoSaveCard(updatedData)
    }

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="h-full flex bg-[#1e1e1e] text-[#cccccc]">
      {/* Middle Panel (Details/Form) */}
      <div className="flex-1 flex flex-col">
        {selectedSource || isCreating ? (
          <div className="flex-1 flex flex-col">
            {/* Source Details Header */}
            <div className="border-b border-[#37373d] px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#569cd6]" />
                <span className="text-sm font-medium">{isCreating ? "New Source" : selectedSource?.title}</span>
                {selectedSource && (
                  <Badge variant="secondary" className="bg-[#37373d] text-[#cccccc] text-xs">
                    {selectedSource.cards.length} cards
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!isEditing && selectedSource && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(selectedSource)}
                      className="border-[#37373d] bg-[#2d2d30] text-[#cccccc] hover:bg-[#37373d] text-xs"
                    >
                      <Edit3 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#d16969] bg-[#2d2d30] text-[#d16969] hover:bg-[#d16969] hover:text-white text-xs"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-[#252526] border-[#37373d] text-[#cccccc]">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Source</AlertDialogTitle>
                          <AlertDialogDescription className="text-[#a1a1a1]">
                            Are you sure you want to delete "{selectedSource.title}"? This will also delete all{" "}
                            {selectedSource.cards.length} evidence cards. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-[#37373d] bg-[#2d2d30] text-[#cccccc] hover:bg-[#37373d]">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(selectedSource.id)}
                            className="bg-[#d16969] hover:bg-[#b85450] text-white"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </div>

            {/* Evidence Cards Tabs */}
            {selectedSource && !isEditing && !isCreating && (
              <div className="border-b border-[#37373d] px-4 py-1">
                <div className="flex items-center gap-1 overflow-x-auto">
                  {selectedSource.cards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => handleSelectCard(card)}
                      className={`px-3 py-1.5 text-xs rounded-sm whitespace-nowrap transition-colors ${
                        selectedCard?.id === card.id
                          ? "bg-[#37373d] text-[#cccccc] border-b-2 border-[#007acc]"
                          : "text-[#a1a1a1] hover:bg-[#2a2d2e] hover:text-[#cccccc]"
                      }`}
                    >
                      {card.shorthand}
                    </button>
                  ))}
                  <button
                    onClick={handleCreateNewCard}
                    className="px-2 py-1.5 text-xs text-[#a1a1a1] hover:bg-[#2a2d2e] hover:text-[#cccccc] rounded-sm transition-colors"
                    disabled={isCreatingCard}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
              {isEditing || isCreating ? (
                // Source Form
                <ScrollArea className="h-full">
                  <div className="p-6 space-y-6 max-w-3xl">
                    {/* Duplicate Warning */}
                    {duplicateWarning && (
                      <Alert className="border-[#d16969] bg-[#2d2d30]">
                        <AlertTriangle className="h-4 w-4 text-[#d16969]" />
                        <AlertDescription className="text-[#d16969]">{duplicateWarning}</AlertDescription>
                      </Alert>
                    )}

                    {/* Citation Preview */}
                    {(selectedSource || formData.title) && (
                      <div className="p-4 bg-[#252526] border border-[#37373d] rounded-sm">
                        <Label className="text-xs font-medium text-[#cccccc] mb-2 block">Citation Preview</Label>
                        <div className="font-serif text-sm text-[#cccccc] leading-relaxed">
                          {formatCitation(isEditing ? formData : selectedSource!)}
                        </div>
                      </div>
                    )}

                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-[#cccccc] border-b border-[#37373d] pb-2">
                        Basic Information
                      </h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <Label htmlFor="title" className="text-xs font-medium text-[#cccccc]">
                            Title *
                          </Label>
                          <Input
                            id="title"
                            value={isEditing ? formData.title || "" : selectedSource?.title || ""}
                            onChange={(e) => handleFormChange("title", e.target.value)}
                            disabled={!isEditing}
                            className={`mt-1 bg-[#2d2d30] border-[#37373d] text-[#cccccc] text-sm ${
                              validationErrors.title ? "border-[#d16969]" : ""
                            }`}
                            placeholder="Enter source title"
                          />
                          {validationErrors.title && (
                            <p className="text-xs text-[#d16969] mt-1">{validationErrors.title}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="author" className="text-xs font-medium text-[#cccccc]">
                            Author
                          </Label>
                          <Input
                            id="author"
                            value={isEditing ? formData.author || "" : selectedSource?.author || ""}
                            onChange={(e) => handleFormChange("author", e.target.value)}
                            disabled={!isEditing}
                            className="mt-1 bg-[#2d2d30] border-[#37373d] text-[#cccccc] text-sm"
                            placeholder="Author name"
                          />
                        </div>

                        <div>
                          <Label htmlFor="publication" className="text-xs font-medium text-[#cccccc]">
                            Publication
                          </Label>
                          <Input
                            id="publication"
                            value={isEditing ? formData.publication || "" : selectedSource?.publication || ""}
                            onChange={(e) => handleFormChange("publication", e.target.value)}
                            disabled={!isEditing}
                            className="mt-1 bg-[#2d2d30] border-[#37373d] text-[#cccccc] text-sm"
                            placeholder="Publication name"
                          />
                        </div>

                        <div>
                          <Label htmlFor="date" className="text-xs font-medium text-[#cccccc]">
                            Publication Date
                          </Label>
                          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                disabled={!isEditing}
                                className="w-full mt-1 justify-start text-left font-normal bg-[#2d2d30] border-[#37373d] text-[#cccccc] hover:bg-[#37373d]"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {(isEditing ? formData.date : selectedSource?.date) ? (
                                  format(isEditing ? formData.date! : selectedSource!.date!, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-[#252526] border-[#37373d]" align="start">
                              <Calendar
                                mode="single"
                                selected={isEditing ? formData.date : selectedSource?.date}
                                onSelect={(date) => {
                                  handleFormChange("date", date)
                                  setDatePickerOpen(false)
                                }}
                                initialFocus
                                className="bg-[#252526] text-[#cccccc]"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div>
                          <Label htmlFor="citationStyle" className="text-xs font-medium text-[#cccccc]">
                            Citation Style
                          </Label>
                          <Select
                            value={isEditing ? formData.citationStyle : selectedSource?.citationStyle}
                            onValueChange={(value) => handleFormChange("citationStyle", value)}
                            disabled={!isEditing}
                          >
                            <SelectTrigger className="mt-1 bg-[#2d2d30] border-[#37373d] text-[#cccccc]">
                              <SelectValue placeholder="Select citation style" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#252526] border-[#37373d] text-[#cccccc]">
                              <SelectItem value="MLA">MLA</SelectItem>
                              <SelectItem value="APA">APA</SelectItem>
                              <SelectItem value="Chicago">Chicago</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="url" className="text-xs font-medium text-[#cccccc]">
                          URL
                        </Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="url"
                            value={isEditing ? formData.url || "" : selectedSource?.url || ""}
                            onChange={(e) => handleFormChange("url", e.target.value)}
                            disabled={!isEditing}
                            className={`flex-1 bg-[#2d2d30] border-[#37373d] text-[#cccccc] text-sm ${
                              validationErrors.url ? "border-[#d16969]" : ""
                            }`}
                            placeholder="https://example.com"
                          />
                          {!isEditing && selectedSource?.url && isValidUrl(selectedSource.url) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(selectedSource.url, "_blank")}
                              className="border-[#37373d] bg-[#2d2d30] text-[#cccccc] hover:bg-[#37373d]"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        {validationErrors.url && <p className="text-xs text-[#d16969] mt-1">{validationErrors.url}</p>}
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-[#cccccc] border-b border-[#37373d] pb-2">
                        Additional Information
                      </h3>

                      <div>
                        <Label htmlFor="authorQualifications" className="text-xs font-medium text-[#cccccc]">
                          Author Qualifications
                        </Label>
                        <Textarea
                          id="authorQualifications"
                          value={
                            isEditing ? formData.authorQualifications || "" : selectedSource?.authorQualifications || ""
                          }
                          onChange={(e) => handleFormChange("authorQualifications", e.target.value)}
                          disabled={!isEditing}
                          className="mt-1 min-h-[80px] bg-[#2d2d30] border-[#37373d] text-[#cccccc] text-sm resize-none"
                          placeholder="Describe the author's credentials and expertise"
                        />
                      </div>

                      <div>
                        <Label htmlFor="studyMethodology" className="text-xs font-medium text-[#cccccc]">
                          Study Methodology
                        </Label>
                        <Textarea
                          id="studyMethodology"
                          value={isEditing ? formData.studyMethodology || "" : selectedSource?.studyMethodology || ""}
                          onChange={(e) => handleFormChange("studyMethodology", e.target.value)}
                          disabled={!isEditing}
                          className="mt-1 min-h-[80px] bg-[#2d2d30] border-[#37373d] text-[#cccccc] text-sm resize-none"
                          placeholder="Describe the research methodology used"
                        />
                      </div>
                    </div>

                    {/* Metadata */}
                    {selectedSource && !isCreating && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-[#cccccc] border-b border-[#37373d] pb-2">Metadata</h3>
                        <div className="grid grid-cols-2 gap-4 text-xs text-[#a1a1a1]">
                          <div>
                            <span className="font-medium">Created:</span> {format(selectedSource.createdAt, "PPp")}
                          </div>
                          <div>
                            <span className="font-medium">Updated:</span> {format(selectedSource.updatedAt, "PPp")}
                          </div>
                          <div>
                            <span className="font-medium">Version:</span> {selectedSource.version}
                          </div>
                          <div>
                            <span className="font-medium">Evidence Cards:</span> {selectedSource.cards.length}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-[#37373d]">
                      <Button
                        onClick={handleSave}
                        className="bg-[#007acc] hover:bg-[#005a9e] text-white border-0 rounded-sm"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="border-[#37373d] bg-[#2d2d30] text-[#cccccc] hover:bg-[#37373d]"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              ) : isCreatingCard ? (
                // Card Creation Form
                <div className="p-6 space-y-6 max-w-3xl">
                  <h3 className="text-lg font-medium text-[#cccccc] border-b border-[#37373d] pb-2">
                    New Evidence Card
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardTagLine" className="text-xs font-medium text-[#cccccc]">
                        Tag Line *
                      </Label>
                      <Input
                        id="cardTagLine"
                        value={cardFormData.tagLine || ""}
                        onChange={(e) => handleCardFormChange("tagLine", e.target.value)}
                        className={`mt-1 bg-[#2d2d30] border-[#37373d] text-[#cccccc] text-sm ${
                          validationErrors.tagLine ? "border-[#d16969]" : ""
                        }`}
                        placeholder="Brief summary of the evidence"
                      />
                      {validationErrors.tagLine && (
                        <p className="text-xs text-[#d16969] mt-1">{validationErrors.tagLine}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="cardShorthand" className="text-xs font-medium text-[#cccccc]">
                        Shorthand *
                      </Label>
                      <Input
                        id="cardShorthand"
                        value={cardFormData.shorthand || ""}
                        onChange={(e) => handleCardFormChange("shorthand", e.target.value)}
                        className={`mt-1 bg-[#2d2d30] border-[#37373d] text-[#cccccc] text-sm ${
                          validationErrors.shorthand ? "border-[#d16969]" : ""
                        }`}
                        placeholder="Short name for tab display"
                      />
                      {validationErrors.shorthand && (
                        <p className="text-xs text-[#d16969] mt-1">{validationErrors.shorthand}</p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label htmlFor="cardEvidence" className="text-xs font-medium text-[#cccccc]">
                          Evidence *
                        </Label>
                        <span className="text-xs text-[#a1a1a1]">{cardFormData.evidence?.length || 0} characters</span>
                      </div>
                      <Textarea
                        id="cardEvidence"
                        value={cardFormData.evidence || ""}
                        onChange={(e) => handleCardFormChange("evidence", e.target.value)}
                        className={`mt-1 min-h-[300px] bg-[#2d2d30] border-[#37373d] text-[#cccccc] text-sm resize-none ${
                          validationErrors.evidence ? "border-[#d16969]" : ""
                        }`}
                        placeholder="Enter the evidence text here..."
                      />
                      {validationErrors.evidence && (
                        <p className="text-xs text-[#d16969] mt-1">{validationErrors.evidence}</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-[#37373d]">
                    <Button
                      onClick={handleSaveCard}
                      className="bg-[#007acc] hover:bg-[#005a9e] text-white border-0 rounded-sm"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save Card
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="border-[#37373d] bg-[#2d2d30] text-[#cccccc] hover:bg-[#37373d]"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : selectedCard ? (
                // Card Editor
                <EvidenceEditor
                  key={selectedCard.id}
                  card={selectedCard}
                  userPreferences={user.preferences || {}}
                  onCardChange={autoSaveCard}
                  onDelete={handleDeleteCard}
                />
              ) : (
                // No card selected
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-[#a1a1a1] mx-auto mb-4 opacity-60" />
                    <h3 className="text-lg font-medium text-[#cccccc] mb-2">No Evidence Card Selected</h3>
                    <p className="text-sm text-[#a1a1a1] mb-4">Select a card from the tabs above or create a new one</p>
                    <Button
                      onClick={handleCreateNewCard}
                      className="bg-[#007acc] hover:bg-[#005a9e] text-white border-0 rounded-sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Evidence Card
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Header with just + button */}
            <div className="border-b border-[#37373d] p-4 flex items-center justify-end">
              <Button
                onClick={handleCreateNew}
                className="bg-[#007acc] hover:bg-[#005a9e] text-white border-0 rounded-sm w-8 h-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Improved empty state */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md mx-auto px-8">
                <BookOpen className="h-20 w-20 text-[#a1a1a1] mx-auto mb-6 opacity-60" />
                <h3 className="text-xl font-medium text-[#cccccc] mb-3">No Source Selected</h3>
                <p className="text-sm text-[#a1a1a1] leading-relaxed mb-6">
                  Select a source from the explorer to view and edit its details, or create a new source to get started.
                </p>
                <Button
                  onClick={handleCreateNew}
                  className="bg-[#007acc] hover:bg-[#005a9e] text-white border-0 rounded-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Source
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
