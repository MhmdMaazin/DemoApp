import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export type LoginFormData = z.infer<typeof loginSchema>

export interface User {
  id: string
  email: string
  role: "broker" | "admin"
  name: string
}

export const AUTH_STORAGE_KEY = "demo_app_auth"

export const testCredentials = {
  broker: {
    email: "broker@gmail.com",
    password: "B123456",
    user: {
      id: "broker-1",
      email: "broker@gmail.com",
      role: "broker" as const,
      name: "Robert Turner",
    },
  },
  admin: {
    email: "admin@gmail.com",
    password: "A123456",
    user: {
      id: "admin-1",
      email: "admin@gmail.com",
      role: "admin" as const,
      name: "Admin User",
    },
  },
}

export const authenticateUser = (email: string, password: string): User | null => {
  const credentials = Object.values(testCredentials).find((cred) => cred.email === email && cred.password === password)
  return credentials ? credentials.user : null
}

export const saveAuthToStorage = (user: User) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
}

export const getAuthFromStorage = (): User | null => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export const clearAuthFromStorage = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}
