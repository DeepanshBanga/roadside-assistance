"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ShoppingBag, ArrowRight, Home } from "lucide-react"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const [orderNumber, setOrderNumber] = useState<string>("")

  useEffect(() => {
    // Generate a random order number
    const randomOrderNumber = `ORD-${Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")}`
    setOrderNumber(randomOrderNumber)
  }, [])

  return (
    <div className="container py-12 max-w-md mx-auto">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Order Successful!</CardTitle>
          <CardDescription>Thank you for your purchase. Your order has been confirmed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Order Number</p>
            <p className="font-medium">{orderNumber}</p>
          </div>
          <p className="text-muted-foreground">
            We've sent a confirmation email with order details and tracking information.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button asChild className="w-full">
            <Link href="/orders">
              <ShoppingBag className="mr-2 h-4 w-4" />
              View My Orders
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/shop">
              <ArrowRight className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
          <Button variant="ghost" asChild className="w-full">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

