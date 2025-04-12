"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, AlertCircle, Phone, Mail, User, Lock, Info, Wrench } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { loginUser, registerUser } from "@/lib/firebase"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get("redirect") || "/"

  const [activeTab, setActiveTab] = useState("login")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState("")

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({ ...prev, [name]: value }))
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // Check password strength
    if (name === "password") {
      checkPasswordStrength(value)
    }
  }

  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(0)
      setPasswordFeedback("")
      return
    }

    let strength = 0
    let feedback = ""

    // Length check
    if (password.length >= 8) {
      strength += 1
    } else {
      feedback = "Password should be at least 8 characters"
    }

    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    if (strength === 1) feedback = "Password is weak"
    else if (strength === 2) feedback = "Password is fair"
    else if (strength === 3) feedback = "Password is good"
    else if (strength === 4) feedback = "Password is strong"

    setPasswordStrength(strength)
    setPasswordFeedback(feedback)
  }

  const validateLoginForm = () => {
    const newErrors: Record<string, string> = {}

    if (!loginData.email) newErrors.email = "Email is required"
    if (!loginData.password) newErrors.password = "Password is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateRegisterForm = () => {
    const newErrors: Record<string, string> = {}

    if (!registerData.name) newErrors.name = "Name is required"
    if (!registerData.email) newErrors.email = "Email is required"
    if (!/^\S+@\S+\.\S+$/.test(registerData.email)) newErrors.email = "Please enter a valid email address"
    if (!registerData.phone) newErrors.phone = "Phone number is required"
    if (!/^[6-9]\d{9}$/.test(registerData.phone)) newErrors.phone = "Please enter a valid 10-digit Indian mobile number"
    if (!registerData.password) newErrors.password = "Password is required"
    if (registerData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (!registerData.confirmPassword) newErrors.confirmPassword = "Please confirm your password"
    if (registerData.password !== registerData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateLoginForm()) return

    try {
      setIsSubmitting(true)

      const result = await loginUser(loginData.email, loginData.password)

      if (result.error) {
        throw new Error(result.error)
      }

      toast({
        title: "Login Successful",
        description: "You have been logged in successfully.",
      })

      // Redirect based on user role
      if (result.userData?.role === "mechanic") {
        router.push("/mechanic/dashboard")
      } else {
        router.push(redirectPath)
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateRegisterForm()) return

    try {
      setIsSubmitting(true)

      const result = await registerUser(
        registerData.email,
        registerData.password,
        registerData.name,
        registerData.phone,
        registerData.role,
      )

      if (result.error) {
        throw new Error(result.error)
      }

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully.",
      })

      // Redirect based on user role
      if (registerData.role === "mechanic") {
        router.push("/mechanic/profile/setup")
      } else {
        router.push(redirectPath)
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-12 max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to ORVBA</h1>
        <p className="text-muted-foreground">India's most reliable roadside assistance service</p>
      </div>

      <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className="pl-10"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className="pl-10"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Create an Account</CardTitle>
              <CardDescription>Register to access roadside assistance services in India</CardDescription>
            </CardHeader>
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your Full Name"
                      value={registerData.name}
                      onChange={handleRegisterChange}
                      className="pl-10"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      className="pl-10"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={registerData.phone}
                      onChange={handleRegisterChange}
                      className="pl-10"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-password"
                      name="password"
                      type="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      className="pl-10"
                    />
                  </div>
                  {passwordStrength > 0 && (
                    <div className="mt-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              passwordStrength === 1
                                ? "bg-red-500"
                                : passwordStrength === 2
                                  ? "bg-yellow-500"
                                  : passwordStrength === 3
                                    ? "bg-green-500"
                                    : "bg-green-600"
                            }`}
                            style={{ width: `${passwordStrength * 25}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground">{passwordFeedback}</span>
                      </div>
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      className="pl-10"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <RadioGroup
                    value={registerData.role}
                    onValueChange={(value) => setRegisterData((prev) => ({ ...prev, role: value }))}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="user" id="user" />
                      <Label htmlFor="user" className="flex-1 cursor-pointer">
                        <div className="font-medium">Vehicle Owner</div>
                        <div className="text-sm text-muted-foreground">I need roadside assistance</div>
                      </Label>
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="mechanic" id="mechanic" />
                      <Label htmlFor="mechanic" className="flex-1 cursor-pointer">
                        <div className="font-medium">Mechanic</div>
                        <div className="text-sm text-muted-foreground">I provide roadside assistance</div>
                      </Label>
                      <Wrench className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </RadioGroup>
                </div>

                <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                  <div className="flex">
                    <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                    <p className="text-sm text-blue-700">
                      By registering, you agree to our{" "}
                      <Link href="/terms" className="text-blue-600 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

