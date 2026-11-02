import type { Metadata, Viewport } from "next"
import {
  Geist_Mono,
  Instrument_Serif,
  Inter,
  Space_Grotesk,
  Source_Serif_4,
  Great_Vibes,
} from "next/font/google"
import { AmbientBackground } from "@/components/AmbientBackground"
import { CursorWrapper } from "@/components/CursorWrapper"
import { VisitTracker } from "@/components/VisitTracker"
import { ThemeProvider } from "@/components/ThemeProvider"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
})

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
})

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
})

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  weight: "400",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "bhvy. — Digital Journal",
    template: "%s — bhvy.",
  },
  description:
    "Stories, thoughts, and fragments of life — collected in one quiet corner of the internet.",
  keywords: ["bhvy.", "bhvy", "digital journal", "stories", "writing", "essays"],
  openGraph: {
    type: "website",
    siteName: "bhvy.",
    title: "bhvy. — Digital Journal",
    description: "Stories, thoughts, and fragments of life — collected in one quiet corner of the internet.",
  },
  twitter: {
    card: "summary_large_image",
    title: "bhvy. — Digital Journal",
    description: "Stories, thoughts, and fragments of life — collected in one quiet corner of the internet.",
  },
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`dark ${inter.variable} ${instrumentSerif.variable} ${spaceGrotesk.variable} ${sourceSerif.variable} ${greatVibes.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen antialiased bg-transparent text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-full focus:bg-[#8CCDF2] focus:text-[#091825] focus:font-semibold focus:shadow-lg focus:outline-none"
        >
          Skip to content
        </a>
        <ThemeProvider
          attribute="class"
          forcedTheme="dark"
          defaultTheme="dark"
          enableSystem={false}
          themes={["dark"]}
        >
          <AmbientBackground />
          <CursorWrapper />
          <VisitTracker />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
