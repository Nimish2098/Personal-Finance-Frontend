import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("light")

    useEffect(() => {
        // Check local storage or system preference
        const storedTheme = localStorage.getItem("theme")
        if (storedTheme) {
            setTheme(storedTheme)
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            // Optional: default to system preference if desired, but user asked not to change day mode default.
            // Let's stick to 'light' default unless explicitly stored.
            setTheme("light")
        }
    }, [])

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(theme)
        localStorage.setItem("theme", theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"))
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)
