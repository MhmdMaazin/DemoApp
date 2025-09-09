import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "@/contexts/auth-context"
import { AppProvider } from "@/contexts/app-context"
import { Toaster } from "@/components/ui/sonner"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Demo App",
  description: "Created with React.Js and Tailwind CSS",
  generator: "Demo App",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased overflow-x-hidden`}>
      <body className="overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="demo-app-theme"
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <AuthProvider>
              <AppProvider>
                {children}
                <Toaster />
              </AppProvider>
            </AuthProvider>
          </Suspense>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
