/**
 * API route for searching evidence cards
 * Used by document writer slash command to find and insert cards
 */

import { NextRequest, NextResponse } from "next/server"
import type { APIResponse, EvidenceCard } from "@/lib/types"

/**
 * GET /api/evidence-cards/search - Search evidence cards by tagLine and shorthand
 */
export async function GET(request: NextRequest): Promise<NextResponse<APIResponse<EvidenceCard[]>>> {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    
    // In real app, get user from authentication middleware
    const userId = "user-123" // Mock user ID

    // Mock data - in real app, this would query the database
    const mockCards: EvidenceCard[] = [
      {
        id: "card-1",
        sourceId: "source-1",
        tagLine: "Climate change causes economic damage",
        evidence: "Climate change will cost the global economy $43 trillion by 2100 if current trends continue, with developing nations bearing disproportionate burden.",
        formattingData: {
          emphasis: [{ start: 34, end: 47, style: "bold-underline", font: "Times New Roman", size: 12 }],
          highlights: [{ start: 76, end: 100, color: "pastel-yellow" }],
          minimized: []
        },
        shorthand: "Econ Impact",
        authorQualifications: "Dr. Jane Smith is a professor of Environmental Economics at MIT with 20 years of research experience",
        studyMethodology: "Meta-analysis of 200+ economic studies",
        userId: "user-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        source: {
          id: "source-1",
          title: "Economic Impacts of Climate Change",
          author: "Dr. Jane Smith",
          publication: "Nature Economics",
          date: new Date("2023-06-15"),
          citationStyle: "MLA",
          version: 1,
          userId: "user-123",
          createdAt: new Date(),
          updatedAt: new Date(),
          cards: [],
        }
      },
      {
        id: "card-2", 
        sourceId: "source-1",
        tagLine: "Renewable energy creates jobs",
        evidence: "The renewable energy sector employed 13.7 million people worldwide in 2022, representing a 1 million increase from the previous year.",
        formattingData: {
          emphasis: [{ start: 4, end: 22, style: "bold-underline", font: "Times New Roman", size: 12 }],
          highlights: [{ start: 32, end: 53, color: "pastel-blue" }],
          minimized: [{ start: 85, end: 125, size: 6 }]
        },
        shorthand: "Jobs",
        authorQualifications: "International Energy Agency is the leading global energy authority",
        studyMethodology: "Global survey of renewable energy employment data",
        userId: "user-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        source: {
          id: "source-2",
          title: "Renewable Energy Employment Report",
          author: "International Energy Agency",
          publication: "IEA Reports",
          date: new Date("2023-03-10"),
          citationStyle: "APA",
          version: 1,
          userId: "user-123",
          createdAt: new Date(),
          updatedAt: new Date(),
          cards: [],
        }
      },
      {
        id: "card-3",
        sourceId: "source-3",
        tagLine: "Solar power efficiency improvements",
        evidence: "New perovskite-silicon tandem solar cells achieved 33.7% efficiency in laboratory tests, surpassing traditional silicon cells by 12%.",
        formattingData: {
          emphasis: [{ start: 65, end: 86, style: "bold-underline", font: "Times New Roman", size: 12 }],
          highlights: [{ start: 4, end: 43, color: "pastel-green" }],
          minimized: [{ start: 90, end: 135, size: 6 }]
        },
        shorthand: "Solar Efficiency",
        authorQualifications: "Dr. Michael Chen is a materials scientist at Stanford University",
        studyMethodology: "Laboratory testing with standardized measurement protocols",
        userId: "user-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        source: {
          id: "source-3",
          title: "Advances in Solar Cell Technology",
          author: "Dr. Michael Chen",
          publication: "Science",
          date: new Date("2023-08-22"),
          citationStyle: "MLA",
          version: 1,
          userId: "user-123",
          createdAt: new Date(),
          updatedAt: new Date(),
          cards: [],
        }
      },
    ]

    // Filter cards based on search query
    const filteredCards = query 
      ? mockCards.filter(card => 
          card.tagLine.toLowerCase().includes(query.toLowerCase()) ||
          (card.shorthand && card.shorthand.toLowerCase().includes(query.toLowerCase()))
        )
      : mockCards

    return NextResponse.json({
      success: true,
      data: filteredCards,
    })
  } catch (error) {
    console.error("Error searching evidence cards:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search evidence cards",
      },
      { status: 500 }
    )
  }
}