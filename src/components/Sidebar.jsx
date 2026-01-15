"use client"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { LayoutDashboard, Wallet, Layers, ArrowLeftRight, LogOut, Hexagon } from "lucide-react"

export default function Sidebar() {
    const navigate = useNavigate()
    const location = useLocation()
    const { logout } = useAuth()

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    const navLinks = [
        { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { path: "/accounts", label: "Accounts", icon: Wallet },
        { path: "/categories", label: "Categories", icon: Layers },
        { path: "/transactions", label: "Transactions", icon: ArrowLeftRight },
        { path: "/budgets", label: "Budgets", icon: Target },
    ]

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col border-r border-white/10 bg-[var(--color-bg-primary)]/80 backdrop-blur-md shadow-[4px_0_24px_-4px_rgba(0,0,0,0.5)] z-50">
            {/* Header / Logo */}
            <div className="h-16 flex items-center px-6 border-b border-white/5 bg-gradient-to-r from-transparent to-[var(--color-bg-secondary)] relative overflow-hidden">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 p-1">
                    <div className="w-2 h-2 bg-[var(--color-primary)] opacity-50"></div>
                </div>
                <Hexagon className="w-6 h-6 text-[var(--color-primary)] mr-3 animate-pulse-slow" />
                <span className="text-xl font-bold tracking-wider text-white uppercase" style={{ textShadow: "0 0 10px var(--color-primary)" }}>
                    FinTrack
                </span>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {navLinks.map((link) => {
                    const isActive = location.pathname === link.path
                    const Icon = link.icon

                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`group flex items-center px-3 py-3 rounded-r transition-all duration-300 relative overflow-hidden ${isActive
                                    ? "text-[var(--color-primary)] bg-white/5 border-l-2 border-[var(--color-primary)]"
                                    : "text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5 border-l-2 border-transparent hover:border-white/20"
                                }`}
                        >
                            {/* Active glow background */}
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/10 to-transparent pointer-events-none" />
                            )}

                            <Icon className={`w-5 h-5 mr-3 transition-transform duration-300 ${isActive ? "scale-110 drop-shadow-[0_0_5px_var(--color-primary)]" : "group-hover:scale-110"}`} />
                            <span className={`font-medium tracking-wide ${isActive ? "text-shadow-neon" : ""}`}>
                                {link.label}
                            </span>

                            {/* Tech-decal on hover */}
                            <div className={`absolute right-2 w-1 h-1 bg-[var(--color-primary)] rounded-full opacity-0 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'group-hover:opacity-100'}`} />
                        </Link>
                    )
                })}
            </div>

            {/* Footer / User Info */}
            <div className="p-4 border-t border-white/5 bg-[var(--color-bg-secondary)]/30">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-[var(--color-text-muted)] font-mono uppercase">System Online</div>
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)] animate-pulse"></div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center px-4 py-2 rounded border border-[var(--color-error)]/30 text-[var(--color-error)] text-sm font-medium hover:bg-[var(--color-error)] hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    DISCONNECT
                </button>
            </div>
        </aside>
    )
}
