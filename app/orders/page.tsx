"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Truck, Clock, ArrowRight, Loader2 } from "lucide-react"
import { getCurrentUser } from "@/lib/firebase"

export default function OrdersPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const loadOrders = async () => {
      try {
        // Check if user is logged in
        const user = await getCurrentUser()
        if (!user) {
          window.location.href = "/login"
          return
        }

        // For demo purposes, we'll use mock data
        // In a real app, you would fetch from Firebase
        const mockOrders = [
          {
            id: "ORD-123456",
            date: "2023-05-15",
            status: "delivered",
            total: 129.99,
            items: [
              {
                id: "prod-1",
                name: "Premium Jump Starter",
                price: 89.99,
                quantity: 1,
                image: "/placeholder.svg?height=80&width=80",
              },
              {
                id: "prod-3",
                name: "Tire Repair Kit",
                price: 29.99,
                quantity: 1,
                image: "/placeholder.svg?height=80&width=80",
              },
            ],
            shipping: {
              address: "123 Main St, New York, NY 10001",
              method: "Standard Shipping",
              tracking: "TRK123456789",
            },
          },
          {
            id: "ORD-789012",
            date: "2023-06-02",
            status: "processing",
            total: 49.99,
            items: [
              {
                id: "prod-2",
                name: "Emergency Road Kit",
                price: 49.99,
                quantity: 1,
                image: "/placeholder.svg?height=80&width=80",
              },
            ],
            shipping: {
              address: "123 Main St, New York, NY 10001",
              method: "Express Shipping",
              tracking: null,
            },
          },
        ]

        setOrders(mockOrders)
      } catch (error) {
        console.error("Error loading orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [])

  const filteredOrders = activeTab === "all" ? orders : orders.filter((order) => order.status === activeTab)

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container py-12 max-w-md mx-auto text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">No orders yet</h1>
        <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
        <Button asChild>
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No orders found in this category.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <CardDescription>Placed on {new Date(order.date).toLocaleDateString()}</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      className={
                        order.status === "delivered"
                          ? "bg-green-500"
                          : order.status === "shipped"
                            ? "bg-blue-500"
                            : "bg-yellow-500"
                      }
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/orders/${order.id}`}>
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Order Items */}
                  <div>
                    <h3 className="font-medium mb-4">Items</h3>
                    <div className="space-y-4">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="relative h-20 w-20 rounded overflow-hidden flex-shrink-0 border">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Order Summary */}
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/2">
                      <h3 className="font-medium mb-2">Shipping Information</h3>
                      <div className="text-sm text-muted-foreground">
                        <p>{order.shipping.address}</p>
                        <p className="mt-2">Method: {order.shipping.method}</p>
                        {order.shipping.tracking && (
                          <div className="mt-2 flex items-center">
                            <Truck className="h-4 w-4 mr-1" />
                            <span>Tracking: {order.shipping.tracking}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="md:w-1/2">
                      <h3 className="font-medium mb-2">Order Summary</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal:</span>
                          <span>${(order.total - 10).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shipping:</span>
                          <span>$10.00</span>
                        </div>
                        <div className="flex justify-between font-medium pt-2">
                          <span>Total:</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Status */}
                  {order.status !== "delivered" && (
                    <div className="bg-muted/30 p-4 rounded-lg flex items-center">
                      <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                      <span className="text-sm">
                        {order.status === "processing"
                          ? "Your order is being processed. We'll update you when it ships."
                          : "Your order has shipped and is on its way to you!"}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

