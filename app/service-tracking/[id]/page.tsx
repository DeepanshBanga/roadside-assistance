"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Loader2,
  MapPin,
  Phone,
  MessageSquare,
  Car,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Home,
  Send,
  ArrowLeft,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { getCurrentUser, rateMechanic } from "@/lib/firebase"
import ServiceStatusTimeline from "@/components/service-status-timeline"
import RatingDialog from "@/components/rating-dialog"

export default function ServiceTrackingPage() {
  const params = useParams()
  const router = useRouter()
  const requestId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [serviceRequest, setServiceRequest] = useState<any>(null)
  const [mechanic, setMechanic] = useState<any>(null)
  const [showRatingDialog, setShowRatingDialog] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null)

  // Fetch service request details
  useEffect(() => {
    const fetchServiceRequest = async () => {
      try {
        setIsLoading(true)

        // Check if user is authenticated
        const user = await getCurrentUser()
        if (!user) {
          router.push(`/login?redirect=/service-tracking/${requestId}`)
          return
        }

        // In a real app, you would fetch from Firebase
        // For demo, we'll use mock data
        const mockServiceRequest = {
          id: requestId,
          userId: user.uid,
          mechanicId: "mech123",
          status: "accepted", // pending, accepted, reached, completed, cancelled
          serviceType: "battery",
          vehicleDetails: {
            make: "Maruti Suzuki",
            model: "Swift",
            year: "2019",
          },
          location: {
            latitude: 28.6139,
            longitude: 77.209,
          },
          address: "123 Main St, Delhi",
          description: "Car won't start, battery seems dead",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          statusUpdates: [
            {
              status: "pending",
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              notes: "Service request submitted",
            },
            {
              status: "accepted",
              timestamp: new Date(Date.now() - 1800000).toISOString(),
              notes: "Mechanic has accepted your request and is on the way",
            },
          ],
        }

        setServiceRequest(mockServiceRequest)

        // Fetch mechanic details
        const mockMechanic = {
          id: "mech123",
          name: "Rajesh Kumar",
          phone: "+91 98765 43210",
          specialization: "Battery Specialist",
          ratings: { average: 4.8, count: 24 },
          profileImage: "/placeholder.svg?height=100&width=100",
          estimatedArrival: new Date(Date.now() + 1800000).toISOString(), // 30 minutes from now
        }

        setMechanic(mockMechanic)

        // Set estimated time
        if (mockServiceRequest.status === "accepted" && mockMechanic.estimatedArrival) {
          const arrivalTime = new Date(mockMechanic.estimatedArrival).getTime()
          const now = Date.now()
          const diffMs = arrivalTime - now
          const diffMins = Math.round(diffMs / 60000)
          setEstimatedTime(diffMins)
        }

        // Mock messages
        setMessages([
          {
            id: 1,
            senderId: "mech123",
            senderName: "Rajesh Kumar",
            message: "Hello, I've accepted your service request. I'll be there in about 30 minutes.",
            timestamp: new Date(Date.now() - 1700000).toISOString(),
          },
          {
            id: 2,
            senderId: user.uid,
            senderName: user.name,
            message: "Thank you! I'll be waiting.",
            timestamp: new Date(Date.now() - 1600000).toISOString(),
          },
        ])
      } catch (error) {
        console.error("Error fetching service request:", error)
        toast({
          title: "Error",
          description: "Failed to load service request details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchServiceRequest()

    // Update estimated time every minute
    const timer = setInterval(() => {
      if (estimatedTime && estimatedTime > 0) {
        setEstimatedTime((prev) => (prev ? prev - 1 : null))
      }
    }, 60000)

    return () => clearInterval(timer)
  }, [requestId, router])

  // Handle sending message
  const handleSendMessage = () => {
    if (!message.trim()) return

    // In a real app, you would send to Firebase
    const newMessage = {
      id: messages.length + 1,
      senderId: "user123", // Current user ID
      senderName: "You",
      message: message.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, newMessage])

    toast({
      title: "Message Sent",
      description: "Your message has been sent to the mechanic.",
    })

    setMessage("")
  }

  // Handle rating submission
  const handleRateService = async (rating: number, review: string) => {
    try {
      if (!mechanic) return

      const result = await rateMechanic(mechanic.id, rating, review)

      if (result.success) {
        toast({
          title: "Thank You!",
          description: "Your rating has been submitted successfully.",
        })

        setShowRatingDialog(false)
      } else {
        throw new Error(result.error || "Failed to submit rating")
      }
    } catch (error: any) {
      console.error("Rating error:", error)
      toast({
        title: "Rating Failed",
        description: error.message || "There was a problem submitting your rating. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "accepted":
        return "bg-blue-500"
      case "reached":
        return "bg-purple-500"
      case "completed":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "accepted":
        return "Mechanic Accepted"
      case "reached":
        return "Mechanic Arrived"
      case "completed":
        return "Service Completed"
      case "cancelled":
        return "Cancelled"
      default:
        return "Unknown"
    }
  }

  // Format time remaining
  const formatTimeRemaining = (minutes: number) => {
    if (minutes <= 0) return "Arriving now"
    if (minutes === 1) return "1 minute"
    return `${minutes} minutes`
  }

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading service details...</p>
        </div>
      </div>
    )
  }

  if (!serviceRequest) {
    return (
      <div className="container py-12 text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Service Request Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The service request you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/find-mechanic">
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-2">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Service Request</h1>
          </div>
          <Badge className={`${getStatusColor(serviceRequest.status)} text-white px-3 py-1`}>
            {getStatusText(serviceRequest.status)}
          </Badge>
        </div>

        <Card className="mb-8 overflow-hidden">
          <div
            className={`p-3 ${
              serviceRequest.status === "pending"
                ? "bg-yellow-50"
                : serviceRequest.status === "accepted"
                  ? "bg-blue-50"
                  : serviceRequest.status === "reached"
                    ? "bg-purple-50"
                    : serviceRequest.status === "completed"
                      ? "bg-green-50"
                      : "bg-red-50"
            }`}
          >
            <div className="flex items-center">
              {serviceRequest.status === "pending" && (
                <>
                  <Clock
                    className={`h-5 w-5 mr-2 ${
                      serviceRequest.status === "pending"
                        ? "text-yellow-600"
                        : serviceRequest.status === "accepted"
                          ? "text-blue-600"
                          : serviceRequest.status === "reached"
                            ? "text-purple-600"
                            : serviceRequest.status === "completed"
                              ? "text-green-600"
                              : "text-red-600"
                    }`}
                  />
                  <p
                    className={`text-sm font-medium ${
                      serviceRequest.status === "pending"
                        ? "text-yellow-600"
                        : serviceRequest.status === "accepted"
                          ? "text-blue-600"
                          : serviceRequest.status === "reached"
                            ? "text-purple-600"
                            : serviceRequest.status === "completed"
                              ? "text-green-600"
                              : "text-red-600"
                    }`}
                  >
                    Waiting for a mechanic to accept your request
                  </p>
                </>
              )}

              {serviceRequest.status === "accepted" && (
                <>
                  <Car className="h-5 w-5 mr-2 text-blue-600" />
                  <p className="text-sm font-medium text-blue-600">
                    Mechanic is on the way - Estimated arrival in{" "}
                    {estimatedTime ? formatTimeRemaining(estimatedTime) : "30 minutes"}
                  </p>
                </>
              )}

              {serviceRequest.status === "reached" && (
                <>
                  <CheckCircle className="h-5 w-5 mr-2 text-purple-600" />
                  <p className="text-sm font-medium text-purple-600">Mechanic has arrived at your location</p>
                </>
              )}

              {serviceRequest.status === "completed" && (
                <>
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  <p className="text-sm font-medium text-green-600">Service has been completed successfully</p>
                </>
              )}

              {serviceRequest.status === "cancelled" && (
                <>
                  <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                  <p className="text-sm font-medium text-red-600">This service request has been cancelled</p>
                </>
              )}
            </div>
          </div>

          <CardHeader>
            <CardTitle>Service Details</CardTitle>
            <CardDescription>Details of your roadside assistance request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Service Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Type:</span>
                    <span className="font-medium capitalize">{serviceRequest.serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Requested:</span>
                    <span>{new Date(serviceRequest.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span>{serviceRequest.address}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Vehicle Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Make:</span>
                    <span>{serviceRequest.vehicleDetails.make}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Model:</span>
                    <span>{serviceRequest.vehicleDetails.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year:</span>
                    <span>{serviceRequest.vehicleDetails.year}</span>
                  </div>
                </div>
              </div>
            </div>

            {serviceRequest.description && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium mb-2">Problem Description</h3>
                  <p className="text-sm text-muted-foreground">{serviceRequest.description}</p>
                </div>
              </>
            )}

            <Separator />

            <div>
              <h3 className="font-medium mb-4">Service Status Timeline</h3>
              <ServiceStatusTimeline statusUpdates={serviceRequest.statusUpdates} />
            </div>
          </CardContent>
        </Card>

        {mechanic && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Assigned Mechanic</CardTitle>
              <CardDescription>This mechanic has been assigned to your service request</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-primary mr-2" />
                    <span>{mechanic.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-primary mr-2" />
                    <span>
                      {serviceRequest.status === "reached"
                        ? "Mechanic has arrived at your location"
                        : serviceRequest.status === "completed"
                          ? "Service completed at your location"
                          : "En route to your location"}
                    </span>
                  </div>
                </div>

                {serviceRequest.status === "accepted" && mechanic.estimatedArrival && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium text-blue-600">Estimated Arrival</span>
                    </div>
                    <p className="text-blue-600">
                      {estimatedTime ? formatTimeRemaining(estimatedTime) : "30 minutes"} remaining
                    </p>
                    <p className="text-sm text-blue-500 mt-1">
                      Expected by {new Date(mechanic.estimatedArrival).toLocaleTimeString()}
                    </p>
                  </div>
                )}

                {serviceRequest.status === "reached" && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-purple-600 mr-2" />
                      <span className="font-medium text-purple-600">Mechanic Has Arrived</span>
                    </div>
                    <p className="text-purple-600">The mechanic is at your location and working on your vehicle.</p>
                  </div>
                )}

                {serviceRequest.status === "completed" && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium text-green-600">Service Completed</span>
                    </div>
                    <p className="text-green-600">The service has been completed successfully.</p>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-green-600"
                      onClick={() => setShowRatingDialog(true)}
                    >
                      Rate this service
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>

            {/* Chat Section */}
            <div className="border-t p-6">
              <h3 className="font-medium mb-4">Messages</h3>

              <div className="bg-gray-50 rounded-lg p-4 mb-4 h-64 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No messages yet</p>
                      <p className="text-sm text-muted-foreground">Send a message to the mechanic</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderId === "user123" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.senderId === "user123" ? "bg-primary text-white" : "bg-white border"
                          }`}
                        >
                          <p className="text-xs font-medium mb-1">
                            {msg.senderId === "user123" ? "You" : msg.senderName}
                          </p>
                          <p>{msg.message}</p>
                          <p className="text-xs opacity-70 text-right mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Textarea
                  placeholder="Type a message to the mechanic..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                  disabled={serviceRequest.status === "completed" || serviceRequest.status === "cancelled"}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={
                    !message.trim() || serviceRequest.status === "completed" || serviceRequest.status === "cancelled"
                  }
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <CardFooter className="border-t bg-gray-50 flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>

              {serviceRequest.status === "completed" && (
                <Button onClick={() => setShowRatingDialog(true)}>Rate Service</Button>
              )}
            </CardFooter>
          </Card>
        )}

        {/* Show this if no mechanic has accepted yet */}
        {serviceRequest.status === "pending" && (
          <Card>
            <CardContent className="p-6 text-center">
              <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Waiting for a Mechanic</h3>
              <p className="text-muted-foreground mb-6">
                Your service request has been submitted. We're finding a mechanic for you. This usually takes 2-5
                minutes.
              </p>
              <div className="flex justify-center">
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Rating Dialog */}
      {showRatingDialog && (
        <RatingDialog
          mechanicName={mechanic.name}
          onSubmit={handleRateService}
          onCancel={() => setShowRatingDialog(false)}
        />
      )}
    </div>
  )
}

