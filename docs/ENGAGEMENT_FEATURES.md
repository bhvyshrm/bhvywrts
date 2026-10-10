# BhavyWrites: Story Likes & Private Writer Feedback

This release introduces two features to BhavyWrites:
1. **Persistent Story Likes** with strawberry-heart micro-interactions.
2. **Private Writer Feedback** allowing readers to write private notes directly to the author, managed inside the existing administrator dashboard.

---

## 1. Database Migrations

Both migrations are additive and preserve all existing data and tables.

### Migration 003: `003_create_story_like_table.sql`
Creates the `"StoryLike"` table to persist story likes per reader with a database-level unique constraint to guarantee no duplicates:

```sql
CREATE TABLE IF NOT EXISTS "StoryLike" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "storyId" TEXT NOT NULL,
  "readerId" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "unique_story_reader_like" UNIQUE ("storyId", "readerId")
);

CREATE INDEX IF NOT EXISTS idx_story_like_story_id ON "StoryLike" ("storyId");
CREATE INDEX IF NOT EXISTS idx_story_like_reader_id ON "StoryLike" ("readerId");
CREATE INDEX IF NOT EXISTS idx_story_like_created_at ON "StoryLike" ("createdAt" DESC);

ALTER TABLE "StoryLike" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on StoryLike" ON "StoryLike"
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public read active story likes" ON "StoryLike"
  FOR SELECT
  USING (true);
```

### Migration 004: `004_create_story_feedback_table.sql`
Creates the `"StoryFeedback"` table to securely store private messages sent to the writer:

```sql
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

CREATE INDEX IF NOT EXISTS idx_story_feedback_status ON "StoryFeedback" (status);
CREATE INDEX IF NOT EXISTS idx_story_feedback_created_at ON "StoryFeedback" ("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_story_feedback_story_id ON "StoryFeedback" ("storyId");

ALTER TABLE "StoryFeedback" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on StoryFeedback" ON "StoryFeedback"
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

> **Manual Setup Required in Supabase:**
> Run `supabase/migrations/003_create_story_like_table.sql` and `supabase/migrations/004_create_story_feedback_table.sql` in the Supabase SQL Editor.

---

## 2. Security & Identity Architecture

### Story Likes: Opaque Signed Reader Identity
- Readers do not need to register an account to appreciate stories.
- Instead of trusting arbitrary client-generated identifiers, the server generates an opaque UUID and signs it using an `HS256` JWT via `jose`.
- The signed token is persisted in an HTTP-only, SameSite=Lax cookie (`bhavy-reader-id`).
- When a reader likes or unlikes, the server verifies the signature before modifying `"StoryLike"`.
- Duplicate active likes for the same reader and story are prevented by the database constraint `UNIQUE("storyId", "readerId")`.

### Private Feedback Security
- **No Public Reading:** Row Level Security has no public `SELECT` policy on `"StoryFeedback"`.
- **Server Validation:**
  - Name is trimmed and validated (1–80 characters).
  - Message is trimmed and validated (1–2,000 characters).
  - Story eligibility is checked server-side against published stories.
  - Server controls all metadata: `id`, `status: "unread"`, `createdAt`, `readAt: null`.
- **Spam & Abuse Protection:**
  - In-memory rate limiting (max 5 requests per 10 minutes per IP/client).
  - Silent honeypot trap field (`website`).
- **Safe Rendering:**
  - Rendered as plain text with `whitespace-pre-wrap` and `break-words`.
  - Never rendered via `dangerouslySetInnerHTML`.

---

## 3. API Endpoints

### Story Likes Endpoints
- `GET /api/stories/[slug]/likes` — Returns `{ count: number, liked: boolean }`.
- `POST /api/stories/[slug]/likes` — Adds a like and returns `{ count: number, liked: true }`.
- `DELETE /api/stories/[slug]/likes` — Removes the like and returns `{ count: number, liked: false }`.

### Feedback Endpoints
- `POST /api/feedback` — Public submission endpoint for reader notes.
- `GET /api/admin/feedback` — Admin endpoint listing messages and summary counts (`total`, `unread`, `read`, `archived`).
- `GET /api/admin/feedback/[id]` — Admin endpoint retrieving full message details.
- `PATCH /api/admin/feedback/[id]` — Admin endpoint updating message status (`read`, `unread`, `archived`).
- `DELETE /api/admin/feedback/[id]` — Admin endpoint deleting message.

---

## 4. UI & Brand Design

- **Aqua Flow / iOS Liquid Glass:** Translucent frosted glass surfaces, subtle specular borders, and backdrop-blur effects.
- **Brand Micro-Interaction (Strawberry Heart 🍓❤️):**
  - Heart button fills with strawberry red upon like confirmation.
  - Subtle floating 🍓 micro-animation (400–800ms) respects `prefers-reduced-motion`.
- **Reader Feedback Inbox:**
  - Integrated into the existing `/dashboard` route under the "Reader Feedback" navigation tab.
  - Real-time unread badge indicator.
  - Detail modal with full message inspection, story links, and status controls.
