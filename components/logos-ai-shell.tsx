"use client"

import { useState, useEffect, useCallback } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  FileText,
  BookOpen,
  BarChart3,
  Mic,
  Search,
  Plus,
  Save,
  Play,
  Square,
  Sparkles,
  Send,
  Settings,
  Circle,
  Folder,
  ChevronRight,
  ChevronDown,
} from "lucide-react"

interface LogosAIShellProps {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

// Mock data for development
const mockEntries = {
  evidence: [
    {
      id: "1",
      title: "Climate Change Economic Impact Study",
      summary: "Comprehensive analysis of economic costs of climate change",
      entry_type: "Evidence",
      tags: ["Climate Change", "Economics"],
      created_at: "2024-01-15T10:30:00Z",
      author_name: "Alice Johnson",
      quote_text: "Climate change will cost the global economy $43 trillion by 2100 if current trends continue.",
      source_url: "https://example.com/climate-study",
      mla_citation: 'Smith, John. "Economic Impacts of Climate Change." Nature Climate Change, vol. 15, no. 3, 2023.',
    },
    {
      id: "2",
      title: "Renewable Energy Job Creation",
      summary: "Study on employment opportunities in renewable energy sector",
      entry_type: "Evidence",
      tags: ["Economics", "Energy"],
      created_at: "2024-01-14T09:15:00Z",
      author_name: "Bob Smith",
      quote_text: "The renewable energy sector could create 42 million jobs globally by 2050.",
      source_url: "https://example.com/renewable-jobs",
      mla_citation: 'Johnson, Sarah. "Green Jobs Report 2024." International Energy Agency, 2024.',
    },
  ],
  cases: [
    {
      id: "3",
      title: "Climate Action Affirmative Case",
      summary: "Standard affirmative case structure for climate change resolutions",
      entry_type: "Case",
      tags: ["Climate Change", "Affirmative"],
      created_at: "2024-01-13T14:20:00Z",
      author_name: "Alice Johnson",
    },
  ],
  analytics: [
    {
      id: "4",
      title: "Debate Strategy: Climate Arguments",
      summary: "Analysis of effective climate change argumentation strategies",
      entry_type: "Analytics",
      tags: ["Climate Change", "Strategy"],
      created_at: "2024-01-12T16:45:00Z",
      author_name: "Carol Admin",
      content:
        "When arguing climate change impacts, focus on: 1) Economic costs, 2) Timeframe urgency, 3) Disproportionate effects.",
    },
  ],
  speeches: [
    {
      id: "5",
      title: "Opening Statement Template",
      summary: "Template for strong opening statements in climate debates",
      entry_type: "Speech",
      tags: ["Template", "Opening"],
      created_at: "2024-01-11T11:30:00Z",
      author_name: "Alice Johnson",
    },
  ],
}

export function LogosAIShell({ user }: LogosAIShellProps) {
  const [activeCategory, setActiveCategory] = useState<"evidence" | "cases" | "analytics" | "speeches">("evidence")
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null)
  const [entries, setEntries] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isRoundActive, setIsRoundActive] = useState(false)
  const [currentRound, setCurrentRound] = useState<any>(null)
  const [aiMessages, setAiMessages] = useState<any[]>([
    {
      id: "welcome",
      type: "ai",
      content:
        "Hello! I'm your AI debate assistant. I can help you with research, case construction, argument analysis, and in-round support. What would you like to work on?",
      timestamp: new Date(),
      suggestions: [
        "Research climate change evidence",
        "Analyze opponent arguments",
        "Build affirmative case structure",
        "Find counter-evidence",
      ],
    },
  ])
  const [aiInput, setAiInput] = useState("")
  const [selectedEntryData, setSelectedEntryData] = useState<any>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["evidence", "cases"]))

  // Load entries based on active category using mock data
  const loadEntries = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 100))
      const categoryEntries = mockEntries[activeCategory] || []
      setEntries(categoryEntries)
    } catch (error) {
      console.error("Failed to load entries:", error)
      setEntries([])
    }
  }, [activeCategory])

  useEffect(() => {
    loadEntries()
  }, [loadEntries])

  useEffect(() => {
    if (selectedEntry) {
      const allEntries = [
        ...mockEntries.evidence,
        ...mockEntries.cases,
        ...mockEntries.analytics,
        ...mockEntries.speeches,
      ]
      const entry = allEntries.find((e) => e.id === selectedEntry)
      setSelectedEntryData(entry || null)
    } else {
      setSelectedEntryData(null)
    }
  }, [selectedEntry])

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadEntries()
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 100))
      const allEntries = [
        ...mockEntries.evidence,
        ...mockEntries.cases,
        ...mockEntries.analytics,
        ...mockEntries.speeches,
      ]

      const searchResults = allEntries.filter(
        (entry) =>
          entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (entry.quote_text && entry.quote_text.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (entry.content && entry.content.toLowerCase().includes(searchQuery.toLowerCase())),
      )

      setEntries(searchResults)
    } catch (error) {
      console.error("Search failed:", error)
      setEntries([])
    }
  }

  const startRound = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200))
      const mockRound = {
        id: `round-${Date.now()}`,
        user_id: user.id,
        start_time: new Date().toISOString(),
      }
      setCurrentRound(mockRound)
      setIsRoundActive(true)
    } catch (error) {
      console.error("Failed to start round:", error)
    }
  }

  const endRound = async () => {
    if (!currentRound) return
    try {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setIsRoundActive(false)
      setCurrentRound(null)
    } catch (error) {
      console.error("Failed to end round:", error)
    }
  }

  const sendAIMessage = async () => {
    if (!aiInput.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      content: aiInput,
      timestamp: new Date(),
    }

    setAiMessages((prev) => [...prev, userMessage])
    const currentInput = aiInput
    setAiInput("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      let aiResponse = {
        summary: `I understand you're asking about "${currentInput}". Let me help you with that.`,
        suggestions: [
          "Find supporting evidence",
          "Develop counterarguments",
          "Research expert opinions",
          "Check recent studies",
        ],
      }

      if (currentInput.toLowerCase().includes("climate")) {
        aiResponse = {
          summary:
            "For climate change arguments, focus on quantified economic impacts, scientific consensus, and urgency of action. I can help you find specific evidence and develop strong warrants.",
          suggestions: [
            "Find economic impact studies",
            "Research scientific consensus data",
            "Develop urgency arguments",
            "Prepare for skeptic responses",
          ],
        }
      }

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse.summary,
        suggestions: aiResponse.suggestions,
        timestamp: new Date(),
      }
      setAiMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("AI request failed:", error)
    }
  }

  const toggleFolder = (folder: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folder)) {
      newExpanded.delete(folder)
    } else {
      newExpanded.add(folder)
    }
    setExpandedFolders(newExpanded)
  }

  const categories = [
    { key: "evidence" as const, label: "Evidence", icon: FileText, color: "#569cd6" },
    { key: "cases" as const, label: "Cases", icon: BookOpen, color: "#dcdcaa" },
    { key: "analytics" as const, label: "Analytics", icon: BarChart3, color: "#4ec9b0" },
    { key: "speeches" as const, label: "Speeches", icon: Mic, color: "#c586c0" },
  ]

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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="vscode-input pl-7 h-6 text-xs bg-[#2d2d30] border-[#37373d] text-[#cccccc] placeholder:text-[#a1a1a1]"
                />
              </div>
            </div>

            {/* File Tree */}
            <ScrollArea className="flex-1">
              <div className="p-1">
                {/* Prep Bank Folder */}
                <div className="mb-1">
                  <div
                    className="flex items-center px-1 py-0.5 text-xs cursor-pointer hover:bg-[#2a2d2e] rounded-sm"
                    onClick={() => toggleFolder("prepbank")}
                  >
                    {expandedFolders.has("prepbank") ? (
                      <ChevronDown className="h-3 w-3 mr-1 text-[#cccccc]" />
                    ) : (
                      <ChevronRight className="h-3 w-3 mr-1 text-[#cccccc]" />
                    )}
                    <Folder className="h-3 w-3 mr-1 text-[#dcb67a]" />
                    <span className="text-[#cccccc]">PREP BANK</span>
                  </div>

                  {expandedFolders.has("prepbank") && (
                    <div className="ml-4">
                      {categories.map((category) => {
                        const Icon = category.icon
                        const categoryEntries = mockEntries[category.key] || []
                        return (
                          <div key={category.key} className="mb-1">
                            <div
                              className="flex items-center px-1 py-0.5 text-xs cursor-pointer hover:bg-[#2a2d2e] rounded-sm"
                              onClick={() => {
                                setActiveCategory(category.key)
                                toggleFolder(category.key)
                              }}
                            >
                              {expandedFolders.has(category.key) ? (
                                <ChevronDown className="h-3 w-3 mr-1 text-[#cccccc]" />
                              ) : (
                                <ChevronRight className="h-3 w-3 mr-1 text-[#cccccc]" />
                              )}
                              <Icon className="h-3 w-3 mr-1" style={{ color: category.color }} />
                              <span className="text-[#cccccc]">{category.label}</span>
                              <span className="ml-auto text-[#a1a1a1]">{categoryEntries.length}</span>
                            </div>

                            {expandedFolders.has(category.key) && (
                              <div className="ml-4">
                                {categoryEntries.map((entry) => (
                                  <div
                                    key={entry.id}
                                    className={`flex items-center px-1 py-0.5 text-xs cursor-pointer rounded-sm ${
                                      selectedEntry === entry.id
                                        ? "bg-[#094771] text-[#ffffff]"
                                        : "hover:bg-[#2a2d2e] text-[#cccccc]"
                                    }`}
                                    onClick={() => setSelectedEntry(entry.id)}
                                  >
                                    <Circle className="h-2 w-2 mr-2 fill-current" style={{ color: category.color }} />
                                    <span className="truncate">{entry.title}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Round Status */}
                {isRoundActive && (
                  <div className="mb-1">
                    <div className="flex items-center px-1 py-0.5 text-xs">
                      <Circle className="h-2 w-2 mr-2 fill-current text-green-500" />
                      <span className="text-[#cccccc]">Active Round</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Round Controls */}
            <div className="p-2 border-t border-[#37373d]">
              {isRoundActive ? (
                <Button
                  onClick={endRound}
                  className="w-full h-7 text-xs bg-[#d16969] hover:bg-[#b85450] text-white border-0 rounded-sm"
                >
                  <Square className="h-3 w-3 mr-1" />
                  End Round
                </Button>
              ) : (
                <Button
                  onClick={startRound}
                  className="w-full h-7 text-xs bg-[#007acc] hover:bg-[#005a9e] text-white border-0 rounded-sm"
                >
                  <Play className="h-3 w-3 mr-1" />
                  Start Round
                </Button>
              )}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle className="w-1 bg-[#37373d] hover:bg-[#007acc] transition-colors" />

        {/* Editor Area */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col vscode-editor">
            {selectedEntryData ? (
              <>
                {/* Tab Bar */}
                <div className="flex border-b border-[#37373d] bg-[#252526]">
                  <div className="flex items-center px-3 py-2 bg-[#1e1e1e] border-r border-[#37373d] text-xs text-[#cccccc]">
                    <Circle className="h-2 w-2 mr-2 fill-current text-[#569cd6]" />
                    {selectedEntryData.title}
                  </div>
                </div>

                {/* Editor Content */}
                <Tabs defaultValue="content" className="flex-1 flex flex-col">
                  <TabsList className="bg-[#252526] border-b border-[#37373d] rounded-none h-8 p-0">
                    <TabsTrigger
                      value="content"
                      className="data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-[#cccccc] text-[#a1a1a1] rounded-none border-r border-[#37373d] px-3 h-8 text-xs"
                    >
                      Content
                    </TabsTrigger>
                    <TabsTrigger
                      value="metadata"
                      className="data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-[#cccccc] text-[#a1a1a1] rounded-none border-r border-[#37373d] px-3 h-8 text-xs"
                    >
                      Metadata
                    </TabsTrigger>
                    <TabsTrigger
                      value="analysis"
                      className="data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-[#cccccc] text-[#a1a1a1] rounded-none px-3 h-8 text-xs"
                    >
                      Analysis
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="flex-1 p-4 m-0">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-[#cccccc] mb-1">Title</label>
                        <Input
                          defaultValue={selectedEntryData.title}
                          className="vscode-input bg-[#2d2d30] border-[#37373d] text-[#cccccc] text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#cccccc] mb-1">
                          {selectedEntryData.entry_type === "Evidence" ? "Quote Text" : "Content"}
                        </label>
                        <Textarea
                          defaultValue={selectedEntryData.quote_text || selectedEntryData.content || ""}
                          placeholder="Enter your content here..."
                          className="min-h-[300px] resize-none bg-[#2d2d30] border-[#37373d] text-[#cccccc] text-sm font-mono leading-relaxed"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button className="vscode-button">
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          className="border-[#37373d] bg-[#2d2d30] text-[#cccccc] hover:bg-[#37373d] text-xs"
                        >
                          Export
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="metadata" className="flex-1 p-4 m-0">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-[#cccccc] mb-1">Tags</label>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {selectedEntryData.tags?.map((tag: string) => (
                            <Badge key={tag} className="bg-[#37373d] text-[#cccccc] text-xs border-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {selectedEntryData.source_url && (
                        <div>
                          <label className="block text-xs font-medium text-[#cccccc] mb-1">Source URL</label>
                          <Input
                            defaultValue={selectedEntryData.source_url}
                            className="vscode-input bg-[#2d2d30] border-[#37373d] text-[#cccccc] text-sm"
                          />
                        </div>
                      )}
                      {selectedEntryData.mla_citation && (
                        <div>
                          <label className="block text-xs font-medium text-[#cccccc] mb-1">Citation</label>
                          <Textarea
                            defaultValue={selectedEntryData.mla_citation}
                            className="min-h-[100px] bg-[#2d2d30] border-[#37373d] text-[#cccccc] text-sm font-mono"
                          />
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="analysis" className="flex-1 p-4 m-0">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-[#cccccc] mb-1">Warrant Analysis</label>
                        <Textarea
                          placeholder="Explain how this evidence supports your argument..."
                          className="min-h-[150px] bg-[#2d2d30] border-[#37373d] text-[#cccccc] text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#cccccc] mb-1">Strategic Notes</label>
                        <Textarea
                          placeholder="How to use this evidence strategically..."
                          className="min-h-[100px] bg-[#2d2d30] border-[#37373d] text-[#cccccc] text-sm"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
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
                <Sparkles className="h-4 w-4 text-[#007acc]" />
                <span className="text-xs font-medium uppercase tracking-wide text-[#cccccc]">AI Assistant</span>
              </div>
              <div className="flex items-center gap-1">
                <Circle className={`h-2 w-2 fill-current ${isRoundActive ? "text-green-500" : "text-[#a1a1a1]"}`} />
                <span className="text-xs text-[#a1a1a1]">{isRoundActive ? "Live" : "Idle"}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-2 border-b border-[#37373d]">
              <div className="grid grid-cols-2 gap-1">
                {[
                  { icon: Search, label: "Research", action: "Help me research climate change evidence" },
                  { icon: BarChart3, label: "Analyze", action: "Analyze this argument structure" },
                  { icon: BookOpen, label: "Build", action: "Help me build a case structure" },
                  { icon: FileText, label: "Summarize", action: "Summarize this evidence" },
                ].map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    size="sm"
                    onClick={() => setAiInput(item.action)}
                    className="h-6 text-xs justify-start gap-1 hover:bg-[#2a2d2e] text-[#cccccc] p-1"
                  >
                    <item.icon className="h-3 w-3" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {aiMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-sm p-2 text-xs ${
                        message.type === "user"
                          ? "bg-[#007acc] text-white"
                          : "bg-[#2d2d30] text-[#cccccc] border border-[#37373d]"
                      }`}
                    >
                      <p className="leading-relaxed">{message.content}</p>
                      <div className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</div>

                      {message.suggestions && (
                        <div className="mt-2 space-y-1">
                          <p className="text-xs font-medium opacity-80">Suggestions:</p>
                          <div className="flex flex-wrap gap-1">
                            {message.suggestions.map((suggestion: string, index: number) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs cursor-pointer hover:bg-[#37373d] bg-[#37373d] text-[#cccccc] border-0"
                                onClick={() => setAiInput(suggestion)}
                              >
                                {suggestion}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-3 border-t border-[#37373d]">
              <div className="flex gap-2">
                <Input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Ask me anything..."
                  onKeyPress={(e) => e.key === "Enter" && sendAIMessage()}
                  className="flex-1 vscode-input bg-[#2d2d30] border-[#37373d] text-[#cccccc] text-xs"
                />
                <Button onClick={sendAIMessage} className="vscode-button h-7 px-2">
                  <Send className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-[#a1a1a1] mt-1 text-center">
                AI can make mistakes. Verify important information.
              </p>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Status Bar */}
      
    </div>
  )
}
