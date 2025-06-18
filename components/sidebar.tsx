"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileText, BookOpen, BarChart3, Mic, Search, ChevronLeft, ChevronRight, Plus, Tag } from "lucide-react"

interface SidebarProps {
  activeCategory: "evidence" | "cases" | "analytics" | "speeches"
  onCategoryChange: (category: "evidence" | "cases" | "analytics" | "speeches") => void
  onEntrySelect: (entryId: string) => void
}

interface PrepBankEntry {
  id: string
  title: string
  summary: string
  entry_type: string
  tags: string[]
  created_at: string
}

export function Sidebar({ activeCategory, onCategoryChange, onEntrySelect }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [entries, setEntries] = useState<PrepBankEntry[]>([])

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockEntries: PrepBankEntry[] = [
      {
        id: "1",
        title: "Climate Change Economic Impact Study",
        summary: "Comprehensive analysis of economic costs of climate change",
        entry_type: "Evidence",
        tags: ["Climate Change", "Economics"],
        created_at: "2024-01-15",
      },
      {
        id: "2",
        title: "Debate Strategy: Climate Arguments",
        summary: "Analysis of effective climate change argumentation strategies",
        entry_type: "Analytics",
        tags: ["Climate Change"],
        created_at: "2024-01-14",
      },
      {
        id: "3",
        title: "Carbon Pricing Definition",
        summary: "Comprehensive definition of carbon pricing mechanisms",
        entry_type: "Definition",
        tags: ["Climate Change", "Economics"],
        created_at: "2024-01-13",
      },
    ]
    setEntries(mockEntries)
  }, [])

  const categories = [
    { key: "evidence" as const, label: "Evidence", icon: FileText, shortcut: "E" },
    { key: "cases" as const, label: "Cases", icon: BookOpen, shortcut: "C" },
    { key: "analytics" as const, label: "Analytics", icon: BarChart3, shortcut: "A" },
    { key: "speeches" as const, label: "Speeches", icon: Mic, shortcut: "S" },
  ]

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.summary.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      activeCategory === "evidence"
        ? entry.entry_type === "Evidence"
        : activeCategory === "analytics"
          ? entry.entry_type === "Analytics"
          : activeCategory === "cases"
            ? entry.entry_type === "Case"
            : entry.entry_type === "Speech"
    return matchesSearch && (activeCategory === "evidence" || matchesCategory)
  })

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "e":
            e.preventDefault()
            onCategoryChange("evidence")
            break
          case "c":
            e.preventDefault()
            onCategoryChange("cases")
            break
          case "a":
            e.preventDefault()
            onCategoryChange("analytics")
            break
          case "s":
            e.preventDefault()
            onCategoryChange("speeches")
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [onCategoryChange])

  return (
    <div className={`h-full border-r bg-muted/10 transition-all duration-300 ${isCollapsed ? "w-16" : "w-full"}`}>
      <div className="p-2 border-b flex items-center justify-between">
        {!isCollapsed && <h2 className="font-semibold text-sm">Prep Bank</h2>}
        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {!isCollapsed && (
        <>
          {/* Search */}
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="px-2 pb-2">
            <div className="grid grid-cols-2 gap-1">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <Button
                    key={category.key}
                    variant={activeCategory === category.key ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onCategoryChange(category.key)}
                    className="justify-start gap-2 text-xs"
                    title={`${category.label} (Ctrl+${category.shortcut})`}
                  >
                    <Icon className="h-3 w-3" />
                    {category.label}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Add New Button */}
          <div className="px-2 pb-2">
            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
              <Plus className="h-4 w-4" />
              Add New {categories.find((c) => c.key === activeCategory)?.label}
            </Button>
          </div>

          {/* Entries List */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => onEntrySelect(entry.id)}
                >
                  <h3 className="font-medium text-sm line-clamp-2 mb-1">{entry.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{entry.summary}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {entry.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag className="h-2 w-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </>
      )}

      {isCollapsed && (
        <div className="p-2 space-y-2">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.key}
                variant={activeCategory === category.key ? "default" : "ghost"}
                size="sm"
                onClick={() => onCategoryChange(category.key)}
                className="w-full p-2"
                title={`${category.label} (Ctrl+${category.shortcut})`}
              >
                <Icon className="h-4 w-4" />
              </Button>
            )
          })}
        </div>
      )}
    </div>
  )
}
