"use client"
import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/login-form"
import { BorrowerPipeline } from "@/components/borrower-pipeline"
import { BorrowerDetail } from "@/components/borrower-detail"
import { BrokerOverview } from "@/components/broker-overview"
import { Header } from "@/components/header"
import { NotificationsSidebar } from "@/components/notifications-sidebar"

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-row gap-2">
      <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce" />
      <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]" />
      <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]" />
    </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 overflow-x-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-full">
          <div className="lg:col-span-1">
            <BorrowerPipeline />
          </div>
          <div className="lg:col-span-1">
            <BorrowerDetail />
          </div>
          <div className="lg:col-span-1">
            <BrokerOverview />
          </div>
        </div>
      </main>
      <NotificationsSidebar />
    </div>
  )
}
