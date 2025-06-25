/**
 * Slash Command Hook
 * Reusable hook for implementing slash command functionality in text editors
 */

import { useState, useEffect, useCallback, useRef } from "react"

export interface SlashCommandItem {
  id: string
  type: 'evidence-card' | 'analytics'
  title: string
  summary?: string
  content: string
  displayText: string
  searchableText: string
  [key: string]: any
}

export interface SlashCommandPosition {
  top: number
  left: number
}

export interface UseSlashCommandOptions {
  onInsert: (item: SlashCommandItem) => void
  enabled?: boolean
  searchDelay?: number
  maxResults?: number
}

export function useSlashCommand({
  onInsert,
  enabled = true,
  searchDelay = 300,
  maxResults = 10
}: UseSlashCommandOptions) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [items, setItems] = useState<SlashCommandItem[]>([])
  const [loading, setLoading] = useState(false)
  const [position, setPosition] = useState<SlashCommandPosition>({ top: 0, left: 0 })
  
  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const currentElementRef = useRef<HTMLElement | null>(null)

  /**
   * Search for items across evidence cards and analytics
   */
  const searchItems = useCallback(async (query: string) => {
    if (!enabled) return

    setLoading(true)
    try {
      // Search both evidence cards and analytics in parallel
      const [evidenceResponse, analyticsResponse] = await Promise.all([
        fetch(`/api/evidence-cards/search?q=${encodeURIComponent(query)}&limit=${maxResults}`),
        fetch(`/api/analytics/search?q=${encodeURIComponent(query)}&limit=${maxResults}`)
      ])

      const evidenceResult = await evidenceResponse.json()
      const analyticsResult = await analyticsResponse.json()

      const evidenceCards = evidenceResult.success ? evidenceResult.data : []
      const analytics = analyticsResult.success ? analyticsResult.data : []

      // Format evidence cards for dropdown
      const formattedEvidence: SlashCommandItem[] = evidenceCards.map((card: any) => ({
        id: card.id,
        type: 'evidence-card' as const,
        title: card.tagLine || 'Untitled Card',
        summary: card.shorthand || '',
        content: card.evidence,
        displayText: card.tagLine || 'Untitled Card',
        searchableText: `${card.tagLine || ''} ${card.shorthand || ''} ${card.evidence}`,
        ...card
      }))

      // Analytics are already formatted by the API
      const formattedAnalytics: SlashCommandItem[] = analytics

      // Combine and sort by relevance (exact matches first)
      const allItems = [...formattedEvidence, ...formattedAnalytics]
      const sortedItems = allItems.sort((a, b) => {
        const aExact = a.searchableText.toLowerCase().includes(query.toLowerCase())
        const bExact = b.searchableText.toLowerCase().includes(query.toLowerCase())
        if (aExact && !bExact) return -1
        if (!aExact && bExact) return 1
        return 0
      })

      setItems(sortedItems.slice(0, maxResults))
      setSelectedIndex(0)
    } catch (error) {
      console.error("Error searching items:", error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [enabled, maxResults])

  /**
   * Debounced search effect
   */
  useEffect(() => {
    if (searchTerm && showDropdown) {
      clearTimeout(searchTimeoutRef.current)
      searchTimeoutRef.current = setTimeout(() => {
        searchItems(searchTerm)
      }, searchDelay)
    } else if (showDropdown) {
      // Load initial items when dropdown opens
      searchItems("")
    }

    return () => {
      clearTimeout(searchTimeoutRef.current)
    }
  }, [searchTerm, showDropdown, searchItems, searchDelay])

  /**
   * Calculate dropdown position based on cursor/caret position
   */
  const calculatePosition = useCallback((element: HTMLElement, cursorPos?: number): SlashCommandPosition => {
    const rect = element.getBoundingClientRect()
    
    if (element.tagName === 'TEXTAREA' && cursorPos !== undefined) {
      // For textarea, calculate position based on line
      const style = window.getComputedStyle(element)
      const lineHeight = parseInt(style.lineHeight) || parseInt(style.fontSize) * 1.2
      const content = (element as HTMLTextAreaElement).value.substring(0, cursorPos)
      const lineNumber = content.split('\n').length - 1
      
      return {
        top: rect.top + (lineNumber * lineHeight) + lineHeight + 5,
        left: rect.left + 10
      }
    } else {
      // For contentEditable, use selection/range position
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const rangeRect = range.getBoundingClientRect()
        
        return {
          top: rangeRect.bottom + 5,
          left: rangeRect.left
        }
      }
      
      // Fallback to element position
      return {
        top: rect.bottom + 5,
        left: rect.left
      }
    }
  }, [])

  /**
   * Handle text change in editor
   */
  const handleTextChange = useCallback((
    value: string, 
    cursorPosition: number, 
    element: HTMLElement
  ) => {
    if (!enabled) return

    currentElementRef.current = element

    // Check for slash command trigger
    if (value[cursorPosition - 1] === '/') {
      const pos = calculatePosition(element, cursorPosition)
      setPosition(pos)
      setShowDropdown(true)
      setSearchTerm("")
      setSelectedIndex(0)
    } else if (showDropdown) {
      // Update search term if dropdown is showing
      const lastSlashIndex = value.lastIndexOf('/', cursorPosition)
      if (lastSlashIndex !== -1 && lastSlashIndex < cursorPosition) {
        const term = value.substring(lastSlashIndex + 1, cursorPosition)
        // Close dropdown if term contains space or newline
        if (term.includes(' ') || term.includes('\n')) {
          setShowDropdown(false)
        } else {
          setSearchTerm(term)
        }
      } else {
        setShowDropdown(false)
      }
    }
  }, [enabled, showDropdown, calculatePosition])

  /**
   * Handle keyboard navigation in dropdown
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showDropdown || !enabled) return

    switch (e.key) {
      case 'Escape':
        setShowDropdown(false)
        setSearchTerm("")
        setSelectedIndex(0)
        break
      case 'Enter':
        if (items.length > 0) {
          e.preventDefault()
          onInsert(items[selectedIndex])
          setShowDropdown(false)
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, items.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
        break
    }
  }, [showDropdown, enabled, items, selectedIndex, onInsert])

  /**
   * Handle item selection from dropdown
   */
  const handleItemSelect = useCallback((item: SlashCommandItem) => {
    onInsert(item)
    setShowDropdown(false)
    setSearchTerm("")
    setSelectedIndex(0)
  }, [onInsert])

  /**
   * Hide dropdown (for external use)
   */
  const hideDropdown = useCallback(() => {
    setShowDropdown(false)
    setSearchTerm("")
    setSelectedIndex(0)
  }, [])

  return {
    showDropdown,
    searchTerm,
    selectedIndex,
    items,
    loading,
    position,
    handleTextChange,
    handleKeyDown,
    handleItemSelect,
    hideDropdown
  }
}