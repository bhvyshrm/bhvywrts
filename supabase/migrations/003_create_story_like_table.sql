-- Migration 003: Add persistent story likes table
-- Additive migration for BhavyWrites: safe for existing stories and schema.

CREATE TABLE IF NOT EXISTS "StoryLike" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "storyId" TEXT NOT NULL,
  "readerId" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "unique_story_reader_like" UNIQUE ("storyId", "readerId")
);

-- Indexes for efficient count queries and reader lookup
CREATE INDEX IF NOT EXISTS idx_story_like_story_id ON "StoryLike" ("storyId");
CREATE INDEX IF NOT EXISTS idx_story_like_reader_id ON "StoryLike" ("readerId");
CREATE INDEX IF NOT EXISTS idx_story_like_created_at ON "StoryLike" ("createdAt" DESC);

-- Enable Row Level Security
ALTER TABLE "StoryLike" ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (API routes use service role admin client)
CREATE POLICY "Service role full access on StoryLike" ON "StoryLike"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Allow public read access for like records
CREATE POLICY "Public read active story likes" ON "StoryLike"
  FOR SELECT
  USING (true);

COMMENT ON TABLE "StoryLike" IS 'Persistent likes for individual stories by anonymous or authenticated readers';
COMMENT ON COLUMN "StoryLike"."storyId" IS 'References the Story id';
COMMENT ON COLUMN "StoryLike"."readerId" IS 'Opaque signed visitor identifier';
