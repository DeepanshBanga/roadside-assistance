import { initializeApp, getApps, getApp } from "firebase/app"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth"
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  GeoPoint,
} from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getDatabase, ref, set, onValue, push } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyCf2CEbqibrZdCsrGXFp6Dm1-PDi7tt2xk",
  authDomain: "on-road-vehicle-breakdow-3a5be.firebaseapp.com",
  projectId: "on-road-vehicle-breakdow-3a5be",
  storageBucket: "on-road-vehicle-breakdow-3a5be.firebasestorage.app",
  messagingSenderId: "67858163541",
  appId: "1:67858163541:web:7392a35d279aee76f5b1dc",
  measurementId: "G-2T0LG4JEH1",
  databaseURL: "https://on-road-vehicle-breakdow-3a5be.firebaseio.com",
}

// Initialize Firebase
let app
let auth
let db
let storage
let rtdb // Realtime database for chat

// Only initialize Firebase if we're in the browser and it hasn't been initialized yet
if (typeof window !== "undefined") {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
    rtdb = getDatabase(app)
    console.log("Firebase initialized successfully")
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

// Generate JWT token for authentication
export const generateToken = async (user) => {
  try {
    const idToken = await user.getIdToken()
    return idToken
  } catch (error) {
    console.error("Error generating token:", error)
    return null
  }
}

// Authentication functions
export const registerUser = async (
  email: string,
  password: string,
  name: string,
  phone: string,
  role = "user",
  location = null,
) => {
  try {
    if (!auth) throw new Error("Firebase Auth not initialized")

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update profile with display name
    await updateProfile(user, {
      displayName: name,
    })

    // Generate JWT token
    const token = await generateToken(user)

    // Store additional user data in Firestore
    try {
      const userData = {
        uid: user.uid,
        email,
        name,
        phone,
        role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        token,
      }

      // Add location data for mechanics
      if (role === "mechanic" && location) {
        userData.location = new GeoPoint(location.latitude, location.longitude)
        userData.address = location.address
        userData.services = location.services || []
        userData.availability = true
        userData.ratings = { average: 0, count: 0 }
      }

      await setDoc(doc(db, "users", user.uid), userData)
    } catch (firestoreError) {
      console.error("Error storing user data in Firestore:", firestoreError)
    }

    // Store user data in localStorage as fallback
    localStorage.setItem(
      "user",
      JSON.stringify({
        uid: user.uid,
        email,
        name,
        phone,
        role,
        token,
      }),
    )

    return { user, token }
  } catch (error: any) {
    console.error("Registration error:", error)
    return { error: error.message }
  }
}

export const loginUser = async (email: string, password: string) => {
  try {
    if (!auth) throw new Error("Firebase Auth not initialized")

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Generate JWT token
    const token = await generateToken(user)

    // Get user data from Firestore
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid))
      const userData = userDoc.data()

      // Update token in Firestore
      await updateDoc(doc(db, "users", user.uid), {
        token,
        lastLogin: serverTimestamp(),
      })

      // Store user data in localStorage as fallback
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          phone: userData?.phone || "",
          role: userData?.role || "user",
          token,
        }),
      )

      return { user, userData, token }
    } catch (firestoreError) {
      console.error("Firestore error:", firestoreError)

      // If Firestore fails, still allow login with basic user info
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          role: "user",
          token,
        }),
      )

      return { user, userData: { role: "user" }, token }
    }
  } catch (error: any) {
    console.error("Login error:", error)
    return { error: error.message }
  }
}

export const logoutUser = async () => {
  try {
    if (!auth) throw new Error("Firebase Auth not initialized")

    await signOut(auth)
    localStorage.removeItem("user")
    return { success: true }
  } catch (error: any) {
    console.error("Logout error:", error)
    return { error: error.message }
  }
}

