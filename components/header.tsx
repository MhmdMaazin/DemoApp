"use client"

import type React from "react"

import { Search, HelpCircle, Bell, Plus, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner"
import { ThemeToggle } from "@/components/theme-toggle"
import { useApp } from "@/contexts/app-context"
import { useAuth } from "@/contexts/auth-context"
import { AddBorrowerForm } from "@/components/add-borrower-form"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddBorrower, setShowAddBorrower] = useState(false)
  const { unreadCount, showNotifications, setShowNotifications, addNotification, searchBorrowers } = useApp()
  const { user, logout } = useAuth()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    await searchBorrowers(searchQuery)
  }

  const handleHelp = () => {
    console.log(`Help button clicked`)
    const title = "Help & Support"
    const description = "User guide, tutorials, live chat, and phone support available"
    addNotification(title, description)
    toast.info(title, {
      description,
      duration: 4000,
    })
  }

  const handleNotifications = () => {
    console.log(`Notifications button clicked`)
    setShowNotifications(!showNotifications)
  }

  const handleAddBorrower = () => {
    console.log(`Add borrower button clicked`)
    setShowAddBorrower(true)
  }

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 sm:gap-4">
              <h1 className="text-2xl font-bold text-foreground">DemoApp</h1>
              {user?.role === "admin" ? (
                <span className="text-sm text-muted-foreground px-2 py-1 rounded-md bg-muted">
                  Admin View
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-end flex-1 min-w-0">
              {/* Desktop search */}
              <form onSubmit={handleSearch} className="relative min-w-0 flex-1 sm:flex-none hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              {/* Mobile search via bottom sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Search" className="sm:hidden">
                    <Search className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="w-full p-4">
                  <SheetHeader>
                    <SheetTitle>Search borrowers</SheetTitle>
                  </SheetHeader>
                  <form onSubmit={handleSearch} className="relative mt-3">
                    {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" /> */}
                    <Input
                      autoFocus
                      placeholder="Type a name..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="flex justify-end mt-3">
                      <Button type="submit" size="sm">
                        Search
                      </Button>
                    </div>
                  </form>
                </SheetContent>
              </Sheet>

              {user?.role === "admin" && (
                <Button onClick={handleAddBorrower} size="sm" className="whitespace-nowrap">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Borrower
                </Button>
              )}

              <ThemeToggle />

              <Button variant="ghost" size="icon" onClick={handleHelp} className="shrink-0">
                <HelpCircle className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" onClick={handleNotifications} className="relative shrink-0">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>

              <Button variant="ghost" size="icon" onClick={handleLogout} className="shrink-0">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {showAddBorrower && <AddBorrowerForm onClose={() => setShowAddBorrower(false)} />}
    </>
  )
}
