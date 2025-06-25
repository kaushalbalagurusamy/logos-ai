/**
 * Insertion Dropdown Component
 * Displays search results for evidence cards and analytics with keyboard navigation
 */

"use client"

import { useMemo } from "react"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { FileText, PencilLine, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SlashCommandItem, SlashCommandPosition } from "@/hooks/use-slash-command"

interface InsertionDropdownProps {
  items: SlashCommandItem[]
  selectedIndex: number
  searchTerm: string
  loading: boolean
  position: SlashCommandPosition
  onItemSelect: (item: SlashCommandItem) => void
  className?: string
}

export function InsertionDropdown({
  items,
  selectedIndex,
  searchTerm,
  loading,
  position,
  onItemSelect,
  className
}: InsertionDropdownProps) {
  // Group items by type
  const groupedItems = useMemo(() => {
    const evidenceCards = items.filter(item => item.type === 'evidence-card')
    const analytics = items.filter(item => item.type === 'analytics')
    
    return { evidenceCards, analytics }
  }, [items])

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "No Date"
    return new Date(date).toLocaleDateString()
  }

  const renderItem = (item: SlashCommandItem, index: number) => {
    const isSelected = index === selectedIndex
    const icon = item.type === 'evidence-card' ? FileText : PencilLine
    const iconColor = item.type === 'evidence-card' ? "text-[#569cd6]" : "text-[#4ec9b0]"

    return (
      <CommandItem
        key={item.id}
        value={item.id}
        onSelect={() => onItemSelect(item)}
        className={cn(
          "p-3 cursor-pointer border-b border-[#37373d] last:border-b-0",
          "data-[selected=true]:bg-[#37373d]",
          isSelected && "bg-[#37373d]"
        )}
      >
        <div className="flex items-start gap-3 w-full">
          {/* Icon */}
          <div className={cn("mt-0.5 flex-shrink-0", iconColor)}>
            {icon === FileText ? (
              <FileText className="h-4 w-4" />
            ) : (
              <PencilLine className="h-4 w-4" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title and Type Badge */}
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-[#cccccc] text-sm truncate">
                {item.title}
              </span>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs px-1.5 py-0.5 border-0",
                  item.type === 'evidence-card' 
                    ? "bg-[#094771] text-[#569cd6]" 
                    : "bg-[#0d4f3a] text-[#4ec9b0]"
                )}
              >
                {item.type === 'evidence-card' ? 'Card' : 'Analytics'}
              </Badge>
            </div>

            {/* Summary/Shorthand */}
            {item.summary && (
              <div className="text-[#a1a1a1] text-xs mb-1 truncate">
                {item.summary}
              </div>
            )}

            {/* Content Preview */}
            <div className="text-[#858585] text-xs truncate">
              {item.content.substring(0, 100)}
              {item.content.length > 100 && "..."}
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-3 mt-2 text-xs text-[#6a6a6a]">
              {/* Only show author/date for evidence cards, not analytics */}
              {item.type === 'evidence-card' && item.author && (
                <span>by {item.author}</span>
              )}
              {item.type === 'evidence-card' && item.createdAt && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(item.createdAt)}
                </div>
              )}
              {item.tags && item.tags.length > 0 && (
                <div className="flex gap-1">
                  {item.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                    <span 
                      key={tagIndex}
                      className="bg-[#37373d] px-1.5 py-0.5 rounded text-[10px]"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 2 && (
                    <span className="text-[10px]">+{item.tags.length - 2}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CommandItem>
    )
  }

  return (
    <div
      className={cn(
        "absolute bg-[#252526] border border-[#37373d] rounded-md shadow-lg z-50",
        "max-h-80 overflow-hidden min-w-96 max-w-2xl",
        className
      )}
      style={{ 
        top: position.top, 
        left: position.left 
      }}
    >
      <Command className="bg-transparent">
        <CommandList className="max-h-80">
          {loading ? (
            <div className="p-3 text-[#a1a1a1] text-sm text-center">
              Searching...
            </div>
          ) : items.length === 0 ? (
            <CommandEmpty className="p-3 text-[#a1a1a1] text-sm text-center">
              {searchTerm 
                ? `No cards or analytics found matching "${searchTerm}"`
                : "No cards or analytics found"
              }
            </CommandEmpty>
          ) : (
            <>
              {/* Evidence Cards Group */}
              {groupedItems.evidenceCards.length > 0 && (
                <CommandGroup 
                  heading="Evidence Cards" 
                  className="text-xs text-[#569cd6] font-medium px-3 py-2 bg-[#1e1e1e]"
                >
                  {groupedItems.evidenceCards.map((item, index) => 
                    renderItem(item, index)
                  )}
                </CommandGroup>
              )}

              {/* Analytics Group */}
              {groupedItems.analytics.length > 0 && (
                <CommandGroup 
                  heading="Analytics" 
                  className="text-xs text-[#4ec9b0] font-medium px-3 py-2 bg-[#1e1e1e]"
                >
                  {groupedItems.analytics.map((item, index) => 
                    renderItem(item, groupedItems.evidenceCards.length + index)
                  )}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </Command>

      {/* Footer with instructions */}
      <div className="border-t border-[#37373d] p-2 bg-[#1e1e1e]">
        <div className="flex items-center justify-between text-xs text-[#6a6a6a]">
          <span>↑↓ to navigate</span>
          <span>Enter to insert • Esc to cancel</span>
        </div>
      </div>
    </div>
  )
}