export const SystemConfig = {
  // Database Configuration
  database: {
    maxConnections: 20,
    connectionTimeout: 30000,
    queryTimeout: 60000,
  },

  // Authentication Configuration
  auth: {
    jwtSecret: process.env.JWT_SECRET || "temporary-dev-secret-please-change-in-production",
    jwtExpiresIn: "24h",
    refreshTokenExpiresIn: "7d",
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },

  // AI Service Configuration
  ai: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    maxTokens: 1000,
    temperature: 0.7,
    rateLimit: {
      requestsPerMinute: 10,
      requestsPerHour: 100,
    },
  },

  // File Upload Configuration
  uploads: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["application/pdf", "application/msword", "text/plain"],
    storageProvider: "vercel-blob", // or "s3", "local"
  },

  // Search Configuration
  search: {
    maxResults: 50,
    highlightFragmentSize: 150,
    enableFuzzySearch: true,
  },

  // Round Management Configuration
  rounds: {
    maxConcurrentRounds: 5,
    autoEndAfterHours: 8,
    maxPrepEntries: 100,
  },

  // Cache Configuration
  cache: {
    defaultTTL: 300, // 5 minutes
    searchResultsTTL: 600, // 10 minutes
    userSessionTTL: 3600, // 1 hour
  },

  // Feature Flags
  features: {
    enableVoiceInput: true,
    enableRealTimeCollaboration: false,
    enableAdvancedAnalytics: true,
    enableGraphVisualization: true,
  },

  // API Configuration
  api: {
    version: "v1",
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
    timeout: 30000,
    retryAttempts: 3,
  },

  // UI Configuration - Updated for dark theme
  ui: {
    defaultTheme: "dark", // Changed from "light" to "dark"
    enableKeyboardShortcuts: true,
    autoSaveInterval: 30000, // 30 seconds
    maxRecentEntries: 10,
    colorScheme: {
      primary: "blue",
      secondary: "purple",
      accent: "cyan",
      background: "slate-950",
      surface: "slate-900",
      text: "slate-100",
    },
  },
} as const

export type SystemConfigType = typeof SystemConfig
