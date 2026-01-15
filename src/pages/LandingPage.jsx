import { Link } from "react-router-dom"
import Button from "../components/Button"

export default function LandingPage() {
  return (
    <div
        style={{
          minHeight: "100vh",
          width: "100%",
          background: "#050b14",
          color: "#f8fafc",
        }}
      >
        {/* Navigation */}
        <nav
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            borderBottom: "1px solid #1e293b",
            padding: "16px 0",
            marginBottom: "40px",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#00f3ff" }}>
                FinTrack
              </div>
              <div style={{ display: "flex", gap: "16px" }}>
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
        <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              marginBottom: "16px",
              color: "#f8fafc",
            }}
          >
            Track. Analyze.{" "}
            <span style={{ color: "#00f3ff" }}>Save smarter.</span>
          </h1>
          <p
            style={{
              fontSize: "20px",
              marginBottom: "32px",
              maxWidth: "672px",
              margin: "0 auto 32px",
              color: "#94a3b8",
            }}
          >
            Take control of your finances with intelligent tracking, powerful
            analytics, and secure management all in one place.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            <Link to="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Login
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section style={{ padding: "80px 24px", backgroundColor: "rgba(5, 11, 20, 0.5)" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "48px",
                color: "#f8fafc",
              }}
            >
              Powerful Features
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "32px",
              }}
            >
              {[
                {
                  title: "Dashboard",
                  description:
                    "Get a complete overview of your financial health with real-time insights",
                  icon: "📊",
                },
                {
                  title: "Insights",
                  description:
                    "Analyze your spending patterns and identify opportunities to save",
                  icon: "💡",
                },
                {
                  title: "Security",
                  description:
                    "Your data is protected with enterprise-grade security standards",
                  icon: "🔒",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "8px",
                    padding: "24px",
                  }}
                >
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>{feature.icon}</div>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      marginBottom: "8px",
                      color: "#f8fafc",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p style={{ color: "#94a3b8" }}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
  )
}
