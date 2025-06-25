/**
 * Analytics Search API Route  
 * Provides search functionality for analytics entries to support document insertion
 */

import { NextRequest, NextResponse } from "next/server"
import type { APIResponse, Analytics } from "@/lib/types"

/**
 * GET /api/analytics/search
 * Search analytics entries for document insertion
 */
export async function GET(request: NextRequest): Promise<NextResponse<APIResponse<any[]>>> {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    
    // In real app, get user from authentication middleware
    const userId = "user-123" // Mock user ID

    // Mock analytics data - in real app, this would query the database
    const mockAnalytics = [
      {
        id: "analytics-1",
        title: "Climate Change Framework Analysis",
        summary: "Comprehensive framework for understanding climate impacts",
        content: "This analytics piece explores the three-pronged approach to climate change analysis: mitigation strategies, adaptation measures, and loss and damage frameworks. The evidence suggests that comprehensive policy must address all three dimensions to be effective.",
        tags: ["climate", "framework", "policy"],
        userId: "user-123"
      },
      {
        id: "analytics-2", 
        title: "Economic Impact Assessment Methodology",
        summary: "Standard methodology for calculating economic damages",
        content: "When assessing economic impacts of policy changes, debaters should utilize the Social Cost of Carbon (SCC) framework, which provides standardized metrics for quantifying environmental costs. This approach ensures consistent and credible impact calculus.",
        tags: ["economics", "methodology", "impact"],
        userId: "user-123"
      },
      {
        id: "analytics-3",
        title: "Renewable Energy Transition Strategy",
        summary: "Analysis of optimal renewable energy deployment",
        content: "The transition to renewable energy requires coordinated policy across three sectors: electricity generation, transportation, and industrial heating. Evidence shows that integrated approaches achieve 40% better outcomes than sector-specific policies.",
        tags: ["renewable", "energy", "transition"],
        userId: "user-123"
      }
    ]

    // Filter analytics based on search query
    const filteredAnalytics = query 
      ? mockAnalytics.filter(analytics => 
          analytics.title.toLowerCase().includes(query.toLowerCase()) ||
          analytics.summary.toLowerCase().includes(query.toLowerCase()) ||
          analytics.content.toLowerCase().includes(query.toLowerCase()) ||
          analytics.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        )
      : mockAnalytics

    // Format for insertion dropdown
    const formattedAnalytics = filteredAnalytics.map(item => ({
      id: item.id,
      type: 'analytics',
      title: item.title,
      summary: item.summary,
      content: item.content,
      tags: item.tags,
      displayText: item.title,
      searchableText: `${item.title} ${item.summary} ${item.content} ${item.tags.join(' ')}`
    }))

    return NextResponse.json({
      success: true,
      data: formattedAnalytics,
    })
  } catch (error) {
    console.error("Error searching analytics:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search analytics",
      },
      { status: 500 }
    )
  }
}