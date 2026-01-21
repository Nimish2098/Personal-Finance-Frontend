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
  const [showPassword, setShowPassword] = useState(false)

  const validatePassword = (pwd) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(pwd)
    const hasLowerCase = /[a-z]/.test(pwd)
    const hasNumber = /[0-9]/.test(pwd)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)

    if (pwd.length < minLength) return "Password must be at least 8 characters long"
    if (!hasUpperCase) return "Password must contain at least one uppercase letter"
    if (!hasLowerCase) return "Password must contain at least one lowercase letter"
    if (!hasNumber) return "Password must contain at least one number"
    if (!hasSpecialChar) return "Password must contain at least one special character"
    
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

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
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <div className="text-xs text-[var(--color-text-secondary)] space-y-1 ml-1">
            <p>Password requirements:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li className={password.length >= 8 ? "text-green-500" : ""}>At least 8 characters</li>
              <li className={/[A-Z]/.test(password) ? "text-green-500" : ""}>One uppercase letter</li>
              <li className={/[a-z]/.test(password) ? "text-green-500" : ""}>One lowercase letter</li>
              <li className={/[0-9]/.test(password) ? "text-green-500" : ""}>One number</li>
              <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-green-500" : ""}>One special character</li>
            </ul>
          </div>
          <Button type="submit" disabled={loading} className="w-full mt-6">
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
