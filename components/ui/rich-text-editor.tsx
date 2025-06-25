"use client"

import { useState, useEffect, useRef, useCallback, forwardRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Bold, Underline, Minimize2, Eraser, Palette } from "lucide-react"
import { useSlashCommand, type SlashCommandItem } from "@/hooks/use-slash-command"
import { InsertionDropdown } from "@/components/insertion-dropdown"
import type { FormattingData } from "@/lib/types"

/**
 * Configuration interface for RichTextEditor
 */
export interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  formattingData?: FormattingData
  onFormattingChange?: (formatting: FormattingData) => void
  placeholder?: string
  minHeight?: string
  maxHeight?: string
  enableFormatting?: boolean
  enableHighlighting?: boolean
  enableMinimize?: boolean
  enableAutoSave?: boolean
  autoSaveInterval?: number
  characterLimit?: number
  showCharacterCount?: boolean
  disabled?: boolean
  className?: string
  field?: string
  emphasisFont?: string
  emphasisSize?: number
  minimizeSize?: number
  enableSlashCommands?: boolean
}

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

/**
 * RichTextEditor component - Centralized text editor with debate-specific formatting
 * 
 * Features:
 * - Rich text editing with debate-specific formatting
 * - Bold + underline "emphasis" hotkey (Ctrl/Cmd + E)
 * - Highlight hotkey (Ctrl/Cmd + H) with color options
 * - Minimize hotkey (Ctrl/Cmd + M) - reduces non-emphasized text
 * - Real-time auto-save capability
 * - Character count display
 * - VSCode theme integration
 */
