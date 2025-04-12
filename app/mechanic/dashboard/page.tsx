"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Loader2,
  MapPin,
  Phone,
  Car,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  User,
  Settings,
  BarChart,
  Calendar,
  MessageSquare,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { getCurrentUser, getMechanicServiceRequests, updateServiceRequestStatus } from "@/lib/firebase"

export default function MechanicDashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [mechanic, setMechanic] = useState<any>(null)
  const [serviceRequests, setServiceRequests] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("new")
  const [isAvailable, setIsAvailable] = useState(true)
  const [stats, setStats] = useState({
    newRequests: 0,
    activeJobs: 0,
    completedJobs: 0,
    totalEarnings: 0,
  })

  // Fetch mechanic details and service requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Check if user is authenticated and is a mechanic
        const user = await getCurrentUser()
        if (!user) {
          router.push("/login?redirect=/mechanic/dashboard")
          return
        }

        if (user.role !== "mechanic") {
          toast({
            title: "Access Denied",
            description: "Only mechanics can access this dashboard.",
            variant: "destructive",
          })
          router.push("/")
          return
        }

        // Set mechanic data
        setMechanic(user)
        setIsAvailable(user.availability !== false)

        // Fetch service requests
        const requests = await getMechanicServiceRequests()
        setServiceRequests(requests)

        // Update stats
        setStats({
          newRequests: requests.filter((req) => req.status === "pending").length,
          activeJobs: requests.filter((req) => ["accepted", "reached"].includes(req.status)).length,
          completedJobs: requests.filter((req) => req.status === "completed").length,
          totalEarnings: requests
            .filter((req) => req.status === "completed")
            .reduce((sum, req) => sum + (req.amount || 0), 0),
        })
      } catch (error) {
        console.error("Error fetching mechanic data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  // Update mechanic availability
  const toggleAvailability = async () => {
    try {
      // In a real app, you would update in Firebase
      setIsAvailable(!isAvailable)

      toast({
        title: isAvailable ? "You are now offline" : "You are now online",
        description: isAvailable
          ? "You won't receive new service requests while offline."
          : "You can now receive service requests.",
      })
    } catch (error) {
      console.error("Error updating availability:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update your availability status.",
        variant: "destructive",
      })
    }
  }

  // Update service request status
  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      const result = await updateServiceRequestStatus(requestId, newStatus)

      if (result.success) {
        // Update local state
        setServiceRequests((prev) =>
          prev.map((req) =>
            req.id === requestId ? { ...req, status: newStatus, updatedAt: new Date().toISOString() } : req,
          ),
        )

        // Update stats
        if (newStatus === "accepted") {
          setStats((prev) => ({
            ...prev,
            newRequests: prev.newRequests - 1,
            activeJobs: prev.activeJobs + 1,
          }))
        } else if (newStatus === "completed") {
          setStats((prev) => ({
            ...prev,
            activeJobs: prev.activeJobs - 1,
            completedJobs: prev.completedJobs + 1,
            totalEarnings: prev.totalEarnings + 500, // Mock amount
          }))
        }

        toast({
          title: "Status Updated",
          description: `Service request status updated to ${newStatus}.`,
        })
      } else {
        throw new Error(result.error || "Failed to update status")
      }
    } catch (error: any) {
      console.error("Error updating status:", error)
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update service request status.",
        variant: "destructive",
      })
    }
  }

  // Filter requests based on active tab
  const filteredRequests = serviceRequests.filter((req) => {
    if (activeTab === "new") return req.status === "pending"
    if (activeTab === "active") return ["accepted", "reached"].includes(req.status)
    if (activeTab === "completed") return req.status === "completed"
    return true // all
  })

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt={mechanic?.name || "Mechanic"} />
                  <AvatarFallback>{mechanic?.name?.charAt(0) || "M"}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{mechanic?.name || "Mechanic"}</h2>
                <p className="text-muted-foreground">{mechanic?.specialization || "General Mechanic"}</p>
                <div className="mt-2 flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(mechanic?.ratings?.average || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-300 text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">
                    {mechanic?.ratings?.average?.toFixed(1) || "New"} ({mechanic?.ratings?.count || 0})
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${isAvailable ? "bg-green-500" : "bg-gray-400"}`}></div>
                  <span className="font-medium">{isAvailable ? "Online" : "Offline"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="availability" checked={isAvailable} onCheckedChange={toggleAvailability} />
                  <Label htmlFor="availability">Available</Label>
                </div>
              </div>

              <Separator className="mb-6" />

              <nav className="space-y-1">
                <Link
                  href="/mechanic/dashboard"
                  className="flex items-center p-2 rounded-md bg-primary/10 text-primary font-medium"
                >
                  <BarChart className="h-4 w-4 mr-3" />
                  Dashboard
                </Link>
                <Link
                  href="/mechanic/profile"
                  className="flex items-center p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <User className="h-4 w-4 mr-3" />
                  Profile
                </Link>
                <Link
                  href="/mechanic/schedule"
                  className="flex items-center p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Calendar className="h-4 w-4 mr-3" />
                  Schedule
                </Link>
                <Link
                  href="/mechanic/settings"
                  className="flex items-center p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </Link>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Mechanic Dashboard</h1>
            <p className="text-muted-foreground">Manage your service requests and availability</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-blue-600 text-sm font-medium mb-1">New Requests</p>
                    <p className="text-3xl font-bold text-blue-700">{stats.newRequests}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-100">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-purple-600 text-sm font-medium mb-1">Active Jobs</p>
                    <p className="text-3xl font-bold text-purple-700">{stats.activeJobs}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Car className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-100">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-green-600 text-sm font-medium mb-1">Completed</p>
                    <p className="text-3xl font-bold text-green-700">{stats.completedJobs}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-100">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-amber-600 text-sm font-medium mb-1">Earnings</p>
                    <p className="text-3xl font-bold text-amber-700">₹{stats.totalEarnings}</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-full">
                    <BarChart className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Service Requests</CardTitle>
              <CardDescription>Manage your incoming and ongoing service requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="new">New Requests</TabsTrigger>
                  <TabsTrigger value="active">Active Jobs</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="all">All Requests</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                  {filteredRequests.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No requests found</h3>
                      <p className="text-muted-foreground">
                        {activeTab === "new"
                          ? "You don't have any new service requests at the moment."
                          : activeTab === "active"
                            ? "You don't have any active jobs at the moment."
                            : activeTab === "completed"
                              ? "You haven't completed any jobs yet."
                              : "You don't have any service requests yet."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredRequests.map((request) => (
                        <Card key={request.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                              <div>
                                <div className="flex items-center">
                                  <Badge
                                    className={`capitalize ${
                                      request.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                        : request.status === "accepted"
                                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                                          : request.status === "reached"
                                            ? "bg-purple-100 text-purple-800 border border-purple-200"
                                            : "bg-green-100 text-green-800 border border-green-200"
                                    }`}
                                  >
                                    {request.status}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground ml-2">
                                    {formatDate(request.createdAt)}
                                  </span>
                                </div>
                                <h3 className="font-bold text-lg mt-2 capitalize">{request.serviceType}</h3>
                                <p className="text-sm text-muted-foreground">Customer: {request.userName}</p>
                              </div>
                              <div className="flex gap-2">
                                {request.status === "pending" && (
                                  <Button
                                    onClick={() => updateRequestStatus(request.id, "accepted")}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Accept Request
                                  </Button>
                                )}

                                {request.status === "accepted" && (
                                  <Button
                                    onClick={() => updateRequestStatus(request.id, "reached")}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    Mark as Arrived
                                  </Button>
                                )}

                                {request.status === "reached" && (
                                  <Button
                                    onClick={() => updateRequestStatus(request.id, "completed")}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Complete Service
                                  </Button>
                                )}

                                <Button variant="outline" asChild>
                                  <Link href={`/mechanic/service/${request.id}`}>View Details</Link>
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-medium mb-2">Customer Details</h4>
                                <div className="space-y-2">
                                  <div className="flex items-center">
                                    <User className="h-4 w-4 text-muted-foreground mr-2" />
                                    <span>{request.userName}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                                    <span>{request.userPhone}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground mr-2" />
                                    <Button variant="link" className="h-auto p-0" asChild>
                                      <Link href={`/mechanic/chat/${request.userId}`}>Message Customer</Link>
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">Vehicle & Location</h4>
                                <div className="space-y-2">
                                  <div className="flex items-center">
                                    <Car className="h-4 w-4 text-muted-foreground mr-2" />
                                    <span>
                                      {request.vehicleDetails.year} {request.vehicleDetails.make}{" "}
                                      {request.vehicleDetails.model}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                                    <span>{request.address}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Button variant="link" className="h-auto p-0" asChild>
                                      <Link
                                        href={`https://www.google.com/maps/search/?api=1&query=${request.location?.latitude},${request.location?.longitude}`}
                                        target="_blank"
                                      >
                                        <MapPin className="h-4 w-4 mr-1" />
                                        Open in Maps
                                      </Link>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {request.description && (
                              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                                <h4 className="font-medium mb-2">Problem Description</h4>
                                <p className="text-sm text-muted-foreground">{request.description}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

