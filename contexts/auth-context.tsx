"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type User, getAuthFromStorage, saveAuthToStorage, clearAuthFromStorage, testCredentials } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  useEffect(() => {
    // Check for existing auth on mount
    const storedUser = getAuthFromStorage()
    if (storedUser) {
      setUser(storedUser)
    } else {
      // Auto-login as broker for demo purposes
      const brokerUser = testCredentials.broker.user
      setUser(brokerUser)
      saveAuthToStorage(brokerUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const credentials = Object.values(testCredentials).find(
      (cred) => cred.email === email && cred.password === password,
    )

    if (credentials) {
      setUser(credentials.user)
      saveAuthToStorage(credentials.user)
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    clearAuthFromStorage()
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