export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  (
    {
      value,
      onChange,
      formattingData,
      onFormattingChange,
      placeholder = "Enter text...",
      minHeight = "min-h-[80px]",
      maxHeight,
      enableFormatting = true,
      enableHighlighting = true,
      enableMinimize = true,
      enableAutoSave = false,
      autoSaveInterval = 2000,
      characterLimit,
      showCharacterCount = true,
      disabled = false,
      className,
      field,
      enableSlashCommands = false,
      emphasisFont = "Times New Roman",
      emphasisSize = 12,
      minimizeSize = 6,
    },
    ref
  ) => {
    const editorRef = useRef<HTMLDivElement>(null)
    const [charCount, setCharCount] = useState(value.length)
    const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved")
    const [showColorPicker, setShowColorPicker] = useState(false)
    const [internalValue, setInternalValue] = useState(value)
    const isInternalUpdate = useRef(false)

    /**
     * Apply formatting data to text content to generate HTML
     */
    const applyFormattingToText = useCallback((textContent: string, formatting: FormattingData): string => {
      if (!formatting) return textContent
      
      const allFormats = [
        ...(formatting.emphasis || []).map((r) => ({ ...r, type: "emphasis" })),
        ...(formatting.highlights || []).map((r) => ({ ...r, type: "highlight" })),
        ...(formatting.minimized || []).map((r) => ({ ...r, type: "minimize" })),
      ]
      
      if (allFormats.length === 0) return textContent
      
      const points = new Set([0, textContent.length])
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
        const segment = textContent.substring(start, end)
        
        if (segment.length === 0) continue
        
        let styles = ""
        let classes = ""
        
        const isEmphasized = (formatting.emphasis || []).find((r) => mid >= r.start && mid < r.end)
        const highlight = (formatting.highlights || []).find((r) => mid >= r.start && mid < r.end)
        const isMinimized = (formatting.minimized || []).find((r) => mid >= r.start && mid < r.end)
        
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
    }, [])

    // Slash command functionality
    const handleSlashInsert = useCallback((item: SlashCommandItem) => {
      if (!editorRef.current) return

      const editor = editorRef.current
      const selection = window.getSelection()
      
      if (!selection || selection.rangeCount === 0) return

      const range = selection.getRangeAt(0)
      const textBeforeCursor = editorRef.current.innerText
      const cursorPosition = getSelectionRange()?.start || 0

      // Find the slash position
      const lastSlashIndex = textBeforeCursor.lastIndexOf('/', cursorPosition)
      
      if (lastSlashIndex === -1) return

      // Format the inserted content
      let insertedContent = ''
      
      if (item.type === 'evidence-card') {
        // Format evidence card insertion with proper styling
        const source = item.source || {}
        const formatDate = (date: Date | string | undefined) => {
          if (!date) return "No Date"
          return new Date(date).getFullYear().toString()
        }
        
        // Build citation with qualifications
        let citation = "No Citation"
        if (source.author) {
          citation = `${source.author} ${formatDate(source.date)}`
          if (source.publication) {
            citation += ` (${source.publication})`
          }
          
          // Add qualifications and methodology in parentheses
          const qualifications = item.authorQualifications || ""
          const methodology = item.studyMethodology || ""
          if (qualifications || methodology) {
            citation += ` (`
            if (qualifications) citation += qualifications
            if (qualifications && methodology) citation += "; "
            if (methodology) citation += methodology
            citation += `)`
          }
        }
        
        // Apply formatting to evidence content if available
        let formattedEvidence = item.content
        if (item.formattingData) {
          formattedEvidence = applyFormattingToText(item.content, item.formattingData)
        }
        
        // Create styled HTML content
        insertedContent = `
<div style="font-family: 'Times New Roman', serif; font-size: 12pt; font-weight: bold;">TAG: ${item.title}</div>
<div style="font-family: 'Times New Roman', serif; font-size: 12pt; font-weight: bold;">AUTHOR: <span style="font-size: 12pt; font-weight: bold;">${source.author || 'Unknown'} ${formatDate(source.date)}${source.publication ? ` (${source.publication})` : ''}</span>${(item.authorQualifications || item.studyMethodology) ? ` <span style="font-family: 'Times New Roman', serif; font-size: 6pt; font-weight: normal;">(${[item.authorQualifications, item.studyMethodology].filter(Boolean).join('; ')})</span>` : ''}</div>
<div style="font-family: 'Times New Roman', serif;">EVIDENCE: ${formattedEvidence}</div>

`
      } else if (item.type === 'analytics') {
        // Format analytics insertion - content only with bold styling
        insertedContent = `<div style="font-family: 'Times New Roman', serif; font-size: 12pt; font-weight: bold;">${item.content}</div>

`
      }

      // For HTML content insertion, we need to handle it differently
      if (editorRef.current) {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          
          // Find and remove the slash and any search text
          const textBeforeSlash = textBeforeCursor.substring(0, lastSlashIndex)
          const textAfterCursor = textBeforeCursor.substring(cursorPosition)
          
          // Create temporary container for HTML content
          const tempDiv = document.createElement('div')
          tempDiv.innerHTML = insertedContent
          
          // Get current editor HTML content
          const currentHTML = editorRef.current.innerHTML
          
          // Calculate positions in HTML content (this is approximate)
          const beforeHTML = currentHTML.substring(0, lastSlashIndex)
          const afterHTML = currentHTML.substring(cursorPosition)
          
          // Insert HTML content directly
          const newHTML = beforeHTML + insertedContent + afterHTML
          editorRef.current.innerHTML = newHTML
          
          // Update text content for parent component
          const newTextContent = editorRef.current.innerText
          setInternalValue(newTextContent)
          isInternalUpdate.current = true
          
          if (enableAutoSave) {
            debouncedOnChange(newTextContent)
          } else {
            onChange(newTextContent)
          }
          
          // Position cursor after inserted content
          setTimeout(() => {
            if (editorRef.current) {
              editorRef.current.focus()
              
              // Move cursor to end of inserted content
              const selection = window.getSelection()
              if (selection) {
                const range = document.createRange()
                try {
                  // Position at the end of editor content
                  range.selectNodeContents(editorRef.current)
                  range.collapse(false)
                  selection.removeAllRanges()
                  selection.addRange(range)
                } catch (error) {
                  // Fallback: just focus
                  editorRef.current.focus()
                }
              }
            }
          }, 0)
        }
      }
    }, [value, enableAutoSave, enableFormatting, debouncedOnChange, onChange, applyFormattingToText])

    const slashCommand = useSlashCommand({
      onInsert: handleSlashInsert,
      enabled: enableSlashCommands && !disabled
    })

    // Auto-save functionality
    const debouncedOnChange = useCallback(
      debounce((newValue: string, newFormatting?: FormattingData) => {
        if (enableAutoSave) {
          setSaveStatus("saving")
          try {
            onChange(newValue)
            if (newFormatting && onFormattingChange) {
              onFormattingChange(newFormatting)
            }
            setSaveStatus("saved")
          } catch (error) {
            setSaveStatus("error")
          }
        } else {
          onChange(newValue)
          if (newFormatting && onFormattingChange) {
            onFormattingChange(newFormatting)
          }
        }
      }, autoSaveInterval),
      [onChange, onFormattingChange, enableAutoSave, autoSaveInterval]
    )

    /**
     * Get current text selection range in editor
     */
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

    /**
     * Apply formatting to selected text
     */
    const applyFormatting = (type: "emphasis" | "highlight" | "minimize", colorValue?: string) => {
      if (!enableFormatting || disabled) return
      
      const range = getSelectionRange()
      if (!range || range.start === range.end) return

      const currentFormatting = formattingData || { emphasis: [], highlights: [], minimized: [] }
      const newFormattingData = JSON.parse(JSON.stringify(currentFormatting))

      if (type === "emphasis") {
        newFormattingData.emphasis.push({
          start: range.start,
          end: range.end,
          style: "bold-underline" as const,
          font: emphasisFont,
          size: emphasisSize,
        })
      } else if (type === "highlight" && enableHighlighting && colorValue) {
        newFormattingData.highlights.push({
          start: range.start,
          end: range.end,
          color: colorValue as any,
        })
      }

      if (enableAutoSave) {
        debouncedOnChange(value, newFormattingData)
      } else if (onFormattingChange) {
        onFormattingChange(newFormattingData)
      }
    }

    /**
     * Clear all formatting
     */
    const clearFormatting = () => {
      if (!enableFormatting || disabled) return
      
      const clearedFormatting: FormattingData = { emphasis: [], highlights: [], minimized: [] }
      if (enableAutoSave) {
        debouncedOnChange(internalValue, clearedFormatting)
      } else if (onFormattingChange) {
        onFormattingChange(clearedFormatting)
      }
    }

    /**
     * Minimize all non-emphasized text
     */
    const minimizeNonEmphasized = () => {
      if (!enableMinimize || disabled) return
      
      const emphasizedRanges = formattingData?.emphasis || []
      if (emphasizedRanges.length === 0) return

      const minimizedRanges: Array<{ start: number; end: number; size: number }> = []
      let lastEmphasizedEnd = 0

      emphasizedRanges
        .sort((a, b) => a.start - b.start)
        .forEach((range) => {
          if (range.start > lastEmphasizedEnd) {
            minimizedRanges.push({ start: lastEmphasizedEnd, end: range.start, size: minimizeSize })
          }
          lastEmphasizedEnd = range.end
        })

      if (lastEmphasizedEnd < internalValue.length) {
        minimizedRanges.push({ start: lastEmphasizedEnd, end: internalValue.length, size: minimizeSize })
      }

      const newFormattingData: FormattingData = { 
        emphasis: formattingData?.emphasis || [],
        highlights: formattingData?.highlights || [],
        minimized: minimizedRanges 
      }
      if (enableAutoSave) {
        debouncedOnChange(internalValue, newFormattingData)
      } else if (onFormattingChange) {
        onFormattingChange(newFormattingData)
      }
    }

    /**
     * Save and restore cursor position
     */
    const saveCursorPosition = (): { start: number; end: number } | null => {
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0 || !editorRef.current) return null

      const range = selection.getRangeAt(0)
      if (!editorRef.current.contains(range.commonAncestorContainer)) return null

      const preSelectionRange = document.createRange()
      preSelectionRange.selectNodeContents(editorRef.current)
      preSelectionRange.setEnd(range.startContainer, range.startOffset)
      const start = preSelectionRange.toString().length

      return { start, end: start + range.toString().length }
    }

    const restoreCursorPosition = (position: { start: number; end: number }) => {
      if (!editorRef.current) return

      const selection = window.getSelection()
      if (!selection) return

      let charIndex = 0
      let range = document.createRange()
      range.setStart(editorRef.current, 0)
      range.collapse(true)

      const nodeIterator = document.createNodeIterator(
        editorRef.current,
        NodeFilter.SHOW_TEXT,
        null
      )

      let textNode: Text | null
      while ((textNode = nodeIterator.nextNode() as Text | null)) {
        const nextCharIndex = charIndex + textNode.textContent!.length

        if (position.start >= charIndex && position.start <= nextCharIndex) {
          range.setStart(textNode, position.start - charIndex)
        }
        if (position.end >= charIndex && position.end <= nextCharIndex) {
          range.setEnd(textNode, position.end - charIndex)
          break
        }

        charIndex = nextCharIndex
      }

      selection.removeAllRanges()
      selection.addRange(range)
    }

    /**
     * Handle text input changes
     */
    const handleInput = () => {
      if (!editorRef.current || disabled) return
      
      const newText = editorRef.current.innerText
      setCharCount(newText.length)
      setInternalValue(newText)
      isInternalUpdate.current = true

      // Handle slash commands
      if (enableSlashCommands) {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          const cursorPosition = getSelectionRange()?.start || 0
          slashCommand.handleTextChange(newText, cursorPosition, editorRef.current)
        }
      }

      if (newText !== value) {
        if (enableAutoSave) {
          debouncedOnChange(newText)
        } else {
          onChange(newText)
        }
      }
    }

    /**
     * Generate HTML with formatting applied
     */
    const generateHtml = (textContent: string) => {
      if (!formattingData) return textContent

      const allFormats = [
        ...(formattingData.emphasis || []).map((r) => ({ ...r, type: "emphasis" })),
        ...(formattingData.highlights || []).map((r) => ({ ...r, type: "highlight" })),
        ...(formattingData.minimized || []).map((r) => ({ ...r, type: "minimize" })),
      ]

      const points = new Set([0, textContent.length])
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
        const segment = textContent.substring(start, end)

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

    // Keyboard shortcuts
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Handle slash command navigation first
        if (enableSlashCommands && slashCommand.showDropdown) {
          slashCommand.handleKeyDown(e as any)
          return
        }
        
        if (!enableFormatting || disabled) return
        
        if (e.ctrlKey || e.metaKey) {
          switch (e.key.toLowerCase()) {
            case "e":
              e.preventDefault()
              applyFormatting("emphasis")
              break
            case "h":
              e.preventDefault()
              if (enableHighlighting) {
                setShowColorPicker(true)
              }
              break
            case "m":
              e.preventDefault()
              if (enableMinimize) {
                minimizeNonEmphasized()
              }
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

      if (editorRef.current) {
        editorRef.current.addEventListener("keydown", handleKeyDown)
        return () => editorRef.current?.removeEventListener("keydown", handleKeyDown)
      }
    }, [enableFormatting, enableHighlighting, enableMinimize, disabled, value, formattingData])

    // Update editor content when external value changes (not from internal typing)
    useEffect(() => {
      if (value !== internalValue && !isInternalUpdate.current) {
        setInternalValue(value)
        if (editorRef.current) {
          const html = enableFormatting ? generateHtml(value) : value
          editorRef.current.innerHTML = html
        }
        setCharCount(value.length)
      } else {
        setCharCount(internalValue.length)
      }
      isInternalUpdate.current = false
    }, [value, internalValue])

    // Update editor content when formatting changes (preserve cursor)
    useEffect(() => {
      if (editorRef.current && enableFormatting) {
        // Save cursor position before updating content
        const cursorPosition = saveCursorPosition()
        
        const html = generateHtml(internalValue)
        editorRef.current.innerHTML = html
        
        // Restore cursor position after updating content
        if (cursorPosition) {
          // Use setTimeout to ensure DOM has been updated
          setTimeout(() => {
            restoreCursorPosition(cursorPosition)
          }, 0)
        }
      }
    }, [formattingData, enableFormatting])

    // Initial render
    useEffect(() => {
      if (editorRef.current && !editorRef.current.innerHTML) {
        const html = enableFormatting ? generateHtml(value) : value
        editorRef.current.innerHTML = html
      }
    }, [])

    const highlightColors = ["pastel-blue", "pastel-pink", "pastel-green", "pastel-yellow"]
    const characterExceeded = characterLimit && charCount > characterLimit

    return (
      <div className={cn("flex flex-col", className)}>
        <style jsx global>{`
          .highlight-pastel-blue { background-color: rgba(52, 152, 219, 0.3); }
          .highlight-pastel-pink { background-color: rgba(231, 130, 193, 0.3); }
          .highlight-pastel-green { background-color: rgba(46, 204, 113, 0.3); }
          .highlight-pastel-yellow { background-color: rgba(241, 196, 15, 0.3); }
        `}</style>

        {/* Formatting Toolbar */}
        {enableFormatting && !disabled && (
          <div className="flex items-center gap-1 px-2 py-1 border-b border-[#37373d] bg-[#252526]">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-1 hover:bg-[#37373d]"
                    onClick={() => applyFormatting("emphasis")}
                  >
                    <Bold className="h-3 w-3" />
                    <Underline className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#37373d] text-[#cccccc] border-0">
                  Emphasis (Ctrl+E)
                </TooltipContent>
              </Tooltip>

              {enableHighlighting && (
                <>
                  {highlightColors.map((color) => (
                    <Tooltip key={color}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-1 hover:bg-[#37373d]"
                          onClick={() => applyFormatting("highlight", color)}
                        >
                          <div className={`w-3 h-3 rounded-sm highlight-${color} border border-white/20`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#37373d] text-[#cccccc] border-0">
                        Highlight {color.replace("-", " ")} (Ctrl+H)
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </>
              )}

              {enableMinimize && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-1 hover:bg-[#37373d]"
                      onClick={minimizeNonEmphasized}
                    >
                      <Minimize2 className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#37373d] text-[#cccccc] border-0">
                    Minimize (Ctrl+M)
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-1 hover:bg-[#37373d]"
                    onClick={clearFormatting}
                  >
                    <Eraser className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#37373d] text-[#cccccc] border-0">
                  Clear Formatting (Ctrl+Shift+C)
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex-1" />

            {enableAutoSave && (
              <span className={cn("text-xs mr-2", {
                "text-[#a1a1a1]": saveStatus === "saved",
                "text-[#569cd6]": saveStatus === "saving",
                "text-[#d16969]": saveStatus === "error"
              })}>
                {saveStatus === "saved" && "Saved"}
                {saveStatus === "saving" && "Saving..."}
                {saveStatus === "error" && "Error saving"}
              </span>
            )}

            {showCharacterCount && (
              <span className={cn("text-xs", {
                "text-[#a1a1a1]": !characterExceeded,
                "text-[#d16969]": characterExceeded
              })}>
                {charCount}{characterLimit && `/${characterLimit}`}
              </span>
            )}
          </div>
        )}

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable={!disabled}
          onInput={handleInput}
          className={cn(
            "flex-1 w-full px-3 py-2 text-sm bg-transparent border border-[#37373d] rounded-md",
            "focus:outline-none focus:ring-2 focus:ring-[#0e639c] focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "placeholder:text-[#6a9955]",
            minHeight,
            maxHeight && `max-h-[${maxHeight}] overflow-y-auto`,
            className
          )}
          style={{ 
            whiteSpace: "pre-wrap", 
            wordBreak: "break-word",
            color: "#cccccc",
            backgroundColor: "#1e1e1e"
          }}
          data-placeholder={value.length === 0 ? placeholder : undefined}
          aria-label={placeholder}
          role="textbox"
          aria-multiline="true"
        />

        {/* Character limit warning */}
        {characterExceeded && (
          <div className="text-xs text-[#d16969] mt-1 px-1">
            Character limit exceeded by {charCount - characterLimit!} characters
          </div>
        )}

        {/* Slash Command Dropdown */}
        {enableSlashCommands && slashCommand.showDropdown && (
          <InsertionDropdown
            items={slashCommand.items}
            selectedIndex={slashCommand.selectedIndex}
            searchTerm={slashCommand.searchTerm}
            loading={slashCommand.loading}
            position={slashCommand.position}
            onItemSelect={slashCommand.handleItemSelect}
          />
        )}
      </div>
    )
  }
)

RichTextEditor.displayName = "RichTextEditor"