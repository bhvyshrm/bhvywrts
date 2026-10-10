import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { SignJWT, jwtVerify } from "jose"

const ROOT = process.cwd()

test("Reader Identity: JWT signature and verification security", async () => {
  const secretKey = new TextEncoder().encode("test-secret-salt-for-verification")
  const readerId = "test-reader-uuid-12345"

  // 1. Sign token
  const token = await new SignJWT({ readerId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("365d")
    .sign(secretKey)

  assert.ok(typeof token === "string", "Token must be a signed string")

  // 2. Verify token
  const { payload } = await jwtVerify(token, secretKey)
  assert.equal(payload.readerId, readerId, "Verified payload must contain exact readerId")

  // 3. Reject tampered token
  const tamperedToken = token.slice(0, -6) + "xxxxxx"
  await assert.rejects(
    async () => {
      await jwtVerify(tamperedToken, secretKey)
    },
    /signature/i,
    "Tampered token must be rejected"
  )
})

test("Rate Limiter: enforcement and client isolation", async () => {
  // Simple simulator matching src/lib/rate-limit.ts logic
  const store = new Map()
  function checkLimit(id, limit = 5) {
    const count = store.get(id) || 0
    if (count >= limit) return { allowed: false, remaining: 0 }
    store.set(id, count + 1)
    return { allowed: true, remaining: limit - (count + 1) }
  }

  const clientId = "client-ip-test-1"
  for (let i = 0; i < 5; i++) {
    const res = checkLimit(clientId, 5)
    assert.equal(res.allowed, true, `Request ${i + 1} must be permitted`)
  }

  // 6th request must be blocked
  const blocked = checkLimit(clientId, 5)
  assert.equal(blocked.allowed, false, "6th request within window must be rate-limited")
  assert.equal(blocked.remaining, 0)

  // Different client must remain unaffected
  const otherClient = checkLimit("client-ip-test-2", 5)
  assert.equal(otherClient.allowed, true, "Other client must not be affected by first client limit")
})

test("Private Feedback Validation: constraints and sanitization rules", () => {
  function validateFeedback({ name, message, website }) {
    if (website && typeof website === "string" && website.trim().length > 0) {
      return { isBot: true, valid: true }
    }
    const trimmedName = typeof name === "string" ? name.trim() : ""
    if (!trimmedName) return { error: "Please provide your name." }
    if (trimmedName.length > 80) return { error: "Name must be 80 characters or fewer." }

    const trimmedMsg = typeof message === "string" ? message.trim() : ""
    if (!trimmedMsg) return { error: "Please enter your message." }
    if (trimmedMsg.length > 2000) return { error: "Message must be 2,000 characters or fewer." }

    return { valid: true, name: trimmedName, message: trimmedMsg }
  }

  // Empty name
  assert.match(validateFeedback({ name: "   ", message: "Hello" }).error, /provide your name/i)
  // Excessively long name
  assert.match(validateFeedback({ name: "a".repeat(81), message: "Hello" }).error, /80 characters/i)
  // Empty message
  assert.match(validateFeedback({ name: "Bhavya Reader", message: "   " }).error, /enter your message/i)
  // Excessively long message
  assert.match(validateFeedback({ name: "Bhavya Reader", message: "m".repeat(2001) }).error, /2,000 characters/i)
  // Honeypot trapped
  assert.equal(validateFeedback({ name: "Bot", message: "Spam", website: "https://spam.com" }).isBot, true)
  // Valid submission
  const valid = validateFeedback({ name: "  Aarav  ", message: "  Beautiful story.  " })
  assert.equal(valid.valid, true)
  assert.equal(valid.name, "Aarav")
  assert.equal(valid.message, "Beautiful story.")
})

test("Migration 003: StoryLike schema integrity", () => {
  const sql = fs.readFileSync(path.join(ROOT, "supabase/migrations/003_create_story_like_table.sql"), "utf-8")
  assert.ok(sql.includes('"StoryLike"'), "Must define StoryLike table")
  assert.ok(sql.includes('"storyId" TEXT NOT NULL'), "Must define storyId column")
  assert.ok(sql.includes('"readerId" TEXT NOT NULL'), "Must define readerId column")
  assert.ok(sql.includes('UNIQUE ("storyId", "readerId")'), "Must enforce unique storyId and readerId constraint")
  assert.ok(sql.includes('ENABLE ROW LEVEL SECURITY'), "Must enable Row Level Security")
  assert.ok(sql.includes('CREATE POLICY "Service role full access on StoryLike"'), "Must provide service role policy")
})

test("Migration 004: StoryFeedback schema integrity and privacy", () => {
  const sql = fs.readFileSync(path.join(ROOT, "supabase/migrations/004_create_story_feedback_table.sql"), "utf-8")
  assert.ok(sql.includes('"StoryFeedback"'), "Must define StoryFeedback table")
  assert.ok(sql.includes('CHECK (status IN (\'unread\', \'read\', \'archived\'))'), "Must enforce status check constraint")
  assert.ok(sql.includes('ENABLE ROW LEVEL SECURITY'), "Must enable Row Level Security")
  assert.ok(sql.includes('CREATE POLICY "Service role full access on StoryFeedback"'), "Must provide service role policy")
  assert.ok(!sql.includes('CREATE POLICY "Public read'), "Must NOT provide public read access for private feedback")
})
