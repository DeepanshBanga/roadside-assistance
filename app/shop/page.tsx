"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Star, Search, ShoppingCart } from "lucide-react"
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
    image: "/placeholder.svg?height=300&width=300",
    description: "Powerful jump starter with built-in safety features and USB charging ports.",
  },
  {
    id: "prod-2",
    name: "Emergency Road Kit",
    price: 49.99,
    rating: 4.5,
    category: "safety",
    image: "/placeholder.svg?height=300&width=300",
    description: "Complete emergency kit with jumper cables, flashlight, and first aid supplies.",
  },
  {
    id: "prod-3",
    name: "Tire Repair Kit",
    price: 29.99,
    rating: 4.7,
    category: "tire",
    image: "/placeholder.svg?height=300&width=300",
    description: "Professional-grade tire repair kit for quick fixes on the go.",
  },
  {
    id: "prod-4",
    name: "LED Road Flares",
    price: 19.99,
    rating: 4.6,
    category: "safety",
    image: "/placeholder.svg?height=300&width=300",
    description: "Bright LED road flares with multiple flash patterns for roadside emergencies.",
  },
  {
    id: "prod-5",
    name: "Portable Air Compressor",
    price: 59.99,
    rating: 4.4,
    category: "tire",
    image: "/placeholder.svg?height=300&width=300",
    description: "Compact air compressor for inflating tires, with digital pressure gauge.",
  },
  {
    id: "prod-6",
    name: "Car Battery Charger",
    price: 45.99,
    rating: 4.3,
    category: "battery",
    image: "/placeholder.svg?height=300&width=300",
    description: "Smart battery charger with multiple charging modes and battery maintenance.",
  },
  {
    id: "prod-7",
    name: "Tow Strap",
    price: 34.99,
    rating: 4.5,
    category: "towing",
    image: "/placeholder.svg?height=300&width=300",
    description: "Heavy-duty tow strap with reinforced loops, 20,000 lb capacity.",
  },
  {
    id: "prod-8",
    name: "Digital Tire Pressure Gauge",
    price: 15.99,
    rating: 4.7,
    category: "tire",
    image: "/placeholder.svg?height=300&width=300",
    description: "Accurate digital tire pressure gauge with backlit display.",
  },
  {
    id: "prod-9",
    name: "Car Escape Tool",
    price: 12.99,
    rating: 4.9,
    category: "safety",
    image: "/placeholder.svg?height=300&width=300",
    description: "Window breaker and seatbelt cutter for emergency escape situations.",
  },
  {
    id: "prod-10",
    name: "Roadside Emergency Sign",
    price: 24.99,
    rating: 4.2,
    category: "safety",
    image: "/placeholder.svg?height=300&width=300",
    description: "Reflective emergency sign to alert other drivers when you're stranded.",
  },
  {
    id: "prod-11",
    name: "Jumper Cables",
    price: 29.99,
    rating: 4.6,
    category: "battery",
    image: "/placeholder.svg?height=300&width=300",
    description: "Heavy-duty jumper cables with copper-clad aluminum conductors.",
  },
  {
    id: "prod-12",
    name: "Car First Aid Kit",
    price: 27.99,
    rating: 4.5,
    category: "safety",
    image: "/placeholder.svg?height=300&width=300",
    description: "Comprehensive first aid kit designed for automotive emergencies.",
  },
]

export default function ShopPage() {
  const { addToCart } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)

  // Filter products based on search, price, category, and rating
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
    const matchesRating = product.rating >= minRating

    return matchesSearch && matchesPrice && matchesCategory && matchesRating
  })

  const categories = Array.from(new Set(products.map((product) => product.category)))

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Shop Products</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Search</h3>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Price Range</h3>
            <Slider
              defaultValue={[0, 100]}
              max={100}
              step={1}
              value={priceRange}
              onValueChange={setPriceRange}
              className="mb-2"
            />
            <div className="flex justify-between text-sm">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
                  <Label htmlFor={`category-${category}`} className="capitalize">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Minimum Rating</h3>
            <div className="flex items-center space-x-2">
              {[0, 1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant={minRating === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMinRating(rating)}
                  className="w-10 h-10 p-0"
                >
                  {rating}
                </Button>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSearchQuery("")
              setPriceRange([0, 100])
              setSelectedCategories([])
              setMinRating(0)
            }}
          >
            Reset Filters
          </Button>
        </div>

        {/* Products Grid */}
        <div className="lg:w-3/4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <Link href={`/shop/${product.id}`} className="block aspect-square relative">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
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
                              i < Math.floor(product.rating)
                                ? "fill-primary text-primary"
                                : "fill-muted text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">{product.rating}</span>
                    </div>
                    <Link href={`/shop/${product.id}`}>
                      <h3 className="font-semibold mb-1 hover:text-primary transition-colors">{product.name}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
                      <Button size="sm" onClick={() => handleAddToCart(product)}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

