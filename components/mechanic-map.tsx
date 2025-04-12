"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { Loader2 } from "lucide-react"

interface MechanicMapProps {
  userLocation: { latitude: number; longitude: number }
  mechanics: any[]
  selectedMechanic: any | null
  onSelectMechanic: (mechanic: any) => void
}

export default function MechanicMap({ userLocation, mechanics, selectedMechanic, onSelectMechanic }: MechanicMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true)

        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
          version: "weekly",
          libraries: ["places"],
        })

        const google = await loader.load()

        if (!mapRef.current) return

        const newMap = new google.maps.Map(mapRef.current, {
          center: { lat: userLocation.latitude, lng: userLocation.longitude },
          zoom: 13,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          zoomControl: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        })

        // Add user marker
        const userMarker = new google.maps.Marker({
          position: { lat: userLocation.latitude, lng: userLocation.longitude },
          map: newMap,
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            scaledSize: new google.maps.Size(40, 40),
          },
          title: "Your Location",
        })

        // Add info window for user location
        const userInfoWindow = new google.maps.InfoWindow({
          content: "<div><strong>Your Location</strong></div>",
        })

        userMarker.addListener("click", () => {
          userInfoWindow.open(newMap, userMarker)
        })

        setMap(newMap)
      } catch (err) {
        console.error("Error initializing map:", err)
        setError("Failed to load Google Maps. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    if (userLocation) {
      initMap()
    }

    return () => {
      // Clean up markers
      markers.forEach((marker) => marker.setMap(null))
    }
  }, [userLocation])

  // Add mechanic markers when mechanics or map changes
  useEffect(() => {
    if (!map || !mechanics.length) return

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null))

    // Create new markers
    const newMarkers = mechanics.map((mechanic) => {
      // Create marker
      const marker = new (window as any).google.maps.Marker({
        position: {
          lat: mechanic.location?.latitude || 0,
          lng: mechanic.location?.longitude || 0,
        },
        map,
        icon: {
          url: mechanic.availability
            ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
            : "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
          scaledSize: new (window as any).google.maps.Size(32, 32),
        },
        title: mechanic.name,
      })

      // Create info window
      const infoWindow = new (window as any).google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <strong>${mechanic.name}</strong>
            <p style="margin: 4px 0;">${mechanic.specialization || "General Mechanic"}</p>
            <p style="margin: 4px 0;">${mechanic.distance} km away</p>
            <p style="margin: 4px 0; color: ${mechanic.availability ? "green" : "orange"};">
              ${mechanic.availability ? "Available Now" : "Currently Unavailable"}
            </p>
          </div>
        `,
      })

      // Add click listener
      marker.addListener("click", () => {
        // Close all info windows
        markers.forEach((m) => {
          if (m.infoWindow) {
            m.infoWindow.close()
          }
        })

        // Open this info window
        infoWindow.open(map, marker)

        // Select this mechanic
        onSelectMechanic(mechanic)
      })

      // Store info window with marker
      marker.infoWindow = infoWindow

      return marker
    })

    setMarkers(newMarkers)

    // If a mechanic is selected, open its info window
    if (selectedMechanic) {
      const selectedMarker = newMarkers.find((marker) => marker.getTitle() === selectedMechanic.name)

      if (selectedMarker) {
        map.panTo(selectedMarker.getPosition() as google.maps.LatLng)
        selectedMarker.infoWindow.open(map, selectedMarker)
      }
    }

    // Fit bounds to include all markers
    if (newMarkers.length > 0) {
      const bounds = new (window as any).google.maps.LatLngBounds()

      // Add user location to bounds
      bounds.extend({ lat: userLocation.latitude, lng: userLocation.longitude })

      // Add all mechanic locations to bounds
      newMarkers.forEach((marker) => {
        bounds.extend(marker.getPosition() as google.maps.LatLng)
      })

      map.fitBounds(bounds)

      // Don't zoom in too far
      const listener = (window as any).google.maps.event.addListener(map, "idle", () => {
        if (map.getZoom() > 15)
          map
            .setZoom(15)(window as any)
            .google.maps.event.removeListener(listener)
      })
    }

    return () => {
      newMarkers.forEach((marker) => marker.setMap(null))
    }
  }, [map, mechanics, selectedMechanic, onSelectMechanic, userLocation])

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 rounded-md">
        <div className="text-center p-4">
          <p className="text-red-500 font-medium">{error}</p>
          <p className="text-sm text-muted-foreground mt-2">Please check your internet connection and try again.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 rounded-md">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }

  return <div ref={mapRef} className="h-full w-full rounded-md" />
}

