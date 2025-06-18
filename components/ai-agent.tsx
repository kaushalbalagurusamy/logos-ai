"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Mic, MicOff, FileUp, Sparkles, Search, BookOpen, BarChart3, Lightbulb } from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  suggestions?: string[]
}

export function AIAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
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
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `I understand you're asking about "${inputValue}". Let me help you with that. Based on your prep bank, I can suggest relevant evidence cards and provide strategic analysis.`,
        timestamp: new Date(),
        suggestions: [
          "Show related evidence",
          "Generate counter-arguments",
          "Create flow notes",
          "Research more sources",
        ],
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  const toggleListening = () => {
    setIsListening(!isListening)
    // In real app, this would start/stop speech recognition
  }

  const quickActions = [
    { icon: Search, label: "Deep Research", color: "bg-blue-500" },
    { icon: BookOpen, label: "Case Builder", color: "bg-green-500" },
    { icon: BarChart3, label: "Flow Analysis", color: "bg-purple-500" },
    { icon: Lightbulb, label: "Strategy Tips", color: "bg-orange-500" },
  ]

  return (
    <div className="h-full flex flex-col bg-muted/5">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">AI Assistant</h2>
        </div>
        <p className="text-xs text-muted-foreground">Real-time debate support and research</p>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b">
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Button key={action.label} variant="outline" size="sm" className="justify-start gap-2 text-xs h-8">
                <div className={`w-2 h-2 rounded-full ${action.color}`} />
                {action.label}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</div>

                {message.suggestions && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs font-medium opacity-80">Suggestions:</p>
                    <div className="flex flex-wrap gap-1">
                      {message.suggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs cursor-pointer hover:bg-secondary/80"
                          onClick={() => handleSuggestionClick(suggestion)}
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
      <div className="border-t p-4 space-y-3">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleListening}
            className={isListening ? "bg-red-500 text-white" : ""}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm">
            <FileUp className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything about your debate prep..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">AI can make mistakes. Verify important information.</p>
      </div>
    </div>
  )
}
