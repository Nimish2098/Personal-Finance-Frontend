"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  try {
    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")

    if (savedToken) {
      setToken(savedToken)
    }

    if (savedUser && savedUser !== "undefined") {
      setUser(JSON.parse(savedUser))
    }
  } catch (err) {
    console.error("Invalid auth data in localStorage, clearing it", err)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  } finally {
    setLoading(false)
  }
}, [])



  const login = (userData, authToken) => {
  setUser(userData)
  setToken(authToken)

  localStorage.setItem("token", authToken)
  localStorage.setItem("user", JSON.stringify(userData))
}



  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")

  }

  return <AuthContext.Provider value={{ user, token, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
