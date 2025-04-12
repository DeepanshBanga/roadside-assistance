import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container py-12 md:py-16">
        {/* Newsletter Section */}
        <div className="bg-primary/10 rounded-xl p-6 md:p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-blue-100">Subscribe to our newsletter for the latest updates and offers.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button className="bg-white text-primary hover:bg-gray-100">
                Subscribe <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <div className="relative h-10 w-10 mr-2">
                <Image src="/placeholder.svg?height=40&width=40" alt="ORVBA Logo" fill className="object-contain" />
              </div>
              <h3 className="text-xl font-bold text-white">ORVBA</h3>
            </div>
            <p className="text-gray-400 mb-4">
              On-Road Vehicle Breakdown Assistance. Your trusted partner for roadside assistance and automotive products
              across India. Available 24/7 to help you get back on the road.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={20} />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/find-mechanic"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Find Mechanic
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/services/towing"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Towing Service
                </Link>
              </li>
              <li>
                <Link
                  href="/services/battery"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Battery Replacement
                </Link>
              </li>
              <li>
                <Link
                  href="/services/tire"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Tire Change
                </Link>
              </li>
              <li>
                <Link
                  href="/services/fuel"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Fuel Delivery
                </Link>
              </li>
              <li>
                <Link
                  href="/services/lockout"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Lockout Assistance
                </Link>
              </li>
              <li>
                <Link
                  href="/services/repairs"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <ArrowRight className="h-3 w-3 mr-2" />
                  On-Site Repairs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-primary shrink-0 mt-0.5" />
                <span className="text-gray-400">123 Roadside Avenue, New Delhi, 110001, India</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-primary shrink-0" />
                <span className="text-gray-400">+91 1800-123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary shrink-0" />
                <span className="text-gray-400">help@orvba.com</span>
              </li>
            </ul>
            <div className="mt-6 bg-gray-800 p-4 rounded-lg">
              <p className="text-white font-bold">24/7 Emergency Support</p>
              <p className="text-gray-400 text-sm">Call our emergency hotline for immediate assistance</p>
              <p className="text-primary font-bold mt-1">+91 1800-123-4567</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} On-Road Vehicle Breakdown Assistance. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link href="/terms" className="text-sm text-gray-500 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-sm text-gray-500 hover:text-white transition-colors">
              Cookie Policy
            </Link>
            <Link href="/sitemap" className="text-sm text-gray-500 hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

