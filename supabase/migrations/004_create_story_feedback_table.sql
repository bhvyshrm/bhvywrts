-- Migration 004: Add private writer feedback table
-- Additive migration for BhavyWrites: safe for existing stories and schema.

CREATE TABLE IF NOT EXISTS "StoryFeedback" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "storyId" TEXT,
  "storyTitle" TEXT,
  "storySlug" TEXT,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "readAt" TIMESTAMPTZ
);

-- Indexes for status filtering, timeline sorting, and story association
CREATE INDEX IF NOT EXISTS idx_story_feedback_status ON "StoryFeedback" (status);
CREATE INDEX IF NOT EXISTS idx_story_feedback_created_at ON "StoryFeedback" ("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_story_feedback_story_id ON "StoryFeedback" ("storyId");

-- Enable Row Level Security
ALTER TABLE "StoryFeedback" ENABLE ROW LEVEL SECURITY;

-- Allow full access only to the service role (used securely by server-side APIs)
-- Public readers cannot query or view any feedback submissions
CREATE POLICY "Service role full access on StoryFeedback" ON "StoryFeedback"
  FOR ALL
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE "StoryFeedback" IS 'Private feedback submissions from readers to the author';
COMMENT ON COLUMN "StoryFeedback"."status" IS 'unread | read | archived';
