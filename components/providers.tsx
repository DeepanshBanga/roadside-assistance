"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/lib/cart-context"
import { useEffect } from "react"
import { syncOfflineData } from "@/lib/firebase"

export function Providers({ children }: { children: React.ReactNode }) {
  // Check for online status and sync data when coming back online
  useEffect(() => {
    const handleOnline = () => {
      console.log("Connection restored, syncing data...")
      syncOfflineData()
    }

    window.addEventListener("online", handleOnline)

    // Check if we need to sync on initial load
    if (navigator.onLine) {
      syncOfflineData()
    }

    return () => {
      window.removeEventListener("online", handleOnline)
    }
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <CartProvider>{children}</CartProvider>
    </ThemeProvider>
  )
}

