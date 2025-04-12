"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { User, Package, CreditCard, MapPin, Bell, Shield, LogOut, Car, Wrench, Store, Loader2 } from "lucide-react"
import { auth, getCurrentUser, getUserServiceHistory, logoutUser } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")

  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("personal")
  const [serviceHistory, setServiceHistory] = useState<any[]>([])

  useEffect(() => {
    if (tabParam && ["personal", "vehicles", "services"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Try to get user data
        const userData = await getCurrentUser()

        if (userData) {
          setUser(userData)

          // Get service history
          const services = await getUserServiceHistory()
          setServiceHistory(services)
        } else {
          // If no user data, redirect to login
          router.push("/login")
          return
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        toast({
          title: "Error loading profile",
          description: "Please try again or log in again if the problem persists.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    // Check auth state
    if (typeof window !== "undefined") {
      const unsubscribe = onAuthStateChanged(auth, (authUser) => {
        if (authUser) {
          loadUserData()
        } else {
          // Check if we have user data in localStorage as fallback
          const storedUser = localStorage.getItem("user")
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser))
              setIsLoading(false)
            } catch (error) {
              console.error("Error parsing stored user:", error)
              router.push("/login")
            }
          } else {
            router.push("/login")
          }
        }
      })

      return () => unsubscribe()
    }
  }, [router])

  const handleLogout = async () => {
    try {
      await logoutUser()
      router.push("/login")
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
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
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt={user?.name || "User"} />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{user?.name || "User"}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
                <div className="mt-2 inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || "User"}
                </div>
              </div>

              <nav className="space-y-1">
                <Link href="/profile" className="flex items-center p-2 rounded-md bg-muted text-primary font-medium">
                  <User className="h-4 w-4 mr-3" />
                  Profile
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Package className="h-4 w-4 mr-3" />
                  Orders
                </Link>
                <Link
                  href="/profile/payment"
                  className="flex items-center p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <CreditCard className="h-4 w-4 mr-3" />
                  Payment Methods
                </Link>
                <Link
                  href="/profile/addresses"
                  className="flex items-center p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <MapPin className="h-4 w-4 mr-3" />
                  Addresses
                </Link>
                <Link
                  href="/profile/notifications"
                  className="flex items-center p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Bell className="h-4 w-4 mr-3" />
                  Notifications
                </Link>
                <Link
                  href="/profile/security"
                  className="flex items-center p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Shield className="h-4 w-4 mr-3" />
                  Security
                </Link>

                {user?.role === "seller" && (
                  <Link
                    href="/seller/dashboard"
                    className="flex items-center p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Store className="h-4 w-4 mr-3" />
                    Seller Dashboard
                  </Link>
                )}

                {user?.role === "mechanic" && (
                  <Link
                    href="/mechanic/dashboard"
                    className="flex items-center p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Wrench className="h-4 w-4 mr-3" />
                    Mechanic Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center p-2 rounded-md w-full text-left text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="vehicles">My Vehicles</TabsTrigger>
              <TabsTrigger value="services">Service History</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal information and account settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={user?.name || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={user?.email || ""} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="(123) 456-7890" defaultValue={user?.phone || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input id="dob" type="date" defaultValue={user?.dob || ""} />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Address Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input id="address" placeholder="123 Main St" defaultValue={user?.address?.street || ""} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="New York" defaultValue={user?.address?.city || ""} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" placeholder="NY" defaultValue={user?.address?.state || ""} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input id="zip" placeholder="10001" defaultValue={user?.address?.zip || ""} />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="vehicles">
              <Card>
                <CardHeader>
                  <CardTitle>My Vehicles</CardTitle>
                  <CardDescription>Manage your registered vehicles for faster service</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Vehicle List */}
                    <div className="space-y-4">
                      {[
                        {
                          id: 1,
                          make: "Toyota",
                          model: "Camry",
                          year: 2019,
                          licensePlate: "ABC-1234",
                          color: "Silver",
                        },
                        {
                          id: 2,
                          make: "Honda",
                          model: "CR-V",
                          year: 2020,
                          licensePlate: "XYZ-5678",
                          color: "Blue",
                        },
                      ].map((vehicle) => (
                        <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center">
                            <div className="p-2 bg-muted rounded-full mr-4">
                              <Car className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                              </h4>
                              <div className="flex text-sm text-muted-foreground">
                                <span className="mr-4">License: {vehicle.licensePlate}</span>
                                <span>Color: {vehicle.color}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive border-destructive hover:bg-destructive/10"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Vehicle Button */}
                    <Button variant="outline" className="w-full">
                      <Car className="h-4 w-4 mr-2" />
                      Add a Vehicle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle>Service History</CardTitle>
                  <CardDescription>View your past roadside assistance services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Service History List */}
                    <div className="space-y-4">
                      {serviceHistory.length > 0 ? (
                        serviceHistory.map((service) => (
                          <div key={service.id} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium">{service.serviceType}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {service.createdAt?.toDate
                                    ? new Date(service.createdAt.toDate()).toLocaleDateString()
                                    : new Date(service.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <span
                                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                                    service.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : service.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Vehicle:</span> {service.vehicleYear}{" "}
                                {service.vehicleMake} {service.vehicleModel}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Location:</span> {service.location}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Date/Time:</span> {service.date} {service.time}
                              </div>
                            </div>
                            <div className="mt-3 flex justify-end">
                              <Button variant="link" size="sm" className="h-auto p-0">
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No service history yet</h3>
                          <p className="text-muted-foreground mb-4">You haven't booked any services yet.</p>
                          <Button variant="outline" asChild>
                            <Link href="/services/book">Book Your First Service</Link>
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="text-center">
                      <Button variant="outline" asChild>
                        <Link href="/services/book">
                          <Wrench className="h-4 w-4 mr-2" />
                          Book a New Service
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