export const getCurrentUser = async () => {
  try {
    // First check if we have a current user in auth
    if (!auth) {
      console.warn("Firebase Auth not initialized, using localStorage fallback")
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        return JSON.parse(storedUser)
      }
      return null
    }

    const user = auth.currentUser
    if (!user) {
      // Try to get from localStorage as fallback
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        return JSON.parse(storedUser)
      }
      return null
    }

    // Try to get from Firestore
    try {
      if (!db) throw new Error("Firestore not initialized")

      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()

        // Update localStorage with latest data
        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            phone: userData.phone || "",
            role: userData.role,
            token: userData.token,
          }),
        )

        return userData
      } else {
        // Fallback to basic user info if Firestore document doesn't exist
        const basicUserData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          role: "user",
        }

        // Try to create the user document
        try {
          await setDoc(doc(db, "users", user.uid), {
            ...basicUserData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
        } catch (createError) {
          console.error("Error creating missing user document:", createError)
        }

        localStorage.setItem("user", JSON.stringify(basicUserData))
        return basicUserData
      }
    } catch (firestoreError) {
      console.error("Error getting user data from Firestore:", firestoreError)

      // Fallback to localStorage
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        return JSON.parse(storedUser)
      }

      // Last resort fallback to basic auth user info
      const basicUserData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        role: "user",
      }

      localStorage.setItem("user", JSON.stringify(basicUserData))
      return basicUserData
    }
  } catch (error) {
    console.error("Error getting current user:", error)

    // Try to get from localStorage as final fallback
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      return JSON.parse(storedUser)
    }

    return null
  }
}

// Find nearby mechanics
export const findNearbyMechanics = async (location, radius = 10) => {
  try {
    if (!db) throw new Error("Firestore not initialized")

    // In a real app, you would use Firestore GeoQuery or a cloud function
    // For simplicity, we'll fetch all mechanics and filter by distance
    const mechanicsRef = collection(db, "users")
    const q = query(mechanicsRef, where("role", "==", "mechanic"))
    const querySnapshot = await getDocs(q)

    const mechanics = []
    querySnapshot.forEach((doc) => {
      const mechanicData = doc.data()

      // If mechanic has location data
      if (mechanicData.location) {
        // Calculate distance (simplified version)
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          mechanicData.location.latitude,
          mechanicData.location.longitude,
        )

        // If within radius
        if (distance <= radius) {
          mechanics.push({
            id: doc.id,
            ...mechanicData,
            distance: distance.toFixed(2),
          })
        }
      }
    })

    // Sort by distance
    return mechanics.sort((a, b) => a.distance - b.distance)
  } catch (error) {
    console.error("Error finding nearby mechanics:", error)
    return []
  }
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in km
  return distance
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

// Service request functions
export const createServiceRequest = async (data) => {
  try {
    if (!db) throw new Error("Firestore not initialized")

    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    const requestData = {
      userId: user.uid,
      userName: user.name,
      userPhone: user.phone,
      mechanicId: data.mechanicId,
      location: new GeoPoint(data.location.latitude, data.location.longitude),
      address: data.address,
      vehicleDetails: data.vehicleDetails,
      serviceType: data.serviceType,
      description: data.description,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "serviceRequests"), requestData)

    // Send notification to mechanic (in a real app, you would use FCM)
    // For now, we'll just add it to the notifications collection
    await addDoc(collection(db, "notifications"), {
      userId: data.mechanicId,
      title: "New Service Request",
      message: `You have a new service request from ${user.name}`,
      type: "service_request",
      requestId: docRef.id,
      read: false,
      createdAt: serverTimestamp(),
    })

    return { success: true, requestId: docRef.id }
  } catch (error) {
    console.error("Error creating service request:", error)
    return { error: error.message }
  }
}

