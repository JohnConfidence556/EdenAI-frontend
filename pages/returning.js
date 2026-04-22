// pages/returning.js
// Returning member login page
// Only needs phone number to identify the user

import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Navbar from "../components/Navbar"

export default function ReturningPage() {

  // ============================================
  // STATE
  // ============================================

  // The phone number the user types
  const [phone, setPhone] = useState("")

  // Loading state while we look up the user
  const [isLoading, setIsLoading] = useState(false)

  // Error message if phone not found
  const [error, setError] = useState("")

  // Success state — stores the user's name when found
  // null means not found yet
  // "Chidi" means we found them and their name is Chidi
  const [foundUser, setFoundUser] = useState(null)

  const router = useRouter()

  // ============================================
  // HANDLE SUBMIT
  // ============================================

  async function handleSubmit(e) {
    e.preventDefault()

    // Basic validation
    if (!phone) {
      setError("Please enter your phone number 🙏")
      return
    }

    const phoneDigits = phone.replace(/\D/g, "")
    if (phoneDigits.length < 10) {
      setError("Please enter a valid phone number")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      // For now we check localStorage
      // Later this will check our Supabase database
      // Replace the localStorage check with:
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      })
      const data = await response.json()
      if (data.found) {
        localStorage.setItem("shepherdName", data.name)
        localStorage.setItem("shepherdPhone", phone)
        setFoundUser(data.name)
      } else {
        setError("We don't recognize this number. Are you new here?")
      }

    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // ============================================
  // RENDER

    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-shepherd-dark">
      <Navbar />

      <div className="flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">

          {/* HEADER */}
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">👋</div>
            <h1 className="text-3xl font-bold text-shepherd-text mb-2">
              Welcome back
            </h1>
            <p className="text-shepherd-muted">
              Drop your phone number and we'll pick up right where you left off
            </p>
          </div>

          {/* SUCCESS STATE */}
          {/* Shows INSTEAD of the form when user is found */}
          {/* foundUser is null until we find them */}
          {foundUser ? (
            <div className="bg-shepherd-card border border-shepherd-border rounded-2xl p-8 text-center">

              {/* Animated checkmark */}
              <div className="text-6xl mb-4">✅</div>

              <h2 className="text-2xl font-bold text-shepherd-text mb-2">
                Hey {foundUser}! 🙌
              </h2>

              <p className="text-shepherd-muted mb-4">
                Good to see you again. Taking you to your chat...
              </p>

              {/* Simple loading dots animation */}
              {/* animate-pulse makes it fade in and out */}
              <div className="flex justify-center gap-2">
                <div className="w-2 h-2 bg-shepherd-purple rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-shepherd-purple rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-shepherd-purple rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              </div>

            </div>

          ) : (

            /* FORM STATE */
            /* Shows when foundUser is null (default) */
            <form
              onSubmit={handleSubmit}
              className="bg-shepherd-card border border-shepherd-border rounded-2xl p-8 space-y-6"
            >

              {/* PHONE FIELD */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-shepherd-text font-medium mb-2"
                >
                  Your phone number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="e.g. 08012345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-shepherd-dark border border-shepherd-border rounded-xl px-4 py-3 text-shepherd-text placeholder-shepherd-muted focus:outline-none focus:border-shepherd-purple transition-colors duration-200"
                />
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                  {error}

                  {/* If not found show a link to register */}
                  {/* error.includes checks if the error message */}
                  {/* contains a specific string */}
                  {error.includes("new here") && (
                    <span>
                      {" "}
                      <Link
                        href="/welcome"
                        className="underline hover:text-red-300"
                      >
                        Register here →
                      </Link>
                    </span>
                  )}
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={!phone || isLoading}
                className="w-full bg-shepherd-purple hover:bg-shepherd-purpleLight disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-lg transition-colors duration-200"
              >
                {isLoading ? "Checking..." : "Continue →"}
              </button>

              {/* NEW MEMBER LINK */}
              <p className="text-center text-shepherd-muted text-sm">
                First time here?{" "}
                <Link
                  href="/welcome"
                  className="text-shepherd-purple hover:text-shepherd-purpleLight transition-colors duration-200"
                >
                  Join Shepherd
                </Link>
              </p>

            </form>
          )}

        </div>
      </div>
    </div>
  )
}