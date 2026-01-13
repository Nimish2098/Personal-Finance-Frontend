import { Link } from "react-router-dom"
import Button from "../components/Button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-primary)] via-[var(--color-bg-secondary)] to-[var(--color-bg-primary)]">
      {/* Navigation */}
      <nav className="bg-[var(--color-bg-secondary)] bg-opacity-80 backdrop-blur-md border-b border-[var(--color-bg-tertiary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-[var(--color-primary)]">FinTrack</div>
            <div className="space-x-4">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--color-text-primary)] mb-4">
            Track. Analyze. <span className="text-[var(--color-primary)]">Save smarter.</span>
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto">
            Take control of your finances with intelligent tracking, powerful analytics, and secure management all in
            one place.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[var(--color-bg-primary)] bg-opacity-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-center text-[var(--color-text-primary)] mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Dashboard",
                description: "Get a complete overview of your financial health with real-time insights",
                icon: "📊",
              },
              {
                title: "Insights",
                description: "Analyze your spending patterns and identify opportunities to save",
                icon: "💡",
              },
              {
                title: "Security",
                description: "Your data is protected with enterprise-grade security standards",
                icon: "🔒",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-lg p-6 hover:border-[var(--color-primary)] transition-colors"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">{feature.title}</h3>
                <p className="text-[var(--color-text-secondary)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
