"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"

const DEFAULT_COVER =
  "https://zyuubroahspccwrufzub.supabase.co/storage/v1/object/public/covers/1789790749402-mnvzdwleln8.jpg"

interface CinematicIntroProps {
  coverImage?: string | null
  onComplete?: () => void
}

export function CinematicIntro({ coverImage, onComplete }: CinematicIntroProps) {
  const [shouldRender, setShouldRender] = useState(false)
  // Phases:
  // 0: Scene 1 — The Atmosphere (0.0s - 1.0s)
  // 1: Scene 2 — The Brand Reveal (1.0s - 2.2s)
  // 2: Scene 3 — Cinematic Aqua Flow & Liquid Glass (2.2s - 3.7s)
  // 3: Scene 4 — The Editorial Statement (3.7s - 5.1s)
  // 4: Scene 5 — The Final Brand Composition (5.1s - 6.2s)
  // 5: Scene 6 — The Transition / Homepage Dissolve (6.2s - 7.0s)
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4 | 5>(0)
  const [isMobile, setIsMobile] = useState(false)
  const timerRefs = useRef<NodeJS.Timeout[]>([])

  const clearAllTimers = useCallback(() => {
    timerRefs.current.forEach((t) => clearTimeout(t))
    timerRefs.current = []
  }, [])

  const finishIntro = useCallback(() => {
    clearAllTimers()
    try {
      sessionStorage.setItem("bhavy-intro-seen", "true")
      document.documentElement.classList.remove("intro-active")
    } catch {}
    setPhase(5)
    // Short dissolve before unmounting
    setTimeout(() => {
      setShouldRender(false)
      onComplete?.()
    }, 450)
  }, [clearAllTimers, onComplete])

  useEffect(() => {
    // 1. Check if user already saw intro in current session
    try {
      const alreadySeen = sessionStorage.getItem("bhavy-intro-seen")
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      if (alreadySeen || prefersReduced) {
        document.documentElement.classList.remove("intro-active")
        setShouldRender(false)
        onComplete?.()
        return
      }
    } catch {
      // In case of restricted environment
      setShouldRender(false)
      onComplete?.()
      return
    }

    // 2. Determine screen size
    const mobile = window.innerWidth < 768
    setIsMobile(mobile)
    setShouldRender(true)

    // 3. Exact 7-Second Cinematic Timeline (in ms):
    // Scene 1 (0.0s–1.0s): Atmospheric opening (phase 0)
    // Scene 2 (1.0s–2.2s): Brand reveal (phase 1) -> 1000ms
    // Scene 3 (2.2s–3.7s): Cinematic Aqua Flow & Liquid Glass (phase 2) -> 2200ms
    // Scene 4 (3.7s–5.1s): Editorial statement reveal (phase 3) -> 3700ms
    // Scene 5 (5.1s–6.2s): Final brand composition (phase 4) -> 5100ms
    // Scene 6 (6.2s–7.0s): Smooth transition into homepage (phase 5) -> 6200ms
    // 7000ms: Complete and unmount

    const T_BRAND = 1000
    const T_IMAGE = 2200
    const T_EDITORIAL = 3700
    const T_FINAL = 5100
    const T_DISSOLVE = 6200
    const T_END = 7000

    timerRefs.current.push(
      setTimeout(() => setPhase(1), T_BRAND),
      setTimeout(() => setPhase(2), T_IMAGE),
      setTimeout(() => setPhase(3), T_EDITORIAL),
      setTimeout(() => setPhase(4), T_FINAL),
      setTimeout(() => setPhase(5), T_DISSOLVE),
      setTimeout(() => {
        try {
          sessionStorage.setItem("bhavy-intro-seen", "true")
          document.documentElement.classList.remove("intro-active")
        } catch {}
        setShouldRender(false)
        onComplete?.()
      }, T_END)
    )

    return () => {
      clearAllTimers()
      try {
        document.documentElement.classList.remove("intro-active")
      } catch {}
    }
  }, [clearAllTimers, onComplete])

  if (!shouldRender) return null

  const imageSrc = coverImage || DEFAULT_COVER

  return (
    <AnimatePresence>
      {phase < 5 ? (
        <motion.div
          key="cinematic-intro"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center overflow-hidden select-none"
          style={{ willChange: "opacity" }}
        >
          {/* Cinematic Photography Layer (Scene 3, 2.2s - 3.7s) */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 1.06,
              filter: isMobile ? "blur(8px)" : "blur(12px)",
            }}
            animate={{
              opacity: phase >= 2 ? (isMobile ? 0.32 : 0.42) : 0,
              scale: phase >= 2 ? 1.0 : 1.06,
              filter: phase >= 2 ? "blur(0px)" : (isMobile ? "blur(8px)" : "blur(12px)"),
            }}
            transition={{
              duration: 1.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <img
              src={imageSrc}
              alt=""
              decoding="async"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>

          {/* AMOLED Vignette & Deep Dark Overlays */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(5,5,5,0.30) 0%, rgba(5,5,5,0.72) 60%, #050505 100%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/75 pointer-events-none" />

          {/* Aqua Flow Dark Glass Atmosphere: Faint central aqua reflection + restrained edge reflections */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
            {/* Primary soft aqua reflection behind center area */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[520px] max-w-[120vw] rounded-full blur-[110px] opacity-35"
              style={{
                background:
                  "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(27, 104, 112, 0.40) 0%, rgba(10, 57, 64, 0.22) 45%, transparent 75%)",
              }}
            />
            {/* Secondary subtle cyan refraction highlight */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[360px] max-w-[100vw] rounded-full blur-[90px] opacity-25"
              style={{
                background:
                  "radial-gradient(ellipse 70% 50% at 48% 46%, rgba(79, 174, 181, 0.25) 0%, rgba(14, 89, 99, 0.12) 50%, transparent 72%)",
              }}
            />
            {/* Restrained strawberry-pink edge reflection (top right) */}
            <div
              className="absolute top-0 right-0 w-[420px] h-[340px] rounded-full blur-[120px] opacity-15"
              style={{
                background:
                  "radial-gradient(circle, rgba(244, 167, 199, 0.22) 0%, rgba(232, 121, 249, 0.10) 50%, transparent 75%)",
              }}
            />
            {/* Restrained subtle lavender edge reflection (bottom left) */}
            <div
              className="absolute bottom-0 left-0 w-[400px] h-[320px] rounded-full blur-[120px] opacity-15"
              style={{
                background:
                  "radial-gradient(circle, rgba(100, 117, 184, 0.20) 0%, rgba(59, 130, 160, 0.10) 50%, transparent 75%)",
              }}
            />
          </motion.div>

          {/* Skip Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            type="button"
            onClick={finishIntro}
            className="absolute top-5 right-5 sm:top-8 sm:right-8 z-30 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-[var(--font-grotesk)] text-white/55 hover:text-white border border-white/10 hover:border-white/25 bg-black/40 backdrop-blur-md transition-all duration-300 active:scale-95 cursor-pointer"
            aria-label="Skip opening animation"
          >
            <span>Skip</span>
            <ArrowRight className="w-3 h-3 text-[var(--orchid)]" />
          </motion.button>

          {/* Liquid Glass Backing Layer (Scene 3, 2.2s - 3.7s) */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{
              opacity: phase >= 2 ? 1 : 0,
              scale: phase >= 2 ? 1 : 0.96,
            }}
            transition={{
              duration: 1.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center p-4 sm:p-6"
          >
            <div
              className="w-full max-w-xl h-[260px] sm:h-[300px] rounded-[32px] sm:rounded-[40px] border border-white/[0.07] backdrop-blur-md"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 45%, rgba(27, 104, 112, 0.14) 0%, rgba(6, 16, 20, 0.38) 55%, rgba(5, 5, 5, 0.45) 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255, 255, 255, 0.12), inset 0 -1px 0 rgba(79, 174, 181, 0.08), 0 24px 60px rgba(0, 0, 0, 0.55)",
              }}
            />
          </motion.div>

          {/* Centered Editorial Content */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 max-w-xl mx-auto">
            {/* Brand Reveal (1.0s - 2.2s) */}
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{
                opacity: phase >= 1 ? 1 : 0,
                y: phase >= 1 ? (phase >= 3 ? (isMobile ? -6 : -10) : 0) : 16,
                scale: phase >= 1 ? 1 : 0.96,
              }}
              transition={{
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative inline-block"
            >
              {/* Subtle brand backing reflection: soft aqua and strawberry-pink */}
              <motion.div
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: phase >= 1 ? 1 : 0,
                  scale: phase >= 1 ? 1 : 0.9,
                }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none absolute -inset-8 -z-10 rounded-full blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(79, 174, 181, 0.22) 0%, rgba(244, 167, 199, 0.08) 50%, transparent 75%)",
                }}
              />

              <div className="relative overflow-hidden py-1 px-2">
                <h1
                  className="font-[var(--font-instrument-serif)] text-4xl sm:text-5.5xl md:text-6xl text-foreground tracking-tight select-none leading-none"
                  style={{
                    textShadow:
                      "0 0 35px rgba(255,255,255,0.22), 0 0 70px rgba(79,174,181,0.25), 0 0 90px rgba(244,167,199,0.12)",
                  }}
                >
                  Bhavya Writes
                </h1>

                {/* Subtle glass-like light reflection pass */}
                {phase >= 1 && (
                  <motion.span
                    aria-hidden="true"
                    initial={{ x: "-130%", opacity: 0 }}
                    animate={{
                      x: "160%",
                      opacity: [0, 0.65, 0.65, 0],
                    }}
                    transition={{
                      duration: 1.2,
                      delay: 0.2,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="pointer-events-none absolute inset-0 block w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-22deg]"
                  />
                )}
              </div>
            </motion.div>

            {/* Editorial Statement Reveal (Scene 4, 3.7s - 5.1s) */}
            <motion.div
              initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
              animate={{
                opacity: phase >= 3 ? 1 : 0,
                y: phase >= 3 ? 0 : 14,
                filter: phase >= 3 ? "blur(0px)" : "blur(4px)",
              }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-4 sm:mt-5"
            >
              <p className="font-[var(--font-source-serif)] italic text-base sm:text-lg md:text-xl text-[#d4d4d8] tracking-wide leading-relaxed">
                A quieter corner of the internet.
              </p>

              {/* Glowing Moon Emblem Divider */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{
                  opacity: phase >= 3 ? 0.85 : 0,
                  scale: phase >= 3 ? 1 : 0.85,
                }}
                transition={{
                  duration: 1.0,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-4 flex items-center justify-center gap-2.5"
                aria-hidden="true"
              >
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--border-strong)]" />
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "radial-gradient(circle, #fff5f9 0%, #4faeb5 60%, #e879f9 100%)",
                    boxShadow: "0 0 10px rgba(79, 174, 181, 0.65), 0 0 20px rgba(232, 121, 249, 0.35)",
                  }}
                />
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--border-strong)]" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
