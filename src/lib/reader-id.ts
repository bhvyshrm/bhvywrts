import { SignJWT, jwtVerify } from "jose"
import type { NextRequest, NextResponse } from "next/server"

const READER_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "bhavy-reader-salt-secret-key-2026"
)

export const READER_COOKIE_NAME = "bhavy-reader-id"

export interface ReaderSession {
  readerId: string
  newCookieValue?: string
}

/**
 * Retrieves the verified reader ID from a signed HTTP-only cookie,
 * or generates and signs a new opaque identifier on the server.
 * Never trusts an arbitrary client-supplied reader identifier.
 */
export async function getOrCreateReaderId(req: NextRequest): Promise<ReaderSession> {
  const cookieValue = req.cookies.get(READER_COOKIE_NAME)?.value

  if (cookieValue) {
    try {
      const { payload } = await jwtVerify(cookieValue, READER_SECRET)
      if (typeof payload.readerId === "string" && payload.readerId.length > 0) {
        return { readerId: payload.readerId }
      }
    } catch {
      // Signature expired, malformed, or tampered; generate a fresh verified ID
    }
  }

  const readerId = crypto.randomUUID()
  const token = await new SignJWT({ readerId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("365d")
    .sign(READER_SECRET)

  return { readerId, newCookieValue: token }
}

/**
 * Sets the signed reader ID cookie on the outgoing NextResponse.
 */
export function applyReaderCookie(res: NextResponse, token: string) {
  res.cookies.set(READER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 365 * 24 * 60 * 60, // 1 year
  })
}
