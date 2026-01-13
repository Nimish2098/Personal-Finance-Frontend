"use client"

import { createContext, useContext, type ReactNode, useState, useEffect } from "react"

interface AuthContextType {
  token: string | null
  user: any
  loading: boolean
  login: (userData: any, token: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if token exists in localStorage on mount
    const savedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (savedToken) {
      setToken(savedToken)
    }
    setLoading(false)
  }, [])

  const login = (userData: any, authToken: string) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem("token", authToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
