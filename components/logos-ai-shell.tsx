"use client"

import { useState } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SourceManager } from "@/components/source-manager"
import {
  FileText,
  BookOpen,
  BarChart3,
  Volume2,
  Sheet,
  Search,
  Plus,
  Play,
  Wand2,
  Send,
  Settings,
  Circle,
  Mic,
  Sparkles,
  MessageCircle,
  Bot,
  Network,
  ChevronDown,
  ChevronRight,
  StickyNote,
} from "lucide-react"

import { ipccAR6Data } from "@/components/test-data"

interface Source {
  id: string
  title: string
  author?: string
  date?: Date
  cards: Array<{
    id: string
    shorthand: string
  }>
}

interface LogosAIShellProps {
  user: {
    id: string
    name: string
    email: string
    role: string
    preferences?: {
      defaultCitationStyle: "MLA" | "APA" | "Chicago"
    }
  }
}

export function LogosAIShell({ user }: LogosAIShellProps) {
  const [activeCategory, setActiveCategory] = useState<"evidence" | "cases" | "analytics" | "speeches" | "flow">(
    "evidence",
  )
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [expandedSources, setExpandedSources] = useState<string[]>([])

  const categories = [
    { key: "evidence" as const, label: "Evidence", icon: FileText, color: "#569cd6" },
    { key: "cases" as const, label: "Cases", icon: BookOpen, color: "#dcdcaa" },
    { key: "analytics" as const, label: "Analytics", icon: BarChart3, color: "#4ec9b0" },
    { key: "speeches" as const, label: "Speeches", icon: Volume2, color: "#c586c0" },
    { key: "flow" as const, label: "Flow", icon: Sheet, color: "#ce9178" },
  ]

  const mockSources: Source[] = [
    {
      id: ipccAR6Data.source.id,
      title: ipccAR6Data.source.title,
      author: ipccAR6Data.source.author,
      date: ipccAR6Data.source.date,
      cards: ipccAR6Data.source.cards.map((card) => ({
        id: card.id,
        shorthand: card.shorthand,
      })),
    },
  ]

  const handleToggleSource = (sourceId: string) => {
    setExpandedSources((prev) => (prev.includes(sourceId) ? prev.filter((id) => id !== sourceId) : [...prev, sourceId]))
  }

  const handleSourceClick = (sourceId: string) => {
    setSelectedSourceId(sourceId)
    setSelectedCardId(null) // Clear card selection when selecting source
    // Auto-expand the source when selected
    if (!expandedSources.includes(sourceId)) {
      setExpandedSources((prev) => [...prev, sourceId])
    }
  }

  const handleCardClick = (sourceId: string, cardId: string) => {
    setSelectedSourceId(sourceId)
    setSelectedCardId(cardId)
    // Ensure the source is expanded when selecting a card
    if (!expandedSources.includes(sourceId)) {
      setExpandedSources((prev) => [...prev, sourceId])
    }
  }

  const formatSourceName = (source: Source) => {
    const author = source.author ? source.author.split(" ").pop() : "Unknown"
    const year = source.date ? source.date.getFullYear() : "Unknown"
    const title = source.title.toLowerCase().replace(/\s+/g, "-").substring(0, 20)
    return `[${author} ${year}] ${title}.pdf`
  }

  return (
    <div className="h-screen flex bg-[#1e1e1e] text-[#cccccc] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      {/* Activity Bar (Left) */}
      <div className="w-12 vscode-activity-bar border-r border-[#37373d] flex flex-col items-center py-2">
        <div className="p-2 mb-4">
          <div className="w-6 h-6 bg-gradient-to-br from-[#007acc] to-[#005a9e] rounded-sm flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        </div>

        {categories.map((category) => {
          const Icon = category.icon
          return (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`w-8 h-8 mb-1 flex items-center justify-center rounded-sm transition-colors ${
                activeCategory === category.key ? "bg-[#37373d] border-l-2 border-[#007acc]" : "hover:bg-[#2a2d2e]"
              }`}
              title={category.label}
            >
              <Icon className="h-4 w-4" style={{ color: category.color }} />
            </button>
          )
        })}

        <div className="mt-auto">
          <button className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-[#2a2d2e] transition-colors">
            <Settings className="h-4 w-4 text-[#cccccc]" />
          </button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Sidebar */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full vscode-sidebar border-r border-[#37373d] flex flex-col">
            {/* Sidebar Header */}
            <div className="px-3 py-2 border-b border-[#37373d] flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-[#cccccc]">Explorer</span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-[#2a2d2e] text-[#cccccc]">
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Search */}
            <div className="p-2 border-b border-[#37373d]">
              <div className="relative">
                <Search className="absolute left-2 top-1.5 h-3 w-3 text-[#a1a1a1]" />
                <Input
                  placeholder="Search..."
                  className="vscode-input pl-7 h-6 text-xs bg-[#2d2d30] border-[#37373d] text-[#cccccc] placeholder:text-[#a1a1a1]"
                />
              </div>
            </div>

            {/* File Tree */}
            <ScrollArea className="flex-1">
              <div className="p-1">
                {activeCategory === "evidence" ? (
                  <div className="space-y-1">
                    <div className="px-2 py-1 text-xs text-[#a1a1a1] font-medium">SOURCES</div>
                    <div className="space-y-0.5">
                      {mockSources.map((source) => (
                        <div key={source.id}>
                          {/* Source Item */}
                          <div className="flex items-center">
                            <button
                              onClick={() => handleToggleSource(source.id)}
                              className="p-0.5 hover:bg-[#2a2d2e] rounded-sm"
                            >
                              {expandedSources.includes(source.id) ? (
                                <ChevronDown className="h-3 w-3 text-[#a1a1a1]" />
                              ) : (
                                <ChevronRight className="h-3 w-3 text-[#a1a1a1]" />
                              )}
                            </button>
                            <div
                              className={`flex-1 px-1 py-1 text-xs cursor-pointer rounded-sm flex items-center gap-2 transition-colors ${
                                selectedSourceId === source.id && !selectedCardId
                                  ? "bg-[#37373d] text-[#cccccc]"
                                  : "text-[#cccccc] hover:bg-[#2a2d2e]"
                              }`}
                              onClick={() => handleSourceClick(source.id)}
                            >
                              <FileText className="h-3 w-3 text-[#569cd6] flex-shrink-0" />
                              <span className="truncate">{formatSourceName(source)}</span>
                            </div>
                          </div>

                          {/* Evidence Cards (when expanded) */}
                          {expandedSources.includes(source.id) && (
                            <div className="ml-4 space-y-0.5">
                              {source.cards.map((card) => (
                                <div
                                  key={card.id}
                                  className={`px-2 py-1 text-xs cursor-pointer rounded-sm flex items-center gap-2 transition-colors ${
                                    selectedSourceId === source.id && selectedCardId === card.id
                                      ? "bg-[#37373d] text-[#cccccc]"
                                      : "text-[#cccccc] hover:bg-[#2a2d2e]"
                                  }`}
                                  onClick={() => handleCardClick(source.id, card.id)}
                                >
                                  <StickyNote className="h-3 w-3 text-[#569cd6] opacity-70 flex-shrink-0" />
                                  <span className="truncate">{card.shorthand}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="px-1 py-0.5 text-xs text-[#a1a1a1]">No files yet</div>
                )}
              </div>
            </ScrollArea>

            {/* Round Controls */}
            <div className="p-2 border-t border-[#37373d]">
              <div className="flex gap-1">
                <Button className="flex-1 h-7 text-xs bg-[#007acc] hover:bg-[#005a9e] text-white border-0 rounded-sm">
                  <Play className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  className="h-7 px-2 text-xs border-[#37373d] bg-[#2d2d30] text-[#cccccc] hover:bg-[#37373d]"
                >
                  <Mic className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle className="w-1 bg-[#37373d] hover:bg-[#007acc] transition-colors" />

        {/* Editor Area */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col vscode-editor">
            {activeCategory === "evidence" ? (
              <SourceManager
                user={user}
                selectedSourceId={selectedSourceId}
                selectedCardId={selectedCardId}
                expandedSources={expandedSources}
                onToggleSource={handleToggleSource}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-[#a1a1a1] mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#cccccc] mb-2">No Entry Selected</h3>
                  <p className="text-sm text-[#a1a1a1]">Select an entry from the explorer to start editing</p>
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>

        <ResizableHandle className="w-1 bg-[#37373d] hover:bg-[#007acc] transition-colors" />

        {/* AI Panel */}
        <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
          <div className="h-full flex flex-col bg-[#252526] border-l border-[#37373d]">
            {/* Panel Header */}
            <div className="px-3 py-2 border-b border-[#37373d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-[#007acc]" />
                <span className="text-xs font-medium uppercase tracking-wide text-[#cccccc]">Logos AI</span>
              </div>
              <div className="flex items-center gap-1">
                <Circle className="h-2 w-2 fill-current text-[#a1a1a1]" />
                <span className="text-xs text-[#a1a1a1]">Idle</span>
              </div>
            </div>

            {/* AI Mode Tabs */}
            <Tabs defaultValue="ask" className="flex-1 flex flex-col">
              <TabsList className="bg-[#252526] border-b border-[#37373d] rounded-none h-8 p-0 mx-3 mt-2">
                <TabsTrigger
                  value="ask"
                  className="data-[state=active]:bg-[#37373d] data-[state=active]:text-[#cccccc] text-[#a1a1a1] rounded-none px-3 h-6 text-xs flex items-center gap-1"
                >
                  <MessageCircle className="h-3 w-3" />
                  Ask
                </TabsTrigger>
                <TabsTrigger
                  value="agent"
                  className="data-[state=active]:bg-[#37373d] data-[state=active]:text-[#cccccc] text-[#a1a1a1] rounded-none px-3 h-6 text-xs flex items-center gap-1"
                >
                  <Bot className="h-3 w-3" />
                  Agent
                </TabsTrigger>
                <TabsTrigger
                  value="orchestrator"
                  className="data-[state=active]:bg-[#37373d] data-[state=active]:text-[#cccccc] text-[#a1a1a1] rounded-none px-3 h-6 text-xs flex items-center gap-1"
                >
                  <Network className="h-3 w-3" />
                  Orchestrator
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ask" className="flex-1 flex flex-col m-0">
                {/* Messages */}
                <ScrollArea className="flex-1 p-3">
                  <div className="space-y-3">{/* Empty message area */}</div>
                </ScrollArea>

                {/* Input */}
                <div className="p-3 border-t border-[#37373d]">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask me anything..."
                      className="flex-1 vscode-input bg-[#2d2d30] border-[#37373d] text-[#cccccc] text-xs"
                    />
                    <Button className="vscode-button h-7 px-2">
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-[#a1a1a1] mt-1 text-center">
                    AI can make mistakes. Verify important information.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="agent" className="flex-1 flex flex-col m-0">
                {/* Agent Messages */}
                <ScrollArea className="flex-1 p-3">
                  <div className="space-y-3">{/* Empty agent area */}</div>
                </ScrollArea>

                {/* Agent Input */}
                <div className="p-3 border-t border-[#37373d]">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Give the agent a task..."
                      className="flex-1 vscode-input bg-[#2d2d30] border-[#37373d] text-[#cccccc] text-xs"
                    />
                    <Button className="vscode-button h-7 px-2">
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-[#a1a1a1] mt-1 text-center">Agent will work autonomously on your task.</p>
                </div>
              </TabsContent>

              <TabsContent value="orchestrator" className="flex-1 flex flex-col m-0">
                {/* Orchestrator Messages */}
                <ScrollArea className="flex-1 p-3">
                  <div className="space-y-3">{/* Empty orchestrator area */}</div>
                </ScrollArea>

                {/* Orchestrator Input */}
                <div className="p-3 border-t border-[#37373d]">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Coordinate multiple AI agents..."
                      className="flex-1 vscode-input bg-[#2d2d30] border-[#37373d] text-[#cccccc] text-xs"
                    />
                    <Button className="vscode-button h-7 px-2">
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-[#a1a1a1] mt-center">Orchestrator manages multiple specialized agents.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
