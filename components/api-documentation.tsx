"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const apiRoutes = [
  {
    category: "Authentication",
    routes: [
      { method: "POST", path: "/api/auth/login", description: "User login" },
      { method: "POST", path: "/api/auth/logout", description: "User logout" },
      { method: "POST", path: "/api/auth/refresh-token", description: "Refresh JWT token" },
    ],
  },
  {
    category: "Users",
    routes: [
      { method: "GET", path: "/api/users", description: "List all users" },
      { method: "POST", path: "/api/users", description: "Create new user" },
      { method: "GET", path: "/api/users/{userId}", description: "Get user profile" },
      { method: "PUT", path: "/api/users/{userId}", description: "Update user" },
      { method: "DELETE", path: "/api/users/{userId}", description: "Delete user" },
    ],
  },
  {
    category: "PrepBank Entries",
    routes: [
      { method: "GET", path: "/api/prep-bank/entries", description: "List entries with filtering" },
      { method: "POST", path: "/api/prep-bank/entries", description: "Create new entry" },
      { method: "GET", path: "/api/prep-bank/entries/{entryId}", description: "Get single entry" },
      { method: "PUT", path: "/api/prep-bank/entries/{entryId}", description: "Update entry" },
      { method: "DELETE", path: "/api/prep-bank/entries/{entryId}", description: "Delete entry" },
    ],
  },
  {
    category: "Search & AI",
    routes: [
      { method: "GET", path: "/api/search", description: "Full-text search across entries" },
      { method: "POST", path: "/api/ai/ask", description: "AI argument analysis" },
      { method: "POST", path: "/api/ai/summarize", description: "AI text summarization" },
      { method: "POST", path: "/api/ai/citation-format", description: "Format citations" },
    ],
  },
]

export function APIDocumentation() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Logos AI API Documentation</h1>
        <p className="text-muted-foreground">Complete API reference for the Logos AI debate platform</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Overview</CardTitle>
              <CardDescription>
                The Logos AI API provides comprehensive endpoints for debate preparation, evidence management, and
                AI-powered analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Base URL</h3>
                <code className="bg-muted px-2 py-1 rounded">https://your-domain.com/api</code>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Response Format</h3>
                <pre className="bg-muted p-3 rounded text-sm">
                  {`{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Error Format</h3>
                <pre className="bg-muted p-3 rounded text-sm">
                  {`{
  "success": false,
  "error": "Error description"
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-4">
          {apiRoutes.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.routes.map((route, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            route.method === "GET"
                              ? "default"
                              : route.method === "POST"
                                ? "destructive"
                                : route.method === "PUT"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {route.method}
                        </Badge>
                        <code className="text-sm">{route.path}</code>
                      </div>
                      <span className="text-sm text-muted-foreground">{route.description}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Example Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Create Evidence Card</h3>
                <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                  {`POST /api/prep-bank/entries
Content-Type: application/json

{
  "title": "Climate Change Economic Impact",
  "summary": "Study on economic costs",
  "entry_type": "Evidence",
  "author_id": "user-123",
  "quote_text": "Climate change will cost...",
  "source_url": "https://example.com/study",
  "mla_citation": "Smith, John. 'Climate Study'..."
}`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Search Entries</h3>
                <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                  {`GET /api/search?query=climate%20change&tags=Economics&limit=10

Response:
{
  "success": true,
  "data": [
    {
      "id": "entry-123",
      "title": "Climate Change Economic Impact",
      "rank": 0.95,
      "tags": [{"label": "Economics", "color": "#3B82F6"}]
    }
  ]
}`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">AI Analysis</h3>
                <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                  {`POST /api/ai/ask
Content-Type: application/json

{
  "text": "The economy will collapse due to climate change",
  "context": "Affirmative case construction"
}

Response:
{
  "success": true,
  "data": {
    "summary": "Analysis of economic argument",
    "key_points": ["Main argument identified"],
    "suggestions": ["Add quantified impacts"],
    "confidence": 0.85
  }
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
