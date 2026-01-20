import { useState } from "react"
import { Menu } from "lucide-react"
import Sidebar from "./Sidebar"

export default function Layout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Header/Trigger for Sidebar */}
            <div className="fixed top-0 left-0 p-4 z-40">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-[var(--color-text-primary)] transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            <main className="p-8 min-h-screen transition-all duration-300 ml-0 lg:ml-0 pt-20 lg:pt-8 w-full">
                <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
    )
}
