import { Construction } from "lucide-react"

export default function FeatureComingSoon({ title = "Coming Soon" }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
                <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Construction className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">{title}</h2>
                <p className="text-[var(--color-text-secondary)]">
                    This feature will be ready soon. We are working hard to bring you the best experience!
                </p>
            </div>
        </div>
    )
}
