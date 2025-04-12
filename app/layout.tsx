import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { CartProvider } from "@/lib/cart-context"
import OfflineDetector from "@/components/offline-detector"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ORVBA - On-Road Vehicle Breakdown Assistance",
  description: "India's most reliable roadside assistance service. Fast, reliable help when you need it most.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
            <OfflineDetector />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'