export const updateServiceRequestStatus = async (requestId, status, notes = "") => {
  try {
    if (!db) throw new Error("Firestore not initialized")

    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    // Get the request to check if this user is the mechanic
    const requestDoc = await getDoc(doc(db, "serviceRequests", requestId))
    if (!requestDoc.exists()) throw new Error("Service request not found")

    const requestData = requestDoc.data()

    // Only the assigned mechanic can update the status
    if (requestData.mechanicId !== user.uid && user.role !== "admin") {
      throw new Error("You are not authorized to update this request")
    }

    await updateDoc(doc(db, "serviceRequests", requestId), {
      status,
      notes: notes || requestData.notes || "",
      updatedAt: serverTimestamp(),
    })

    // Send notification to user
    await addDoc(collection(db, "notifications"), {
      userId: requestData.userId,
      title: "Service Request Update",
      message: `Your service request status has been updated to: ${status}`,
      type: "status_update",
      requestId,
      read: false,
      createdAt: serverTimestamp(),
    })

    return { success: true }
  } catch (error) {
    console.error("Error updating service request:", error)
    return { error: error.message }
  }
}

export const getUserServiceRequests = async () => {
  try {
    if (!db) throw new Error("Firestore not initialized")

    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    const requestsRef = collection(db, "serviceRequests")
    const q = query(requestsRef, where("userId", "==", user.uid))
    const querySnapshot = await getDocs(q)

    const requests = []
    querySnapshot.forEach((doc) => {
      requests.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return requests.sort((a, b) => b.createdAt - a.createdAt)
  } catch (error) {
    console.error("Error getting user service requests:", error)
    return []
  }
}

export const getMechanicServiceRequests = async () => {
  try {
    if (!db) throw new Error("Firestore not initialized")

    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    if (user.role !== "mechanic") throw new Error("Only mechanics can access this function")

    const requestsRef = collection(db, "serviceRequests")
    const q = query(requestsRef, where("mechanicId", "==", user.uid))
    const querySnapshot = await getDocs(q)

    const requests = []
    querySnapshot.forEach((doc) => {
      requests.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return requests.sort((a, b) => b.createdAt - a.createdAt)
  } catch (error) {
    console.error("Error getting mechanic service requests:", error)
    return []
  }
}

// Chat functions
export const sendMessage = async (receiverId, message) => {
  try {
    if (!rtdb) throw new Error("Firebase Realtime Database not initialized")

    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    // Create a chat room ID (combination of both user IDs, alphabetically sorted)
    const chatRoomId = [user.uid, receiverId].sort().join("_")

    // Create a reference to the chat room
    const chatRef = ref(rtdb, `chats/${chatRoomId}/messages`)

    // Push a new message
    const newMessageRef = push(chatRef)
    await set(newMessageRef, {
      senderId: user.uid,
      senderName: user.name,
      message,
      timestamp: Date.now(),
    })

    // Update chat metadata
    await set(ref(rtdb, `chats/${chatRoomId}/metadata`), {
      lastMessage: message,
      lastMessageTime: Date.now(),
      participants: {
        [user.uid]: true,
        [receiverId]: true,
      },
    })

    return { success: true, messageId: newMessageRef.key }
  } catch (error) {
    console.error("Error sending message:", error)
    return { error: error.message }
  }
}

export const getMessages = (receiverId, callback) => {
  try {
    if (!rtdb) throw new Error("Firebase Realtime Database not initialized")

    const user = getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    // Create a chat room ID (combination of both user IDs, alphabetically sorted)
    const chatRoomId = [user.uid, receiverId].sort().join("_")

    // Create a reference to the chat room
    const chatRef = ref(rtdb, `chats/${chatRoomId}/messages`)

    // Listen for new messages
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const messages = []
      snapshot.forEach((childSnapshot) => {
        messages.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        })
      })

      callback(messages.sort((a, b) => a.timestamp - b.timestamp))
    })

    return unsubscribe
  } catch (error) {
    console.error("Error getting messages:", error)
    callback([])
    return () => {}
  }
}

