import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Car, Wrench, MapPin, Phone, ArrowRight, Star } from "lucide-react"

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Roadside Assistance Services</h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Fast, reliable help when you need it most. Our professional team is available 24/7 to get you back on the
              road.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-primary hover:bg-gray-100">
                <Link href="/services/book">Book a Service</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                <Link href="#services">Explore Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We offer a comprehensive range of roadside assistance services to help you in any emergency situation.
            </p>
          </div>

          <Tabs defaultValue="all" className="mb-12">
            <TabsList className="mb-8">
              <TabsTrigger value="all">All Services</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="specialty">Specialty</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Towing Service",
                    description: "Professional towing for all vehicle types to your preferred location or repair shop.",
                    icon: <Car className="h-10 w-10 text-primary" />,
                    category: "emergency",
                    price: "From $75",
                    image: "/placeholder.svg?height=200&width=300",
                  },
                  {
                    title: "Battery Jump Start",
                    description: "Quick battery jump start service to get your vehicle running again.",
                    icon: <Wrench className="h-10 w-10 text-primary" />,
                    category: "emergency",
                    price: "From $45",
                    image: "/placeholder.svg?height=200&width=300",
                  },
                  {
                    title: "Flat Tire Change",
                    description: "Fast tire change service using your spare or temporary tire.",
                    icon: <Wrench className="h-10 w-10 text-primary" />,
                    category: "emergency",
                    price: "From $50",
                    image: "/placeholder.svg?height=200&width=300",
                  },
                  {
                    title: "Fuel Delivery",
                    description: "Emergency fuel delivery when you run out of gas on the road.",
                    icon: <Car className="h-10 w-10 text-primary" />,
                    category: "emergency",
                    price: "From $40",
                    image: "/placeholder.svg?height=200&width=300",
                  },
                  {
                    title: "Lockout Assistance",
                    description: "Professional help when you're locked out of your vehicle.",
                    icon: <Wrench className="h-10 w-10 text-primary" />,
                    category: "emergency",
                    price: "From $55",
                    image: "/placeholder.svg?height=200&width=300",
                  },
                  {
                    title: "Mobile Mechanic",
                    description: "On-site mechanical repairs for common breakdown issues.",
                    icon: <Wrench className="h-10 w-10 text-primary" />,
                    category: "maintenance",
                    price: "From $85",
                    image: "/placeholder.svg?height=200&width=300",
                  },
                  {
                    title: "Battery Replacement",
                    description: "On-site battery testing and replacement service.",
                    icon: <Wrench className="h-10 w-10 text-primary" />,
                    category: "maintenance",
                    price: "From $120",
                    image: "/placeholder.svg?height=200&width=300",
                  },
                  {
                    title: "Winching Service",
                    description: "Recovery service for vehicles stuck in mud, snow, or off-road.",
                    icon: <Car className="h-10 w-10 text-primary" />,
                    category: "specialty",
                    price: "From $95",
                    image: "/placeholder.svg?height=200&width=300",
                  },
                  {
                    title: "Motorcycle Assistance",
                    description: "Specialized roadside assistance for motorcycles.",
                    icon: <Car className="h-10 w-10 text-primary" />,
                    category: "specialty",
                    price: "From $65",
                    image: "/placeholder.svg?height=200&width=300",
                  },
                ].map((service, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-4 right-4 bg-primary">{service.category}</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <div className="mr-3">{service.icon}</div>
                        {service.title}
                      </CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-bold text-primary">{service.price}</p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link href="/services/book">
                          Book Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="emergency">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Towing Service",
                    description: "Professional towing for all vehicle types to your preferred location or repair shop.",
                    icon: <Car className="h-10 w-10 text-primary" />,
                    category: "emergency",
                    price: "From $75",
                    image: "/placeholder.svg?height=200&width=300",
                  },
                  {
                    title: "Battery Jump Start",
                    description: "Quick battery jump start service to get your vehicle running again.",
                    icon: <Wrench className="h-10 w-10 text-primary" />,
                    category: "emergency",
                    price: "From $45",
                    image: "/placeholder.svg?height=200&width=300",
                  },
                  {
                    title: "Flat Tire Change",
                    description: "Fast tire change service using your spare or temporary tire.",
                    icon: <Wrench className="h-10 w-10 text-primary" />,
                    category: "emergency",
                    price: "From $50",
                    image: "/placeholder.svg?height=200&width=300",
                  },
                  {
                    title: "Fuel Delivery",
                    description: "Emergency fuel delivery when you run out of gas on the road.",
                    icon: <Car className="h-10 w-10 text-primary" />,
                    category: "emergency",
                    price: "From $40",
                    image: "/placeholder.svg?height=200&width=300",
                  },
                  {
                    title: "Lockout Assistance",
                    description: "Professional help when you're locked out of your vehicle.",
                    icon: <Wrench className="h-10 w-10 text-primary" />,
                    category: "emergency",
                    price: "From $55",
                    image: "/placeholder.svg?height=200&width=300",
                  },
                ].map((service, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-4 right-4 bg-primary">{service.category}</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <div className="mr-3">{service.icon}</div>
                        {service.title}
                      </CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-bold text-primary">{service.price}</p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link href="/services/book">
                          Book Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="maintenance">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Mobile Mechanic",
                    description: "On-site mechanical repairs for common breakdown issues.",
                    icon: <Wrench className="h-10 w-10 text-primary" />,
                    category: "maintenance",
                    price: "From $85",
                    image: "/placeholder.svg?height=200&width=300",
                  },
                  {
                    title: "Battery Replacement",
                    description: "On-site battery testing and replacement service.",
                    icon: <Wrench className="h-10 w-10 text-primary" />,
                    category: "maintenance",
                    price: "From $120",
                    image: "/placeholder.svg?height=200&width=300",
                  },
                ].map((service, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-4 right-4 bg-primary">{service.category}</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <div className="mr-3">{service.icon}</div>
                        {service.title}
                      </CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-bold text-primary">{service.price}</p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link href="/services/book">
                          Book Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="specialty">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Winching Service",
                    description: "Recovery service for vehicles stuck in mud, snow, or off-road.",
                    icon: <Car className="h-10 w-10 text-primary" />,
                    category: "specialty",
                    price: "From $95",
                    image: "/placeholder.svg?height=200&width=300",
                  },
                  {
                    title: "Motorcycle Assistance",
                    description: "Specialized roadside assistance for motorcycles.",
                    icon: <Car className="h-10 w-10 text-primary" />,
                    category: "specialty",
                    price: "From $65",
                    image: "/placeholder.svg?height=200&width=300",
                  },
                ].map((service, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-4 right-4 bg-primary">{service.category}</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <div className="mr-3">{service.icon}</div>
                        {service.title}
                      </CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-bold text-primary">{service.price}</p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link href="/services/book">
                          Book Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Getting roadside assistance is quick and easy with our simple process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Request Service",
                description: "Book a service through our website, mobile app, or by calling our 24/7 hotline.",
                icon: <Phone className="h-12 w-12 text-primary" />,
              },
              {
                step: 2,
                title: "Track Your Service",
                description: "Receive real-time updates on your technician's arrival time and location.",
                icon: <MapPin className="h-12 w-12 text-primary" />,
              },
              {
                step: 3,
                title: "Get Back on the Road",
                description: "Our professional technician will arrive promptly to resolve your issue.",
                icon: <Car className="h-12 w-12 text-primary" />,
              },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">{item.step}</span>
                </div>
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Customer Testimonials</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our customers have to say about our services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                location: "New York, NY",
                rating: 5,
                testimonial:
                  "I was stranded on the highway with a flat tire. ORVBA arrived within 20 minutes and had me back on the road quickly. Excellent service!",
                image: "/placeholder.svg?height=100&width=100",
              },
              {
                name: "Michael Rodriguez",
                location: "Chicago, IL",
                rating: 5,
                testimonial:
                  "The battery jump start service was fast and professional. The technician was knowledgeable and friendly. Highly recommend!",
                image: "/placeholder.svg?height=100&width=100",
              },
              {
                name: "Emily Chen",
                location: "Los Angeles, CA",
                rating: 4,
                testimonial:
                  "I needed a tow after an accident. The driver was prompt, careful with my vehicle, and very helpful during a stressful situation.",
                image: "/placeholder.svg?height=100&width=100",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">"{testimonial.testimonial}"</p>
                  <div className="flex items-center">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Need Roadside Assistance?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Our professional team is available 24/7 to help you get back on the road quickly and safely.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-primary hover:bg-gray-100">
              <Link href="/services/book">Book a Service Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
              <Link href="/contact">
                <Phone className="mr-2 h-4 w-4" />
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

