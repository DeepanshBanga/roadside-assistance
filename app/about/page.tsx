import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Clock, Users, Award, ThumbsUp, MapPin } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About ORVBA</h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              On-Road Vehicle Breakdown Assistance - Your trusted partner for roadside assistance and automotive
              solutions since 2010.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                ORVBA was founded in 2010 with a simple mission: to provide reliable, fast, and professional roadside
                assistance to stranded motorists. What began as a small local operation with just two service vehicles
                has grown into a nationwide network of certified professionals ready to help drivers 24/7.
              </p>
              <p className="text-muted-foreground mb-4">
                Our founder, Michael Thompson, experienced firsthand the stress and uncertainty of being stranded on a
                remote highway late at night. That experience inspired him to create a service that not only provides
                technical assistance but also peace of mind to drivers everywhere.
              </p>
              <p className="text-muted-foreground">
                Today, ORVBA serves thousands of customers annually, with a commitment to continuous improvement and
                customer satisfaction. We've expanded our services to include not only emergency roadside assistance but
                also preventative products and educational resources to help drivers stay safe on the road.
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image src="/placeholder.svg?height=400&width=600" alt="ORVBA team" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              At ORVBA, our core values guide everything we do, from how we respond to emergency calls to how we develop
              our products and services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="h-12 w-12 text-primary" />,
                title: "Reliability",
                description:
                  "We're there when you need us most, with a commitment to prompt service and dependable solutions.",
              },
              {
                icon: <Clock className="h-12 w-12 text-primary" />,
                title: "Responsiveness",
                description:
                  "We understand that every minute counts in an emergency, so we prioritize quick response times and efficient service.",
              },
              {
                icon: <Users className="h-12 w-12 text-primary" />,
                title: "Respect",
                description:
                  "We treat every customer with dignity and respect, regardless of the situation or circumstances.",
              },
              {
                icon: <Award className="h-12 w-12 text-primary" />,
                title: "Quality",
                description:
                  "We maintain high standards in our services, products, and customer interactions, never compromising on quality.",
              },
              {
                icon: <ThumbsUp className="h-12 w-12 text-primary" />,
                title: "Integrity",
                description:
                  "We operate with honesty and transparency, building trust with our customers through ethical business practices.",
              },
              {
                icon: <MapPin className="h-12 w-12 text-primary" />,
                title: "Community",
                description:
                  "We're committed to the communities we serve, supporting local initiatives and contributing to road safety awareness.",
              },
            ].map((value, index) => (
              <Card key={index} className="border-none shadow-md">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-blue-50 rounded-full">{value.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Leadership Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the dedicated professionals who lead ORVBA with passion, expertise, and a commitment to excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Michael Thompson",
                role: "Founder & CEO",
                image: "/placeholder.svg?height=300&width=300",
                bio: "With over 20 years in the automotive industry, Michael founded ORVBA to transform roadside assistance services.",
              },
              {
                name: "Sarah Johnson",
                role: "Chief Operations Officer",
                image: "/placeholder.svg?height=300&width=300",
                bio: "Sarah oversees our nationwide network of service providers, ensuring consistent quality and rapid response times.",
              },
              {
                name: "David Chen",
                role: "Chief Technology Officer",
                image: "/placeholder.svg?height=300&width=300",
                bio: "David leads our technology initiatives, developing innovative solutions to streamline our services and enhance customer experience.",
              },
              {
                name: "Emily Rodriguez",
                role: "Customer Experience Director",
                image: "/placeholder.svg?height=300&width=300",
                bio: "Emily ensures that every customer interaction exceeds expectations, from emergency calls to follow-up support.",
              },
            ].map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-primary text-sm mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Join the ORVBA Family</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Experience the peace of mind that comes with knowing help is just a call away, whenever and wherever you
            need it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-primary hover:bg-gray-100">
              <Link href="/services">Explore Our Services</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

