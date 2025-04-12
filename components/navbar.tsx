"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogIn,
  LogOut,
  Home,
  ShoppingBag,
  Wrench,
  Phone,
  MapPin,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { auth, logoutUser, getCurrentUser } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { cartItems } = useCart()

  // Check auth status on client side
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get user data
        const userData = await getCurrentUser()

        if (userData) {
          setIsLoggedIn(true)
          setUserName(userData.name)
          setUserRole(userData.role)
        } else {
          setIsLoggedIn(false)
          setUserName(null)
          setUserRole(null)
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        setIsLoggedIn(false)
      }
    }

    // Check auth state with Firebase
    if (typeof window !== "undefined") {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          checkAuth()
        } else {
          // Check if we have user data in localStorage as fallback
          const storedUser = localStorage.getItem("user")
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser)
              setIsLoggedIn(true)
              setUserName(userData.name)
              setUserRole(userData.role)
            } catch (error) {
              console.error("Error parsing stored user:", error)
              setIsLoggedIn(false)
              setUserName(null)
              setUserRole(null)
            }
          } else {
            setIsLoggedIn(false)
            setUserName(null)
            setUserRole(null)
          }
        }
      })

      return () => unsubscribe()
    }
  }, [])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const navLinks = [
    { href: "/", label: "Home", icon: <Home className="h-4 w-4 mr-2" /> },
    { href: "/find-mechanic", label: "Find Mechanic", icon: <MapPin className="h-4 w-4 mr-2" /> },
    { href: "/shop", label: "Shop", icon: <ShoppingBag className="h-4 w-4 mr-2" /> },
    { href: "/services", label: "Services", icon: <Wrench className="h-4 w-4 mr-2" /> },
    { href: "/contact", label: "Contact", icon: <Phone className="h-4 w-4 mr-2" /> },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm border-b" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-10 mr-2">
              <Image src="/placeholder.svg?height=40&width=40" alt="ORVBA Logo" fill className="object-contain" />
            </div>
            <span className="text-xl font-bold text-primary">ORVBA</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href
                  ? "text-primary after:block after:w-full after:h-0.5 after:bg-primary after:mt-1"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItems.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                  {cartItems.length}
                </Badge>
              )}
            </Button>
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <div className="relative h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">{userName?.charAt(0) || "U"}</span>
                    </div>
                    <span className="hidden lg:block text-sm font-medium">{userName || "User"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">{userName || "User"}</DropdownMenuLabel>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    {userRole?.charAt(0).toUpperCase() + userRole?.slice(1) || "User"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  {userRole === "mechanic" && (
                    <DropdownMenuItem asChild>
                      <Link href="/mechanic/dashboard" className="cursor-pointer">
                        Mechanic Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Link href="/cart" className="mr-2">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItems.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                  {cartItems.length}
                </Badge>
              )}
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="pt-4 border-t">
              {isLoggedIn ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">
                      {userName || "User"} - {userRole?.charAt(0).toUpperCase() + userRole?.slice(1) || "User"} Account
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/dashboard"
                      className="block text-sm text-muted-foreground hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block text-sm text-muted-foreground hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block text-sm text-muted-foreground hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    {userRole === "mechanic" && (
                      <Link
                        href="/mechanic/dashboard"
                        className="block text-sm text-muted-foreground hover:text-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Mechanic Dashboard
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start p-0 h-auto font-normal text-sm text-red-600 hover:text-red-700"
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              ) : (
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

