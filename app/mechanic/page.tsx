"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Phone, Mail, Clock, Calendar, CheckCircle, XCircle } from "lucide-react"

// Sample mechanics data
const mechanics = [
  {
    id: "mech-1",
    name: "John Smith",
    specialty: "Engine Repair",
    rating: 4.8,
    reviews: 124,
    location: "New York, NY",
    distance: "2.5 miles",
    available: true,
    image: "/placeholder.svg?height=400&width=400",
    services: ["Engine Repair", "Battery Replacement", "Tire Change"],
    experience: "8 years",
    bio: "Certified mechanic with 8 years of experience specializing in engine repair and diagnostics. I've worked with various vehicle makes and models, providing reliable roadside assistance and repairs.",
  },
  {
    id: "mech-2",
    name: "Sarah Johnson",
    specialty: "Electrical Systems",
    rating: 4.9,
    reviews: 98,
    location: "New York, NY",
    distance: "3.2 miles",
    available: true,
    image: "/placeholder.svg?height=400&width=400",
    services: ["Electrical Repairs", "Battery Service", "Computer Diagnostics"],
    experience: "6 years",
    bio: "Specialized in automotive electrical systems with 6 years of experience. I provide quick and reliable electrical repairs and diagnostics for all vehicle types.",
  },
  {
    id: "mech-3",
    name: "Michael Chen",
    specialty: "Tire & Brake Service",
    rating: 4.7,
    reviews: 87,
    location: "New York, NY",
    distance: "1.8 miles",
    available: false,
    image: "/placeholder.svg?height=400&width=400",
    services: ["Tire Repair", "Brake Service", "Wheel Alignment"],
    experience: "5 years",
    bio: "Expert in tire and brake services with 5 years of experience. I provide fast and reliable roadside tire changes and repairs to get you back on the road quickly.",
  },
  {
    id: "mech-4",
    name: "Emily Rodriguez",
    specialty: "General Repairs",
    rating: 4.6,
    reviews: 76,
    location: "New York, NY",
    distance: "4.1 miles",
    available: true,
    image: "/placeholder.svg?height=400&width=400",
    services: ["General Repairs", "Towing", "Jump Starts"],
    experience: "7 years",
    bio: "Versatile mechanic with 7 years of experience in general automotive repairs. I provide comprehensive roadside assistance services to help you in any situation.",
  },
  {
    id: "mech-5",
    name: "David Wilson",
    specialty: "Locksmith Services",
    rating: 4.9,
    reviews: 112,
    location: "New York, NY",
    distance: "3.5 miles",
    available: true,
    image: "/placeholder.svg?height=400&width=400",
    services: ["Lockout Assistance", "Key Replacement", "Lock Repair"],
    experience: "10 years",
    bio: "Specialized automotive locksmith with 10 years of experience. I provide fast and reliable lockout assistance and key services for all vehicle makes and models.",
  },
  {
    id: "mech-6",
    name: "Lisa Thompson",
    specialty: "Fuel System",
    rating: 4.7,
    reviews: 65,
    location: "New York, NY",
    distance: "5.2 miles",
    available: false,
    image: "/placeholder.svg?height=400&width=400",
    services: ["Fuel Delivery", "Fuel System Repair", "Fuel Pump Replacement"],
    experience: "4 years",
    bio: "Specialized in fuel system services with 4 years of experience. I provide emergency fuel delivery and fuel system repairs to get you back on the road.",
  },
]

export default function MechanicsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedMechanic, setSelectedMechanic] = useState<any>(null)

  const filteredMechanics = activeTab === "available" ? mechanics.filter((m) => m.available) : mechanics

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Our Mechanics</h1>
      <p className="text-muted-foreground mb-8">
        Find and connect with our certified mechanics for roadside assistance and repairs
      </p>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Mechanics</TabsTrigger>
          <TabsTrigger value="available">Available Now</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMechanics.map((mechanic) => (
          <Card key={mechanic.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <Image src={mechanic.image || "/placeholder.svg"} alt={mechanic.name} fill className="object-cover" />
              {mechanic.available ? (
                <Badge className="absolute top-2 right-2 bg-green-500">Available Now</Badge>
              ) : (
                <Badge className="absolute top-2 right-2 bg-gray-500">Unavailable</Badge>
              )}
            </div>
            <CardContent className="p-6">
              <div className="flex items-center mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(mechanic.rating)
                          ? "fill-primary text-primary"
                          : "fill-muted text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground ml-2">
                  {mechanic.rating} ({mechanic.reviews} reviews)
                </span>
              </div>
              <h3 className="text-xl font-bold mb-1">{mechanic.name}</h3>
              <p className="text-muted-foreground mb-2">{mechanic.specialty}</p>
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{mechanic.distance} away</span>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium">Services:</p>
                <div className="flex flex-wrap gap-2">
                  {mechanic.services.map((service, index) => (
                    <Badge key={index} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => setSelectedMechanic(mechanic)} disabled={!mechanic.available}>
                View Profile
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedMechanic && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <Avatar className="h-16 w-16 mr-4">
                    <AvatarImage src={selectedMechanic.image} alt={selectedMechanic.name} />
                    <AvatarFallback>{selectedMechanic.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedMechanic.name}</h2>
                    <p className="text-muted-foreground">{selectedMechanic.specialty}</p>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(selectedMechanic.rating)
                                ? "fill-primary text-primary"
                                : "fill-muted text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">
                        {selectedMechanic.rating} ({selectedMechanic.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedMechanic(null)}>
                  <XCircle className="h-6 w-6" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">About</h3>
                  <p className="text-muted-foreground mb-6">{selectedMechanic.bio}</p>

                  <h3 className="text-lg font-semibold mb-4">Details</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <MapPin className="h-5 w-5 text-primary mr-2" />
                      <span>
                        {selectedMechanic.location} ({selectedMechanic.distance} away)
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Clock className="h-5 w-5 text-primary mr-2" />
                      <span>{selectedMechanic.experience} of experience</span>
                    </li>
                    <li className="flex items-center">
                      <Calendar className="h-5 w-5 text-primary mr-2" />
                      <span>
                        {selectedMechanic.available ? (
                          <span className="text-green-600 font-medium">Available now</span>
                        ) : (
                          <span className="text-gray-500">Currently unavailable</span>
                        )}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Phone className="h-5 w-5 text-primary mr-2" />
                      <span>(555) 123-4567</span>
                    </li>
                    <li className="flex items-center">
                      <Mail className="h-5 w-5 text-primary mr-2" />
                      <span>{selectedMechanic.name.toLowerCase().replace(" ", ".")}@roadready.com</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Services</h3>
                  <ul className="space-y-2 mb-6">
                    {selectedMechanic.services.map((service: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-lg font-semibold mb-4">Recent Reviews</h3>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Alex Johnson",
                        date: "2 weeks ago",
                        rating: 5,
                        comment: "Excellent service! Fixed my flat tire quickly and professionally.",
                      },
                      {
                        name: "Maria Garcia",
                        date: "1 month ago",
                        rating: 4,
                        comment: "Very knowledgeable and helpful. Arrived promptly and got my car started.",
                      },
                    ].map((review, index) => (
                      <div key={index} className="border-b pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{review.name}</span>
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
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button className="flex-1" disabled={!selectedMechanic.available}>
                  Book This Mechanic
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={`/mechanic/${selectedMechanic.id}`}>View Full Profile</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

