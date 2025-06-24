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
        shorthand: "Econ Impact",
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
        shorthand: "Jobs",
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
        shorthand: "Solar Efficiency",
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