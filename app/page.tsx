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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
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
