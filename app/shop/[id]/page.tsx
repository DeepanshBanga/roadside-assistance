"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Star, Minus, Plus, ShoppingCart, ArrowLeft, Truck, Shield, RotateCcw, Loader2 } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { toast } from "@/components/ui/use-toast"

// Sample product data
const products = [
  {
    id: "prod-1",
    name: "Premium Jump Starter",
    price: 89.99,
    rating: 4.8,
    category: "battery",
    image: "/placeholder.svg?height=600&width=600",
    description: "Powerful jump starter with built-in safety features and USB charging ports.",
    features: [
      "1000A peak current",
      "Built-in LED flashlight with SOS mode",
      "Dual USB outputs for charging devices",
      "LCD screen displays battery level",
      "Compact design fits in glove compartment",
      "Includes jumper cables and carrying case",
    ],
    specifications: {
      "Peak Current": "1000A",
      "Battery Capacity": "12000mAh",
      Input: "5V/2A",
      Output: "5V/2.1A, 12V Jump Start",
      Dimensions: "6.3 x 3.0 x 1.4 inches",
      Weight: "1.3 lbs",
    },
    stock: 15,
    reviews: [
      {
        id: 1,
        user: "John D.",
        rating: 5,
        date: "2023-03-15",
        comment: "This jump starter saved me twice already! Compact but powerful.",
      },
      {
        id: 2,
        user: "Sarah M.",
        rating: 4,
        date: "2023-02-28",
        comment: "Works great, but the battery drains a bit when not in use.",
      },
    ],
    relatedProducts: ["prod-6", "prod-11", "prod-5"],
  },
  {
    id: "prod-2",
    name: "Emergency Road Kit",
    price: 49.99,
    rating: 4.5,
    category: "safety",
    image: "/placeholder.svg?height=600&width=600",
    description: "Complete emergency kit with jumper cables, flashlight, and first aid supplies.",
    features: [
      "Jumper cables (8 feet, 10 gauge)",
      "LED flashlight with batteries",
      "First aid kit with essential supplies",
      "Reflective warning triangle",
      "Safety vest",
      "Tire pressure gauge",
    ],
    specifications: {
      "Case Dimensions": "12 x 6 x 4 inches",
      Weight: "4.2 lbs",
      "Jumper Cable Length": "8 feet",
      "Jumper Cable Gauge": "10 gauge",
      "Flashlight Power": "3 AAA batteries (included)",
      "First Aid Kit Items": "42 pieces",
    },
    stock: 23,
    reviews: [
      {
        id: 1,
        user: "Michael T.",
        rating: 5,
        date: "2023-04-02",
        comment: "Every car should have this kit. Comprehensive and well-organized.",
      },
      {
        id: 2,
        user: "Lisa R.",
        rating: 4,
        date: "2023-03-10",
        comment: "Good quality items. The case is a bit bulky but fits in my trunk.",
      },
    ],
    relatedProducts: ["prod-9", "prod-10", "prod-12"],
  },
  {
    id: "prod-3",
    name: "Tire Repair Kit",
    price: 29.99,
    rating: 4.7,
    category: "tire",
    image: "/placeholder.svg?height=600&width=600",
    description: "Professional-grade tire repair kit for quick fixes on the go.",
    features: [
      "T-handle reamer tool",
      "T-handle insertion tool",
      "Repair strings (30 pieces)",
      "Rubber cement",
      "Valve cores and valve tool",
      "Compact carrying case",
    ],
    specifications: {
      "Case Dimensions": "8 x 4 x 2 inches",
      Weight: "1.8 lbs",
      "Repair String Type": "Self-vulcanizing",
      "Suitable For": "Tubeless tires",
      "Cement Volume": "1 oz",
      "Tool Material": "Hardened steel",
    },
    stock: 42,
    reviews: [
      {
        id: 1,
        user: "Robert J.",
        rating: 5,
        date: "2023-03-25",
        comment: "Fixed a nail puncture easily. Saved me from waiting for roadside assistance.",
      },
      {
        id: 2,
        user: "Emily W.",
        rating: 4,
        date: "2023-02-18",
        comment: "Good quality tools. Instructions could be clearer for beginners.",
      },
    ],
    relatedProducts: ["prod-5", "prod-8", "prod-10"],
  },
  {
    id: "prod-4",
    name: "LED Road Flares",
    price: 19.99,
    rating: 4.6,
    category: "safety",
    image: "/placeholder.svg?height=600&width=600",
    description: "Bright LED road flares with multiple flash patterns for roadside emergencies.",
    features: [
      "Set of 3 LED flares",
      "9 different flash patterns",
      "Visible up to 1 mile away",
      "Magnetic base attaches to vehicles",
      "Water-resistant design",
      "Includes storage case",
    ],
    specifications: {
      Diameter: "4 inches",
      Height: "1.5 inches",
      Battery: "3 AAA batteries per flare (included)",
      Runtime: "Up to 36 hours",
      Visibility: "Up to 1 mile",
      "Water Resistance": "IP67 rated",
    },
    stock: 38,
    reviews: [
      {
        id: 1,
        user: "Thomas B.",
        rating: 5,
        date: "2023-04-10",
        comment: "Super bright and easy to use. Much safer than traditional flares.",
      },
      {
        id: 2,
        user: "Amanda L.",
        rating: 4,
        date: "2023-03-05",
        comment: "Good visibility at night. Battery life is excellent.",
      },
    ],
    relatedProducts: ["prod-2", "prod-9", "prod-10"],
  },
  {
    id: "prod-5",
    name: "Portable Air Compressor",
    price: 59.99,
    rating: 4.4,
    category: "tire",
    image: "/placeholder.svg?height=600&width=600",
    description: "Compact air compressor for inflating tires, with digital pressure gauge.",
    features: [
      "Digital pressure gauge",
      "Auto shut-off at preset pressure",
      "LED work light",
      "12V DC power (cigarette lighter)",
      "Includes adapters for balls and inflatables",
      "Compact storage bag",
    ],
    specifications: {
      "Max Pressure": "150 PSI",
      "Power Source": "12V DC (car cigarette lighter)",
      "Cable Length": "10 feet",
      "Display Type": "Digital LCD",
      Dimensions: "7.5 x 6.0 x 3.0 inches",
      Weight: "2.2 lbs",
    },
    stock: 19,
    reviews: [
      {
        id: 1,
        user: "David K.",
        rating: 4,
        date: "2023-03-18",
        comment: "Compact and effective. Fills my car tires quickly and the digital gauge is accurate.",
      },
      {
        id: 2,
        user: "Jennifer P.",
        rating: 5,
        date: "2023-02-22",
        comment: "Perfect for keeping in the car. Saved me when I had a slow leak on a road trip.",
      },
    ],
    relatedProducts: ["prod-3", "prod-8", "prod-1"],
  },
  {
    id: "prod-6",
    name: "Car Battery Charger",
    price: 45.99,
    rating: 4.3,
    category: "battery",
    image: "/placeholder.svg?height=600&width=600",
    description: "Smart battery charger with multiple charging modes and battery maintenance.",
    features: [
      "Multiple charging modes (6V/12V)",
      "Automatic voltage detection",
      "Reverse polarity protection",
      "Maintenance mode for battery longevity",
      "LED indicators for charging status",
      "Compact and portable design",
    ],
    specifications: {
      "Input Voltage": "110-120V AC",
      "Output Voltage": "6V/12V DC",
      "Charging Current": "2A/4A/6A",
      "Compatible Batteries": "Lead-acid, AGM, Gel, Deep-cycle",
      "Cable Length": "6 feet",
      Dimensions: "8.0 x 4.0 x 2.5 inches",
    },
    stock: 27,
    reviews: [
      {
        id: 1,
        user: "Richard M.",
        rating: 4,
        date: "2023-04-05",
        comment: "Great charger for maintaining my seasonal vehicles. Easy to use.",
      },
      {
        id: 2,
        user: "Karen S.",
        rating: 5,
        date: "2023-03-12",
        comment: "Brought my dead battery back to life. The maintenance mode is a great feature.",
      },
    ],
    relatedProducts: ["prod-1", "prod-11", "prod-2"],
  },
]

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])

  useEffect(() => {
    // Find the product by ID
    const productId = params.id as string
    const foundProduct = products.find((p) => p.id === productId)

    if (foundProduct) {
      setProduct(foundProduct)

      // Get related products
      if (foundProduct.relatedProducts) {
        const related = products.filter((p) => foundProduct.relatedProducts.includes(p.id))
        setRelatedProducts(related)
      }
    }

    setIsLoading(false)
  }, [params.id])

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
      })

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/shop">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/shop">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating) ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-2">
              {product.rating} ({product.reviews.length} reviews)
            </span>
          </div>

          <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>

          <p className="text-muted-foreground mb-6">{product.description}</p>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Key Features:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {product.features.map((feature: string, index: number) => (
                <li key={index} className="text-muted-foreground">
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center mb-6">
            <div className="mr-4">
              <p className="text-sm text-muted-foreground mb-1">Quantity</p>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease</span>
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase</span>
                </Button>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Availability</p>
              <div className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
              </div>
            </div>
          </div>

          <Button size="lg" className="w-full mb-4" onClick={handleAddToCart} disabled={product.stock <= 0}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>

          <div className="space-y-3 text-sm">
            <div className="flex items-center">
              <Truck className="h-5 w-5 text-muted-foreground mr-2" />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-muted-foreground mr-2" />
              <span>1-year warranty included</span>
            </div>
            <div className="flex items-center">
              <RotateCcw className="h-5 w-5 text-muted-foreground mr-2" />
              <span>30-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="specifications" className="mb-12">
        <TabsList>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="specifications" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, value]: [string, any]) => (
              <div key={key} className="flex justify-between p-3 bg-muted/30 rounded-md">
                <span className="font-medium">{key}</span>
                <span className="text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="pt-6">
          <div className="space-y-6">
            {product.reviews.map((review: any) => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{review.user}</span>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {relatedProducts.length > 0 && (
        <div>
          <Separator className="mb-8" />

          <h2 className="text-2xl font-bold mb-6">Related Products</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="overflow-hidden">
                <Link href={`/shop/${relatedProduct.id}`} className="block aspect-square relative">
                  <Image
                    src={relatedProduct.image || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </Link>
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(relatedProduct.rating)
                              ? "fill-primary text-primary"
                              : "fill-muted text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">{relatedProduct.rating}</span>
                  </div>
                  <Link href={`/shop/${relatedProduct.id}`}>
                    <h3 className="font-semibold mb-1 hover:text-primary transition-colors">{relatedProduct.name}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{relatedProduct.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-lg">${relatedProduct.price.toFixed(2)}</p>
                    <Button
                      size="sm"
                      onClick={() => {
                        addToCart({
                          id: relatedProduct.id,
                          name: relatedProduct.name,
                          price: relatedProduct.price,
                          image: relatedProduct.image,
                          quantity: 1,
                        })

                        toast({
                          title: "Added to cart",
                          description: `${relatedProduct.name} has been added to your cart.`,
                        })
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

