"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Search, ExternalLink, LinkIcon, Trash2, Copy, TrendingUp } from "lucide-react" // Added Copy and TrendingUp imports
import type { Analytics } from "@/lib/types"

interface AnalyticsListProps {
  analytics: Analytics[]
  onSelect: (analyticsId: string) => void
  onDelete: (analyticsId: string) => void
  onDuplicate: (analyticsId: string) => void
  searchQuery?: string
}

interface AnalyticsCardProps {
  analytics: Analytics
  onSelect: () => void
  onDelete: () => void
  onDuplicate: () => void
  searchQuery?: string
}

function AnalyticsCard({ analytics, onSelect, onDelete, onDuplicate, searchQuery }: AnalyticsCardProps) {
  const highlightText = (text: string, query?: string) => {
    if (!query) return text

    const regex = new RegExp(`(${query})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-400 text-black px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text
  }

  const hasLinks = analytics.linkedSourceId || analytics.linkedCardId

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card
          onClick={onSelect}
          className="bg-[#2d2d30] border-[#3e3e42] hover:bg-[#37373d] cursor-pointer transition-colors"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-[#cccccc] line-clamp-2 leading-tight">
                {highlightText(analytics.title, searchQuery)}
              </h3>
              {hasLinks && <LinkIcon className="w-4 h-4 text-[#0e639c] flex-shrink-0 ml-2" />}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {analytics.summary && (
              <p className="text-sm text-[#858585] mb-3 line-clamp-3">
                {highlightText(truncateText(analytics.summary, 120), searchQuery)}
              </p>
            )}
            <div className="flex flex-wrap gap-1 mb-3">
              {analytics.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs bg-[#0e639c] text-white">
                  {tag}
                </Badge>
              ))}
              {analytics.tags.length > 4 && (
                <Badge variant="secondary" className="text-xs bg-[#3e3e42] text-[#858585]">
                  +{analytics.tags.length - 4}
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-[#858585]">
              <span>{analytics.updatedAt.toLocaleDateString()}</span>
              <span>{analytics.content.length.toLocaleString()} chars</span>
            </div>
          </CardContent>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent className="bg-[#3c3c3c] border-[#3e3e42]">
        <ContextMenuItem onClick={onSelect} className="text-[#cccccc] hover:bg-[#094771]">
          <ExternalLink className="w-4 h-4 mr-2" />
          Open
        </ContextMenuItem>
        <ContextMenuItem onClick={onDuplicate} className="text-[#cccccc] hover:bg-[#094771]">
          <Copy className="w-4 h-4 mr-2" /> {/* Fixed undeclared variable */}
          Duplicate
        </ContextMenuItem>
        <ContextMenuItem onClick={onDelete} className="text-red-400 hover:bg-red-900/20">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default function AnalyticsList({ analytics, onSelect, onDelete, onDuplicate, searchQuery }: AnalyticsListProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || "")

  // Filter analytics
  const filteredAndSortedAnalytics = analytics.filter((item) => {
    // Search filter
    if (localSearchQuery) {
      const query = localSearchQuery.toLowerCase()
      const matchesTitle = item.title.toLowerCase().includes(query)
      const matchesContent = item.content.toLowerCase().includes(query)
      const matchesSummary = item.summary?.toLowerCase().includes(query)
      const matchesTags = item.tags.some((tag) => tag.toLowerCase().includes(query))

      if (!matchesTitle && !matchesContent && !matchesSummary && !matchesTags) {
        return false
      }
    }
    return true
  })

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      {/* Header */}
      <div className="p-4 border-b border-[#3e3e42]">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#858585]" />
            <Input
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              placeholder="Search analytics..."
              className="pl-10 bg-[#3c3c3c] border-[#3e3e42] text-[#cccccc] placeholder-[#858585]"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            {filteredAndSortedAnalytics.length === 0 ? (
              <div className="text-center py-12 text-[#858585]">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" /> {/* Fixed undeclared variable */}
                <h3 className="text-lg font-medium mb-2">No analytics found</h3>
                <p className="text-sm">
                  {localSearchQuery ? "Try adjusting your search" : "Create your first analytics to get started"}
                </p>
              </div>
            ) : (
              <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
                {filteredAndSortedAnalytics.map((item) => (
                  <AnalyticsCard
                    key={item.id}
                    analytics={item}
                    onSelect={() => onSelect(item.id)}
                    onDelete={() => onDelete(item.id)}
                    onDuplicate={() => onDuplicate(item.id)}
                    searchQuery={localSearchQuery}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
