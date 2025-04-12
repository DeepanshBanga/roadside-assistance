"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Loader2, Calendar, Clock, MapPin, Car, Wrench, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { bookService, getCurrentUser } from "@/lib/firebase"

export default function BookServicePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    serviceType: "",
    date: "",
    time: "",
    location: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    description: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.serviceType) newErrors.serviceType = "Service type is required"
    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.time) newErrors.time = "Time is required"
    if (!formData.location) newErrors.location = "Location is required"
    if (!formData.vehicleMake) newErrors.vehicleMake = "Vehicle make is required"
    if (!formData.vehicleModel) newErrors.vehicleModel = "Vehicle model is required"
    if (!formData.vehicleYear) newErrors.vehicleYear = "Vehicle year is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Check if user is logged in
      const user = await getCurrentUser()
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please log in to book a service.",
          variant: "destructive",
        })
        router.push("/login?redirect=/services/book")
        return
      }

      // Submit service booking
      const result = await bookService(formData)

      if (result.success) {
        toast({
          title: "Service Booked!",
          description: result.offline
            ? "Your service has been saved offline and will be submitted when you're back online."
            : "Your service has been booked successfully.",
        })

        // Redirect to profile page
        router.push("/profile?tab=services")
      } else {
        throw new Error(result.error || "Failed to book service")
      }
    } catch (error: any) {
      console.error("Service booking error:", error)
      toast({
        title: "Booking Failed",
        description: error.message || "There was a problem booking your service. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Book a Service</h1>
        <p className="text-muted-foreground mb-8">
          Fill out the form below to request roadside assistance or schedule a service.
        </p>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
              <CardDescription>Tell us what type of service you need and when you need it.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                  {errors.date && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.date}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                  {errors.time && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.time}
                    </p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    name="location"
                    placeholder="Enter your current location or address"
                    value={formData.location}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
                {errors.location && (
                  <p className="text-sm text-destructive flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.location}
                  </p>
                )}
              </div>

              <Separator />

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
                          "Toyota",
                          "Honda",
                          "Ford",
                          "Chevrolet",
                          "Nissan",
                          "BMW",
                          "Mercedes",
                          "Audi",
                          "Hyundai",
                          "Kia",
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
                      placeholder="e.g. Camry"
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
                <Label htmlFor="description">Additional Information</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Please provide any additional details about your situation or specific requirements"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Book Service"
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}