// Ratings and reviews
export const rateMechanic = async (mechanicId, rating, review = "") => {
  try {
    if (!db) throw new Error("Firestore not initialized")

    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    // Add the review
    await addDoc(collection(db, "reviews"), {
      userId: user.uid,
      userName: user.name,
      mechanicId,
      rating,
      review,
      createdAt: serverTimestamp(),
    })

    // Update mechanic's average rating
    const mechanicDoc = await getDoc(doc(db, "users", mechanicId))
    if (!mechanicDoc.exists()) throw new Error("Mechanic not found")

    const mechanicData = mechanicDoc.data()
    const currentRatings = mechanicData.ratings || { average: 0, count: 0 }

    const newCount = currentRatings.count + 1
    const newAverage = (currentRatings.average * currentRatings.count + rating) / newCount

    await updateDoc(doc(db, "users", mechanicId), {
      "ratings.average": newAverage,
      "ratings.count": newCount,
    })

    return { success: true }
  } catch (error) {
    console.error("Error rating mechanic:", error)
    return { error: error.message }
  }
}

export const getMechanicReviews = async (mechanicId) => {
  try {
    if (!db) throw new Error("Firestore not initialized")

    const reviewsRef = collection(db, "reviews")
    const q = query(reviewsRef, where("mechanicId", "==", mechanicId))
    const querySnapshot = await getDocs(q)

    const reviews = []
    querySnapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return reviews.sort((a, b) => b.createdAt - a.createdAt)
  } catch (error) {
    console.error("Error getting mechanic reviews:", error)
    return []
  }
}

// Payment integration (Razorpay)
export const createPaymentOrder = async (amount, currency = "INR", receipt = "") => {
  try {
    // In a real app, this would be a server-side API call
    // For demo purposes, we'll simulate it
    const orderData = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1,
    }

    // Simulate API response
    return {
      id: `order_${Date.now()}`,
      amount: orderData.amount,
      currency,
      receipt: orderData.receipt,
    }
  } catch (error) {
    console.error("Error creating payment order:", error)
    return { error: error.message }
  }
}

export const verifyPayment = async (paymentId, orderId, signature) => {
  try {
    // In a real app, this would be a server-side API call to verify the payment
    // For demo purposes, we'll simulate it
    return { success: true }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return { error: error.message }
  }
}

// Offline data sync
export const syncOfflineData = async () => {
  try {
    // Implement logic to sync data from local storage to Firebase
    // This is a placeholder, replace with actual implementation
    console.log("Syncing offline data with Firebase...")
    return { success: true }
  } catch (error) {
    console.error("Error syncing offline data:", error)
    return { success: false, error: error.message }
  }
}

// Checkout processing
export const processCheckout = async (orderData) => {
  try {
    // Implement logic to process checkout and create order in Firebase
    // This is a placeholder, replace with actual implementation
    console.log("Processing checkout with order data:", orderData)
    return { success: true }
  } catch (error) {
    console.error("Error processing checkout:", error)
    return { success: false, error: error.message }
  }
}

// Contact form submission
export const submitContactForm = async (formData) => {
  try {
    // Implement logic to submit contact form data to Firebase
    // This is a placeholder, replace with actual implementation
    console.log("Submitting contact form data:", formData)
    return { success: true, offline: false }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return { success: false, error: error.message }
  }
}

// Get user service history
export const getUserServiceHistory = async () => {
  try {
    // Implement logic to retrieve user service history from Firebase
    // This is a placeholder, replace with actual implementation
    console.log("Getting user service history...")
    return []
  } catch (error) {
    console.error("Error getting user service history:", error)
    return []
  }
}

// Book service
export const bookService = async (formData) => {
  try {
    // Implement logic to book a service and store in Firebase
    // This is a placeholder, replace with actual implementation
    console.log("Booking service with data:", formData)
    return { success: true, offline: false }
  } catch (error) {
    console.error("Error booking service:", error)
    return { success: false, error: error.message }
  }
}

export { auth, db, storage, rtdb }

