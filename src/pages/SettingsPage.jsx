"use client"

import { useState } from "react"
import { User, Mail, Lock, Trash2, AlertTriangle, Eye, EyeOff, Moon, Sun } from "lucide-react" // Added icons
import Button from "../components/Button"
import { useTheme } from "../context/ThemeContext"

export default function SettingsPage() {
    const { theme, toggleTheme } = useTheme()
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto text-[var(--color-text-primary)]">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Account Settings</h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Manage your account preferences and security</p>
                </div>
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-3 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                >
                    {theme === 'dark' ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-blue-600" />}
                </button>
            </div>

            {/* Username Section */}
            <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-sm border border-[var(--color-border)] p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                        <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Username</h2>
                        <p className="text-sm text-[var(--color-text-secondary)]">Change your display name</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">New Username</label>
                        <input
                            type="text"
                            placeholder="Enter new username"
                            className="w-full px-4 py-3 rounded-xl border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all outline-none"
                        />
                    </div>
                    <Button className="!rounded-xl">Save Changes</Button>
                </div>
            </div>

            {/* Email Section */}
            <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-sm border border-[var(--color-border)] p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl">
                        <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Email Address</h2>
                        <p className="text-sm text-[var(--color-text-secondary)]">Update your email for notifications</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">New Email</label>
                        <input
                            type="email"
                            placeholder="Enter new email address"
                            className="w-full px-4 py-3 rounded-xl border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 transition-all outline-none"
                        />
                    </div>
                    <Button className="!bg-purple-600 hover:!bg-purple-700 !shadow-purple-500/30 !rounded-xl text-white">Save Changes</Button>
                </div>
            </div>

            {/* Password Section */}
            <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-sm border border-[var(--color-border)] p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl">
                        <Lock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Password</h2>
                        <p className="text-sm text-[var(--color-text-secondary)]">Keep your account secure</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Current Password</label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="Enter current password"
                                className="w-full px-4 py-3 rounded-xl border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:border-amber-500 focus:ring-2 focus:ring-amber-100 dark:focus:ring-amber-900 transition-all outline-none pr-10"
                            />
                            <button
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                className="w-full px-4 py-3 rounded-xl border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:border-amber-500 focus:ring-2 focus:ring-amber-100 dark:focus:ring-amber-900 transition-all outline-none pr-10"
                            />
                            <button
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                className="w-full px-4 py-3 rounded-xl border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:border-amber-500 focus:ring-2 focus:ring-amber-100 dark:focus:ring-amber-900 transition-all outline-none pr-10"
                            />
                            <button
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <Button className="!bg-amber-600 hover:!bg-amber-700 !shadow-amber-500/30 !rounded-xl text-white">Save Changes</Button>
                </div>
            </div>

            {/* Delete Account Section */}
            <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-sm border border-red-100 p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl">
                        <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Delete Account</h2>
                        <p className="text-sm text-[var(--color-text-secondary)]">Permanently remove your account</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800 dark:text-red-300">
                            This action is permanent and cannot be undone. All your data will be deleted.
                        </p>
                    </div>
                    <Button variant="danger" className="!rounded-xl text-white">Delete My Account</Button>
                </div>
            </div>

            {/* Current Settings Summary */}
            <div className="bg-[var(--color-bg-tertiary)] rounded-2xl p-6">
                <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Current Settings</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex">
                        <span className="w-24 font-medium text-[var(--color-text-primary)]">Username:</span>
                        <span className="text-[var(--color-text-secondary)]">Not set</span>
                    </div>
                    <div className="flex">
                        <span className="w-24 font-medium text-[var(--color-text-primary)]">Email:</span>
                        <span className="text-[var(--color-text-secondary)]">Not set</span>
                    </div>
                    <div className="flex">
                        <span className="w-24 font-medium text-[var(--color-text-primary)]">Password:</span>
                        <span className="text-[var(--color-text-secondary)]">Not set</span>
                    </div>
                </div>
            </div>

        </div>
    )
}
