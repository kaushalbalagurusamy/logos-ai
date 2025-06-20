"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
import { Bold, Underline, Minimize2, Eraser, Trash2 } from "lucide-react"

// Data models (should match source-manager.tsx)
interface FormattingData {
  emphasis: Array<{ start: number; end: number; style: "bold-underline"; font: string; size: number }>
  highlights: Array<{
    start: number
    end: number
    color: "pastel-blue" | "pastel-pink" | "pastel-green" | "pastel-yellow"
  }>
  minimized: Array<{ start: number; end: number; size: number }>
}
interface EvidenceCard {
  id: string
  evidence: string
  formattingData?: FormattingData
  [key: string]: any
}
interface UserPreferences {
  emphasisFont?: string
  emphasisSize?: number
  minimizeSize?: number
}

interface EvidenceEditorProps {
  card: EvidenceCard
  userPreferences: UserPreferences
  onCardChange: (updatedCard: Partial<EvidenceCard>) => void
  onDelete: (cardId: string) => void
}

// Debounce helper
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

export function EvidenceEditor({ card, userPreferences, onCardChange, onDelete }: EvidenceEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [charCount, setCharCount] = useState(card.evidence.length)
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean | string>>({})

  const debouncedOnCardChange = useCallback(debounce(onCardChange, 500), [onCardChange])

  const defaultPrefs = {
    emphasisFont: userPreferences.emphasisFont || "Times New Roman",
    emphasisSize: userPreferences.emphasisSize || 12,
    minimizeSize: userPreferences.minimizeSize || 6,
  }

  const getSelectionRange = (): { start: number; end: number } | null => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return null

    const range = selection.getRangeAt(0)
    if (!editorRef.current?.contains(range.commonAncestorContainer)) return null

    const preSelectionRange = document.createRange()
    preSelectionRange.selectNodeContents(editorRef.current)
    preSelectionRange.setEnd(range.startContainer, range.startOffset)
    const start = preSelectionRange.toString().length

    return { start, end: start + range.toString().length }
  }

  const applyFormatting = (type: "emphasis" | "highlight" | "minimize", value: any) => {
    const range = getSelectionRange()
    if (!range || range.start === range.end) return

    const newFormattingData = JSON.parse(
      JSON.stringify(card.formattingData || { emphasis: [], highlights: [], minimized: [] }),
    )

    if (type === "emphasis") {
      newFormattingData.emphasis.push({
        start: range.start,
        end: range.end,
        style: "bold-underline",
        font: defaultPrefs.emphasisFont,
        size: defaultPrefs.emphasisSize,
      })
    } else if (type === "highlight") {
      newFormattingData.highlights.push({
        start: range.start,
        end: range.end,
        color: value,
      })
    }

    // A more robust implementation would merge overlapping/adjacent ranges.
    onCardChange({ formattingData: newFormattingData })
  }

  const clearFormatting = () => {
    onCardChange({ formattingData: { emphasis: [], highlights: [], minimized: [] } })
  }

  const minimizeNonEmphasized = () => {
    const emphasizedRanges = card.formattingData?.emphasis || []
    if (emphasizedRanges.length === 0) return // Fails gracefully

    const minimizedRanges: Array<{ start: number; end: number; size: number }> = []
    let lastEmphasizedEnd = 0

    emphasizedRanges
      .sort((a, b) => a.start - b.start)
      .forEach((range) => {
        if (range.start > lastEmphasizedEnd) {
          minimizedRanges.push({ start: lastEmphasizedEnd, end: range.start, size: defaultPrefs.minimizeSize })
        }
        lastEmphasizedEnd = range.end
      })

    if (lastEmphasizedEnd < card.evidence.length) {
      minimizedRanges.push({ start: lastEmphasizedEnd, end: card.evidence.length, size: defaultPrefs.minimizeSize })
    }

    onCardChange({ formattingData: { ...card.formattingData, minimized: minimizedRanges } })
  }

  const handleInput = () => {
    if (!editorRef.current) return
    const newText = editorRef.current.innerText
    setCharCount(newText.length)
    // Simplified content update: this strips formatting on edit.
    // A full rich-text editor would parse the HTML to maintain formatting.
    if (newText !== card.evidence) {
      debouncedOnCardChange({ evidence: newText, formattingData: { emphasis: [], highlights: [], minimized: [] } })
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "e":
            e.preventDefault()
            applyFormatting("emphasis", true)
            break
          case "h":
            e.preventDefault()
            applyFormatting("highlight", "pastel-yellow") // Default highlight
            break
          case "m":
            e.preventDefault()
            minimizeNonEmphasized()
            break
          case "c":
            if (e.shiftKey) {
              e.preventDefault()
              clearFormatting()
            }
            break
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [card])

  const generateHtml = () => {
    const { evidence, formattingData } = card
    if (!formattingData) return evidence

    const allFormats = [
      ...(formattingData.emphasis || []).map((r) => ({ ...r, type: "emphasis" })),
      ...(formattingData.highlights || []).map((r) => ({ ...r, type: "highlight" })),
      ...(formattingData.minimized || []).map((r) => ({ ...r, type: "minimize" })),
    ]

    const points = new Set([0, evidence.length])
    allFormats.forEach((f) => {
      points.add(f.start)
      points.add(f.end)
    })

    const sortedPoints = Array.from(points).sort((a, b) => a - b)
    let html = ""

    for (let i = 0; i < sortedPoints.length - 1; i++) {
      const start = sortedPoints[i]
      const end = sortedPoints[i + 1]
      const mid = Math.floor((start + end) / 2)
      const segment = evidence.substring(start, end)

      if (segment.length === 0) continue

      let styles = ""
      let classes = ""

      const isEmphasized = (formattingData.emphasis || []).find((r) => mid >= r.start && mid < r.end)
      const highlight = (formattingData.highlights || []).find((r) => mid >= r.start && mid < r.end)
      const isMinimized = (formattingData.minimized || []).find((r) => mid >= r.start && mid < r.end)

      if (isEmphasized) {
        styles += `font-family: '${isEmphasized.font}'; font-size: ${isEmphasized.size}pt; font-weight: bold; text-decoration: underline;`
      }
      if (highlight) {
        classes += ` highlight-${highlight.color}`
      }
      if (isMinimized) {
        styles += `font-size: ${isMinimized.size}pt;`
      }

      html += `<span style="${styles}" class="${classes}">${segment}</span>`
    }
    return html
  }

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = generateHtml()
    }
    setCharCount(card.evidence.length)
  }, [card])

  const highlightColors = ["pastel-blue", "pastel-pink", "pastel-green", "pastel-yellow"]

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      <style jsx global>{`
        .highlight-pastel-blue { background-color: rgba(52, 152, 219, 0.3); }
        .highlight-pastel-pink { background-color: rgba(231, 130, 193, 0.3); }
        .highlight-pastel-green { background-color: rgba(46, 204, 113, 0.3); }
        .highlight-pastel-yellow { background-color: rgba(241, 196, 15, 0.3); }
      `}</style>

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-4 py-1 border-b border-[#37373d] bg-[#252526]">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-1 hover:bg-[#37373d]"
                onClick={() => applyFormatting("emphasis", true)}
              >
                <Bold className="h-4 w-4" />
                <Underline className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#37373d] text-[#cccccc] border-0">Emphasis (Ctrl+E)</TooltipContent>
          </Tooltip>

          {highlightColors.map((color) => (
            <Tooltip key={color}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-1 hover:bg-[#37373d]"
                  onClick={() => applyFormatting("highlight", color)}
                >
                  <div className={`w-4 h-4 rounded-sm highlight-${color} border border-white/20`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-[#37373d] text-[#cccccc] border-0">Highlight (Ctrl+H)</TooltipContent>
            </Tooltip>
          ))}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-1 hover:bg-[#37373d]"
                onClick={minimizeNonEmphasized}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#37373d] text-[#cccccc] border-0">Minimize (Ctrl+M)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-1 hover:bg-[#37373d]" onClick={clearFormatting}>
                <Eraser className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#37373d] text-[#cccccc] border-0">
              Clear Formatting (Ctrl+Shift+C)
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex-1" />

        <span className="text-xs text-[#a1a1a1] mr-4">Chars: {charCount}</span>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-1 text-[#d16969] hover:bg-[#d16969]/20 hover:text-[#d16969]"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#252526] border-[#37373d] text-[#cccccc]">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Evidence Card</AlertDialogTitle>
              <AlertDialogDescription className="text-[#a1a1a1]">
                Are you sure you want to delete this card? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-[#37373d] bg-[#2d2d30] text-[#cccccc] hover:bg-[#37373d]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(card.id)}
                className="bg-[#d16969] hover:bg-[#b85450] text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto p-4">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="outline-none leading-relaxed"
          style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        />
      </div>
    </div>
  )
}
