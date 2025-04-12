"use client"

import { useEffect, useState } from "react"
import { WifiOff } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { syncOfflineData } from "@/lib/firebase"

export default function OfflineDetector() {
  const [isOnline, setIsOnline] = useState(true)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine)

    // Define event handlers
    const handleOnline = async () => {
      setIsOnline(true)

      // If we were previously offline, sync data
      if (wasOffline) {
        toast({
          title: "You're back online",
          description: "Syncing your offline data...",
        })

        try {
          await syncOfflineData()
          toast({
            title: "Data synced",
            description: "Your offline data has been successfully synced.",
          })
        } catch (error) {
          console.error("Error syncing offline data:", error)
          toast({
            title: "Sync failed",
            description: "Failed to sync some offline data. Please try again later.",
            variant: "destructive",
          })
        }
      }

      setWasOffline(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setWasOffline(true)

      toast({
        title: "You're offline",
        description: "Some features may be limited. We'll save your actions and sync when you're back online.",
        variant: "destructive",
      })
    }

    // Add event listeners
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Clean up
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [wasOffline])

  if (isOnline) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center">
      <WifiOff className="h-4 w-4 mr-2" />
      <span className="text-sm font-medium">You're offline</span>
    </div>
  )
}

