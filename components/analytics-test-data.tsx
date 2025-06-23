import type { Analytics, AnalyticsFolder, AnalyticsLink } from "@/lib/types"

export const sampleAnalytics: Analytics = {
  id: "analytics-1",
  title: "Debate Strategy: Climate Economic Arguments",
  content:
    "When constructing economic impact arguments for climate change, debaters should focus on three key pillars: immediate costs, long-term projections, and comparative analysis with action costs. The most effective approach combines concrete economic data with narrative framing that emphasizes urgency and consequence.\n\nFirst, establish baseline economic costs using peer-reviewed studies. Focus on GDP impact percentages rather than absolute dollar figures, as these translate better across different economic contexts...",
  summary: "Strategic framework for constructing compelling economic arguments in climate change debates",
  authorId: "user-123",
  folderId: "folder-climate-strategy",
  linkedSourceId: "source-1",
  linkedCardId: "card-1",
  linkType: "extension",
  formattingPreferences: {
    font: "Times New Roman",
    size: 12,
    bold: true,
    italic: false,
  },
  tags: ["climate", "economics", "strategy", "argumentation"],
  version: 1,
  userId: "user-123",
  createdAt: new Date("2024-01-15T10:30:00Z"),
  updatedAt: new Date("2024-01-15T14:22:00Z"),
}

export const sampleAnalytics2: Analytics = {
  id: "analytics-2",
  title: "Counter-Argument Framework: Economic Adaptation",
  content:
    "Effective counter-arguments to climate economic impacts should focus on adaptation economics and technological innovation potential. Key strategies include: questioning baseline assumptions, highlighting adaptation benefits, and emphasizing innovation-driven solutions.\n\nThe most compelling responses acknowledge economic risks while pivoting to solution-oriented frameworks that demonstrate economic opportunity within climate action.",
  summary: "Framework for developing counter-arguments to climate economic impact claims",
  authorId: "user-123",
  folderId: "folder-climate-strategy",
  linkedSourceId: null,
  linkedCardId: null,
  linkType: null,
  formattingPreferences: {
    font: "Times New Roman",
    size: 12,
    bold: true,
    italic: false,
  },
  tags: ["climate", "counter-arguments", "adaptation", "economics"],
  version: 1,
  userId: "user-123",
  createdAt: new Date("2024-01-16T09:15:00Z"),
  updatedAt: new Date("2024-01-16T09:15:00Z"),
}

export const sampleFolder: AnalyticsFolder = {
  id: "folder-climate-strategy",
  name: "Climate Strategy",
  parentId: "folder-debate-strategy",
  userId: "user-123",
  createdAt: new Date("2024-01-10T09:00:00Z"),
  updatedAt: new Date("2024-01-15T10:30:00Z"),
  analytics: [sampleAnalytics, sampleAnalytics2],
}

export const sampleRootFolder: AnalyticsFolder = {
  id: "folder-debate-strategy",
  name: "Debate Strategy",
  parentId: undefined,
  userId: "user-123",
  createdAt: new Date("2024-01-01T08:00:00Z"),
  updatedAt: new Date("2024-01-15T10:30:00Z"),
  analytics: [],
}

export const sampleLink: AnalyticsLink = {
  id: "link-1",
  analyticsId: "analytics-1",
  targetType: "source",
  targetId: "source-1",
  linkType: "extension",
  description: "Extends economic analysis from Smith's climate study",
  createdAt: new Date("2024-01-15T14:22:00Z"),
}

export const analyticsTestData = {
  analytics: [sampleAnalytics, sampleAnalytics2],
  folders: [sampleRootFolder, sampleFolder],
  links: [sampleLink],
}
