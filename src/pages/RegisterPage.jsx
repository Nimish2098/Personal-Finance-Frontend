"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { authService } from "../services/auth"
import Button from "../components/Button"
import Input from "../components/Input"
import Card from "../components/Card"

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const response = await authService.register(name, email, password)

      login(response.user, response.token)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6 text-center">Create Account</h1>

        {error && (
          <div className="bg-[var(--color-error)] bg-opacity-10 border border-[var(--color-error)] text-[var(--color-error)] px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>

        <p className="text-center text-[var(--color-text-secondary)] mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--color-primary)] hover:underline">
            Login
          </Link>
        </p>
      </Card>
    </div>
  )
}
