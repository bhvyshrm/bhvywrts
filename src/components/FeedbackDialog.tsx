"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { X, Mail, Send, Loader2, Sparkles, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeedbackDialogProps {
  isOpen: boolean
  onClose: () => void
  storyTitle?: string
  storySlug?: string
}

export function FeedbackDialog({
  isOpen,
  onClose,
  storyTitle,
  storySlug,
}: FeedbackDialogProps) {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [website, setWebsite] = useState("") // Spam honeypot
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const shouldReduceMotion = useReducedMotion()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) {
        onClose()
      }
    },
    [onClose, submitting]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
      return () => {
        document.removeEventListener("keydown", handleKeyDown)
        document.body.style.overflow = ""
      }
    }
  }, [isOpen, handleKeyDown])

  const handleClose = () => {
    if (submitting) return
    onClose()
    // Reset state after exit transition completes
    setTimeout(() => {
      if (submitted) {
        setName("")
        setMessage("")
        setSubmitted(false)
      }
      setError(null)
    }, 300)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedName = name.trim()
    const trimmedMessage = message.trim()

    if (!trimmedName) {
      setError("Please provide your name.")
      return
    }

    if (trimmedName.length > 80) {
      setError("Name must be 80 characters or fewer.")
      return
    }

    if (!trimmedMessage) {
      setError("Please enter your message.")
      return
    }

    if (trimmedMessage.length > 2000) {
      setError("Message must be 2,000 characters or fewer.")
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          message: trimmedMessage,
          storySlug: storySlug || undefined,
          website: website || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Could not send your message. Please try again.")
        setSubmitting(false)
        return
      }

      setSubmitted(true)
      setSubmitting(false)
    } catch {
      // Preserve typed feedback so reader never loses their words
      setError("Network error. Please check your connection and try again.")
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{
              duration: shouldReduceMotion ? 0.1 : 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-dialog-title"
            className="relative z-10 w-full max-w-lg glass-strong rounded-[28px] sm:rounded-[32px] p-5 sm:p-8 border border-white/80 dark:border-white/20 shadow-[0_24px_60px_rgba(10,57,64,0.12)] dark:shadow-2xl overflow-y-auto max-h-[92vh]"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              aria-label="Close dialog"
              className="absolute top-5 right-5 w-9 h-9 rounded-full border border-[var(--glass-border)] bg-[var(--glass-fill)] flex items-center justify-center text-[var(--muted)] hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40"
            >
              <X className="w-4 h-4" />
            </button>

            {submitted ? (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="py-8 text-center space-y-4"
              >
                <div className="relative mx-auto w-16 h-16 rounded-full border border-[#ff3366]/40 bg-[#ff3366]/15 flex items-center justify-center shadow-[0_0_24px_rgba(255,51,102,0.3)]">
                  <span className="text-2xl select-none animate-pulse">🍓</span>
                </div>

                <div className="space-y-2">
                  <h3
                    id="feedback-dialog-title"
                    className="font-[var(--font-instrument-serif)] text-2xl sm:text-3xl text-foreground"
                  >
                    Your note has reached the writer. ❤️
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-2)] font-[var(--font-source-serif)] max-w-sm mx-auto leading-relaxed">
                    Thank you for taking the time to share your thoughts.
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-full text-xs font-medium font-[var(--font-grotesk)] glass-strong hover:bg-white/20 border border-white/25 text-foreground transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    Continue reading
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Feedback Form */
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-[var(--font-grotesk)] font-medium text-[var(--orchid)] bg-[var(--orchid)]/10 border border-[var(--orchid)]/25 mb-3">
                    <Mail className="w-3 h-3" />
                    <span>Private Note</span>
                  </div>

                  <h2
                    id="feedback-dialog-title"
                    className="font-[var(--font-instrument-serif)] text-2xl sm:text-3xl text-foreground leading-tight"
                  >
                    Write to the Author ✉️
                  </h2>
                  <p className="text-xs text-[var(--muted)] font-[var(--font-grotesk)] mt-1 tracking-wide">
                    Your thoughts matter.
                  </p>

                  {/* Contextual Story Information */}
                  {storyTitle && (
                    <div className="mt-4 p-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 text-xs text-[var(--text-2)] font-[var(--font-grotesk)] flex items-center gap-2">
                      <span className="text-[var(--muted)] uppercase tracking-wider text-[10px] shrink-0 font-medium">
                        Story:
                      </span>
                      <span className="text-foreground font-medium truncate font-[var(--font-instrument-serif)] text-base">
                        {storyTitle}
                      </span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot field (hidden from legitimate readers) */}
                  <div className="sr-only opacity-0 absolute -left-[9999px]" aria-hidden="true">
                    <label htmlFor="website-field">Website</label>
                    <input
                      id="website-field"
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>

                  {/* Name Field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="author-feedback-name"
                      className="block text-xs font-medium text-[var(--text-2)] font-[var(--font-grotesk)]"
                    >
                      Your name <span className="text-[#ff3366]">*</span>
                    </label>
                    <input
                      id="author-feedback-name"
                      type="text"
                      required
                      maxLength={80}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="What should I call you?"
                      disabled={submitting}
                      className="w-full px-4 py-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/10 dark:border-white/15 text-sm text-foreground placeholder:text-[var(--muted)] outline-none focus:border-[var(--orchid)]/60 focus:bg-white/60 dark:focus:bg-white/[0.06] transition-all font-[var(--font-grotesk)]"
                    />
                  </div>

                  {/* Message Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="author-feedback-message"
                        className="block text-xs font-medium text-[var(--text-2)] font-[var(--font-grotesk)]"
                      >
                        Your message <span className="text-[#ff3366]">*</span>
                      </label>
                      <span className="text-[10px] text-[var(--muted)] font-[var(--font-grotesk)] tabular-nums">
                        {message.length} / 2,000
                      </span>
                    </div>
                    <textarea
                      id="author-feedback-message"
                      required
                      rows={4}
                      maxLength={2000}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your thoughts about this story..."
                      disabled={submitting}
                      className="w-full px-4 py-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/10 dark:border-white/15 text-sm text-foreground placeholder:text-[var(--muted)] outline-none focus:border-[var(--orchid)]/60 focus:bg-white/60 dark:focus:bg-white/[0.06] transition-all resize-none font-[var(--font-source-serif)] leading-relaxed"
                    />
                  </div>

                  {/* Error Notification */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-[var(--destructive)]/15 border border-[var(--destructive)]/30 text-[var(--destructive)] text-xs text-center font-[var(--font-grotesk)]"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2 space-y-3">
                    <button
                      type="submit"
                      disabled={submitting || !name.trim() || !message.trim()}
                      className="w-full py-3.5 rounded-2xl bg-foreground text-background text-xs sm:text-sm font-medium hover:opacity-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-[var(--font-grotesk)] cursor-pointer shadow-lg active:scale-[0.99]"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending privately...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-[var(--orchid)]" />
                          <span>Send privately</span>
                        </>
                      )}
                    </button>

                    {/* Privacy Assurance Statement */}
                    <p className="text-[11px] text-[var(--muted)] text-center font-[var(--font-grotesk)] leading-relaxed">
                      Your message is sent privately to the writer and is not displayed publicly.
                    </p>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
