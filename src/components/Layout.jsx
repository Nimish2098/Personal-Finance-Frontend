import Sidebar from "./Sidebar"

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
            <Sidebar />
            <main className="ml-64 p-8 min-h-screen transition-all duration-300">
                <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>

            {/* Decorative Grid Overlay */}
            <div
                className="fixed inset-0 pointer-events-none z-[-1] opacity-20"
                style={{
                    backgroundImage: `linear-gradient(var(--color-bg-secondary) 1px, transparent 1px), linear-gradient(90deg, var(--color-bg-secondary) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />
        </div>
    )
}
