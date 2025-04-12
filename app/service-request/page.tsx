"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, MapPin, Car, Wrench, AlertCircle, Star, ArrowLeft, CheckCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { createServiceRequest, getCurrentUser } from "@/lib/firebase"
import Link from "next/link"

export default function ServiceRequestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mechanicId = searchParams.get("mechanicId")

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mechanic, setMechanic] = useState<any>(null)
  const [location, setLocation] = useState<any>(null)
  const [formData, setFormData] = useState({
    serviceType: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    description: "",
    address: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formStep, setFormStep] = useState(1)
  const [isLocationDetected, setIsLocationDetected] = useState(false)

  // Fetch mechanic details and user location
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true)

        // Check if user is authenticated
        const user = await getCurrentUser()
        if (!user) {
          router.push(`/login?redirect=/service-request?mechanicId=${mechanicId}`)
          return
        }

        // Get mechanic details
        // In a real app, you would fetch from Firebase
        // For demo, we'll use mock data
        setMechanic({
          id: mechanicId,
          name: "Rajesh Kumar",
          specialization: "Engine Specialist",
          ratings: { average: 4.8, count: 24 },
          services: ["Engine Repair", "Battery Service", "Towing"],
          profileImage: "/placeholder.svg?height=100&width=100",
        })

        // Get user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords
              setLocation({ latitude, longitude })
              setIsLocationDetected(true)

              // Get address from coordinates (reverse geocoding)
              // In a real app, you would use a geocoding service
              // For demo, we'll use a placeholder
              setFormData((prev) => ({
                ...prev,
                address: "Detected location (coordinates available)",
              }))
            },
            (error) => {
              console.error("Error getting location:", error)
              // Use a default location (Delhi)
              setLocation({ latitude: 28.6139, longitude: 77.209 })
              setIsLocationDetected(false)
            },
          )
        } else {
          // Use a default location (Delhi)
          setLocation({ latitude: 28.6139, longitude: 77.209 })
          setIsLocationDetected(false)
        }
      } catch (error) {
        console.error("Error initializing service request:", error)
        toast({
          title: "Error",
          description: "Failed to load mechanic details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    initialize()
  }, [mechanicId, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.serviceType) newErrors.serviceType = "Service type is required"
    if (!formData.address) newErrors.address = "Address is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.vehicleMake) newErrors.vehicleMake = "Vehicle make is required"
    if (!formData.vehicleModel) newErrors.vehicleModel = "Vehicle model is required"
    if (!formData.vehicleYear) newErrors.vehicleYear = "Vehicle year is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (formStep === 1 && validateStep1()) {
      setFormStep(2)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevStep = () => {
    if (formStep === 2) {
      setFormStep(1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formStep === 1) {
      if (validateStep1()) {
        handleNextStep()
      }
      return
    }

    if (!validateStep2()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (!location) {
      toast({
        title: "Location Error",
        description: "We need your location to process this request.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const requestData = {
        mechanicId,
        location,
        address: formData.address,
        vehicleDetails: {
          make: formData.vehicleMake,
          model: formData.vehicleModel,
          year: formData.vehicleYear,
        },
        serviceType: formData.serviceType,
        description: formData.description,
      }

      const result = await createServiceRequest(requestData)

      if (result.success) {
        toast({
          title: "Service Request Sent!",
          description: "Your request has been sent to the mechanic. You'll be notified when they respond.",
        })

        // Redirect to service tracking page
        router.push(`/service-tracking/${result.requestId}`)
      } else {
        throw new Error(result.error || "Failed to send service request")
      }
    } catch (error: any) {
      console.error("Service request error:", error)
      toast({
        title: "Request Failed",
        description: error.message || "There was a problem sending your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading service request form...</p>
        </div>
      </div>
    )
  }

  if (!mechanic) {
    return (
      <div className="container py-12 text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Mechanic Not Found</h1>
        <p className="text-muted-foreground mb-6">The mechanic you're looking for doesn't exist or is unavailable.</p>
        <Button onClick={() => router.push("/find-mechanic")}>Find Another Mechanic</Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/find-mechanic">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Mechanics
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-2">Request Service</h1>
          <p className="text-muted-foreground mb-8">
            Fill out the form below to request roadside assistance from this mechanic.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${formStep === 1 ? "bg-primary text-white" : "bg-primary text-white"}`}
              >
                1
              </div>
              <div className={`h-1 w-16 ${formStep === 2 ? "bg-primary" : "bg-gray-200"}`}></div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${formStep === 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"}`}
              >
                2
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Step {formStep} of 2</div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm font-medium">Service Details</span>
            <span className="text-sm font-medium">Vehicle Information</span>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Selected Mechanic</CardTitle>
            <CardDescription>You are requesting service from this mechanic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Avatar className="h-16 w-16 mr-4">
                <AvatarImage src={mechanic.profileImage} alt={mechanic.name} />
                <AvatarFallback>{mechanic.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold">{mechanic.name}</h3>
                <p className="text-muted-foreground">{mechanic.specialization}</p>
                <div className="flex items-center mt-1">
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
                    {mechanic.ratings?.average.toFixed(1)} ({mechanic.ratings?.count} reviews)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>{formStep === 1 ? "Service Details" : "Vehicle Information"}</CardTitle>
              <CardDescription>
                {formStep === 1
                  ? "Tell us what type of service you need and your location"
                  : "Provide details about your vehicle"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formStep === 1 ? (
                <>
                  {/* Service Type */}
                  <div className="space-y-4">
                    <Label>Service Type</Label>
                    <RadioGroup
                      value={formData.serviceType}
                      onValueChange={(value) => handleSelectChange("serviceType", value)}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {[
                        { value: "towing", label: "Towing Service", icon: <Car className="h-4 w-4 mr-2" /> },
                        { value: "battery", label: "Battery Jump Start", icon: <Wrench className="h-4 w-4 mr-2" /> },
                        { value: "tire", label: "Tire Change", icon: <Wrench className="h-4 w-4 mr-2" /> },
                        { value: "fuel", label: "Fuel Delivery", icon: <Wrench className="h-4 w-4 mr-2" /> },
                        { value: "lockout", label: "Lockout Assistance", icon: <Wrench className="h-4 w-4 mr-2" /> },
                        { value: "other", label: "Other Service", icon: <Wrench className="h-4 w-4 mr-2" /> },
                      ].map((service) => (
                        <div key={service.value} className="flex items-center">
                          <RadioGroupItem value={service.value} id={service.value} className="peer sr-only" />
                          <Label
                            htmlFor={service.value}
                            className="flex items-center justify-between w-full p-4 border rounded-md cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                          >
                            <div className="flex items-center">
                              {service.icon}
                              {service.label}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {errors.serviceType && (
                      <p className="text-sm text-destructive flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.serviceType}
                      </p>
                    )}
                  </div>

                  <Separator />

                  {/* Location */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="address">Your Location</Label>
                      {isLocationDetected && (
                        <span className="text-xs text-green-600 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Location detected
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        name="address"
                        placeholder="Enter your exact address for the mechanic"
                        value={formData.address}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                    {errors.address && (
                      <p className="text-sm text-destructive flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.address}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Your GPS coordinates will be automatically shared with the mechanic.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Vehicle Information */}
                  <div>
                    <h3 className="font-medium mb-4">Vehicle Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="vehicleMake">Make</Label>
                        <Select
                          value={formData.vehicleMake}
                          onValueChange={(value) => handleSelectChange("vehicleMake", value)}
                        >
                          <SelectTrigger id="vehicleMake">
                            <SelectValue placeholder="Select make" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "Maruti Suzuki",
                              "Hyundai",
                              "Tata",
                              "Mahindra",
                              "Honda",
                              "Toyota",
                              "Ford",
                              "Kia",
                              "MG",
                              "Other",
                            ].map((make) => (
                              <SelectItem key={make} value={make}>
                                {make}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.vehicleMake && (
                          <p className="text-sm text-destructive flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.vehicleMake}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vehicleModel">Model</Label>
                        <Input
                          id="vehicleModel"
                          name="vehicleModel"
                          placeholder="e.g. Swift"
                          value={formData.vehicleModel}
                          onChange={handleChange}
                        />
                        {errors.vehicleModel && (
                          <p className="text-sm text-destructive flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.vehicleModel}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vehicleYear">Year</Label>
                        <Input
                          id="vehicleYear"
                          name="vehicleYear"
                          placeholder="e.g. 2020"
                          value={formData.vehicleYear}
                          onChange={handleChange}
                        />
                        {errors.vehicleYear && (
                          <p className="text-sm text-destructive flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.vehicleYear}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Problem Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Please describe the issue with your vehicle in detail"
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {formStep === 1 ? (
                <>
                  <Button variant="outline" type="button" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleNextStep}>
                    Next Step
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" type="button" onClick={handlePrevStep}>
                    Previous Step
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Request...
                      </>
                    ) : (
                      "Send Service Request"
                    )}
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}

