"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Loader2,
  Car,
  Wrench,
  MapPin,
  Clock,
  CheckCircle,
  Package,
  Phone,
  Calendar,
  AlertCircle,
  ArrowRight,
  BarChart3,
  User,
  Bell,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { getCurrentUser, getUserServiceRequests } from "@/lib/firebase"

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [serviceRequests, setServiceRequests] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("active")
  const [stats, setStats] = useState({
    activeRequests: 0,
    completedServices: 0,
    orders: 0,
    savedVehicles: 0,
  })

  // Fetch user details and service requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Check if user is authenticated
        const userData = await getCurrentUser()
        if (!userData) {
          router.push("/login?redirect=/dashboard")
          return
        }

        setUser(userData)

        // Fetch service requests
        const requests = await getUserServiceRequests()
        setServiceRequests(requests)

        // Update stats
        setStats({
          activeRequests: requests.filter((req) => ["pending", "accepted", "reached"].includes(req.status)).length,
          completedServices: requests.filter((req) => req.status === "completed").length,
          orders: 2, // Mock data
          savedVehicles: 3, // Mock data
        })
      } catch (error) {
        console.error("Error fetching user data:", error)
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

  // Filter requests based on active tab
  const filteredRequests = serviceRequests.filter((req) => {
    if (activeTab === "active") return ["pending", "accepted", "reached"].includes(req.status)
    if (activeTab === "completed") return req.status === "completed"
    return true // all
  })

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "status-badge-pending"
      case "accepted":
        return "status-badge-accepted"
      case "reached":
        return "status-badge-reached"
      case "completed":
        return "status-badge-completed"
      case "cancelled":
        return "status-badge-cancelled"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button asChild variant="outline">
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              My Profile
            </Link>
          </Button>
          <Button asChild>
            <Link href="/find-mechanic">
              <Wrench className="mr-2 h-4 w-4" />
              Find Mechanic
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-600 text-sm font-medium mb-1">Active Requests</p>
                <p className="text-3xl font-bold text-blue-700">{stats.activeRequests}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-green-600 text-sm font-medium mb-1">Completed Services</p>
                <p className="text-3xl font-bold text-green-700">{stats.completedServices}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-purple-600 text-sm font-medium mb-1">Orders</p>
                <p className="text-3xl font-bold text-purple-700">{stats.orders}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-amber-600 text-sm font-medium mb-1">Saved Vehicles</p>
                <p className="text-3xl font-bold text-amber-700">{stats.savedVehicles}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <Car className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Service Requests</CardTitle>
                <CardDescription>Track your roadside assistance requests</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/find-mechanic">
                  <Wrench className="mr-2 h-4 w-4" />
                  New Request
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="all">All Requests</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                  {filteredRequests.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No service requests found</h3>
                      <p className="text-muted-foreground mb-6">
                        {activeTab === "active"
                          ? "You don't have any active service requests at the moment."
                          : activeTab === "completed"
                            ? "You haven't completed any service requests yet."
                            : "You haven't made any service requests yet."}
                      </p>
                      <Button asChild>
                        <Link href="/find-mechanic">Request Service</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredRequests.map((request) => (
                        <Card key={request.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div className="p-4 flex-1">
                                <div className="flex items-center mb-2">
                                  <Badge
                                    className={`${getStatusBadgeVariant(request.status)} capitalize px-2 py-1 text-xs`}
                                  >
                                    {request.status}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground ml-2">
                                    {formatDate(request.createdAt)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Car className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">
                                    {request.vehicleDetails.make} {request.vehicleDetails.model}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground truncate max-w-[300px]">
                                    {request.address}
                                  </span>
                                </div>
                              </div>
                              <div className="p-4 bg-gray-50 flex items-center justify-end">
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/service-tracking/${request.id}`}>
                                    View Details
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
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

        <div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" asChild>
                  <Link href="/find-mechanic">
                    <Wrench className="mr-2 h-4 w-4" />
                    Find a Mechanic
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/shop">
                    <Package className="mr-2 h-4 w-4" />
                    Shop Products
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/profile">
                    <Car className="mr-2 h-4 w-4" />
                    Manage Vehicles
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/orders">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Orders
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>Support resources and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-medium mb-2 text-blue-700">24/7 Emergency Support</h3>
                  <p className="text-blue-600 mb-2">Call our emergency hotline for immediate assistance</p>
                  <p className="font-medium text-blue-800">+91 1800-123-4567</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/contact">
                      <Phone className="mr-2 h-4 w-4" />
                      Contact
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/faq">
                      <Bell className="mr-2 h-4 w-4" />
                      FAQ
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Upcoming Service</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.activeRequests > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date().toLocaleDateString("en-IN", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Estimated arrival: 30 minutes</span>
                    </div>
                    <Separator />
                    <Button size="sm" asChild className="w-full">
                      <Link href={`/service-tracking/${filteredRequests[0]?.id}`}>Track Service</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No upcoming services</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

