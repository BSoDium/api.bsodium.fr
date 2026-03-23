// Shared utilities for featured API routes.
// The freeze/FrozenResponse pattern has been replaced by:
// - ISR (revalidate) for API-based sources (GitHub, DeviantArt)
// - Vercel KV for Puppeteer-based sources (Figma, ResearchGate)
// See cache.ts for the KV helpers.
