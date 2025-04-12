import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Car,
  Wrench,
  Battery,
  Fuel,
  Key,
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative hero-gradient text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="container py-16 md:py-24 lg:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <Badge className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-none px-3 py-1">
                #1 Roadside Assistance in India
              </Badge>
              <h1 className="heading-xl leading-tight">
                24/7 Roadside Assistance <span className="text-blue-200">You Can Trust</span>
              </h1>
              <p className="text-lg md:text-xl opacity-90 max-w-md">
                Fast, reliable help when you need it most. Our network of certified mechanics is ready to assist you
                anywhere in India.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-white text-primary hover:bg-gray-100">
                  <Link href="/find-mechanic">Find Nearby Mechanic</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                  <Link href="/services">Our Services</Link>
                </Button>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>Pan-India Coverage</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>30 Min Response</span>
                </div>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/placeholder.svg?height=500&width=600"
                  alt="Roadside assistance"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg max-w-xs">
                <div className="flex items-center mb-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold">Quick Response</p>
                    <p className="text-sm text-muted-foreground">Average arrival time: 30 mins</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted by section */}
        <div className="bg-blue-900/80 backdrop-blur-sm py-6">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-white/80 font-medium mb-4 md:mb-0">
                Trusted by thousands of vehicle owners across India
              </p>
              <div className="flex items-center space-x-8">
                <div className="text-white/80">
                  <p className="text-2xl font-bold">4.8/5</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < 5 ? "fill-yellow-400 text-yellow-400" : "fill-gray-400 text-gray-400"}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-white/80">
                  <p className="text-2xl font-bold">15K+</p>
                  <p className="text-sm">Happy Customers</p>
                </div>
                <div className="text-white/80">
                  <p className="text-2xl font-bold">5K+</p>
                  <p className="text-sm">Certified Mechanics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4">Simple Process</Badge>
            <h2 className="heading-lg mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Getting roadside assistance is quick and easy with our simple 3-step process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Find a Mechanic",
                description: "Use our app to find nearby mechanics based on your current location.",
                icon: <MapPin className="h-8 w-8 text-primary" />,
              },
              {
                step: 2,
                title: "Request Service",
                description: "Send a service request to the mechanic of your choice with details of your issue.",
                icon: <Clock className="h-8 w-8 text-primary" />,
              },
              {
                step: 3,
                title: "Track & Pay",
                description: "Track the mechanic's arrival in real-time and pay securely through the app.",
                icon: <ShieldCheck className="h-8 w-8 text-primary" />,
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm card-hover"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">{feature.step}</span>
                </div>
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4">Our Services</Badge>
            <h2 className="heading-lg mb-4">Roadside Assistance Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We offer a comprehensive range of roadside assistance services to get you back on the road quickly and
              safely.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Car className="h-10 w-10 text-primary" />,
                title: "Towing Service",
                description: "Professional towing service for all vehicle types to your preferred location.",
                link: "/services/towing",
              },
              {
                icon: <Battery className="h-10 w-10 text-primary" />,
                title: "Battery Jump-Start",
                description: "Quick battery jump-start and replacement services to get you moving again.",
                link: "/services/battery",
              },
              {
                icon: <Wrench className="h-10 w-10 text-primary" />,
                title: "Tire Change",
                description: "Fast tire change service with professional equipment and expertise.",
                link: "/services/tire",
              },
              {
                icon: <Fuel className="h-10 w-10 text-primary" />,
                title: "Fuel Delivery",
                description: "Emergency fuel delivery when you're stranded with an empty tank.",
                link: "/services/fuel",
              },
              {
                icon: <Key className="h-10 w-10 text-primary" />,
                title: "Lockout Assistance",
                description: "Professional lockout assistance when you're locked out of your vehicle.",
                link: "/services/lockout",
              },
              {
                icon: <Wrench className="h-10 w-10 text-primary" />,
                title: "On-Site Repairs",
                description: "Minor mechanical repairs performed on-site by certified mechanics.",
                link: "/services/repairs",
              },
            ].map((service, index) => (
              <Card key={index} className="border-none shadow-sm card-hover">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-primary/10 rounded-full">{service.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <Link
                    href={service.link}
                    className="text-primary font-medium flex items-center hover:underline mt-auto"
                  >
                    Learn More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button size="lg" asChild>
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4">Testimonials</Badge>
            <h2 className="heading-lg mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our customers have to say about our services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Rahul Sharma",
                location: "Delhi, India",
                quote:
                  "I was stranded on the highway with a flat tire. The mechanic arrived within 20 minutes and had me back on the road in no time. Excellent service!",
                rating: 5,
                image: "/placeholder.svg?height=100&width=100",
              },
              {
                name: "Priya Patel",
                location: "Mumbai, India",
                quote:
                  "I was stranded with a dead battery late at night. The technician was professional, friendly, and got my car started quickly. I highly recommend their service.",
                rating: 5,
                image: "/placeholder.svg?height=100&width=100",
              },
              {
                name: "Amit Singh",
                location: "Bangalore, India",
                quote:
                  "I've been using this service for 2 years now, and they've never let me down. Fast response times and professional service every time. Worth every rupee!",
                rating: 4,
                image: "/placeholder.svg?height=100&width=100",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-none shadow-sm card-hover">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="italic mb-6 text-muted-foreground">"{testimonial.quote}"</p>
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
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="section-padding bg-primary text-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-white/20 text-white hover:bg-white/30 border-none mb-4">Mobile App</Badge>
              <h2 className="heading-lg mb-4">Download Our Mobile App</h2>
              <p className="text-lg opacity-90 mb-6">
                Get roadside assistance at your fingertips. Download our mobile app for faster service and real-time
                tracking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-white text-primary hover:bg-gray-100">
                  <Link href="#">
                    <Image
                      src="/placeholder.svg?height=24&width=24"
                      alt="App Store"
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                    App Store
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                  <Link href="#">
                    <Image
                      src="/placeholder.svg?height=24&width=24"
                      alt="Play Store"
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                    Play Store
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-[500px] w-full">
                <Image src="/placeholder.svg?height=500&width=300" alt="Mobile App" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4">Get Started</Badge>
              <h2 className="heading-lg mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of satisfied customers who trust us for their roadside assistance needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/find-mechanic">Find a Mechanic</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

