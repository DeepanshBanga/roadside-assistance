"use client"

import { CheckCircle, Clock, AlertCircle, Car, Wrench } from "lucide-react"

interface StatusUpdate {
  status: string
  timestamp: string
  notes?: string
}

interface ServiceStatusTimelineProps {
  statusUpdates: StatusUpdate[]
}

export default function ServiceStatusTimeline({ statusUpdates }: ServiceStatusTimelineProps) {
  // Sort updates by timestamp
  const sortedUpdates = [...statusUpdates].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  )

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "accepted":
        return <Car className="h-5 w-5 text-blue-500" />
      case "reached":
        return <Wrench className="h-5 w-5 text-purple-500" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Request Submitted"
      case "accepted":
        return "Mechanic Accepted"
      case "reached":
        return "Mechanic Arrived"
      case "completed":
        return "Service Completed"
      case "cancelled":
        return "Request Cancelled"
      default:
        return "Unknown Status"
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 border-yellow-200 text-yellow-800"
      case "accepted":
        return "bg-blue-100 border-blue-200 text-blue-800"
      case "reached":
        return "bg-purple-100 border-purple-200 text-purple-800"
      case "completed":
        return "bg-green-100 border-green-200 text-green-800"
      case "cancelled":
        return "bg-red-100 border-red-200 text-red-800"
      default:
        return "bg-gray-100 border-gray-200 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      {sortedUpdates.map((update, index) => (
        <div key={index} className="flex">
          <div className="mr-4 flex flex-col items-center">
            <div className={`rounded-full p-2 ${getStatusColor(update.status)}`}>{getStatusIcon(update.status)}</div>
            {index < sortedUpdates.length - 1 && <div className="w-0.5 bg-gray-200 h-full mt-2"></div>}
          </div>
          <div className="pt-1 pb-8 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <p className="font-medium">{getStatusText(update.status)}</p>
              <span className="text-sm text-muted-foreground">
                {new Date(update.timestamp).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            {update.notes && (
              <p className="text-sm text-muted-foreground mt-1 p-2 bg-gray-50 rounded-md border border-gray-100">
                {update.notes}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

