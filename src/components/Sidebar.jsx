"use client"
import { Link, useLocation } from "react-router-dom"
import {
    LayoutDashboard,
    TrendingUp,
    Target,
    FileText,
    Calendar,
    Settings,
    LogOut,
    X,
    Download,
    Wallet, // Imported Wallet icon
    Tag // Import Tag icon
} from "lucide-react"
import { transactionService } from "../services/transactions"

export default function Sidebar({ isOpen, onClose }) {
    const location = useLocation()

    const navLinks = [
        { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { path: "/accounts", label: "Accounts", icon: Wallet },
        { path: "/analytics", label: "Analytics", icon: TrendingUp },
        { path: "/categories", label: "Categories", icon: Tag }, // Add Categories link
        { path: "/budgets", label: "Budgets", icon: Target },
        { path: "/reports", label: "Reports", icon: FileText },
        { path: "/calendar", label: "Calendar View", icon: Calendar },
        { path: "/settings", label: "Settings", icon: Settings },
    ]

    const handleExportCSV = async () => {
        try {
            const blob = await transactionService.exportCSV()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", "transactions.csv")
            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)
        } catch (err) {
            console.error("Failed to export transactions", err)
        }
    }

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Drawer */}
            <aside
                className={`fixed top-0 left-0 h-full w-80 bg-[var(--color-bg-secondary)] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full border-r border-[var(--color-border)]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
                        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Menu</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-[var(--color-bg-tertiary)] rounded-lg text-[var(--color-text-secondary)] transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                        {/* Highlights: Blue button style for active */}
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path
                            const Icon = link.icon

                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={onClose}
                                    className={`flex items-center px-4 py-3.5 rounded-xl transition-all font-medium ${isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]"
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 mr-3 ${isActive ? "text-white" : "text-gray-500"}`} />
                                    {link.label}
                                </Link>
                            )
                        })}

                        <div className="my-6 border-t border-[var(--color-border)] mx-2" />

                        <div className="px-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                            Quick Actions
                        </div>

                        <button
                            onClick={handleExportCSV}
                            className="w-full flex items-center px-4 py-3 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors font-medium"
                        >
                            <Download className="w-5 h-5 mr-3 text-gray-500" />
                            Export Data
                        </button>
                    </nav>

                    {/* Footer / Pro Tip */}
                    <div className="p-4 border-t border-[var(--color-border)]">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
                            <h4 className="font-semibold text-[var(--color-text-primary)] mb-1">Pro Tip</h4>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                Set monthly budgets to track your spending goals and stay on target.
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}
