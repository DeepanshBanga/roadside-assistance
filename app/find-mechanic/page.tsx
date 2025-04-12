"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Search,
  Loader2,
  AlertCircle,
  Car,
  Filter,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { findNearbyMechanics, getCurrentUser } from "@/lib/firebase"
import MechanicMap from "@/components/mechanic-map"

export default function FindMechanicPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [location, setLocation] = useState<any>(null)
  const [mechanics, setMechanics] = useState<any[]>([])
  const [filteredMechanics, setFilteredMechanics] = useState<any[]>([])
  const [selectedMechanic, setSelectedMechanic] = useState<any>(null)
  const [searchRadius, setSearchRadius] = useState(5)
  const [locationError, setLocationError] = useState("")
  const [manualLocation, setManualLocation] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    minRating: 0,
    services: [] as string[],
    availability: false,
  })

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser()
      setIsAuthenticated(!!user)
    }
    checkAuth()
  }, [])

  // Get current location
  const getCurrentLocation = () => {
    setIsLoading(true)
    setLocationError("")

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ latitude, longitude })
        searchMechanics({ latitude, longitude })
      },
      (error) => {
        console.error("Error getting location:", error)
        setLocationError(
          "Unable to retrieve your location. Please enable location services or enter your location manually.",
        )
        setIsLoading(false)
      },
    )
  }

  // Search for mechanics based on location
  const searchMechanics = async (loc) => {
    try {
      setIsLoading(true)
      const nearbyMechanics = await findNearbyMechanics(loc, searchRadius)
      setMechanics(nearbyMechanics)
      applyFilters(nearbyMechanics)
    } catch (error) {
      console.error("Error finding mechanics:", error)
      toast({
        title: "Error",
        description: "Failed to find mechanics. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Apply filters to mechanics
  const applyFilters = (mechanicsToFilter = mechanics) => {
    let filtered = [...mechanicsToFilter]

    // Filter by minimum rating
    if (filters.minRating > 0) {
      filtered = filtered.filter((m) => (m.ratings?.average || 0) >= filters.minRating)
    }

    // Filter by services
    if (filters.services.length > 0) {
      filtered = filtered.filter((m) => m.services?.some((service) => filters.services.includes(service.toLowerCase())))
    }

    // Filter by availability
    if (filters.availability) {
      filtered = filtered.filter((m) => m.availability)
    }

    setFilteredMechanics(filtered)
  }

  // Update filters
  const updateFilter = (key, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value }
      return newFilters
    })
  }

  // Effect to apply filters when they change
  useEffect(() => {
    if (mechanics.length > 0) {
      applyFilters()
    }
  }, [filters])

  // Handle manual location search
  const handleManualSearch = async () => {
    if (!manualLocation.trim()) {
      setLocationError("Please enter a location")
      return
    }

    setIsLoading(true)
    setLocationError("")

    try {
      // In a real app, you would use a geocoding API to convert address to coordinates
      // For demo purposes, we'll use a dummy location in Delhi
      const dummyLocation = { latitude: 28.6139, longitude: 77.209 }
      setLocation(dummyLocation)
      searchMechanics(dummyLocation)
    } catch (error) {
      console.error("Error with manual location:", error)
      setLocationError("Unable to find the location. Please try a different address.")
      setIsLoading(false)
    }
  }

  // Request service from a mechanic
  const requestService = (mechanic) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to request service from a mechanic.",
        variant: "destructive",
      })
      router.push(`/login?redirect=/find-mechanic`)
      return
    }

    router.push(`/service-request?mechanicId=${mechanic.id}`)
  }

  // Available services for filtering
  const availableServices = ["towing", "battery", "tire", "fuel", "lockout", "repairs"]

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Find a Mechanic Near You</h1>
          <p className="text-muted-foreground">
            Locate nearby mechanics who can help with your vehicle breakdown or service needs.
          </p>
        </div>
        <Button
          variant="outline"
          className="mt-4 md:mt-0 flex items-center"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="mr-2 h-4 w-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Location</h2>
              <p className="text-muted-foreground">
                We need your location to find mechanics near you. You can use your current location or enter an address
                manually.
              </p>

              <Button onClick={getCurrentLocation} className="w-full" disabled={isLoading} size="lg">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                Use My Current Location
              </Button>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label htmlFor="manual-location">Or enter location manually</Label>
                <div className="flex space-x-2">
                  <Input
                    id="manual-location"
                    placeholder="Enter address, city, or pincode"
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button onClick={handleManualSearch} disabled={isLoading || !manualLocation.trim()}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {locationError && (
                <div className="text-sm text-destructive flex items-center bg-destructive/10 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {locationError}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="radius">Search Radius</Label>
                  <span className="text-sm font-medium">{searchRadius} km</span>
                </div>
                <Slider
                  id="radius"
                  min={1}
                  max={20}
                  step={1}
                  value={[searchRadius]}
                  onValueChange={(value) => setSearchRadius(value[0])}
                  disabled={isLoading}
                  className="py-2"
                />
              </div>
            </div>

            <div className="h-64 md:h-auto relative rounded-md overflow-hidden border">
              {location ? (
                <MechanicMap
                  userLocation={location}
                  mechanics={filteredMechanics.length > 0 ? filteredMechanics : mechanics}
                  selectedMechanic={selectedMechanic}
                  onSelectMechanic={setSelectedMechanic}
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-muted">
                  <div className="text-center p-4">
                    <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Please provide your location to see mechanics on the map</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Filters Section */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-4">Filter Mechanics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Minimum Rating</Label>
                  <div className="flex items-center space-x-2">
                    {[0, 3, 3.5, 4, 4.5].map((rating) => (
                      <Button
                        key={rating}
                        variant={filters.minRating === rating ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateFilter("minRating", rating)}
                        className="flex-1"
                      >
                        {rating > 0 ? (
                          <div className="flex items-center">
                            {rating}+ <Star className="h-3 w-3 ml-1 fill-current" />
                          </div>
                        ) : (
                          "Any"
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Services</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableServices.map((service) => (
                      <Badge
                        key={service}
                        variant={filters.services.includes(service) ? "default" : "outline"}
                        className="cursor-pointer capitalize"
                        onClick={() => {
                          if (filters.services.includes(service)) {
                            updateFilter(
                              "services",
                              filters.services.filter((s) => s !== service),
                            )
                          } else {
                            updateFilter("services", [...filters.services, service])
                          }
                        }}
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.availability}
                      onChange={(e) => updateFilter("availability", e.target.checked)}
                      className="mr-2"
                    />
                    Available Now Only
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Only show mechanics who are currently available for service
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilters({
                      minRating: 0,
                      services: [],
                      availability: false,
                    })
                  }}
                  className="mr-2"
                >
                  Reset Filters
                </Button>
                <Button size="sm" onClick={() => applyFilters()}>
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Searching for mechanics near you...</p>
          </div>
        </div>
      ) : filteredMechanics.length > 0 || (mechanics.length > 0 && !showFilters) ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Mechanics Near You</h2>
            <p className="text-sm text-muted-foreground">
              Showing {filteredMechanics.length || mechanics.length} mechanics within {searchRadius} km
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(filteredMechanics.length > 0 ? filteredMechanics : mechanics).map((mechanic) => (
              <Card
                key={mechanic.id}
                className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  selectedMechanic?.id === mechanic.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedMechanic(mechanic)}
              >
                <div className="aspect-square relative">
                  <Image
                    src={mechanic.profileImage || "/placeholder.svg?height=400&width=400"}
                    alt={mechanic.name}
                    fill
                    className="object-cover"
                  />
                  {mechanic.availability ? (
                    <Badge className="absolute top-2 right-2 bg-green-500">Available Now</Badge>
                  ) : (
                    <Badge className="absolute top-2 right-2 bg-gray-500">Unavailable</Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(mechanic.ratings?.average || 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-300 text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">
                      {mechanic.ratings?.average?.toFixed(1) || "New"} ({mechanic.ratings?.count || 0} reviews)
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{mechanic.name}</h3>
                  <p className="text-muted-foreground mb-2">{mechanic.specialization || "General Mechanic"}</p>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{mechanic.distance} km away</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium">Services:</p>
                    <div className="flex flex-wrap gap-2">
                      {(mechanic.services || ["General Repairs"]).map((service, index) => (
                        <Badge key={index} variant="secondary" className="capitalize">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 p-4">
                  <Button className="w-full" onClick={() => requestService(mechanic)} disabled={!mechanic.availability}>
                    Request Service
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : location ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No mechanics found nearby</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            We couldn't find any mechanics within {searchRadius} km of your location. Try increasing the search radius
            or try a different location.
          </p>
          <Button onClick={() => setSearchRadius(Math.min(searchRadius + 5, 20))}>Increase Search Radius</Button>
        </div>
      ) : null}

      {selectedMechanic && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-background rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <Avatar className="h-16 w-16 mr-4">
                    <AvatarImage src={selectedMechanic.profileImage} alt={selectedMechanic.name} />
                    <AvatarFallback>{selectedMechanic.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedMechanic.name}</h2>
                    <p className="text-muted-foreground">{selectedMechanic.specialization || "General Mechanic"}</p>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(selectedMechanic.ratings?.average || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-300 text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">
                        {selectedMechanic.ratings?.average?.toFixed(1) || "New"} ({selectedMechanic.ratings?.count || 0}{" "}
                        reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedMechanic(null)}>
                  <XCircle className="h-6 w-6" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">About</h3>
                  <p className="text-muted-foreground mb-6">
                    {selectedMechanic.bio || "Experienced mechanic providing quality roadside assistance services."}
                  </p>

                  <h3 className="text-lg font-semibold mb-4">Details</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <MapPin className="h-5 w-5 text-primary mr-2" />
                      <span>
                        {selectedMechanic.address || "Location available upon request"} ({selectedMechanic.distance} km
                        away)
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Clock className="h-5 w-5 text-primary mr-2" />
                      <span>{selectedMechanic.experience || "Experienced"} mechanic</span>
                    </li>
                    <li className="flex items-center">
                      <Calendar className="h-5 w-5 text-primary mr-2" />
                      <span>
                        {selectedMechanic.availability ? (
                          <span className="text-green-600 font-medium">Available now</span>
                        ) : (
                          <span className="text-gray-500">Currently unavailable</span>
                        )}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Phone className="h-5 w-5 text-primary mr-2" />
                      <span>{selectedMechanic.phone || "Phone number available after booking"}</span>
                    </li>
                    <li className="flex items-center">
                      <Mail className="h-5 w-5 text-primary mr-2" />
                      <span>{selectedMechanic.email || "Email available after booking"}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Services</h3>
                  <ul className="space-y-2 mb-6">
                    {(
                      selectedMechanic.services || ["General Repairs", "Battery Jump Start", "Tire Change", "Towing"]
                    ).map((service, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="capitalize">{service}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-lg font-semibold mb-4">Recent Reviews</h3>
                  <div className="space-y-4">
                    {selectedMechanic.reviews ? (
                      selectedMechanic.reviews.map((review, index) => (
                        <div key={index} className="border-b pb-4 last:border-0">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{review.userName}</span>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          <div className="flex mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No reviews yet</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  className="flex-1"
                  onClick={() => requestService(selectedMechanic)}
                  disabled={!selectedMechanic.availability}
                >
                  Request Service
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={`/mechanic/${selectedMechanic.id}`}>View Full Profile</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

